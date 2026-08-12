import { NextResponse } from 'next/server';
import { getOrganization } from '@/lib/enterprise/organization';

export async function GET() {
  const organization = getOrganization();
  return NextResponse.json({
    organization
  }, { status: 200 });
}
