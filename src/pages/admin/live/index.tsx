import { SERVER_ERROR } from '@/config/errors';
import getHandler from '@/handlers/get_handler';
import { HackathonTeam } from '@/types';
import Toaster from '@/utils/toaster';
import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Funnel, PencilSimple } from '@phosphor-icons/react';
import TeamSearchFilters from '@/components/team_search_filters';
import { AvatarBox } from '@/components/common/avatar_box';
import { Button } from '@/components/ui/button';
import LiveRoundAnalytics from '@/sections/analytics/live_round_analytics';
import TeamActions from '@/components/team_actions';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { currentHackathonSelector } from '@/slices/hackathonSlice';
import { useSelector } from 'react-redux';
import { getHackathonRole } from '@/utils/funcs/hackathons';
import { ORG_URL } from '@/config/routes';

interface Filter {
  name: string;
  checked: boolean;
}

const Index = () => {
  const [teams, setTeams] = useState<HackathonTeam[]>([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [search, setSearch] = useState('');
  const [track, setTrack] = useState('');
  const [isEliminated, setIsEliminated] = useState(false);
  const [overallScore, setOverallScore] = useState(0);
  const [order, setOrder] = useState('latest');

  const [filters, setFilters] = useState<Filter[]>([
    { name: 'Filter 1', checked: false },
    { name: 'Filter 2', checked: false },
    { name: 'Filter 3', checked: false },
    { name: 'Filter 4', checked: false },
    { name: 'Filter 5', checked: false },
  ]);

  const handleFilterChange = (index: number) => {
    setFilters(prevFilters => {
      const updatedFilters = [...prevFilters];
      updatedFilters[index].checked = !updatedFilters[index].checked;
      return updatedFilters;
    });
  };

  const hackathon = useSelector(currentHackathonSelector);

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
    <div className="w-full bg-[#E1F1FF] min-h-screen">
      <header className="bg-white w-full py-1 px-4 font-semibold">Interact</header>
      <div className="w-[95%] mx-auto h-full flex flex-col gap-8">
        <div className="--meta-info-container  w-full h-fit py-4">
          <p className="text-xl font-medium">Team Up for Success Together</p>
          <div className="w-full flex items-start justify-between gap-6">
            <section className="--heading w-1/2 h-full text-6xl font-bold leading-[4.5rem]">
              <h1
                style={{
                  background: '-webkit-linear-gradient(0deg, #607ee7,#478EE1)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                ROUND 2 IS LIVE!
                <br />
                ENDS IN 18:47
              </h1>
              <h1 className="text-5xl w-3/4">NEXT JUDING ROUND STARTS IN 20:21</h1>
              <div className="flex items-center gap-4 mt-12">
                <Button className="gap-3 ">
                  <p>Edit Details</p>
                  <PencilSimple size={18} />
                </Button>
                <Dialog>
                  <DialogTrigger className="text-sm flex items-center gap-3 bg-neutral-900 text-white h-9 px-4 py-2 rounded-md">
                    <p>Filter Teams</p>
                    <Funnel size={18} />
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Filter Teams</DialogTitle>
                      <DialogDescription>
                        <p>Please select filters among the given options:</p>
                      </DialogDescription>
                    </DialogHeader>
                    {filters.map((filter, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <input type="checkbox" checked={filter.checked} onChange={() => handleFilterChange(index)} />
                        <label>{filter.name}</label>
                      </div>
                    ))}
                  </DialogContent>
                </Dialog>
              </div>
            </section>
            <aside className="--analytics w-1/2 h-full">
              <div className="w-full h-full">
                <LiveRoundAnalytics />
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
                  <TableHead>Evaluation Status</TableHead>
                  <TableHead>Scores</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {teams.map((team, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{team.title}</TableCell>
                    <TableCell>{team.project?.title}</TableCell>
                    <TableCell>{team.track}</TableCell>
                    <TableCell className="min-w-[150px] max-w-[300px] flex items-center gap-2 flex-wrap">
                      {team.members.map((member, index) => (
                        <AvatarBox key={index} name={member.name} />
                      ))}
                    </TableCell>
                    <TableCell>
                      <Status status={'completed'} />
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
  );
};

export default Index;

function Status({ status }: { status: 'pending' | 'completed' }) {
  return (
    <button className={`${status === 'pending' ? 'bg-red-500' : 'bg-green-500'} text-white text-xs font-medium px-3 py-1 rounded-full`}>
      {status === 'pending' ? 'Pending' : 'Completed'}
    </button>
  );
}
