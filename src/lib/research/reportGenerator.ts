import { EventCluster } from '@/lib/clustering/types';
import { graphStore } from '@/lib/knowledge/graph';
import { extractCrossEventRelationships, buildHistoricalTimeline } from './investigationPlanner';
import {
  Contradiction,
  EntityRelationshipInsight,
  EvidenceGap,
  ResearchCitation,
  ResearchFinding,
  ResearchReport
} from './types';

export interface GenerateReportParams {
  runId: string;
  question: string;
  findings: ResearchFinding[];
  clusters: EventCluster[];
  contradictions: Contradiction[];
  evidenceGaps: EvidenceGap[];
  unresolvedQuestions: string[];
  citations: ResearchCitation[];
}

/**
 * Compiles validated findings, evidence, contradictions, and timelines into a structured Research Report.
 */
export function generateResearchReport(params: GenerateReportParams): ResearchReport {
  const {
    runId,
    question,
    findings,
    clusters,
    contradictions,
    evidenceGaps,
    unresolvedQuestions,
    citations
  } = params;

  // 1. Separate Sourced Facts from Inferred Interpretations
  const factualFindings = findings.filter(f => f.statementType === 'FACT');
  const inferredFindings = findings.filter(f => f.statementType === 'INFERENCE');

  // 2. Executive Summary construction
  const topFactLines = factualFindings.slice(0, 3).map(f => `• ${f.claim}`).join('\n');
  const inferenceLine = inferredFindings.length > 0
    ? `\n\nAnalytical Interpretation: ${inferredFindings[0].claim}`
    : '';

  const executiveSummary = topFactLines.length > 0
    ? `Autonomous investigation synthesized ${findings.length} findings across ${clusters.length} verified event clusters.\n\nKey Documented Facts:\n${topFactLines}${inferenceLine}`
    : `No sufficient verified evidence found within the monitored source corpus for "${question}".`;

  // 3. Research Scope
  const publishers = Array.from(new Set(clusters.flatMap(c => c.publishers)));
  const researchScope = `Inquiry decomposed into targeted sub-questions evaluating ${clusters.length} event clusters across ${publishers.length} independent reporting outlets (${publishers.slice(0, 5).join(', ')}${publishers.length > 5 ? ', ...' : ''}).`;

  // 4. Cross-event relationships
  const crossEventRelationships = extractCrossEventRelationships(clusters);

  // 5. Historical timeline
  const historicalTimeline = buildHistoricalTimeline(clusters, findings);

  // 6. Entity relationships from Knowledge Graph
  const entityRelationships: EntityRelationshipInsight[] = [];
  const g = graphStore.getGraph();
  for (const edge of g.edges.slice(0, 8)) {
    const sNode = graphStore.getNode(edge.sourceId);
    const tNode = graphStore.getNode(edge.targetId);
    if (sNode && tNode) {
      entityRelationships.push({
        entityA: sNode.canonicalName,
        relationship: edge.relation,
        entityB: tNode.canonicalName,
        evidence: `Documented in ${edge.evidenceCount} verified cluster reports.`
      });
    }
  }

  // 7. Potential implications
  const potentialImplications: string[] = [];
  if (clusters.some(c => c.primaryCategory === 'ai-tech')) {
    potentialImplications.push('Acceleration of competitive engineering cycles and compute infrastructure deployment.');
  }
  if (clusters.some(c => c.primaryCategory === 'business')) {
    potentialImplications.push('Shifting capital allocations, valuation adjustments, and market consolidation.');
  }
  if (clusters.some(c => c.primaryCategory === 'world')) {
    potentialImplications.push('Heightened regulatory scrutiny, policy countermeasures, and cross-border trade friction.');
  }
  if (potentialImplications.length === 0) {
    potentialImplications.push('Strategic adjustments across impacted institutional stakeholders.');
  }

  return {
    id: `rep_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    runId,
    question,
    executiveSummary,
    researchScope,
    keyFindings: findings,
    contradictions,
    evidenceGaps,
    crossEventRelationships,
    historicalTimeline,
    entityRelationships,
    potentialImplications,
    unresolvedQuestions,
    allCitations: citations,
    reviewRequired: false,
    reviewReasons: [],
    generatedAt: new Date().toISOString()
  };
}
