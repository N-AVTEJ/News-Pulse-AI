'use client';

import React from 'react';
import { AlertOctagon, Flame } from 'lucide-react';
import { usePulse } from '@/context/PulseContext';
import StoryCard from '@/components/StoryCard';
import { NewsStory } from '@/lib/news/types';

export default function BreakingPage() {
  const { stories, savedStories, toggleSave, setSelectedStory, setIsDetailOpen, searchQuery } = usePulse();

  // Filter breaking stories (stories reported by multiple sources or high importance)
  const breakingStories = stories.filter(story => {
    const isBreaking = (story.corroboratingSources && story.corroboratingSources.length > 1) || (story.importanceScore && story.importanceScore >= 90);
    const matchesSearch = searchQuery === '' || 
      story.headline.toLowerCase().includes(searchQuery.toLowerCase()) ||
      story.summary.toLowerCase().includes(searchQuery.toLowerCase());
    return isBreaking && matchesSearch;
  });

  const handleSelectStory = (story: NewsStory) => {
    setSelectedStory(story);
    setIsDetailOpen(true);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-zinc-900 pb-4 gap-2">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-rose-500 font-mono flex items-center gap-2">
            <Flame className="w-5 h-5 animate-pulse" />
            BREAKING INTELLIGENCE
          </h1>
          <p className="text-xs text-zinc-500 font-mono">NODE STATUS: ACTIVE // HIGH IMPORTANCE TARGETS LISTED</p>
        </div>
      </div>

      {/* Warning Alert Banner */}
      <div className="flex items-start gap-3 p-4 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400">
        <AlertOctagon className="w-5 h-5 shrink-0 mt-0.5" />
        <div className="text-xs font-mono">
          <span className="font-bold">CRITICAL VECTOR WARNING</span>: The entries below represent events scoring above 90 on the systemic vulnerability scale. Active investigation recommended. All records are simulation/demo values.
        </div>
      </div>

      {/* Story cards list */}
      {breakingStories.length === 0 ? (
        <div className="flex flex-col items-center justify-center border border-dashed border-zinc-800 rounded-lg py-20 px-4 bg-zinc-900/5 text-center">
          <div className="w-10 h-10 rounded bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-600 mb-3">
            <Flame className="w-5 h-5 opacity-40" />
          </div>
          <h3 className="text-sm font-semibold text-zinc-400 font-mono">No Active Breaking Signals</h3>
          <p className="text-xs text-zinc-500 mt-1 max-w-sm">
            Check the Overview or trigger a scan to query latest telemetry buffers.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {breakingStories.map((story) => (
            <StoryCard 
              key={story.id} 
              story={story} 
              onSelect={handleSelectStory}
              isSaved={savedStories.includes(story.id)}
              onToggleSave={(e, storyId) => {
                e.stopPropagation();
                toggleSave(storyId);
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
