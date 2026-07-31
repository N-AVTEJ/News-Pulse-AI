'use client';

import React from 'react';
import { Clock, ExternalLink, Globe } from 'lucide-react';
import { NewsStory } from '@/lib/news/types';

interface EventTimelineProps {
  stories: NewsStory[];
}

export default function EventTimelineComponent({ stories }: EventTimelineProps) {
  if (!stories || stories.length === 0) return null;

  // Chronologically sorted (earliest first)
  const sorted = [...stories].sort((a, b) => {
    const timeA = new Date(a.publishedAt).getTime();
    const timeB = new Date(b.publishedAt).getTime();
    return (isNaN(timeA) ? 0 : timeA) - (isNaN(timeB) ? 0 : timeB);
  });

  const formatTime = (isoStr: string) => {
    try {
      const date = new Date(isoStr);
      if (isNaN(date.getTime())) return isoStr;
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' · ' + date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    } catch {
      return isoStr;
    }
  };

  return (
    <div className="space-y-4 font-mono">
      <div className="flex items-center justify-between border-b border-zinc-900 pb-2">
        <span className="text-xs font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-1.5">
          <Clock className="w-4 h-4 text-indigo-400" />
          Event Chronological Timeline ({sorted.length} Reports)
        </span>
        <span className="text-[10px] text-zinc-500">EARLIEST &rarr; LATEST</span>
      </div>

      <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-zinc-800">
        {sorted.map((story, index) => {
          const isFirst = index === 0;
          const isLatest = index === sorted.length - 1;

          return (
            <div key={story.id} className="relative group">
              {/* Timeline node dot */}
              <div className={`absolute -left-6 top-1.5 w-3 h-3 rounded-full border-2 transition-all ${
                isLatest ? 'bg-indigo-500 border-indigo-400 shadow-md shadow-indigo-500/30 animate-pulse' :
                isFirst ? 'bg-emerald-500 border-emerald-400' :
                'bg-zinc-900 border-zinc-700 group-hover:border-zinc-500'
              }`}></div>

              <div className="p-3 rounded-lg border border-zinc-850 bg-zinc-900/30 group-hover:border-zinc-750 transition-colors space-y-1.5">
                <div className="flex items-center justify-between gap-2 flex-wrap text-[11px]">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-zinc-200 flex items-center gap-1">
                      <Globe className="w-3 h-3 text-zinc-500" />
                      {story.sourceName}
                    </span>

                    {isFirst && (
                      <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        FIRST REPORT
                      </span>
                    )}

                    {isLatest && sorted.length > 1 && (
                      <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                        LATEST UPDATE
                      </span>
                    )}
                  </div>

                  <span className="text-zinc-500 text-[10px]">
                    {formatTime(story.publishedAt)}
                  </span>
                </div>

                <a 
                  href={story.articleUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-semibold text-zinc-300 hover:text-indigo-400 transition-colors line-clamp-2 flex items-center gap-1"
                >
                  <span>{story.headline}</span>
                  <ExternalLink className="w-3 h-3 text-zinc-500 shrink-0 inline" />
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
