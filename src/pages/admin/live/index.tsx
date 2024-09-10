import { SERVER_ERROR } from '@/config/errors';
import getHandler from '@/handlers/get_handler';
import { HackathonRound, HackathonTeam } from '@/types';
import Toaster from '@/utils/toaster';
import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import TeamSearchFilters from '@/components/team_search_filters';
import { AvatarBox } from '@/components/common/avatar_box';
import LiveRoundAnalytics from '@/sections/analytics/live_round_analytics';
import TeamActions from '@/components/team_actions';
import { currentHackathonSelector } from '@/slices/hackathonSlice';
import { useSelector } from 'react-redux';
import { getHackathonRole } from '@/utils/funcs/hackathons';
import { ORG_URL } from '@/config/routes';
import BaseWrapper from '@/wrappers/base';
import moment from 'moment';

interface Filter {
  name: string;
  checked: boolean;
}

const Index = () => {
  const [teams, setTeams] = useState<HackathonTeam[]>([]);
  const [currentRound, setCurrentRound] = useState<HackathonRound | null>(null);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [search, setSearch] = useState('');
  const [track, setTrack] = useState('');
  const [isEliminated, setIsEliminated] = useState(false);
  const [overallScore, setOverallScore] = useState(0);
  const [order, setOrder] = useState('latest');

  const hackathon = useSelector(currentHackathonSelector);

  const getCurrentRound = async () => {
    const URL = `/hackathons/${hackathon.id}/participants/round`;
    const res = await getHandler(URL);
    if (res.statusCode == 200) {
      setCurrentRound(res.data.round);
    } else {
      if (res.data.message) Toaster.error(res.data.message);
      else Toaster.error(SERVER_ERROR);
    }
  };

  const fetchTeams = async (abortController?: AbortController, initialPage?: number) => {
    const URL = `${ORG_URL}/${hackathon.organizationID}/hackathons/${hackathon.id}/teams?page=${page}&limit=${20}&search=${search}${
      overallScore != 0 ? `&overall_score=${overallScore}` : ''
    }&order=${order}`;
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
      getCurrentRound();
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
            <div className="w-full flex items-start justify-between gap-6">
              {currentRound && (
                <section className="--heading w-1/2 h-full text-6xl font-bold leading-[4.5rem] flex flex-col gap-4">
                  <h1
                    style={{
                      background: '-webkit-linear-gradient(0deg, #607ee7,#478EE1)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}
                  >
                    Round {currentRound.index + 1} is Live!
                  </h1>
                  <div className="text-3xl"> Ends {moment(currentRound.endTime).fromNow()}.</div>
                  <div className="text-4xl w-3/4">
                    {moment().isBetween(moment(currentRound.judgingStartTime), moment(currentRound.judgingEndTime)) ? (
                      <>Judging is Live! Ends {moment(currentRound.judgingEndTime).fromNow()}.</>
                    ) : (
                      moment(currentRound.judgingStartTime).isAfter(moment()) && (
                        <>Next Judging Round Starts {moment(currentRound.judgingStartTime).fromNow()}.</>
                      )
                    )}
                  </div>
                </section>
              )}

              <aside className="--analytics w-1/2 h-full">
                <div className="w-full h-full">
                  <LiveRoundAnalytics round={currentRound} />
                </div>
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
            />{' '}
            <section className="--team-table">
              <Table className="bg-white rounded-md">
                <TableCaption>A list of all the participating teams</TableCaption>
                <TableHeader className="uppercase">
                  <TableRow>
                    <TableHead>Team Name</TableHead>
                    <TableHead>Project</TableHead>
                    <TableHead>Track</TableHead>
                    <TableHead>Members</TableHead>
                    <TableHead>Elimination Status</TableHead>
                    <TableHead>Scores</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {teams.map((team, index) => (
                    <TableRow onClick={() => window.location.assign('/admin/live/' + team.id)} key={index}>
                      <TableCell className="font-medium">{team.title}</TableCell>
                      <TableCell>{team.project?.title}</TableCell>
                      <TableCell>{team.track?.title}</TableCell>
                      <TableCell className="min-w-[150px] max-w-[300px] flex items-center gap-2 flex-wrap">
                        {team.memberships.map((membership, index) => (
                          <AvatarBox key={index} name={membership.user.name} />
                        ))}
                      </TableCell>
                      <TableCell>
                        <Status status={team.isEliminated ? 'eliminated' : 'not eliminated'} />
                      </TableCell>
                      <TableCell>{1}</TableCell>
                      <TableCell>
                        <TeamActions teamId={team.id} data={team} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
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
