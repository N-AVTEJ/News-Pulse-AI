import { QualityGateResult } from '@/lib/ai/types';
import { Role } from '@/lib/enterprise/types';

export type ResearchTaskStatus = 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';

export type RequiredEvidenceType = 
  | 'CORROBORATED_REPORT'
  | 'PRIMARY_SOURCE'
  | 'FINANCIAL_DISCLOSURE'
  | 'REGULATORY_FILING'
  | 'GENERAL_EVIDENCE';

export interface ResearchTask {
  id: string;
  question: string;
  topic: string;
  targetEntities: string[];
  dateRange?: { start: string; end: string };
  requiredEvidenceType: RequiredEvidenceType;
  status: ResearchTaskStatus;
  resultReferences: string[]; // Associated cluster IDs or story IDs
  findingsCount: number;
  error?: string;
  durationMs?: number;
}

export interface ResearchCitation {
  id: string;
  storyId: string;
  clusterId: string;
  publisherName: string;
  sourceUrl: string;
  articleUrl: string;
  headline: string;
  publishedAt: string;
  quoteSnippet: string;
  isPrimarySource: boolean;
}

export type StatementType = 'FACT' | 'INFERENCE';
export type FindingValidationStatus = 'VALIDATED' | 'UNSUPPORTED' | 'CONTESTED';

export interface ResearchFinding {
  id: string;
  taskId: string;
  claim: string;
  statementType: StatementType; // Sourced fact vs analytical inference
  supportingCitations: ResearchCitation[];
  contradictingCitations: ResearchCitation[];
  confidenceScore: number; // 0 - 100
  uncertaintyNotes?: string;
  validationStatus: FindingValidationStatus;
}

export type ContradictionSeverity = 'HIGH' | 'MEDIUM' | 'LOW';
export type ContradictionResolution = 'UNRESOLVED' | 'RESOLVED_BY_RECENCY' | 'PERSISTENT_CONFLICT';

export interface Contradiction {
  id: string;
  topic: string;
  claimA: string;
  claimB: string;
  supportingSourcesA: string[];
  supportingSourcesB: string[];
  severity: ContradictionSeverity;
  resolutionStatus: ContradictionResolution;
  explanation: string;
}

export type GapType = 'MISSING_PRIMARY' | 'OUTDATED_EVIDENCE' | 'INSUFFICIENT_DIVERSITY' | 'UNRESOLVED_QUESTION';

export interface EvidenceGap {
  id: string;
  description: string;
  gapType: GapType;
  suggestedAction?: string;
  topic?: string;
  recommendedNextSteps?: string;
}

export interface CrossEventRelationship {
  sourceClusterId: string;
  targetClusterId: string;
  relationType: string;
  description: string;
}

export interface HistoricalTimelineItem {
  timestamp: string;
  eventHeadline: string;
  source: string;
  significance: string;
}

export interface EntityRelationshipInsight {
  entityA: string;
  relationship: string;
  entityB: string;
  evidence: string;
}

export interface ResearchReport {
  id: string;
  runId: string;
  question: string;
  executiveSummary: string;
  researchScope: string;
  keyFindings: ResearchFinding[];
  contradictions: Contradiction[];
  evidenceGaps: EvidenceGap[];
  crossEventRelationships: CrossEventRelationship[];
  historicalTimeline: HistoricalTimelineItem[];
  entityRelationships: EntityRelationshipInsight[];
  potentialImplications: string[];
  unresolvedQuestions: string[];
  allCitations: ResearchCitation[];
  qualityGateResult?: QualityGateResult;
  reviewRequired: boolean;
  reviewReasons: string[];
  generatedAt: string;
}

export type ResearchRunStatus = 
  | 'INITIALIZING'
  | 'PLANNING'
  | 'EXECUTING'
  | 'ANALYZING'
  | 'EVALUATING'
  | 'COMPLETED'
  | 'FAILED'
  | 'CANCELLED';

export interface ResearchRun {
  id: string;
  question: string;
  userId: string;
  userRole?: Role;
  workspaceId: string;
  organizationId: string;
  status: ResearchRunStatus;
  tasks: ResearchTask[];
  findings: ResearchFinding[];
  report?: ResearchReport;
  createdAt: string;
  updatedAt: string;
  startedAt?: string;
  completedAt?: string;
  durationMs?: number;
  error?: string;
  cancelRequested?: boolean;
}

export interface CreateResearchRunParams {
  question: string;
  userId?: string;
  userRole?: Role;
  workspaceId?: string;
  organizationId?: string;
  maxConcurrency?: number;
}
