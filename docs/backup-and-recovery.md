# NewsPulse AI — Backup & Disaster Recovery Strategy

**Document Version**: 1.0.0  
**Effective Date**: August 2026  

---

## 1. Backup Strategy Overview

| Data Layer | Backup Target | Frequency | Retention | Storage & Encryption |
|---|---|---|---|---|
| **Event Clusters & Stories** | PostgreSQL DB Snapshots | Every 6 hours | 30 Days | AES-256 encrypted cloud storage |
| **Knowledge Graph & Aliases** | Graph JSON Snapshots | Daily (00:00 UTC) | 90 Days | AES-256 encrypted Object Storage |
| **Investigations & Tasks** | Enterprise Database Dumps | Hourly | 60 Days | Encrypted Relational Snapshots |
| **Audit Logs & Telemetry** | Immutable Append-Only Logs | Real-time / Daily | 365 Days | WORM (Write Once Read Many) compliant storage |

---

## 2. Disaster Recovery Procedures

### 2.1 Database & Persistence Failure
1. **Detection**: Health check `GET /api/health` indicates storage degradation.
2. **Action**:
   - Point application to standby read-replica immediately.
   - Restore latest hourly WAL snapshot to new master instance.
   - Run verification query: `SELECT count(*) FROM event_clusters`.

### 2.2 Background Queue Backlog & Dead-Letter Overflow
1. **Detection**: `queueReliability.getDeadLetterJobs().length > 10`.
2. **Action**:
   - Inspect error messages on dead-letter entries via operational diagnostics dashboard.
   - Flush poisoned messages to quarantine bucket.
   - Re-enqueue failed jobs using `reliableQueue.enqueue()`.

### 2.3 News Source Ingestion Failure
1. **Detection**: Ingestion metrics report 0 new stories from specific RSS feed across 3 consecutive cycles.
2. **Action**:
   - Circuit-breaker automatically trips, setting source to `DEGRADED`.
   - Remaining independent sources continue normal clustering and verification without interruption.
   - Automated health retry checks source every 15 minutes.

### 2.4 AI Analysis Provider Outage
1. **Detection**: LLM API returns HTTP 429, 500, or timeout > 5000ms.
2. **Action**:
   - System automatically engages the deterministic fallback analysis generator (`provider: "grounded-deterministic-fallback"`).
   - Zero hallucinated or fabricated statements are published; factual timeline and citation evidence are preserved.
