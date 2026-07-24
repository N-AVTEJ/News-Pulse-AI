'use client';

import React from 'react';
import { AlertCircle, ArrowRight, Radio } from 'lucide-react';
import { Story } from '@/data/mockData';
import ConfidenceBadge from './ConfidenceBadge';

interface BreakingStoryProps {
  story: Story;
  onSelect: (story: Story) => void;
}

export default function BreakingStory({ story, onSelect }: BreakingStoryProps) {
  return (
    <div 
      onClick={() => onSelect(story)}
      className="group relative cursor-pointer overflow-hidden rounded-lg border-2 border-rose-500/40 bg-zinc-950 p-6 transition-all duration-300 hover:border-rose-500/60 hover:shadow-lg hover:shadow-rose-500/10"
    >
      {/* Red ambient background glow */}
      <div className="absolute -left-20 -top-20 w-44 h-44 rounded-full bg-rose-500/10 blur-3xl pointer-events-none"></div>

      {/* Top Header Row */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-rose-500/15 border border-rose-500/30 text-rose-400 font-mono text-[10px] font-bold uppercase tracking-wider animate-pulse">
            <Radio className="w-3.5 h-3.5" />
            <span>Breaking Intelligence</span>
          </div>
          <span className="text-[11px] font-mono text-zinc-500">{story.publishedAt}</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-[11px] font-mono text-zinc-400">
            Sources: <span className="text-zinc-200 font-semibold">{story.corroboratingSources} outlets</span>
          </div>
          <ConfidenceBadge score={story.confidenceScore} />
        </div>
      </div>

      {/* Headline */}
      <h2 className="mt-4 text-base md:text-lg font-bold tracking-tight text-zinc-100 group-hover:text-rose-400 transition-colors">
        {story.headline}
      </h2>

      {/* Structured What & Why columns */}
      <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-zinc-800/80 pt-4">
        <div>
          <div className="flex items-center gap-1 text-[11px] font-mono text-rose-400 uppercase tracking-wider font-semibold">
            <AlertCircle className="w-3 h-3" />
            <span>WHAT HAPPENED</span>
          </div>
          <p className="mt-1.5 text-xs text-zinc-400 leading-relaxed">
            {story.whatHappened}
          </p>
        </div>

        <div>
          <div className="flex items-center gap-1 text-[11px] font-mono text-zinc-400 uppercase tracking-wider font-semibold">
            <AlertCircle className="w-3 h-3 text-zinc-500" />
            <span>WHY IT MATTERS</span>
          </div>
          <p className="mt-1.5 text-xs text-zinc-400 leading-relaxed">
            {story.whyItMatters}
          </p>
        </div>
      </div>

      {/* Footer trigger */}
      <div className="mt-5 flex items-center justify-end text-xs font-mono text-rose-400 group-hover:translate-x-1 transition-transform">
        <span className="flex items-center gap-1 font-semibold">
          OPEN DETAILED IMPACT ASSESSMENT <ArrowRight className="w-3.5 h-3.5" />
        </span>
      </div>
    </div>
  );
}
