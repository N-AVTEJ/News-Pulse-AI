import { NewsStory } from '../news/types';
import { extractEntities, normalizeHeadlineForClustering } from './headlineNormalization';
import { SimilarityBreakdown } from './types';

/**
 * Calculates Jaccard token similarity between two normalized text strings (0.0 to 1.0).
 */
export function calculateJaccardSimilarity(textA: string, textB: string): number {
  if (!textA || !textB) return 0;

  const setA = new Set(textA.split(' '));
  const setB = new Set(textB.split(' '));

  let intersection = 0;
  for (const token of Array.from(setA)) {
    if (setB.has(token)) {
      intersection++;
    }
  }

  const union = setA.size + setB.size - intersection;
  if (union === 0) return 0;

  return intersection / union;
}

/**
 * Calculates entity overlap score between two entity sets (0.0 to 1.0).
 */
export function calculateEntityOverlapScore(entitiesA: Set<string>, entitiesB: Set<string>): number {
  if (entitiesA.size === 0 || entitiesB.size === 0) return 0;

  let shared = 0;
  for (const entity of Array.from(entitiesA)) {
    if (entitiesB.has(entity)) {
      shared++;
    }
  }

  const minSize = Math.min(entitiesA.size, entitiesB.size);
  return minSize > 0 ? shared / minSize : 0;
}

/**
 * Calculates publication time proximity score (0 to 20 pts) based on hours difference.
 */
export function calculateTimeProximityScore(dateAStr: string, dateBStr: string): number {
  try {
    const timeA = new Date(dateAStr).getTime();
    const timeB = new Date(dateBStr).getTime();
    if (isNaN(timeA) || isNaN(timeB)) return 5;

    const diffHours = Math.abs(timeA - timeB) / (1000 * 60 * 60);

    if (diffHours <= 6) return 20;
    if (diffHours <= 12) return 15;
    if (diffHours <= 24) return 10;
    if (diffHours <= 36) return 5;
    return 0;
  } catch {
    return 5;
  }
}

/**
 * Calculates a deterministic 0-100 Similarity Score between two NewsStory items.
 */
export function calculateStorySimilarity(
  a: NewsStory,
  b: NewsStory
): { similarityScore: number; breakdown: SimilarityBreakdown; reason: string } {
  // 1. Headline Normalization & Jaccard Token Overlap (0-40 pts)
  const normA = normalizeHeadlineForClustering(a.headline);
  const normB = normalizeHeadlineForClustering(b.headline);
  const jaccard = calculateJaccardSimilarity(normA, normB);
  const headlineSimilarity = Math.round(jaccard * 40);

  // 2. Entity Overlap (0-30 pts)
  const entitiesA = extractEntities(a.headline);
  const entitiesB = extractEntities(b.headline);
  const entityRatio = calculateEntityOverlapScore(entitiesA, entitiesB);
  const entityOverlap = Math.round(entityRatio * 30);

  // Shared entities list for explainability
  const sharedEntities: string[] = [];
  for (const ent of Array.from(entitiesA)) {
    if (entitiesB.has(ent)) sharedEntities.push(ent);
  }

  // 3. Time Proximity (0-20 pts)
  const timeProximity = calculateTimeProximityScore(a.publishedAt, b.publishedAt);

  // 4. Category Alignment (0-10 pts)
  const categoryMatch = a.category === b.category ? 10 : 0;

  // Total similarity score clamped 0-100
  const rawTotal = headlineSimilarity + entityOverlap + timeProximity + categoryMatch;
  const totalScore = Math.min(100, Math.max(0, rawTotal));

  const breakdown: SimilarityBreakdown = {
    headlineSimilarity,
    entityOverlap,
    timeProximity,
    categoryMatch,
    totalScore
  };

  // Generate explainable reason text
  const reasonParts: string[] = [];
  reasonParts.push(`${Math.round(jaccard * 100)}% headline overlap (+${headlineSimilarity})`);
  if (sharedEntities.length > 0) {
    reasonParts.push(`Shared entities [${sharedEntities.join(', ')}] (+${entityOverlap})`);
  }
  if (timeProximity > 0) {
    reasonParts.push(`Publication window proximity (+${timeProximity})`);
  }
  if (categoryMatch > 0) {
    reasonParts.push(`Aligned category domain ${a.category} (+10)`);
  }

  const reason = reasonParts.join('; ');

  return { similarityScore: totalScore, breakdown, reason };
}
