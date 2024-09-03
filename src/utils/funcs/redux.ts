import { store } from '@/store';
import { initialUser } from '@/types/initials';

export const getUserFromState = () => {
  const reduxUser = store.getState().user;

  const user = initialUser;
  user.id = reduxUser.id;
  user.name = reduxUser.name;
  user.username = reduxUser.username;
  user.profilePic = reduxUser.profilePic;

  return user;
};
