import { NewsStory } from '../../news/types';
import { EventCluster } from '../../clustering/types';
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

    return {
      agentId: 'business-scout',
      agentName: 'Business Scout',
      category: 'business',
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
      const matchedSignals = detectSignals(clusterText, BUSINESS_SIGNALS);

      const anchorStory = cluster.stories[0];
      if (cluster.primaryCategory === 'business' || matchedSignals.length > 0) {
        const { score, breakdown, reason } = calculateSelectionScore(anchorStory, 'business', matchedSignals);

        if (score >= minThreshold) {
          results.push({
            story: anchorStory,
            clusterId: cluster.clusterId,
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

    return {
      agentId: 'business-scout',
      agentName: 'Business Scout',
      category: 'business',
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
