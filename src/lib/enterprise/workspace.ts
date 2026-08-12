import { SharedWorkspace } from './types';

const defaultSharedWorkspaces: SharedWorkspace[] = [
  {
    id: 'ws_ent_cyber',
    name: 'Cyber & Semiconductor Intelligence',
    description: 'Shared desk tracking chip supply chains, foundries, & cyber threats',
    members: ['mem_owner_01', 'mem_analyst_01'],
    createdAt: new Date().toISOString()
  },
  {
    id: 'ws_ent_ai',
    name: 'Frontier AI Monitoring',
    description: 'Shared desk tracking OpenAI, Google, Anthropic & GPU datacenters',
    members: ['mem_analyst_01', 'mem_researcher_01'],
    createdAt: new Date().toISOString()
  },
  {
    id: 'ws_ent_exec',
    name: 'Executive Briefings Room',
    description: 'High-level verified briefings for strategic leadership',
    members: ['mem_owner_01'],
    createdAt: new Date().toISOString()
  }
];

export function getSharedWorkspaces(): SharedWorkspace[] {
  return defaultSharedWorkspaces;
}

export function createSharedWorkspace(name: string, description: string, memberIds: string[] = []): SharedWorkspace {
  const ws: SharedWorkspace = {
    id: `ws_ent_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    name,
    description,
    members: memberIds,
    createdAt: new Date().toISOString()
  };

  defaultSharedWorkspaces.push(ws);
  return ws;
}
