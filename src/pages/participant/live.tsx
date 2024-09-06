import { SERVER_ERROR } from '@/config/errors';
import getHandler from '@/handlers/get_handler';
import EditProject from '@/sections/projects/edit_project';
import NewProject from '@/sections/projects/new_project';
import { HackathonTeam } from '@/types';
import { initialHackathonTeam } from '@/types/initials';
import Toaster from '@/utils/toaster';
import { GetServerSidePropsContext } from 'next';
import React, { useEffect, useState } from 'react';

interface Props {
  hid: string;
}

const Live = ({ hid }: Props) => {
  const [team, setTeam] = useState<HackathonTeam>(initialHackathonTeam);
  const [clickedOnProject, setClickedOnProject] = useState(false);

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

  return (
    <div>
      <>Team Details</>
      <div>
        {team?.projectID && team.project && clickedOnProject ? (
          <EditProject setShow={setClickedOnProject} projectToEdit={team.project} setTeam={setTeam} />
        ) : (
          <NewProject setShow={setClickedOnProject} setTeam={setTeam} />
        )}
      </div>
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

export default Live;
