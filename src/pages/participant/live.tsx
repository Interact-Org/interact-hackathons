import { SERVER_ERROR } from '@/config/errors';
import getHandler from '@/handlers/get_handler';
import NewProject from '@/sections/projects/new_project';
import TeamView from '@/screens/participants/team_view';
import { HackathonRound, HackathonTeam } from '@/types';
import Toaster from '@/utils/toaster';
import React, { useEffect, useMemo, useState } from 'react';
import Tasks from '@/screens/participants/tasks';
import { currentHackathonSelector } from '@/slices/hackathonSlice';
import { useSelector } from 'react-redux';
import { getHackathonRole } from '@/utils/funcs/hackathons';
import BaseWrapper from '@/wrappers/base';
import moment from 'moment';
import ParticipantLiveRoundAnalytics from '@/sections/analytics/participant_live_round_analytics';
import TeamEliminated from '@/screens/participants/team_eliminated';
import ProjectView from '@/screens/participants/view_project';
import Loader from '@/components/common/loader';

const Live = () => {
  const [team, setTeam] = useState<HackathonTeam | null>(null);
  const [currentRound, setCurrentRound] = useState<HackathonRound | null>(null);
  const [nextRound, setNextRound] = useState<HackathonRound | null>(null);
  const [index, setIndex] = useState(0);
  const [clickedOnProject, setClickedOnProject] = useState(false);
  const [loading, setLoading] = useState(true);

  const hackathon = useSelector(currentHackathonSelector);

  const getCurrentRound = async () => {
    const URL = `/hackathons/${hackathon.id}/participants/round`;
    const res = await getHandler(URL);
    if (res.statusCode == 200) {
      setCurrentRound(res.data.round);
      setNextRound(res.data.nextRound);
    } else {
      Toaster.error(res.data.message || SERVER_ERROR);
    }
  };

  const getTeam = async () => {
    const URL = `/hackathons/${hackathon.id}/participants/teams`;
    const res = await getHandler(URL);
    if (res.statusCode == 200) {
      const team = res.data.team;
      if (!team) Toaster.error('Team Not Found');
      else setTeam(team);
      setLoading(false);
    } else {
      Toaster.error(res.data.message || SERVER_ERROR);
    }
  };

  const project = useMemo(() => team?.project, [team]);

  useEffect(() => {
    if (!hackathon.id) window.location.replace(`/?redirect_url=${window.location.pathname}`);
    else {
      const role = getHackathonRole();
      if (role != 'participant') window.location.replace('/?action=sync');
      else {
        if (hackathon.isEnded) window.location.replace('/participant/ended');
        else if (moment().isBetween(moment(hackathon.teamFormationStartTime), moment(hackathon.teamFormationEndTime)))
          window.location.replace('/participant/team');
        else {
          getTeam();
          getCurrentRound();
        }
      }
    }
  }, []);

  useEffect(() => {
    const tab = new URLSearchParams(window.location.search).get('tab');
    if (tab && (tab == 'repositories' || tab == 'figma')) setIndex(1);
  }, []);

  return (
    <BaseWrapper>
      {team ? (
        team.isEliminated && currentRound && !moment().isBetween(currentRound?.judgingStartTime, currentRound?.endTime) ? (
          <TeamEliminated team={team} />
        ) : (
          <div className="w-full min-h-base bg-[#E1F1FF] p-6  flex flex-col gap-10">
            <div className="w-full flex flex-col md:flex-row gap-8">
              <div className="w-full md:w-1/2 flex flex-col gap-2">
                <div className="w-full text-4xl md:text-6xl lg:text-10xl flex flex-col font-bold">
                  <div className="font-bold">
                    <h4 className="gradient-text-3 text-7xl mb-2">Team {team ? team.title : 'Formation'}</h4>
                  </div>
                  {currentRound ? (
                    <div className="w-fit flex flex-col">
                      <div className="w-fit text-xl md:text-4xl lg:text-9xl font-bold gradient-text-2">
                        Round {currentRound.index + 1} <span className="text-black text-4xl max-md:text-xl">is Live!</span>
                      </div>
                      <div className="w-fit font-semibold gradient-text-2 text-2xl mt-4">
                        {moment().isBetween(moment(currentRound.judgingStartTime), moment(currentRound.endTime)) ? (
                          <div className="w-full">Judging is Live!</div>
                        ) : (
                          moment(currentRound.judgingStartTime).isAfter(moment()) && (
                            <>Next Judging Round Starts {moment(currentRound.judgingStartTime).fromNow()}.</>
                          )
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="w-fit flex flex-col">
                      <div className="w-fit text-lg md:text-4xl lg:text-8xl font-bold gradient-text-2">All Rounds have ended.</div>
                    </div>
                  )}
                </div>

                <div className="w-fit flex flex-row items-start justify-start gap-0 md:gap-6 md:mt-12 rounded-lg overflow-hidden md:rounded-none md:overflow-auto mt-6">
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
              {team.id && (
                <div className="w-full md:w-1/2">
                  <ParticipantLiveRoundAnalytics teamID={team.id} currentRound={currentRound} />
                </div>
              )}
            </div>
            <div className="w-full">
              {index == 0 && <TeamView team={team} actions={false} />}
              {index == 1 && (
                <>
                  {team?.projectID && project ? (
                    <ProjectView project={project} team={team} setTeam={setTeam} />
                  ) : (
                    <>
                      <div className="w-full max-w-md mx-auto bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden transform transition-transform duration-300 hover:scale-105">
                        <div
                          onClick={() => setClickedOnProject(true)}
                          className="py-6 px-8 text-xl md:text-3xl font-semibold text-center cursor-pointer bg-gradient-to-r from-blue-500 to-purple-500 text-white"
                        >
                          Add your Project and Get Started!
                        </div>
                        <div className="p-4 text-2xl text-center text-gray-700">
                          Click to start your project journey and collaborate with your team.
                        </div>
                      </div>
                      {clickedOnProject && <NewProject setShow={setClickedOnProject} setTeam={setTeam} team={team} />}
                    </>
                  )}
                </>
              )}
              {index == 2 && team.projectID && <Tasks slug={project?.slug || ''} />}
            </div>
          </div>
        )
      ) : loading ? (
        <div className="w-full h-base flex-center">
          <Loader />
        </div>
      ) : (
        <div className="text-4xl font-medium mx-auto py-16 text-primary_danger">Team not registered for this Hackathon.</div>
      )}
    </BaseWrapper>
  );
};

export default Live;
