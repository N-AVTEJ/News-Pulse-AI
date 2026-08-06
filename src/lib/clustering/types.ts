import { NewsCategory, NewsStory } from '../news/types';
import { EvidenceGraph, VerificationResult } from '../verification/types';
import { AnalysisReport } from '../analysis/types';
import { BreakingState } from '../runtime/types';

export interface SimilarityBreakdown {
  headlineSimilarity: number; // 0 - 40 pts
  entityOverlap: number;       // 0 - 30 pts
  timeProximity: number;       // 0 - 20 pts
  categoryMatch: number;       // 0 - 10 pts
  totalScore: number;          // 0 - 100 pts
}

export interface EventCluster {
  clusterId: string;
  canonicalHeadline: string;
  summary: string;
  primaryCategory: NewsCategory;
  stories: NewsStory[];          // Chronologically sorted (earliest first)
  publishers: string[];           // Unique array of source names
  storyCount: number;
  publisherCount: number;
  firstPublished: string;        // ISO timestamp of earliest story
  latestPublished: string;       // ISO timestamp of latest story
  matchedScouts: string[];       // e.g. ["tech-scout", "business-scout"]
  matchedSignals: string[];      // Combined unique signals
  perScoutScores: Record<string, number>;
  topSelectionScore: number;     // 0 - 100 score from Scouts
  selectionReason: string;
  status: 'ACTIVE' | 'ARCHIVED';
  clusterReason: string;         // Explainable clustering text
  clusterBreakdown: SimilarityBreakdown;
  importanceScore: null;         // Reserved for future Phase
  verificationScore: null;       // Reserved for future Phase
  verificationResult?: VerificationResult;
  evidenceGraph?: EvidenceGraph;
  analysisReport?: AnalysisReport;
  breakingState?: BreakingState;
}

export interface ClusterConfig {
  minSimilarityThreshold?: number; // Default: 50
  maxTimeWindowHours?: number;     // Default: 36
}

export interface ClusteringTelemetry {
  totalStoriesProcessed: number;
  clustersCreated: number;
  storiesMerged: number;
  largestClusterSize: number;
  averageClusterSize: number;
  durationMs: number;
}
