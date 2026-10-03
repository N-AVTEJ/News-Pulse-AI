import { EventCluster } from '@/lib/clustering/types';
import { AnalysisReport } from '@/lib/analysis/types';
import { ClaimCheck } from '../types';

export function evaluateClaims(
  cluster: EventCluster,
  report?: AnalysisReport
): ClaimCheck {
  if (!report) {
    return {
      score: 0,
      totalClaimsCount: 0,
      supportedClaimsCount: 0,
      unsupportedClaims: [],
      contradictedClaims: [],
      confidence: 0
    };
  }

  // Aggregate candidate claim statements from keyFacts & whatHappened
  const candidateClaims: string[] = [
    ...(report.keyFacts || []),
    ...(report.whatChanged ? [report.whatChanged] : [])
  ].filter(c => c.trim().length > 10);

  if (candidateClaims.length === 0) {
    return {
      score: 80,
      totalClaimsCount: 0,
      supportedClaimsCount: 0,
      unsupportedClaims: [],
      contradictedClaims: [],
      confidence: 0.8
    };
  }

  const sourceCorpus = [
    cluster.canonicalHeadline,
    cluster.summary,
    ...(cluster.stories || []).map(a => `${a.headline} ${a.summary}`)
  ].join(' ').toLowerCase();

  const unsupportedClaims: string[] = [];
  const contradictedClaims: string[] = [];
  let supportedCount = 0;

  for (const claim of candidateClaims) {
    // Extract key nouns/words (> 3 chars) from claim
    const claimKeywords = claim
      .toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter(w => w.length > 3);

    if (claimKeywords.length === 0) continue;

    // Check how many keywords are confirmed in the source corpus
    const supportedKeywords = claimKeywords.filter(k => sourceCorpus.includes(k));
    const coverage = supportedKeywords.length / claimKeywords.length;

    // If less than 40% of the claim's distinct terms appear anywhere in source, mark unsupported
    if (coverage >= 0.45) {
      supportedCount++;
    } else {
      unsupportedClaims.push(claim);
    }
  }

  const total = candidateClaims.length;
  const score = total > 0 ? Math.round((supportedCount / total) * 100) : 100;
  const confidence = Number((0.7 + (supportedCount / Math.max(1, total)) * 0.3).toFixed(2));

  return {
    score,
    totalClaimsCount: total,
    supportedClaimsCount: supportedCount,
    unsupportedClaims,
    contradictedClaims,
    confidence
  };
}
