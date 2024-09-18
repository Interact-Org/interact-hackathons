import { Button } from '@/components/ui/button';
import { Project } from '@/types';
import getDomainName from '@/utils/funcs/get_domain_name';
import getIcon from '@/utils/funcs/get_icon';
import Link from 'next/link';
import React from 'react';

export const ProjectDetails = ({ project }: { project: Project | undefined }) => {
  return (
    <div className="w-[90%] p-4 flex flex-col gap-8">
      {!project ? (
        <div className="w-full h-fit flex-center text-4xl font-medium pt-32 max-md:pt-8">Project Not Submitted Yet.</div>
      ) : (
        <>
          <h1 className="text-2xl md:text-3xl lg:text-5xl font-bold">{project.title}</h1>
          <p className="text-sm md:text-lg lg:text-xl font-medium">{project.tagline}</p>
          <div className="flex items-center gap-1 flex-wrap">
            {project.tags?.map((tag, index) => (
              <span className="px-3 md:px-4 py-1 bg-white rounded-sm border-[1px] text-xs font-semibold border-[#dedede]" key={index}>
                {tag}
              </span>
            ))}
          </div>
          <p className="text-sm md:text-base">{project.description}</p>
          <div className="flex items-center gap-2 flex-wrap">
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
