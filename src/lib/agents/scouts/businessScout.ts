import { NewsStory } from '../../news/types';
import { BUSINESS_SIGNALS } from '../shared/keywords';
import { calculateSelectionScore, detectSignals } from '../shared/scoring';
import { ScoutAgent, ScoutConfigOptions, ScoutResult, ScoutStoryResult } from '../types';

export const businessScout: ScoutAgent = {
  id: 'business-scout',
  name: 'Business Scout',
  category: 'business',
  description: 'Identifies corporate earnings, mergers & acquisitions, funding, executive changes, market movements, and regulatory policy.',

  async execute(stories: NewsStory[], config?: ScoutConfigOptions): Promise<ScoutResult> {
    const startedAt = new Date().toISOString();
    const startTime = Date.now();
    const minThreshold = config?.minCandidateScore ?? 40;

    const results: ScoutStoryResult[] = [];

    for (const story of stories) {
      const combinedText = `${story.headline} ${story.summary}`;
      const matchedSignals = detectSignals(combinedText, BUSINESS_SIGNALS);

      // Evaluate if category matches or signals detected
      if (story.category === 'business' || matchedSignals.length > 0) {
        const { score, breakdown, reason } = calculateSelectionScore(story, 'business', matchedSignals);

        if (score >= minThreshold) {
          results.push({
            story,
            scoutId: 'business-scout',
            scoutName: 'Business Scout',
            matchedCategory: 'business',
            matchedSignals,
            selectionScore: score,
            selectionReason: reason,
            scoreBreakdown: breakdown
          });
        }
      }
    }

    const durationMs = Date.now() - startTime;
    const completedAt = new Date().toISOString();

    return {
      agentId: 'business-scout',
      agentName: 'Business Scout',
      category: 'business',
      startedAt,
      completedAt,
      durationMs,
      storiesProcessed: stories.length,
      storiesSelected: results.length,
      status: 'COMPLETED',
      results
    };
  }
};
