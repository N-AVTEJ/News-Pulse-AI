'use client';

import React, { useState } from 'react';
import { X, Plus, ShieldCheck } from 'lucide-react';
import { Investigation, InvestigationPriority, InvestigationStatus } from '@/lib/enterprise/types';

interface InvestigationManagerProps {
  isOpen: boolean;
  onClose: () => void;
  investigations: Investigation[];
  onCreateInvestigation: (title: string, description: string, priority: InvestigationPriority, tags: string[]) => Promise<void>;
  onUpdateStatus: (id: string, status: InvestigationStatus) => Promise<void>;
}

export default function InvestigationManager({
  isOpen,
  onClose,
  investigations,
  onCreateInvestigation,
  onUpdateStatus
}: InvestigationManagerProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<InvestigationPriority>('HIGH');
  const [tags, setTags] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  if (!isOpen) return null;

  const filtered = investigations.filter(i => statusFilter === 'ALL' || i.status === statusFilter);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    await onCreateInvestigation(
      title,
      description,
      priority,
      tags.split(',').map(s => s.trim()).filter(Boolean)
    );

    setTitle('');
    setDescription('');
    setTags('');
    setShowCreate(false);
  };

  const getPriorityBadge = (p: InvestigationPriority) => {
    switch (p) {
      case 'CRITICAL': return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
      case 'HIGH': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'MEDIUM': return 'bg-sky-500/10 text-sky-400 border-sky-500/20';
      default: return 'bg-zinc-800 text-zinc-400 border-zinc-700';
    }
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
            <ShieldCheck className="w-5 h-5 text-indigo-400" />
            <div>
              <h2 className="text-base font-bold text-zinc-100 uppercase">Enterprise Investigation Operations</h2>
              <p className="text-xs text-zinc-500">MULTI-ANALYST THREAT & INTELLIGENCE INVESTIGATIONS</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowCreate(!showCreate)}
              className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-colors flex items-center gap-1.5 shadow-md shadow-indigo-600/20"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Investigation</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded hover:bg-zinc-900 text-zinc-400 hover:text-zinc-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Create Investigation Form */}
        {showCreate && (
          <form onSubmit={handleCreate} className="p-4 rounded-lg bg-zinc-900/40 border border-zinc-850 space-y-3">
            <h3 className="text-xs font-bold text-zinc-200 uppercase">Launch Strategic Investigation</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="text-zinc-400 text-[11px] block mb-1">Title</label>
                <input
                  type="text"
                  placeholder="e.g. Datacenter GPU Export Controls & Foundry Risk"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="w-full px-3 py-1.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-200 focus:outline-none focus:border-zinc-700"
                />
              </div>

              <div>
                <label className="text-zinc-400 text-[11px] block mb-1">Priority</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as InvestigationPriority)}
                  className="w-full px-3 py-1.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-200 focus:outline-none focus:border-zinc-700"
                >
                  <option value="CRITICAL">CRITICAL</option>
                  <option value="HIGH">HIGH</option>
                  <option value="MEDIUM">MEDIUM</option>
                  <option value="LOW">LOW</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="text-zinc-400 text-[11px] block mb-1">Description</label>
                <input
                  type="text"
                  placeholder="Investigating strategic foundry capacity, geopolitical impacts, and primary statements..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-1.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-200 focus:outline-none focus:border-zinc-700"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-zinc-400 text-[11px] block mb-1">Tags (comma-separated)</label>
                <input
                  type="text"
                  placeholder="Semiconductors, Hardware, TSMC, Nvidia"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  className="w-full px-3 py-1.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-200 focus:outline-none focus:border-zinc-700"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowCreate(false)}
                className="px-3 py-1.5 rounded text-xs text-zinc-400 hover:text-zinc-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs"
              >
                Launch Investigation
              </button>
            </div>
          </form>
        )}

        {/* Status Filter Bar */}
        <div className="flex items-center gap-2 text-xs border-b border-zinc-900 pb-3 overflow-x-auto">
          <span className="text-zinc-500 uppercase font-bold">Filter State:</span>
          {['ALL', 'OPEN', 'ACTIVE', 'AWAITING_REVIEW', 'COMPLETED', 'ARCHIVED'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase transition-colors ${
                statusFilter === st ? 'bg-indigo-600 text-white' : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
              }`}
            >
              {st.replace(/_/g, ' ')}
            </button>
          ))}
        </div>

        {/* Investigations List */}
        <div className="space-y-3">
          {filtered.length === 0 ? (
            <div className="p-8 text-center text-zinc-500 text-xs border border-dashed border-zinc-850 rounded-lg">
              No active investigations matching state filter &quot;{statusFilter}&quot;.
            </div>
          ) : (
            filtered.map((inv) => (
              <div key={inv.id} className="p-4 rounded-lg border border-zinc-800 bg-zinc-900/30 space-y-3">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${getPriorityBadge(inv.priority)}`}>
                      {inv.priority}
                    </span>

                    <h3 className="text-xs font-bold text-zinc-100 font-sans">{inv.title}</h3>
                  </div>

                  {/* Lifecycle State Transition Dropdown */}
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-zinc-500 uppercase">State:</span>
                    <select
                      value={inv.status}
                      onChange={(e) => onUpdateStatus(inv.id, e.target.value as InvestigationStatus)}
                      className="bg-zinc-900 border border-zinc-800 text-indigo-300 font-bold text-[10px] px-2 py-0.5 rounded cursor-pointer uppercase"
                    >
                      <option value="DRAFT">DRAFT</option>
                      <option value="OPEN">OPEN</option>
                      <option value="ACTIVE">ACTIVE</option>
                      <option value="AWAITING_REVIEW">AWAITING REVIEW</option>
                      <option value="COMPLETED">COMPLETED</option>
                      <option value="ARCHIVED">ARCHIVED</option>
                    </select>
                  </div>
                </div>

                <p className="text-xs text-zinc-400 font-sans leading-relaxed">{inv.description}</p>

                {/* Footer Metrics */}
                <div className="flex items-center justify-between text-[10px] text-zinc-500 border-t border-zinc-900 pt-2 flex-wrap gap-2">
                  <div className="flex items-center gap-3">
                    <span>Evidence Attached: <strong className="text-zinc-300">{inv.evidenceCount} Items</strong></span>
                    <span>Assignees: <strong className="text-zinc-300">{inv.assignedTo.length} Analysts</strong></span>
                  </div>

                  <div className="flex items-center gap-1.5 flex-wrap">
                    {inv.tags.map(t => (
                      <span key={t} className="px-1.5 py-0.2 rounded bg-zinc-950 border border-zinc-850 text-zinc-400">
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Close */}
        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-xs text-zinc-300 font-bold border border-zinc-800 transition-colors"
          >
            Close Operations Panel
          </button>
        </div>
      </div>
    </div>
  );
}
