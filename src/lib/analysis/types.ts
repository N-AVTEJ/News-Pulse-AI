export interface Citation {
  id: string;
  storyId: string;
  publisherName: string;
  articleUrl: string;
  headline: string;
  publishedAt: string;
  quoteSnippet?: string;
}

export type EntityCategory = 
  | 'COMPANY'
  | 'PERSON'
  | 'ORGANIZATION'
  | 'GOVERNMENT'
  | 'PRODUCT'
  | 'TECHNOLOGY'
  | 'LOCATION';

export interface ExtractedEntity {
  id: string;
  name: string;
  category: EntityCategory;
  mentionCount: number;
  sourceArticles: string[]; // Story IDs
}

export interface EntityRelationship {
  id: string;
  subject: string;
  predicate: string;
  object: string;
  evidenceStoryId: string;
}

export type ImpactDomain = 
  | 'TECHNOLOGY'
  | 'BUSINESS'
  | 'POLICY'
  | 'RESEARCH'
  | 'INFRASTRUCTURE'
  | 'CONSUMERS'
  | 'DEVELOPERS';

export interface ImpactAssessment {
  domain: ImpactDomain;
  title: string;
  description: string;
  supportingCitations: string[]; // Citation IDs
}

export type UncertaintyType = 
  | 'MISSING_PRIMARY'
  | 'CONFLICTING_REPORTS'
  | 'BREAKING_NEWS'
  | 'LOW_DIVERSITY'
  | 'INCOMPLETE_INFO';

export interface UncertaintyDetail {
  id: string;
  type: UncertaintyType;
  title: string;
  description: string;
}

export interface RelatedEventSummary {
  clusterId: string;
  canonicalHeadline: string;
  primaryCategory: string;
  sharedEntities: string[];
  similarityScore: number;
}

export interface AnalysisReport {
  clusterId: string;
  executiveSummary: string;
  keyDevelopments: string[];
  whyItMatters: string;
  affectedOrganizations: string[];
  potentialImpact: ImpactAssessment[];
  timelineSummary: string;
  knownFacts: string[];
  remainingUncertainty: UncertaintyDetail[];
  citations: Citation[];
  entities: ExtractedEntity[];
  entityRelationships: EntityRelationship[];
  relatedEvents: RelatedEventSummary[];
  provider: string; // e.g. "gemini-2.0-flash", "grounded-deterministic-fallback"
  generatedAt: string;
  durationMs: number;
  validationPassed: boolean;
  validationNotes: string[];
}

export interface PromptContext {
  clusterId: string;
  canonicalHeadline: string;
  summary: string;
  primaryCategory: string;
  publishers: string[];
  stories: {
    id: string;
    headline: string;
    summary: string;
    publisherName: string;
    articleUrl: string;
    publishedAt: string;
  }[];
  primarySources: string[];
  matchedScouts: string[];
  scoutSignals: string[];
  verificationStatus: string;
  verificationReasons: string[];
}
