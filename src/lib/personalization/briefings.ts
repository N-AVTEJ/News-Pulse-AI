import { EventCluster } from '../clustering/types';
import { generatePersonalFeed } from './feedEngine';
import { DailyBriefing, UserProfile, WeeklyReport, Workspace } from './types';

/**
 * Generates an executive Daily Morning Briefing for the user.
 */
export function generateDailyBriefing(
  clusters: EventCluster[],
  profile: UserProfile,
  workspace: Workspace
): DailyBriefing {
  const ranked = generatePersonalFeed(clusters, profile, workspace);
  const todayStr = new Date().toLocaleDateString([], { month: 'long', day: 'numeric', year: 'numeric' });

  const topVerifiedEvents = ranked
    .filter(c => c.verificationResult?.verificationStatus === 'STRONG_CORROBORATION')
    .slice(0, 5)
    .map(c => c.canonicalHeadline);

  const watchlistUpdates = ranked
    .filter(c => (c.matchReasons || []).some(r => r.includes('Matches Watchlist')))
    .slice(0, 5)
    .map(c => c.canonicalHeadline);

  const breakingNews = ranked
    .filter(c => c.breakingState === 'BREAKING')
    .slice(0, 3)
    .map(c => c.canonicalHeadline);

  const aiSummaries = ranked.slice(0, 3).map(c => `${c.canonicalHeadline}: ${c.analysisReport?.executiveSummary || c.summary}`);

  const pendingDevelopments = ranked
    .filter(c => c.verificationResult?.verificationStatus === 'LIMITED_CORROBORATION' || c.verificationResult?.verificationStatus === 'INSUFFICIENT_EVIDENCE')
    .slice(0, 3)
    .map(c => c.canonicalHeadline);

  const executiveSummary = ranked.length > 0
    ? `Morning Intelligence Briefing for ${profile.name}. System evaluated ${clusters.length} active event clusters across ${workspace.name}. ${breakingNews.length > 0 ? `${breakingNews.length} breaking event(s) active.` : 'All monitored channels operational.'}`
    : `Morning Intelligence Briefing for ${profile.name}. No active event clusters detected in workspace.`;

  return {
    id: `brf_daily_${Date.now()}`,
    date: todayStr,
    title: `Daily Morning Intelligence Briefing — ${todayStr}`,
    executiveSummary,
    topVerifiedEvents: topVerifiedEvents.length > 0 ? topVerifiedEvents : ['No high corroboration events active'],
    watchlistUpdates: watchlistUpdates.length > 0 ? watchlistUpdates : ['No new watchlist updates'],
    breakingNews,
    aiSummaries,
    pendingDevelopments
  };
}

/**
 * Generates a Weekly Intelligence Report.
 */
export function generateWeeklyReport(
  clusters: EventCluster[],
  profile: UserProfile,
  workspace: Workspace
): WeeklyReport {
  const ranked = generatePersonalFeed(clusters, profile, workspace);

  const majorEvents = ranked.slice(0, 7).map(c => c.canonicalHeadline);
  const emergingTrends = Array.from(new Set(ranked.flatMap(c => c.matchedSignals || []))).slice(0, 5);

  const entitySet = new Set<string>();
  for (const c of ranked) {
    for (const ent of c.analysisReport?.entities || []) {
      entitySet.add(ent.name);
    }
  }

  const sectorSummaries: Record<string, string> = {
    'AI & Technology': `Active developments in frontier models and hardware. ${ranked.filter(c => c.primaryCategory === 'ai-tech').length} clusters tracked.`,
    'Business & Markets': `Commercial deals and enterprise impact. ${ranked.filter(c => c.primaryCategory === 'business').length} clusters tracked.`,
    'World & Policy': `Geopolitical developments and regulatory policies. ${ranked.filter(c => c.primaryCategory === 'world').length} clusters tracked.`
  };

  return {
    id: `brf_weekly_${Date.now()}`,
    weekRange: 'Current Week',
    title: `Weekly Intelligence Summary Report — ${workspace.name}`,
    executiveSummary: `Weekly strategic assessment across ${clusters.length} event clusters. Key coverage spans ${Array.from(entitySet).slice(0, 4).join(', ')}.`,
    majorEvents,
    emergingTrends: emergingTrends.length > 0 ? emergingTrends : ['STABLE_COVERAGE', 'MULTI_PUBLISHER_MONITORING'],
    mostActiveEntities: Array.from(entitySet).slice(0, 8),
    sectorSummaries
  };
}
