export type JobStatus = 'QUEUED' | 'RUNNING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';

export type PipelineStage = 
  | 'INGESTION'
  | 'INCREMENTAL_DETECTION'
  | 'CLUSTERING'
  | 'VERIFICATION'
  | 'SCOUTS'
  | 'AI_ANALYSIS'
  | 'BREAKING_DETECTION'
  | 'NOTIFICATIONS';

export interface PipelineJob {
  id: string;
  stage: PipelineStage;
  status: JobStatus;
  startedAt?: string;
  completedAt?: string;
  durationMs?: number;
  error?: string;
  resultData?: Record<string, unknown>;
}

export type PipelineRunStatus = 'IDLE' | 'RUNNING' | 'SUCCESS' | 'FAILED';
export type PipelineRunTrigger = 'SCHEDULED' | 'MANUAL' | 'WEBHOOK' | 'DEV_MODE';

export interface PipelineRun {
  runId: string;
  trigger: PipelineRunTrigger;
  status: PipelineRunStatus;
  startedAt: string;
  completedAt?: string;
  durationMs?: number;
  jobs: PipelineJob[];
  errors: string[];
  newStoriesCount: number;
  updatedClustersCount: number;
  notificationsGeneratedCount: number;
}

export type BreakingState = 'DEVELOPING' | 'BREAKING' | 'CONFIRMED' | 'ARCHIVED';

export type NotificationType = 
  | 'BREAKING_EVENT'
  | 'VERIFICATION_UPGRADE'
  | 'PRIMARY_STATEMENT_ADDED'
  | 'HIGH_IMPACT_REPORT';

export interface NotificationItem {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  clusterId: string;
  timestamp: string;
  read: boolean;
  category: string;
}

export interface UserNotificationPreferences {
  aiTech: boolean;
  business: boolean;
  world: boolean;
  breakingOnly: boolean;
  officialAnnouncementsOnly: boolean;
}

export interface HealthMetrics {
  schedulerActive: boolean;
  schedulerMode: 'MANUAL' | 'INTERVAL' | 'DEV' | 'PROD';
  workersActive: number;
  queueLength: number;
  lastSuccessfulRun: string | null;
  averageExecutionTimeMs: number;
  sourceAvailabilityPercentage: number;
  failedJobsCount: number;
  totalRunsCompleted: number;
}
