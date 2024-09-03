import { ORG_MANAGER, ORG_MEMBER, ORG_SENIOR } from '@/config/constants';
import { store } from '@/store';
import { Organization } from '@/types';
import { initialOrganization, initialOrganizationMembership } from '@/types/initials';

const user = store.getState().user;
const org = store.getState().organization.currentOrg || initialOrganization;
const membership = store.getState().organization.currentOrgMembership || initialOrganizationMembership;

const checkOrgAccess = (accessRole: string) => {
  if (org.id == '') return false;

  if (user.id == org.userID) return true;
  if (membership.id == '' || org.id != membership.organizationID) return false;

  switch (accessRole) {
    case ORG_MANAGER:
      return membership.role == ORG_MANAGER;
    case ORG_SENIOR:
      return membership.role == ORG_MANAGER || membership.role == ORG_SENIOR;
    case ORG_MEMBER:
      return true;
    default:
      return false;
  }
};

export const checkParticularOrgAccess = (accessRole: string, checkOrg: Organization | null) => {
  if (!checkOrg) return false;
  if (checkOrg.id == '') return false;

  if (user.id == checkOrg.userID) return true;

  const memberships = user.organizationMemberships;

  var checkerMembership = initialOrganizationMembership;

  memberships.forEach(m => {
    if (m.organizationID == checkOrg.id) checkerMembership = m;
  });

  if (checkerMembership.id == '') return false;

  switch (accessRole) {
    case ORG_MANAGER:
      return checkerMembership.role == ORG_MANAGER;
    case ORG_SENIOR:
      return checkerMembership.role == ORG_MANAGER || checkerMembership.role == ORG_SENIOR;
    case ORG_MEMBER:
      return true;
    default:
      return false;
  }
};

export default checkOrgAccess;
