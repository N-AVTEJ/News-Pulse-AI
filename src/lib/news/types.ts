export type NewsCategory = 'ai-tech' | 'business' | 'world';

export type SourceType = 'rss' | 'atom' | 'api';

export interface SourceConfig {
  id: string;
  name: string;
  category: NewsCategory;
  feedUrl: string;
  homepageUrl: string;
  enabled: boolean;
  sourceType: SourceType;
}

export interface NewsStory {
  id: string;
  headline: string;
  summary: string;
  sourceName: string;
  sourceUrl: string;
  articleUrl: string;
  category: NewsCategory;
  publishedAt: string; // ISO 8601 string or formatted date
  retrievedAt: string; // ISO 8601 string
  author?: string;
  imageUrl?: string;
  sourceType: SourceType;
  corroboratingSources?: string[]; // Names of other outlets reporting identical headline/coverage
  
  // Intelligence fields reserved for future AI scoring phases (unpopulated or null in Phase 2)
  importanceScore?: number | null;
  confidenceScore?: number | null;
  verificationStatus?: string | null;
}

export interface SourceStatus {
  sourceId: string;
  sourceName: string;
  category: NewsCategory;
  enabled: boolean;
  status: 'SUCCESS' | 'FAILED';
  storiesRetrieved: number;
  fetchDurationMs: number;
  lastSuccessAt?: string;
  lastError?: string;
}

export interface IngestionResponse {
  stories: NewsStory[];
  total: number;
  retrievedAt: string;
  sourceStatus: SourceStatus[];
}
