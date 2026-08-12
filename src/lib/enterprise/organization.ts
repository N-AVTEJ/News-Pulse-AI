import { Organization, OrgMember, Role } from './types';

const defaultMembers: OrgMember[] = [
  {
    id: 'mem_owner_01',
    name: 'Sarah Connor',
    email: 'sarah.connor@newspulse.ai',
    role: 'OWNER',
    department: 'Executive Command',
    team: 'Global Threat Cell',
    joinedAt: new Date().toISOString()
  },
  {
    id: 'mem_analyst_01',
    name: 'Alex Vance',
    email: 'alex.vance@newspulse.ai',
    role: 'ANALYST',
    department: 'AI & Tech Intelligence',
    team: 'Frontier AI Desk',
    joinedAt: new Date().toISOString()
  },
  {
    id: 'mem_researcher_01',
    name: 'Marcus Brody',
    email: 'marcus.brody@newspulse.ai',
    role: 'RESEARCHER',
    department: 'Geopolitical & Policy',
    team: 'World News Desk',
    joinedAt: new Date().toISOString()
  }
];

let defaultOrganization: Organization = {
  id: 'org_newspulse_global',
  name: 'NewsPulse Global Intelligence Network',
  domain: 'newspulse.ai',
  departments: ['Executive Command', 'AI & Tech Intelligence', 'Geopolitical & Policy', 'Market Research'],
  teams: ['Global Threat Cell', 'Frontier AI Desk', 'World News Desk', 'Markets Cell'],
  members: defaultMembers
};

export function getOrganization(): Organization {
  return defaultOrganization;
}

export function getOrgMember(memberId: string): OrgMember | undefined {
  return defaultOrganization.members.find(m => m.id === memberId);
}

export function inviteOrgMember(name: string, email: string, role: Role, department: string, team: string): OrgMember {
  const newMember: OrgMember = {
    id: `mem_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    name,
    email,
    role,
    department,
    team,
    joinedAt: new Date().toISOString()
  };

  defaultOrganization.members.push(newMember);
  return newMember;
}
