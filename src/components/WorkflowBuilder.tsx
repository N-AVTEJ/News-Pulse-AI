'use client';

import React, { useState } from 'react';
import { X, GitBranch, Play, Plus, ArrowRight, CheckCircle2, History } from 'lucide-react';
import { WorkflowDefinition, WorkflowExecution } from '@/lib/platform/types';

interface WorkflowBuilderProps {
  isOpen: boolean;
  onClose: () => void;
  workflows: WorkflowDefinition[];
  executions: WorkflowExecution[];
  onExecuteWorkflow: (workflowId: string) => Promise<void>;
  onCreateWorkflow: (name: string, description: string) => Promise<void>;
}

export default function WorkflowBuilder({
  isOpen,
  onClose,
  workflows,
  executions,
  onExecuteWorkflow,
  onCreateWorkflow
}: WorkflowBuilderProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);
  const [selectedWf, setSelectedWf] = useState<WorkflowDefinition | null>(workflows[0] || null);

  if (!isOpen) return null;

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    await onCreateWorkflow(name, description);
    setName('');
    setDescription('');
    setShowCreate(false);
  };

  const handleExecute = async (wfId: string) => {
    setIsExecuting(true);
    try {
      await onExecuteWorkflow(wfId);
    } finally {
      setIsExecuting(false);
    }
  };

  const activeExecutions = executions.filter(e => e.workflowId === (selectedWf?.id || workflows[0]?.id));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn font-mono">
      <div 
        className="relative w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-xl border border-zinc-800 bg-zinc-950 p-6 shadow-2xl space-y-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-900 pb-4">
          <div className="flex items-center gap-2">
            <GitBranch className="w-5 h-5 text-indigo-400" />
            <div>
              <h2 className="text-base font-bold text-zinc-100 uppercase">Visual Workflow Automation Builder</h2>
              <p className="text-xs text-zinc-500">AUTOMATED PIPELINE TRIGGERS & ENTERPRISE ACTIONS</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowCreate(!showCreate)}
              className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-colors flex items-center gap-1.5 shadow-md shadow-indigo-600/20"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Workflow</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded hover:bg-zinc-900 text-zinc-400 hover:text-zinc-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Create Workflow Form */}
        {showCreate && (
          <form onSubmit={handleCreate} className="p-4 rounded-lg bg-zinc-900/40 border border-zinc-850 space-y-3">
            <h3 className="text-xs font-bold text-zinc-200 uppercase">Build Automated Workflow</h3>

            <div className="grid grid-cols-1 gap-3 text-xs">
              <div>
                <label className="text-zinc-400 text-[11px] block mb-1">Workflow Name</label>
                <input
                  type="text"
                  placeholder="e.g. Executive Briefing Email Dispatcher"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full px-3 py-1.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-200 focus:outline-none focus:border-zinc-700"
                />
              </div>

              <div>
                <label className="text-zinc-400 text-[11px] block mb-1">Description</label>
                <input
                  type="text"
                  placeholder="Triggers on weekly report generation and emails PDF to board members..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-1.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-200 focus:outline-none focus:border-zinc-700"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowCreate(false)}
                className="px-3 py-1.5 rounded text-xs text-zinc-400 hover:text-zinc-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs"
              >
                Save & Deploy Workflow
              </button>
            </div>
          </form>
        )}

        {/* Workflows List & Diagram */}
        <div className="space-y-4">
          {workflows.map((wf) => (
            <div 
              key={wf.id}
              onClick={() => setSelectedWf(wf)}
              className={`p-4 rounded-lg border transition-all cursor-pointer space-y-3 ${
                (selectedWf?.id || workflows[0]?.id) === wf.id ? 'border-indigo-500/50 bg-indigo-950/10' : 'border-zinc-800 bg-zinc-900/30 hover:border-zinc-700'
              }`}
            >
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-600/20 text-emerald-400 font-bold uppercase border border-emerald-500/30">
                    {wf.status}
                  </span>
                  <h3 className="text-xs font-bold text-zinc-100 font-sans">{wf.name}</h3>
                  <span className="text-[10px] text-zinc-500">v{wf.version}</span>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleExecute(wf.id);
                  }}
                  disabled={isExecuting}
                  className="px-3 py-1.5 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors flex items-center gap-1 shadow-md shadow-emerald-600/20 disabled:opacity-50"
                >
                  <Play className="w-3 h-3 fill-current" />
                  <span>Execute Workflow</span>
                </button>
              </div>

              <p className="text-xs text-zinc-400 font-sans">{wf.description}</p>

              {/* Node Flow Representation */}
              <div className="flex items-center gap-2 overflow-x-auto py-2">
                {wf.nodes.map((node, i) => (
                  <React.Fragment key={node.id}>
                    <div className="p-2.5 rounded bg-zinc-900 border border-zinc-800 min-w-[140px] text-center space-y-1 flex-shrink-0">
                      <span className="px-1.5 py-0.2 rounded text-[9px] bg-zinc-950 text-indigo-400 font-bold uppercase border border-zinc-850">
                        {node.type}
                      </span>
                      <p className="text-[11px] font-bold text-zinc-200 font-sans line-clamp-1">{node.label}</p>
                    </div>
                    {i < wf.nodes.length - 1 && (
                      <ArrowRight className="w-4 h-4 text-zinc-600 flex-shrink-0" />
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Execution Logs */}
        <div className="space-y-3 border-t border-zinc-900 pt-4">
          <h3 className="text-xs font-bold text-zinc-200 uppercase flex items-center gap-1.5">
            <History className="w-4 h-4 text-indigo-400" />
            Recent Execution Logs ({activeExecutions.length})
          </h3>

          {activeExecutions.length === 0 ? (
            <div className="p-4 text-center text-zinc-500 text-xs border border-dashed border-zinc-850 rounded-lg">
              No recent execution history recorded.
            </div>
          ) : (
            <div className="space-y-2">
              {activeExecutions.map((exec) => (
                <div key={exec.id} className="p-3 rounded-lg border border-zinc-850 bg-zinc-950 space-y-1 text-xs">
                  <div className="flex items-center justify-between text-[10px] text-zinc-500">
                    <span className="text-emerald-400 font-bold uppercase">Status: {exec.status}</span>
                    <span>Started: {new Date(exec.startedAt).toLocaleTimeString()}</span>
                  </div>
                  <div className="space-y-0.5 font-mono text-[11px] text-zinc-400 pt-1">
                    {exec.logs.map((log, i) => (
                      <div key={i}>{log}</div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Close */}
        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-xs text-zinc-300 font-bold border border-zinc-800 transition-colors"
          >
            Close Automation Builder
          </button>
        </div>
      </div>
    </div>
  );
}
