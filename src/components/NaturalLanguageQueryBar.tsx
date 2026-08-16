'use client';

import React, { useState } from 'react';
import { Search, Sparkles, X, Filter } from 'lucide-react';
import { NaturalLanguageQueryResult } from '@/lib/knowledge/types';

interface NaturalLanguageQueryBarProps {
  onExecuteQuery: (query: string) => Promise<NaturalLanguageQueryResult | null>;
  onClearQuery: () => void;
  activeQueryResult: NaturalLanguageQueryResult | null;
}

export default function NaturalLanguageQueryBar({
  onExecuteQuery,
  onClearQuery,
  activeQueryResult
}: NaturalLanguageQueryBarProps) {
  const [query, setQuery] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const sampleQueries = [
    'Show all verified OpenAI events',
    'Find reports mentioning NVIDIA',
    'Display all AI product launches this month',
    'Show breaking geopolitical events'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await onExecuteQuery(query);
    } catch (err) {
      console.error('[NaturalLanguageQueryBar] Query failed:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSelectSample = (sample: string) => {
    setQuery(sample);
    onExecuteQuery(sample);
  };

  const handleClear = () => {
    setQuery('');
    onClearQuery();
  };

  return (
    <div className="p-4 rounded-xl border border-indigo-500/20 bg-gradient-to-r from-indigo-950/30 via-zinc-950 to-zinc-950 space-y-3 font-mono">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-bold text-indigo-300 uppercase tracking-wider flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-indigo-400" />
          Natural Language Intelligence Search
        </h3>

        {activeQueryResult && (
          <button
            onClick={handleClear}
            className="text-[10px] text-zinc-400 hover:text-zinc-200 font-bold flex items-center gap-1"
          >
            <X className="w-3 h-3" />
            Reset Query
          </button>
        )}
      </div>

      {/* Input Bar */}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder='Ask e.g. "Show all verified OpenAI events" or "Find reports mentioning NVIDIA"...'
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-100 text-xs focus:outline-none focus:border-indigo-500 font-sans shadow-inner"
          />
          <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-2.5" />
        </div>

        <button
          type="submit"
          disabled={isSubmitting || !query.trim()}
          className="px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-colors flex items-center gap-1.5 shadow-md shadow-indigo-600/20 disabled:opacity-50"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Translate & Query</span>
        </button>
      </form>

      {/* Query Translation Banner */}
      {activeQueryResult ? (
        <div className="p-3 rounded-lg bg-indigo-500/10 border border-indigo-500/20 space-y-1 text-xs font-sans">
          <div className="flex items-center justify-between text-indigo-300 font-mono text-[11px]">
            <span className="font-bold flex items-center gap-1">
              <Filter className="w-3 h-3 text-indigo-400" />
              Query Translation Result
            </span>
            <span className="text-[10px] text-zinc-400 font-mono">
              Matched {activeQueryResult.matchedClusterIds.length} Events
            </span>
          </div>

          <p className="text-zinc-200 text-xs font-mono">{activeQueryResult.explanation}</p>
        </div>
      ) : (
        /* Sample Query Chips */
        <div className="flex items-center gap-1.5 flex-wrap text-[10px]">
          <span className="text-zinc-500 uppercase font-bold">Try Asking:</span>
          {sampleQueries.map((sample) => (
            <button
              key={sample}
              onClick={() => handleSelectSample(sample)}
              className="px-2.5 py-1 rounded bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 text-zinc-300 transition-colors font-mono"
            >
              &quot;{sample}&quot;
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
