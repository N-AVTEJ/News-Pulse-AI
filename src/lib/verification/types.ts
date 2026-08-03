import { NewsStory } from '../news/types';

export type VerificationStatus = 
  | 'UNASSESSED'
  | 'PENDING'
  | 'LIMITED_CORROBORATION'
  | 'STRONG_CORROBORATION'
  | 'CONFLICTING_REPORTS'
  | 'INSUFFICIENT_EVIDENCE';

export type SourceCategory = 
  | 'OFFICIAL_ORG'
  | 'GOVERNMENT'
  | 'ACADEMIC'
  | 'WIRE_SERVICE'
  | 'NEWS_ORG'
  | 'COMPANY_BLOG'
  | 'INDUSTRY_PUB'
  | 'TECH_PUB'
  | 'OTHER';

export interface VerificationResult {
  clusterId: string;
  verificationStatus: VerificationStatus;
  supportingSources: string[];      // Array of publisher names
  independentSources: number;      // Count of distinct independent publisher domains
  primarySources: NewsStory[];      // Official Org, Gov, Academic, Company Blog
  secondarySources: NewsStory[];    // Wire, News Org, Industry Pub
  conflictingSources: NewsStory[];  // Stories with contradictory figures/claims
  evidenceCount: number;
  verificationReasons: string[];   // Transparent rule triggers
  generatedAt: string;
  semanticAgreement: null;          // Reserved for future AI phase
  claimConsistency: null;           // Reserved for future AI phase
}

export type NodeType = 'CLUSTER' | 'PRIMARY_SOURCE' | 'SECONDARY_SOURCE' | 'STORY' | 'ENTITY';
export type EdgeType = 'REPORTED_BY' | 'CITES_PRIMARY' | 'CONFLICTS_WITH' | 'ASSOCIATED_ENTITY';

export interface EvidenceNode {
  id: string;
  label: string;
  type: NodeType;
  category?: SourceCategory;
  metadata?: Record<string, unknown>;
}

export interface EvidenceEdge {
  id: string;
  source: string;
  target: string;
  label: string;
  type: EdgeType;
}

export interface EvidenceGraph {
  nodes: EvidenceNode[];
  edges: EvidenceEdge[];
}

export interface VerificationTelemetry {
  totalClustersVerified: number;
  statusDistribution: Record<VerificationStatus, number>;
  conflictsDetectedCount: number;
  averageEvidenceCount: number;
  durationMs: number;
}
