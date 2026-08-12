import { Investigation, InvestigationPriority, InvestigationStatus } from './types';
import { logAuditEvent } from './audit';

let investigationsStore: Investigation[] = [
  {
    id: 'inv_001_openai_trade_secrets',
    title: 'OpenAI vs Apple Trade Secrets & Security Dispute',
    description: 'Investigation into security practices, trade secret claims, & enterprise AI risks.',
    status: 'ACTIVE',
    priority: 'HIGH',
    createdBy: 'mem_owner_01',
    assignedTo: ['mem_analyst_01'],
    clusterIds: ['evt_arstechnica_ca907637a367'],
    evidenceCount: 3,
    tags: ['OpenAI', 'Apple', 'Trade Secrets', 'Security'],
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'inv_002_semi_datacenter',
    title: 'Next-Gen GPU Datacenter Supply Chain Vulnerabilities',
    description: 'Tracking foundry capacity, energy requirements, and GPU export controls.',
    status: 'OPEN',
    priority: 'CRITICAL',
    createdBy: 'mem_analyst_01',
    assignedTo: ['mem_analyst_01', 'mem_researcher_01'],
    clusterIds: [],
    evidenceCount: 1,
    tags: ['Semiconductors', 'Nvidia', 'TSMC', 'Hardware'],
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export function getInvestigations(statusFilter?: string): Investigation[] {
  if (statusFilter && statusFilter !== 'ALL') {
    return investigationsStore.filter(i => i.status === statusFilter);
  }
  return investigationsStore;
}

export function getInvestigation(id: string): Investigation | undefined {
  return investigationsStore.find(i => i.id === id);
}

export function createInvestigation(
  title: string,
  description: string,
  priority: InvestigationPriority = 'HIGH',
  createdBy: string = 'mem_analyst_01',
  assignedTo: string[] = [],
  tags: string[] = []
): Investigation {
  const inv: Investigation = {
    id: `inv_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    title,
    description,
    status: 'OPEN',
    priority,
    createdBy,
    assignedTo,
    clusterIds: [],
    evidenceCount: 0,
    tags,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  investigationsStore.unshift(inv);
  logAuditEvent('mem_analyst_01', 'Alex Vance', 'ANALYST', 'ws_ent_ai', 'CREATE_INVESTIGATION', inv.id, undefined, inv.title);
  return inv;
}

export function updateInvestigationStatus(
  id: string,
  newStatus: InvestigationStatus,
  userId: string = 'mem_analyst_01',
  userName: string = 'Alex Vance'
): Investigation {
  const inv = getInvestigation(id);
  if (!inv) throw new Error(`Investigation ${id} not found.`);

  const oldStatus = inv.status;
  inv.status = newStatus;
  inv.updatedAt = new Date().toISOString();

  logAuditEvent(userId, userName, 'ANALYST', 'ws_ent_ai', 'UPDATE_INVESTIGATION_STATUS', inv.id, oldStatus, newStatus);
  return inv;
}

export function attachEvidenceToInvestigation(invId: string, clusterId: string): Investigation {
  const inv = getInvestigation(invId);
  if (!inv) throw new Error(`Investigation ${invId} not found.`);

  if (!inv.clusterIds.includes(clusterId)) {
    inv.clusterIds.push(clusterId);
    inv.evidenceCount++;
    inv.updatedAt = new Date().toISOString();
  }
  return inv;
}
