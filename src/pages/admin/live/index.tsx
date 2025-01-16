import { SERVER_ERROR } from '@/config/errors';
import getHandler from '@/handlers/get_handler';
import { HackathonRound } from '@/types';
import Toaster from '@/utils/toaster';
import React, { useEffect, useMemo, useState } from 'react';
import AdminLiveRoundAnalytics from '@/sections/analytics/admin_live_round_analytics';
import { currentHackathonSelector, markHackathonEnded } from '@/slices/hackathonSlice';
import { useDispatch, useSelector } from 'react-redux';
import { getHackathonRole } from '@/utils/funcs/hackathons';
import BaseWrapper from '@/wrappers/base';
import moment from 'moment';
import { Button } from '@/components/ui/button';
import NewAnnouncement from '@/sections/admin/new_announcement';
import ViewAnnouncements from '@/sections/admin/view_announcements';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import postHandler from '@/handlers/post_handler';
import TeamProjectsTable from '@/components/tables/teams_projects';

const Index = () => {
  const [currentRound, setCurrentRound] = useState<HackathonRound | null>(null);
  const [nextRound, setNextRound] = useState<HackathonRound | null>(null);
  const [clickedOnEndHackathon, setClickedOnEndHackathon] = useState(false);
  const [announcementReloadTrigger, setAnnouncementReloadTrigger] = useState(false);

  const hackathon = useSelector(currentHackathonSelector);

  const getCurrentRound = async () => {
    const URL = `/hackathons/${hackathon.id}/participants/round`;
    const res = await getHandler(URL);
    if (res.statusCode == 200) {
      setCurrentRound(res.data.round);
      setNextRound(res.data.nextRound);
    } else {
      Toaster.error(res.data.message || SERVER_ERROR);
    }
  };

  useEffect(() => {
    const role = getHackathonRole();
    if (role != 'admin' && role != 'org') window.location.replace('/?action=sync');
    else if (hackathon.isEnded) window.location.replace('/admin/ended');
    else if (moment().isBefore(hackathon.teamFormationEndTime)) window.location.replace('/admin/teams');
    else getCurrentRound();
  }, []);

  const role = useMemo(() => getHackathonRole(), []);

  const dispatch = useDispatch();

  const handleEndHackathon = async () => {
    const URL = `/org/${hackathon.organizationID}/hackathons/${hackathon.id}/end`;
    const res = await postHandler(URL, { winners: [] });
    if (res.statusCode == 200) {
      dispatch(markHackathonEnded());
      window.location.assign('/admin/ended');
    } else {
      Toaster.error(res.data.message || SERVER_ERROR);
    }
  };

  return (
    <BaseWrapper>
      <div className="w-full bg-[#E1F1FF] min-h-base p-12 max-md:p-8 flex flex-col gap-8">
        <div className=" w-full h-fit flex flex-col gap-4">
          <div className="w-full flex flex-col md:flex-row items-start md:justify-between gap-6">
            <div className="--heading w-full md:w-1/2 h-full flex flex-col gap-4">
              <div className="w-full h-full">
                <div className="text-xl">Now Ongoing</div>
                <div
                  style={{
                    background: '-webkit-linear-gradient(0deg, #607ee7,#478EE1)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                  className="text-3xl md:text-4xl lg:text-8xl font-bold"
                >
                  {currentRound ? `Round ${currentRound.index + 1}` : 'Break'}
                </div>
                <div className="text-2xl w-3/4 font-medium">
                  {currentRound ? (
                    moment().isBetween(moment(currentRound.judgingStartTime), moment(currentRound.endTime)) ? (
                      'Judging is Live!'
                    ) : (
                      moment(currentRound.judgingStartTime).isAfter(moment()) && `Judging Starts ${moment(currentRound.judgingStartTime).fromNow()}.`
                    )
                  ) : nextRound ? (
                    ` Round ${nextRound.index + 1} Starts ${moment(nextRound.startTime).fromNow()}.`
                  ) : (
                    <div>
                      All rounds are over. It&apos;s time to end the hackathon!
                      {role == 'admin' && (
                        <Dialog open={clickedOnEndHackathon} onOpenChange={setClickedOnEndHackathon}>
                          <DialogTrigger className="w-full text-base font-medium bg-red-500 text-white py-2 rounded-md">End Hackathon</DialogTrigger>
                          <DialogContent>
                            <DialogHeader className="text-left">
                              <DialogTitle>End Hackathon</DialogTitle>
                              <DialogDescription>
                                This action can not be undone. This will mark this hackathon as ended, no further actions would be possible.
                              </DialogDescription>
                            </DialogHeader>
                            <Button onClick={handleEndHackathon} variant={'destructive'}>
                              Confirm
                            </Button>
                          </DialogContent>
                        </Dialog>
                      )}
                    </div>
                  )}
                </div>
              </div>
              {(currentRound || nextRound) && (
                <div className="w-full flex gap-4 max-md:flex-col">
                  <NewAnnouncement setTriggerReload={setAnnouncementReloadTrigger} />
                  <ViewAnnouncements triggerReload={announcementReloadTrigger} />
                </div>
              )}
            </div>
            <AdminLiveRoundAnalytics round={currentRound} />
          </div>
        </div>
        <TeamProjectsTable />
      </div>
    </BaseWrapper>
  );
};

export default Index;
