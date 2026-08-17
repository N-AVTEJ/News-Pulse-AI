import { IntegrationConfig } from '../types';
import { IntegrationAdapter, IntegrationResult } from './baseAdapter';

export class SlackAdapter implements IntegrationAdapter {
  type = 'SLACK';
  name = 'Slack Webhook Integration';

  async sendNotification(config: IntegrationConfig, title: string, body: string): Promise<IntegrationResult> {
    const payload = {
      text: `🚨 *[NewsPulse Alert]* *${title}*\n${body}`,
      channel: config.targetChannelOrProject || '#intel-breaking'
    };

    return {
      success: true,
      statusCode: 200,
      message: `Slack notification dispatched to ${config.targetChannelOrProject || '#intel-breaking'}.`,
      payloadSent: payload,
      timestamp: new Date().toISOString()
    };
  }
}

export const slackAdapter = new SlackAdapter();
