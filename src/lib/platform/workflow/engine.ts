import { eventBus } from '../eventBus';
import { WorkflowDefinition, WorkflowExecution } from '../types';

let workflowsStore: WorkflowDefinition[] = [
  {
    id: 'wf_breaking_alert_flow',
    name: 'Breaking News Slack & Jira Dispatch',
    description: 'Automated workflow that sends Slack alerts & files Jira tickets for verified breaking events.',
    version: 1,
    nodes: [
      { id: 'node_trig_breaking', type: 'TRIGGER', label: 'Breaking News Trigger', config: { topic: 'EventClusterCreated' } },
      { id: 'node_proc_verification', type: 'VERIFICATION', label: 'Corroboration Engine', config: { minScore: 70 } },
      { id: 'node_cond_verified', type: 'CONDITION', label: 'If Corroborated', config: { rule: 'verificationStatus == STRONG_CORROBORATION' } },
      { id: 'node_act_slack', type: 'NOTIFICATION', label: 'Dispatch Slack Alert', config: { channel: '#intel-breaking' } }
    ],
    edges: [
      { source: 'node_trig_breaking', target: 'node_proc_verification' },
      { source: 'node_proc_verification', target: 'node_cond_verified' },
      { source: 'node_cond_verified', target: 'node_act_slack', condition: 'TRUE' }
    ],
    status: 'ACTIVE',
    createdAt: new Date(Date.now() - 86400000).toISOString()
  }
];

let executionsStore: WorkflowExecution[] = [
  {
    id: 'exec_001',
    workflowId: 'wf_breaking_alert_flow',
    startedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    completedAt: new Date(Date.now() - 3600000 * 2 + 1200).toISOString(),
    status: 'SUCCESS',
    logs: [
      '[TRIGGER] Received event EventClusterCreated: evt_arstechnica_ca907637a367',
      '[VERIFICATION] Corroboration score 85% passed threshold 70%',
      '[CONDITION] Condition "verificationStatus == STRONG_CORROBORATION" evaluated to TRUE',
      '[ACTION] Dispatched Slack alert to channel #intel-breaking successfully'
    ]
  }
];

export function getWorkflows(): WorkflowDefinition[] {
  return workflowsStore;
}

export function getWorkflowExecutions(workflowId?: string): WorkflowExecution[] {
  if (workflowId) {
    return executionsStore.filter(e => e.workflowId === workflowId);
  }
  return executionsStore;
}

export function createWorkflow(name: string, description: string, nodes: WorkflowDefinition['nodes'], edges: WorkflowDefinition['edges']): WorkflowDefinition {
  const wf: WorkflowDefinition = {
    id: `wf_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    name,
    description,
    version: 1,
    nodes,
    edges,
    status: 'ACTIVE',
    createdAt: new Date().toISOString()
  };

  workflowsStore.unshift(wf);
  return wf;
}

export function executeWorkflow(workflowId: string, payload?: Record<string, unknown>): WorkflowExecution {
  const wf = workflowsStore.find(w => w.id === workflowId);
  if (!wf) throw new Error(`Workflow ${workflowId} not found.`);

  const logs: string[] = [`[START] Executing workflow "${wf.name}" v${wf.version}`];

  for (const node of wf.nodes) {
    logs.push(`[NODE:${node.type}] Processing node "${node.label}"...`);
  }

  logs.push('[COMPLETE] Workflow execution completed successfully.');

  const execution: WorkflowExecution = {
    id: `exec_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    workflowId,
    startedAt: new Date().toISOString(),
    completedAt: new Date().toISOString(),
    status: 'SUCCESS',
    logs,
    triggerPayload: payload
  };

  executionsStore.unshift(execution);
  eventBus.publish('NotificationSent', { workflowId, executionId: execution.id });
  return execution;
}
