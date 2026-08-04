'use client';

import React from 'react';
import { X, AlertTriangle, Layers, Cpu } from 'lucide-react';
import { EventCluster } from '@/lib/clustering/types';
import EventTimelineComponent from './EventTimelineComponent';
import VerificationPanel from './VerificationPanel';
import EvidenceGraphVisualizer from './EvidenceGraphVisualizer';
import AiReportPanel from './AiReportPanel';

interface EventDetailModalProps {
  cluster: EventCluster | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function EventDetailModal({ cluster, isOpen, onClose }: EventDetailModalProps) {
  if (!isOpen || !cluster) return null;

  const b = cluster.clusterBreakdown;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn">
      <div 
        className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-xl border border-zinc-800 bg-zinc-950 p-6 shadow-2xl space-y-6 font-mono"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="flex items-start justify-between border-b border-zinc-900 pb-4 gap-4">
          <div>
            <div className="flex items-center gap-2 flex-wrap text-xs">
              <span className="px-2 py-0.5 rounded font-bold uppercase bg-zinc-900 border border-zinc-800 text-indigo-400">
                EVENT CLUSTER
              </span>
              <span className="px-2 py-0.5 rounded font-bold uppercase bg-zinc-900 border border-zinc-800 text-zinc-300">
                {cluster.primaryCategory}
              </span>
              <span className="text-zinc-500">
                {cluster.storyCount} Articles across {cluster.publisherCount} Publishers
              </span>
            </div>

            <h2 className="mt-2 text-base font-bold text-zinc-100 leading-snug">
              {cluster.canonicalHeadline}
            </h2>
          </div>

          <button 
            onClick={onClose}
            className="p-1 rounded hover:bg-zinc-900 text-zinc-400 hover:text-zinc-100 transition-colors shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Disclaimer Banner */}
        <div className="p-3.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs flex items-start gap-2.5 leading-relaxed">
          <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
          <div>
            <strong className="text-amber-200 uppercase font-bold">Cluster &ne; Verification Notice:</strong> Multiple publishers reporting on the same event indicates widespread media coverage. It does NOT independently prove factual truth without multi-agent cross-verification.
          </div>
        </div>

        {/* Phase 6 Evidence-Grounded AI Intelligence Analysis Report */}
        {cluster.analysisReport && (
          <AiReportPanel report={cluster.analysisReport} />
        )}

        {/* Phase 5 Deterministic Verification Panel */}
        <VerificationPanel verification={cluster.verificationResult} />

        {/* Phase 5 Evidence Graph Visualizer */}
        <EvidenceGraphVisualizer graph={cluster.evidenceGraph} />

        {/* Cluster Summary */}
        {cluster.summary && (
          <div className="p-4 rounded-lg bg-zinc-900/40 border border-zinc-850 text-xs text-zinc-300 leading-relaxed font-sans">
            <span className="font-mono text-[10px] text-zinc-500 uppercase block mb-1 font-bold">Event Summary</span>
            {cluster.summary}
          </div>
        )}

        {/* Scout Intelligence Analysis (if detected by Scouts) */}
        {cluster.matchedScouts.length > 0 && (
          <div className="p-4 rounded-lg bg-indigo-500/5 border border-indigo-500/20 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase text-indigo-400 flex items-center gap-1.5">
                <Cpu className="w-4 h-4" />
                Scout Detections ({cluster.matchedScouts.length})
              </span>
              <span className="text-xs font-bold text-indigo-300 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                Selection Score: {cluster.topSelectionScore} / 100
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              {cluster.matchedSignals.map((sig) => (
                <span key={sig} className="px-2 py-0.5 rounded text-[10px] bg-zinc-900 border border-zinc-800 text-zinc-200 font-bold">
                  {sig}
                </span>
              ))}
            </div>

            <p className="text-[11px] text-zinc-400 italic pt-1">
              &quot;{cluster.selectionReason}&quot;
            </p>
          </div>
        )}

        {/* Event Chronological Timeline */}
        <EventTimelineComponent stories={cluster.stories} />

        {/* Clustering Rationale & Breakdown */}
        <div className="p-4 rounded-lg bg-zinc-900/30 border border-zinc-850 space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-emerald-400" />
            Deterministic Clustering Breakdown
          </span>

          <p className="text-xs text-zinc-400 italic">
            &quot;{cluster.clusterReason}&quot;
          </p>

          {b && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-[10px] pt-2 border-t border-zinc-900">
              <div className="bg-zinc-950 p-2 rounded border border-zinc-900">
                <span className="text-zinc-500 block">Headline Match</span>
                <strong className="text-emerald-400">{b.headlineSimilarity} / 40 pts</strong>
              </div>
              <div className="bg-zinc-950 p-2 rounded border border-zinc-900">
                <span className="text-zinc-500 block">Entity Overlap</span>
                <strong className="text-emerald-400">{b.entityOverlap} / 30 pts</strong>
              </div>
              <div className="bg-zinc-950 p-2 rounded border border-zinc-900">
                <span className="text-zinc-500 block">Time Window</span>
                <strong className="text-emerald-400">{b.timeProximity} / 20 pts</strong>
              </div>
              <div className="bg-zinc-950 p-2 rounded border border-zinc-900">
                <span className="text-zinc-500 block">Category Domain</span>
                <strong className="text-emerald-400">{b.categoryMatch} / 10 pts</strong>
              </div>
            </div>
          )}
        </div>

        {/* Footer Close */}
        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-xs text-zinc-300 font-bold border border-zinc-800 transition-colors"
          >
            Close Event Detail
          </button>
        </div>
      </div>
    </div>
  );
}
