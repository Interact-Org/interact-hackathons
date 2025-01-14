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
import { ORG_URL, USER_PROFILE_PIC_URL } from '@/config/routes';
import BaseWrapper from '@/wrappers/base';
import InfiniteScroll from 'react-infinite-scroll-component';
import Image from 'next/image';
import TeamMemberHoverCard from '@/components/team_member_hover_card';

const Teams = () => {
  const [teams, setTeams] = useState<HackathonTeam[]>([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [search, setSearch] = useState('');
  const [track, setTrack] = useState('');
  const [eliminated, setEliminated] = useState('');
  const [overallScore, setOverallScore] = useState(0);
  const [order, setOrder] = useState('latest');

  const hackathon = useSelector(currentHackathonSelector);

  const fetchTeams = async (abortController?: AbortController, initialPage?: number) => {
    const URL = `${ORG_URL}/${hackathon.organizationID}/hackathons/${hackathon.id}/teams?page=${
      initialPage ? initialPage : page
    }&limit=${20}&search=${search}${track != '' && track != 'none' ? `&track_id=${track}` : ''}${
      overallScore != 0 ? `&overall_score=${overallScore}` : ''
    }${eliminated != '' && eliminated != 'none' ? `&is_eliminated=${eliminated == 'eliminated' ? 'true' : 'false'}` : ''}&order=${order}`;

    const res = await getHandler(URL, abortController?.signal, true);
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
      Toaster.error(res.data.message || SERVER_ERROR);
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
    if (role != 'admin' && role != 'org') window.location.replace('/?action=sync');
    else if (hackathon.isEnded) window.location.replace('/admin/ended');
    else if (moment().isAfter(hackathon.teamFormationEndTime)) window.location.replace('/admin/live');
  }, []);

  return (
    <BaseWrapper>
      <div className="w-full bg-[#E1F1FF] min-h-base p-12 max-md:p-8 flex flex-col gap-8">
        <div className=" w-full h-fit">
          <div className="w-full mx-auto flex flex-col items-center md:flex-row gap-4 md:gap-8">
            <div className="w-full md:w-1/2 justify-center items-start flex-col gap-2">
              <h4 className="w-fit gradient-text-3 text-8xl">Team Overview</h4>
              <div className="text-3xl font-bold">Manage, Monitor, and Analyze Participation.</div>
            </div>
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
            eliminated={eliminated}
            setEliminated={setEliminated}
            overallScore={overallScore}
            setOverallScore={setOverallScore}
            order={order}
            setOrder={setOrder}
            showAll={false}
          />
          <section className="--team-table">
            <InfiniteScroll className="w-full" dataLength={teams.length} next={fetchTeams} hasMore={hasMore} loader={<></>}>
              <Table className="bg-white rounded-md">
                <TableHeader className="uppercase text-xs md:text-sm">
                  <TableRow>
                    <TableHead className="min-w-[100px] w-1/4">Team Name</TableHead>
                    <TableHead>Members</TableHead>
                    <TableHead>Track</TableHead>
                    <TableHead>Created By</TableHead>
                    <TableHead className="hidden md:block">Created At</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {teams.map(team => (
                    <TableRow key={team.id}>
                      <TableCell className="font-medium">{team.title}</TableCell>
                      <TableCell className="min-w-[150px] max-w-[300px] flex items-center gap-2 flex-wrap">
                        {team.memberships &&
                          team.memberships?.map((m, index) => {
                            return (
                              <TeamMemberHoverCard
                                key={index}
                                membership={m}
                                trigger={
                                  <Image
                                    key={index}
                                    crossOrigin="anonymous"
                                    width={50}
                                    height={50}
                                    alt={'User Pic'}
                                    src={`${USER_PROFILE_PIC_URL}/${m.user.profilePic}`}
                                    placeholder="blur"
                                    blurDataURL={m.user.profilePicBlurHash || 'no-hash'}
                                    className="w-6 h-6 rounded-full shadow-md cursor-pointer"
                                  />
                                }
                              />
                            );
                          })}
                      </TableCell>
                      <TableCell>{team.track?.title}</TableCell>
                      <TableCell className="max-md:hidden">
                        <div className="flex items-center gap-1">
                          <Image
                            crossOrigin="anonymous"
                            width={50}
                            height={50}
                            alt={'User Pic'}
                            src={`${USER_PROFILE_PIC_URL}/${team.user.profilePic}`}
                            placeholder="blur"
                            blurDataURL={team.user.profilePicBlurHash || 'no-hash'}
                            className="w-6 h-6 rounded-full cursor-default shadow-md"
                          />
                          {team.user.name}
                        </div>
                      </TableCell>
                      <TableCell className="max-md:hidden">{moment(team.createdAt).format('hh:mm a DD MMMM')}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </InfiniteScroll>
          </section>
        </div>
      </div>
    </BaseWrapper>
  );
};

export default Teams;
