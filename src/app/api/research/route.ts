import { NextRequest, NextResponse } from 'next/server';
import { runAutonomousResearch } from '@/lib/research/researchOrchestrator';
import { researchHistory } from '@/lib/research/researchHistory';
import { hasPermission } from '@/lib/enterprise/permissions';
import { Role } from '@/lib/enterprise/types';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const workspaceId = searchParams.get('workspaceId') || undefined;
    const query = searchParams.get('q') || undefined;
    const role = (request.headers.get('x-user-role') as Role) || 'ANALYST';

    // RBAC: Requires VIEW_EVENTS
    if (!hasPermission(role, 'VIEW_EVENTS')) {
      return NextResponse.json(
        { error: `Unauthorized: Role '${role}' lacks 'VIEW_EVENTS' permission.` },
        { status: 403 }
      );
    }

    const runs = query ? researchHistory.searchRuns(query) : researchHistory.listRuns(workspaceId);

    return NextResponse.json({
      totalCount: runs.length,
      runs
    }, { status: 200 });
  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown research API error';
    return NextResponse.json(
      { error: 'Failed to retrieve research runs.', details: errorMsg },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const question = typeof body.question === 'string' ? body.question.trim() : '';

    if (!question || question.length < 5) {
      return NextResponse.json(
        { error: 'A valid research question (min 5 characters) is required.' },
        { status: 400 }
      );
    }

    const role = (request.headers.get('x-user-role') as Role) || (body.userRole as Role) || 'ANALYST';

    // RBAC: Requires EDIT_INVESTIGATIONS to launch autonomous research
    if (!hasPermission(role, 'EDIT_INVESTIGATIONS')) {
      return NextResponse.json(
        { error: `Unauthorized: Role '${role}' lacks 'EDIT_INVESTIGATIONS' permission.` },
        { status: 403 }
      );
    }

    const run = await runAutonomousResearch({
      question,
      workspaceId: body.workspaceId || 'workspace-default',
      organizationId: body.organizationId || 'org-enterprise-pulse',
      userId: body.userId || 'user-analyst-1',
      userRole: role,
      maxConcurrency: body.maxConcurrency || 3,
      timeoutMs: body.timeoutMs || 8000
    });

    return NextResponse.json({
      success: true,
      run
    }, { status: 201 });
  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown research execution error';
    return NextResponse.json(
      { error: 'Failed to execute autonomous research.', details: errorMsg },
      { status: 500 }
    );
  }
}
