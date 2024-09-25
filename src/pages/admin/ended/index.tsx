import { SERVER_ERROR } from '@/config/errors';
import getHandler from '@/handlers/get_handler';
import { HackathonRound, HackathonTeam } from '@/types';
import Toaster from '@/utils/toaster';
import React, { useEffect, useMemo, useState } from 'react';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import TeamSearchFilters from '@/components/team_search_filters';
import AdminLiveRoundAnalytics from '@/sections/analytics/admin_live_round_analytics';
import { currentHackathonSelector, markHackathonEnded, setCurrentHackathon } from '@/slices/hackathonSlice';
import { useSelector } from 'react-redux';
import { getHackathonRole } from '@/utils/funcs/hackathons';
import { ORG_URL } from '@/config/routes';
import BaseWrapper from '@/wrappers/base';
import moment from 'moment';
import InfiniteScroll from 'react-infinite-scroll-component';
import PictureList from '@/components/common/picture_list';
import { Button } from '@/components/ui/button';
import NewAnnouncement from '@/sections/new_announcement';
import ViewAnnouncements from '@/sections/view_announcements';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import postHandler from '@/handlers/post_handler';

const Index = () => {
  const [teams, setTeams] = useState<HackathonTeam[]>([]);
  const [currentRound, setCurrentRound] = useState<HackathonRound | null>(null);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [search, setSearch] = useState('');
  const [track, setTrack] = useState('');
  const [eliminated, setEliminated] = useState('');
  const [overallScore, setOverallScore] = useState(0);
  const [order, setOrder] = useState('latest');
  const hackathon = useSelector(currentHackathonSelector);
  const [clickedOnNewAnnouncement, setClickedOnNewAnnouncement] = useState(false);
  const [clickedOnViewAnnouncement, setClickedOnViewAnnouncement] = useState(false);
  const [clickedOnEndHackathon, setClickedOnEndHackathon] = useState(false);

  const fetchTeams = async (abortController?: AbortController, initialPage?: number) => {
    const URL = `${ORG_URL}/${hackathon.organizationID}/hackathons/${hackathon.id}/teams?page=${
      initialPage ? initialPage : page
    }&limit=${20}&search=${search}${track != '' && track != 'none' ? `&track_id=${track}` : ''}${
      overallScore != 0 ? `&overall_score=${overallScore}` : ''
    }${eliminated != '' && eliminated != 'none' ? `&is_eliminated=${eliminated == 'eliminated' ? 'true' : 'false'}` : ''}&order=${order}`;

    const res = await getHandler(URL, abortController?.signal);
    if (res.statusCode == 200) {
      if (initialPage == 1) {
        setTeams(res.data.teams || []);
      } else {
        const addedTeams = [...teams, ...(res.data.teams || [])];
        if (addedTeams.length === teams.length) setHasMore(false);
        setTeams(addedTeams);
      }
      setPage(prev => prev + 1);
      setLoading(false);
    } else {
      if (res.data.message) Toaster.error(res.data.message);
      else Toaster.error(SERVER_ERROR);
    }
  };

  let oldAbortController: AbortController | null = null;

  useEffect(() => {
    const abortController = new AbortController();
    if (oldAbortController) oldAbortController.abort();
    oldAbortController = abortController;
    if (!hackathon.id) window.location.replace(`/?redirect_url=${window.location.pathname}`);
    else {
      setPage(1);
      setTeams([]);
      setHasMore(true);
      setLoading(true);
      fetchTeams(abortController, 1);
    }

    return () => {
      abortController.abort();
    };
  }, [search, track, eliminated, overallScore, order]);

  useEffect(() => {
    const role = getHackathonRole();
    if (role != 'admin' && role != 'org') window.location.replace('/');
    else if (moment().isBefore(hackathon.teamFormationEndTime)) window.location.replace('/admin/teams');
    else if (!hackathon.isEnded) window.location.replace('/admin/live');
  }, []);

  const role = useMemo(() => getHackathonRole(), []);

  const handleEndHackathon = async () => {
    const URL = `/org/${hackathon.organizationID}/hackathons/${hackathon.id}/end`;
    const res = await postHandler(URL, { winners: [] });
    if (res.statusCode == 200) {
      markHackathonEnded();
      window.location.assign('/admin/ended');
    } else {
      if (res.data.message) Toaster.error(res.data.message);
      else Toaster.error(SERVER_ERROR);
    }
  };

  return (
    <BaseWrapper>
      {clickedOnNewAnnouncement && <NewAnnouncement setShow={setClickedOnNewAnnouncement} />}
      {clickedOnViewAnnouncement && <ViewAnnouncements setShow={setClickedOnViewAnnouncement} />}
      <div className="w-full bg-[#E1F1FF] min-h-screen">
        <div className="w-[95%] mx-auto h-full flex flex-col gap-2 md:gap-4 lg:gap-8">
          <div className="--meta-info-container  w-full h-fit flex flex-col gap-4 py-8">
            <div className="w-full flex flex-col md:flex-row items-start md:justify-between gap-6">
              <div className="--heading w-full h-full flex flex-col gap-8">
                <section className="w-full h-full text-center text-3xl md:text-4xl lg:text-7xl font-bold lg:leading-[4.5rem]">
                  <h1
                    style={{
                      background: '-webkit-linear-gradient(0deg, #607ee7,#478EE1)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}
                  >
                    The Hackathon has ended.
                  </h1>
                </section>
                <div className="w-full flex gap-4">
                  <Button onClick={() => setClickedOnNewAnnouncement(true)} className="w-1/2 bg-primary_text">
                    <span className="hidden md:block">
                      <div className="">Create New Announcement</div>
                    </span>
                  </Button>
                  <Button onClick={() => setClickedOnViewAnnouncement(true)} className="w-1/2 bg-primary_text">
                    <span className="hidden md:block">
                      <div className="">View All Announcements</div>
                    </span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
          <div className="--team-data-box flex flex-col gap-4">
            <TeamSearchFilters
              search={search}
              setSearch={setSearch}
              track={track}
              setTrack={setTrack}
              eliminated={eliminated}
              setEliminated={setEliminated}
              overallScore={overallScore}
              setOverallScore={setOverallScore}
              order={order}
              setOrder={setOrder}
            />
            <section className="--team-table">
              <InfiniteScroll className="w-full" dataLength={teams.length} next={fetchTeams} hasMore={hasMore} loader={<></>}>
                <Table className="bg-white rounded-md">
                  <TableCaption>A list of all the participating teams</TableCaption>
                  <TableHeader className="uppercase text-xs md:text-sm">
                    <TableRow>
                      <TableHead>Team Name</TableHead>
                      <TableHead>Project</TableHead>
                      <TableHead>Track</TableHead>
                      <TableHead className="hidden md:block">Members</TableHead>
                      <TableHead>Elimination Status</TableHead>
                      <TableHead>Overall Score</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody className="w-full">
                    {teams.map((team, index) => (
                      <TableRow onClick={() => window.location.assign('/admin/ended/' + team.id)} key={index} className="cursor-pointer">
                        <TableCell className="font-medium">{team.title}</TableCell>
                        <TableCell>{team.project?.title}</TableCell>
                        <TableCell>{team.track?.title}</TableCell>
                        <TableCell className="min-w-[150px] max-w-[300px] hidden md:flex items-center gap-2 flex-wrap">
                          <PictureList users={team.memberships.map(membership => membership.user)} size={6} />
                        </TableCell>
                        <TableCell>
                          <Status status={team.isEliminated ? 'eliminated' : 'not eliminated'} />
                        </TableCell>
                        <TableCell>{team.overallScore}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </InfiniteScroll>
            </section>
          </div>
        </div>
      </div>
    </BaseWrapper>
  );
};

export default Index;

export function Status({ status }: { status: 'eliminated' | 'not eliminated' }) {
  return (
    <button className={`${status === 'eliminated' ? 'bg-red-500' : 'bg-green-500'} text-white text-xs font-medium px-3 py-1 rounded-full`}>
      {status === 'eliminated' ? 'Eliminated' : 'Not Eliminated'}
    </button>
  );
}
