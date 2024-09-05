import { HackathonTeam } from '@/types';
import React from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import Loader from '../common/loader';
import moment from 'moment';
import Image from 'next/image';
import { USER_PROFILE_PIC_URL } from '@/config/routes';

interface Props {
  teams: HackathonTeam[];
  fetcher: (abortController?: AbortController, initialPage?: number) => void;
  hasMore: boolean;
}

const TeamsTable = ({ teams, fetcher, hasMore }: Props) => {
  return (
    <div className="w-full flex flex-col gap-2">
      <div className="w-full h-12 bg-white rounded-xl border-gray-400 flex font-semibold text-primary_black max-md:text-sm">
        <div className="w-[25%] max-md:w-[25%] flex-center">Team Name</div>
        <div className="w-[25%] max-md:w-[25%] flex-center">Created By</div>
        <div className="w-[25%] max-md:w-[25%] flex-center">Created At</div>
        <div className="w-[25%] max-md:w-[25%] flex-center">Members</div>
      </div>
      <InfiniteScroll dataLength={teams.length} next={fetcher} hasMore={hasMore} loader={<Loader />} className="w-full flex flex-col gap-2">
        {teams.map(team => (
          <div
            key={team.id}
            className="w-full h-12 bg-white hover:bg-slate-100 rounded-xl border-gray-400 flex text-sm text-primary_black transition-ease-300 cursor-pointer"
          >
            <div className="w-[25%] max-md:w-[25%] flex-center font-medium max-md:text-sm">{team.title}</div>
            <div className="w-[25%] max-md:w-[25%] flex-center">{team.user.name}</div>
            <div className="w-[25%] max-md:w-[25%] flex-center">{moment(team.createdAt).toISOString()}</div>
            <div className="w-[25%] max-md:w-[25%] flex-center">
              {team.members.map(member => (
                <Image
                  key={member.id}
                  crossOrigin="anonymous"
                  className="w-8 h-8 rounded-full"
                  width={50}
                  height={50}
                  alt="user"
                  src={`${USER_PROFILE_PIC_URL}/${member.profilePic}`}
                />
              ))}
            </div>
          </div>
        ))}
      </InfiniteScroll>
    </div>
  );
};

export default TeamsTable;
