import { RootState } from '@/store';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';

interface ConfigState {
  updatingFollowing: boolean;
  updatingLikes: boolean;
  lastFetchedFollowing: string;
  lastFetchedLikes: string;
  lastFetchedUnreadNotifications: string;
  lastFetchedOrganizationMemberships: string;
  lastFetchedRegisteredEvents: string;
  lastFetchedHackathon: string;
}

const getInitialDate = (): string => {
  const date = new Date();
  date.setMinutes(date.getMinutes() - 31); //+1 minutes
  return date.toUTCString();
};
const getInitialNotificationDate = (): string => {
  const date = new Date();
  date.setSeconds(date.getSeconds() - 31);
  return date.toUTCString();
};

const initialState: ConfigState = {
  updatingFollowing: false,
  updatingLikes: false,
  lastFetchedFollowing: getInitialDate(),
  lastFetchedLikes: getInitialDate(),
  lastFetchedUnreadNotifications: getInitialNotificationDate(),
  lastFetchedOrganizationMemberships: getInitialDate(),
  lastFetchedRegisteredEvents: getInitialDate(),
  lastFetchedHackathon: getInitialDate(),
};

export const configSlice = createSlice({
  name: 'config',
  initialState,
  reducers: {
    resetConfig: state => {
      state.updatingFollowing = false;
      state.updatingLikes = false;
      state.lastFetchedFollowing = getInitialDate();
      state.lastFetchedLikes = getInitialDate();
      state.lastFetchedUnreadNotifications = getInitialNotificationDate();
      state.lastFetchedOrganizationMemberships = getInitialDate();
      state.lastFetchedRegisteredEvents = getInitialDate();
      state.lastFetchedHackathon = getInitialDate();
    },
    setUpdatingFollowing: (state, action: PayloadAction<boolean>) => {
      state.updatingFollowing = action.payload;
    },
    setUpdatingLikes: (state, action: PayloadAction<boolean>) => {
      state.updatingLikes = action.payload;
    },
    setConfig: state => {
      state.lastFetchedFollowing = new Date().toUTCString();
      state.lastFetchedLikes = new Date().toUTCString();
      state.lastFetchedUnreadNotifications = new Date().toUTCString();
      state.lastFetchedOrganizationMemberships = new Date().toUTCString();
      state.lastFetchedRegisteredEvents = new Date().toUTCString();
    },
    setFetchedFollowing: (state, action: PayloadAction<string>) => {
      state.lastFetchedFollowing = action.payload;
    },
    setFetchedLikes: (state, action: PayloadAction<string>) => {
      state.lastFetchedLikes = action.payload;
    },
    setLastFetchedUnreadNotifications: (state, action: PayloadAction<string>) => {
      state.lastFetchedUnreadNotifications = action.payload;
    },
    setLastFetchedOrganizationMemberships: (state, action: PayloadAction<string>) => {
      state.lastFetchedOrganizationMemberships = action.payload;
    },
    setLastFetchedRegisteredEvents: (state, action: PayloadAction<string>) => {
      state.lastFetchedRegisteredEvents = action.payload;
    },
    setLastFetchedHackathon: (state, action: PayloadAction<string>) => {
      state.lastFetchedHackathon = action.payload;
    },
  },
});

export const {
  resetConfig,
  setUpdatingFollowing,
  setUpdatingLikes,
  setConfig,
  setFetchedFollowing,
  setFetchedLikes,
  setLastFetchedUnreadNotifications,
  setLastFetchedOrganizationMemberships,
  setLastFetchedRegisteredEvents,
  setLastFetchedHackathon,
} = configSlice.actions;

export default configSlice.reducer;

export const configSelector = (state: RootState) => state.config;
