import { WorkflowNode } from '../types';

export const BUILTIN_WORKFLOW_NODES: WorkflowNode[] = [
  {
    id: 'node_trig_breaking',
    type: 'TRIGGER',
    label: 'Breaking News Trigger',
    config: { eventType: 'BREAKING_NEWS_DETECTED' }
  },
  {
    id: 'node_proc_verification',
    type: 'VERIFICATION',
    label: 'Corroboration Guard',
    config: { minScore: 70 }
  },
  {
    id: 'node_cond_is_verified',
    type: 'CONDITION',
    label: 'If Strongly Corroborated',
    config: { condition: 'verificationStatus == STRONG_CORROBORATION' }
  },
  {
    id: 'node_act_slack',
    type: 'NOTIFICATION',
    label: 'Dispatch Slack Alert',
    config: { channel: '#intel-breaking', adapter: 'SLACK' }
  },
  {
    id: 'node_act_jira',
    type: 'WEBHOOK',
    label: 'Create Jira Security Ticket',
    config: { project: 'SEC', issueType: 'Task', adapter: 'JIRA' }
  }
];
