import { UsersThree } from '@phosphor-icons/react';
import { PencilRuler } from 'lucide-react';
import React, { Dispatch, SetStateAction } from 'react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { HackathonTeam } from '@/types';
import { useSelector } from 'react-redux';
import { currentHackathonSelector } from '@/slices/hackathonSlice';
import Toaster from '@/utils/toaster';
import { SERVER_ERROR } from '@/config/errors';
import patchHandler from '@/handlers/patch_handler';
import { getHackathonRole } from '@/utils/funcs/hackathons';
import { Status } from '@/pages/admin/live';

interface Props {
  data: {
    title: string;
    Icon: React.ComponentType;
    Screen: JSX.Element;
  }[];
  activeIndex: number;
  setActiveIndex: React.Dispatch<React.SetStateAction<number>>;
  team: HackathonTeam;
  setTeam: Dispatch<SetStateAction<HackathonTeam>>;
}
const DashboardSidebar = ({ data, activeIndex, setActiveIndex, team, setTeam }: Props) => {
  const hackathon = useSelector(currentHackathonSelector);

  const handleEliminateTeam = async () => {
    const URL = `/org/${hackathon.organizationID}/hackathons/${hackathon.id}/team/${team.id}/eliminate`;

    const res = await patchHandler(URL, {});
    const message = res.data.message || SERVER_ERROR;
    if (res.statusCode == 200) {
      setTeam(prev => {
        return { ...prev, isEliminated: !prev.isEliminated };
      });
      Toaster.success(message);
    } else Toaster.error(message);
  };

  const role = getHackathonRole();

  return (
    <div className="w-[15%] sticky top-8 left-0 bg-white h-base p-3 flex flex-col justify-between">
      <div className="w-full">
        <section className="--team-details flex flex-col gap-2 pb-4 border-b-[2px] border-primary_text">
          <h1 className="text-2xl font-semibold">{team.title}</h1>
          <div className="flex flex-wrap gap-2 items-center justify-between">
            <h2 className="text-base font-semibold text-primary_text flex items-center w-full gap-1">
              <PencilRuler size={24} /> <p className="text-primary_black truncate w-full ">{team.track?.title}</p>
            </h2>
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
        <section className="--menu-items flex flex-col gap-2 mt-4">
          {data.map((item, index) => (
            <button
              className={`flex items-center gap-2  w-full py-2 rounded-sm px-3  hover:bg-primary_text hover:text-white  ${
                activeIndex === index ? 'bg-primary_text text-white' : 'text-primary_black/80'
              } transition-ease-300`}
              key={index}
              onClick={() => {
                setActiveIndex(index);
              }}
            >
              <item.Icon />
              <span className="font-semibold">{item.title}</span>
            </button>
          ))}
        </section>
      </div>
      <div className="w-full flex flex-col gap-2">
        {role == 'admin' && (
          <Dialog>
            <DialogTrigger className="bg-red-500 text-white py-2 rounded-md">Eliminate Team</DialogTrigger>
            <DialogContent>
              <DialogHeader className="text-left">
                <DialogTitle>Eliminate Team</DialogTitle>
                <DialogDescription>This action can be undone. This will remove the team from the competition.</DialogDescription>
              </DialogHeader>
              <Button onClick={handleEliminateTeam} variant={'destructive'}>
                Eliminate
              </Button>
            </DialogContent>
          </Dialog>
        )}
        <Button onClick={() => window.location.assign('/admin/live')} className="bg-primary_text">
          Go Back
        </Button>
      </div>
    </div>
  );
};

export default DashboardSidebar;
