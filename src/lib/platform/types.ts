export type PluginCategory =
  | 'DATA_CONNECTOR'
  | 'ANALYSIS_MODULE'
  | 'VISUALIZATION'
  | 'NOTIFICATION_PROVIDER'
  | 'EXPORT_PROVIDER'
  | 'AUTHENTICATION_PROVIDER'
  | 'WORKFLOW_ACTION'
  | 'UTILITY';

export type PluginPermission =
  | 'READ_NEWS'
  | 'WRITE_REPORTS'
  | 'EMIT_NOTIFICATIONS'
  | 'NETWORK_OUTBOUND'
  | 'READ_GRAPH'
  | 'MANAGE_WORKFLOWS';

export interface PluginManifest {
  id: string;
  name: string;
  version: string;
  author: string;
  category: PluginCategory;
  permissions: PluginPermission[];
  capabilities: string[];
  supportedPlatformVersion: string;
  entryPoint: string;
  description: string;
}

export interface PluginInstance {
  manifest: PluginManifest;
  enabled: boolean;
  loadedAt: string;
  status: 'ACTIVE' | 'ERROR' | 'DISABLED';
  errorDetails?: string;
}

export type WorkflowNodeType =
  | 'TRIGGER'
  | 'SOURCE'
  | 'VERIFICATION'
  | 'SCOUT'
  | 'AI_ANALYSIS'
  | 'CONDITION'
  | 'FILTER'
  | 'NOTIFICATION'
  | 'EXPORT'
  | 'DELAY'
  | 'WEBHOOK'
  | 'BRANCH'
  | 'MERGE';

export interface WorkflowNode {
  id: string;
  type: WorkflowNodeType;
  label: string;
  config: Record<string, unknown>;
}

export interface WorkflowEdge {
  source: string;
  target: string;
  condition?: string;
}

export interface WorkflowDefinition {
  id: string;
  name: string;
  description: string;
  version: number;
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  status: 'ACTIVE' | 'DRAFT' | 'PAUSED';
  createdAt: string;
}

export interface WorkflowExecution {
  id: string;
  workflowId: string;
  startedAt: string;
  completedAt?: string;
  status: 'SUCCESS' | 'FAILED' | 'RUNNING' | 'RETRYING';
  logs: string[];
  triggerPayload?: Record<string, unknown>;
}

export type IntegrationType = 'SLACK' | 'TEAMS' | 'JIRA' | 'GITHUB' | 'EMAIL' | 'WEBHOOK' | 'SIEM';

export interface IntegrationConfig {
  id: string;
  type: IntegrationType;
  name: string;
  webhookUrl?: string;
  apiKey?: string;
  targetChannelOrProject?: string;
  enabled: boolean;
}

export interface ApiKey {
  id: string;
  key: string;
  name: string;
  ownerId: string;
  scopes: string[];
  rateLimitPerMinute: number;
  createdAt: string;
}

export interface WebhookDeliveryLog {
  id: string;
  targetUrl: string;
  eventType: string;
  timestamp: string;
  status: 'DELIVERED' | 'FAILED' | 'RETRYING';
  statusCode?: number;
  attempts: number;
}
