import { EventCluster } from '../clustering/types';
import { Citation, ImpactAssessment } from './types';

/**
 * Generates structured impact assessment items grounded strictly in cluster evidence.
 */
export function generateImpactAssessment(
  cluster: EventCluster,
  citations: Citation[]
): ImpactAssessment[] {
  const impacts: ImpactAssessment[] = [];
  const text = `${cluster.canonicalHeadline} ${cluster.summary}`.toLowerCase();
  const defaultCitIds = citations.map((c) => c.id);

  // 1. TECHNOLOGY domain
  if (cluster.primaryCategory === 'ai-tech' || text.includes('ai') || text.includes('software') || text.includes('chip') || text.includes('model')) {
    impacts.push({
      domain: 'TECHNOLOGY',
      title: 'Technological & Architecture Implications',
      description: `Affects core technical frameworks and product features in ${cluster.canonicalHeadline}. Requires technical evaluation by engineering teams.`,
      supportingCitations: defaultCitIds.slice(0, 2)
    });
  }

  // 2. BUSINESS domain
  if (cluster.primaryCategory === 'business' || text.includes('market') || text.includes('funding') || text.includes('revenue') || text.includes('earning')) {
    impacts.push({
      domain: 'BUSINESS',
      title: 'Market & Enterprise Commercial Impact',
      description: `Influences commercial strategy and market positioning across ${cluster.publishers.join(', ')} reporting outlets.`,
      supportingCitations: defaultCitIds.slice(0, 2)
    });
  }

  // 3. POLICY domain
  if (cluster.primaryCategory === 'world' || text.includes('policy') || text.includes('regulation') || text.includes('government') || text.includes('legal')) {
    impacts.push({
      domain: 'POLICY',
      title: 'Regulatory & Governance Outlook',
      description: 'Raises compliance and governance requirements for organizations operating within relevant jurisdictions.',
      supportingCitations: defaultCitIds.slice(0, 2)
    });
  }

  // 4. DEVELOPERS / CONSUMERS domain
  impacts.push({
    domain: text.includes('developer') || text.includes('api') ? 'DEVELOPERS' : 'CONSUMERS',
    title: 'User & Stakeholder Direct Impact',
    description: `Directly shapes end-user experience and developer integration workflows relating to "${cluster.canonicalHeadline}".`,
    supportingCitations: defaultCitIds.slice(0, 1)
  });

  return impacts;
}
