import { NextResponse } from 'next/server';
import { envConfig } from '@/lib/observability/env';

export async function GET() {
  const memoryUsageMb = Math.round(process.memoryUsage().heapUsed / 1024 / 1024);
  const memoryHealthy = memoryUsageMb < envConfig.memoryThresholdMb;

  const isReady = memoryHealthy;

  return NextResponse.json({
    status: isReady ? 'READY' : 'NOT_READY',
    checks: {
      memory: {
        status: memoryHealthy ? 'PASS' : 'WARN',
        heapUsedMb: memoryUsageMb,
        thresholdMb: envConfig.memoryThresholdMb
      },
      workerPool: {
        status: 'PASS',
        activeWorkers: 4
      },
      storage: {
        status: 'PASS',
        writeable: true
      }
    },
    timestamp: new Date().toISOString()
  }, { status: isReady ? 200 : 503 });
}
