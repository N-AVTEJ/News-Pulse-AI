'use client';

import React from 'react';
import { ShieldCheck, AlertTriangle, ShieldAlert, FileText, CheckCircle2 } from 'lucide-react';
import { VerificationTelemetry } from '@/lib/verification/types';

interface VerificationMetricCardsProps {
  telemetry?: VerificationTelemetry | null;
  activeStatusFilter: string;
  onSelectStatusFilter: (status: string) => void;
}

export default function VerificationMetricCards({
  telemetry,
  activeStatusFilter,
  onSelectStatusFilter
}: VerificationMetricCardsProps) {
  const dist = telemetry?.statusDistribution || {
    UNASSESSED: 0,
    PENDING: 0,
    LIMITED_CORROBORATION: 0,
    STRONG_CORROBORATION: 0,
    CONFLICTING_REPORTS: 0,
    INSUFFICIENT_EVIDENCE: 0
  };

  const cards = [
    {
      id: 'STRONG_CORROBORATION',
      label: 'Strongly Corroborated',
      count: dist.STRONG_CORROBORATION || 0,
      icon: ShieldCheck,
      color: 'emerald',
      bg: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
      activeBorder: 'border-emerald-500'
    },
    {
      id: 'LIMITED_CORROBORATION',
      label: 'Limited Corroboration',
      count: dist.LIMITED_CORROBORATION || 0,
      icon: CheckCircle2,
      color: 'sky',
      bg: 'bg-sky-500/10 border-sky-500/20 text-sky-400',
      activeBorder: 'border-sky-500'
    },
    {
      id: 'CONFLICTING_REPORTS',
      label: 'Conflicting Reports',
      count: dist.CONFLICTING_REPORTS || 0,
      icon: AlertTriangle,
      color: 'rose',
      bg: 'bg-rose-500/10 border-rose-500/20 text-rose-400',
      activeBorder: 'border-rose-500'
    },
    {
      id: 'INSUFFICIENT_EVIDENCE',
      label: 'Single Source / Insufficient',
      count: dist.INSUFFICIENT_EVIDENCE || 0,
      icon: FileText,
      color: 'amber',
      bg: 'bg-amber-500/10 border-amber-500/20 text-amber-400',
      activeBorder: 'border-amber-500'
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 font-mono">
      {cards.map((card) => {
        const Icon = card.icon;
        const isActive = activeStatusFilter === card.id;

        return (
          <div
            key={card.id}
            onClick={() => onSelectStatusFilter(isActive ? 'ALL' : card.id)}
            className={`cursor-pointer rounded-lg border p-4 transition-all duration-200 ${card.bg} ${
              isActive ? `${card.activeBorder} ring-1 ring-zinc-700 bg-zinc-900/60` : 'hover:border-zinc-700 hover:bg-zinc-900/40'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase tracking-wider text-zinc-400 font-bold">
                {card.label}
              </span>
              <Icon className="w-4 h-4 shrink-0" />
            </div>

            <div className="mt-2 flex items-baseline justify-between">
              <span className="text-xl font-bold font-mono">{card.count}</span>
              <span className="text-[9px] text-zinc-500">
                {isActive ? 'FILTER ACTIVE' : 'CLICK TO FILTER'}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
