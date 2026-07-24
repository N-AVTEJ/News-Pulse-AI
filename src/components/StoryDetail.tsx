'use client';

import React from 'react';
import { X, Bookmark, BookmarkCheck, Calendar, Globe, ExternalLink, ShieldCheck, Layers, ArrowUpRight } from 'lucide-react';
import { NewsStory } from '@/lib/news/types';
import ConfidenceBadge from './ConfidenceBadge';
import ImportanceScore from './ImportanceScore';

interface StoryDetailProps {
  story: NewsStory | null;
  isOpen: boolean;
  onClose: () => void;
  isSaved: boolean;
  onToggleSave: (storyId: string) => void;
  allStories: NewsStory[];
  onSelectStory: (story: NewsStory) => void;
}

export default function StoryDetail({ story, isOpen, onClose, isSaved, onToggleSave, allStories, onSelectStory }: StoryDetailProps) {
  if (!isOpen || !story) return null;

  // Resolve related stories by category
  const related = allStories.filter(s => s.id !== story.id && s.category === story.category).slice(0, 3);

  const formattedDate = (() => {
    try {
      const d = new Date(story.publishedAt);
      if (isNaN(d.getTime())) return story.publishedAt;
      return d.toLocaleString([], { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    } catch {
      return story.publishedAt;
    }
  })();

  return (
    <div className="fixed inset-y-0 right-0 z-50 flex w-full max-w-2xl bg-zinc-950/95 backdrop-blur-lg border-l border-zinc-800 shadow-2xl transition-all duration-300 transform translate-x-0">
      <div className="flex flex-col flex-1 h-full overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
        {/* Header toolbar */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-zinc-800 bg-zinc-950/90 px-6 py-4 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <button 
              onClick={onClose}
              className="p-1.5 rounded-md hover:bg-zinc-900 text-zinc-400 hover:text-zinc-100 transition-colors border border-zinc-800/80"
              title="Close panel"
            >
              <X className="w-4 h-4" />
            </button>
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Intelligence Dossier // {story.id}</span>
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={() => onToggleSave(story.id)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs font-mono text-zinc-300 hover:text-zinc-100 transition-colors"
            >
              {isSaved ? (
                <>
                  <BookmarkCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400 font-semibold">SAVED</span>
                </>
              ) : (
                <>
                  <Bookmark className="w-3.5 h-3.5" />
                  <span>SAVE INTEL</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 p-6 space-y-6">
          {/* Metadata Flags */}
          <div className="flex flex-wrap items-center gap-3 border-b border-zinc-900/60 pb-5">
            <span className="px-2.5 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-[10px] font-mono font-semibold uppercase text-zinc-300">
              {story.category === 'ai-tech' ? 'AI & TECH' : story.category}
            </span>
            <div className="flex items-center gap-1.5 text-xs text-zinc-500 font-mono">
              <Calendar className="w-3.5 h-3.5" />
              <span>{formattedDate}</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-zinc-400 font-mono">
              <Globe className="w-3.5 h-3.5 text-zinc-500" />
              <span className="font-semibold">{story.sourceName}</span>
            </div>
          </div>

          {/* Headline */}
          <div>
            <h1 className="text-xl font-bold tracking-tight text-zinc-100 leading-tight">
              {story.headline}
            </h1>
          </div>

          {/* Primary Action: Read Original Article Link */}
          <div className="p-4 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="text-xs font-mono text-indigo-300">
              <span className="font-bold block">VERIFIED REAL NEWS SOURCE</span>
              <span className="text-[11px] text-zinc-400 block">Published by {story.sourceName}</span>
            </div>
            <a
              href={story.articleUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded bg-indigo-500 hover:bg-indigo-600 text-xs font-mono text-white font-bold transition-colors shadow-lg shadow-indigo-500/20 shrink-0"
            >
              <span>READ ON PUBLISHER SITE</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Assessment metrics */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 bg-zinc-900/20 p-4 rounded-lg border border-zinc-900/60">
            <div>
              <span className="text-[10px] font-mono text-zinc-500 uppercase block">Publisher</span>
              <span className="text-xs font-mono text-zinc-200 font-semibold block mt-1">{story.sourceName}</span>
            </div>
            <div>
              <span className="text-[10px] font-mono text-zinc-500 uppercase block">Reporting Outlets</span>
              <span className="text-xs font-mono text-zinc-300 font-semibold block mt-1">
                {story.corroboratingSources?.length || 1} Source(s)
              </span>
            </div>
            <div>
              <span className="text-[10px] font-mono text-zinc-500 uppercase block">Intelligence Phase</span>
              <span className="text-xs font-mono text-indigo-400 font-semibold block mt-1 uppercase">PHASE 2 INGESTION</span>
            </div>
          </div>

          {/* Summary */}
          {story.summary && (
            <div className="space-y-2">
              <h3 className="text-xs font-mono uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
                <span>Story Overview</span>
              </h3>
              <p className="text-xs leading-relaxed text-zinc-300 font-sans p-4 bg-zinc-900/30 rounded border border-zinc-900">
                {story.summary}
              </p>
            </div>
          )}

          {/* Corroborating outlets list */}
          {story.corroboratingSources && story.corroboratingSources.length > 0 && (
            <div className="space-y-2 border-t border-zinc-900/60 pt-4">
              <h3 className="text-xs font-mono uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-zinc-500" />
                <span>Corroborating News Outlets</span>
              </h3>
              <div className="flex flex-wrap gap-2">
                {story.corroboratingSources.map((name, idx) => (
                  <span key={idx} className="px-2.5 py-1 rounded bg-zinc-900 border border-zinc-800 font-mono text-xs text-zinc-300">
                    {name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Related Stories */}
          {related.length > 0 && (
            <div className="space-y-3 border-t border-zinc-900/60 pt-4">
              <h3 className="text-xs font-mono uppercase tracking-wider text-zinc-400">Related Real Stories</h3>
              <div className="space-y-2">
                {related.map((relStory) => (
                  <div 
                    key={relStory.id}
                    onClick={() => onSelectStory(relStory)}
                    className="flex items-center justify-between p-3 rounded bg-zinc-900/20 hover:bg-zinc-900/60 border border-zinc-900 hover:border-zinc-800 cursor-pointer transition-colors"
                  >
                    <span className="text-xs text-zinc-300 font-medium hover:text-indigo-400 line-clamp-1 flex-1 pr-4">
                      {relStory.headline}
                    </span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
