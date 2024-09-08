import TeamProjectsTable from '@/components/tables/teams_projects';
import { SERVER_ERROR } from '@/config/errors';
import { ORG_URL } from '@/config/routes';
import getHandler from '@/handlers/get_handler';
import { HackathonTeam } from '@/types';
import Toaster from '@/utils/toaster';
import { GetServerSidePropsContext } from 'next';
import React, { useEffect, useState } from 'react';

interface Props {
  hid: string;
}

const Index = ({ hid }: Props) => {
  const [teams, setTeams] = useState<HackathonTeam[]>([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);

  const fetchTeams = async (abortController?: AbortController, initialPage?: number) => {
    const URL = `/hackathons/${hid}/admin/teams`;
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

  return (
    <div>
      <div>Teams</div>
      <TeamProjectsTable teams={teams} fetcher={fetchTeams} hasMore={hasMore} />
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

export default Index;
