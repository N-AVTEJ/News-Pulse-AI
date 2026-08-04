'use client';

import React from 'react';
import { Sparkles, ShieldAlert, CheckCircle2, AlertTriangle, ExternalLink, Globe, Cpu, ArrowRight } from 'lucide-react';
import { AnalysisReport } from '@/lib/analysis/types';
import EntityRelationshipGraph from './EntityRelationshipGraph';

interface AiReportPanelProps {
  report?: AnalysisReport | null;
}

export default function AiReportPanel({ report }: AiReportPanelProps) {
  if (!report) return null;

  return (
    <div className="space-y-5 font-mono">
      
      {/* AI Safety & Grounding Disclaimer */}
      <div className="p-3.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs flex items-start gap-2.5 leading-relaxed">
        <Sparkles className="w-4 h-4 shrink-0 mt-0.5 text-indigo-400" />
        <div>
          <strong className="text-indigo-200 uppercase font-bold">Evidence-Grounded AI Analysis Notice:</strong> AI reports are synthesized strictly from verified event articles and primary sources. They should NOT be interpreted as an independent source of truth.
        </div>
      </div>

      {/* Report Header Info */}
      <div className="flex items-center justify-between gap-3 text-xs border-b border-zinc-900 pb-2 flex-wrap">
        <div className="flex items-center gap-2">
          <Cpu className="w-4 h-4 text-indigo-400" />
          <span className="font-bold text-zinc-200 uppercase">AI Intelligence Report</span>
          <span className="px-2 py-0.5 rounded text-[10px] bg-zinc-900 border border-zinc-800 text-zinc-400 font-bold">
            {report.provider}
          </span>
        </div>

        <span className="text-[10px] text-zinc-500">
          Generated in {report.durationMs}ms · {report.citations.length} Citations Validated
        </span>
      </div>

      {/* Executive Summary */}
      <div className="p-4 rounded-lg bg-zinc-900/40 border border-zinc-850 space-y-2 font-sans text-xs text-zinc-200 leading-relaxed">
        <span className="font-mono text-[10px] text-indigo-400 uppercase font-bold block">Executive Summary</span>
        <p>{report.executiveSummary}</p>
      </div>

      {/* Why It Matters */}
      <div className="p-4 rounded-lg bg-indigo-500/5 border border-indigo-500/20 space-y-1.5 font-sans text-xs text-indigo-200 leading-relaxed">
        <span className="font-mono text-[10px] text-indigo-400 uppercase font-bold block">Why It Matters</span>
        <p>{report.whyItMatters}</p>
      </div>

      {/* Key Developments & Timeline */}
      <div className="p-4 rounded-lg bg-zinc-900/30 border border-zinc-850 space-y-3 text-xs">
        <span className="text-xs font-bold uppercase text-zinc-300 block">Key Developments</span>
        <ul className="space-y-2">
          {report.keyDevelopments.map((dev, idx) => (
            <li key={idx} className="flex items-start gap-2 text-zinc-300">
              <span className="text-indigo-400 font-bold mt-0.5">&bull;</span>
              <span>{dev}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Multi-Domain Impact Assessment */}
      {report.potentialImpact.length > 0 && (
        <div className="p-4 rounded-lg bg-zinc-900/40 border border-zinc-850 space-y-3 text-xs">
          <span className="text-xs font-bold uppercase text-zinc-300 block">Multi-Domain Impact Assessment</span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {report.potentialImpact.map((imp, idx) => (
              <div key={idx} className="p-3 rounded bg-zinc-950 border border-zinc-900 space-y-1">
                <span className="px-1.5 py-0.2 rounded text-[9px] font-bold uppercase bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  {imp.domain}
                </span>
                <h4 className="font-bold text-zinc-200 text-[11px] pt-1">{imp.title}</h4>
                <p className="text-[11px] text-zinc-400 font-sans leading-relaxed">{imp.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Known Facts vs Remaining Uncertainty */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
        {/* Known Facts */}
        <div className="p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/20 space-y-2">
          <span className="text-[10px] text-emerald-400 uppercase font-bold block flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Verified Facts ({report.knownFacts.length})
          </span>
          <ul className="space-y-1.5 text-[11px] text-zinc-300">
            {report.knownFacts.map((fact, idx) => (
              <li key={idx} className="flex items-start gap-1.5">
                <span className="text-emerald-400">&check;</span>
                <span className="line-clamp-2">{fact}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Remaining Uncertainty */}
        <div className="p-3 rounded-lg bg-amber-500/5 border border-amber-500/20 space-y-2">
          <span className="text-[10px] text-amber-400 uppercase font-bold block flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5" />
            Remaining Uncertainties ({report.remainingUncertainty.length})
          </span>
          {report.remainingUncertainty.length === 0 ? (
            <span className="text-[11px] text-zinc-500 italic block">No critical uncertainties flagged.</span>
          ) : (
            <div className="space-y-2">
              {report.remainingUncertainty.map((unc) => (
                <div key={unc.id} className="text-[11px] space-y-0.5">
                  <strong className="text-amber-300 block">{unc.title}</strong>
                  <p className="text-zinc-400 text-[10px] leading-relaxed">{unc.description}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Extracted Entity Relationship Graph */}
      <EntityRelationshipGraph
        entities={report.entities}
        relationships={report.entityRelationships}
      />

      {/* Supporting Citations Roster */}
      <div className="p-4 rounded-lg bg-zinc-900/30 border border-zinc-850 space-y-3 text-xs">
        <span className="text-xs font-bold uppercase text-zinc-300 block">Supporting Source Citations ({report.citations.length})</span>
        <div className="space-y-2">
          {report.citations.map((cit) => (
            <div key={cit.id} className="p-2.5 rounded bg-zinc-950 border border-zinc-900 flex items-center justify-between gap-3 flex-wrap">
              <div className="space-y-0.5 min-w-0 flex-1">
                <div className="flex items-center gap-2 text-[10px]">
                  <span className="font-bold text-indigo-400 flex items-center gap-1">
                    <Globe className="w-3 h-3 text-zinc-500" />
                    {cit.publisherName}
                  </span>
                  <span className="text-zinc-500">
                    {new Date(cit.publishedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="text-xs text-zinc-300 font-semibold truncate">{cit.headline}</p>
              </div>

              <a
                href={cit.articleUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-2 py-1 rounded bg-zinc-900 hover:bg-zinc-800 text-[10px] text-zinc-300 font-bold border border-zinc-800 flex items-center gap-1 transition-colors shrink-0"
              >
                <span>Read Source</span>
                <ExternalLink className="w-3 h-3 text-zinc-500" />
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* Related Events */}
      {report.relatedEvents.length > 0 && (
        <div className="p-4 rounded-lg bg-zinc-900/20 border border-zinc-850 space-y-3 text-xs">
          <span className="text-xs font-bold uppercase text-zinc-400 block">Related Event Clusters ({report.relatedEvents.length})</span>
          <div className="space-y-2">
            {report.relatedEvents.map((rel) => (
              <div key={rel.clusterId} className="p-2.5 rounded bg-zinc-950 border border-zinc-900 flex items-center justify-between gap-3 text-xs">
                <div>
                  <span className="text-[10px] text-indigo-400 font-bold block">{rel.primaryCategory.toUpperCase()} &bull; {rel.sharedEntities.join(', ')}</span>
                  <p className="font-semibold text-zinc-200 line-clamp-1">{rel.canonicalHeadline}</p>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 font-bold shrink-0">
                  {rel.similarityScore}% match
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
