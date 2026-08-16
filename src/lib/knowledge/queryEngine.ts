import { EventCluster } from '../clustering/types';
import { resolveEntity } from './entityResolver';
import { NaturalLanguageQueryResult, StructuredQueryFilter } from './types';

/**
 * Translates natural language queries into structured search filters and matches Event Clusters.
 */
export function parseNaturalLanguageQuery(
  rawQuery: string,
  clusters: EventCluster[]
): NaturalLanguageQueryResult {
  if (!rawQuery || rawQuery.trim() === '') {
    return {
      rawQuery: '',
      filter: {},
      matchedClusterIds: clusters.map(c => c.clusterId),
      explanation: 'No query provided; returning all active intelligence clusters.'
    };
  }

  const q = rawQuery.trim().toLowerCase();
  const filter: StructuredQueryFilter = {};
  const queryTerms: string[] = [];

  // 1. Detect Category Intention
  if (q.includes('ai') || q.includes('tech') || q.includes('software') || q.includes('model')) {
    filter.category = 'ai-tech';
    queryTerms.push('AI & Tech');
  } else if (q.includes('business') || q.includes('market') || q.includes('stock') || q.includes('finance')) {
    filter.category = 'business';
    queryTerms.push('Business');
  } else if (q.includes('world') || q.includes('policy') || q.includes('defense') || q.includes('geopolitical')) {
    filter.category = 'world';
    queryTerms.push('World News');
  }

  // 2. Detect Verification / Breaking Intention
  if (q.includes('verified') || q.includes('corroborated') || q.includes('confirmed')) {
    filter.verificationStatus = 'STRONG_CORROBORATION';
    queryTerms.push('Strong Corroboration');
  }
  if (q.includes('breaking') || q.includes('urgent') || q.includes('rapid')) {
    filter.isBreaking = true;
    queryTerms.push('Breaking News');
  }

  // 3. Detect Entity Intention (e.g. OpenAI, Nvidia, Google, Apple)
  const knownEntities = ['openai', 'google', 'nvidia', 'microsoft', 'apple', 'tsmc', 'chatgpt', 'gemini'];
  for (const ent of knownEntities) {
    if (q.includes(ent)) {
      const resolved = resolveEntity(ent);
      filter.entity = resolved.canonicalName;
      queryTerms.push(`Entity [${resolved.canonicalName}]`);
      break;
    }
  }

  // 4. Match Clusters against Filter
  const matched = clusters.filter((c) => {
    if (filter.category && c.primaryCategory !== filter.category) return false;
    if (filter.verificationStatus && c.verificationResult?.verificationStatus !== filter.verificationStatus) return false;
    if (filter.isBreaking && c.breakingState !== 'BREAKING') return false;
    if (filter.entity) {
      const matchInHeadline = c.canonicalHeadline.toLowerCase().includes(filter.entity.toLowerCase());
      const matchInSummary = c.summary.toLowerCase().includes(filter.entity.toLowerCase());
      const matchInEntities = (c.analysisReport?.entities || []).some(e => e.name.toLowerCase() === filter.entity!.toLowerCase());
      if (!matchInHeadline && !matchInSummary && !matchInEntities) return false;
    }
    return true;
  });

  const explanation = queryTerms.length > 0
    ? `Query translated to filters: ${queryTerms.join(' · ')} (${matched.length} matching clusters).`
    : `Searched full text for "${rawQuery}" (${matched.length} matching clusters).`;

  return {
    rawQuery,
    filter,
    matchedClusterIds: matched.map(m => m.clusterId),
    explanation
  };
}
