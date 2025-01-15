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
  const [clickedOnNewAnnouncement, setClickedOnNewAnnouncement] = useState(false);
  const [clickedOnViewAnnouncement, setClickedOnViewAnnouncement] = useState(false);
  const [clickedOnEndHackathon, setClickedOnEndHackathon] = useState(false);

  const hackathon = useSelector(currentHackathonSelector);

  const getCurrentRound = async () => {
    const URL = `/hackathons/${hackathon.id}/participants/round`;
    const res = await getHandler(URL);
    if (res.statusCode == 200) {
      setCurrentRound(res.data.round);
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
      {clickedOnNewAnnouncement && <NewAnnouncement setShow={setClickedOnNewAnnouncement} />}
      {clickedOnViewAnnouncement && <ViewAnnouncements setShow={setClickedOnViewAnnouncement} />}
      <div className="w-full bg-[#E1F1FF] min-h-base p-12 max-md:p-8 flex flex-col gap-8">
        <div className=" w-full h-fit flex flex-col gap-4">
          <div className="w-full flex flex-col md:flex-row items-start md:justify-between gap-6">
            <div className="--heading w-full md:w-1/2 h-full flex flex-col gap-4">
              <section className="w-full h-full text-3xl md:text-4xl lg:text-6xl font-bold lg:leading-[4.5rem]">
                {currentRound ? (
                  <>
                    <h1
                      style={{
                        background: '-webkit-linear-gradient(0deg, #607ee7,#478EE1)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                      }}
                    >
                      Round {currentRound.index + 1} is Live!
                    </h1>
                    <div className="text-2xl w-3/4">
                      {moment().isBetween(moment(currentRound.judgingStartTime), moment(currentRound.endTime)) ? (
                        <div className="w-full flex flex-col gap-4">
                          <div className="text-[#003a7c]">Judging is Live!</div>
                          <div className="text-3xl">Ends {moment(currentRound.endTime).fromNow()}.</div>
                        </div>
                      ) : (
                        moment(currentRound.judgingStartTime).isAfter(moment()) && (
                          <>Judging Starts {moment(currentRound.judgingStartTime).fromNow()}.</>
                        )
                      )}
                    </div>
                    {/* <div className="w-full flex items-center gap-4 mt-4">
                    <EditDetailsBtn rounds={rounds} />
                  </div> */}
                  </>
                ) : (
                  <>
                    <h1
                      style={{
                        background: '-webkit-linear-gradient(0deg, #607ee7,#478EE1)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                      }}
                    >
                      All Rounds have ended.
                    </h1>
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
                  </>
                )}
              </section>
              <div className="w-full flex gap-4 max-md:flex-col">
                <Button onClick={() => setClickedOnNewAnnouncement(true)} className="w-1/2 bg-primary_text">
                  <div className="">Create New Announcement</div>
                </Button>
                <Button onClick={() => setClickedOnViewAnnouncement(true)} className="w-1/2 bg-primary_text">
                  <div className="">View All Announcements</div>
                </Button>
              </div>
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
