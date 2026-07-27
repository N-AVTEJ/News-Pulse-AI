import { NewsStory } from '../../news/types';
import { ScoreBreakdown, ScoutCategory } from '../types';

/**
 * Scans story text (headline + summary) against a dictionary of signal keywords.
 * Returns array of matched signal names.
 */
export function detectSignals(text: string, signalsDict: Record<string, string[]>): string[] {
  if (!text) return [];

  const textLower = text.toLowerCase();
  const matched: string[] = [];

  for (const [signalName, keywords] of Object.entries(signalsDict)) {
    for (const kw of keywords) {
      if (textLower.includes(kw.toLowerCase())) {
        matched.push(signalName);
        break; // Matched this signal category, move to next
      }
    }
  }

  return matched;
}

/**
 * Calculates a deterministic 0-100 Scout Selection Score and explainable breakdown.
 * 
 * Rules:
 * - Category Alignment: +25 pts (if story.category matches scout category)
 * - Primary Signal Match: +30 pts (if at least 1 signal matched)
 * - Secondary Signals: +10 pts per additional signal (max +20 pts)
 * - Corroborations: +10 pts for 2+ corroborating outlets (max +15 pts)
 * - Recency: +10 pts if published within 24h (+5 pts if within 48h)
 * 
 * Final score clamped between 0 and 100.
 */
export function calculateSelectionScore(
  story: NewsStory,
  matchedCategory: ScoutCategory,
  matchedSignals: string[]
): { score: number; breakdown: ScoreBreakdown; reason: string } {
  // 1. Category Alignment
  const categoryAlignment = story.category === matchedCategory ? 25 : 0;

  // 2. Primary Signal Match
  const primarySignal = matchedSignals.length > 0 ? 30 : 0;

  // 3. Secondary Signals
  const extraSignalsCount = Math.max(0, matchedSignals.length - 1);
  const secondarySignals = Math.min(20, extraSignalsCount * 10);

  // 4. Corroboration (from Phase 2 deduplicated outlets)
  const corroborators = story.corroboratingSources?.length || 1;
  const corroboration = corroborators >= 3 ? 15 : corroborators === 2 ? 10 : 0;

  // 5. Recency
  let recency = 0;
  try {
    const pubTime = new Date(story.publishedAt).getTime();
    const now = Date.now();
    const diffHours = (now - pubTime) / (1000 * 60 * 60);

    if (diffHours <= 24 && diffHours >= 0) {
      recency = 10;
    } else if (diffHours <= 48 && diffHours >= 0) {
      recency = 5;
    }
  } catch {
    recency = 0;
  }

  // Calculate sum and clamp between 0 and 100
  const rawTotal = categoryAlignment + primarySignal + secondarySignals + corroboration + recency;
  const total = Math.min(100, Math.max(0, rawTotal));

  const breakdown: ScoreBreakdown = {
    categoryAlignment,
    primarySignal,
    secondarySignals,
    corroboration,
    recency,
    total
  };

  // Generate explainable reason text
  const reasonParts: string[] = [];
  if (categoryAlignment > 0) reasonParts.push(`Aligned with ${matchedCategory} domain (+25)`);
  if (matchedSignals.length > 0) reasonParts.push(`Matched signals [${matchedSignals.join(', ')}] (+${primarySignal + secondarySignals})`);
  if (corroboration > 0) reasonParts.push(`Reported across ${corroborators} outlets (+${corroboration})`);
  if (recency > 0) reasonParts.push(`Published recently (+${recency})`);

  const reason = reasonParts.length > 0 
    ? reasonParts.join('; ')
    : 'Evaluated against baseline scout rules';

  return { score: total, breakdown, reason };
}
