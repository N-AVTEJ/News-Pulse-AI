import { NextRequest, NextResponse } from 'next/server';
import { dispatchWebhookPayload, getWebhookLogs } from '@/lib/platform/webhooks';

export async function GET() {
  const logs = getWebhookLogs();
  return NextResponse.json({
    totalCount: logs.length,
    logs
  }, { status: 200 });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.targetUrl || !body.eventType) {
      return NextResponse.json({ error: 'targetUrl and eventType are required.' }, { status: 400 });
    }

    const log = dispatchWebhookPayload(
      body.targetUrl,
      body.eventType,
      body.payload || { message: 'Test webhook event' },
      body.secret || 'np_wh_secret'
    );

    return NextResponse.json({ webhookLog: log }, { status: 200 });

  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown webhooks API error';
    return NextResponse.json(
      { error: 'Failed to dispatch webhook.', details: errorMsg },
      { status: 500 }
    );
  }
}
