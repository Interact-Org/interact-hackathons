import { RootState } from '@/store';
import { OrganizationMembership, User } from '@/types';
import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';

export interface ChatSlice {
  userID: string;
  chatID: string;
}
export interface UserState {
  id: string;
  name: string;
  username: string;
  isOrganization: boolean;
  bio: string;
  tagline: string;
  email: string;
  phoneNo: string;
  following: string[];
  likes: string[];
  dislikes: string[];
  links: string[];
  chats: string[];
  personalChatSlices: ChatSlice[];
  profilePic: string;
  coverPic: string;
  organizationMemberships: OrganizationMembership[];
  registeredEvents: string[];
  githubUsername: string;
  figmaUsername: string;
  createdAt: string;
}

const initialState: UserState = {
  id: '',
  name: '',
  username: '',
  isOrganization: false,
  bio: '',
  tagline: '',
  email: '',
  phoneNo: '',
  profilePic: '',
  coverPic: '',
  following: [],
  likes: [],
  dislikes: [],
  links: [],
  chats: [],
  personalChatSlices: [],
  organizationMemberships: [],
  registeredEvents: [],
  githubUsername: '',
  figmaUsername: '',
  createdAt: '',
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.id = action.payload.id;
      state.name = action.payload.name;
      state.username = action.payload.username;
      state.isOrganization = action.payload.isOrganization;
      state.bio = action.payload.bio;
      state.tagline = action.payload.tagline;
      state.email = action.payload.email;
      state.profilePic = action.payload.profilePic;
      state.coverPic = action.payload.coverPic;
      state.phoneNo = action.payload.phoneNo;
      state.links = action.payload.links;
      state.chats = [];
      state.personalChatSlices = [];
      state.following = [];
      state.likes = [];
      state.dislikes = [];
      state.organizationMemberships = [];
      state.registeredEvents = [];
      state.githubUsername = action.payload.githubUsername;
      state.figmaUsername = action.payload.figmaUsername;
      state.createdAt = action.payload.createdAt;
    },
    resetUser: state => {
      state.id = '';
      state.name = '';
      state.username = '';
      state.isOrganization = false;
      state.bio = '';
      state.tagline = '';
      state.email = '';
      state.profilePic = 'default.jpg';
      state.coverPic = 'default.jpg';
      state.phoneNo = '';
      state.chats = [];
      state.personalChatSlices = [];
      state.following = [];
      state.likes = [];
      state.dislikes = [];
      state.links = [];
      state.organizationMemberships = [];
      state.registeredEvents = [];
      state.githubUsername = '';
      state.figmaUsername = '';
      state.createdAt = '';
    },
    setReduxName: (state, action: PayloadAction<string>) => {
      state.name = action.payload;
    },
    setProfilePic: (state, action: PayloadAction<string>) => {
      state.profilePic = action.payload;
    },
    setCoverPic: (state, action: PayloadAction<string>) => {
      state.coverPic = action.payload;
    },
    setReduxTagline: (state, action: PayloadAction<string>) => {
      state.tagline = action.payload;
    },
    setReduxBio: (state, action: PayloadAction<string>) => {
      state.bio = action.payload;
    },
    setFollowing: (state, action: PayloadAction<string[]>) => {
      state.following = action.payload;
    },
    setLikes: (state, action: PayloadAction<string[]>) => {
      state.likes = action.payload;
    },
    setDisLikes: (state, action: PayloadAction<string[]>) => {
      state.dislikes = action.payload;
    },
    setReduxLinks: (state, action: PayloadAction<string[]>) => {
      state.links = action.payload;
    },
    resetReduxLinks: state => {
      state.links = [];
    },
    setChats: (state, action: PayloadAction<string[]>) => {
      state.chats = action.payload;
    },
    addToChats: (state, action: PayloadAction<string>) => {
      state.chats = [...state.chats, action.payload];
    },
    setPersonalChatSlices: (state, action: PayloadAction<ChatSlice[]>) => {
      state.personalChatSlices = action.payload;
    },
    setEmail: (state, action: PayloadAction<string>) => {
      state.email = action.payload;
    },
    setPhoneNumber: (state, action: PayloadAction<string>) => {
      state.phoneNo = action.payload;
    },
    setOrganizationMemberships: (state, action: PayloadAction<OrganizationMembership[]>) => {
      state.organizationMemberships = action.payload;
    },
    setRegisteredEvents: (state, action: PayloadAction<string[]>) => {
      state.registeredEvents = action.payload;
    },
    setGithubUsername: (state, action: PayloadAction<string>) => {
      state.githubUsername = action.payload;
    },
    setFigmaUsername: (state, action: PayloadAction<string>) => {
      state.figmaUsername = action.payload;
    },
  },
});

export const {
  setUser,
  resetUser,
  setReduxName,
  setProfilePic,
  setCoverPic,
  setReduxTagline,
  setReduxBio,
  setFollowing,
  setLikes,
  setDisLikes,
  setReduxLinks,
  resetReduxLinks,
  setChats,
  addToChats,
  setPersonalChatSlices,
  setEmail,
  setPhoneNumber,
  setOrganizationMemberships,
  setRegisteredEvents,
  setGithubUsername,
  setFigmaUsername,
} = userSlice.actions;

export default userSlice.reducer;

export const userSelector = (state: RootState) => state.user;

export const userIDSelector = (state: RootState) => state.user.id;

export const profilePicSelector = (state: RootState) => state.user.profilePic;
