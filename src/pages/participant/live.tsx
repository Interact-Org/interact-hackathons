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
import { ProjectDetails } from '@/sections/dashboard/project_details';

const Live = () => {
  const [team, setTeam] = useState<HackathonTeam | null>(null);
  const [currentRound, setCurrentRound] = useState<HackathonRound | null>(null);
  const [nextRound, setNextRound] = useState<HackathonRound | null>(null);
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  const hackathon = useSelector(currentHackathonSelector);

  const getCurrentRound = async () => {
    const URL = `/hackathons/${hackathon.id}/participants/round`;
    const res = await getHandler(URL);
    if (res.statusCode == 200) {
      if (!res.data.round) {
        window.location.replace('/participant/stage');
      }
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
          <div className="w-full min-h-base bg-[#E1F1FF] p-12 flex flex-col gap-10">
            <div className="w-full flex flex-col md:flex-row gap-8">
              <div className="w-full md:w-1/2 flex flex-col justify-between gap-2">
                <div className="w-full text-4xl md:text-6xl lg:text-10xl flex flex-col font-bold">
                  <div className="font-bold">
                    <h4 className="gradient-text-3 text-7xl mb-2">{team.title}</h4>
                  </div>
                  <div className="w-full h-full">
                    <div className="text-xl">Now Ongoing</div>
                    <div
                      style={{
                        background: '-webkit-linear-gradient(0deg, #607ee7,#478EE1)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                      }}
                      className="text-3xl md:text-4xl lg:text-8xl font-bold"
                    >
                      {currentRound ? `Round ${currentRound.index + 1}` : 'Break'}
                    </div>
                    <div className="text-2xl w-3/4 font-medium">
                      {currentRound
                        ? moment().isBetween(moment(currentRound.judgingStartTime), moment(currentRound.endTime))
                          ? 'Judging is Live!'
                          : moment(currentRound.judgingStartTime).isAfter(moment()) &&
                            `Judging Starts ${moment(currentRound.judgingStartTime).fromNow()}.`
                        : nextRound
                        ? ` Round ${nextRound.index + 1} Starts ${moment(nextRound.startTime).fromNow()}.`
                        : 'All rounds are over.'}
                    </div>
                  </div>
                </div>

                <div className="w-fit flex flex-row items-start justify-start md:gap-4 rounded-lg overflow-hidden md:rounded-none md:overflow-auto">
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
                    <NewProject setTeam={setTeam} team={team} />
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
