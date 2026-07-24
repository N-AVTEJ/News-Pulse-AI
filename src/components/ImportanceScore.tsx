import React from 'react';

interface ImportanceScoreProps {
  score: number;
}

export default function ImportanceScore({ score }: ImportanceScoreProps) {
  let color = 'text-zinc-400 bg-zinc-500/10 border-zinc-800';
  let label = 'LOW';

  if (score >= 90) {
    color = 'text-rose-500 bg-rose-500/10 border-rose-500/20';
    label = 'CRITICAL';
  } else if (score >= 70) {
    color = 'text-amber-500 bg-amber-500/10 border-amber-500/20';
    label = 'HIGH';
  } else if (score >= 50) {
    color = 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20';
    label = 'MEDIUM';
  } else {
    color = 'text-zinc-500 bg-zinc-500/5 border-zinc-800';
    label = 'LOW';
  }

  return (
    <div className="flex items-center gap-2">
      <div className={`flex items-center justify-center px-1.5 py-0.5 rounded text-[10px] font-mono font-bold tracking-wider border ${color}`}>
        {label}
      </div>
      <span className="font-mono text-sm font-bold text-zinc-100">{score}</span>
    </div>
  );
}
