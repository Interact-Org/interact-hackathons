import TeamsTable from '@/components/tables/teams';
import { SERVER_ERROR } from '@/config/errors';
import { ORG_URL } from '@/config/routes';
import getHandler from '@/handlers/get_handler';
import TeamOverviewAnalytics from '@/sections/analytics/team_overview';
import { HackathonTeam } from '@/types';
import Toaster from '@/utils/toaster';
import { GetServerSidePropsContext } from 'next';
import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

import { AvatarBox } from '@/components/common/avatar_box';
import { Input } from '@/components/ui/input';
import TeamSearchFilters from '@/components/team_search_filters';
import { MagnifyingGlass } from '@phosphor-icons/react';

interface Props {
  hid: string;
}

const Teams = ({ hid }: Props) => {
  const [teams, setTeams] = useState<HackathonTeam[]>([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [tempQuery, setTempQuery] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const fetchTeams = async (abortController?: AbortController, initialPage?: number) => {
    const URL = `${ORG_URL}/hackathons/${hid}/teams`;
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

    setPage(1);
    setTeams([]);
    setHasMore(true);
    setLoading(true);
    fetchTeams(abortController, 1);

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
                Team Overview
              </h1>
              <h1>Manage, Monitor, and Analyze Participation</h1>
            </section>
            <aside className="--analytics w-1/2 h-full">
              <TeamOverviewAnalytics />
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
            <TeamSearchFilters />
          </section>
          <section className="--team-table">
            <Table className="bg-white rounded-md">
              <TableCaption>A list of all the participating teams</TableCaption>
              <TableHeader className="uppercase">
                <TableRow>
                  <TableHead className="min-w-[100px] w-1/4">Team Name</TableHead>
                  <TableHead>Created By</TableHead>
                  <TableHead>Created At</TableHead>
                  <TableHead>Track</TableHead>
                  <TableHead>Members</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[1, 2, 3, 4].map(sample => (
                  <TableRow key={sample}>
                    <TableCell className="font-medium">seCSI</TableCell>
                    <TableCell>Keshav Aneja</TableCell>
                    <TableCell>31/10/2024</TableCell>
                    <TableCell>Sustainable Development</TableCell>
                    <TableCell className="min-w-[150px] max-w-[300px] flex items-center gap-2 flex-wrap">
                      <AvatarBox name="Keshav Aneja" />
                      <AvatarBox name="Pratham Mishra" />
                      <AvatarBox name="Keshav Aneja" />
                      <AvatarBox name="Keshav Aneja" />
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

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { query } = context;
  const hid = query.hid;

  if (!hid)
    return {
      redirect: {
        permanent: true,
        destination: '/',
      },
      props: { hid },
    };
  return {
    props: { hid },
  };
}

export default Teams;
