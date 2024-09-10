import { AnalyticBox } from '@/sections/analytics/team_overview';
import moment, { Moment } from 'moment';
import { useEffect, useState } from 'react';
import { RadialBarChart, PolarRadiusAxis, RadialBar } from 'recharts';
import { ChartConfig, ChartContainer } from '../ui/chart';

interface Props {
  time1: Moment;
  time2: Moment;
  innerRadius?: number;
  outerRadius?: number;
  height?: number;
}

const TimeProgressGraph = ({ time1, time2, innerRadius = 80, outerRadius = 120, height = 150 }: Props) => {
  const [timeLeft, setTimeLeft] = useState('');

  const totalTime = moment(time2).diff(moment(time1), 'seconds');
  const currentTime = moment();
  const remainingTime = Math.max(moment(time2).diff(currentTime, 'seconds'), 0);

  const remainingPercentage = (remainingTime / totalTime) * 100;

  useEffect(() => {
    if (totalTime <= 0) return;

    const updateRemainingTime = () => {
      const now = moment();
      const timeDifference = moment(time2).diff(now);

      if (timeDifference <= 0) {
        setTimeLeft('0h 0m');
        return;
      }

      const hours = Math.floor(timeDifference / (1000 * 60 * 60));
      const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
      setTimeLeft(`${hours}h ${minutes}m`);
    };

    const interval = setInterval(updateRemainingTime, 1000);
    updateRemainingTime();

    return () => clearInterval(interval);
  }, [time2, totalTime]);

  const chartData = [{ name: 'remaining', value: remainingPercentage }];

  const chartConfig = {
    remaining: {
      label: 'Time Remaining',
      color: remainingPercentage < 25 ? '#f87171' : '#60a5fa',
    },
  } satisfies ChartConfig;

  const variants = ['h-[130px]', 'h-[140px]', 'h-[150px]', 'h-[160px]', 'h-[170px]'];

  return (
    <AnalyticBox className={`h-[${height}px] overflow-hidden relative`}>
      <ChartContainer config={chartConfig} className="w-full aspect-square">
        <RadialBarChart
          data={chartData}
          startAngle={180}
          endAngle={180 * (1 - remainingPercentage / 100)}
          innerRadius={innerRadius}
          outerRadius={outerRadius}
        >
          <PolarRadiusAxis tick={false} tickLine={false} axisLine={false} />
          <RadialBar dataKey="value" cornerRadius={5} fill="var(--color-remaining)" className="stroke-transparent stroke-2" />
        </RadialBarChart>
      </ChartContainer>
      <div className="absolute inset-0 top-1/3 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold text-foreground">{timeLeft}</span>
        <span className="text-sm text-muted-foreground">Time Left</span>
      </div>
    </AnalyticBox>
  );
};

export default TimeProgressGraph;
