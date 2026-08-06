import { NextRequest, NextResponse } from 'next/server';
import { executionHistory } from '@/lib/runtime/executionHistory';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const limit = parseInt(searchParams.get('limit') || '20', 10);
  const q = searchParams.get('q') || undefined;

  const history = executionHistory.getHistory(limit, q);

  return NextResponse.json({
    totalCount: history.length,
    history
  }, { status: 200 });
}
