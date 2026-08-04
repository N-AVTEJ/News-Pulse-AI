import { EventCluster } from '../clustering/types';
import { UncertaintyDetail } from './types';

/**
 * Detects evidence gaps, missing primary sources, and conflicting reporting uncertainties.
 */
export function detectUncertainties(cluster: EventCluster): UncertaintyDetail[] {
  const uncertainties: UncertaintyDetail[] = [];
  const ver = cluster.verificationResult;

  // 1. Missing Primary Source
  if (!ver?.primarySources || ver.primarySources.length === 0) {
    uncertainties.push({
      id: 'unc_missing_primary',
      type: 'MISSING_PRIMARY',
      title: 'Official Primary Source Unavailable',
      description: 'Current coverage relies entirely on secondary media reporting. Official press release or regulatory filing link has not been detected.'
    });
  }

  // 2. Conflicting Reports
  if (ver?.verificationStatus === 'CONFLICTING_REPORTS' || (ver?.conflictingSources && ver.conflictingSources.length > 0)) {
    uncertainties.push({
      id: 'unc_conflicting_reports',
      type: 'CONFLICTING_REPORTS',
      title: 'Contradictory Coverage Figures',
      description: `Discrepancies in monetary values or figures were detected across outlets (${ver.conflictingSources.map(s => s.sourceName).join(', ')}).`
    });
  }

  // 3. Low Source Diversity / Single Publisher
  if (cluster.publisherCount === 1) {
    uncertainties.push({
      id: 'unc_low_diversity',
      type: 'LOW_DIVERSITY',
      title: 'Single Publisher Coverage',
      description: `Reported exclusively by ${cluster.publishers[0] || 'one source'}. Independent cross-publisher confirmation is pending.`
    });
  }

  // 4. Incomplete Information / Developing Story
  const latestTime = new Date(cluster.latestPublished).getTime();
  const now = Date.now();
  if (!isNaN(latestTime) && now - latestTime < 6 * 3600 * 1000) {
    uncertainties.push({
      id: 'unc_breaking_news',
      type: 'BREAKING_NEWS',
      title: 'Fluid & Developing Coverage',
      description: 'Recent publication window indicates ongoing developments. Further updates are anticipated.'
    });
  }

  return uncertainties;
}
