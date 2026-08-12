'use client';

import React, { useState } from 'react';
import { X, CheckSquare, Plus, User, Clock } from 'lucide-react';
import { CollaborativeTask, TaskPriority, TaskStatus } from '@/lib/enterprise/types';

interface TaskManagerProps {
  isOpen: boolean;
  onClose: () => void;
  tasks: CollaborativeTask[];
  onCreateTask: (title: string, description: string, assigneeName: string, dueDate: string, priority: TaskPriority) => Promise<void>;
  onUpdateStatus: (taskId: string, status: TaskStatus) => Promise<void>;
  onToggleChecklist: (taskId: string, checklistItemId: string) => Promise<void>;
}

export default function TaskManager({
  isOpen,
  onClose,
  tasks,
  onCreateTask,
  onUpdateStatus,
  onToggleChecklist
}: TaskManagerProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [assigneeName, setAssigneeName] = useState('Alex Vance');
  const [dueDate, setDueDate] = useState(() => new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0]);
  const [priority, setPriority] = useState<TaskPriority>('MEDIUM');
  const [showCreate, setShowCreate] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  if (!isOpen) return null;

  const filtered = tasks.filter(t => statusFilter === 'ALL' || t.status === statusFilter);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    await onCreateTask(title, description, assigneeName, dueDate, priority);

    setTitle('');
    setDescription('');
    setShowCreate(false);
  };

  const getPriorityBadge = (p: TaskPriority) => {
    switch (p) {
      case 'HIGH': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'MEDIUM': return 'bg-sky-500/10 text-sky-400 border-sky-500/20';
      default: return 'bg-zinc-800 text-zinc-400 border-zinc-700';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn font-mono">
      <div 
        className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-xl border border-zinc-800 bg-zinc-950 p-6 shadow-2xl space-y-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-900 pb-4">
          <div className="flex items-center gap-2">
            <CheckSquare className="w-5 h-5 text-emerald-400" />
            <div>
              <h2 className="text-base font-bold text-zinc-100 uppercase">Collaborative Tasks Board</h2>
              <p className="text-xs text-zinc-500">ASSIGNED ANALYST TASKS & EVIDENCE CHECKLISTS</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowCreate(!showCreate)}
              className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors flex items-center gap-1.5 shadow-md shadow-emerald-600/20"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Task</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded hover:bg-zinc-900 text-zinc-400 hover:text-zinc-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Create Task Form */}
        {showCreate && (
          <form onSubmit={handleCreate} className="p-4 rounded-lg bg-zinc-900/40 border border-zinc-850 space-y-3">
            <h3 className="text-xs font-bold text-zinc-200 uppercase">Assign New Analyst Task</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="text-zinc-400 text-[11px] block mb-1">Task Title</label>
                <input
                  type="text"
                  placeholder="e.g. Cross-reference TSMC foundry capacity filings"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="w-full px-3 py-1.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-200 focus:outline-none focus:border-zinc-700"
                />
              </div>

              <div>
                <label className="text-zinc-400 text-[11px] block mb-1">Assignee Analyst</label>
                <input
                  type="text"
                  value={assigneeName}
                  onChange={(e) => setAssigneeName(e.target.value)}
                  required
                  className="w-full px-3 py-1.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-200 focus:outline-none focus:border-zinc-700"
                />
              </div>

              <div>
                <label className="text-zinc-400 text-[11px] block mb-1">Due Date</label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  required
                  className="w-full px-3 py-1.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-200 focus:outline-none focus:border-zinc-700"
                />
              </div>

              <div>
                <label className="text-zinc-400 text-[11px] block mb-1">Priority</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as TaskPriority)}
                  className="w-full px-3 py-1.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-200 focus:outline-none focus:border-zinc-700"
                >
                  <option value="HIGH">HIGH</option>
                  <option value="MEDIUM">MEDIUM</option>
                  <option value="LOW">LOW</option>
                </select>
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
                className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs"
              >
                Assign Task
              </button>
            </div>
          </form>
        )}

        {/* Status Filter Bar */}
        <div className="flex items-center gap-2 text-xs border-b border-zinc-900 pb-3 overflow-x-auto">
          <span className="text-zinc-500 uppercase font-bold">Filter Task Status:</span>
          {['ALL', 'TODO', 'IN_PROGRESS', 'REVIEW', 'DONE'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase transition-colors ${
                statusFilter === st ? 'bg-emerald-600 text-white' : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
              }`}
            >
              {st.replace(/_/g, ' ')}
            </button>
          ))}
        </div>

        {/* Tasks List */}
        <div className="space-y-3">
          {filtered.length === 0 ? (
            <div className="p-8 text-center text-zinc-500 text-xs border border-dashed border-zinc-850 rounded-lg">
              No tasks assigned matching status filter &quot;{statusFilter}&quot;.
            </div>
          ) : (
            filtered.map((task) => (
              <div key={task.id} className="p-4 rounded-lg border border-zinc-800 bg-zinc-900/30 space-y-3">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${getPriorityBadge(task.priority)}`}>
                      {task.priority}
                    </span>
                    <h3 className="text-xs font-bold text-zinc-100 font-sans">{task.title}</h3>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-zinc-500 uppercase">Status:</span>
                    <select
                      value={task.status}
                      onChange={(e) => onUpdateStatus(task.id, e.target.value as TaskStatus)}
                      className="bg-zinc-900 border border-zinc-800 text-emerald-400 font-bold text-[10px] px-2 py-0.5 rounded cursor-pointer uppercase"
                    >
                      <option value="TODO">TODO</option>
                      <option value="IN_PROGRESS">IN PROGRESS</option>
                      <option value="REVIEW">REVIEW</option>
                      <option value="DONE">DONE</option>
                    </select>
                  </div>
                </div>

                {task.description && (
                  <p className="text-xs text-zinc-400 font-sans leading-relaxed">{task.description}</p>
                )}

                {/* Checklist items */}
                {task.checklist.length > 0 && (
                  <div className="space-y-1 text-xs pt-1">
                    <span className="text-[10px] text-zinc-500 uppercase block font-bold">Task Checklist:</span>
                    {task.checklist.map(item => (
                      <label key={item.id} className="flex items-center gap-2 text-zinc-300 cursor-pointer font-sans text-[11px]">
                        <input
                          type="checkbox"
                          checked={item.done}
                          onChange={() => onToggleChecklist(task.id, item.id)}
                          className="rounded bg-zinc-900 border-zinc-700 text-emerald-500 focus:ring-0"
                        />
                        <span className={item.done ? 'line-through text-zinc-500' : ''}>{item.text}</span>
                      </label>
                    ))}
                  </div>
                )}

                {/* Footer details */}
                <div className="flex items-center justify-between text-[10px] text-zinc-500 border-t border-zinc-900 pt-2 flex-wrap gap-2">
                  <span className="flex items-center gap-1">
                    <User className="w-3 h-3 text-indigo-400" />
                    Assignee: <strong className="text-zinc-300">{task.assigneeName}</strong>
                  </span>

                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-zinc-600" />
                    Due: <strong className="text-zinc-300">{task.dueDate}</strong>
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Close */}
        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-xs text-zinc-300 font-bold border border-zinc-800 transition-colors"
          >
            Close Tasks Board
          </button>
        </div>
      </div>
    </div>
  );
}
