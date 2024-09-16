import { SERVER_ERROR } from '@/config/errors';
import getHandler from '@/handlers/get_handler';
import EditProject from '@/sections/projects/edit_project';
import NewProject from '@/sections/projects/new_project';
import TeamView from '@/screens/participants/team_view';
import { HackathonRound, HackathonTeam } from '@/types';
import { initialHackathonTeam } from '@/types/initials';
import Toaster from '@/utils/toaster';
import { Pen } from '@phosphor-icons/react';
import React, { useEffect, useMemo, useState } from 'react';
import Tasks from '@/screens/participants/tasks';
import { currentHackathonSelector } from '@/slices/hackathonSlice';
import { useSelector } from 'react-redux';
import { getHackathonRole } from '@/utils/funcs/hackathons';
import BaseWrapper from '@/wrappers/base';
import getIcon from '@/utils/funcs/get_icon';
import getDomainName from '@/utils/funcs/get_domain_name';
import Link from 'next/link';
import moment from 'moment';
import ParticipantLiveRoundAnalytics from '@/sections/analytics/participant_live_round_analytics';

const Live = () => {
  const [team, setTeam] = useState<HackathonTeam>(initialHackathonTeam);
  const [currentRound, setCurrentRound] = useState<HackathonRound | null>(null);
  const [nextRound, setNextRound] = useState<HackathonRound | null>(null);
  const [index, setIndex] = useState(0);
  const [clickedOnProject, setClickedOnProject] = useState(false);

  const hackathon = useSelector(currentHackathonSelector);

  const getCurrentRound = async () => {
    const URL = `/hackathons/${hackathon.id}/participants/round`;
    const res = await getHandler(URL);
    if (res.statusCode == 200) {
      setCurrentRound(res.data.round);
      setNextRound(res.data.nextRound);
    } else {
      if (res.data.message) Toaster.error(res.data.message);
      else Toaster.error(SERVER_ERROR);
    }
  };

  const getTeam = async () => {
    const URL = `/hackathons/${hackathon.id}/participants/teams`;
    const res = await getHandler(URL);
    if (res.statusCode == 200) {
      const team = res.data.team;
      if (!team) Toaster.error('Team Not Found');
      else setTeam(team);
    } else {
      if (res.data.message) Toaster.error(res.data.message);
      else Toaster.error(SERVER_ERROR);
    }
  };

  const project = useMemo(() => team?.project, [team]);

  useEffect(() => {
    if (!hackathon.id) window.location.replace(`/?redirect_url=${window.location.pathname}`);
    else {
      const role = getHackathonRole();
      if (role != 'participant') window.location.replace('/');
      else {
        if (moment().isBetween(moment(hackathon.teamFormationStartTime), moment(hackathon.teamFormationEndTime)))
          window.location.replace('/participant/team');
        else {
          getTeam();
          getCurrentRound();
        }
      }
    }
  }, []);

  return (
    <BaseWrapper>
      <div className="w-full min-h-screen bg-[#E1F1FF] p-6 md:p-12 flex flex-col gap-10 md:gap-16">
        <div className="w-full flex gap-8">
          <div className="w-full flex-center flex-col gap-2">
            <div className="w-full text-4xl md:text-6xl lg:text-8xl flex-center flex-col font-bold">
              <div className="text-[#607EE7]">Team</div>
              <div className="text-[#4B9EFF]">{team ? team.title : 'Formation'}</div>
            </div>
            {currentRound && (
              <div className="w-fit mx-auto flex-center flex-col">
                <div className="w-fit text-xl md:text-2xl font-medium">Round {currentRound.index + 1} is Live!</div>
                <div className="w-fit text-2xl">
                  {moment().isBetween(moment(currentRound.judgingStartTime), moment(currentRound.judgingEndTime)) ? (
                    <div className="w-full text-base">Judging is Live! Ends {moment(currentRound.judgingEndTime).fromNow()}.</div>
                  ) : (
                    moment(currentRound.judgingStartTime).isAfter(moment()) && (
                      <>Next Judging Round Starts {moment(currentRound.judgingStartTime).fromNow()}.</>
                    )
                  )}
                </div>
              </div>
            )}

            <div className="w-fit flex-center gap-0 md:gap-6 mt-4 md:mt-8 rounded-lg overflow-hidden md:rounded-none md:overflow-auto">
              {(team.projectID ? ['Team', 'Project', 'Tasks'] : ['Team', 'Project']).map((tab, i) => (
                <div
                  key={i}
                  onClick={() => setIndex(i)}
                  className={`${
                    index == i ? 'bg-[#4B9EFF] text-white ' : 'bg-white text-primary_black'
                  } text-sm md:text-lg md:rounded-3xl py-2 px-10 font-medium cursor-pointer transition-ease-300`}
                >
                  {tab}
                </div>
              ))}
            </div>
          </div>
          {team.id && <ParticipantLiveRoundAnalytics teamID={team.id} currentRound={currentRound} nextRound={nextRound} />}
        </div>
        {index == 0 && <TeamView team={team} />}
        {index == 1 && (
          <>
            {team?.projectID && project ? (
              <div className="w-full relative bg-gradient-to-b from-[#F6F7F9] to-[#D8EAFF] flex flex-col gap-2 md:gap-4 rounded-xl text-primary_black p-4 md:8">
                <Pen onClick={() => setClickedOnProject(true)} className="absolute top-4 right-4 cursor-pointer" size={24} />
                {clickedOnProject && <EditProject setShow={setClickedOnProject} projectToEdit={project} setTeam={setTeam} />}
                <div className="text-2xl md:text-3xl lg:text-5xl font-semibold">{project.title}</div>
                <div className="w-fit flex-center gap-3 md:gap-4">
                  {project.tags?.map(tag => (
                    <div key={tag} className="bg-white rounded-2xl py-1 md:py-2 px-4 text-sm">
                      {tag}
                    </div>
                  ))}
                </div>
                <div className="text-sm md:text-base lg:text-lg">{project.description}</div>
                <div className="w-fit flex-center gap-4">
                  {project.links && project.links.length > 0 && (
                    <div className="w-full flex flex-col gap-2">
                      <div className="text-sm ml-1 font-medium uppercase text-gray-500">Links</div>
                      <div
                        className={`w-full h-fit flex flex-wrap items-center ${project.links.length == 1 ? 'justify-start' : 'justify-center'} gap-4`}
                      >
                        {project.links.map((link, index) => {
                          return (
                            <Link
                              href={link}
                              target="_blank"
                              key={index}
                              className="w-fit h-8 py-2 px-3 border-[1px] border-primary_btn  dark:border-dark_primary_btn rounded-lg flex items-center gap-2"
                            >
                              {getIcon(getDomainName(link), 24)}
                              <div className="capitalize">{getDomainName(link)}</div>
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <>
                <div
                  onClick={() => setClickedOnProject(true)}
                  className="w-fit bg-white py-4 px-8 mx-auto text-xl md:text-3xl font-medium cursor-pointer hover:scale-105 transition-ease-300"
                >
                  Add your Project and Get Started!
                </div>
                {clickedOnProject && <NewProject setShow={setClickedOnProject} setTeam={setTeam} team={team} />}
              </>
            )}
          </>
        )}
        {index == 2 && <Tasks slug={project?.slug || ''} />}
      </div>
    </BaseWrapper>
  );
};

export default Live;
