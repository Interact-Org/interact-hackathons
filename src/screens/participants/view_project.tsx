import React, { useEffect, useState } from 'react';
import OverviewComponent from '@/sections/projects/overview';
import RepositoriesComponent from '@/sections/projects/repositories';
import FigmaComponent from '@/sections/projects/figma';
import { HackathonTeam, Project } from '@/types';

interface ProjectViewProps {
  project: Project | null;
  team: HackathonTeam | null;
  setTeam: React.Dispatch<React.SetStateAction<HackathonTeam | null>>;
}

const ProjectView: React.FC<ProjectViewProps> = ({ project, team, setTeam }) => {
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const tab = new URLSearchParams(window.location.search).get('tab');
    if (tab) setActiveTab(tab);
  }, []);

  const TabButton = ({ title }: { title: string }) => (
    <button
      className={`text-xl ${activeTab === title.toLowerCase() ? 'text-blue-800 underline underline-offset-4' : 'text-blue-500'} transition-ease-500`}
      onClick={() => setActiveTab(title.toLowerCase())}
    >
      {title}
    </button>
  );

  return (
    <div className="w-full flex flex-col md:justify-center font-primary">
      <div className="flex flex-wrap justify-start items-start gap-8 font-semibold">
        <TabButton title="Overview" />
        <TabButton title="Repositories" />
        <TabButton title="Figma" />
      </div>
      <div className="mt-4">
        {activeTab === 'overview' && <OverviewComponent project={project} setTeam={setTeam} />}
        {activeTab === 'repositories' && team && <RepositoriesComponent team={team} />}
        {activeTab === 'figma' && team && <FigmaComponent team={team} />}
      </div>
    </div>
  );
};

export default ProjectView;
