import { IntegrationConfig } from '../types';

export interface IntegrationResult {
  success: boolean;
  statusCode: number;
  message: string;
  payloadSent?: Record<string, unknown>;
  timestamp: string;
}

export interface IntegrationAdapter {
  type: string;
  name: string;
  sendNotification(config: IntegrationConfig, title: string, body: string): Promise<IntegrationResult>;
}
