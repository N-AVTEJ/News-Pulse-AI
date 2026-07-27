'use client';

import React from 'react';
import { X, HelpCircle, CheckCircle, Info } from 'lucide-react';
import { MergedIntelligenceStory } from '@/lib/agents/types';

interface ScoreBreakdownModalProps {
  item: MergedIntelligenceStory | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ScoreBreakdownModal({ item, isOpen, onClose }: ScoreBreakdownModalProps) {
  if (!isOpen || !item) return null;

  const b = item.scoreBreakdown;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div 
        className="relative w-full max-w-lg rounded-xl border border-zinc-800 bg-zinc-950 p-6 shadow-2xl space-y-5 font-mono"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-start justify-between border-b border-zinc-900 pb-4">
          <div>
            <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-wider">
              <HelpCircle className="w-4 h-4" />
              <span>Scout Selection Score Breakdown</span>
            </div>
            <h3 className="mt-1 text-sm font-semibold text-zinc-100 line-clamp-1">
              {item.story.headline}
            </h3>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded hover:bg-zinc-900 text-zinc-400 hover:text-zinc-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Explainable Disclaimer */}
        <div className="p-3 rounded bg-zinc-900/40 border border-zinc-850 text-[11px] text-zinc-400 flex items-start gap-2 leading-relaxed">
          <Info className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
          <span>
            <strong className="text-zinc-200">Determinism Notice:</strong> This score represents candidate selection relevance (0-100). It is NOT an AI confidence score or truth metric.
          </span>
        </div>

        {/* Breakdown Items */}
        <div className="space-y-2.5 text-xs">
          <div className="flex items-center justify-between p-2.5 rounded bg-zinc-900/20 border border-zinc-900">
            <span className="text-zinc-300">Category Domain Alignment ({item.story.category})</span>
            <span className="font-bold text-emerald-400">+{b.categoryAlignment} pts</span>
          </div>

          <div className="flex items-center justify-between p-2.5 rounded bg-zinc-900/20 border border-zinc-900">
            <span className="text-zinc-300">Primary Signal Match</span>
            <span className="font-bold text-emerald-400">+{b.primarySignal} pts</span>
          </div>

          <div className="flex items-center justify-between p-2.5 rounded bg-zinc-900/20 border border-zinc-900">
            <span className="text-zinc-300">Secondary Matched Signals</span>
            <span className="font-bold text-emerald-400">+{b.secondarySignals} pts</span>
          </div>

          <div className="flex items-center justify-between p-2.5 rounded bg-zinc-900/20 border border-zinc-900">
            <span className="text-zinc-300">Corroborating Outlets ({item.story.corroboratingSources?.length || 1})</span>
            <span className="font-bold text-emerald-400">+{b.corroboration} pts</span>
          </div>

          <div className="flex items-center justify-between p-2.5 rounded bg-zinc-900/20 border border-zinc-900">
            <span className="text-zinc-300">Publication Recency (&lt;24h)</span>
            <span className="font-bold text-emerald-400">+{b.recency} pts</span>
          </div>
        </div>

        {/* Total Score Footer */}
        <div className="pt-4 border-t border-zinc-900 flex items-center justify-between">
          <span className="text-xs text-zinc-400 font-bold uppercase">Total Selection Score</span>
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold font-mono text-indigo-400">{b.total} / 100</span>
          </div>
        </div>

        {/* Reason summary */}
        <div className="text-[11px] text-zinc-500 bg-zinc-900/30 p-2.5 rounded border border-zinc-900 italic">
          "{item.selectionReason}"
        </div>
      </div>
    </div>
  );
}
