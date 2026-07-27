import { ActivityLog } from '@/data/mockData';
import { OrchestratorExecutionResult } from '../types';

let latestRun: OrchestratorExecutionResult | null = null;
const runHistory: OrchestratorExecutionResult[] = [];

/**
 * Stores an execution result in the runtime memory tracker.
 */
export function recordExecutionResult(result: OrchestratorExecutionResult): ActivityLog[] {
  latestRun = result;
  runHistory.unshift(result);
  if (runHistory.length > 20) {
    runHistory.pop();
  }

  // Generate real activity logs from actual execution events
  const newLogs: ActivityLog[] = [];
  const timeStr = 'Just now';

  // 1. Run Start event
  newLogs.push({
    id: `log-run-start-${result.executionId}`,
    timestamp: timeStr,
    agentId: 'orchestrator',
    agentName: 'Scout Orchestrator',
    message: `Initiated execution run ${result.executionId}. Dispatched 3 Scouts across ${result.totalStoriesProcessed} stories.`,
    type: 'info'
  });

  // 2. Per-Agent execution events
  for (const telemetry of result.agentTelemetry) {
    if (telemetry.status === 'COMPLETED') {
      newLogs.push({
        id: `log-${telemetry.agentId}-${Date.now()}`,
        timestamp: timeStr,
        agentId: telemetry.agentId,
        agentName: telemetry.agentName,
        message: `${telemetry.agentName} processed ${telemetry.storiesProcessed} stories and selected ${telemetry.storiesSelected} candidates in ${telemetry.durationMs}ms.`,
        type: 'success'
      });
    } else {
      newLogs.push({
        id: `log-${telemetry.agentId}-fail-${Date.now()}`,
        timestamp: timeStr,
        agentId: telemetry.agentId,
        agentName: telemetry.agentName,
        message: `${telemetry.agentName} failed: ${telemetry.error || 'Execution exception'}`,
        type: 'error'
      });
    }
  }

  // 3. Run Completion event
  newLogs.push({
    id: `log-run-complete-${result.executionId}`,
    timestamp: timeStr,
    agentId: 'orchestrator',
    agentName: 'Scout Orchestrator',
    message: `Orchestrator completed run ${result.executionId} in ${result.durationMs}ms. Total selected intelligence: ${result.totalSelected} items. Status: ${result.status}.`,
    type: result.status === 'SUCCESS' ? 'success' : result.status === 'PARTIAL' ? 'warning' : 'error'
  });

  return newLogs;
}

export function getLatestExecution(): OrchestratorExecutionResult | null {
  return latestRun;
}

export function getExecutionHistory(): OrchestratorExecutionResult[] {
  return runHistory;
}
