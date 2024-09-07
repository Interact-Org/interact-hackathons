import { USER_PROFILE_PIC_URL } from '@/config/routes';
import { HackathonTeam } from '@/types';
import moment from 'moment';
import Image from 'next/image';
import React from 'react';

interface Props {
  team: HackathonTeam;
  onLeaveTeam: () => void;
  onDeleteTeam: () => void;
}

const TeamView = ({ team, onLeaveTeam, onDeleteTeam }: Props) => {
  return (
    <div className="w-full p-6 bg-white rounded-xl shadow-lg transition hover:shadow-xl">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">{team.title}</h2>
        <div className="flex space-x-2">
          <button onClick={onLeaveTeam} className="px-4 py-2 text-sm bg-gray-200 rounded hover:bg-gray-300 transition">
            Leave Team
          </button>

          <button onClick={onDeleteTeam} className="px-4 py-2 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition">
            Delete Team
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {team.members?.map(member => (
          <div key={member.id} className="flex items-center space-x-4 p-4 bg-gray-100 rounded-lg shadow">
            <Image
              width={50}
              height={50}
              src={`${USER_PROFILE_PIC_URL}/${member.profilePic}`}
              alt={member.username}
              className="w-12 h-12 rounded-full object-cover"
            />

            <div>
              <div className="text-lg font-medium">{member.name}</div>
              <div className="text-sm text-gray-500">@{member.username}</div>
            </div>
          </div>
        ))}
      </div>
      <div>
        Team created by {team.user.name} on {moment(team.createdAt).toLocaleString()}
      </div>
    </div>
  );
};

export default TeamView;
