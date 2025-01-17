import BaseWrapper from '@/wrappers/base';

import {
  Accordion,
} from "@/components/ui/accordion"

import { AppSidebar } from '@/components/prizes/app-sidebar';
import { TeamAccordianItem, TeamAccordianItemProps } from '@/components/prizes/team-accordian';
import PrizesCarousel, { PrizeCardProps } from '@/components/prizes/prize-carousel';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { getHackathonRole } from '@/utils/funcs/hackathons';
import { ORG_URL } from '@/config/routes';
import { useDispatch, useSelector } from 'react-redux';
import { currentHackathonSelector, markHackathonEnded } from '@/slices/hackathonSlice';
import getHandler from '@/handlers/get_handler';
import Toaster from '@/utils/toaster';
import { SERVER_ERROR } from '@/config/errors';
import { HackathonPrize, HackathonTeam, HackathonTrack } from '@/types';
import { initialHackathonPrize } from '@/types/initials';
import postHandler from '@/handlers/post_handler';

export default function PrizeDistributionPage (){
  const dispatch = useDispatch();
  const hackathon = useSelector(currentHackathonSelector);

  const [hackathonData, setHackathonData] = useState<{
    name: string,
    tagline: string,
    noTracks: number,
    noParticipants: number,
    remainingParticipants: number,
  }>({
    name: hackathon.title,
    tagline: String(hackathon.tagline),
    noTracks: 0,
    noParticipants: 0,
    remainingParticipants: 0
  })

  const [ prizeCards, setPrizeCards ] = useState<HackathonPrize[]>([]);

  const [ teamsList, setTeamsList ] = useState<HackathonTeam[]>([]);
  const [ displayTeams, setDisplayTeams ] = useState<HackathonTeam[]>([]);

  // const [slideInFrameIndex, setSlideInFrameIndex] = useState<number>(0)
  const [currentPrizeCardData, setCurrentPrizeCardData] = useState<HackathonPrize>(initialHackathonPrize);

  // tracks, prizes
  const getHackathonData = async ()=>{
    const URL = `${ORG_URL}/${hackathon.organizationID}/hackathons/${hackathon.id}`;
    const res = await getHandler(URL);
    if (res.statusCode === 200){
      const { tracks, prizes } = res.data.hackathon as { tracks: HackathonTrack[], prizes: HackathonPrize[] };
      setHackathonData({
        ...hackathonData,
        noTracks: tracks.length,
      })
      setPrizeCards(prizes || []);
    } else {
      Toaster.error(res.data?.message || SERVER_ERROR);
    }
  }

  // no of participants, remaining participants
  const getHackathonAnalytics = async ()=>{
    const URL = `${ORG_URL}/${hackathon.organizationID}/hackathons/${hackathon.id}/analytics/live`;
    const res = await getHandler(URL);
    if (res.statusCode === 200){
      const { totalUsers, totalUsersLeft } = res.data;
      setHackathonData({
        ...hackathonData,
        noParticipants: totalUsers,
        remainingParticipants: totalUsersLeft,
      })
    } else {
      Toaster.error(res.data?.message || SERVER_ERROR);
    }
  }

  // teams (without round wise scores)
  const getTeamsData = async () => {
    const URL = `${ORG_URL}/${hackathon.organizationID}/hackathons/${hackathon.id}/teams?populate=scores`;
    const res = await getHandler(URL);
    if (res.statusCode === 200){
      const { teams } = res.data as { teams: HackathonTeam[] };
      setTeamsList(teams || []);
      setDisplayTeams(teams || []);
    } else {
      Toaster.error(res.data?.message || SERVER_ERROR);
    }
  }

  const isPrizeDistributionComplete = () => {
    return prizeCards.every(prize=>!!prize.team);
  }

  const handleEndHackathon = async () => {
    if (!isPrizeDistributionComplete()) {
      Toaster.error("Please distribute all prizes before ending the hackathon");
      return;
    }

    const prizeWinners: {prizeID: string, teamID: string}[] = prizeCards.map(prize=>({
      prizeID: prize.id,
      teamID: prize.team!.id
    }))

    const URL = `${ORG_URL}/${hackathon.organizationID}/hackathons/${hackathon.id}/end`;
    const res = await postHandler(URL, prizeWinners); // { prizeID: "", teamID: "" }
    if (res.statusCode == 200) {
      dispatch(markHackathonEnded());
      window.location.assign('/admin/ended');
    } else {
      Toaster.error(res.data.message || SERVER_ERROR);
    }
  };

  const filterTeamBasedOnTrack = (trackID: string | undefined) => {
    if (!trackID || !teamsList.length) return;
    const filteredTeams = teamsList.filter(team=>team.track?.id === trackID);
    setDisplayTeams(filteredTeams);
  }

  const selectedTeamIds = useMemo(() => {
    return new Set(prizeCards.map(prize => prize.team?.id));
  }, [prizeCards]);

  const isTeamSelected = (team: HackathonTeam) => selectedTeamIds.has(team.id);

  const onTeamSelect = useCallback((team: HackathonTeam) => {
    const updatesPrizeCards = prizeCards.map(prize=>{
      if (prize.team?.id === team.id){
        return {
          ...prize,
          team: undefined
        }
      } else if (prize.id === currentPrizeCardData.id){
        return {
          ...prize,
          team
        }
      } else return prize;
    })

    setPrizeCards(updatesPrizeCards);
  }, [prizeCards, currentPrizeCardData])

  useEffect(()=>{
    const role = getHackathonRole();
    if (role != 'admin' && role != 'org') window.location.replace('/?action=sync');
    else if (hackathon.isEnded) window.location.replace('/admin/ended');
    else {
      ;(async()=>{
        await getHackathonAnalytics();
        await getTeamsData();
        await getHackathonData();
      })()
    }
  }, [hackathon])

  useEffect(() => {
    filterTeamBasedOnTrack(currentPrizeCardData.track?.id);
  }, [currentPrizeCardData]);

  // Loader
  // if (!prizeCards.length || !displayTeams.length) return <div></div>

  return (
    <BaseWrapper>
      <AppSidebar
        hackathonName={hackathonData.name}
        hackathonTagline={hackathonData.tagline}
        tracks={hackathonData.noTracks}
        participants={hackathonData.noParticipants}
        totalRemaining={hackathonData.remainingParticipants}
        onEndHackathon={()=>handleEndHackathon()}
      />
      <div className={"w-5/6 h-base flex flex-col items-center py-5 overflow-hidden gap-5"}>
        <div className={"text-6xl gradient-text font-bold"}>Prize distribution</div>
        <PrizesCarousel prizeCards={prizeCards} setCurrentPrizeCardData={setCurrentPrizeCardData} />
        <div className={"mt-5 w-4/5 h-3/4 overflow-y-scroll --scrollbar px-20 flex flex-col gap-1"}>
          <Accordion type={"single"} collapsible className={"space-y-1"} >
            {displayTeams.map(team=>(
              <TeamAccordianItem team={team} key={team.id} selected={isTeamSelected(team)} onSelect={onTeamSelect} />
              // No need of selected as everything resets if end hack process is not completed
            ))}
          </Accordion>
        </div>
      </div>
    </BaseWrapper>
  )
}



