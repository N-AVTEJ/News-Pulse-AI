import { NextResponse } from 'next/server';
import { getSharedWorkspaces } from '@/lib/enterprise/workspace';

export async function GET() {
  const workspaces = getSharedWorkspaces();
  return NextResponse.json({
    totalCount: workspaces.length,
    workspaces
  }, { status: 200 });
}
