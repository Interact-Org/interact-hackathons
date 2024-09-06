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
    const URL = `/hackathons/${hid}/teams/me`;
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
    const URL = `/hackathons/${hid}/teams`;
    const res = await postHandler(URL, formData);
    if (res.statusCode == 201) {
      setTeam(res.data.team);
    } else {
      if (res.data.message) Toaster.error(res.data.message);
      else Toaster.error(SERVER_ERROR);
    }
  };

  const handleJoinTeam = async (formData: any) => {
    const URL = `/hackathons/${hid}/teams/join`;
    const res = await postHandler(URL, formData);
    if (res.statusCode == 200) {
      setTeam(res.data.team);
    } else {
      if (res.data.message) Toaster.error(res.data.message);
      else Toaster.error(SERVER_ERROR);
    }
  };

  const handleDeleteTeam = async () => {
    const URL = `/hackathons/${hid}/teams/${team?.id}`;
    const res = await deleteHandler(URL);
    if (res.statusCode == 204) {
      setTeam(null);
    } else {
      if (res.data.message) Toaster.error(res.data.message);
      else Toaster.error(SERVER_ERROR);
    }
  };

  const handleLeaveTeam = async () => {
    const URL = `/hackathons/${hid}/teams/${team?.id}/leave`;
    const res = await deleteHandler(URL);
    if (res.statusCode == 200) {
      setTeam(null);
    } else {
      if (res.data.message) Toaster.error(res.data.message);
      else Toaster.error(SERVER_ERROR);
    }
  };

  return (
    <div>
      {team ? (
        <TeamView team={team} onDeleteTeam={handleDeleteTeam} onLeaveTeam={handleLeaveTeam} />
      ) : (
        <div className="w-full flex-center gap-12">
          {clickedOnCreateTeam && <CreateTeam setShow={setClickedOnCreateTeam} submitHandler={handleCreateTeam} />}
          {clickedOnJoinTeam && <JoinTeam setShow={setClickedOnJoinTeam} submitHandler={handleJoinTeam} />}

          <div>Create Team</div>
          <div>Join Team</div>
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
