import { Button } from '@/components/ui/button';
import { Project } from '@/types';
import getDomainName from '@/utils/funcs/get_domain_name';
import getIcon from '@/utils/funcs/get_icon';
import { FigmaLogo, GithubLogo, LinkSimple } from '@phosphor-icons/react';
import Link from 'next/link';
import React from 'react';

export const ProjectDetails = ({ project }: { project: Project | undefined }) => {
  return (
    <div className="w-[90%] p-4 flex flex-col gap-8">
      {!project ? (
        <>Idea Not Submitted Yet.</>
      ) : (
        <>
          <h1 className="text-5xl font-bold">{project.title}</h1>
          <p className="text-xl font-medium">{project.tagline}</p>
          <div className="flex items-center gap-1 flex-wrap">
            {project.tags?.map((tag, index) => (
              <span className="px-4 py-1 bg-white rounded-sm border-[1px] text-xs font-semibold border-[#dedede]" key={index}>
                {tag}
              </span>
            ))}
          </div>
          <p className="text-base">{project.description}</p>
          <div className="flex items-center gap-2 ">
            {project.links?.map((link, index) => (
              <>
                <Link href={link} target="_blank">
                  <Button variant="outline" className="gap-2 py-4" key={index}>
                    {getIcon(getDomainName(link))}
                    <div className="capitalize">{getDomainName(link)}</div>
                  </Button>
                </Link>
              </>
            ))}
          </div>
        </>
      )}
    </div>
  );
};
