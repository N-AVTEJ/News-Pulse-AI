# NewsPulse AI — Autonomous Multi-Agent News Intelligence Platform

NewsPulse AI is an autonomous multi-agent news intelligence platform designed to discover, verify, rank, analyze, and summarize important news from multiple sources.

---

## ⚡ Production Intelligence Platform Architecture (Phases 1–12)

```
                            INCOMING REQUESTS & API CLIENTS
                                          │
                                          ▼
                              SECURITY & HEADERS MIDDLEWARE
                         (CSP, HSTS, X-Content-Type-Options, CORS)
                                          │
                                          ▼
                            CORRELATION & STRUCTURED LOGGER
                            (requestId, runId, timestamps)
                                          │
                                          ▼
            ┌─────────────────────────────┼─────────────────────────────┐
            ▼                             ▼                             ▼
    HEALTH CHECKS                  CORE APPLICATION             METRICS TELEMETRY
(/live, /ready, /health)         (APIs, UI, Scouts)        (Latency, Ingestion, Errors)
            │                             │                             │
            ▼                             ▼                             ▼
    QUEUE & SCHEDULER             KNOWLEDGE & GRAPH             INCIDENT RUNBOOKS &
 (Dead-letter, Locks)           (Sandboxed Plugins)             BACKUP PROCEDURES
```

---

## 🛠 Phase 12: Production Infrastructure, Security & Observability

Phase 12 hardens NewsPulse AI with enterprise-grade production engineering, reliability, and observability tooling.

### 1. Structured Logging & Request Correlation (`src/lib/observability/logger.ts`, `correlation.ts`)
- Structured JSON logging containing `timestamp`, `level`, `service`, `requestId`, `runId`, `event`, `durationMs`, and `status`.
- Automated sensitive field sanitizer redacting passwords, authorization headers, raw API keys, and secret tokens.

### 2. Standardized Production Health Probes (`src/app/api/health/`)
- `GET /api/health/live`: Fast, non-blocking liveness probe.
- `GET /api/health/ready`: Readiness probe verifying memory headroom, worker pools, and storage.
- `GET /api/health`: Deep diagnostics inspecting News Ingestion, Verification Engine, AI Analysis, Knowledge Graph, Schedulers, and Job Queue.

### 3. Application Metrics Engine (`src/lib/observability/metrics.ts`, `GET /api/metrics`)
- Real-time counters and latency aggregations tracking requests, route usage, ingested stories, formed clusters, verification runs, AI reports, queue depths, and webhook dispatches.

### 4. Hardened Queue & Scheduler Reliability (`src/lib/runtime/queueReliability.ts`, `schedulerLock.ts`)
- Exponential backoff retry policies.
- Dead-Letter Queue (DLQ) state transitions for poison-pill or persistent failures.
- Idempotency key tracking preventing duplicate processing.
- Distributed scheduler execution lock preventing concurrent cron sweeps.

### 5. Production Security & Safe Error Handling (`src/lib/observability/errorHandler.ts`, `next.config.ts`)
- Standardized API error responses `{ code, message, requestId, timestamp }` with zero stack trace exposure in production.
- Production security headers (`X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`).

### 6. Documentation Suite (`docs/`)
- `docs/architecture-audit.md`: Detailed architecture inventory, dependencies, and risk analysis.
- `docs/backup-and-recovery.md`: Documented backup cadence, retention policies, and disaster recovery procedures.
- `docs/operations-runbook.md`: Incident severity definitions and standard operating procedures (SOPs).
- `docs/production-readiness.md`: Truthful, verified production readiness assessment report.
- `.github/workflows/ci.yml`: Automated CI pipeline running linting, typechecking, Vitest tests, and production build.

---

## 📌 Public API Reference (v1)

### Health & Observability
- `GET /api/health`: Comprehensive dependency health diagnostics.
- `GET /api/health/live`: Kubernetes/Docker liveness probe.
- `GET /api/health/ready`: Kubernetes/Docker readiness probe.
- `GET /api/metrics`: Application metrics telemetry snapshot.

### Core Intelligence
- `GET /api/v1/events`: Verified intelligence event clusters (supports `Authorization: Bearer <key>`).
- `GET & POST /api/v1/workflows`: Workflow automation engine triggers and execution logs.
- `GET & POST /api/v1/plugins`: Capability-sandboxed plugin registry.
- `GET & POST /api/v1/keys`: API Key generator and scope manager.
- `GET & POST /api/v1/webhooks`: Signed outbound webhook dispatcher.

---

## 🚀 Getting Started & Verification

```bash
# Run complete test suite (69 Unit & Integration tests)
npx vitest run

# Run ESLint check
npm run lint

# Build production bundle
npm run build

# Start production server
npm run start
```
Open [http://localhost:3000](http://localhost:3000) and click **"System Health"** in the top bar to inspect live operational diagnostics.
