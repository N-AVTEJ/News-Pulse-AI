import { EventCluster } from '@/lib/clustering/types';
import { createInvestigation, attachEvidenceToInvestigation } from '@/lib/enterprise/investigations';
import { Investigation } from '@/lib/enterprise/types';
import { CrossEventRelationship, HistoricalTimelineItem, ResearchFinding, ResearchRun } from './types';

/**
 * Discovers cross-event relationships across clusters matching the research inquiry.
 */
export function extractCrossEventRelationships(clusters: EventCluster[]): CrossEventRelationship[] {
  const relationships: CrossEventRelationship[] = [];

  for (let i = 0; i < clusters.length; i++) {
    for (let j = i + 1; j < clusters.length; j++) {
      const c1 = clusters[i];
      const c2 = clusters[j];

      // Check for shared entities
      const entities1 = new Set((c1.resolvedEntities || []).map(e => e.toLowerCase()));
      const sharedEntities = (c2.resolvedEntities || []).filter(e => entities1.has(e.toLowerCase()));

      if (sharedEntities.length > 0) {
        relationships.push({
          sourceClusterId: c1.clusterId,
          targetClusterId: c2.clusterId,
          relationType: 'SHARED_ENTITY_LINK',
          description: `Both events involve key entities: ${sharedEntities.join(', ')}.`
        });
      } else if (c1.primaryCategory === c2.primaryCategory) {
        relationships.push({
          sourceClusterId: c1.clusterId,
          targetClusterId: c2.clusterId,
          relationType: 'THEMATIC_CORRELATION',
          description: `Correlated reporting in domain ${c1.primaryCategory}.`
        });
      }
    }
  }

  return relationships.slice(0, 10);
}

/**
 * Builds a chronological historical timeline from clusters and verified findings.
 */
export function buildHistoricalTimeline(
  clusters: EventCluster[],
  findings: ResearchFinding[]
): HistoricalTimelineItem[] {
  const items: HistoricalTimelineItem[] = [];

  for (const cluster of clusters) {
    items.push({
      timestamp: cluster.firstPublished || new Date().toISOString(),
      eventHeadline: cluster.canonicalHeadline,
      source: cluster.publishers.join(', ') || 'NewsPulse Intelligence',
      significance: cluster.summary.slice(0, 120)
    });
  }

  for (const finding of findings) {
    if (finding.supportingCitations.length > 0) {
      const firstCite = finding.supportingCitations[0];
      items.push({
        timestamp: firstCite.publishedAt || new Date().toISOString(),
        eventHeadline: firstCite.headline,
        source: firstCite.publisherName,
        significance: finding.claim.slice(0, 120)
      });
    }
  }

  // Sort chronologically (earliest first)
  return items
    .filter((v, i, a) => a.findIndex(t => t.eventHeadline === v.eventHeadline) === i)
    .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
    .slice(0, 15);
}

/**
 * Optionally links a completed research run to an Enterprise Investigation.
 */
export function linkResearchRunToInvestigation(
  run: ResearchRun,
  matchedClusterIds: string[]
): Investigation {
  const inv = createInvestigation(
    `[Research] ${run.question.slice(0, 70)}`,
    `Autonomous research investigation based on: "${run.question}".`,
    'HIGH',
    run.userId || 'mem_analyst_01',
    [run.userId || 'mem_analyst_01'],
    ['Autonomous Research', 'Deep Intelligence']
  );

  for (const cid of matchedClusterIds) {
    attachEvidenceToInvestigation(inv.id, cid);
  }

  return inv;
}
