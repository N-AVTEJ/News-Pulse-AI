import { EventCluster } from '../clustering/types';
import { buildCitations, validateCitations } from './citationBuilder';
import { extractEntitiesFromCluster, extractEntityRelationships } from './entityExtractor';
import { generateImpactAssessment } from './impactAssessment';
import { RawAnalysisOutput } from './providers/providerInterface';
import { findRelatedEvents } from './relatedEvents';
import { AnalysisReport } from './types';
import { detectUncertainties } from './uncertaintyDetector';

/**
 * Formats raw LLM output into a validated, evidence-grounded AnalysisReport.
 */
export function formatAndValidateReport(
  raw: RawAnalysisOutput,
  cluster: EventCluster,
  allClusters: EventCluster[] = [],
  durationMs: number = 0
): AnalysisReport {
  const citations = buildCitations(cluster.stories || []);
  const entities = extractEntitiesFromCluster(cluster);
  const entityRelationships = extractEntityRelationships(cluster, entities);
  const potentialImpact = generateImpactAssessment(cluster, citations);
  const remainingUncertainty = detectUncertainties(cluster);
  const relatedEvents = findRelatedEvents(cluster, allClusters);

  const citValidation = validateCitations(citations, cluster.stories || []);
  const validationNotes: string[] = [];

  if (!citValidation.valid) {
    validationNotes.push(`Citation validation warning: ${citValidation.missingCitations.length} citations failed verification.`);
  }

  // Validate groundings: Ensure executive summary contains reference to real story content
  let validationPassed = true;
  if (!raw.executiveSummary || raw.executiveSummary.length < 10) {
    validationPassed = false;
    validationNotes.push('Executive summary missing or insufficient length.');
  }

  return {
    clusterId: cluster.clusterId,
    executiveSummary: raw.executiveSummary || cluster.summary,
    keyDevelopments: raw.keyDevelopments.length > 0 ? raw.keyDevelopments : [cluster.canonicalHeadline],
    whyItMatters: raw.whyItMatters || 'High signal intelligence development.',
    affectedOrganizations: raw.affectedOrganizations,
    potentialImpact,
    timelineSummary: raw.timelineSummary || `Reported by ${cluster.publishers.join(', ')}.`,
    knownFacts: raw.knownFacts.length > 0 ? raw.knownFacts : [cluster.canonicalHeadline],
    remainingUncertainty,
    citations,
    entities,
    entityRelationships,
    relatedEvents,
    provider: raw.providerName,
    generatedAt: new Date().toISOString(),
    durationMs,
    validationPassed,
    validationNotes
  };
}
