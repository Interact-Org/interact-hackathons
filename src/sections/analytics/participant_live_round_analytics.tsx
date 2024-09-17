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

export default function ParticipantLiveRoundAnalytics({
  teamID,
  currentRound,
  nextRound,
}: {
  teamID: string;
  currentRound: HackathonRound | null;
  nextRound: HackathonRound | null;
}) {
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
    <div className="w-full grid grid-cols-2 md:grid-cols-2 gap-3 md:gap-4">
      {moment().isBetween(moment(currentRound?.judgingStartTime), moment(currentRound?.judgingEndTime)) ? (
        <TimeGraphWrapper title={'Time For Judging'} time1={moment(currentRound?.judgingStartTime)} time2={moment(currentRound?.judgingEndTime)} />
      ) : (
        moment(currentRound?.judgingStartTime).isAfter(moment()) && (
          <TimeGraphWrapper title={'Time Till Judging'} time1={moment(currentRound?.startTime)} time2={moment(currentRound?.judgingStartTime)} />
        )
      )}
      {nextRound && <TimeGraphWrapper title={'Time Till Next Round'} time1={moment(currentRound?.startTime)} time2={moment(nextRound?.startTime)} />}
    </div>
  );
}

const TimeGraphWrapper = ({ title, time1, time2 }: { title?: String; time1: moment.Moment; time2: moment.Moment }) => {
  return (
    <div className="w-full h-fit bg-white rounded-xl">
      {title && <div className="py-4 text-center font-medium text-gray-500">{title}</div>}
      <TimeProgressGraph time1={time1} time2={time2} height={130} className="hidden md:block" />
    </div>
  );
};
