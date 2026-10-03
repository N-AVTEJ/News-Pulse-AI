import { EventCluster } from '@/lib/clustering/types';
import { AnalysisReport } from '@/lib/analysis/types';
import { GroundingScore } from '../types';

// Stop words to exclude from lexical overlap
const STOP_WORDS = new Set([
  'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by',
  'is', 'are', 'was', 'were', 'it', 'this', 'that', 'from', 'as', 'into', 'what', 'who',
  'why', 'when', 'how', 'which', 'has', 'have', 'had', 'been', 'will', 'would', 'could',
  'should', 'can', 'not', 'their', 'they', 'them', 'its', 'about', 'more', 'also', 'than'
]);

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(token => token.length > 2 && !STOP_WORDS.has(token));
}

export function evaluateGrounding(
  cluster: EventCluster,
  report?: AnalysisReport
): GroundingScore {
  if (!report) {
    return {
      score: 0,
      lexicalOverlapRatio: 0,
      entityGroundingRatio: 0,
      unsupportedTokensCount: 0,
      status: 'POOR',
      details: 'No analysis report provided for evaluation'
    };
  }

  // 1. Build source corpus tokens from all articles in the cluster
  const sourceText = [
    cluster.canonicalHeadline,
    cluster.summary,
    ...cluster.articles.map(a => `${a.title} ${a.description} ${a.contentSnippet || ''}`)
  ].join(' ');
  const sourceTokens = new Set(tokenize(sourceText));

  // 2. Extract generated tokens from report sections
  const reportText = [
    report.whatHappened,
    report.whyItMatters,
    report.whoIsAffected,
    report.whatChanged,
    report.whatIsUncertain,
    ...report.keyFacts
  ].join(' ');
  const generatedTokens = tokenize(reportText);

  if (generatedTokens.length === 0) {
    return {
      score: 0,
      lexicalOverlapRatio: 0,
      entityGroundingRatio: 0,
      unsupportedTokensCount: 0,
      status: 'POOR',
      details: 'Report content is empty'
    };
  }

  let matchedTokens = 0;
  let unsupportedTokensCount = 0;

  for (const token of generatedTokens) {
    if (sourceTokens.has(token)) {
      matchedTokens++;
    } else {
      unsupportedTokensCount++;
    }
  }

  const lexicalOverlapRatio = Number((matchedTokens / generatedTokens.length).toFixed(3));

  // 3. Entity Grounding: check if extracted entities in the report appear in source articles
  let groundedEntities = 0;
  const totalEntities = report.entities?.length || 0;

  if (totalEntities > 0) {
    const sourceLower = sourceText.toLowerCase();
    for (const ent of report.entities) {
      if (sourceLower.includes(ent.name.toLowerCase())) {
        groundedEntities++;
      }
    }
  }
  const entityGroundingRatio = totalEntities > 0
    ? Number((groundedEntities / totalEntities).toFixed(3))
    : 1.0;

  // Composite Grounding Score: 70% lexical overlap + 30% entity grounding
  // Note: Standard natural summaries normally have ~65-85% lexical overlap due to summarization phrasing
  // We calibrate: 60% overlap translates to 85+ score.
  const calibratedLexical = Math.min(100, (lexicalOverlapRatio / 0.7) * 100);
  const calibratedEntity = entityGroundingRatio * 100;
  const score = Math.round(calibratedLexical * 0.7 + calibratedEntity * 0.3);

  let status: GroundingScore['status'] = 'HIGH';
  if (score < 55) status = 'POOR';
  else if (score < 75) status = 'MEDIUM';

  const details = `Lexical overlap: ${(lexicalOverlapRatio * 100).toFixed(1)}% (${matchedTokens}/${generatedTokens.length} tokens). Entity grounding: ${(entityGroundingRatio * 100).toFixed(1)}%.`;

  return {
    score: Math.min(100, Math.max(0, score)),
    lexicalOverlapRatio,
    entityGroundingRatio,
    unsupportedTokensCount,
    status,
    details
  };
}
