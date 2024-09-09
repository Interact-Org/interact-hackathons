import DashboardSidebar from '@/components/dashboard_sidebar';
import { useRouter } from 'next/router';
import { Chat, Kanban, Trophy, UsersThree } from '@phosphor-icons/react';
import { useEffect, useState } from 'react';
import TeamDetails from '@/sections/dashboard/team_details';
import { ProjectDetails } from '@/sections/dashboard/project_details';
import TeamScores from '@/sections/dashboard/team_scores';
import { initialHackathonTeam } from '@/types/initials';
import { useSelector } from 'react-redux';
import { currentHackathonSelector } from '@/slices/hackathonSlice';
import { ORG_URL } from '@/config/routes';
import Toaster from '@/utils/toaster';
import { SERVER_ERROR } from '@/config/errors';
import getHandler from '@/handlers/get_handler';
import { GetServerSidePropsContext } from 'next';

export default function Page({ tid }: { tid: string }) {
  const [team, setTeam] = useState(initialHackathonTeam);
  const router = useRouter();
  const [activeIndex, setActiveIndex] = useState(0);

  const hackathon = useSelector(currentHackathonSelector);

  const getTeam = async () => {
    const URL = `${ORG_URL}/${hackathon.organizationID}/hackathons/${hackathon.id}/teams/${tid}`;
    const res = await getHandler(URL);
    if (res.statusCode === 200) {
      setTeam(res.data.team);
    } else {
      Toaster.error(res.data?.message || SERVER_ERROR);
    }
  };

  useEffect(() => {
    getTeam();
  }, [tid]);

  const menuData: MenuItem[] = [
    {
      title: 'Team Details',
      Icon: UsersThree,
      Screen: <TeamDetails team={team} />,
    },
    {
      title: 'Project',
      Icon: Kanban,
      Screen: <ProjectDetails project={team.projectID ? team.project : undefined} />,
    },
    {
      title: 'Scores',
      Icon: Trophy,
      Screen: <TeamScores teamID={team.id} />,
    },
    {
      title: 'Comments',
      Icon: Chat,
      Screen: <p>Comments</p>,
    },
  ];

  const ActiveScreen = menuData[activeIndex].Screen;

  return (
    <div className="w-full bg-[#E1F1FF] min-h-screen">
      <header className="bg-white w-full py-1 px-4 font-semibold h-8 border-b-[1px] border-[#dedede] sticky top-0 left-0">Interact</header>
      <div className="w-full flex items-start justify-between h-full">
        <DashboardSidebar data={menuData} activeIndex={activeIndex} setActiveIndex={setActiveIndex} />
        <div className="h-fit w-[85%]">{ActiveScreen}</div>
      </div>
    </div>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { tid } = context.query;

  return {
    props: { tid },
  };
}

interface MenuItem {
  title: string;
  Icon: React.ComponentType;
  Screen: JSX.Element;
}
