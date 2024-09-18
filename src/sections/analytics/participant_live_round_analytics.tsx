import React, { useEffect, useState } from 'react';
import { AnalyticBox } from './team_overview';
import { UsersFour, UsersThree } from '@phosphor-icons/react';
import getHandler from '@/handlers/get_handler';
import { useSelector } from 'react-redux';
import { currentHackathonSelector } from '@/slices/hackathonSlice';
import { HackathonRound } from '@/types';
import TimeProgressGraph from '@/components/common/time_graph';
import moment from 'moment';
import Toaster from '@/utils/toaster';
import { SERVER_ERROR } from '@/config/errors';
import Slider from 'react-slick';
import ComparisonScoreBar from './comparison_score_bar';

export default function ParticipantLiveRoundAnalytics({ teamID, currentRound }: { teamID: string; currentRound: HackathonRound | null }) {
  const [analyticsData, setAnalyticsData] = useState({
    figmaHistoriesPercentageChange: 0,
    githubCommitPercentageChange: 0,
    maxActivityCount: 0,
    minActivityCount: 0,
    teamsLeftInTrack: 0,
    totalActivityCount: 0,
    totalFigmaHistories: 0,
    totalGithubCommits: 0,
    trackPrize: 0,
  });

  const hackathon = useSelector(currentHackathonSelector);

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      const res = await getHandler(`/hackathons/${hackathon.id}/participants/analytics/${teamID}/live`);
      if (res.statusCode == 200) {
        const data = res.data;
        setAnalyticsData({
          figmaHistoriesPercentageChange: data.figmaHistoriesPercentageChange || 0,
          githubCommitPercentageChange: data.githubCommitPercentageChange || 0,
          maxActivityCount: data.maxActivityCount || 0,
          minActivityCount: data.minActivityCount || 0,
          teamsLeftInTrack: data.teamsLeftInTrack || 0,
          totalActivityCount: data.totalActivityCount || 0,
          totalFigmaHistories: data.totalFigmaHistories || 0,
          totalGithubCommits: data.totalGithubCommits || 0,
          trackPrize: data.trackPrize || 0,
        });
      } else {
        if (res.data.message) Toaster.error(res.data.message);
        else Toaster.error(SERVER_ERROR);
      }
    };

    fetchAnalyticsData();
  }, []);

  return (
    <div className="w-full flex flex-col gap-6">
      <div className="w-full flex gap-6">
        <AnalyticsCard
          title="Github Commits"
          value={analyticsData.totalGithubCommits}
          change={analyticsData.githubCommitPercentageChange == 0 ? undefined : analyticsData.githubCommitPercentageChange}
        />
        <AnalyticsCard
          title="Figma Activity"
          value={analyticsData.totalFigmaHistories}
          change={analyticsData.figmaHistoriesPercentageChange == 0 ? undefined : analyticsData.figmaHistoriesPercentageChange}
        />
        <div className="w-1/3 h-36 bg-white rounded-xl p-4">
          <ComparisonScoreBar max={analyticsData.maxActivityCount} min={analyticsData.minActivityCount} score={analyticsData.totalActivityCount} />
        </div>
      </div>
      <div className="w-full flex gap-6">
        <GraphCarousel currentRound={currentRound} />
        <div className="w-1/3 flex flex-col gap-6">
          <div className="w-full h-1/2 bg-white rounded-xl p-3">
            <div className="text font-medium">Track Prize</div>
            <div className="text-3xl font-semibold">{analyticsData.trackPrize}</div>
          </div>
          <div className="w-full h-1/2 bg-white rounded-xl p-3">
            <div className="text font-medium">Teams Left</div>
            <div className="text-3xl font-semibold">{analyticsData.teamsLeftInTrack}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

const TimeGraphWrapper = ({ title, time1, time2 }: { title?: String; time1: moment.Moment; time2: moment.Moment }) => {
  return (
    <div className="w-full h-fit">
      {title && <div className="py-4 text-center font-medium text-gray-500">{title}</div>}
      <TimeProgressGraph time1={time1} time2={time2} height={130} innerRadius={100} outerRadius={150} />
    </div>
  );
};

const GraphCarousel = ({ currentRound }: { currentRound: HackathonRound | null }) => {
  const isJudgingActive = moment().isBetween(moment(currentRound?.judgingStartTime), moment(currentRound?.judgingEndTime));

  const showTimeTillJudging = moment(currentRound?.judgingStartTime).isAfter(moment());

  const settings = {
    dots: false,
    infinite: isJudgingActive || isJudgingActive,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    autoplay: true,
    autoplaySpeed: 5000,
  };

  return (
    <div className="w-2/3 bg-white rounded-xl gap-3 md:gap-4 pb-4">
      <Slider {...settings} className="">
        {isJudgingActive && (
          <TimeGraphWrapper title={'Time For Judging'} time1={moment(currentRound?.judgingStartTime)} time2={moment(currentRound?.judgingEndTime)} />
        )}
        {showTimeTillJudging && (
          <TimeGraphWrapper title={'Time Till Judging'} time1={moment(currentRound?.startTime)} time2={moment(currentRound?.judgingStartTime)} />
        )}

        <TimeGraphWrapper title={'Time Till Round Ends'} time1={moment(currentRound?.startTime)} time2={moment(currentRound?.endTime)} />
      </Slider>
    </div>
  );
};

export const AnalyticsCard = ({ title, value, change }: { title: string; value: number; change?: number }) => (
  <div className="w-1/3 h-36 flex flex-col justify-between bg-white rounded-xl p-4">
    <div className="w-full flex flex-col gap-1">
      <div className="text font-medium">{title}</div>
      <div className="text-3xl font-semibold">{value}</div>
    </div>
    {change && change != 0 && (
      <div className={`${change > 0 ? 'text-priority_low' : 'text-priority_high'} text-xs`}>{`${change}% ${
        change > 0 ? 'increase' : 'decrease'
      }`}</div>
    )}
  </div>
);
