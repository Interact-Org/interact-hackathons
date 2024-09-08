import { SERVER_ERROR } from '@/config/errors';
import getHandler from '@/handlers/get_handler';
import EditProject from '@/sections/projects/edit_project';
import NewProject from '@/sections/projects/new_project';
import TeamView from '@/screens/participants/team_view';
import { HackathonTeam } from '@/types';
import { initialHackathonTeam } from '@/types/initials';
import Toaster from '@/utils/toaster';
import { Pen } from '@phosphor-icons/react';
import { GetServerSidePropsContext } from 'next';
import React, { useEffect, useMemo, useState } from 'react';
import Tasks from '@/screens/participants/tasks';

interface Props {
  hid: string;
}

const Live = ({ hid }: Props) => {
  const [team, setTeam] = useState<HackathonTeam>(initialHackathonTeam);
  const [index, setIndex] = useState(0);
  const [clickedOnProject, setClickedOnProject] = useState(false);

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

  const project = useMemo(() => team.project, [team]);

  useEffect(() => {
    getTeam();
  }, []);

  return (
    <div className="w-full min-h-screen bg-[#E1F1FF] p-12 flex flex-col gap-16">
      <div className="w-full flex gap-8">
        <div className="w-2/5 flex-center flex-col gap-2">
          <div className="w-full text-8xl flex-center flex-col font-bold">
            <div className="text-[#607EE7]">Team</div>
            <div className="text-[#4B9EFF]">{team ? team.title : 'Formation'}</div>
          </div>
          <div className="w-fit text-2xl font-medium">Round 1 is Live!</div>
          <div className="w-fit flex-center gap-8 mt-8">
            {['Team', 'Project', 'Tasks'].map((tab, i) => (
              <div
                key={i}
                onClick={() => setIndex(i)}
                className={`${
                  index == i ? 'bg-[#4B9EFF] text-white ' : 'bg-white text-primary_black'
                } rounded-3xl py-2 px-8 font-medium cursor-pointer transition-ease-300`}
              >
                {tab}
              </div>
            ))}
          </div>
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
      {index == 0 && <TeamView team={team} />}
      {index == 1 && (
        <>
          {team?.projectID && project ? (
            <div className="w-full relative bg-gradient-to-b from-[#F6F7F9] to-[#D8EAFF] flex flex-col gap-4 rounded-xl text-primary_black p-8">
              <Pen onClick={() => setClickedOnProject(true)} className="absolute top-4 right-4 cursor-pointer" size={24} />
              {clickedOnProject && <EditProject setShow={setClickedOnProject} projectToEdit={project} setTeam={setTeam} />}
              <div className="text-5xl font-semibold">{project.title}</div>
              <div className="w-fit flex-center gap-4">
                {project.tags?.map(tag => (
                  <div key={tag} className="bg-white rounded-2xl py-2 px-6 text-sm">
                    {tag}
                  </div>
                ))}
              </div>
              <div className="text-lg">{project.description}</div>
              <div className="w-fit flex-center gap-4">
                {project.links?.map(link => (
                  <div key={link}>{link}</div>
                ))}
              </div>
            </div>
          ) : (
            <>
              <div onClick={() => setClickedOnProject(true)}>Add your Project</div>
              {clickedOnProject && <NewProject setShow={setClickedOnProject} setTeam={setTeam} team={team} />}
            </>
          )}
        </>
      )}
      {index == 2 && <Tasks slug={project?.slug || ''} />}
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
