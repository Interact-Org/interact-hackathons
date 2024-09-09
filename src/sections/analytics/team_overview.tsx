import React, { ReactNode } from 'react';
import { Bar, BarChart, XAxis } from 'recharts';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { TrendingUp } from 'lucide-react';
import { Label, PolarRadiusAxis, RadialBar, RadialBarChart } from 'recharts';
const chartData = [
  { month: 'January', desktop: 186, mobile: 80 },
  { month: 'February', desktop: 305, mobile: 200 },
  { month: 'March', desktop: 237, mobile: 120 },
  { month: 'April', desktop: 73, mobile: 190 },
  { month: 'May', desktop: 209, mobile: 130 },
  { month: 'June', desktop: 214, mobile: 140 },
];
const chartConfig = {
  desktop: {
    label: 'Desktop',
    color: '#2563eb',
  },
  mobile: {
    label: 'Mobile',
    color: '#60a5fa',
  },
} satisfies ChartConfig;

const TeamOverviewAnalytics = () => {
  return (
    <div className="w-full h-full grid grid-cols-2 gap-6">
      <AnalyticBox>
        <div className="flex flex-col gap-0">
          <span className="flex items-center text-xs font-medium justify-between">
            <h1 className="uppercase   text-black/70">Team registrations today</h1>
            <p className="text-green-500">3.5% Increase</p>
          </span>
          <h1 className="text-xl font-semibold">945</h1>
        </div>
        <ChartContainer config={chartConfig} className="h-[150px] w-full">
          <BarChart accessibilityLayer data={chartData}>
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
            <Bar dataKey="mobile" fill="var(--color-mobile)" radius={4} />
          </BarChart>
        </ChartContainer>
      </AnalyticBox>
      <AnalyticBox>
        <div className="flex flex-col gap-0">
          <span className="flex items-center text-xs font-medium justify-between">
            <h1 className="uppercase text-xs font-medium text-black/70">Overall Users</h1>
            <p className="text-green-500">6.7% Increase</p>
          </span>
          <h1 className="text-xl font-semibold">157,346</h1>
        </div>
        <ChartContainer config={chartConfig} className="h-[150px] w-full">
          <BarChart accessibilityLayer data={chartData}>
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
            <Bar dataKey="mobile" fill="var(--color-mobile)" radius={4} />
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
            <h1 className="text-4xl font-semibold">10</h1>
          </span>
          <span className="text-xs text-primary_text font-medium">3 Sponsor tracks</span>
        </AnalyticBox>
        <AnalyticBox className="flex flex-col gap-2 justify-between">
          <span>
            {' '}
            <h2 className="text-sm font-semibold text-black">Prize Pool</h2>
            <h1 className="text-4xl font-semibold">10k</h1>
          </span>
          <span className="text-xs text-primary_text font-medium">Cash+Goodies</span>
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
