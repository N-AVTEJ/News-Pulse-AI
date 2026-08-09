'use client';

import React from 'react';
import { FileText, Eye, Sparkles, ChevronRight, CheckCircle2 } from 'lucide-react';
import { DailyBriefing, RecommendationItem, Watchlist } from '@/lib/personalization/types';

interface PersonalDashboardWidgetsProps {
  dailyBriefing?: DailyBriefing | null;
  watchlists: Watchlist[];
  recommendations: RecommendationItem[];
  onOpenBriefing: () => void;
  onOpenWatchlists: () => void;
  onSelectRecommendation: (rec: RecommendationItem) => void;
}

export default function PersonalDashboardWidgets({
  dailyBriefing,
  watchlists,
  recommendations,
  onOpenBriefing,
  onOpenWatchlists,
  onSelectRecommendation
}: PersonalDashboardWidgetsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
      
      {/* Widget 1: Today's Morning Briefing */}
      <div 
        onClick={onOpenBriefing}
        className="p-4 rounded-lg border border-zinc-800 bg-zinc-900/30 hover:border-zinc-700 hover:bg-zinc-900/50 transition-all cursor-pointer space-y-2 group"
      >
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold uppercase text-indigo-400 flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5" />
            Today&apos;s Briefing
          </span>
          <ChevronRight className="w-3.5 h-3.5 text-zinc-500 group-hover:translate-x-0.5 transition-transform" />
        </div>

        <h4 className="text-xs font-bold text-zinc-100 line-clamp-1 font-sans">
          {dailyBriefing?.title || 'Morning Intelligence Briefing'}
        </h4>

        <p className="text-[11px] text-zinc-400 font-sans line-clamp-2 leading-relaxed">
          {dailyBriefing?.executiveSummary || 'Synthesizing top verified events and watchlist updates.'}
        </p>

        <span className="text-[10px] text-indigo-400 font-bold underline inline-block pt-1">
          Open Executive Report →
        </span>
      </div>

      {/* Widget 2: Active Watchlists Overview */}
      <div 
        onClick={onOpenWatchlists}
        className="p-4 rounded-lg border border-zinc-800 bg-zinc-900/30 hover:border-zinc-700 hover:bg-zinc-900/50 transition-all cursor-pointer space-y-2 group"
      >
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold uppercase text-emerald-400 flex items-center gap-1.5">
            <Eye className="w-3.5 h-3.5" />
            Active Watchlists ({watchlists.length})
          </span>
          <ChevronRight className="w-3.5 h-3.5 text-zinc-500 group-hover:translate-x-0.5 transition-transform" />
        </div>

        <div className="space-y-1 pt-1">
          {watchlists.slice(0, 2).map((wl) => (
            <div key={wl.id} className="flex items-center justify-between text-[11px] text-zinc-300 font-sans">
              <span className="font-bold flex items-center gap-1 truncate">
                <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                {wl.name}
              </span>
              <span className="text-[9px] font-mono text-zinc-500 uppercase">{wl.rules.priority}</span>
            </div>
          ))}
        </div>

        <span className="text-[10px] text-emerald-400 font-bold underline inline-block pt-1">
          Manage Custom Rules →
        </span>
      </div>

      {/* Widget 3: Explainable Recommendations */}
      <div className="p-4 rounded-lg border border-zinc-800 bg-zinc-900/30 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold uppercase text-sky-400 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            Recommended Intelligence
          </span>
        </div>

        {recommendations.length > 0 ? (
          <div className="space-y-1.5 pt-0.5">
            {recommendations.slice(0, 2).map((rec) => (
              <div 
                key={rec.id}
                onClick={() => onSelectRecommendation(rec)}
                className="p-1.5 rounded hover:bg-zinc-900 cursor-pointer transition-colors space-y-0.5"
              >
                <h5 className="text-[11px] font-bold text-zinc-200 line-clamp-1 font-sans">
                  {rec.title}
                </h5>
                <p className="text-[10px] text-zinc-400 font-sans line-clamp-1">
                  {rec.explanation}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-[10px] text-zinc-500 font-sans pt-2">
            No recommendations generated yet.
          </p>
        )}
      </div>

    </div>
  );
}
