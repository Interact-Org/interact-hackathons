import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell, TableCaption } from '@/components/ui/table';
import { USER_PROFILE_PIC_URL } from '@/config/routes';
import { currentHackathonSelector } from '@/slices/hackathonSlice';
import { userSelector } from '@/slices/userSlice';
import { HackathonTeam } from '@/types';
import { ArrowLineRight, PencilLine, Trash } from '@phosphor-icons/react';
import moment from 'moment';
import Image from 'next/image';
import React from 'react';
import { useSelector } from 'react-redux';

interface Props {
  team: HackathonTeam;
  onLeaveTeam?: () => void;
  onDeleteTeam?: () => void;
  onKickMember?: (userID: string) => void;
}

const TeamView = ({ team, onLeaveTeam, onDeleteTeam, onKickMember }: Props) => {
  const user = useSelector(userSelector);
  const hackathon = useSelector(currentHackathonSelector);
  return (
    <div className="w-full p-6 bg-white rounded-xl shadow-lg transition hover:shadow-xl">
      <div className="w-full flex items-end justify-between">
        <div>Your Track: </div>
        <div>
          Members {team.members.length}/{hackathon.maxTeamSize}
        </div>
      </div>
      <Table>
        <TableCaption>
          Created By <b>{team.user.name}</b> at {moment(team.createdAt).format('hh:mm a, DD MMMM')}
        </TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Member</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Joined At</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {team.members?.map(member => (
            <TableRow key={member.id}>
              <TableCell className="flex items-center gap-2 font-medium">
                <Image
                  width={50}
                  height={50}
                  src={`${USER_PROFILE_PIC_URL}/${member.profilePic}`}
                  alt={member.username}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <div className="flex items-center gap-1">
                  <div className="text-lg">{member.name}</div>
                  <div className="text-gray-500">@{member.username}</div>
                </div>
              </TableCell>
              <TableCell>{member.username}</TableCell>
              <TableCell>{member.createdAt}</TableCell>
              <TableCell>
                <div className="w-full h-full flex justify-end gap-4">
                  {member.id != user.id &&
                    (user.id == team.userID ? (
                      <>
                        <PencilLine className="cursor-pointer" size={20} />
                        {onKickMember && (
                          <Trash
                            onClick={() => {
                              if (onKickMember) onKickMember(member.id);
                            }}
                            className="text-primary_danger cursor-pointer"
                            size={20}
                          />
                        )}
                      </>
                    ) : (
                      onLeaveTeam && <ArrowLineRight onClick={onLeaveTeam} className="text-primary_danger cursor-pointer" size={20} />
                    ))}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default TeamView;
