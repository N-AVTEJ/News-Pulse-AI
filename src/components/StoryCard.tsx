'use client';

import React from 'react';
import { Bookmark, BookmarkCheck, ExternalLink, Layers, CheckCircle2, Clock, Globe } from 'lucide-react';
import { NewsStory } from '@/lib/news/types';
import ConfidenceBadge from './ConfidenceBadge';
import ImportanceScore from './ImportanceScore';

interface StoryCardProps {
  story: NewsStory;
  onSelect: (story: NewsStory) => void;
  isSaved: boolean;
  onToggleSave: (e: React.MouseEvent, storyId: string) => void;
}

export default function StoryCard({ story, onSelect, isSaved, onToggleSave }: StoryCardProps) {
  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'ai-tech':
        return 'text-indigo-400 border-indigo-500/20 bg-indigo-500/5';
      case 'business':
        return 'text-amber-400 border-amber-500/20 bg-amber-500/5';
      case 'world':
        return 'text-sky-400 border-sky-500/20 bg-sky-500/5';
      default:
        return 'text-zinc-400 border-zinc-800 bg-zinc-900/50';
    }
  };

  const formattedTime = (() => {
    try {
      const date = new Date(story.publishedAt);
      if (isNaN(date.getTime())) return story.publishedAt;
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' · ' + date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    } catch {
      return story.publishedAt;
    }
  })();

  const corroboratingCount = story.corroboratingSources?.length || 1;

  return (
    <div 
      onClick={() => onSelect(story)}
      className="group relative cursor-pointer overflow-hidden rounded-lg border border-zinc-800/80 bg-zinc-900/30 p-5 transition-all duration-300 hover:border-zinc-700/80 hover:bg-zinc-900/60 hover:shadow-lg hover:shadow-indigo-500/5"
    >
      <div className="flex items-start justify-between gap-4">
        {/* Category and Publication details */}
        <div className="flex flex-wrap items-center gap-2">
          <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold uppercase border tracking-wider ${getCategoryColor(story.category)}`}>
            {story.category === 'ai-tech' ? 'AI & TECH' : story.category}
          </span>
          <span className="text-[11px] font-mono text-zinc-500 flex items-center gap-1">
            <Clock className="w-3 h-3 text-zinc-600" />
            {formattedTime}
          </span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1">
          <button 
            onClick={(e) => onToggleSave(e, story.id)}
            className="p-1.5 rounded hover:bg-zinc-800 text-zinc-500 hover:text-zinc-200 transition-colors"
            title={isSaved ? "Remove from Saved" : "Save Story"}
          >
            {isSaved ? (
              <BookmarkCheck className="w-4 h-4 text-emerald-400" />
            ) : (
              <Bookmark className="w-4 h-4" />
            )}
          </button>
          
          {/* External Article Link */}
          <a
            href={story.articleUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="p-1.5 rounded hover:bg-zinc-800 text-zinc-500 hover:text-indigo-400 transition-colors flex items-center gap-1"
            title="Read original story on publisher site"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>

      {/* Headline */}
      <h3 className="mt-3 text-sm font-semibold tracking-tight text-zinc-200 group-hover:text-indigo-300 transition-colors line-clamp-2">
        {story.headline}
      </h3>

      {/* Summary */}
      {story.summary && (
        <p className="mt-2 text-xs leading-relaxed text-zinc-400 line-clamp-2">
          {story.summary}
        </p>
      )}

      {/* Metrics Row */}
      <div className="mt-4 pt-3 border-t border-zinc-800/60 flex flex-wrap items-center justify-between gap-3">
        {/* Source attribution */}
        <div className="flex items-center gap-2 text-xs text-zinc-300 font-mono">
          <Globe className="w-3.5 h-3.5 text-zinc-500" />
          <span className="font-medium text-zinc-200">{story.sourceName}</span>
        </div>

        {/* Corroboration and Truth-Based Status */}
        <div className="flex items-center gap-3">
          {/* Corroboration outlets count */}
          <div className="flex items-center gap-1 text-[11px] text-zinc-500 font-mono" title="Outlets reporting story">
            <Layers className="w-3.5 h-3.5 text-zinc-500" />
            <span>{corroboratingCount} {corroboratingCount === 1 ? 'outlet' : 'outlets'}</span>
          </div>

          {/* Verification / Importance Status */}
          {story.importanceScore !== null && story.importanceScore !== undefined ? (
            <ImportanceScore score={story.importanceScore} />
          ) : (
            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-mono border font-medium uppercase text-zinc-400 bg-zinc-950 border-zinc-800">
              <CheckCircle2 className="w-3 h-3 text-indigo-400" />
              <span>LIVE INGESTION</span>
            </div>
          )}

          {/* Confidence Badge or Truth Status */}
          {story.confidenceScore !== null && story.confidenceScore !== undefined ? (
            <ConfidenceBadge score={story.confidenceScore} />
          ) : (
            <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono border text-zinc-500 bg-zinc-900/40 border-zinc-800">
              <span>Verification Pending</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
