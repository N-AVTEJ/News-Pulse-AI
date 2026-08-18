# NewsPulse AI — Operations Runbook & Incident Management

**Document Version**: 1.0.0  
**Target Audience**: DevOps, Site Reliability Engineers, Platform Operations  

---

## 1. Incident Severity Definitions

- **SEV-1 (Critical)**: Total API outage, unable to serve live dashboard or verified events.
- **SEV-2 (High)**: Background queue failure, autonomous pipeline scheduler locked, or high error rate (> 5%).
- **SEV-3 (Medium)**: Single news source RSS offline, partial plugin sandbox error, or latency spike.
- **SEV-4 (Low)**: Minor UI telemetry lag or non-critical formatting anomaly.

---

## 2. Standard Operating Procedures (SOPs)

### SOP-01: API Outage & Service Restart
1. Check process health: `curl -I http://localhost:3000/api/health/live`.
2. Check readiness probe: `curl http://localhost:3000/api/health/ready`.
3. If non-responsive, restart application process:
   ```bash
   npm run build
   npm run start
   ```
4. Verify HTTP 200 on `GET /api/health`.

### SOP-02: Scheduler Lock Reset
1. Check lock state: `curl http://localhost:3000/api/health`.
2. If `scheduler.isLocked == true` for > 10 minutes without active execution:
   - Trigger manual lock release via `schedulerLock.releaseLock('timeout_override', false)`.
   - Trigger manual autonomous pipeline sweep: `POST /api/runtime/run`.

### SOP-03: Security Incident & API Key Revocation
1. Identify compromised API Key via `GET /api/audit`.
2. Delete/Revoke key from `apiKeysStore`.
3. Generate new replacement key with scoped permissions (`read:events`).

### SOP-04: Deployment Rollback
1. Revert Git tag/commit to last known stable release.
2. Run automated validation:
   ```bash
   npm run lint
   npx vitest run
   npm run build
   ```
3. Restart production server instance.
