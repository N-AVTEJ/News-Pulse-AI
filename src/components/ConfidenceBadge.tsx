import React from 'react';

interface ConfidenceBadgeProps {
  score: number;
}

export default function ConfidenceBadge({ score }: ConfidenceBadgeProps) {
  let colorClass = 'text-zinc-400 bg-zinc-500/10 border-zinc-800';
  let label = 'LOW';

  if (score >= 90) {
    colorClass = 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
    label = 'HIGH CONFIDENCE';
  } else if (score >= 70) {
    colorClass = 'text-blue-400 bg-blue-500/10 border-blue-500/20';
    label = 'MED CONFIDENCE';
  } else if (score >= 50) {
    colorClass = 'text-amber-400 bg-amber-500/10 border-amber-500/20';
    label = 'LOW CONFIDENCE';
  } else {
    colorClass = 'text-rose-400 bg-rose-500/10 border-rose-500/20';
    label = 'UNVERIFIED / POOR';
  }

  return (
    <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-mono font-medium border tracking-wider ${colorClass}`}>
      <span className="w-1 h-1 rounded-full bg-current animate-pulse"></span>
      <span>{label}</span>
      <span className="opacity-70 font-semibold">{score}%</span>
    </div>
  );
}
