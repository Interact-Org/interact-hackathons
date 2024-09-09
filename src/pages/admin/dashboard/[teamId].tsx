'use client';
import DashboardSidebar from '@/components/dashboard_sidebar';
import { useRouter } from 'next/router';
import { Chat, Kanban, Trophy, UsersThree } from '@phosphor-icons/react';
import { useState } from 'react';
import TeamDetails from '@/sections/dashboard/team_details';
import { ProjectDetails } from '@/sections/dashboard/project_details';
import TeamScores from '@/sections/dashboard/team_scores';

export default function Page() {
  const router = useRouter();
  const { teamId } = router.query;
  const [activeIndex, setActiveIndex] = useState(0);
  const ActiveScreen = menuData[activeIndex].Screen;
  return (
    <div className="w-full bg-[#E1F1FF] min-h-screen">
      <header className="bg-white w-full py-1 px-4 font-semibold h-8 border-b-[1px] border-[#dedede] sticky top-0 left-0 ">Interact</header>
      {/* <div className="w-[95%] mx-auto h-full flex flex-col gap-8"></div> */}
      <div className="w-full flex items-start justify-between h-full">
        <DashboardSidebar data={menuData} activeIndex={activeIndex} setActiveIndex={setActiveIndex} />
        <div className="h-fit w-[85%]">{<ActiveScreen />}</div>
      </div>
    </div>
  );
}
const menuData = [
  {
    title: 'Team Details',
    Icon: <UsersThree size={20} weight="fill" />,
    Screen: TeamDetails,
  },
  {
    title: 'Projects',
    Icon: <Kanban size={20} weight="fill" />,
    Screen: ProjectDetails,
  },
  {
    title: 'Scores',
    Icon: <Trophy size={20} weight="fill" />,
    Screen: TeamScores,
  },
  {
    title: 'Comments',
    Icon: <Chat size={20} weight="fill" />,
    Screen: () => {
      return <p>Comments</p>;
    },
  },
];
