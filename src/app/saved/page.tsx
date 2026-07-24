'use client';

import React from 'react';
import { Bookmark } from 'lucide-react';
import { usePulse } from '@/context/PulseContext';
import StoryCard from '@/components/StoryCard';
import { Story } from '@/data/mockData';

export default function SavedPage() {
  const { stories, savedStories, toggleSave, setSelectedStory, setIsDetailOpen, searchQuery } = usePulse();

  const filtered = stories.filter(story => {
    const isSaved = savedStories.includes(story.id);
    const matchesSearch = searchQuery === '' || 
      story.headline.toLowerCase().includes(searchQuery.toLowerCase()) ||
      story.summary.toLowerCase().includes(searchQuery.toLowerCase());
    return isSaved && matchesSearch;
  });

  const handleSelectStory = (story: Story) => {
    setSelectedStory(story);
    setIsDetailOpen(true);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-zinc-900 pb-4 gap-2">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-emerald-400 font-mono flex items-center gap-2">
            <Bookmark className="w-5 h-5" />
            BOOKMARKED INTEL DOSSIERS
          </h1>
          <p className="text-xs text-zinc-500 font-mono font-semibold">USER SAVED ENTRIES // SECURE STORAGE LOCAL</p>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center border border-dashed border-zinc-800 rounded-lg py-20 px-4 bg-zinc-900/5 text-center">
          <div className="w-10 h-10 rounded bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-600 mb-3">
            <Bookmark className="w-5 h-5 opacity-40" />
          </div>
          <h3 className="text-sm font-semibold text-zinc-400 font-mono">No Bookmarks Saved</h3>
          <p className="text-xs text-zinc-500 mt-1 max-w-xs">
            Go back to the Overview and click the bookmark icon on any story card to save it here.
          </p>
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
