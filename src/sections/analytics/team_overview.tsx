import React, { ReactNode, useEffect, useState } from 'react';
import { Bar, BarChart, Label, PolarRadiusAxis, RadialBar, RadialBarChart, XAxis } from 'recharts';
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
  const chartData2 = [{ desktop: 6, mobile: 3 }];

  const chartConfig2 = {
    desktop: {
      label: 'Desktop',
      color: 'rgba(0,0,0,0)',
    },
    mobile: {
      label: 'Mobile',
      color: '#60a5fa',
    },
  } satisfies ChartConfig;

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      const res = await getHandler(`/hackathons/${hackathon.id}/participants/analytics/team`);
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
      <AnalyticBox className="h-[150px] overflow-hidden">
        <ChartContainer config={chartConfig2} className="mx-auto aspect-square w-full max-w-[250px] relative -top-8">
          <RadialBarChart data={chartData2} endAngle={180} innerRadius={80} outerRadius={130}>
            <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
              <Label
                content={({ viewBox }) => {
                  if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                    return (
                      <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle">
                        <tspan x={viewBox.cx} y={(viewBox.cy || 0) - 16} className="fill-foreground text-2xl font-bold">
                          3 Hrs
                        </tspan>
                        <tspan x={viewBox.cx} y={(viewBox.cy || 0) + 4} className="fill-muted-foreground">
                          Till Round 1
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </PolarRadiusAxis>
            <RadialBar dataKey="desktop" stackId="a" cornerRadius={5} fill="var(--color-desktop)" className="stroke-transparent stroke-2" />
            <RadialBar dataKey="mobile" fill="var(--color-mobile)" stackId="a" cornerRadius={5} className="stroke-transparent stroke-2" />
          </RadialBarChart>
        </ChartContainer>
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
