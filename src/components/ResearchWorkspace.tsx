'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  Compass,
  Search,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Layers,
  ArrowRight,
  ShieldCheck,
  FileText,
  GitBranch,
  RefreshCw,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Sliders,
  Send,
  StopCircle
} from 'lucide-react';
import { ResearchRun, ResearchReport, ResearchFinding } from '@/lib/research/types';
import { Role } from '@/lib/enterprise/types';

interface ResearchWorkspaceProps {
  isOpen: boolean;
  onClose: () => void;
  userRole?: Role;
  onCreateInvestigation?: (title: string, description: string, priority: 'HIGH' | 'CRITICAL' | 'MEDIUM', tags: string[]) => Promise<void>;
}

export default function ResearchWorkspace({
  isOpen,
  onClose,
  userRole = 'ANALYST',
  onCreateInvestigation
}: ResearchWorkspaceProps) {
  const [question, setQuestion] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [runs, setRuns] = useState<ResearchRun[]>([]);
  const [selectedRun, setSelectedRun] = useState<ResearchRun | null>(null);
  const [activeTab, setActiveTab] = useState<'REPORT' | 'TASKS' | 'CONTRADICTIONS' | 'QUALITY'>('REPORT');
  const [expandedFindingId, setExpandedFindingId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [investigationSuccess, setInvestigationSuccess] = useState<string | null>(null);

  const sampleQuestions = [
    'What is the impact of generative AI chip supply constraints on enterprise cloud infrastructure?',
    'What antitrust regulations or court rulings affect Big Tech acquisitions in 2025?',
    'How will clean energy grid demands impact semiconductor fabrication facilities?',
    'What are the latest benchmarks and safety evaluations for frontier multi-modal reasoning models?'
  ];

  // Fetch runs on load
  useEffect(() => {
    if (!isOpen) return;
    loadRuns();
  }, [isOpen]);

  const loadRuns = async () => {
    try {
      const res = await fetch('/api/research', {
        headers: { 'x-user-role': userRole }
      });
      if (res.ok) {
        const data = await res.json();
        setRuns(data.runs || []);
        if (data.runs && data.runs.length > 0 && !selectedRun) {
          setSelectedRun(data.runs[0]);
        }
      }
    } catch (err) {
      console.error('Failed to load research runs:', err);
    }
  };

  const handleStartResearch = async (qToRun?: string) => {
    const q = (qToRun || question).trim();
    if (q.length < 5) {
      setErrorMsg('Please enter a research question with at least 5 characters.');
      return;
    }

    setErrorMsg(null);
    setIsRunning(true);
    setInvestigationSuccess(null);

    try {
      const res = await fetch('/api/research', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-role': userRole
        },
        body: JSON.stringify({
          question: q,
          workspaceId: 'workspace-default',
          organizationId: 'org-enterprise-pulse',
          userRole
        })
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || errData.details || 'Failed to execute autonomous research');
      }

      const data = await res.json();
      if (data.run) {
        setRuns(prev => [data.run, ...prev.filter(r => r.id !== data.run.id)]);
        setSelectedRun(data.run);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unknown research error';
      setErrorMsg(msg);
    } finally {
      setIsRunning(false);
    }
  };

  const handleCancelRun = async () => {
    if (!selectedRun) return;
    try {
      const res = await fetch(`/api/research/${selectedRun.id}/cancel`, {
        method: 'POST',
        headers: { 'x-user-role': userRole }
      });
      if (res.ok) {
        const data = await res.json();
        if (data.run) {
          setSelectedRun(data.run);
          setRuns(prev => prev.map(r => r.id === data.run.id ? data.run : r));
        }
      }
    } catch (err) {
      console.error('Failed to cancel run:', err);
    }
  };

  const handleConvertToInvestigation = async () => {
    if (!selectedRun?.report || !onCreateInvestigation) return;
    try {
      await onCreateInvestigation(
        `Investigation: ${selectedRun.question.slice(0, 80)}`,
        `Autonomous Research Brief:\n${selectedRun.report.executiveSummary}`,
        'HIGH',
        ['Autonomous Research', 'Deep Intelligence']
      );
      setInvestigationSuccess('Successfully converted research report into an Enterprise Investigation!');
      setTimeout(() => setInvestigationSuccess(null), 5000);
    } catch (err) {
      console.error('Failed to convert to investigation:', err);
    }
  };

  if (!isOpen) return null;

  const currentReport: ResearchReport | undefined = selectedRun?.report;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-fadeIn font-mono">
      <div className="relative w-full max-w-7xl h-[92vh] bg-zinc-950 border border-cyan-900/40 rounded-xl shadow-2xl flex flex-col overflow-hidden text-zinc-100">
        
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-900 bg-zinc-900/50">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-cyan-950/60 border border-cyan-500/30 text-cyan-400">
              <Compass className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-zinc-100 tracking-wide">
                  AUTONOMOUS RESEARCH & DEEP INTELLIGENCE
                </h2>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-950/80 border border-cyan-500/40 text-cyan-300">
                  PHASE 14
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-zinc-800 text-zinc-400 border border-zinc-700">
                  ROLE: {userRole}
                </span>
              </div>
              <p className="text-xs text-zinc-400 font-sans mt-0.5">
                Decomposes strategic questions, queries verified evidence graphs, validates authentic citations, and evaluates publication quality.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Question Input Section */}
        <div className="px-6 py-4 border-b border-zinc-900 bg-zinc-950/80 space-y-3">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-3 w-4 h-4 text-zinc-500" />
              <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !isRunning) {
                    handleStartResearch();
                  }
                }}
                placeholder="Enter strategic research question (e.g. 'What is the impact of AI chip supply bottlenecks on cloud compute?')..."
                className="w-full pl-10 pr-4 py-2.5 bg-zinc-900/90 border border-zinc-800 rounded-lg text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-cyan-500/60 transition-colors"
                disabled={isRunning}
              />
            </div>

            <button
              onClick={() => handleStartResearch()}
              disabled={isRunning || question.trim().length < 5}
              className="px-5 py-2.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 disabled:bg-zinc-800 disabled:text-zinc-600 disabled:cursor-not-allowed text-zinc-950 font-bold text-xs transition-colors flex items-center gap-2 whitespace-nowrap shadow-md shadow-cyan-950/30"
            >
              {isRunning ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Researching...</span>
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>Launch Research</span>
                </>
              )}
            </button>

            {isRunning && selectedRun && selectedRun.status !== 'COMPLETED' && (
              <button
                onClick={handleCancelRun}
                className="px-3 py-2.5 rounded-lg bg-red-950/40 hover:bg-red-900/60 border border-red-500/40 text-red-300 font-bold text-xs transition-colors flex items-center gap-1.5"
              >
                <StopCircle className="w-3.5 h-3.5" />
                <span>Cancel</span>
              </button>
            )}
          </div>

          {/* Prompt Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs text-zinc-400 font-sans">
            <span className="text-[11px] font-mono text-zinc-500 whitespace-nowrap">EXAMPLE PROMPTS:</span>
            {sampleQuestions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setQuestion(q);
                  handleStartResearch(q);
                }}
                disabled={isRunning}
                className="px-2.5 py-1 rounded bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-cyan-300 whitespace-nowrap text-xs transition-colors"
              >
                {q.slice(0, 48)}...
              </button>
            ))}
          </div>

          {errorMsg && (
            <div className="p-2.5 rounded bg-red-950/40 border border-red-500/40 text-red-300 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {investigationSuccess && (
            <div className="p-2.5 rounded bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              <span>{investigationSuccess}</span>
            </div>
          )}
        </div>

        {/* Main Content Layout: Sidebar Runs + Workspace View */}
        <div className="flex flex-1 overflow-hidden">
          
          {/* Left History Sidebar */}
          <div className="w-80 border-r border-zinc-900 bg-zinc-950/50 flex flex-col overflow-hidden hidden md:flex">
            <div className="p-3 border-b border-zinc-900 flex items-center justify-between">
              <span className="text-xs font-bold text-zinc-400">RESEARCH RUNS ({runs.length})</span>
              <button
                onClick={loadRuns}
                className="p-1 rounded text-zinc-500 hover:text-zinc-300 transition-colors"
                title="Reload history"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-2 space-y-2">
              {runs.map((r) => {
                const isSelected = selectedRun?.id === r.id;
                return (
                  <div
                    key={r.id}
                    onClick={() => setSelectedRun(r)}
                    className={`p-3 rounded-lg border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-cyan-950/30 border-cyan-500/40 text-zinc-100 shadow-sm'
                        : 'bg-zinc-900/40 border-zinc-800/60 hover:bg-zinc-900 text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                        r.status === 'COMPLETED' ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-500/30' :
                        r.status === 'CANCELLED' ? 'bg-zinc-800 text-zinc-400' :
                        r.status === 'FAILED' ? 'bg-red-950/60 text-red-300 border border-red-500/30' :
                        'bg-amber-950/60 text-amber-300 border border-amber-500/30 animate-pulse'
                      }`}>
                        {r.status}
                      </span>
                      <span className="text-[10px] text-zinc-500 font-mono">
                        {r.startedAt ? new Date(r.startedAt).toLocaleTimeString() : ''}
                      </span>
                    </div>

                    <p className="text-xs font-sans line-clamp-2 text-zinc-200 font-medium">
                      {r.question}
                    </p>

                    <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-zinc-800/40 text-[10px] text-zinc-500">
                      <span>Tasks: {r.tasks.length}</span>
                      <span>Findings: {r.findings.length}</span>
                    </div>
                  </div>
                );
              })}

              {runs.length === 0 && (
                <div className="p-6 text-center text-xs text-zinc-600 font-sans">
                  No research runs executed yet. Launch your first query above!
                </div>
              )}
            </div>
          </div>

          {/* Right Workspace View Area */}
          <div className="flex-1 flex flex-col overflow-hidden bg-zinc-950">
            
            {selectedRun ? (
              <>
                {/* Active Run Sub-Navigation & Metadata */}
                <div className="px-6 py-3 border-b border-zinc-900 bg-zinc-900/30 flex items-center justify-between gap-4 flex-wrap">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-zinc-400 font-mono">RUN:</span>
                    <span className="text-xs font-bold text-cyan-400 font-mono">{selectedRun.id}</span>
                    {selectedRun.durationMs && (
                      <span className="text-[11px] text-zinc-500">
                        ({(selectedRun.durationMs / 1000).toFixed(1)}s)
                      </span>
                    )}
                  </div>

                  {/* Tabs */}
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setActiveTab('REPORT')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                        activeTab === 'REPORT'
                          ? 'bg-cyan-600 text-zinc-950'
                          : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200'
                      }`}
                    >
                      Synthesis Report
                    </button>
                    <button
                      onClick={() => setActiveTab('TASKS')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                        activeTab === 'TASKS'
                          ? 'bg-cyan-600 text-zinc-950'
                          : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200'
                      }`}
                    >
                      Task Plan ({selectedRun.tasks.length})
                    </button>
                    <button
                      onClick={() => setActiveTab('CONTRADICTIONS')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                        activeTab === 'CONTRADICTIONS'
                          ? 'bg-cyan-600 text-zinc-950'
                          : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200'
                      }`}
                    >
                      Contradictions ({selectedRun.report?.contradictions.length || 0})
                    </button>
                    <button
                      onClick={() => setActiveTab('QUALITY')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                        activeTab === 'QUALITY'
                          ? 'bg-cyan-600 text-zinc-950'
                          : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200'
                      }`}
                    >
                      Quality Gate
                    </button>

                    {onCreateInvestigation && currentReport && (
                      <button
                        onClick={handleConvertToInvestigation}
                        className="ml-2 px-3 py-1.5 rounded-lg bg-indigo-950/60 hover:bg-indigo-900/80 border border-indigo-500/40 text-indigo-300 font-bold text-xs transition-colors flex items-center gap-1.5"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>Export to Investigation</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Tab Contents */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                  
                  {activeTab === 'REPORT' && currentReport && (
                    <div className="space-y-6 font-sans">
                      
                      {/* Quality Flag Warning if review required */}
                      {currentReport.reviewRequired && (
                        <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-500/40 text-amber-200 flex items-start gap-3">
                          <AlertTriangle className="w-5 h-5 text-amber-400 mt-0.5 flex-shrink-0" />
                          <div className="space-y-1 text-xs">
                            <span className="font-bold font-mono tracking-wider text-amber-300">
                              ANALYST REVIEW REQUIRED (QUALITY GATE FLAG)
                            </span>
                            <ul className="list-disc pl-4 space-y-0.5 text-zinc-300">
                              {currentReport.reviewReasons.map((r, i) => (
                                <li key={i}>{r}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      )}

                      {/* Executive Summary Card */}
                      <div className="p-5 rounded-xl bg-zinc-900/40 border border-zinc-800 space-y-3">
                        <div className="flex items-center justify-between border-b border-zinc-800/80 pb-2">
                          <span className="text-xs font-mono font-bold text-cyan-400 flex items-center gap-1.5">
                            <Layers className="w-4 h-4" />
                            EXECUTIVE SYNTHESIS
                          </span>
                          <span className="text-xs text-zinc-500 font-mono">
                            {new Date(currentReport.generatedAt).toLocaleString()}
                          </span>
                        </div>

                        <p className="text-sm text-zinc-200 leading-relaxed font-sans whitespace-pre-line">
                          {currentReport.executiveSummary}
                        </p>

                        <div className="pt-2 border-t border-zinc-800/60 flex items-center gap-4 text-xs font-mono text-zinc-400">
                          <span>SCOPE: {currentReport.researchScope}</span>
                        </div>
                      </div>

                      {/* Key Findings Section */}
                      <div className="space-y-3">
                        <h3 className="text-xs font-mono font-bold text-zinc-300 flex items-center gap-2">
                          <span>DOCUMENTED FINDINGS & EVIDENCE ANCHORS ({currentReport.keyFindings.length})</span>
                        </h3>

                        <div className="space-y-3">
                          {currentReport.keyFindings.map((finding) => {
                            const isExpanded = expandedFindingId === finding.id;
                            return (
                              <div
                                key={finding.id}
                                className="p-4 rounded-xl bg-zinc-900/30 border border-zinc-800 hover:border-zinc-700 transition-colors space-y-2.5"
                              >
                                <div className="flex items-start justify-between gap-3">
                                  <div className="flex items-center gap-2">
                                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                                      finding.statementType === 'FACT'
                                        ? 'bg-blue-950/60 text-blue-300 border border-blue-500/30'
                                        : 'bg-purple-950/60 text-purple-300 border border-purple-500/30'
                                    }`}>
                                      {finding.statementType === 'FACT' ? 'SOURCED FACT' : 'ANALYTICAL INFERENCE'}
                                    </span>

                                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-zinc-800 text-zinc-400">
                                      CONFIDENCE: {finding.confidenceScore}%
                                    </span>
                                  </div>

                                  <button
                                    onClick={() => setExpandedFindingId(isExpanded ? null : finding.id)}
                                    className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-mono"
                                  >
                                    <span>{finding.supportingCitations.length} Citations</span>
                                    {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                                  </button>
                                </div>

                                <p className="text-sm font-sans text-zinc-100 font-medium leading-relaxed">
                                  {finding.claim}
                                </p>

                                {finding.uncertaintyNotes && (
                                  <p className="text-xs text-amber-400/90 font-mono italic">
                                    Note: {finding.uncertaintyNotes}
                                  </p>
                                )}

                                {/* Collapsible Citations */}
                                {isExpanded && (
                                  <div className="mt-3 pt-3 border-t border-zinc-800 space-y-2">
                                    <span className="text-[11px] font-mono font-bold text-zinc-400">SUPPORTING CITATIONS:</span>
                                    {finding.supportingCitations.map((cite, cIdx) => (
                                      <div
                                        key={cIdx}
                                        className="p-3 rounded-lg bg-zinc-950 border border-zinc-800/80 text-xs space-y-1.5"
                                      >
                                        <div className="flex items-center justify-between text-zinc-400 font-mono text-[11px]">
                                          <span className="font-bold text-zinc-300">{cite.publisherName}</span>
                                          <span>{cite.publishedAt ? new Date(cite.publishedAt).toLocaleDateString() : ''}</span>
                                        </div>
                                        <p className="text-zinc-200 font-sans font-medium">{cite.headline}</p>
                                        <p className="text-zinc-400 italic bg-zinc-900/60 p-2 rounded border border-zinc-800">
                                          "{cite.quoteSnippet}"
                                        </p>
                                        {cite.articleUrl && (
                                          <a
                                            href={cite.articleUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-cyan-400 hover:underline flex items-center gap-1 text-[11px] font-mono pt-1"
                                          >
                                            <span>Read Original Source</span>
                                            <ExternalLink className="w-3 h-3" />
                                          </a>
                                        )}
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Strategic Implications & Unresolved Questions */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 rounded-xl bg-zinc-900/20 border border-zinc-800 space-y-2">
                          <span className="text-xs font-mono font-bold text-indigo-400">
                            STRATEGIC IMPLICATIONS
                          </span>
                          <ul className="list-disc pl-4 space-y-1 text-xs text-zinc-300">
                            {currentReport.potentialImplications.map((imp, i) => (
                              <li key={i}>{imp}</li>
                            ))}
                          </ul>
                        </div>

                        <div className="p-4 rounded-xl bg-zinc-900/20 border border-zinc-800 space-y-2">
                          <span className="text-xs font-mono font-bold text-amber-400">
                            UNRESOLVED QUESTIONS FOR ANALYSTS
                          </span>
                          <ul className="list-disc pl-4 space-y-1 text-xs text-zinc-300">
                            {currentReport.unresolvedQuestions.map((uq, i) => (
                              <li key={i}>{uq}</li>
                            ))}
                          </ul>
                        </div>
                      </div>

                    </div>
                  )}

                  {/* Tasks Tab */}
                  {activeTab === 'TASKS' && (
                    <div className="space-y-4 font-sans">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono font-bold text-zinc-400">
                          DECOMPOSED RESEARCH TASKS (BOUNDED CONCURRENCY $\le$ 3)
                        </span>
                      </div>

                      <div className="space-y-3">
                        {selectedRun.tasks.map((task) => (
                          <div
                            key={task.id}
                            className="p-4 rounded-xl bg-zinc-900/40 border border-zinc-800 space-y-2"
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-mono font-bold text-cyan-400">
                                {task.topic}
                              </span>
                              <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                                task.status === 'COMPLETED' ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-500/30' :
                                task.status === 'RUNNING' ? 'bg-cyan-950/60 text-cyan-300 border border-cyan-500/30 animate-pulse' :
                                'bg-zinc-800 text-zinc-400'
                              }`}>
                                {task.status}
                              </span>
                            </div>

                            <p className="text-sm text-zinc-100 font-medium">
                              {task.question}
                            </p>

                            <div className="flex items-center gap-3 text-xs font-mono text-zinc-500 pt-1 border-t border-zinc-800/40">
                              <span>Evidence: {task.requiredEvidenceType}</span>
                              {task.targetEntities.length > 0 && (
                                <span>Entities: {task.targetEntities.join(', ')}</span>
                              )}
                              {task.findingsCount !== undefined && (
                                <span>Findings: {task.findingsCount}</span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Contradictions Tab */}
                  {activeTab === 'CONTRADICTIONS' && currentReport && (
                    <div className="space-y-4 font-sans">
                      <span className="text-xs font-mono font-bold text-zinc-400">
                        DETECTED CONTRADICTIONS & SINGLE-SOURCE DEPENDENCIES
                      </span>

                      {currentReport.contradictions.length > 0 ? (
                        <div className="space-y-3">
                          {currentReport.contradictions.map((contra) => (
                            <div
                              key={contra.id}
                              className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/40 space-y-2"
                            >
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-mono font-bold text-amber-300">
                                  {contra.topic}
                                </span>
                                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-amber-900/40 text-amber-300 border border-amber-500/30">
                                  {contra.resolutionStatus}
                                </span>
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                                <div className="p-2.5 rounded bg-zinc-950/80 border border-zinc-800 space-y-1">
                                  <span className="text-zinc-400 font-mono font-bold">REPORT A:</span>
                                  <p className="text-zinc-200">{contra.claimA}</p>
                                </div>
                                <div className="p-2.5 rounded bg-zinc-950/80 border border-zinc-800 space-y-1">
                                  <span className="text-zinc-400 font-mono font-bold">REPORT B:</span>
                                  <p className="text-zinc-200">{contra.claimB}</p>
                                </div>
                              </div>
                              <p className="text-xs text-zinc-400 font-mono">
                                Note: {contra.explanation}
                              </p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="p-6 rounded-xl bg-zinc-900/30 border border-zinc-800 text-center text-xs text-zinc-400">
                          <CheckCircle2 className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
                          No direct reporting contradictions detected across corroborated event clusters.
                        </div>
                      )}

                      {/* Evidence Gaps */}
                      {currentReport.evidenceGaps.length > 0 && (
                        <div className="pt-4 space-y-3">
                          <span className="text-xs font-mono font-bold text-zinc-400">
                            EVIDENCE GAPS & SYNDICATION ECHOES ({currentReport.evidenceGaps.length})
                          </span>
                          <div className="space-y-2">
                            {currentReport.evidenceGaps.map((gap) => (
                              <div
                                key={gap.id}
                                className="p-3 rounded-lg bg-zinc-900/30 border border-zinc-800 text-xs space-y-1"
                              >
                                <span className="font-mono font-bold text-zinc-300">{gap.topic || gap.gapType}</span>
                                <p className="text-zinc-400">{gap.description}</p>
                                {gap.suggestedAction && (
                                  <p className="text-cyan-400 font-mono text-[11px]">Action: {gap.suggestedAction}</p>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Quality Gate Tab */}
                  {activeTab === 'QUALITY' && currentReport && currentReport.qualityGateResult && (
                    <div className="space-y-4 font-mono">
                      <div className="p-5 rounded-xl bg-zinc-900/40 border border-zinc-800 space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-bold text-zinc-200">
                            PHASE 13 PUBLICATION QUALITY GATE AUDIT
                          </span>
                          <span className={`px-3 py-1 rounded text-xs font-bold ${
                            currentReport.qualityGateResult.passed
                              ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/40'
                              : 'bg-amber-950/80 text-amber-300 border border-amber-500/40'
                          }`}>
                            DECISION: {currentReport.qualityGateResult.decision}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div className="p-3 rounded-lg bg-zinc-950 border border-zinc-800 space-y-1">
                            <span className="text-[11px] text-zinc-500">OVERALL SCORE</span>
                            <p className="text-xl font-bold text-cyan-400">
                              {currentReport.qualityGateResult.overallScore}/100
                            </p>
                          </div>
                          <div className="p-3 rounded-lg bg-zinc-950 border border-zinc-800 space-y-1">
                            <span className="text-[11px] text-zinc-500">GROUNDING SCORE</span>
                            <p className="text-xl font-bold text-emerald-400">
                              {currentReport.qualityGateResult.grounding.score}/100
                            </p>
                          </div>
                          <div className="p-3 rounded-lg bg-zinc-950 border border-zinc-800 space-y-1">
                            <span className="text-[11px] text-zinc-500">CITATIONS STATUS</span>
                            <p className="text-xl font-bold text-indigo-400">
                              {currentReport.qualityGateResult.citations.status}
                            </p>
                          </div>
                        </div>

                        <div className="pt-2 border-t border-zinc-800 space-y-1.5 text-xs text-zinc-400">
                          <span className="font-bold text-zinc-300">AUDIT SUMMARY:</span>
                          <ul className="list-disc pl-4 space-y-0.5">
                            {currentReport.qualityGateResult.reasons.map((reason, idx) => (
                              <li key={idx}>{reason}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}

                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-4">
                <Compass className="w-12 h-12 text-zinc-700" />
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-zinc-300 font-mono">NO ACTIVE RESEARCH RUN SELECTED</h3>
                  <p className="text-xs text-zinc-500 font-sans max-w-md">
                    Launch a new query using the input bar above, or select an existing investigation run from the sidebar.
                  </p>
                </div>
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
}
