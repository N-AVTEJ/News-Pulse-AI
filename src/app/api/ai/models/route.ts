import { NextResponse } from 'next/server';
import { getAllModels } from '@/lib/ai/models';

export async function GET() {
  const models = getAllModels();
  return NextResponse.json({
    models,
    total: models.length,
    timestamp: new Date().toISOString()
  });
}
