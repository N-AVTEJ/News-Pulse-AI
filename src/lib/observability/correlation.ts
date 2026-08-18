export function generateRequestId(): string {
  return `req_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
}

export function generateRunId(): string {
  return `run_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
}

export function generateJobId(): string {
  return `job_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
}
