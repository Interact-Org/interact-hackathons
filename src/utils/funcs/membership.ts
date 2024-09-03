import {
  ORG_MANAGER,
  ORG_MEMBER,
  ORG_SENIOR,
  PROJECT_EDITOR,
  PROJECT_MANAGER,
  PROJECT_MEMBER,
} from '@/config/constants';

export const getRoleColor = (role: string) => {
  switch (role) {
    case PROJECT_MEMBER:
    case ORG_MEMBER:
      return '#478eeb86';
    case PROJECT_EDITOR:
    case ORG_SENIOR:
      return '#fbf9be';
    case PROJECT_MANAGER:
    case ORG_MANAGER:
      return '#bffbbe';
  }
};
