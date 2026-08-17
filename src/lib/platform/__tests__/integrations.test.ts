import { describe, it, expect } from 'vitest';
import { slackAdapter } from '../integrations/slackAdapter';
import { jiraAdapter } from '../integrations/jiraAdapter';

describe('Enterprise Integration Adapters', () => {

  it('dispatches Slack notification successfully', async () => {
    const config = { id: '1', type: 'SLACK' as const, name: 'Slack', targetChannelOrProject: '#intel-alerts', enabled: true };
    const res = await slackAdapter.sendNotification(config, 'Critical Event', 'OpenAI release detected');
    expect(res.success).toBe(true);
    expect(res.statusCode).toBe(200);
  });

  it('creates Jira ticket successfully', async () => {
    const config = { id: '2', type: 'JIRA' as const, name: 'Jira', targetChannelOrProject: 'SEC', enabled: true };
    const res = await jiraAdapter.sendNotification(config, 'Unverified Security Claim', 'Investigate claim');
    expect(res.success).toBe(true);
    expect(res.statusCode).toBe(201);
  });

});
