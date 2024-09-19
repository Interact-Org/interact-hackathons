import { SERVER_ERROR } from '@/config/errors';
import deleteHandler from '@/handlers/delete_handler';
import getHandler from '@/handlers/get_handler';
import postHandler from '@/handlers/post_handler';
import CreateTeam from '@/sections/teams/create_team';
import JoinTeam from '@/sections/teams/join_team';
import TeamView from '@/screens/participants/team_view';
import { userSelector } from '@/slices/userSlice';
import { HackathonTeam, HackathonTrack } from '@/types';
import Toaster from '@/utils/toaster';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { currentHackathonSelector } from '@/slices/hackathonSlice';
import { getHackathonRole } from '@/utils/funcs/hackathons';
import TeamOverviewAnalytics from '@/sections/analytics/team_overview';
import moment from 'moment';
import patchHandler from '@/handlers/patch_handler';
import BaseWrapper from '@/wrappers/base';

const Team = () => {
  const [team, setTeam] = useState<HackathonTeam | null>(null);
  const [tracks, setTracks] = useState<HackathonTrack[] | null>(null);
  const [clickedOnCreateTeam, setClickedOnCreateTeam] = useState(false);
  const [clickedOnJoinTeam, setClickedOnJoinTeam] = useState(false);
  const user = useSelector(userSelector);
  const hackathon = useSelector(currentHackathonSelector);

  const getTeam = async () => {
    const URL = `/hackathons/${hackathon.id}/participants/teams`;
    const res = await getHandler(URL);
    if (res.statusCode == 200) {
      setTeam(res.data.team);
    } else {
      if (res.data.message) Toaster.error(res.data.message);
      else Toaster.error(SERVER_ERROR);
    }
  };

  const getTracks = async () => {
    const URL = `/hackathons/tracks/${hackathon.id}`;
    const res = await getHandler(URL);
    if (res.statusCode == 200) {
      setTracks(res.data.tracks);
    } else {
      if (res.data.message) Toaster.error(res.data.message);
      else Toaster.error(SERVER_ERROR);
    }
  };

  useEffect(() => {
    if (!hackathon.id) window.location.replace(`/?redirect_url=${window.location.pathname}`);
    else {
      const role = getHackathonRole();
      if (role != 'participant') window.location.replace('/');
      else {
        const now = moment();
        if (hackathon.isEnded) window.location.replace('/participant/ended');
        else if (!now.isBetween(moment(hackathon.teamFormationStartTime), moment(hackathon.teamFormationEndTime))) {
          if (now.isAfter(hackathon.startTime)) window.location.replace('/participant/live');
          else window.location.replace('/');
        } else {
          getTeam();
          getTracks();
        }
      }
    }
  }, []);

  const handleCreateTeam = async (formData: any) => {
    const URL = `/hackathons/${hackathon.id}/participants/teams`;
    const res = await postHandler(URL, formData);
    if (res.statusCode == 201) {
      setTeam(res.data.team);
    } else {
      if (res.data.message) Toaster.error(res.data.message);
      else Toaster.error(SERVER_ERROR);
    }
  };

  const handleJoinTeam = async (formData: any) => {
    const URL = `/hackathons/${hackathon.id}/participants/teams/join`;
    const res = await postHandler(URL, formData);
    if (res.statusCode == 200) {
      setTeam(res.data.team);
    } else {
      if (res.data.message) Toaster.error(res.data.message);
      else Toaster.error(SERVER_ERROR);
    }
  };

  const handleDeleteTeam = async () => {
    const URL = `/hackathons/${hackathon.id}/participants/teams/${team?.id}`;
    const res = await deleteHandler(URL);
    if (res.statusCode == 204) {
      setTeam(null);
    } else {
      if (res.data.message) Toaster.error(res.data.message);
      else Toaster.error(SERVER_ERROR);
    }
  };

  const handleLeaveTeam = async () => {
    const URL = `/hackathons/${hackathon.id}/participants/teams/${team?.id}/leave`;
    const res = await deleteHandler(URL);
    if (res.statusCode == 200) {
      setTeam(prev => {
        if (prev)
          return {
            ...prev,
            membership: prev?.memberships.filter(m => m.userID != user.id),
          };
        return null;
      });
      setTeam(null);
    } else {
      if (res.data.message) Toaster.error(res.data.message);
      else Toaster.error(SERVER_ERROR);
    }
  };
  const handleUpdateTeam = async (formData: any) => {
    const URL = `/hackathons/${hackathon.id}/participants/teams/${team?.id}`;
    const res = await patchHandler(URL, formData);
    if (res.statusCode == 200) {
      Toaster.success('Team Data Updated Successfully');
    } else {
      if (res.data.message) Toaster.error(res.data.message);
      else Toaster.error(SERVER_ERROR);
    }
  };
  const handleKickMember = async (userID: string) => {
    const URL = `/hackathons/${hackathon.id}/participants/teams/${team?.id}/member/${userID}`;
    const res = await deleteHandler(URL);
    if (res.statusCode == 200) {
      setTeam(prev => {
        if (prev)
          return {
            ...prev,
            memberships: prev?.memberships.filter(m => m.userID != userID),
          };
        return null;
      });
    } else {
      if (res.data.message) Toaster.error(res.data.message);
      else Toaster.error(SERVER_ERROR);
    }
  };

  return (
    <BaseWrapper>
      <div className="w-full min-h-screen py-8 mt-4 md:p-12 flex flex-col md:justify-start gap-8 md:gap-16 font-primary p-8">
        <div className="w-full mx-auto flex flex-col md:flex-row gap-4 md:gap-8">
          <div className="w-full md:w-1/2 justify-center items-start flex-col gap-2">
            <div className="font-bold">
              <h4 className="w-fit gradient-text-3 text-5xl mb-2">Team {team ? team.title : 'Formation'}</h4>
            </div>
            <div className="w-fit text-lg md:text-4xl lg:text-8xl font-bold gradient-text-2">
              {team ? (
                <>
                  Team Formation <span className="text-black text-2xl">is Live!</span>
                </>
              ) : (
                <span className="text-3xl">Find, Create, and Join Teams Easily and Effortlessly.</span>
              )}
            </div>
            {team && (
              <div className="font-semibold mt-8 text-xl">
                The Team Code is{' '}
                <span
                  onClick={() => {
                    navigator.clipboard.writeText(team.token);
                    Toaster.success('Copied to Clipboard!');
                  }}
                  className="underline underline-offset-2 cursor-pointer"
                >
                  {team.token}
                </span>
              </div>
            )}
          </div>
          <div className="w-full md:w-1/2 flex gap-2 md:gap-4">
            <TeamOverviewAnalytics />
          </div>
        </div>
        {team ? (
          <TeamView
            team={team}
            onDeleteTeam={handleDeleteTeam}
            onUpdateTeam={handleUpdateTeam}
            onLeaveTeam={handleLeaveTeam}
            onKickMember={handleKickMember}
            tracks={tracks}
          />
        ) : (
          <div className="w-[95%] mx-auto mt-8 flex flex-col md:flex-row gap-4 md:gap-12">
            {clickedOnCreateTeam && tracks && tracks.length > 0 && (
              <CreateTeam setShow={setClickedOnCreateTeam} submitHandler={handleCreateTeam} hackathonID={hackathon.id} tracks={tracks} />
            )}
            {clickedOnJoinTeam && <JoinTeam setShow={setClickedOnJoinTeam} submitHandler={handleJoinTeam} />}

            <div
              onClick={() => setClickedOnCreateTeam(true)}
              className="w-full md:w-1/2 h-40 md:h-52 p-2 md:p-4 text-center gap-6 text-primary_text hover:ring-2 cursor-pointer bg-white rounded-md flex flex-col justify-center items-center"
            >
              <div className="text-2xl md:text-4xl font-semibold">Create Team</div>
              <div className="text-xs md:text-sm">
                Initiate brilliance! Create a team to transform your visionary ideas into actionable innovation
              </div>
            </div>
            <div
              onClick={() => setClickedOnJoinTeam(true)}
              className="w-full md:w-1/2 h-40 md:h-52 p-2 md:p-4 text-center gap-6 text-primary_text hover:ring-2 cursor-pointer bg-white rounded-md flex flex-col justify-center items-center"
            >
              <div className="text-2xl md:text-4xl font-semibold">Join Team</div>
              <div className="text-xs md:text-sm">
                Contribute to success! Join a team to merge your skills with theirs and drive innovative solutions.
              </div>
            </div>
          </div>
        )}
      </div>
    </BaseWrapper>
  );
};

export default Team;
