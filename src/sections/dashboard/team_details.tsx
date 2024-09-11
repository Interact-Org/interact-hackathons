import { USER_PROFILE_PIC_URL } from '@/config/routes';
import { HackathonTeam, HackathonTeamMembership, User } from '@/types';
import Image from 'next/image';
import React from 'react';

const TeamDetails = ({ team }: { team: HackathonTeam }) => {
  return (
    <div className="w-full p-4">
      <h1 className="text-4xl font-semibold mb-4">Team Details</h1>
      <div className="w-full mx-auto grid grid-cols-5 gap-4">
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
        <h1 className="text-2xl font-semibold">{user.name}</h1>
        <p>{membership.role}</p>
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
