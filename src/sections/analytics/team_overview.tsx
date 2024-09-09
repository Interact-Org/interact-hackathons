import React, { ReactNode, useEffect, useState } from 'react';
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import getHandler from '@/handlers/get_handler';
import { useSelector } from 'react-redux';
import { currentHackathonSelector } from '@/slices/hackathonSlice';

const initialChartData = [
  { time: '5 Days Ago', noOfTeams: 0, noOfParticipants: 0 },
  { time: '4 Days Ago', noOfTeams: 0, noOfParticipants: 0 },
  { time: '3 Days Ago', noOfTeams: 0, noOfParticipants: 0 },
  { time: '2 Days Ago', noOfTeams: 0, noOfParticipants: 0 },
  { time: '1 Day Ago', noOfTeams: 0, noOfParticipants: 0 },
  { time: 'Today', noOfTeams: 0, noOfParticipants: 0 },
];

const chartConfig = {
  noOfTeams: {
    label: 'Teams',
    color: '#2563eb',
  },
  noOfParticipants: {
    label: 'Participants',
    color: '#10b981',
  },
} satisfies ChartConfig;

const TeamOverviewAnalytics = () => {
  const [chartData, setChartData] = useState(initialChartData);
  const [totalTeams, setTotalTeams] = useState(0);
  const [totalParticipants, setTotalParticipants] = useState(0);
  const [totalTracks, setTotalTracks] = useState(0);
  const [totalPrize, setTotalPrize] = useState(0);

  const hackathon = useSelector(currentHackathonSelector);

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      const res = await getHandler(`/hackathons/${hackathon.id}/participants/analytics`);
      if (res.statusCode == 200) {
        setChartData(res.data.data);
        setTotalTeams(res.data.totalTeams);
        setTotalParticipants(res.data.totalParticipants);
        setTotalTracks(res.data.totalTracks);
        setTotalPrize(res.data.totalPrize);
      }
    };

    fetchAnalyticsData();
  }, []);
  return (
    <div className="w-full h-full grid grid-cols-2 gap-6">
      <AnalyticBox>
        <div className="flex flex-col gap-0">
          <span className="flex items-center text-xs font-medium justify-between">
            <h1 className="uppercase text-black/70">Teams</h1>
          </span>
          <h1 className="text-xl font-semibold">{totalTeams}</h1>
        </div>
        <ChartContainer config={chartConfig} className="h-[150px] w-full">
          <BarChart data={chartData}>
            <XAxis dataKey="time" tickLine={false} tickMargin={10} axisLine={false} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="noOfTeams" fill="var(--color-noOfTeams)" radius={4} />
          </BarChart>
        </ChartContainer>
      </AnalyticBox>
      <AnalyticBox>
        <div className="flex flex-col gap-0">
          <span className="flex items-center text-xs font-medium justify-between">
            <h1 className="uppercase text-black/70">Participants</h1>
          </span>
          <h1 className="text-xl font-semibold">{totalParticipants}</h1>
        </div>
        <ChartContainer config={chartConfig} className="h-[150px] w-full">
          <BarChart data={chartData}>
            <XAxis dataKey="time" tickLine={false} tickMargin={10} axisLine={false} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="noOfParticipants" fill="var(--color-noOfParticipants)" radius={4} />
          </BarChart>
        </ChartContainer>
      </AnalyticBox>
      <AnalyticBox className="flex items-center ">
        <div>
          <h1 className="uppercase text-xs font-medium text-black/70 mb-2">Time left for Registration</h1>
          <div
            className="aspect-[2] h-[80px] bg-white rounded-t-full p-4 relative"
            style={{
              backgroundImage: `conic-gradient(#478EE1 0deg,#478EE1 60deg,#fff 60deg,#fff 180deg,#478EE1 180deg, #478EE1 3000deg, #fff 360deg)`,
            }}
          >
            <div className="h-[55px] aspect-[2] bg-white rounded-t-full absolute bottom-0 left-1/2 -translate-x-1/2 flex items-end justify-center text-lg font-semibold">
              3 Hrs
            </div>
          </div>
        </div>
        <div className="h-full flex flex-col justify-between">
          <h1 className="uppercase text-xs font-medium text-black/70 mb-2">Time till Round 1</h1>
          <div
            className="aspect-[2] h-[80px] bg-white rounded-t-full p-4 relative"
            style={{
              backgroundImage: `conic-gradient(#fff 0deg,#fff 60deg,#fff 60deg,#fff 180deg,#478EE1 180deg, #478EE1 3000deg, #fff 360deg)`,
            }}
          >
            <div className="h-[55px] aspect-[2] bg-white rounded-t-full absolute bottom-0 left-1/2 -translate-x-1/2 flex items-end justify-center text-lg font-semibold">
              1 Hrs
            </div>
          </div>
        </div>
      </AnalyticBox>
      <div className="w-full grid grid-cols-2 gap-2">
        <AnalyticBox className="flex flex-col  justify-between">
          <span>
            <h2 className=" text-sm font-semibold text-black">Number of Tracks</h2>
            <h1 className="text-4xl font-semibold">{totalTracks}</h1>
          </span>
          {/* <span className="text-xs text-primary_text font-medium">3 Sponsor tracks</span> */}
        </AnalyticBox>
        <AnalyticBox className="flex flex-col gap-2 justify-between">
          <span>
            {' '}
            <h2 className="text-sm font-semibold text-black">Prize Pool</h2>
            <h1 className="text-4xl font-semibold">{totalPrize > 1000 ? `${Math.floor(totalPrize / 1000)}k` : totalPrize}</h1>
          </span>
          {/* <span className="text-xs text-primary_text font-medium">Cash+Goodies</span> */}
        </AnalyticBox>
      </div>
    </div>
  );
};

export default TeamOverviewAnalytics;

type BoxProps = {
  children: ReactNode;
  className?: string;
};
export function AnalyticBox({ children, className }: BoxProps) {
  return <div className={`p-4 bg-white rounded-lg border-[2px] border-[#dedede]  w-full ${className}`}>{children}</div>;
}
