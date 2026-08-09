export type WorkspaceType = 'PERSONAL' | 'RESEARCH' | 'BUSINESS' | 'UNIVERSITY' | 'STARTUP';

export interface WatchlistRule {
  keywords: string[];
  companies: string[];
  products: string[];
  people: string[];
  organizations: string[];
  locations: string[];
  technologies: string[];
  excludeKeywords: string[];
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
}

export interface Watchlist {
  id: string;
  name: string;
  description: string;
  rules: WatchlistRule;
  createdAt: string;
}

export interface SavedSearchItem {
  id: string;
  name: string;
  query: string;
  category?: string;
  notifications: boolean;
  createdAt: string;
}

export interface PersonalAlert {
  id: string;
  type: 'BREAKING_EVENT' | 'NEW_VERIFICATION' | 'PRIMARY_STATEMENT' | 'WATCHLIST_MATCH' | 'AI_REPORT_UPDATE';
  title: string;
  message: string;
  clusterId: string;
  timestamp: string;
  read: boolean;
}

export interface Workspace {
  id: string;
  name: string;
  type: WorkspaceType;
  watchlists: Watchlist[];
  savedSearches: SavedSearchItem[];
  alerts: PersonalAlert[];
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  timezone: string;
  language: string;
  theme: 'dark' | 'light';
  preferredCategories: string[];
  interests: string[];
  industry: string;
  role: string;
  organization: string;
  dailyBriefingTime: string;
  weeklyBriefingSchedule: string;
  activeWorkspaceId: string;
  workspaces: Workspace[];
}

export interface DailyBriefing {
  id: string;
  date: string;
  title: string;
  executiveSummary: string;
  topVerifiedEvents: string[]; // Canonical headlines / cluster IDs
  watchlistUpdates: string[];
  breakingNews: string[];
  aiSummaries: string[];
  pendingDevelopments: string[];
}

export interface WeeklyReport {
  id: string;
  weekRange: string;
  title: string;
  executiveSummary: string;
  majorEvents: string[];
  emergingTrends: string[];
  mostActiveEntities: string[];
  sectorSummaries: Record<string, string>;
}

export interface ReadingHistoryItem {
  id: string;
  clusterId: string;
  title: string;
  viewedAt: string;
  timeSpentSeconds: number;
  saved: boolean;
}

export interface RecommendationItem {
  id: string;
  type: 'EVENT' | 'ENTITY' | 'TOPIC' | 'TECHNOLOGY';
  title: string;
  clusterId?: string;
  entityName?: string;
  explanation: string;
  score: number;
}
