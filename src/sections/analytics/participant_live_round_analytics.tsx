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

export default function ParticipantLiveRoundAnalytics({ teamID, currentRound }: { teamID: string; currentRound: HackathonRound | null }) {
  const hackathon = useSelector(currentHackathonSelector);

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      const res = await getHandler(`/hackathons/${hackathon.id}/participants/analytics/${teamID}/live`);
      if (res.statusCode == 200) {
        console.log(res.data);
      } else {
        if (res.data.message) Toaster.error(res.data.message);
        else Toaster.error(SERVER_ERROR);
      }
    };

    fetchAnalyticsData();
  }, []);

  return (
    <div className="w-full flex flex-col gap-8">
      <div className="w-full flex gap-8">
        <div className="w-1/3 h-40 bg-white rounded-xl"></div>
        <div className="w-1/3 h-40 bg-white rounded-xl"></div>
        <div className="w-1/3 h-40 bg-white rounded-xl"></div>
      </div>
      <div className="w-full flex gap-8">
        <GraphCarousel currentRound={currentRound} />
        <div className="w-1/3 flex flex-col gap-8">
          <div className="w-full h-1/2 bg-white rounded-xl"></div>
          <div className="w-full h-1/2 bg-white rounded-xl"></div>
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

        <TimeGraphWrapper title={'Time Till Next Round'} time1={moment(currentRound?.startTime)} time2={moment(currentRound?.endTime)} />
      </Slider>
    </div>
  );
};
