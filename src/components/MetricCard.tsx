import React, { ElementType } from 'react';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtext: string;
  icon: ElementType;
  trendType?: 'positive' | 'negative' | 'neutral' | 'live';
}

export default function MetricCard({ title, value, subtext, icon: Icon, trendType = 'neutral' }: MetricCardProps) {
  let trendColor = 'text-zinc-500';
  if (trendType === 'positive') {
    trendColor = 'text-emerald-400';
  } else if (trendType === 'negative') {
    trendColor = 'text-rose-400';
  } else if (trendType === 'live') {
    trendColor = 'text-indigo-400 font-bold tracking-wider';
  }

  return (
    <div className="relative overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900/40 p-5 backdrop-blur-md transition-all duration-300 hover:border-zinc-700 hover:bg-zinc-900/60">
      {/* Decorative background glow for live stats */}
      {trendType === 'live' && (
        <div className="absolute right-0 top-0 -mr-6 -mt-6 w-20 h-20 rounded-full bg-indigo-500/10 blur-xl"></div>
      )}
      
      <div className="flex items-center justify-between">
        <span className="text-xs font-mono tracking-wider text-zinc-500 uppercase">{title}</span>
        <div className={`p-2 rounded bg-zinc-800/50 border border-zinc-700/50 text-zinc-400 ${trendType === 'live' ? 'text-indigo-400' : ''}`}>
          <Icon className="w-4 h-4" />
        </div>
      </div>
      
      <div className="mt-3 flex items-baseline gap-2">
        <span className="text-2xl font-bold font-mono tracking-tight text-zinc-100">{value}</span>
      </div>
      
      <div className="mt-1 flex items-center gap-1.5 text-[11px]">
        {trendType === 'live' && (
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
          </span>
        )}
        <span className={trendColor}>{subtext}</span>
      </div>
    </div>
  );
}
