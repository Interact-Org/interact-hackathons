import userReducer from '@/slices/userSlice';
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { FLUSH, PAUSE, PERSIST, PURGE, REGISTER, REHYDRATE, persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import configReducer from './slices/configSlice';
import organizationReducer from './slices/orgSlice';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['user', 'config', 'organization'],
};

const configPersistConfig = {
  key: 'config',
  storage,
  whitelist: [
    'lastFetchedFollowing',
    'lastFetchedLikes',
    'lastFetchedUnreadNotifications',
    'lastFetchedOrganizationMemberships',
    'lastFetchedRegisteredEvents',
  ],
};

const orgPersistConfig = {
  key: 'organization',
  storage,
  whitelist: ['currentOrgID', 'currentOrgUserAccID'],
};

const rootReducer = combineReducers({
  user: userReducer,
  config: persistReducer(configPersistConfig, configReducer),
  organization: persistReducer(orgPersistConfig, organizationReducer),
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  devTools: process.env.NODE_ENV == 'development',
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
