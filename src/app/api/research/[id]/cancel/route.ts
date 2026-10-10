import { NextRequest, NextResponse } from 'next/server';
import { researchHistory } from '@/lib/research/researchHistory';
import { hasPermission } from '@/lib/enterprise/permissions';
import { Role } from '@/lib/enterprise/types';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const role = (request.headers.get('x-user-role') as Role) || 'ANALYST';

    // RBAC: Requires EDIT_INVESTIGATIONS to cancel research runs
    if (!hasPermission(role, 'EDIT_INVESTIGATIONS')) {
      return NextResponse.json(
        { error: `Unauthorized: Role '${role}' lacks 'EDIT_INVESTIGATIONS' permission.` },
        { status: 403 }
      );
    }

    const run = researchHistory.getRun(id);
    if (!run) {
      return NextResponse.json(
        { error: `Research run with ID '${id}' not found.` },
        { status: 404 }
      );
    }

    const cancelled = researchHistory.cancelRun(id);
    if (!cancelled) {
      return NextResponse.json(
        { error: `Cannot cancel research run with status '${run.status}'.` },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Research run '${id}' successfully cancelled.`,
      run: researchHistory.getRun(id)
    }, { status: 200 });
  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: 'Failed to cancel research run.', details: errorMsg },
      { status: 500 }
    );
  }
}
