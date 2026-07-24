'use client';

import React from 'react';
import { Cpu } from 'lucide-react';
import { usePulse } from '@/context/PulseContext';
import StoryCard from '@/components/StoryCard';
import { NewsStory } from '@/lib/news/types';

export default function AiTechPage() {
  const { stories, savedStories, toggleSave, setSelectedStory, setIsDetailOpen, searchQuery } = usePulse();

  const filtered = stories.filter(story => {
    const isCategory = story.category === 'ai-tech';
    const matchesSearch = searchQuery === '' || 
      story.headline.toLowerCase().includes(searchQuery.toLowerCase()) ||
      story.summary.toLowerCase().includes(searchQuery.toLowerCase());
    return isCategory && matchesSearch;
  });

  const handleSelectStory = (story: NewsStory) => {
    setSelectedStory(story);
    setIsDetailOpen(true);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-zinc-900 pb-4 gap-2">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-indigo-400 font-mono flex items-center gap-2">
            <Cpu className="w-5 h-5" />
            AI & TECHNOLOGY INTEL
          </h1>
          <p className="text-xs text-zinc-500 font-mono">SCOUT: TECH SCOUT // LOGS SYNCED</p>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center border border-dashed border-zinc-800 rounded-lg py-20 px-4 bg-zinc-900/5 text-center">
          <h3 className="text-sm font-semibold text-zinc-400 font-mono">No Matching Tech Signals</h3>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((story) => (
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
