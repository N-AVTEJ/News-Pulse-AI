import { NextResponse } from 'next/server';
import { ingestNews } from '@/lib/news/ingest';
import { clusterStories } from '@/lib/clustering/clusterEngine';
import { verifyAllClusters } from '@/lib/verification/engine';
import { generateAllAnalysisReports } from '@/lib/analysis/analysisEngine';
import { getActiveWorkspace, getUserProfile } from '@/lib/personalization/profile';
import { generateDailyBriefing, generateWeeklyReport } from '@/lib/personalization/briefings';

export async function GET() {
  try {
    const ingestion = await ingestNews();
    const { clusters } = clusterStories(ingestion.stories);
    const { verifiedClusters } = verifyAllClusters(clusters);
    const { enrichedClusters } = await generateAllAnalysisReports(verifiedClusters);

    const profile = getUserProfile();
    const workspace = getActiveWorkspace();

    const dailyBriefing = generateDailyBriefing(enrichedClusters, profile, workspace);
    const weeklyReport = generateWeeklyReport(enrichedClusters, profile, workspace);

    return NextResponse.json({
      dailyBriefing,
      weeklyReport
    }, { status: 200 });

  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown briefings API error';
    return NextResponse.json(
      { error: 'Failed to generate briefings.', details: errorMsg },
      { status: 500 }
    );
  }
}
