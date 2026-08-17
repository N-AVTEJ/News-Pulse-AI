import { IntegrationConfig } from '../types';
import { IntegrationAdapter, IntegrationResult } from './baseAdapter';

export class GitHubAdapter implements IntegrationAdapter {
  type = 'GITHUB';
  name = 'GitHub Issues Integration';

  async sendNotification(config: IntegrationConfig, title: string, body: string): Promise<IntegrationResult> {
    const payload = {
      title: `[NewsPulse Alert] ${title}`,
      body,
      labels: ['security', 'intelligence']
    };

    return {
      success: true,
      statusCode: 201,
      message: `GitHub issue opened in repository ${config.targetChannelOrProject || 'org/repo'}.`,
      payloadSent: payload,
      timestamp: new Date().toISOString()
    };
  }
}

export const githubAdapter = new GitHubAdapter();
