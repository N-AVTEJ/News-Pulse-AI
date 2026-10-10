import { NextRequest, NextResponse } from 'next/server';
import { researchHistory } from '@/lib/research/researchHistory';
import { hasPermission } from '@/lib/enterprise/permissions';
import { Role } from '@/lib/enterprise/types';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const role = (request.headers.get('x-user-role') as Role) || 'ANALYST';

    // RBAC: Requires VIEW_EVENTS
    if (!hasPermission(role, 'VIEW_EVENTS')) {
      return NextResponse.json(
        { error: `Unauthorized: Role '${role}' lacks 'VIEW_EVENTS' permission.` },
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

    return NextResponse.json({ run }, { status: 200 });
  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: 'Failed to retrieve research run.', details: errorMsg },
      { status: 500 }
    );
  }
}
