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
  startTime: Date;
  endTime: Date;
  teamFormationStartTime: Date;
  teamFormationEndTime: Date;
  location: string;
  minTeamSize: number;
  maxTeamSize: number;
  createdAt: Date;
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
  startTime: new Date(),
  endTime: new Date(),
  teamFormationStartTime: new Date(),
  teamFormationEndTime: new Date(),
  location: '',
  minTeamSize: 1,
  maxTeamSize: 5,
  createdAt: new Date(),
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
      state.startTime = action.payload.startTime;
      state.endTime = action.payload.endTime;
      state.teamFormationStartTime = action.payload.teamFormationStartTime;
      state.teamFormationEndTime = action.payload.teamFormationEndTime;
      state.location = action.payload.location;
      state.minTeamSize = action.payload.minTeamSize;
      state.maxTeamSize = action.payload.maxTeamSize;
      state.createdAt = action.payload.createdAt;
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
