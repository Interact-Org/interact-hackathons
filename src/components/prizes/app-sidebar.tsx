import React from 'react';
import { Button } from '@/components/ui/button';
import { CalendarCheck2, Undo2 } from 'lucide-react';
import { useRouter } from 'next/router';

export interface AppSidebarProps {
  hackathonName: string;
  hackathonTagline: string;
  tracks: number;
  participants: number;
  totalRemaining: number;
  onEndHackathon: ()=>Promise<void>;
  // onReturnToDashboard: ()=>void;
}

export const AppSidebar = ({
  hackathonName,
  hackathonTagline,
  tracks,
  participants,
  totalRemaining,
  onEndHackathon,
  // onReturnToDashboard
}: AppSidebarProps) => {

  const router = useRouter();

  return (
    <div className={"h-base w-1/6 bg-white"}>
      <div className={"flex flex-col justify-between h-base"}>

        <div className={"h-full px-5"}>
          <div className={"pt-5 py-2.5 space-y-2"}>
            <div className={"text-3xl text-wrap font-bold gradient-text-3 font-primary"}>{hackathonName}</div>
            <div className={"text-black text-sm mt-2 font-primary"}>{hackathonTagline}</div>
          </div>
          <div className={"py-5 space-y-1 font-primary font-bold text-black border-b-2 border-neutral-300"}>
            <div><span className={"gradient-text-3 text-lg"}>Tracks: </span>{tracks}</div>
            <div><span className={"gradient-text-3 text-lg"}>Participants: </span>{participants}</div>
            <div><span className={"gradient-text-3 text-lg"}>Total Remaining: </span>{totalRemaining}</div>
          </div>
        </div>

        <div className={"space-y-2 mb-2"}>
          <div className={"px-4"}>
            <Button
              className={"flex gap-2 justify-between items-center w-full bg-[#DF0C3D] hover:bg-red-500"}
              variant={"destructive"}
              onClick={()=>onEndHackathon()}
            >
              <CalendarCheck2 className={"size-5"} />
              <div className={"w-full"}>End Hackathon</div>
            </Button>
          </div>
          <div className={"px-4"}>
            <Button
              className={"flex gap-2 justify-between items-center w-full text-white bg-neutral-700 hover:bg-neutral-600"}
              onClick={()=>router.back()}
            >
              <Undo2 className={"size-5"} />
              <div className={"w-full"}>Return to Dashboard</div>
            </Button>
          </div>
        </div>

      </div>
    </div>
  )
}
