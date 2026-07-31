import { NewsStory } from '../../news/types';
import { EventCluster } from '../../clustering/types';
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

    return {
      agentId: 'tech-scout',
      agentName: 'AI & Tech Scout',
      category: 'ai-tech',
      startedAt,
      completedAt: new Date().toISOString(),
      durationMs: Date.now() - startTime,
      storiesProcessed: stories.length,
      storiesSelected: results.length,
      status: 'COMPLETED',
      results
    };
  },

  async executeClusters(clusters: EventCluster[], config?: ScoutConfigOptions): Promise<ScoutResult> {
    const startedAt = new Date().toISOString();
    const startTime = Date.now();
    const minThreshold = config?.minCandidateScore ?? 40;

    const results: ScoutStoryResult[] = [];

    for (const cluster of clusters) {
      const clusterText = `${cluster.canonicalHeadline} ${cluster.summary} ${cluster.stories.map(s => s.headline).join(' ')}`;
      const matchedSignals = detectSignals(clusterText, TECH_SIGNALS);

      const anchorStory = cluster.stories[0];
      if (cluster.primaryCategory === 'ai-tech' || matchedSignals.length > 0) {
        const { score, breakdown, reason } = calculateSelectionScore(anchorStory, 'ai-tech', matchedSignals);

        if (score >= minThreshold) {
          results.push({
            story: anchorStory,
            clusterId: cluster.clusterId,
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

    return {
      agentId: 'tech-scout',
      agentName: 'AI & Tech Scout',
      category: 'ai-tech',
      startedAt,
      completedAt: new Date().toISOString(),
      durationMs: Date.now() - startTime,
      storiesProcessed: clusters.length,
      storiesSelected: results.length,
      status: 'COMPLETED',
      results
    };
  }
};
