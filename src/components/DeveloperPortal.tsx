'use client';

import React, { useState } from 'react';
import { X, Code, Key, Terminal, BookOpen, Copy, Check, Plus } from 'lucide-react';
import { ApiKey } from '@/lib/platform/types';

interface DeveloperPortalProps {
  isOpen: boolean;
  onClose: () => void;
  apiKeys: ApiKey[];
  onCreateApiKey: (name: string) => Promise<void>;
}

export default function DeveloperPortal({
  isOpen,
  onClose,
  apiKeys,
  onCreateApiKey
}: DeveloperPortalProps) {
  const [name, setName] = useState('');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'DOCS' | 'KEYS' | 'EXAMPLES'>('DOCS');

  if (!isOpen) return null;

  const handleCreateKey = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    await onCreateApiKey(name);
    setName('');
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(text);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn font-mono">
      <div 
        className="relative w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-xl border border-zinc-800 bg-zinc-950 p-6 shadow-2xl space-y-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-900 pb-4">
          <div className="flex items-center gap-2">
            <Code className="w-5 h-5 text-indigo-400" />
            <div>
              <h2 className="text-base font-bold text-zinc-100 uppercase">Developer Portal & Platform SDK</h2>
              <p className="text-xs text-zinc-500">PUBLIC REST APIs // PLUGIN SDK // API KEYS</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded hover:bg-zinc-900 text-zinc-400 hover:text-zinc-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-zinc-900 pb-3 text-xs">
          {[
            { id: 'DOCS', label: 'API Documentation', icon: BookOpen },
            { id: 'KEYS', label: `API Keys (${apiKeys.length})`, icon: Key },
            { id: 'EXAMPLES', label: 'SDK Examples & cURL', icon: Terminal }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as 'DOCS' | 'KEYS' | 'EXAMPLES')}
                className={`px-3 py-1.5 rounded text-xs font-bold transition-colors flex items-center gap-1.5 ${
                  activeTab === tab.id ? 'bg-indigo-600 text-white' : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content: API DOCS */}
        {activeTab === 'DOCS' && (
          <div className="space-y-4 text-xs">
            <div className="p-4 rounded-lg bg-zinc-900/40 border border-zinc-850 space-y-2">
              <h3 className="text-xs font-bold text-indigo-300 uppercase">Versioned REST API v1 Overview</h3>
              <p className="text-zinc-300 font-sans leading-relaxed">
                The NewsPulse AI public API enables programmatic ingestion, querying of verified events, triggering automated workflows, and building custom integration connectors.
              </p>
            </div>

            <div className="space-y-3">
              {[
                { method: 'GET', path: '/api/v1/events', scope: 'read:events', desc: 'Retrieve verified event intelligence clusters.' },
                { method: 'POST', path: '/api/v1/workflows', scope: 'write:workflows', desc: 'Execute automated workflow pipelines.' },
                { method: 'POST', path: '/api/query', scope: 'read:events', desc: 'Execute natural language intelligence queries.' },
                { method: 'GET', path: '/api/graph', scope: 'read:graph', desc: 'Query Knowledge Graph nodes and edges.' }
              ].map((api) => (
                <div key={api.path} className="p-3.5 rounded-lg border border-zinc-850 bg-zinc-900/30 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                        {api.method}
                      </span>
                      <span className="font-mono text-zinc-100 font-bold">{api.path}</span>
                    </div>

                    <span className="text-[10px] text-zinc-500 font-mono">Scope: {api.scope}</span>
                  </div>
                  <p className="text-zinc-400 font-sans text-[11px]">{api.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab Content: API KEYS */}
        {activeTab === 'KEYS' && (
          <div className="space-y-4 text-xs">
            {/* Create API Key */}
            <form onSubmit={handleCreateKey} className="flex gap-2">
              <input
                type="text"
                placeholder="Enter key description (e.g. Production SIEM Ingestion Key)..."
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="flex-1 px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-200 text-xs focus:outline-none focus:border-zinc-700"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-colors flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Generate Key</span>
              </button>
            </form>

            {/* Keys Table */}
            <div className="space-y-3">
              {apiKeys.map((key) => (
                <div key={key.id} className="p-4 rounded-lg border border-zinc-800 bg-zinc-900/30 space-y-2">
                  <div className="flex items-center justify-between">
                    <strong className="text-zinc-100 font-bold">{key.name}</strong>
                    <span className="text-[10px] text-zinc-500">Rate Limit: {key.rateLimitPerMinute} req/min</span>
                  </div>

                  <div className="p-2.5 rounded bg-zinc-950 border border-zinc-850 flex items-center justify-between font-mono text-[11px]">
                    <span className="text-indigo-400">{key.key}</span>
                    <button
                      onClick={() => handleCopy(key.key)}
                      className="p-1 text-zinc-400 hover:text-zinc-200 transition-colors"
                    >
                      {copiedKey === key.key ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>

                  <div className="flex items-center gap-1.5 text-[10px] text-zinc-500 pt-1">
                    <span>Scopes:</span>
                    {key.scopes.map(s => (
                      <span key={s} className="px-1.5 py-0.2 rounded bg-zinc-900 border border-zinc-800 text-zinc-300">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab Content: SDK EXAMPLES */}
        {activeTab === 'EXAMPLES' && (
          <div className="space-y-4 text-xs">
            <div className="p-4 rounded-lg bg-zinc-950 border border-zinc-850 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase text-indigo-400">JavaScript / Node.js SDK</span>
                <button
                  onClick={() => handleCopy(`const res = await fetch('http://localhost:3000/api/v1/events', {\n  headers: { Authorization: 'Bearer np_live_sec_8923749283749823' }\n});`)}
                  className="text-[10px] text-zinc-400 hover:text-zinc-200 flex items-center gap-1"
                >
                  <Copy className="w-3 h-3" /> Copy
                </button>
              </div>

              <pre className="p-3 rounded bg-zinc-900 text-indigo-300 font-mono text-[11px] overflow-x-auto">
{`const res = await fetch('http://localhost:3000/api/v1/events', {
  headers: { 
    'Authorization': 'Bearer np_live_sec_8923749283749823',
    'Content-Type': 'application/json'
  }
});
const data = await res.json();
console.log('Verified Events:', data.events);`}
              </pre>
            </div>
          </div>
        )}

        {/* Footer Close */}
        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-xs text-zinc-300 font-bold border border-zinc-800 transition-colors"
          >
            Close Developer Portal
          </button>
        </div>
      </div>
    </div>
  );
}
