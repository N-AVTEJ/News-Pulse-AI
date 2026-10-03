import { NextRequest, NextResponse } from 'next/server';
import { routeTask } from '@/lib/ai/router';
import { TaskType } from '@/lib/ai/types';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const taskType: TaskType = body.taskType || 'SUMMARY';
    const contextLengthChars: number = body.contextLengthChars || 2000;
    const preferLocalFallback: boolean = !!body.preferLocalFallback;

    const decision = routeTask(taskType, contextLengthChars, preferLocalFallback);

    return NextResponse.json({
      decision,
      timestamp: new Date().toISOString()
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Unknown routing error';
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
