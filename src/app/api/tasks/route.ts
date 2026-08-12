import { NextRequest, NextResponse } from 'next/server';
import { createTask, getTasks, toggleChecklistItem, updateTaskStatus } from '@/lib/enterprise/tasks';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status') || undefined;

  const tasks = getTasks(status);

  return NextResponse.json({
    totalCount: tasks.length,
    tasks
  }, { status: 200 });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (body.updateTaskId && body.status) {
      const updated = updateTaskStatus(body.updateTaskId, body.status);
      return NextResponse.json({ task: updated }, { status: 200 });
    }

    if (body.toggleTaskId && body.checklistItemId) {
      const updated = toggleChecklistItem(body.toggleTaskId, body.checklistItemId);
      return NextResponse.json({ task: updated }, { status: 200 });
    }

    const task = createTask(
      body.title || 'Untitled Task',
      body.description || 'New collaborative task',
      body.assigneeId || 'mem_analyst_01',
      body.assigneeName || 'Alex Vance',
      body.dueDate || new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
      body.priority || 'MEDIUM',
      body.linkedInvestigationId,
      body.linkedClusterId
    );

    return NextResponse.json({ task }, { status: 201 });

  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown tasks API error';
    return NextResponse.json(
      { error: 'Failed to process task request.', details: errorMsg },
      { status: 500 }
    );
  }
}
