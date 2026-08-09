'use client';

import React, { useState } from 'react';
import { X, FileText, Calendar, ShieldCheck, Zap, Layers, Sparkles } from 'lucide-react';
import { DailyBriefing, WeeklyReport } from '@/lib/personalization/types';

interface BriefingModalProps {
  isOpen: boolean;
  onClose: () => void;
  dailyBriefing?: DailyBriefing | null;
  weeklyReport?: WeeklyReport | null;
}

export default function BriefingModal({
  isOpen,
  onClose,
  dailyBriefing,
  weeklyReport
}: BriefingModalProps) {
  const [tab, setTab] = useState<'DAILY' | 'WEEKLY'>('DAILY');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn font-mono">
      <div 
        className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-xl border border-zinc-800 bg-zinc-950 p-6 shadow-2xl space-y-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-900 pb-4">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-400" />
            <div>
              <h2 className="text-base font-bold text-zinc-100 uppercase">Executive Intelligence Briefing</h2>
              <p className="text-xs text-zinc-500">AUTOMATED DAILY MORNING & WEEKLY STRATEGIC ASSESSMENTS</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded hover:bg-zinc-900 text-zinc-400 hover:text-zinc-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 border-b border-zinc-900 pb-3 text-xs">
          <button
            onClick={() => setTab('DAILY')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
              tab === 'DAILY' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20' : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Daily Morning Briefing</span>
          </button>

          <button
            onClick={() => setTab('WEEKLY')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
              tab === 'WEEKLY' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20' : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Weekly Intelligence Summary</span>
          </button>
        </div>

        {/* Content Body */}
        {tab === 'DAILY' ? (
          dailyBriefing ? (
            <div className="space-y-5 text-xs font-sans">
              <div className="p-4 rounded-lg bg-zinc-900/40 border border-zinc-850 font-mono space-y-2">
                <span className="text-[10px] text-zinc-500 uppercase block">{dailyBriefing.date}</span>
                <h3 className="text-sm font-bold text-zinc-100">{dailyBriefing.title}</h3>
                <p className="text-xs text-zinc-300 font-sans leading-relaxed">{dailyBriefing.executiveSummary}</p>
              </div>

              {/* Top Verified Events */}
              <div className="space-y-2 font-mono">
                <h4 className="text-xs font-bold uppercase text-emerald-400 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4" />
                  Top Verified Events ({dailyBriefing.topVerifiedEvents.length})
                </h4>
                <ul className="space-y-1.5 pl-2 text-xs font-sans text-zinc-300 border-l border-emerald-500/30">
                  {dailyBriefing.topVerifiedEvents.map((evt, idx) => (
                    <li key={idx} className="leading-snug">{evt}</li>
                  ))}
                </ul>
              </div>

              {/* Watchlist Updates */}
              <div className="space-y-2 font-mono">
                <h4 className="text-xs font-bold uppercase text-indigo-400 flex items-center gap-1.5">
                  <Layers className="w-4 h-4" />
                  Watchlist Updates ({dailyBriefing.watchlistUpdates.length})
                </h4>
                <ul className="space-y-1.5 pl-2 text-xs font-sans text-zinc-300 border-l border-indigo-500/30">
                  {dailyBriefing.watchlistUpdates.map((evt, idx) => (
                    <li key={idx} className="leading-snug">{evt}</li>
                  ))}
                </ul>
              </div>

              {/* AI Summaries */}
              {dailyBriefing.aiSummaries?.length > 0 && (
                <div className="space-y-2 font-mono">
                  <h4 className="text-xs font-bold uppercase text-sky-400 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4" />
                    AI Intelligence Syntheses
                  </h4>
                  <div className="space-y-2">
                    {dailyBriefing.aiSummaries.map((sum, idx) => (
                      <p key={idx} className="p-3 rounded bg-zinc-900/30 border border-zinc-850 text-xs text-zinc-300 font-sans leading-relaxed">
                        {sum}
                      </p>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="p-8 text-center text-zinc-500 text-xs border border-dashed border-zinc-850 rounded-lg">
              No daily briefing generated yet.
            </div>
          )
        ) : (
          weeklyReport ? (
            <div className="space-y-5 text-xs font-sans">
              <div className="p-4 rounded-lg bg-zinc-900/40 border border-zinc-850 font-mono space-y-2">
                <span className="text-[10px] text-zinc-500 uppercase block">{weeklyReport.weekRange}</span>
                <h3 className="text-sm font-bold text-zinc-100">{weeklyReport.title}</h3>
                <p className="text-xs text-zinc-300 font-sans leading-relaxed">{weeklyReport.executiveSummary}</p>
              </div>

              {/* Major Events */}
              <div className="space-y-2 font-mono">
                <h4 className="text-xs font-bold uppercase text-indigo-400">Major Weekly Intelligence Events</h4>
                <ul className="space-y-1.5 pl-2 text-xs font-sans text-zinc-300 border-l border-indigo-500/30">
                  {weeklyReport.majorEvents.map((evt, idx) => (
                    <li key={idx} className="leading-snug">{evt}</li>
                  ))}
                </ul>
              </div>

              {/* Sector Summaries */}
              <div className="space-y-2 font-mono">
                <h4 className="text-xs font-bold uppercase text-zinc-300">Sector Summaries</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-sans">
                  {Object.entries(weeklyReport.sectorSummaries).map(([sec, desc]) => (
                    <div key={sec} className="p-3 rounded bg-zinc-900/30 border border-zinc-850 space-y-1">
                      <strong className="text-xs font-bold text-zinc-200 font-mono">{sec}</strong>
                      <p className="text-[11px] text-zinc-400 leading-relaxed">{desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-zinc-500 text-xs border border-dashed border-zinc-850 rounded-lg">
              No weekly report generated yet.
            </div>
          )
        )}

        {/* Footer Close */}
        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-xs text-zinc-300 font-bold border border-zinc-800 transition-colors"
          >
            Close Executive Briefing
          </button>
        </div>
      </div>
    </div>
  );
}
