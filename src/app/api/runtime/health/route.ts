import { NextResponse } from 'next/server';
import { getHealthMetrics } from '@/lib/runtime/healthMonitor';

export async function GET() {
  const health = getHealthMetrics();
  return NextResponse.json({
    health
  }, { status: 200 });
}
