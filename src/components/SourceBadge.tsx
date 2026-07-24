import React from 'react';
import { Newspaper } from 'lucide-react';

interface SourceBadgeProps {
  name: string;
  reliability: string;
  tier: 'HIGH' | 'MEDIUM' | 'LOW';
}

export default function SourceBadge({ name, reliability, tier }: SourceBadgeProps) {
  let tierColor = 'text-zinc-500 bg-zinc-500/10 border-zinc-800';
  if (tier === 'HIGH') {
    tierColor = 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
  } else if (tier === 'MEDIUM') {
    tierColor = 'text-amber-400 bg-amber-500/10 border-amber-500/20';
  } else if (tier === 'LOW') {
    tierColor = 'text-rose-400 bg-rose-500/10 border-rose-500/20';
  }

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <div className="flex items-center gap-1 text-zinc-300 font-medium text-xs">
        <Newspaper className="w-3.5 h-3.5 text-zinc-500" />
        <span>{name}</span>
      </div>
      <div className={`inline-flex items-center text-[9px] font-mono font-semibold px-1.5 py-0.2 rounded border ${tierColor}`}>
        {reliability}
      </div>
    </div>
  );
}
