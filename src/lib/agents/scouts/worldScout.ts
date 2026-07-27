import { NewsStory } from '../../news/types';
import { WORLD_SIGNALS } from '../shared/keywords';
import { calculateSelectionScore, detectSignals } from '../shared/scoring';
import { ScoutAgent, ScoutConfigOptions, ScoutResult, ScoutStoryResult } from '../types';

export const worldScout: ScoutAgent = {
  id: 'world-scout',
  name: 'World News Scout',
  category: 'world',
  description: 'Identifies government policy, elections, international diplomacy, macroeconomic shifts, natural incidents, and global infrastructure.',

  async execute(stories: NewsStory[], config?: ScoutConfigOptions): Promise<ScoutResult> {
    const startedAt = new Date().toISOString();
    const startTime = Date.now();
    const minThreshold = config?.minCandidateScore ?? 40;

    const results: ScoutStoryResult[] = [];

    for (const story of stories) {
      const combinedText = `${story.headline} ${story.summary}`;
      const matchedSignals = detectSignals(combinedText, WORLD_SIGNALS);

      // Evaluate if category matches or signals detected
      if (story.category === 'world' || matchedSignals.length > 0) {
        const { score, breakdown, reason } = calculateSelectionScore(story, 'world', matchedSignals);

        if (score >= minThreshold) {
          results.push({
            story,
            scoutId: 'world-scout',
            scoutName: 'World News Scout',
            matchedCategory: 'world',
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
      agentId: 'world-scout',
      agentName: 'World News Scout',
      category: 'world',
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
