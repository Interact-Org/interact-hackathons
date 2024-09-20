import React, { useState } from 'react';
import { Pen } from '@phosphor-icons/react';
import EditProject from '@/sections/projects/edit_project';
import { initialHackathonTeam } from '@/types/initials';
import { Project, HackathonTeam } from '@/types'; // Assuming HackathonTeam type is defined in types
import Link from 'next/link';
import getDomainName from '@/utils/funcs/get_domain_name';
import getIcon from '@/utils/funcs/get_icon';

interface OverviewComponentProps {
  project: Project | null;
  setTeam: React.Dispatch<React.SetStateAction<HackathonTeam | null>>;
}

const OverviewComponent: React.FC<OverviewComponentProps> = ({ project, setTeam }) => {
  const [clickedOnProject, setClickedOnProject] = useState(false);

  const getTagColor = (tag: string): string => {
    const lowerCaseTag = tag.toLowerCase();
    for (const key in languageColors) {
      if (lowerCaseTag.includes(key)) {
        return languageColors[key];
      }
    }
    return 'bg-gray-100'; // Default color if no match is found
  };

  const languageColors: { [key: string]: string } = {
    javascript: 'bg-yellow-400 text-black',
    python: 'bg-blue-500 text-white',
    java: 'bg-red-500 text-white',
    csharp: 'bg-purple-500 text-white',
    ruby: 'bg-red-400 text-white',
    php: 'bg-indigo-400 text-white',
    typescript: 'bg-blue-600 text-white',
    react: 'bg-blue-400 text-white',
    angular: 'bg-red-600 text-white',
    vue: 'bg-green-500 text-white',
    django: 'bg-green-400 text-white',
    flask: 'bg-gray-400 text-white',
    spring: 'bg-green-600 text-white',
    laravel: 'bg-red-700 text-white',
    express: 'bg-gray-600 text-white',
    next: 'bg-black text-white',
    html: 'bg-orange-500 text-white',
    css: 'bg-blue-300 text-white',
    // Add more languages and colors as needed
  };

  return (
    <div className="relative bg-white p-6 rounded-xl font-primary shadow-lg max-w-full mx-auto">
      <h1 className="text-3xl md:text-5xl font-bold">{project?.title}</h1>
      <Pen
        onClick={() => setClickedOnProject(true)}
        className="absolute top-4 right-4 cursor-pointer text-gray-600 hover:text-gray-800 transition-colors duration-200"
        size={24}
      />
      {clickedOnProject && project && <EditProject setShow={setClickedOnProject} projectToEdit={project} setTeam={setTeam} />}
      <hr className="border-gray-400 my-4" />
      <h4 className="text-lg md:text-xl mb-2">{project?.description}</h4>
      <div className="flex flex-wrap gap-4 mt-6">
        {project?.tags?.map(tag => (
          <div key={tag} className={`p-2 rounded-lg ${getTagColor(tag)}`}>
            <p>{tag}</p>
          </div>
        ))}
      </div>
      <div className="flex flex-wrap gap-4 mt-8">
        {project?.links?.map((link, index) => {
          return (
            <Link
              href={link}
              target="_blank"
              key={index}
              className="w-fit h-8 py-2 px-3 border-[1px] border-primary_btn dark:border-dark_primary_btn rounded-lg flex items-center gap-2"
            >
              {getIcon(getDomainName(link), 24)}
              <div className="capitalize">{getDomainName(link)}</div>
            </Link>
          );
        })}
      </div>
      <p className="text-yellow-700 pt-4 rounded-md">
        *Disclaimer: This project is now private on Interact but will be converted to public once the hackathon ends.
      </p>
    </div>
  );
};

export default OverviewComponent;
