import { NextResponse } from 'next/server';
import { metricsRegistry } from '@/lib/observability/metrics';

export async function GET() {
  const metrics = metricsRegistry.getSnapshot();
  return NextResponse.json({
    metrics,
    format: 'application/json',
    timestamp: new Date().toISOString()
  }, { status: 200 });
}
