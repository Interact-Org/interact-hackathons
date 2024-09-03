import {
  ORG_MANAGER,
  ORG_MEMBER,
  ORG_SENIOR,
  PROJECT_EDITOR,
  PROJECT_MANAGER,
  PROJECT_MEMBER,
  PROJECT_OWNER,
} from '@/config/constants';
import { store } from '@/store';
import { Organization, Project } from '@/types';
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

export const checkProjectAccess = (role: string, projectID: string, project?: Project) => {
  const ownerProjects = user.ownerProjects;
  const managerProjects = user.managerProjects;
  const editorProjects = user.editorProjects;
  const memberProjects = user.memberProjects;

  const isOwner = ownerProjects.includes(projectID) || project?.userID == user.id;
  const isManager = managerProjects.includes(projectID);
  const isEditor = editorProjects.includes(projectID);
  const isMember = memberProjects.includes(projectID);

  switch (role) {
    case PROJECT_OWNER:
      return isOwner;
    case PROJECT_MANAGER:
      return isOwner || isManager;
    case PROJECT_EDITOR:
      return isOwner || isManager || isEditor;
    case PROJECT_MEMBER:
      return isOwner || isManager || isEditor || isMember;
    default:
      return false;
  }
};

export const checkOrgProjectAccess = (
  projectRole: string,
  projectID: string,
  orgRole: string,
  org?: Organization | null
) => {
  const projectAccess = checkProjectAccess(projectRole, projectID);
  const orgAccess = org ? checkParticularOrgAccess(orgRole, org) : checkOrgAccess(orgRole);

  return projectAccess || orgAccess;
};

export default checkOrgAccess;
