import { NewsCategory, NewsStory } from '../news/types';

export type ScoutCategory = NewsCategory;

export type ScoutStatus = 'IDLE' | 'RUNNING' | 'COMPLETED' | 'FAILED';

export type OverallRunStatus = 'IDLE' | 'RUNNING' | 'SUCCESS' | 'PARTIAL' | 'FAILED';

export interface ScoreBreakdown {
  categoryAlignment: number;
  primarySignal: number;
  secondarySignals: number;
  corroboration: number;
  recency: number;
  total: number;
}

export interface ScoutStoryResult {
  story: NewsStory;
  scoutId: string;
  scoutName: string;
  matchedCategory: ScoutCategory;
  matchedSignals: string[];
  selectionScore: number; // 0 - 100
  selectionReason: string;
  scoreBreakdown: ScoreBreakdown;
}

export interface ScoutResult {
  agentId: string;
  agentName: string;
  category: ScoutCategory;
  startedAt: string;
  completedAt: string;
  durationMs: number;
  storiesProcessed: number;
  storiesSelected: number;
  status: ScoutStatus;
  results: ScoutStoryResult[];
  error?: string;
}

export interface ScoutConfigOptions {
  minCandidateScore?: number; // Default: 40
  highSignalScore?: number;  // Default: 75
}

export interface ScoutAgent {
  id: string;
  name: string;
  category: ScoutCategory;
  description: string;
  execute(stories: NewsStory[], config?: ScoutConfigOptions): Promise<ScoutResult>;
}

export interface MergedIntelligenceStory {
  id: string;
  story: NewsStory;
  matchedScouts: string[]; // e.g. ["tech-scout", "business-scout"]
  matchedSignals: string[];
  perScoutScores: Record<string, number>;
  topScore: number;
  primaryScoutId: string;
  primaryScoutName: string;
  selectionReason: string;
  scoreBreakdown: ScoreBreakdown;
}

export interface OrchestratorExecutionResult {
  executionId: string;
  startedAt: string;
  completedAt: string;
  durationMs: number;
  status: OverallRunStatus;
  totalStoriesProcessed: number;
  totalSelected: number;
  agentTelemetry: ScoutResult[];
  intelligence: MergedIntelligenceStory[];
}
