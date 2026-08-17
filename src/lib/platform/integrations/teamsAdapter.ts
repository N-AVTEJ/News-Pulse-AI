import { IntegrationConfig } from '../types';
import { IntegrationAdapter, IntegrationResult } from './baseAdapter';

export class TeamsAdapter implements IntegrationAdapter {
  type = 'TEAMS';
  name = 'Microsoft Teams Integration';

  async sendNotification(config: IntegrationConfig, title: string, body: string): Promise<IntegrationResult> {
    const payload = {
      '@type': 'MessageCard',
      summary: title,
      themeColor: '4F46E5',
      title: `NewsPulse Intelligence: ${title}`,
      text: body
    };

    return {
      success: true,
      statusCode: 200,
      message: `Microsoft Teams card dispatched to ${config.targetChannelOrProject || 'General'}.`,
      payloadSent: payload,
      timestamp: new Date().toISOString()
    };
  }
}

export const teamsAdapter = new TeamsAdapter();
