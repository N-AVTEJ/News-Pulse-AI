'use client';

import React from 'react';
import { ExternalLink, HelpCircle, Globe, Shield, Clock } from 'lucide-react';
import { MergedIntelligenceStory } from '@/lib/agents/types';
import { NewsStory } from '@/lib/news/types';

interface ScoutIntelligenceCardProps {
  item: MergedIntelligenceStory;
  onViewBreakdown: (item: MergedIntelligenceStory) => void;
  onSelectStory: (story: NewsStory) => void;
}

export default function ScoutIntelligenceCard({ item, onViewBreakdown, onSelectStory }: ScoutIntelligenceCardProps) {
  const { story } = item;
  const isMultiScout = item.matchedScouts.length > 1;

  const formattedTime = (() => {
    try {
      const date = new Date(story.publishedAt);
      if (isNaN(date.getTime())) return story.publishedAt;
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' · ' + date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    } catch {
      return story.publishedAt;
    }
  })();

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
    if (score >= 65) return 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20';
    return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
  };

  return (
    <div 
      onClick={() => onSelectStory(story)}
      className="group relative cursor-pointer overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900/30 p-5 transition-all duration-300 hover:border-zinc-700 hover:bg-zinc-900/60"
    >
      {/* Header Row */}
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div className="flex flex-wrap items-center gap-2">
          {/* Scout Category Tag */}
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider bg-zinc-900 border border-zinc-800 text-indigo-400">
            {item.primaryScoutName}
          </span>

          {/* Cross-Scout Multi Detection Badge */}
          {isMultiScout && (
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 flex items-center gap-1">
              <Shield className="w-3 h-3 text-indigo-400" />
              Detected by {item.matchedScouts.length} Scouts
            </span>
          )}

          <span className="text-[11px] font-mono text-zinc-500 flex items-center gap-1">
            <Clock className="w-3 h-3 text-zinc-600" />
            {formattedTime}
          </span>
        </div>

        {/* Score Pill */}
        <div className="flex items-center gap-2">
          <div className={`px-2.5 py-0.5 rounded text-[10px] font-mono font-bold border flex items-center gap-1 ${getScoreColor(item.topScore)}`}>
            <span>Selection Score:</span>
            <span className="text-xs">{item.topScore}</span>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onViewBreakdown(item);
            }}
            className="p-1 rounded hover:bg-zinc-800 text-zinc-500 hover:text-zinc-200 transition-colors"
            title="View Score Breakdown"
          >
            <HelpCircle className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Headline */}
      <h3 className="mt-3 text-sm font-semibold tracking-tight text-zinc-100 group-hover:text-indigo-300 transition-colors line-clamp-2">
        {story.headline}
      </h3>

      {/* Summary */}
      {story.summary && (
        <p className="mt-2 text-xs leading-relaxed text-zinc-400 line-clamp-2">
          {story.summary}
        </p>
      )}

      {/* Matched Signals Tags */}
      {item.matchedSignals.length > 0 && (
        <div className="mt-3 flex flex-wrap items-center gap-1.5 pt-2 border-t border-zinc-900/60">
          <span className="text-[9px] font-mono text-zinc-500 uppercase">Signals:</span>
          {item.matchedSignals.map((sig) => (
            <span key={sig} className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-zinc-900 border border-zinc-800 text-zinc-300">
              {sig}
            </span>
          ))}
        </div>
      )}

      {/* Footer Attribution */}
      <div className="mt-4 pt-3 border-t border-zinc-800/60 flex items-center justify-between text-xs font-mono text-zinc-400">
        <div className="flex items-center gap-1.5">
          <Globe className="w-3.5 h-3.5 text-zinc-500" />
          <span>{story.sourceName}</span>
        </div>

        <a
          href={story.articleUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="flex items-center gap-1 text-[11px] text-indigo-400 hover:underline"
        >
          <span>Publisher Article</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </div>
  );
}
