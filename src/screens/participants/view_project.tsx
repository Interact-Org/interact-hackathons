import React, { useState } from 'react';
import OverviewComponent from '@/sections/projects/overview';
import PackagesComponent from '@/sections/projects/packages';
import RepositoriesComponent from '@/sections/projects/repositories';
import FigmaComponent from '@/sections/projects/figma';
import { HackathonTeam, Project } from '@/types';

interface ProjectViewProps {
  project: Project | null;
  team: HackathonTeam | null;
}

const ProjectView: React.FC<ProjectViewProps> = ({ project, team }) => {
  const [activeTab, setActiveTab] = useState('overview');

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
          className={`text-lg md:text-2xl ${activeTab === 'packages' ? 'text-blue-800 underline underline-offset-4' : 'text-blue-500'}`}
          onClick={() => setActiveTab('packages')}
        >
          Packages
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
      <hr className="border-gray-400 my-4" />
      <div className="mt-8">
        {activeTab === 'overview' && <OverviewComponent project={project} />}
        {activeTab === 'packages' && <PackagesComponent />}
        {activeTab === 'repositories' && team && <RepositoriesComponent team={team} />}
        {activeTab === 'figma' && <FigmaComponent />}
      </div>
    </div>
  );
};

export default ProjectView;
