import { store } from '@/store';
import { Hackathon } from '@/types';
import moment from 'moment';

export const HACKATHON_NOT_STARTED = 'not started';
export const HACKATHON_TEAM_REGISTRATION = 'team registration';
export const HACKATHON_LIVE = 'is live';
export const HACKATHON_COMPLETED = 'completed';

const user = store.getState().user;
const hackathonState = store.getState().hackathon;

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

export const getHackathonRole = (hackathonParam?: Hackathon): 'admin' | 'org' | 'participant' | 'none' => {
  const hackathon = hackathonParam || hackathonState;
  if (hackathonParam) {
    if (hackathonParam.coordinators?.map(u => u.id).includes(user.id) || hackathonParam.judges?.map(u => u.id).includes(user.id)) return 'admin';
  } else {
    if (hackathonState.coordinators?.includes(user.id) || hackathonState.judges?.includes(user.id)) return 'admin';
  }
  if (user.organizationMemberships?.map(m => m.organizationID).includes(hackathon.organizationID)) return 'org';
  if (user.registeredEvents?.includes(hackathon.eventID)) return 'participant';

  return 'participant';
};
