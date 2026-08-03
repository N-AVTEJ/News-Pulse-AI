import { EventCluster } from '../clustering/types';
import { NewsStory } from '../news/types';
import { detectClaimConflicts } from './claimMatcher';
import { classifySource } from './sourceClassification';
import { VerificationResult, VerificationStatus } from './types';

/**
 * Centralized deterministic verification rules engine.
 */
export function evaluateVerificationRules(cluster: EventCluster): VerificationResult {
  const stories = cluster.stories || [];
  const primarySources: NewsStory[] = [];
  const secondarySources: NewsStory[] = [];

  // Classify each story source into Primary vs Secondary
  for (const story of stories) {
    const classification = classifySource(story.sourceName, story.articleUrl);
    if (classification.isPrimary) {
      primarySources.push(story);
    } else {
      secondarySources.push(story);
    }
  }

  // Count distinct independent publisher domains (avoiding duplicate articles from 1 source)
  const uniquePublishers = Array.from(new Set(stories.map(s => s.sourceName)));
  const independentPublisherCount = uniquePublishers.length;

  // Run conflict detection
  const conflictCheck = detectClaimConflicts(stories);

  let verificationStatus: VerificationStatus = 'UNASSESSED';
  const reasons: string[] = [];

  // Rule 1: Conflict Detection
  if (conflictCheck.hasConflict) {
    verificationStatus = 'CONFLICTING_REPORTS';
    reasons.push(`Conflicting claims detected: ${conflictCheck.conflicts.join('; ')}`);
  } 
  // Rule 2: Strong Corroboration (3+ independent publishers OR 2+ publishers with primary evidence)
  else if (independentPublisherCount >= 3 || (independentPublisherCount >= 2 && primarySources.length >= 1)) {
    verificationStatus = 'STRONG_CORROBORATION';
    reasons.push(`Strong Corroboration: ${independentPublisherCount} independent publishers [${uniquePublishers.join(', ')}] reporting on the same event.`);
    if (primarySources.length >= 1) {
      reasons.push(`Primary evidence detected: ${primarySources.map(s => s.sourceName).join(', ')}.`);
    }
  } 
  // Rule 3: Limited Corroboration (2 publishers OR 1 publisher with primary evidence)
  else if (independentPublisherCount === 2 || (independentPublisherCount === 1 && primarySources.length >= 1)) {
    verificationStatus = 'LIMITED_CORROBORATION';
    reasons.push(`Limited Corroboration: ${independentPublisherCount} independent publisher(s) [${uniquePublishers.join(', ')}] reporting.`);
    if (primarySources.length >= 1) {
      reasons.push(`Primary source present: ${primarySources[0].sourceName}.`);
    } else {
      reasons.push(`Awaiting further independent publisher confirmation.`);
    }
  } 
  // Rule 4: Insufficient Evidence (Single publisher without primary evidence)
  else {
    verificationStatus = 'INSUFFICIENT_EVIDENCE';
    reasons.push(`Insufficient Evidence: Single publisher report [${uniquePublishers[0] || 'Unknown'}] without primary source corroboration.`);
  }

  return {
    clusterId: cluster.clusterId,
    verificationStatus,
    supportingSources: uniquePublishers,
    independentSources: independentPublisherCount,
    primarySources,
    secondarySources,
    conflictingSources: conflictCheck.conflictingStories,
    evidenceCount: stories.length,
    verificationReasons: reasons,
    generatedAt: new Date().toISOString(),
    semanticAgreement: null,
    claimConsistency: null
  };
}
