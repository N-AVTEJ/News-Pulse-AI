import { NewsStory } from '../../news/types';
import { TECH_SIGNALS } from '../shared/keywords';
import { calculateSelectionScore, detectSignals } from '../shared/scoring';
import { ScoutAgent, ScoutConfigOptions, ScoutResult, ScoutStoryResult } from '../types';

export const techScout: ScoutAgent = {
  id: 'tech-scout',
  name: 'AI & Tech Scout',
  category: 'ai-tech',
  description: 'Identifies candidate intelligence in AI, semiconductors, software engineering, cybersecurity, and compute infrastructure.',

  async execute(stories: NewsStory[], config?: ScoutConfigOptions): Promise<ScoutResult> {
    const startedAt = new Date().toISOString();
    const startTime = Date.now();
    const minThreshold = config?.minCandidateScore ?? 40;

    const results: ScoutStoryResult[] = [];

    for (const story of stories) {
      const combinedText = `${story.headline} ${story.summary}`;
      const matchedSignals = detectSignals(combinedText, TECH_SIGNALS);

      // Only evaluate further if category matches or signals were detected
      if (story.category === 'ai-tech' || matchedSignals.length > 0) {
        const { score, breakdown, reason } = calculateSelectionScore(story, 'ai-tech', matchedSignals);

        if (score >= minThreshold) {
          results.push({
            story,
            scoutId: 'tech-scout',
            scoutName: 'AI & Tech Scout',
            matchedCategory: 'ai-tech',
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
      agentId: 'tech-scout',
      agentName: 'AI & Tech Scout',
      category: 'ai-tech',
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
