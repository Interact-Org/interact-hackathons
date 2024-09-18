import React, { useEffect, useMemo, useState } from 'react';
import { Bar, BarChart, XAxis } from 'recharts';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { GithubRepo, HackathonTeam } from '@/types';
import moment from 'moment';
import { ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import getHandler from '@/handlers/get_handler';
import Toaster from '@/utils/toaster';
import { SERVER_ERROR } from '@/config/errors';
import Loader from '@/components/common/loader';
import { useSelector } from 'react-redux';
import { currentHackathonSelector } from '@/slices/hackathonSlice';

export const description = 'An interactive bar chart';

type MetricScore = {
  metric: string;
  score: number;
};

const convertRepoMetricsToArray = (repo: GithubRepo): MetricScore[] => {
  return Object.entries(repo).reduce<MetricScore[]>((acc, [key, value]) => {
    // Skip non-metric properties like repoName and repoLink
    if (typeof value === 'number') {
      acc.push({ metric: key, score: value });
    }

    return acc;
  }, []);
};

const chartConfig = {
  repo: {
    label: 'Github Repo',
    color: '#10b981',
  },
} satisfies ChartConfig;

const CodeQualityGraph = ({ teamID }: { teamID: string }) => {
  const [graphIndex, setGraphIndex] = useState(-1);
  const [githubRepos, setGithubRepos] = useState<GithubRepo[]>([]);
  const [loading, setLoading] = useState(true);

  const reposData = useMemo(() => githubRepos.map(repo => convertRepoMetricsToArray(repo as GithubRepo)), [githubRepos]);
  const chartData = useMemo(() => reposData[graphIndex], [graphIndex, reposData]);

  const hackathon = useSelector(currentHackathonSelector);

  useEffect(() => {
    const fetchRepositories = async () => {
      try {
        const URL = `/org/${hackathon.organizationID}/hackathons/${hackathon.id}/connections/${teamID}`;
        const res = await getHandler(URL);
        if (res.statusCode == 200) {
          setGithubRepos(res.data.githubRepos || []);
        } else {
          if (res.data.message) Toaster.error(res.data.message);
          else Toaster.error(SERVER_ERROR);
        }
        setLoading(false);
      } catch (err) {
        setLoading(false);
      }
    };

    fetchRepositories();
  }, [teamID]);

  return loading ? (
    <Loader />
  ) : (
    <AnalyticBox className="hidden md:block">
      <span className="flex items-center text-lg font-medium justify-between mb-4">
        <h1 className="uppercase text-black/70">Connected Repositories</h1>
      </span>
      {githubRepos && githubRepos.length > 0 ? (
        <div className="flex">
          {githubRepos.map((repo, index) => {
            const isActive = graphIndex === index;
            return (
              <button
                key={index}
                className={`relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left 
          sm:border-l sm:border-t-0 sm:px-8 sm:py-6 
          ${isActive ? 'bg-blue-100 border-blue-500 shadow-lg' : 'hover:bg-gray-100 hover:shadow-md'}
          transition-all duration-300 ease-in-out transform`}
                onClick={() => setGraphIndex(index)}
              >
                <div className="w-full flex items-center justify-between">
                  <span className="text-lg font-bold leading-none sm:text-3xl">{repo.repoName}</span>
                  <Link target="_blank" href={repo.repoLink}>
                    <ArrowUpRight />
                  </Link>
                </div>
                <span className="text-xs text-muted-foreground">Last Updated {moment(repo.updatedAt).fromNow()}</span>
              </button>
            );
          })}
        </div>
      ) : (
        <div>No Github Repositories are connected for analytics.</div>
      )}

      {graphIndex != -1 && (
        <ChartContainer config={chartConfig} className="h-fit w-full">
          <BarChart data={chartData}>
            <XAxis dataKey="metric" tickLine={false} tickMargin={10} axisLine={false} angle={-75} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="score" fill="var(--color-repo)" radius={4} />
          </BarChart>
        </ChartContainer>
      )}
    </AnalyticBox>
  );
};

type BoxProps = {
  children: React.ReactNode;
  className?: string;
};
export function AnalyticBox({ children, className }: BoxProps) {
  return <div className={`p-4 bg-white rounded-lg w-full ${className}`}>{children}</div>;
}

export default CodeQualityGraph;
