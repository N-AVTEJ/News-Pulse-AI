import { NextResponse } from 'next/server';
import { clearReadingHistory, getReadingHistory } from '@/lib/personalization/profile';

export async function GET() {
  const history = getReadingHistory();
  return NextResponse.json({
    totalCount: history.length,
    history
  }, { status: 200 });
}

export async function DELETE() {
  clearReadingHistory();
  return NextResponse.json({
    message: 'Reading history cleared successfully.',
    history: []
  }, { status: 200 });
}
