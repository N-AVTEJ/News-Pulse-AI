import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    platformVersion: '1.0.0',
    documentation: {
      publicApi: 'https://docs.newspulse.ai/api/v1',
      pluginSdk: 'https://docs.newspulse.ai/plugins/sdk',
      workflowEngine: 'https://docs.newspulse.ai/workflows/builder'
    },
    supportedIntegrations: ['SLACK', 'TEAMS', 'JIRA', 'GITHUB', 'EMAIL', 'WEBHOOK', 'SIEM'],
    defaultRateLimit: '60 requests per minute',
    authentication: 'Bearer Token (API Key)'
  }, { status: 200 });
}
