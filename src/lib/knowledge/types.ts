export type NodeType = 
  | 'COMPANY'
  | 'ORGANIZATION'
  | 'PERSON'
  | 'GOVERNMENT'
  | 'TECHNOLOGY'
  | 'PRODUCT'
  | 'COUNTRY'
  | 'CITY'
  | 'EVENT'
  | 'INVESTIGATION'
  | 'REPORT'
  | 'SOURCE';

export type EdgeRelation = 
  | 'acquired'
  | 'released'
  | 'partnered'
  | 'reported_by'
  | 'located_in'
  | 'works_for'
  | 'investigates'
  | 'mentions'
  | 'references'
  | 'related_to';

export interface GraphNode {
  id: string;
  name: string;
  type: NodeType;
  canonicalName: string;
  aliases: string[];
  description?: string;
  clusterCount?: number;
  metadata?: Record<string, unknown>;
}

export interface GraphEdge {
  id: string;
  sourceId: string;
  targetId: string;
  relation: EdgeRelation;
  evidenceCount: number;
  supportingClusterIds: string[];
  weight: number;
}

export interface KnowledgeGraph {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

export interface StructuredQueryFilter {
  category?: string;
  entity?: string;
  verificationStatus?: string;
  isBreaking?: boolean;
  queryTerms?: string[];
}

export interface NaturalLanguageQueryResult {
  rawQuery: string;
  filter: StructuredQueryFilter;
  matchedClusterIds: string[];
  explanation: string;
}

export interface UnifiedTimelineEntry {
  id: string;
  timestamp: string;
  type: 'EVENT' | 'REPORT' | 'INVESTIGATION' | 'VERIFICATION_UPGRADE';
  title: string;
  summary: string;
  sourceOrClusterId: string;
}

export interface ArchiveItem {
  id: string;
  headline: string;
  summary: string;
  category: string;
  archivedAt: string;
  publisherCount: number;
}
