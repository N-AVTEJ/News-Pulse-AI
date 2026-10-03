export type ModelTier = 'FAST' | 'BALANCED' | 'REASONING' | 'FALLBACK';

export type TaskType = 
  | 'SUMMARY'
  | 'VERIFICATION_CHECK'
  | 'DEEP_ANALYSIS'
  | 'CLAIM_EXTRACTION'
  | 'CLASSIFICATION';

export interface ModelDefinition {
  id: string;
  name: string;
  provider: string;
  tier: ModelTier;
  contextWindow: number;
  inputCostPer1kTokens: number;
  outputCostPer1kTokens: number;
  typicalLatencyMs: number;
  isAvailable: boolean;
}

export interface RouteDecision {
  taskType: TaskType;
  selectedModel: ModelDefinition;
  reason: string;
  estimatedCostUsd: number;
  fallbackModelId?: string;
}

export interface PromptTemplate {
  id: string;
  version: number;
  name: string;
  description: string;
  template: string;
  variables: string[];
  createdAt: string;
}

export interface GroundingScore {
  score: number; // 0 to 100
  lexicalOverlapRatio: number;
  entityGroundingRatio: number;
  unsupportedTokensCount: number;
  status: 'HIGH' | 'MEDIUM' | 'POOR';
  details: string;
}

export interface CitationCheck {
  score: number; // 0 to 100
  validCitationsCount: number;
  invalidCitationsCount: number;
  hallucinatedSourceIds: string[];
  verifiedCitationIds: string[];
  status: 'VERIFIED' | 'SUSPECT' | 'FAILED';
}

export interface ClaimCheck {
  score: number; // 0 to 100
  totalClaimsCount: number;
  supportedClaimsCount: number;
  unsupportedClaims: string[];
  contradictedClaims: string[];
  confidence: number;
}

export type QualityGateDecision = 'PUBLISH' | 'FLAG_FOR_REVIEW' | 'REJECT';

export interface QualityGateResult {
  clusterId: string;
  passed: boolean;
  decision: QualityGateDecision;
  overallScore: number;
  grounding: GroundingScore;
  citations: CitationCheck;
  claims: ClaimCheck;
  reasons: string[];
  evaluatedAt: string;
}

export interface RegressionBenchmark {
  id: string;
  clusterHeadline: string;
  baselineScore: number;
  lastEvaluatedScore: number;
  scoreDelta: number;
  isRegressed: boolean;
  modelId: string;
  promptVersion: number;
}

export interface ModelTelemetryEntry {
  id: string;
  timestamp: string;
  modelId: string;
  taskType: TaskType;
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  latencyMs: number;
  costUsd: number;
  success: boolean;
  errorMessage?: string;
}

export interface EvaluationSummaryMetrics {
  totalEvaluated: number;
  publishRate: number;
  reviewRate: number;
  rejectRate: number;
  avgGroundingScore: number;
  avgCitationScore: number;
  avgClaimScore: number;
  avgLatencyMs: number;
  totalTokensUsed: number;
  totalCostUsd: number;
}
