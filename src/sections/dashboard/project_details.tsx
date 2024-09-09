import { Button } from '@/components/ui/button';
import { FigmaLogo, GithubLogo, LinkSimple } from '@phosphor-icons/react';
import Link from 'next/link';
import React from 'react';

export const ProjectDetails = () => {
  const projectData = {
    title: 'Realtime Gesture Recognition of Sign Language',
    description:
      "Develop a real-time sign language gesture recognition system using a  webcam that combines self-supervised learning, dynamic temporal  ensembles, and adversarial training to enhance accuracy and robustness.  Additionally, incorporate explainable AI to provide insights into the  model's decision-making process.Develop a real-time sign language gesture recognition system using a  webcam that combines self-supervised learning, dynamic temporal  ensembles, and adversarial training to enhance accuracy and robustness.  Additionally, incorporate explainable AI to provide insights into the  model's decision-making process. ",
    tags: ['Computer Vision', 'Machine Learning', 'Deep Learning', 'AI', 'Sign Language'],
    githubLink: 'https://github.com',
    figmaLink: 'https://figma.com',
    otherLinks: ['https://drive.google.com', 'https://drive.google.com'],
  };
  return (
    <div className="w-[90%] p-4 flex flex-col gap-8">
      <h1 className="text-5xl font-bold">{projectData.title}</h1>
      <div className="flex items-center gap-1 flex-wrap">
        {projectData.tags.map((tag, index) => (
          <span className="px-4 py-1 bg-white rounded-sm border-[1px] text-xs font-semibold border-[#dedede]" key={index}>
            {tag}
          </span>
        ))}
      </div>
      <p className="text-base ">{projectData.description}</p>
      <div className="flex items-center gap-2 ">
        {projectData.githubLink && (
          <Link href={projectData.githubLink}>
            <Button variant="outline" className="gap-2">
              <GithubLogo size={20} />
              <p>Github</p>
            </Button>
          </Link>
        )}
        {projectData.figmaLink && (
          <Link href={projectData.figmaLink}>
            <Button variant="outline" className="gap-2">
              <FigmaLogo size={20} />
              <p>Figma</p>
            </Button>
          </Link>
        )}
        {projectData.otherLinks.map((link, index) => (
          <>
            <Link href={link}>
              <Button variant="outline" className="gap-2" key={index}>
                <LinkSimple size={20} />
                <p className="w-32 truncate">{link}</p>
              </Button>
            </Link>
          </>
        ))}
      </div>
    </div>
  );
};
