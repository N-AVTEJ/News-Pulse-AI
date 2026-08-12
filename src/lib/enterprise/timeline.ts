import { getAuditLogs } from './audit';
import { TeamActivityItem } from './types';

export function getTeamActivityTimeline(): TeamActivityItem[] {
  const audit = getAuditLogs(20);

  return audit.map((entry) => ({
    id: `act_${entry.id}`,
    type: 'VERIFICATION_UPDATED' as const,
    title: `${entry.action.replace(/_/g, ' ')} on resource [${entry.targetResource}]`,
    actorName: entry.userName,
    timestamp: entry.timestamp
  }));
}
