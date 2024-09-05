import { SERVER_ERROR } from '@/config/errors';
import { CONNECTION_URL, USER_URL } from '@/config/routes';
import getHandler from '@/handlers/get_handler';
import { setFetchedFollowing, setFetchedLikes, setLastFetchedOrganizationMemberships, setLastFetchedRegisteredEvents } from '@/slices/configSlice';
import { setDisLikes, setFollowing, setLikes, setOrganizationMemberships, setRegisteredEvents, setUser } from '@/slices/userSlice';
import { OrganizationMembership, User } from '@/types';
import Toaster from '@/utils/toaster';
import { useDispatch } from 'react-redux';

const useUserStateSynchronizer = () => {
  const dispatch = useDispatch();

  const fetchMe = () => {
    const URL = `${USER_URL}/me`;
    getHandler(URL)
      .then(res => {
        if (res.statusCode == 200) {
          const user: User = res.data.user;
          dispatch(setUser(user));
        }
      })
      .catch(err => {
        Toaster.error(SERVER_ERROR, 'error_toaster');
      });
  };

  const fetchFollowing = () => {
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

  const syncUserState = () => {
    fetchMe();
    fetchFollowing();
    fetchLikes();
    fetchOrganizationMemberships();
    fetchRegisteredEvents();
  };

  return syncUserState;
};

export default useUserStateSynchronizer;
