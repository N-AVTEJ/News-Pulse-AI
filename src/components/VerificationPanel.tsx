'use client';

import React from 'react';
import { ShieldCheck, AlertTriangle, FileText, CheckCircle2, Globe, ExternalLink } from 'lucide-react';
import { VerificationResult, VerificationStatus } from '@/lib/verification/types';

interface VerificationPanelProps {
  verification?: VerificationResult | null;
}

export default function VerificationPanel({ verification }: VerificationPanelProps) {
  if (!verification) return null;

  const getStatusBadge = (status: VerificationStatus) => {
    switch (status) {
      case 'STRONG_CORROBORATION':
        return {
          label: 'Strong Corroboration',
          bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
          icon: ShieldCheck
        };
      case 'LIMITED_CORROBORATION':
        return {
          label: 'Limited Corroboration',
          bg: 'bg-sky-500/10 text-sky-400 border-sky-500/30',
          icon: CheckCircle2
        };
      case 'CONFLICTING_REPORTS':
        return {
          label: 'Conflicting Reports Detected',
          bg: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
          icon: AlertTriangle
        };
      case 'INSUFFICIENT_EVIDENCE':
      default:
        return {
          label: 'Single Source / Insufficient Evidence',
          bg: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
          icon: FileText
        };
    }
  };

  const badge = getStatusBadge(verification.verificationStatus);
  const StatusIcon = badge.icon;

  return (
    <div className="p-4 rounded-lg bg-zinc-900/40 border border-zinc-850 font-mono space-y-4">
      
      {/* Header Bar */}
      <div className="flex items-center justify-between gap-3 flex-wrap border-b border-zinc-900 pb-3">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-bold uppercase tracking-wider text-zinc-200">
            Deterministic Verification Evaluation
          </span>
        </div>

        {/* Status Badge */}
        <div className={`px-2.5 py-1 rounded text-xs font-bold border flex items-center gap-1.5 uppercase ${badge.bg}`}>
          <StatusIcon className="w-4 h-4" />
          <span>{badge.label}</span>
        </div>
      </div>

      {/* Conflict Warning Box (if conflicting reports exist) */}
      {verification.conflictingSources.length > 0 && (
        <div className="p-3 rounded bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs space-y-1">
          <div className="flex items-center gap-1.5 font-bold uppercase">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>Reporting Conflict Detected:</span>
          </div>
          <p className="text-[11px] leading-relaxed pl-5">
            Contradictory figures or statements were reported across outlets. Outlets flagged: {verification.conflictingSources.map(s => s.sourceName).join(', ')}.
          </p>
        </div>
      )}

      {/* Primary vs Secondary Sources Roster */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
        {/* Primary Evidence */}
        <div className="p-3 rounded bg-zinc-950 border border-zinc-900 space-y-1.5">
          <span className="text-[10px] text-zinc-500 uppercase font-bold block flex items-center justify-between">
            <span>Primary Sources</span>
            <strong className="text-emerald-400">{verification.primarySources.length}</strong>
          </span>

          {verification.primarySources.length === 0 ? (
            <span className="text-[11px] text-zinc-600 italic block">No official primary source link detected.</span>
          ) : (
            <div className="space-y-1">
              {verification.primarySources.map((story) => (
                <a
                  key={story.id}
                  href={story.articleUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] text-emerald-400 hover:underline block truncate flex items-center gap-1"
                >
                  <Globe className="w-3 h-3 text-emerald-500 shrink-0" />
                  <span>{story.sourceName}</span>
                  <ExternalLink className="w-2.5 h-2.5 shrink-0 ml-auto" />
                </a>
              ))}
            </div>
          )}
        </div>

        {/* Secondary Reporting */}
        <div className="p-3 rounded bg-zinc-950 border border-zinc-900 space-y-1.5">
          <span className="text-[10px] text-zinc-500 uppercase font-bold block flex items-center justify-between">
            <span>Independent Publishers</span>
            <strong className="text-sky-400">{verification.independentSources}</strong>
          </span>

          <div className="flex flex-wrap items-center gap-1">
            {verification.supportingSources.map((pub) => (
              <span key={pub} className="px-1.5 py-0.5 rounded text-[10px] bg-zinc-900 border border-zinc-800 text-zinc-300">
                {pub}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Verification Rule Reasons */}
      <div className="space-y-1.5 pt-2 border-t border-zinc-900">
        <span className="text-[10px] text-zinc-500 uppercase font-bold block">Evaluation Rule Triggers</span>
        <ul className="space-y-1 text-[11px] text-zinc-400">
          {verification.verificationReasons.map((reason, idx) => (
            <li key={idx} className="flex items-start gap-1.5">
              <span className="text-emerald-400 font-bold">&bull;</span>
              <span>{reason}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
