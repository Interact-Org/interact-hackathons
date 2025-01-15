import React from 'react';
import { Project } from '@/types'; // Assuming HackathonTeam type is defined in types
import Link from 'next/link';
import getDomainName from '@/utils/funcs/get_domain_name';
import getIcon from '@/utils/funcs/get_icon';
import { FRONTEND_URL } from '@/config/routes';

interface OverviewComponentProps {
  project: Project | null;
}

const EndOverviewComponent: React.FC<OverviewComponentProps> = ({ project }) => {
  const getTagColor = (tag: string): string => {
    const lowerCaseTag = tag.toLowerCase();
    for (const key in languageColors) {
      if (lowerCaseTag.includes(key)) {
        return languageColors[key];
      }
    }
    return 'bg-gray-100';
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
  };

  return (
    <div className="w-4/5 mx-auto flex flex-col gap-8">
      <div className="bg-white p-6 rounded-lg shadow-md space-y-4 text-center">
        <h2 className="text-3xl font-semibold text-gray-800">The hackathon may have ended, but your project&apos;s journey is just beginning!</h2>
        <p className="text-gray-600 text-lg font-medium">
          Now live on Interact, your project has a platform to thrive. Invite new members, expand your team, and watch it grow with all the features
          at your fingertips.
        </p>
        <p className="text-gray-600">
          Ready to take the next step?{' '}
          <Link href={`${FRONTEND_URL}/workspace?pid=${project?.id}`} className="text-blue-600 hover:underline font-medium">
            Click here
          </Link>{' '}
          to open your project workspace and continue building something extraordinary!
        </p>
      </div>
      <div className="w-full bg-white p-6 rounded-xl font-primary shadow-lg">
        <h1 className="text-3xl md:text-5xl font-bold">{project?.title}</h1>
        <hr className="border-gray-400 my-4" />
        <h4 className="text-lg md:text-xl mb-2">{project?.description}</h4>
        <div className="flex flex-wrap gap-4 mt-6">
          {project?.tags?.map(tag => (
            <div key={tag} className={`py-2 px-4 rounded-xl ${getTagColor(tag)}`}>
              <p>{tag}</p>
            </div>
          ))}
        </div>
        <div className="flex flex-wrap gap-4 mt-8">
          {project?.links?.map((link, index) => {
            const fullLink = link.startsWith('https') ? link : `https://${link}`;

            return (
              <Link
                href={fullLink}
                target="_blank"
                rel="noopener noreferrer"
                key={index}
                className="w-fit h-8 py-2 px-3 border-[1px] border-primary_btn dark:border-dark_primary_btn rounded-lg flex items-center gap-2"
              >
                {getIcon(getDomainName(fullLink), 24)}
                <div className="capitalize">{getDomainName(fullLink)}</div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default EndOverviewComponent;
