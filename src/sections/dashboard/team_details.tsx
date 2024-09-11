import { AvatarBox } from '@/components/common/avatar_box';
import { Status } from '@/pages/admin/live';
import { UsersThree } from '@phosphor-icons/react';
import { PencilRuler } from 'lucide-react';
import { USER_PROFILE_PIC_URL } from '@/config/routes';
import { HackathonTeam, HackathonTeamMembership, User } from '@/types';
import Image from 'next/image';

import React from 'react';

const TeamDetails = ({ team }: { team: HackathonTeam }) => {
  return (
    <div className="w-full p-4">
      <section className="--team-details md:hidden flex flex-col gap-2 pb-4 border-b-[2px] border-primary_text">
        <h1 className="text-2xl font-semibold">{team.title}</h1>
        <div className="flex flex-wrap gap-2 items-center justify-between">
          {team.track?.title && (
            <h2 className="text-base font-semibold text-primary_text flex items-center w-full gap-1">
              <PencilRuler size={24} /> <p className="text-primary_black truncate w-full ">{team.track?.title}</p>
            </h2>
          )}
          <h2 className="text-base font-semibold text-primary_text flex items-center gap-1">
            <UsersThree size={24} />
            <span className="text-primary_black">{team.memberships?.length}</span>
          </h2>
          {/* <h2 className="text-base font-semibold text-primary_text flex items-center gap-1">
              <Trophy size={20} /> <span className="text-primary_black">4500</span>
              </h2> */}
        </div>
        <Status status={team.isEliminated ? 'eliminated' : 'not eliminated'} />
      </section>
      <h1 className="text-2xl md:text-4xl font-semibold mb-4">Team Details</h1>
      <div className="w-full mx-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 md:gap-4">
        {team.memberships?.map(membership => (
          <MemberCard key={membership.id} membership={membership} />
        ))}
      </div>
    </div>
  );
};

export default TeamDetails;

function MemberCard({ membership }: { membership: HackathonTeamMembership }) {
  const user = membership.user;
  return (
    <div className="w-full bg-white rounded-md border-[2px] border-[#dedede] flex flex-col items-center p-4 gap-4">
      <Image
        crossOrigin="anonymous"
        width={50}
        height={50}
        alt={'User Pic'}
        src={`${USER_PROFILE_PIC_URL}/${user.profilePic}`}
        placeholder="blur"
        blurDataURL={user.profilePicBlurHash || 'no-hash'}
        className="w-32 h-32 rounded-full cursor-default shadow-md"
      />
      <div className="text-center">
        <h1 className="text-lg md:text-xl lg:text-2xl font-semibold">{user.name}</h1>
        <p className="text-xs md:text-sm lg:text-base">{membership.role}</p>
      </div>
      {/* <div className="flex items-center gap-2 w-full">
        <button className=" w-1/2 p-2 rounded-md bg-black text-white flex items-center justify-center gap-1 font-semibold">
          <GithubLogo size={20} weight="fill" />
          <p>Github</p>
        </button>
        <button className=" w-1/2 p-2 rounded-md bg-black text-white flex items-center justify-center gap-1 font-semibold">
          <FigmaLogo size={20} weight="fill" />
          <p>Figma</p>
        </button>
      </div> */}
    </div>
  );
}
