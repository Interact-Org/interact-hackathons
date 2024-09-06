import { Hackathon } from '@/types';
import moment from 'moment';

export const HACKATHON_NOT_STARTED = 'not started';
export const HACKATHON_TEAM_REGISTRATION = 'team registration';
export const HACKATHON_LIVE = 'is live';
export const HACKATHON_COMPLETED = 'completed';

export const getHackathonStage = (hackathon: Hackathon): string => {
  const startTime = moment(hackathon.startTime);
  const endTime = moment(hackathon.endTime);
  const teamFormationStartTime = moment(hackathon.teamFormationStartTime);
  const teamFormationEndTime = moment(hackathon.teamFormationEndTime);

  const now = moment();

  if (now.isBefore(startTime)) return HACKATHON_NOT_STARTED;
  if (hackathon.isEnded) return HACKATHON_COMPLETED;
  if (now.isBetween(teamFormationStartTime, teamFormationEndTime)) return HACKATHON_TEAM_REGISTRATION;
  return HACKATHON_LIVE;
};
