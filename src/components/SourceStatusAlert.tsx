'use client';

import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { SourceStatus } from '@/lib/news/types';

interface SourceStatusAlertProps {
  statuses: SourceStatus[];
  onRefresh?: () => void;
}

export default function SourceStatusAlert({ statuses, onRefresh }: SourceStatusAlertProps) {
  const failedSources = statuses.filter((s) => s.status === 'FAILED');

  if (failedSources.length === 0) return null;

  return (
    <div className="flex items-center justify-between gap-3 p-3.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 font-mono text-xs mb-4">
      <div className="flex items-center gap-2">
        <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400" />
        <span>
          <strong className="font-bold">{failedSources.length} source(s) temporarily unavailable</strong> ({failedSources.map(s => s.sourceName).join(', ')}). Displaying stories from active sources.
        </span>
      </div>

      {onRefresh && (
        <button
          onClick={onRefresh}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-amber-500/20 hover:bg-amber-500/30 text-[10px] font-bold text-amber-300 transition-colors shrink-0"
        >
          <RefreshCw className="w-3 h-3" />
          RETRY
        </button>
      )}
    </div>
  );
}
