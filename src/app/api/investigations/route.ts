import { NextRequest, NextResponse } from 'next/server';
import { createInvestigation, getInvestigations, updateInvestigationStatus } from '@/lib/enterprise/investigations';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status') || undefined;

  const investigations = getInvestigations(status);

  return NextResponse.json({
    totalCount: investigations.length,
    investigations
  }, { status: 200 });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (body.updateId && body.status) {
      const updated = updateInvestigationStatus(body.updateId, body.status);
      return NextResponse.json({
        investigation: updated
      }, { status: 200 });
    }

    const created = createInvestigation(
      body.title || 'Untitled Investigation',
      body.description || 'New enterprise intelligence investigation',
      body.priority || 'HIGH',
      body.createdBy || 'mem_analyst_01',
      body.assignedTo || [],
      body.tags || []
    );

    return NextResponse.json({
      investigation: created
    }, { status: 201 });

  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown investigations API error';
    return NextResponse.json(
      { error: 'Failed to process investigation request.', details: errorMsg },
      { status: 500 }
    );
  }
}
