import { ReadingHistoryItem, UserProfile, Workspace } from './types';

const defaultWorkspaces: Workspace[] = [
  {
    id: 'ws_personal',
    name: 'Personal Space',
    type: 'PERSONAL',
    watchlists: [
      {
        id: 'wl_ai_tech',
        name: 'AI & Frontier Tech',
        description: 'Tracking major AI developments, OpenAI, Google, & Nvidia',
        rules: {
          keywords: ['ai', 'llm', 'generative', 'model', 'gpu'],
          companies: ['OpenAI', 'Google', 'Microsoft', 'Nvidia'],
          products: ['ChatGPT', 'Gemini', 'Claude', 'Copilot'],
          people: ['Sam Altman', 'Satya Nadella', 'Sundar Pichai'],
          organizations: [],
          locations: [],
          technologies: ['Generative AI', 'Semiconductors'],
          excludeKeywords: [],
          priority: 'HIGH'
        },
        createdAt: new Date().toISOString()
      }
    ],
    savedSearches: [
      {
        id: 'ss_openai',
        name: 'OpenAI Releases',
        query: 'OpenAI',
        category: 'ai-tech',
        notifications: true,
        createdAt: new Date().toISOString()
      }
    ],
    alerts: []
  },
  {
    id: 'ws_research',
    name: 'Academic Research',
    type: 'RESEARCH',
    watchlists: [
      {
        id: 'wl_quantum',
        name: 'Quantum & Chips',
        description: 'Semiconductors and quantum computing breakthroughs',
        rules: {
          keywords: ['quantum', 'semiconductor', 'foundry'],
          companies: ['TSMC', 'Nvidia', 'Intel'],
          products: [],
          people: [],
          organizations: [],
          locations: [],
          technologies: ['Semiconductors', 'Quantum Computing'],
          excludeKeywords: [],
          priority: 'HIGH'
        },
        createdAt: new Date().toISOString()
      }
    ],
    savedSearches: [],
    alerts: []
  }
];

let currentProfile: UserProfile = {
  id: 'usr_default_operator',
  name: 'Intelligence Operator',
  email: 'operator@newspulse.ai',
  timezone: 'UTC',
  language: 'en',
  theme: 'dark',
  preferredCategories: ['ai-tech', 'business', 'world'],
  interests: ['Artificial Intelligence', 'Semiconductors', 'Markets', 'Geopolitics'],
  industry: 'Technology & Defense Intelligence',
  role: 'Senior Intelligence Analyst',
  organization: 'NewsPulse Command',
  dailyBriefingTime: '08:00',
  weeklyBriefingSchedule: 'MONDAY',
  activeWorkspaceId: 'ws_personal',
  workspaces: defaultWorkspaces
};

let readingHistoryCache: ReadingHistoryItem[] = [];

export function getUserProfile(): UserProfile {
  return currentProfile;
}

export function updateUserProfile(updates: Partial<UserProfile>): UserProfile {
  currentProfile = { ...currentProfile, ...updates };
  return currentProfile;
}

export function getActiveWorkspace(): Workspace {
  const found = currentProfile.workspaces.find(w => w.id === currentProfile.activeWorkspaceId);
  return found || currentProfile.workspaces[0];
}

export function switchWorkspace(workspaceId: string): Workspace {
  const found = currentProfile.workspaces.find(w => w.id === workspaceId);
  if (found) {
    currentProfile.activeWorkspaceId = workspaceId;
    return found;
  }
  return getActiveWorkspace();
}

export function logReadingHistory(clusterId: string, title: string, timeSpentSeconds = 30): ReadingHistoryItem {
  const existingIdx = readingHistoryCache.findIndex(h => h.clusterId === clusterId);
  const item: ReadingHistoryItem = {
    id: `hist_${clusterId}`,
    clusterId,
    title,
    viewedAt: new Date().toISOString(),
    timeSpentSeconds,
    saved: false
  };

  if (existingIdx >= 0) {
    readingHistoryCache[existingIdx] = item;
  } else {
    readingHistoryCache.unshift(item);
  }

  return item;
}

export function getReadingHistory(): ReadingHistoryItem[] {
  return readingHistoryCache;
}

export function clearReadingHistory(): void {
  readingHistoryCache = [];
}
