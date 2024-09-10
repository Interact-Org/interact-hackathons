import React, { useEffect, useState } from 'react';
import { AnalyticBox } from './team_overview';
import { TrendDown, TrendUp, UsersFour, UsersThree } from '@phosphor-icons/react';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Bar, BarChart, XAxis } from 'recharts';
import { TrendingUp } from 'lucide-react';
import { Label, PolarRadiusAxis, RadialBar, RadialBarChart } from 'recharts';
import getHandler from '@/handlers/get_handler';
import { useSelector } from 'react-redux';
import { currentHackathonSelector } from '@/slices/hackathonSlice';
import { HackathonRound } from '@/types';

const chartData2 = [{ month: 'january', desktop: 1260, mobile: 570 }];

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

export default function LiveRoundAnalytics({ round }: { round: HackathonRound | null }) {
  const [timeLeft, setTimeLeft] = useState('');
  const [totalTeams, setTotalTeams] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalTeamsLeft, setTotalTeamsLeft] = useState(0);
  const [totalUsersLeft, setTotalUsersLeft] = useState(0);

  const analyticsData = {
    users_left: {
      heading: 'Users Left',
      value: '2,890',
      increase: true,
      trend: '34.2% of last round',
      Icon: <UsersThree size={36} className="bg-primary_text text-white p-2 rounded-md " />,
    },
    engagement_rate: {
      heading: 'Engagement Rate',
      value: '2.579',
      increase: true,
      trend: '+4.2%.',
    },
    total_users: {
      heading: 'Total Users',
      value: '10,293',
      increase: true,
      trend: '4.2% greater than the avg.',
      Icon: <UsersThree size={36} className="bg-primary_text text-white p-2 rounded-md " />,
    },
    team_left: {
      heading: 'Teams Left',
      value: '2,890',
      increase: false,
      trend: '43% of last around',
      Icon: <UsersFour size={36} className="bg-primary_text text-white p-2 rounded-md " />,
    },
    total_teams: {
      heading: 'Total Teams',
      value: '532',
      increase: false,
      trend: '1.3% less than avg.',
      Icon: <UsersFour size={36} className="bg-primary_text text-white p-2 rounded-md " />,
    },
    timeLeft: {
      heading: 'Time Left',
      endDate: round?.endTime || new Date(),
    },
  };

  useEffect(() => {
    const endTime = new Date(analyticsData.timeLeft.endDate);
    const interval = setInterval(() => {
      const currentTime = new Date();
      const timeDifference = endTime.getTime() - currentTime.getTime();
      const hours = Math.floor(timeDifference / (1000 * 60 * 60));
      const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
      setTimeLeft(`${hours}h ${minutes}m`);
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const hackathon = useSelector(currentHackathonSelector);

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      const res = await getHandler(`/org/${hackathon.organizationID}/hackathons/${hackathon.id}/analytics/live`);
      if (res.statusCode == 200) {
        setTotalTeams(res.data.totalTeams);
        setTotalUsers(res.data.totalUsers);
        setTotalTeamsLeft(res.data.totalTeamsLeft);
        setTotalUsersLeft(res.data.totalUsersLeft);
      }
    };

    fetchAnalyticsData();
  }, []);
  return (
    <div className="w-full grid grid-cols-3 gap-4">
      <AnalyticBox className="flex flex-col justify-between">
        <div className="flex items-start justify-between">
          <span>
            <h3 className="text-sm font-semibold text-primary_btn">Users Left</h3>
            <h1 className="text-xl font-semibold">{totalUsersLeft}</h1>
          </span>
          {analyticsData.users_left.Icon}
        </div>
        {/* <span className={`${analyticsData.users_left.increase ? 'text-green-600' : 'text-red-600'} font-medium text-xs flex items-center gap-2`}>
          {analyticsData.users_left.increase && <TrendUp size={20} />}
          {!analyticsData.users_left.increase && <TrendDown size={20} />}
          <p>{analyticsData.users_left.trend}</p>
        </span> */}
      </AnalyticBox>
      <AnalyticBox className="flex flex-col gap-5 justify-between">
        <div className="flex items-start justify-between">
          <span>
            <h3 className="text-sm font-semibold text-primary_btn">Total Users</h3>
            <h1 className="text-xl font-semibold">{totalUsers}</h1>
          </span>
          {analyticsData.total_users.Icon}
        </div>
        {/* <span className={`${analyticsData.total_users.increase ? 'text-green-600' : 'text-red-600'} font-medium text-xs flex items-center gap-2`}>
          {analyticsData.total_users.increase && <TrendUp size={20} />}
          {!analyticsData.total_users.increase && <TrendDown size={20} />}
          <p>{analyticsData.total_users.trend}</p>
        </span> */}
      </AnalyticBox>
      <AnalyticBox>
        <div className="flex flex-col gap-0">
          <span className="flex items-center text-xs font-medium justify-between">
            <h1 className="uppercase   text-black/70">{analyticsData.engagement_rate.heading}</h1>
            <p className={`${analyticsData.engagement_rate.increase ? 'text-green-500' : 'text-red-500'}`}>{analyticsData.engagement_rate.trend}</p>
          </span>
          <h1 className="text-xl font-semibold">{analyticsData.engagement_rate.value}</h1>
        </div>
        {/* <ChartContainer config={chartConfig} className="h-[70px] w-full">
          <BarChart accessibilityLayer data={chartData}>
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
            <Bar dataKey="mobile" fill="var(--color-mobile)" radius={4} />
          </BarChart>
        </ChartContainer> */}
      </AnalyticBox>
      <AnalyticBox className="flex flex-col gap-5 justify-between">
        <div className="flex items-start justify-between">
          <span>
            <h3 className="text-sm font-semibold text-primary_btn">Teams Left</h3>
            <h1 className="text-xl font-semibold">{totalTeamsLeft}</h1>
          </span>
          {analyticsData.team_left.Icon}
        </div>
        {/* <span className={`${analyticsData.team_left.increase ? 'text-green-600' : 'text-red-600'} font-medium text-xs flex items-center gap-2`}>
          {analyticsData.team_left.increase && <TrendUp size={20} />}
          {!analyticsData.team_left.increase && <TrendDown size={20} />}
          <p>{analyticsData.team_left.trend}</p>
        </span> */}
      </AnalyticBox>
      <AnalyticBox className="flex flex-col gap-5 justify-between">
        <div className="flex items-start justify-between">
          <span>
            <h3 className="text-sm font-semibold text-primary_btn">Total Teams</h3>
            <h1 className="text-xl font-semibold">{totalTeams}</h1>
          </span>
          {analyticsData.total_teams.Icon}
        </div>
        {/* <span className={`${analyticsData.total_teams.increase ? 'text-green-600' : 'text-red-600'} font-medium text-xs flex items-center gap-2`}>
          {analyticsData.total_teams.increase && <TrendUp size={20} />}
          {!analyticsData.total_teams.increase && <TrendDown size={20} />}
          <p>{analyticsData.total_teams.trend}</p>
        </span> */}
      </AnalyticBox>
      <AnalyticBox className="h-[150px] overflow-hidden">
        <ChartContainer config={chartConfig2} className="mx-auto aspect-square w-full max-w-[250px]">
          <RadialBarChart data={chartData2} endAngle={180} innerRadius={80} outerRadius={130}>
            <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
              <Label
                content={({ viewBox }) => {
                  if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                    return (
                      <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle">
                        <tspan x={viewBox.cx} y={(viewBox.cy || 0) - 16} className="fill-foreground text-2xl font-bold">
                          {timeLeft}
                        </tspan>
                        <tspan x={viewBox.cx} y={(viewBox.cy || 0) + 4} className="fill-muted-foreground">
                          {analyticsData.timeLeft.heading}
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
    </div>
  );
}
