import { NewsStory } from '../news/types';

export interface IncrementalFetchResult {
  allStories: NewsStory[];
  newStories: NewsStory[];
  updatedStories: NewsStory[];
  unchangedStories: NewsStory[];
  hasNewContent: boolean;
}

let lastSnapshotIds = new Set<string>();

/**
 * Compares freshly ingested stories against previous snapshot to identify incremental changes.
 */
export function detectIncrementalNews(
  currentStories: NewsStory[],
  previousIds?: Set<string>
): IncrementalFetchResult {
  const snapshot = previousIds || lastSnapshotIds;
  const newStories: NewsStory[] = [];
  const unchangedStories: NewsStory[] = [];

  for (const story of currentStories) {
    if (snapshot.size === 0 || !snapshot.has(story.id)) {
      newStories.push(story);
    } else {
      unchangedStories.push(story);
    }
  }

  // Update snapshot for next run
  lastSnapshotIds = new Set(currentStories.map(s => s.id));

  return {
    allStories: currentStories,
    newStories,
    updatedStories: [],
    unchangedStories,
    hasNewContent: newStories.length > 0 || snapshot.size === 0
  };
}

export function resetSnapshotCache(): void {
  lastSnapshotIds.clear();
}
