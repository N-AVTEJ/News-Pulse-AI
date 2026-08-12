import { CollaborativeTask, TaskPriority, TaskStatus } from './types';
import { logAuditEvent } from './audit';

const tasksStore: CollaborativeTask[] = [
  {
    id: 'tsk_001',
    title: 'Analyze OpenAI Security Court Motion',
    description: 'Review official filings in trade secret dispute and update evidence graph.',
    status: 'IN_PROGRESS',
    priority: 'HIGH',
    assigneeId: 'mem_analyst_01',
    assigneeName: 'Alex Vance',
    dueDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
    linkedInvestigationId: 'inv_001_openai_trade_secrets',
    checklist: [
      { id: 'chk_1', text: 'Extract core claim figures', done: true },
      { id: 'chk_2', text: 'Cross-reference TechCrunch report', done: false }
    ],
    createdAt: new Date().toISOString()
  },
  {
    id: 'tsk_002',
    title: 'Synthesize TSMC Foundry Report',
    description: 'Verify quarterly semiconductor output statements.',
    status: 'TODO',
    priority: 'MEDIUM',
    assigneeId: 'mem_researcher_01',
    assigneeName: 'Marcus Brody',
    dueDate: new Date(Date.now() + 86400000 * 5).toISOString().split('T')[0],
    linkedInvestigationId: 'inv_002_semi_datacenter',
    checklist: [
      { id: 'chk_3', text: 'Verify primary press release', done: false }
    ],
    createdAt: new Date().toISOString()
  }
];

export function getTasks(statusFilter?: string): CollaborativeTask[] {
  if (statusFilter && statusFilter !== 'ALL') {
    return tasksStore.filter(t => t.status === statusFilter);
  }
  return tasksStore;
}

export function createTask(
  title: string,
  description: string,
  assigneeId: string,
  assigneeName: string,
  dueDate: string,
  priority: TaskPriority = 'MEDIUM',
  linkedInvestigationId?: string,
  linkedClusterId?: string
): CollaborativeTask {
  const task: CollaborativeTask = {
    id: `tsk_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    title,
    description,
    status: 'TODO',
    priority,
    assigneeId,
    assigneeName,
    dueDate,
    linkedInvestigationId,
    linkedClusterId,
    checklist: [],
    createdAt: new Date().toISOString()
  };

  tasksStore.unshift(task);
  logAuditEvent('mem_owner_01', 'Sarah Connor', 'OWNER', 'ws_ent_ai', 'CREATE_TASK', task.id, undefined, task.title);
  return task;
}

export function updateTaskStatus(taskId: string, newStatus: TaskStatus): CollaborativeTask {
  const task = tasksStore.find(t => t.id === taskId);
  if (!task) throw new Error(`Task ${taskId} not found.`);

  const oldStatus = task.status;
  task.status = newStatus;

  logAuditEvent(task.assigneeId, task.assigneeName, 'ANALYST', 'ws_ent_ai', 'UPDATE_TASK_STATUS', task.id, oldStatus, newStatus);
  return task;
}

export function toggleChecklistItem(taskId: string, checklistItemId: string): CollaborativeTask {
  const task = tasksStore.find(t => t.id === taskId);
  if (!task) throw new Error(`Task ${taskId} not found.`);

  const item = task.checklist.find(c => c.id === checklistItemId);
  if (item) {
    item.done = !item.done;
  }
  return task;
}
