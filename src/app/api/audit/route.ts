import { NextRequest, NextResponse } from 'next/server';
import { getAuditLogs } from '@/lib/enterprise/audit';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const limit = parseInt(searchParams.get('limit') || '50', 10);
  const action = searchParams.get('action') || undefined;

  const logs = getAuditLogs(limit, action);

  return NextResponse.json({
    totalCount: logs.length,
    logs
  }, { status: 200 });
}
