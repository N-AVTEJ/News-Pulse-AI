import { NextRequest, NextResponse } from 'next/server';
import { getActiveWorkspace, getUserProfile, switchWorkspace, updateUserProfile } from '@/lib/personalization/profile';

export async function GET() {
  const profile = getUserProfile();
  const activeWorkspace = getActiveWorkspace();

  return NextResponse.json({
    profile,
    activeWorkspace
  }, { status: 200 });
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));

    if (body.switchWorkspaceId) {
      const activeWorkspace = switchWorkspace(body.switchWorkspaceId);
      return NextResponse.json({
        profile: getUserProfile(),
        activeWorkspace
      }, { status: 200 });
    }

    const updated = updateUserProfile(body);
    return NextResponse.json({
      profile: updated,
      activeWorkspace: getActiveWorkspace()
    }, { status: 200 });

  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown profile API error';
    return NextResponse.json(
      { error: 'Failed to update profile.', details: errorMsg },
      { status: 500 }
    );
  }
}
