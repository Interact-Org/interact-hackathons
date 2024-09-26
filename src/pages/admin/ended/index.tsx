import { SERVER_ERROR } from '@/config/errors';
import getHandler from '@/handlers/get_handler';
import { HackathonTeam } from '@/types';
import Toaster from '@/utils/toaster';
import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import TeamSearchFilters from '@/components/team_search_filters';
import { currentHackathonSelector } from '@/slices/hackathonSlice';
import { useSelector } from 'react-redux';
import { getHackathonRole } from '@/utils/funcs/hackathons';
import { ORG_URL } from '@/config/routes';
import BaseWrapper from '@/wrappers/base';
import moment from 'moment';
import InfiniteScroll from 'react-infinite-scroll-component';
import PictureList from '@/components/common/picture_list';
import { Button } from '@/components/ui/button';
import NewAnnouncement from '@/sections/admin/new_announcement';
import ViewAnnouncements from '@/sections/admin/view_announcements';
import configuredAxios from '@/config/axios';
import { Loader } from 'lucide-react';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const Index = () => {
  const [teams, setTeams] = useState<HackathonTeam[]>([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [search, setSearch] = useState('');
  const [track, setTrack] = useState('');
  const [eliminated, setEliminated] = useState('');
  const [overallScore, setOverallScore] = useState(0);
  const [order, setOrder] = useState('latest');
  const hackathon = useSelector(currentHackathonSelector);
  const [clickedOnNewAnnouncement, setClickedOnNewAnnouncement] = useState(false);
  const [clickedOnViewAnnouncement, setClickedOnViewAnnouncement] = useState(false);
  const [loading, setLoading] = useState(false);

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

  const handleDownload = async (downloadType: 'team' | 'overall' | 'round', roundID?: string, roundIndex?: number) => {
    if (loading) return;
    try {
      let URL = `${ORG_URL}/${hackathon.organizationID}/hackathons/${hackathon.id}/csv`;
      let filename = hackathon.title.replaceAll(' ', '_');

      var isValid = true;

      switch (downloadType) {
        case 'team':
          URL += '/teams';
          filename += '_teams';
          break;
        case 'overall':
          URL += '/scores';
          filename += '_overall-scores';
          break;
        case 'round':
          if (!roundID || !roundIndex) isValid = false;
          else {
            URL += `/rounds/${roundID}`;
            filename += `_round-${roundID}-scores`;
          }
          break;
        default:
          isValid = false;
      }

      if (!isValid) return;

      setLoading(true);

      const response = await configuredAxios.get(URL, {
        responseType: 'blob',
      });

      const blob = new Blob([response.data], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename + '.csv');

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      window.URL.revokeObjectURL(url);
    } catch (error) {
      Toaster.error(SERVER_ERROR);
      console.error('Error downloading CSV:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <BaseWrapper>
      {clickedOnNewAnnouncement && <NewAnnouncement setShow={setClickedOnNewAnnouncement} />}
      {clickedOnViewAnnouncement && <ViewAnnouncements setShow={setClickedOnViewAnnouncement} />}
      <div className="w-full bg-[#E1F1FF] min-h-base">
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
                    The Hackathon has ended
                  </h1>
                </section>
                <div className="w-full flex gap-4 max-md:flex-col">
                  <Button onClick={() => setClickedOnNewAnnouncement(true)} className="w-1/2 bg-primary_text">
                    <div className="">Create New Announcement</div>
                  </Button>
                  <Button onClick={() => setClickedOnViewAnnouncement(true)} className="w-1/2 bg-primary_text">
                    <div className="">View All Announcements</div>
                  </Button>
                </div>
                <div className="w-full flex flex-col gap-2">
                  <div className="text-xl font-semibold">Event Reports (in CSV)</div>
                  <div className="w-full flex gap-4 max-md:flex-col relative">
                    {loading && (
                      <div className="w-full h-full bg-white flex-center absolute top-0 right-0 bg-opacity-50 rounded-lg">
                        <Loader />
                      </div>
                    )}
                    <Button onClick={() => handleDownload('team')} className="w-1/2 bg-priority_low" variant={'link'}>
                      <div className="font-semibold">Team Details</div>
                    </Button>
                    <Button onClick={() => handleDownload('overall')} className="w-1/2 bg-priority_low" variant={'link'}>
                      <div className="font-semibold">Overall Team Scores</div>
                    </Button>
                    <Button className="w-1/2 bg-priority_low text-primary_black" variant={'default'} disabled={true}>
                      <div className="font-semibold">Round Wise Team Scores</div>
                    </Button>
                    {/* <Button onClick={() => handleDownload('round')} className="w-1/2 bg-priority_low" variant={'link'}>
                      <Select value={''} onValueChange={()=>}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select Your Role" />
                        </SelectTrigger>
                        <SelectContent>
                          {sampleRoleData.map((role, index) => (
                            <SelectItem value={role} key={index}>
                              {role}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <div className="">Round Wise Team Scores</div>
                    </Button> */}
                  </div>
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
