import { RootState } from '@/store';
import { Hackathon } from '@/types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface HackathonState {
  id: string;
  organizationID: string;
  organizationTitle: string;
  title: string;
  tagline?: string;
  coverPic: string;
  blurHash: string;
  description: string;
  tags?: string[];
  links?: string[];
  eventID: string;
  startTime: string;
  endTime: string;
  teamFormationStartTime: string;
  teamFormationEndTime: string;
  location: string;
  minTeamSize: number;
  maxTeamSize: number;
  createdAt: string;
  noParticipants: number;
  coordinators: string[];
  judges: string[];
  isEnded: boolean;
}

const initialState: HackathonState = {
  id: '',
  organizationID: '',
  organizationTitle: '',
  title: '',
  tagline: '',
  coverPic: '',
  blurHash: '',
  description: '',
  tags: [],
  links: [],
  eventID: '',
  startTime: new Date().toUTCString(),
  endTime: new Date().toUTCString(),
  teamFormationStartTime: new Date().toUTCString(),
  teamFormationEndTime: new Date().toUTCString(),
  location: '',
  minTeamSize: 1,
  maxTeamSize: 5,
  createdAt: new Date().toUTCString(),
  noParticipants: 0,
  coordinators: [],
  judges: [],
  isEnded: false,
};

export const hackathonSlice = createSlice({
  name: 'hackathon',
  initialState,
  reducers: {
    setCurrentHackathon: (state, action: PayloadAction<Hackathon>) => {
      state.id = action.payload.id;
      state.organizationID = action.payload.organizationID;
      state.organizationTitle = action.payload.organization.title;
      state.title = action.payload.title;
      state.tagline = action.payload.tagline || '';
      state.coverPic = action.payload.coverPic;
      state.blurHash = action.payload.blurHash;
      state.description = action.payload.description;
      state.tags = action.payload.tags || [];
      state.links = action.payload.links || [];
      state.eventID = action.payload.eventID;
      state.startTime = new Date(action.payload.startTime).toUTCString();
      state.endTime = new Date(action.payload.endTime).toUTCString();
      state.teamFormationStartTime = new Date(action.payload.teamFormationStartTime).toUTCString();
      state.teamFormationEndTime = new Date(action.payload.teamFormationEndTime).toUTCString();
      state.location = action.payload.location;
      state.minTeamSize = action.payload.minTeamSize;
      state.maxTeamSize = action.payload.maxTeamSize;
      state.createdAt = new Date(action.payload.createdAt).toUTCString();
      state.noParticipants = action.payload.noParticipants;
      state.coordinators = action.payload.coordinators.map(user => user.id);
      state.judges = action.payload.judges.map(user => user.id);
      state.isEnded = action.payload.isEnded;
    },

    resetCurrentHackathon: state => {
      state = initialState;
    },
  },
});

export const { setCurrentHackathon, resetCurrentHackathon } = hackathonSlice.actions;

export default hackathonSlice.reducer;

export const currentHackathonSelector = (state: RootState) => state.hackathon;
