import { SERVER_ERROR } from '@/config/errors';
import getHandler from '@/handlers/get_handler';
import { configSelector, setLastFetchedHackathon } from '@/slices/configSlice';
import { currentHackathonSelector, setCurrentHackathon } from '@/slices/hackathonSlice';
import { userSelector } from '@/slices/userSlice';
import { Hackathon } from '@/types';
import Toaster from '@/utils/toaster';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';

const useHackathonStateSynchronizer = () => {
  const config = useSelector(configSelector);
  const hackathon = useSelector(currentHackathonSelector);
  const user = useSelector(userSelector);

  const dispatch = useDispatch();

  const getRole = () => {
    if (hackathon.coordinators.includes(user.id) || hackathon.judges.includes(user.id)) return 'admin';
    if (user.organizationMemberships.map(m => m.organizationID).includes(hackathon.organizationID)) return 'org';
    return 'participant';
  };

  const getHackathonOrg = () => {
    const membership = user.organizationMemberships.filter(m => m.organizationID == hackathon.organizationID)[0];
    return membership.organizationID || '';
  };

  const syncHackathonState = () => {
    if (moment().utc().diff(config.lastFetchedHackathon, 'minute') < 5) return;

    const role = getRole();

    let URL = '';

    if (role == 'admin') URL = `/hackathons/${hackathon.id}/admin`;
    else if (role == 'org') URL = `/org/${getHackathonOrg()}/hackathons/${hackathon.id}`;
    else URL = `/hackathons/${hackathon.id}/participants`;

    getHandler(URL)
      .then(res => {
        if (res.statusCode == 200) {
          const hackathon: Hackathon = res.data.hackathon;
          dispatch(setCurrentHackathon(hackathon));
          dispatch(setLastFetchedHackathon(new Date().toUTCString()));
        }
      })
      .catch(err => {
        Toaster.error(SERVER_ERROR, 'error_toaster');
      });
  };

  return syncHackathonState;
};

export default useHackathonStateSynchronizer;
