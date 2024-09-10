import { SERVER_ERROR } from '@/config/errors';
import getHandler from '@/handlers/get_handler';
import TeamOverviewAnalytics from '@/sections/analytics/team_overview';
import { HackathonTeam } from '@/types';
import Toaster from '@/utils/toaster';
import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import TeamSearchFilters from '@/components/team_search_filters';
import moment from 'moment';
import PictureList from '@/components/common/picture_list';
import { useSelector } from 'react-redux';
import { currentHackathonSelector } from '@/slices/hackathonSlice';
import { getHackathonRole } from '@/utils/funcs/hackathons';
import { ORG_URL } from '@/config/routes';
import BaseWrapper from '@/wrappers/base';
import InfiniteScroll from 'react-infinite-scroll-component';

const Teams = () => {
  const [teams, setTeams] = useState<HackathonTeam[]>([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [search, setSearch] = useState('');
  const [track, setTrack] = useState('');
  const [isEliminated, setIsEliminated] = useState(false);
  const [overallScore, setOverallScore] = useState(0);
  const [order, setOrder] = useState('latest');

  const hackathon = useSelector(currentHackathonSelector);

  const fetchTeams = async (abortController?: AbortController, initialPage?: number) => {
    const URL = `${ORG_URL}/${hackathon.organizationID}/hackathons/${hackathon.id}/teams?page=${page}&limit=${20}&search=${search}${
      track != '' ? `&track=${track}` : ''
    }${overallScore != 0 ? `&overall_score=${overallScore}` : ''}&order=${order}`;
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
    } else if (res.status != -1) {
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

      abortController.abort();
      fetchTeams(abortController, 1);
    }

    return () => {
      abortController.abort();
    };
  }, [search, track, isEliminated, overallScore, order]);

  useEffect(() => {
    const role = getHackathonRole();
    if (role != 'admin' && role != 'org') window.location.replace('/');
  }, []);

  return (
    <BaseWrapper>
      <div className="w-full bg-[#E1F1FF] min-h-screen">
        <div className="w-[95%] mx-auto h-full flex flex-col gap-8">
          <div className="--meta-info-container  w-full h-fit py-4">
            <div className="w-full flex flex-col md:flex-row items-start md:justify-between gap-6">
              <section className="--heading w-full md:w-1/2 h-full text-3xl md:text-4xl lg:text-6xl font-bold lg:leading-[4.5rem]">
                <h1
                  style={{
                    background: '-webkit-linear-gradient(0deg, #607ee7,#478EE1)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                  className="text-7xl"
                >
                  Team Overview
                </h1>
                <h1 className="text-4xl">Manage, Monitor, and Analyze Participation</h1>
              </section>
              <aside className="--analytics w-full md:w-1/2 h-full">
                <TeamOverviewAnalytics />
              </aside>
            </div>
          </div>
          <div className="--team-data-box flex flex-col gap-4">
            <TeamSearchFilters
              search={search}
              setSearch={setSearch}
              track={track}
              setTrack={setTrack}
              isEliminated={isEliminated}
              setIsEliminated={setIsEliminated}
              overallScore={overallScore}
              setOverallScore={setOverallScore}
              order={order}
              setOrder={setOrder}
            />
            <section className="--team-table">
              <InfiniteScroll className="w-full" dataLength={teams.length} next={fetchTeams} hasMore={hasMore} loader={<></>}>
                <Table className="bg-white rounded-md">
                  <TableHeader className="uppercase">
                    <TableRow>
                      <TableHead className="min-w-[100px] w-1/4">Team Name</TableHead>
                      <TableHead>Created By</TableHead>
                      <TableHead>Members</TableHead>
                      <TableHead>Track</TableHead>
                      <TableHead>Created At</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {teams.map(team => (
                      <TableRow key={team.id}>
                        <TableCell className="font-medium">{team.title}</TableCell>
                        <TableCell>{team.user.name}</TableCell>
                        <TableCell className="min-w-[150px] max-w-[300px] flex items-center gap-2 flex-wrap">
                          <PictureList users={team.memberships.map(membership => membership.user)} size={6} gap={7} />
                        </TableCell>
                        <TableCell>{team.track?.title}</TableCell>
                        <TableCell>{moment(team.createdAt).format('hh:mm a DD MMMM')}</TableCell>
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

export default Teams;
