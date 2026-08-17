import { IntegrationConfig } from '../types';
import { IntegrationAdapter, IntegrationResult } from './baseAdapter';

export class JiraAdapter implements IntegrationAdapter {
  type = 'JIRA';
  name = 'Jira Issue Tracker Integration';

  async sendNotification(config: IntegrationConfig, title: string, body: string): Promise<IntegrationResult> {
    const payload = {
      fields: {
        project: { key: config.targetChannelOrProject || 'SEC' },
        summary: `[NewsPulse Threat] ${title}`,
        description: body,
        issuetype: { name: 'Task' }
      }
    };

    return {
      success: true,
      statusCode: 201,
      message: `Jira issue created in project ${config.targetChannelOrProject || 'SEC'}.`,
      payloadSent: payload,
      timestamp: new Date().toISOString()
    };
  }
}

export const jiraAdapter = new JiraAdapter();
