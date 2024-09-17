import React, { useEffect, useState } from 'react';
import OverviewComponent from '@/sections/projects/overview';
import RepositoriesComponent from '@/sections/projects/repositories';
import FigmaComponent from '@/sections/projects/figma';
import { HackathonTeam, Project } from '@/types';

interface ProjectViewProps {
  project: Project | null;
  team: HackathonTeam | null;
}

const ProjectView: React.FC<ProjectViewProps> = ({ project, team }) => {
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const tab = new URLSearchParams(window.location.search).get('tab');
    if (tab) setActiveTab(tab);
  }, []);

  return (
    <div className="w-full flex flex-col md:justify-center font-primary p-4 md:p-2">
      <div className="flex flex-wrap justify-start items-start space-x-4 md:space-x-12 font-bold mt-4">
        <button
          className={`text-lg md:text-2xl ${activeTab === 'overview' ? 'text-blue-800 underline underline-offset-4' : 'text-blue-500'}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button
          className={`text-lg md:text-2xl ${activeTab === 'repositories' ? 'text-blue-800 underline underline-offset-4' : 'text-blue-500'}`}
          onClick={() => setActiveTab('repositories')}
        >
          Repositories
        </button>
        <button
          className={`text-lg md:text-2xl ${activeTab === 'figma' ? 'text-blue-800 underline underline-offset-4' : 'text-blue-500'}`}
          onClick={() => setActiveTab('figma')}
        >
          Figma
        </button>
      </div>
      <div className="mt-4">
        {activeTab === 'overview' && <OverviewComponent project={project} />}
        {activeTab === 'repositories' && team && <RepositoriesComponent team={team} />}
        {activeTab === 'figma' && <FigmaComponent />}
      </div>
    </div>
  );
};

export default ProjectView;
