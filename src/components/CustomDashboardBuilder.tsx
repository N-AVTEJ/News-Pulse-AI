'use client';

import React, { useState } from 'react';
import { LayoutGrid, Eye, EyeOff } from 'lucide-react';

interface WidgetConfig {
  id: string;
  name: string;
  category: string;
  visible: boolean;
}

export default function CustomDashboardBuilder() {
  const [widgets, setWidgets] = useState<WidgetConfig[]>([
    { id: 'w_exec', name: 'Executive Command Center', category: 'Overview', visible: true },
    { id: 'w_nlq', name: 'Natural Language Query Bar', category: 'Search', visible: true },
    { id: 'w_graph', name: 'Knowledge Graph Explorer', category: 'Graph', visible: true },
    { id: 'w_team', name: 'Team Operations & RBAC Panel', category: 'Enterprise', visible: true },
    { id: 'w_personal', name: 'Personal Briefings & Watchlists', category: 'Personalization', visible: true },
    { id: 'w_verif', name: 'Corroboration & Verification Metrics', category: 'Telemetry', visible: true }
  ]);

  const [isOpen, setIsOpen] = useState(false);

  const toggleWidget = (id: string) => {
    setWidgets(prev => prev.map(w => w.id === id ? { ...w, visible: !w.visible } : w));
  };

  return (
    <div className="font-mono text-xs">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 font-bold transition-colors flex items-center gap-1.5"
      >
        <LayoutGrid className="w-3.5 h-3.5 text-indigo-400" />
        <span>Customize Dashboard Layout</span>
      </button>

      {isOpen && (
        <div className="mt-3 p-4 rounded-xl border border-zinc-800 bg-zinc-950 space-y-3">
          <div className="flex items-center justify-between border-b border-zinc-900 pb-2">
            <h4 className="text-xs font-bold text-zinc-200 uppercase">Modular Widget Controls</h4>
            <span className="text-[10px] text-zinc-500">TOGGLE VISIBILITY</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {widgets.map((widget) => (
              <div 
                key={widget.id}
                onClick={() => toggleWidget(widget.id)}
                className={`p-2.5 rounded-lg border transition-all cursor-pointer flex items-center justify-between ${
                  widget.visible ? 'border-indigo-500/40 bg-indigo-950/10 text-zinc-100' : 'border-zinc-850 bg-zinc-900/20 text-zinc-500'
                }`}
              >
                <div className="space-y-0.5">
                  <span className="text-[9px] font-bold uppercase text-indigo-400">{widget.category}</span>
                  <p className="text-xs font-bold font-sans">{widget.name}</p>
                </div>

                {widget.visible ? (
                  <Eye className="w-4 h-4 text-emerald-400" />
                ) : (
                  <EyeOff className="w-4 h-4 text-zinc-600" />
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
