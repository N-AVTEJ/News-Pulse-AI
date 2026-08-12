import { AuditLogEntry, Role } from './types';

let auditLogsStore: AuditLogEntry[] = [
  {
    id: 'audit_001',
    timestamp: new Date(Date.now() - 3600000 * 5).toISOString(),
    userId: 'mem_owner_01',
    userName: 'Sarah Connor',
    userRole: 'OWNER',
    workspaceId: 'ws_ent_ai',
    action: 'CREATE_ORGANIZATION',
    targetResource: 'org_newspulse_global',
    newValue: 'NewsPulse Global Intelligence Network'
  }
];

export function logAuditEvent(
  userId: string,
  userName: string,
  userRole: Role,
  workspaceId: string,
  action: string,
  targetResource: string,
  previousValue?: string,
  newValue?: string
): AuditLogEntry {
  const entry: AuditLogEntry = {
    id: `audit_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    timestamp: new Date().toISOString(),
    userId,
    userName,
    userRole,
    workspaceId,
    action,
    targetResource,
    previousValue,
    newValue
  };

  auditLogsStore.unshift(entry);
  return entry;
}

export function getAuditLogs(limit: number = 50, actionFilter?: string): AuditLogEntry[] {
  let result = auditLogsStore;
  if (actionFilter && actionFilter !== 'ALL') {
    result = result.filter(a => a.action === actionFilter);
  }
  return result.slice(0, limit);
}

export function clearAuditLogs(): void {
  auditLogsStore = [];
}
