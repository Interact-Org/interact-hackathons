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
import { Plus } from 'lucide-react';
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
        if (!now.isBetween(moment(hackathon.teamFormationStartTime), moment(hackathon.teamFormationEndTime)))
          window.location.replace('/participant/live');
        else {
          getTeam();
          getTracks();
        }
      }
    }
  }, []);

  useEffect(() => {
    if (team) window.location.replace('/participant/live');
  }, [team]);

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
      <div className="w-full min-h-screen bg-[#E1F1FF] p-12 flex flex-col justify-center gap-16">
        <div className="w-full flex gap-8">
          <div className="w-2/5 flex-center flex-col gap-2">
            <div className="w-full text-7xl flex-center text-center flex-col font-bold">
              <h1
                style={{
                  background: '-webkit-linear-gradient(0deg, #607ee7,#478EE1)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Team
                <br />
                {team ? team.title : 'Formation'}
              </h1>
            </div>
            <div className="w-fit text-2xl text-center font-medium">
              {team ? 'Team Formation is Live!' : 'Find, Create, and Join Teams Easily and Effortlessly.'}
            </div>
            {team && (
              <div className="font-medium mt-2">
                The Team Code is <span className="underline underline-offset-2">{team.token}</span>
              </div>
            )}
          </div>
          <div className="w-3/5 flex gap-4">
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
          <div className="w-full flex-center gap-12">
            {clickedOnCreateTeam && tracks && tracks.length > 0 && (
              <CreateTeam setShow={setClickedOnCreateTeam} submitHandler={handleCreateTeam} hackathonID={hackathon.id} tracks={tracks} />
            )}
            {clickedOnJoinTeam && <JoinTeam setShow={setClickedOnJoinTeam} submitHandler={handleJoinTeam} />}

            <div
              onClick={() => setClickedOnCreateTeam(true)}
              className="w-90 h-52 p-4 text-center gap-6 text-primary_text hover:ring-2 cursor-pointer bg-white rounded-md flex-center flex-col"
            >
              <div className="text-4xl font-semibold">Create Team</div>
              <div className="text-sm">Initiate brilliance! Create a team to transform your visionary ideas into actionable innovation</div>
            </div>
            <div
              onClick={() => setClickedOnJoinTeam(true)}
              className="w-90 h-52 p-4 text-center gap-6 text-primary_text hover:ring-2 cursor-pointer bg-white rounded-md flex-center flex-col"
            >
              <div className="text-4xl font-semibold">Join Team</div>
              <div className="text-sm">Contribute to success! Join a team to merge your skills with theirs and drive innovative solutions.</div>
            </div>
            {/* <div className="w-90 h-60 p-4 text-center gap-6 text-white bg-[#a4cdfd] rounded-xl flex-center flex-col">
          <div className="text-4xl font-semibold">Explore Channels</div>
          <div className="text-lg">Need some inspiration? Explore channels to find resources, tips, or maybe even your next teammate</div>
        </div> */}
          </div>
        )}
      </div>
    </BaseWrapper>
  );
};

export default Team;
