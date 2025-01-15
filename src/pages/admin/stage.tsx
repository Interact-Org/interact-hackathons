import TeamOverviewAnalytics from '@/sections/analytics/team_overview';
import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { useSelector } from 'react-redux';
import { currentHackathonSelector } from '@/slices/hackathonSlice';
import { getHackathonRole } from '@/utils/funcs/hackathons';
import BaseWrapper from '@/wrappers/base';
import TeamsTable from '@/components/tables/teams';
import getHandler from '@/handlers/get_handler';
import { SERVER_ERROR } from '@/config/errors';
import Toaster from '@/utils/toaster';
import { HackathonRound } from '@/types';

const Stage = () => {
  const [nextRound, setNextRound] = useState<HackathonRound | null>(null);

  const hackathon = useSelector(currentHackathonSelector);

  const getCurrentRound = async () => {
    const URL = `/hackathons/${hackathon.id}/participants/round`;
    const res = await getHandler(URL, undefined, true);
    if (res.statusCode == 200) {
      if (res.data.round) {
        window.location.replace('/admin/live');
      }
      setNextRound(res.data.nextRound);
    } else {
      Toaster.error(res.data.message || SERVER_ERROR);
    }
  };

  useEffect(() => {
    const role = getHackathonRole();
    if (role != 'admin' && role != 'org') window.location.replace('/?action=sync');
    else {
      const now = moment();
      if (hackathon.isEnded) window.location.replace('/admin/ended');
      else if (now.isBetween(moment(hackathon.teamFormationStartTime), moment(hackathon.teamFormationEndTime)))
        window.location.replace('/admin/team');
      else getCurrentRound();
    }
  }, []);

  return (
    <BaseWrapper>
      <div className="w-full bg-[#E1F1FF] min-h-base p-12 max-md:p-8 flex flex-col gap-8">
        <div className=" w-full h-fit">
          <div className="w-full mx-auto flex flex-col items-center md:flex-row gap-4 md:gap-8">
            <div className="w-full md:w-1/2 flex-center items-start flex-col gap-2">
              <h4 className="w-fit gradient-text-3 text-8xl">Team Overview</h4>
              <div className="font-semibold text-xl">Team Formation has Ended. Round 1 starts {moment(nextRound?.startTime).fromNow()}</div>
            </div>
            <div className="--analytics w-full md:w-1/2 h-full">
              <TeamOverviewAnalytics nextRound={nextRound} />
            </div>
          </div>
        </div>
        <TeamsTable showAllFilters={false} />
      </div>
    </BaseWrapper>
  );
};

export default Stage;
