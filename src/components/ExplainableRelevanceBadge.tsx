'use client';

import React, { useState } from 'react';
import { HelpCircle, Sparkles, CheckCircle2 } from 'lucide-react';

interface ExplainableRelevanceBadgeProps {
  score?: number;
  reasons?: string[];
}

export default function ExplainableRelevanceBadge({
  score = 50,
  reasons = ['Matched category preferences']
}: ExplainableRelevanceBadgeProps) {
  const [showTooltip, setShowTooltip] = useState(false);

  const getScoreColor = (s: number) => {
    if (s >= 75) return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
    if (s >= 50) return 'bg-indigo-500/10 text-indigo-300 border-indigo-500/20';
    return 'bg-zinc-800/40 text-zinc-400 border-zinc-700/30';
  };

  const badgeClass = getScoreColor(score);

  return (
    <div className="relative inline-block font-mono">
      <button
        type="button"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        onClick={(e) => {
          e.stopPropagation();
          setShowTooltip(!showTooltip);
        }}
        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border flex items-center gap-1 transition-all ${badgeClass}`}
      >
        <Sparkles className="w-3 h-3 text-indigo-400" />
        <span>{score}% Relevance</span>
        <HelpCircle className="w-3 h-3 text-zinc-500 hover:text-zinc-300" />
      </button>

      {/* "Why Am I Seeing This?" Tooltip Panel */}
      {showTooltip && (
        <div 
          onClick={(e) => e.stopPropagation()}
          className="absolute z-40 top-full left-0 mt-1.5 w-64 p-3 rounded-lg border border-zinc-800 bg-zinc-950 text-xs shadow-2xl space-y-2 animate-fadeIn"
        >
          <div className="flex items-center justify-between border-b border-zinc-900 pb-1.5">
            <span className="font-bold text-zinc-200 uppercase text-[10px] flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-indigo-400" />
              Why am I seeing this?
            </span>
            <span className="text-[9px] text-zinc-500">EXPLAINABLE RANKING</span>
          </div>

          <ul className="space-y-1 text-[11px] text-zinc-300 font-sans">
            {reasons.map((reason, idx) => (
              <li key={idx} className="flex items-start gap-1.5 leading-snug">
                <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0 mt-0.5" />
                <span>{reason}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
