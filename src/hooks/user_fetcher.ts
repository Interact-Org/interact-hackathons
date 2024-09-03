import { SERVER_ERROR } from '@/config/errors';
import {
  CONNECTION_URL,
  USER_URL,
} from '@/config/routes';
import getHandler from '@/handlers/get_handler';

import {
  configSelector,
  setFetchedFollowing,
  setFetchedLikes,
  setLastFetchedOrganizationMemberships,
  setLastFetchedRegisteredEvents,
} from '@/slices/configSlice';
import {
  setDisLikes,
  setFollowing,
  setLikes,
  setOrganizationMemberships,
  setRegisteredEvents,
} from '@/slices/userSlice';
import {OrganizationMembership} from '@/types';
import Toaster from '@/utils/toaster';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';

const useUserStateFetcher = () => {
  const dispatch = useDispatch();

  const config = useSelector(configSelector);

  const fetchFollowing = () => {
    if (moment().utc().diff(config.lastFetchedFollowing, 'minute') < 30) return;
    const URL = `${CONNECTION_URL}/following/me`;
    getHandler(URL)
      .then(res => {
        if (res.statusCode == 200) {
          const followingIDsArr: string[] = res.data.userIDs || [];
          dispatch(setFollowing(followingIDsArr));
          dispatch(setFetchedFollowing(new Date().toUTCString()));
        }
      })
      .catch(err => {
        Toaster.error(SERVER_ERROR, 'error_toaster');
      });
  };

  const fetchLikes = () => {
    if (moment().utc().diff(config.lastFetchedLikes, 'minute') < 30) return;
    const LIKES_URL = `${USER_URL}/me/likes`;
    getHandler(LIKES_URL)
      .then(res => {
        if (res.statusCode == 200) {
          const likesData: string[] = res.data.likes || [];
          dispatch(setLikes(likesData));
          dispatch(setFetchedLikes(new Date().toUTCString()));
        }
      })
      .catch(err => {
        Toaster.error(SERVER_ERROR, 'error_toaster');
      });

    const DISLIKES_URL = `${USER_URL}/me/dislikes`;
    getHandler(DISLIKES_URL)
      .then(res => {
        if (res.statusCode == 200) {
          const likesData: string[] = res.data.dislikes || [];
          dispatch(setDisLikes(likesData));
          dispatch(setFetchedLikes(new Date().toUTCString()));
        }
      })
      .catch(err => {
        Toaster.error(SERVER_ERROR, 'error_toaster');
      });
  };

  const fetchOrganizationMemberships = () => {
    if (moment().utc().diff(config.lastFetchedOrganizationMemberships, 'minute') < 30) return;
    const URL = `${USER_URL}/me/organization/memberships`;
    getHandler(URL)
      .then(res => {
        if (res.statusCode === 200) {
          const organizationMemberships: OrganizationMembership[] = res.data.memberships;
          dispatch(setOrganizationMemberships(organizationMemberships));
          dispatch(setLastFetchedOrganizationMemberships(new Date().toUTCString()));
        } else Toaster.error(res.data.message, 'error_toaster');
      })
      .catch(err => {
        Toaster.error(SERVER_ERROR, 'error_toaster');
      });
  };

  const fetchRegisteredEvents = () => {
    if (moment().utc().diff(config.lastFetchedRegisteredEvents, 'minute') < 5) return;
    const URL = `${USER_URL}/me/events`;
    getHandler(URL)
      .then(res => {
        if (res.statusCode === 200) {
          const eventIDs: string[] = res.data.eventIDs;
          dispatch(setRegisteredEvents(eventIDs));
          dispatch(setLastFetchedRegisteredEvents(new Date().toUTCString()));
        } else Toaster.error(res.data.message, 'error_toaster');
      })
      .catch(err => {
        Toaster.error(SERVER_ERROR, 'error_toaster');
      });
  };

  const fetchUserState = () => {
    fetchFollowing();
    fetchLikes();
    fetchOrganizationMemberships();
    fetchRegisteredEvents();
  };

  return fetchUserState;
};

export default useUserStateFetcher;
