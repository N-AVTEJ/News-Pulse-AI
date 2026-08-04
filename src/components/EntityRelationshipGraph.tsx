'use client';

import React from 'react';
import { Network, Building2, User, Globe, Cpu, Smartphone, ShieldAlert } from 'lucide-react';
import { EntityRelationship, ExtractedEntity } from '@/lib/analysis/types';

interface EntityRelationshipGraphProps {
  entities?: ExtractedEntity[];
  relationships?: EntityRelationship[];
}

export default function EntityRelationshipGraph({ entities, relationships }: EntityRelationshipGraphProps) {
  if (!entities || entities.length === 0) return null;

  const getEntityIcon = (category: string) => {
    switch (category) {
      case 'COMPANY': return Building2;
      case 'PERSON': return User;
      case 'PRODUCT': return Smartphone;
      case 'TECHNOLOGY': return Cpu;
      case 'GOVERNMENT': return ShieldAlert;
      case 'LOCATION':
      default: return Globe;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'COMPANY': return 'border-indigo-500 text-indigo-400 bg-indigo-500/10';
      case 'PERSON': return 'border-amber-500 text-amber-400 bg-amber-500/10';
      case 'PRODUCT': return 'border-emerald-500 text-emerald-400 bg-emerald-500/10';
      case 'TECHNOLOGY': return 'border-purple-500 text-purple-400 bg-purple-500/10';
      case 'GOVERNMENT': return 'border-rose-500 text-rose-400 bg-rose-500/10';
      case 'LOCATION':
      default: return 'border-sky-500 text-sky-400 bg-sky-500/10';
    }
  };

  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-4 font-mono space-y-4">
      <div className="flex items-center justify-between border-b border-zinc-900 pb-2">
        <span className="text-xs font-bold uppercase tracking-wider text-zinc-200 flex items-center gap-1.5">
          <Network className="w-4 h-4 text-purple-400" />
          Extracted Entity Relationship Topology ({entities.length} Entities / {relationships?.length || 0} Relations)
        </span>
        <span className="text-[10px] text-zinc-500">DETERMINISTIC ENTITY GRAPH</span>
      </div>

      {/* Entity Badges Roster */}
      <div className="flex flex-wrap items-center gap-2">
        {entities.map((ent) => {
          const Icon = getEntityIcon(ent.category);
          const colorClass = getCategoryColor(ent.category);

          return (
            <span
              key={ent.id}
              className={`px-2.5 py-1 rounded text-xs font-bold border flex items-center gap-1.5 ${colorClass}`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{ent.name}</span>
              <span className="text-[9px] opacity-60">({ent.category})</span>
            </span>
          );
        })}
      </div>

      {/* Directed Relationships Table / Flow */}
      {relationships && relationships.length > 0 && (
        <div className="pt-2 border-t border-zinc-900 space-y-2">
          <span className="text-[10px] text-zinc-500 uppercase font-bold block">Extracted Relationship Triples</span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {relationships.map((rel) => (
              <div key={rel.id} className="p-2 rounded bg-zinc-900/40 border border-zinc-850 flex items-center justify-between gap-2">
                <span className="font-bold text-zinc-200 truncate">{rel.subject}</span>
                <span className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-purple-500/10 text-purple-300 border border-purple-500/20 shrink-0">
                  &rarr; {rel.predicate} &rarr;
                </span>
                <span className="font-bold text-zinc-200 truncate">{rel.object}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
