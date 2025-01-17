import { AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Trophy, Users } from '@phosphor-icons/react';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import React, { useState } from 'react';
import { HackathonTeam } from '@/types';
import { getProjectPicHash, getProjectPicURL } from '@/utils/funcs/safe_extract';
import Image from 'next/image';

export interface TeamAccordianItemProps {
  team: HackathonTeam,
  selected: boolean,
  onSelect: (team: HackathonTeam)=>void
}

export const TeamAccordianItem = ({
  team,
  selected = false,
  onSelect
}: TeamAccordianItemProps)=> {

  return (
    <AccordionItem
      value={team.id}
      className={"w-full"}
    >
      <AccordionTrigger
        className={`w-full group no-underline bg-white pl-2 font-primary rounded group-hover:bg-sky-200 select-none ${selected ? "bg-amber-50" : ""}`}
      >
        <div className={"grid grid-cols-3 w-full  place-items-center py-2"}>
          <div className={"font-bold text-lg text-neutral-800"}>{team.title}</div>
          <div className={"flex items-center gap-2"}>
            <Users className={"size-5 text-neutral-800"} />
            <div className={"font-semibold text-lg text-neutral-800"}>{team.memberships.length}</div>
          </div>
          <div>
            <Progress progress={team.overallScore} />
          </div>
        </div>
        <button className={`h-full w-fit bg-amber-50 text-amber-700 hover:text-amber-800 px-3 flex justify-center items-center rounded-r ${selected ? 'bg-amber-200': ''}`}
          onClick={(e)=>{
            e.preventDefault();
            onSelect(team);
          }}
        >
          <Trophy className={"size-5"} />
        </button>
      </AccordionTrigger>
      <AccordionContent
        className={"w-full rounded border bg-white flex flex-col items-center gap-3 p-3"}
      >

        <div className={"h-10 w-full relative rounded-lg prize-card-bg text-center color-white text-bold font-primary"}>
          <Image
            crossOrigin="anonymous"
            className={`absolute top-0 left-0 w-full h-full object-cover rounded-lg -z-10`}
            src={getProjectPicURL(team?.project)}
            alt="Project Cover"
            width={430}
            height={270}
            placeholder="blur"
            blurDataURL={getProjectPicHash(team?.project)}
          />
          {team.project?.title}
        </div>

        <div className={"w-full flex flex-wrap justify-around gap-4"}>
          {team.roundScores.map((score, index)=> (
            <div className={'space-y-1 flex flex-col items-center'} key={index}>
              <p className={'text-xs font-primary text-center'}>Round {index+1}</p>
              <Progress progress={Number(score.score)} />
            </div>
          ))}
        </div>
      </AccordionContent>
    </AccordionItem>
  )
};

export const Progress = ({
   progress
}: {
  progress: number
}) => (
  <div className={'size-8'}>
    <svg style={{ height: 0 }}>
      <defs>
        <linearGradient id="gradientColor" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#DE53F7" />
          <stop offset="100%" stopColor="#7549F2" />
        </linearGradient>
      </defs>
    </svg>
    <CircularProgressbar
      value={progress}
      className={"size-8"}
      strokeWidth={15}
      text={`${progress}`}
      styles={{
        path: {
          stroke: 'url(#gradientColor)',
          strokeLinecap: "round",
        },
        text: {
          fontSize: '35px',
          fill: '#000000',
        },
        trail: {
          strokeLinecap: 'round',
          strokeWidth: 15,
          stroke: "#eee"
        },
      }}
    />
  </div>
);
