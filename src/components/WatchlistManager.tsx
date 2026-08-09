'use client';

import React, { useState } from 'react';
import { X, Eye, Plus, Trash2, Tag, Layers, CheckCircle2 } from 'lucide-react';
import { Watchlist } from '@/lib/personalization/types';

interface WatchlistManagerProps {
  isOpen: boolean;
  onClose: () => void;
  watchlists: Watchlist[];
  onCreateWatchlist: (watchlistData: Partial<Watchlist>) => Promise<void>;
}

export default function WatchlistManager({
  isOpen,
  onClose,
  watchlists,
  onCreateWatchlist
}: WatchlistManagerProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [keywords, setKeywords] = useState('');
  const [companies, setCompanies] = useState('');
  const [products, setProducts] = useState('');
  const [excludeKeywords, setExcludeKeywords] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSubmitting(true);
    try {
      await onCreateWatchlist({
        name,
        description,
        rules: {
          keywords: keywords.split(',').map(s => s.trim()).filter(Boolean),
          companies: companies.split(',').map(s => s.trim()).filter(Boolean),
          products: products.split(',').map(s => s.trim()).filter(Boolean),
          people: [],
          organizations: [],
          locations: [],
          technologies: [],
          excludeKeywords: excludeKeywords.split(',').map(s => s.trim()).filter(Boolean),
          priority: 'HIGH'
        }
      });

      setName('');
      setDescription('');
      setKeywords('');
      setCompanies('');
      setProducts('');
      setExcludeKeywords('');
    } catch (err) {
      console.error('[WatchlistManager] Failed to create watchlist:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn font-mono">
      <div 
        className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-xl border border-zinc-800 bg-zinc-950 p-6 shadow-2xl space-y-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-900 pb-4">
          <div className="flex items-center gap-2">
            <Eye className="w-5 h-5 text-indigo-400" />
            <div>
              <h2 className="text-base font-bold text-zinc-100 uppercase">Custom Watchlists Manager</h2>
              <p className="text-xs text-zinc-500">CONFIGURE KEYWORD & ENTITY TRACKING RULES</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded hover:bg-zinc-900 text-zinc-400 hover:text-zinc-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Create Watchlist Form */}
        <form onSubmit={handleSubmit} className="p-4 rounded-lg bg-zinc-900/40 border border-zinc-850 space-y-4">
          <h3 className="text-xs font-bold text-zinc-200 uppercase flex items-center gap-1.5">
            <Plus className="w-4 h-4 text-indigo-400" />
            Create New Custom Watchlist
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="text-zinc-400 text-[11px] block mb-1">Watchlist Name</label>
              <input
                type="text"
                placeholder="e.g. OpenAI & LLM Hardware"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-3 py-1.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-200 focus:outline-none focus:border-zinc-700"
              />
            </div>

            <div>
              <label className="text-zinc-400 text-[11px] block mb-1">Description</label>
              <input
                type="text"
                placeholder="e.g. Tracking frontier models and chipFoundries"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-1.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-200 focus:outline-none focus:border-zinc-700"
              />
            </div>

            <div>
              <label className="text-zinc-400 text-[11px] block mb-1">Tracked Keywords (comma-separated)</label>
              <input
                type="text"
                placeholder="ai, gpu, generative, semiconductor"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                className="w-full px-3 py-1.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-200 focus:outline-none focus:border-zinc-700"
              />
            </div>

            <div>
              <label className="text-zinc-400 text-[11px] block mb-1">Tracked Companies (comma-separated)</label>
              <input
                type="text"
                placeholder="OpenAI, Nvidia, Google, Microsoft"
                value={companies}
                onChange={(e) => setCompanies(e.target.value)}
                className="w-full px-3 py-1.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-200 focus:outline-none focus:border-zinc-700"
              />
            </div>

            <div>
              <label className="text-zinc-400 text-[11px] block mb-1">Tracked Products (comma-separated)</label>
              <input
                type="text"
                placeholder="ChatGPT, Gemini, Claude, Copilot"
                value={products}
                onChange={(e) => setProducts(e.target.value)}
                className="w-full px-3 py-1.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-200 focus:outline-none focus:border-zinc-700"
              />
            </div>

            <div>
              <label className="text-zinc-400 text-[11px] block mb-1">Exclude Keywords (comma-separated)</label>
              <input
                type="text"
                placeholder="crypto, web3, rumor"
                value={excludeKeywords}
                onChange={(e) => setExcludeKeywords(e.target.value)}
                className="w-full px-3 py-1.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-200 focus:outline-none focus:border-zinc-700"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting || !name.trim()}
              className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-colors shadow-md shadow-indigo-600/20 disabled:opacity-50"
            >
              {isSubmitting ? 'Creating Watchlist...' : 'Save Custom Watchlist'}
            </button>
          </div>
        </form>

        {/* Existing Active Watchlists List */}
        <div className="space-y-3 pt-2 border-t border-zinc-900">
          <h3 className="text-xs font-bold uppercase text-zinc-300">Active Workspace Watchlists ({watchlists.length})</h3>

          <div className="space-y-3">
            {watchlists.map((wl) => (
              <div key={wl.id} className="p-4 rounded-lg border border-zinc-800 bg-zinc-900/30 space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="text-xs font-bold text-zinc-100 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    {wl.name}
                  </h4>
                  <span className="px-2 py-0.5 rounded text-[10px] bg-zinc-900 border border-zinc-800 text-indigo-400 font-bold">
                    PRIORITY: {wl.rules.priority}
                  </span>
                </div>

                {wl.description && (
                  <p className="text-[11px] text-zinc-400 font-sans">{wl.description}</p>
                )}

                <div className="flex items-center gap-1.5 flex-wrap text-[10px] pt-1">
                  {wl.rules.companies.map(c => (
                    <span key={c} className="px-2 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/20 text-indigo-300">
                      Company: {c}
                    </span>
                  ))}
                  {wl.rules.keywords.map(k => (
                    <span key={k} className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-300">
                      KW: {k}
                    </span>
                  ))}
                  {wl.rules.excludeKeywords.map(ex => (
                    <span key={ex} className="px-2 py-0.5 rounded bg-rose-500/10 border border-rose-500/20 text-rose-400">
                      Exclude: {ex}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Close */}
        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-xs text-zinc-300 font-bold border border-zinc-800 transition-colors"
          >
            Close Manager
          </button>
        </div>
      </div>
    </div>
  );
}
