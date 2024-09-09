import { SERVER_ERROR } from '@/config/errors';
import getHandler from '@/handlers/get_handler';
import { HackathonTeam } from '@/types';
import Toaster from '@/utils/toaster';
import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Funnel, MagnifyingGlass, PencilSimple } from '@phosphor-icons/react';
import TeamSearchFilters from '@/components/team_search_filters';
import { Input } from '@/components/ui/input';
import { AvatarBox } from '@/components/common/avatar_box';
import { Button } from '@/components/ui/button';
import LiveRoundAnalytics from '@/sections/analytics/live_round_analytics';
import TeamActions from '@/components/team_actions';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { currentHackathonSelector } from '@/slices/hackathonSlice';
import { useSelector } from 'react-redux';

interface Filter {
  name: string;
  checked: boolean;
}

const Index = () => {
  const [teams, setTeams] = useState<HackathonTeam[]>([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [tempQuery, setTempQuery] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

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
    const URL = `/hackathons/${hackathon.id}/admin/teams`;
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
  }, []);
  useEffect(() => {
    const interval = setInterval(() => {
      setSearchQuery(tempQuery);
    }, 300);

    return () => {
      clearInterval(interval);
    };
  }, [tempQuery]);

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
          <section className="--search-filters flex items-center justify-between gap-4">
            <div className="--search-box w-full flex-grow relative h-10">
              <Input
                className="bg-white border-[2px] border-[#dedede] focus-visible:border-primary_text ring-0 focus-visible:ring-0 pl-10 h-10"
                placeholder="Search"
                value={tempQuery}
                onChange={e => {
                  setTempQuery(e.target.value);
                }}
              ></Input>
              <MagnifyingGlass size={16} className="absolute top-1/2 -translate-y-1/2 left-4" />
            </div>
            {/* <TeamSearchFilters /> */}
          </section>
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
                {sampleData.map((data, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{data.teamName}</TableCell>
                    <TableCell>{data.project}</TableCell>
                    <TableCell>{data.track}</TableCell>
                    <TableCell className="min-w-[150px] max-w-[300px] flex items-center gap-2 flex-wrap">
                      {data.members.map((member, index) => (
                        <AvatarBox key={index} name={member} />
                      ))}
                    </TableCell>
                    <TableCell>
                      <Status status={data.evaluationStatus} />
                      {/* You can put status as either pending or completed, check below for the status comp. code */}
                    </TableCell>
                    <TableCell>{data.scores}</TableCell>
                    <TableCell>
                      <TeamActions teamId={data.teamId} data={data} />
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
type sampleData = {
  teamName: string;
  project: string;
  track: string;
  members: string[];
  evaluationStatus: 'pending' | 'completed';
  scores: number;
  teamId: string;
};
const sampleData: sampleData[] = [
  {
    teamName: 'seCSI',
    project: 'Interact',
    track: 'Sustainable Development',
    members: ['Keshav Aneja', 'Pratham Mishra', 'Keshav Aneja', 'Keshav Aneja'],
    evaluationStatus: 'pending',
    scores: 928,
    teamId: '12345',
  },
  {
    teamName: 'seCSI',
    project: 'Interact',
    track: 'Sustainable Development',
    members: ['Keshav Aneja', 'Pratham Mishra', 'Keshav Aneja', 'Keshav Aneja'],
    evaluationStatus: 'completed',
    scores: 928,
    teamId: '12345',
  },
  {
    teamName: 'seCSI',
    project: 'Interact',
    track: 'Sustainable Development',
    members: ['Keshav Aneja', 'Pratham Mishra', 'Keshav Aneja', 'Keshav Aneja'],
    evaluationStatus: 'pending',
    scores: 928,
    teamId: '12345',
  },
  {
    teamName: 'seCSI',
    project: 'Interact',
    track: 'Sustainable Development',
    members: ['Keshav Aneja', 'Pratham Mishra', 'Keshav Aneja', 'Keshav Aneja'],
    evaluationStatus: 'completed',
    scores: 928,
    teamId: '12345',
  },
  {
    teamName: 'seCSI',
    project: 'Interact',
    track: 'Sustainable Development',
    members: ['Keshav Aneja', 'Pratham Mishra', 'Keshav Aneja', 'Keshav Aneja'],
    evaluationStatus: 'pending',
    scores: 928,
    teamId: '12345',
  },
  {
    teamName: 'seCSI',
    project: 'Interact',
    track: 'Sustainable Development',
    members: ['Keshav Aneja', 'Pratham Mishra', 'Keshav Aneja', 'Keshav Aneja'],
    evaluationStatus: 'completed',
    scores: 928,
    teamId: '12345',
  },
];
