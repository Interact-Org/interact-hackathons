import { SERVER_ERROR } from '@/config/errors';
import deleteHandler from '@/handlers/delete_handler';
import getHandler from '@/handlers/get_handler';
import postHandler from '@/handlers/post_handler';
import CreateTeam from '@/sections/teams/create_team';
import JoinTeam from '@/sections/teams/join_team';
import TeamView from '@/sections/teams/team_view';
import { HackathonTeam } from '@/types';
import Toaster from '@/utils/toaster';
import { GetServerSidePropsContext } from 'next';
import React, { useEffect, useState } from 'react';

interface Props {
  hid: string;
}

const Team = ({ hid }: Props) => {
  const [team, setTeam] = useState<HackathonTeam | null>(null);
  const [clickedOnCreateTeam, setClickedOnCreateTeam] = useState(false);
  const [clickedOnJoinTeam, setClickedOnJoinTeam] = useState(false);

  const getTeam = async () => {
    const URL = `/hackathons/${hid}/participants/teams`;
    const res = await getHandler(URL);
    if (res.statusCode == 200) {
      setTeam(res.data.team);
    } else {
      if (res.data.message) Toaster.error(res.data.message);
      else Toaster.error(SERVER_ERROR);
    }
  };

  useEffect(() => {
    getTeam();
  }, []);

  const handleCreateTeam = async (formData: any) => {
    const URL = `/hackathons/${hid}/participants/teams`;
    const res = await postHandler(URL, formData);
    if (res.statusCode == 201) {
      setTeam(res.data.team);
    } else {
      if (res.data.message) Toaster.error(res.data.message);
      else Toaster.error(SERVER_ERROR);
    }
  };

  const handleJoinTeam = async (formData: any) => {
    const URL = `/hackathons/${hid}/participants/teams/join`;
    const res = await postHandler(URL, formData);
    if (res.statusCode == 200) {
      setTeam(res.data.team);
    } else {
      if (res.data.message) Toaster.error(res.data.message);
      else Toaster.error(SERVER_ERROR);
    }
  };

  const handleDeleteTeam = async () => {
    const URL = `/hackathons/${hid}/participants/teams/${team?.id}`;
    const res = await deleteHandler(URL);
    if (res.statusCode == 204) {
      setTeam(null);
    } else {
      if (res.data.message) Toaster.error(res.data.message);
      else Toaster.error(SERVER_ERROR);
    }
  };

  const handleLeaveTeam = async () => {
    const URL = `/hackathons/${hid}/participants/teams/${team?.id}/leave`;
    const res = await deleteHandler(URL);
    if (res.statusCode == 200) {
      setTeam(null);
    } else {
      if (res.data.message) Toaster.error(res.data.message);
      else Toaster.error(SERVER_ERROR);
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#E1F1FF] p-12 flex flex-col justify-center gap-16">
      <div className="w-full flex gap-8">
        <div className="w-2/5 flex-center flex-col gap-2">
          <div className="w-full text-8xl flex-center flex-col font-bold">
            <div className="text-[#607EE7]">Team</div>
            <div className="text-[#4B9EFF]">Formation</div>
          </div>
          <div className="w-fit text-2xl font-medium">Find, Create, and Join Teams Easily and Effortlessly.</div>
        </div>
        <div className="w-3/5 flex gap-4">
          <div className="w-1/2 flex flex-col gap-4">
            <div className="w-full h-56 bg-white rounded-xl"></div>
            <div className="w-full h-28 bg-white rounded-xl"></div>
          </div>
          <div className="w-1/2 flex flex-col gap-4">
            <div className="w-full h-56 bg-white rounded-xl"></div>
            <div className="w-full flex gap-4">
              <div className="w-1/2 h-28 bg-white rounded-xl"></div>
              <div className="w-1/2 h-28 bg-white rounded-xl"></div>
            </div>
          </div>
        </div>
      </div>
      {team ? (
        <TeamView team={team} onDeleteTeam={handleDeleteTeam} onLeaveTeam={handleLeaveTeam} />
      ) : (
        <div className="w-full flex-center gap-12">
          {clickedOnCreateTeam && <CreateTeam setShow={setClickedOnCreateTeam} submitHandler={handleCreateTeam} hackathonID={hid} />}
          {clickedOnJoinTeam && <JoinTeam setShow={setClickedOnJoinTeam} submitHandler={handleJoinTeam} />}

          <div
            onClick={() => setClickedOnCreateTeam(true)}
            className="w-90 h-60 p-4 text-center gap-6 text-white bg-[#a4cdfd] rounded-xl flex-center flex-col"
          >
            <div className="text-4xl font-semibold">Create Team</div>
            <div className="text-lg">Initiate brilliance! Create a team to transform your visionary ideas into actionable innovation</div>
          </div>
          <div
            onClick={() => setClickedOnJoinTeam(true)}
            className="w-90 h-60 p-4 text-center gap-6 text-white bg-[#a4cdfd] rounded-xl flex-center flex-col"
          >
            <div className="text-4xl font-semibold">Join Team</div>
            <div className="text-lg">Contribute to success! Join a team to merge your skills with theirs and drive innovative solutions.</div>
          </div>
          <div className="w-90 h-60 p-4 text-center gap-6 text-white bg-[#a4cdfd] rounded-xl flex-center flex-col">
            <div className="text-4xl font-semibold">Explore Channels</div>
            <div className="text-lg">Need some inspiration? Explore channels to find resources, tips, or maybe even your next teammate</div>
          </div>
        </div>
      )}
    </div>
  );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { query } = context;
  const hid = query.hid;

  if (!hid)
    return {
      redirect: {
        permanent: true,
        destination: '/',
      },
      props: { hid },
    };
  return {
    props: { hid },
  };
}

export default Team;
