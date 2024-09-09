import { UsersThree } from '@phosphor-icons/react';
import { PencilRuler, Trophy } from 'lucide-react';
import React, { useState } from 'react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface Props {
  data: {
    title: string;
    Icon: React.ComponentType;
    Screen: JSX.Element;
  }[];
  activeIndex: number;
  setActiveIndex: React.Dispatch<React.SetStateAction<number>>;
}
const DashboardSidebar = ({ data, activeIndex, setActiveIndex }: Props) => {
  const [mutex, setMutex] = useState(false);

  async function handleEliminate() {
    // Eliminate team
    //use mutex for loading state
  }

  return (
    <div className="w-[15%] sticky top-8 left-0 bg-white h-[calc(100vh-2rem)] p-3 flex flex-col justify-between">
      <div className="w-full">
        <section className="--team-details flex flex-col gap-2 pb-4 border-b-[2px] border-primary_text">
          <h1 className="text-2xl font-semibold">seCSI</h1>
          <div className="flex flex-wrap items-center justify-between">
            <h2 className="text-base font-semibold text-primary_text flex items-center w-full gap-1">
              <PencilRuler size={24} /> <p className="text-primary_black truncate w-full ">Sustainable Development Goal</p>
            </h2>
            <h2 className="text-base font-semibold text-primary_text flex items-center gap-1">
              <UsersThree size={24} />
              <span className="text-primary_black">4</span>
            </h2>
            <h2 className="text-base font-semibold text-primary_text flex items-center gap-1">
              <Trophy size={20} /> <span className="text-primary_black">4500</span>
            </h2>
          </div>
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
        <Dialog>
          <DialogTrigger className="bg-red-500 text-white py-2 rounded-md">Eliminate Team</DialogTrigger>
          <DialogContent>
            <DialogHeader className="text-left">
              <DialogTitle>Eliminate Team</DialogTitle>
              <DialogDescription>This action can be undone. This will remove the team from the competition.</DialogDescription>
            </DialogHeader>
            <Button variant={'destructive'} disabled={mutex}>
              Eliminate
            </Button>
          </DialogContent>
        </Dialog>
        <Button className="bg-primary_text" disabled={mutex}>
          LOGOUT
        </Button>
      </div>
    </div>
  );
};

export default DashboardSidebar;
