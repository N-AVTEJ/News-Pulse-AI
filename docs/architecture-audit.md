# NewsPulse AI — Comprehensive Architecture Audit

**Audit Date**: August 2026  
**Platform Version**: 1.0.0  
**Status**: Production Infrastructure & Hardening Phase  

---

## 1. System Inventory

### 1.1 Frontend Architecture
- **Framework**: Next.js 16 (Turbopack, App Router, React 19 Client/Server Components).
- **Styling**: Vanilla CSS tokens & Tailwind utility classes with custom dark command-center aesthetic.
- **State Management**: Centralized `PulseContext` provider providing real-time reactivity across news stories, event clusters, telemetry, multi-agent scouts, personalization, enterprise workspaces, knowledge graphs, and plugins.
- **UI Components**: 
  - `ExecutiveCommandCenter.tsx`, `NaturalLanguageQueryBar.tsx`, `GraphExplorer.tsx`, `EntityProfileModal.tsx`
  - `DeveloperPortal.tsx`, `WorkflowBuilder.tsx`, `CustomDashboardBuilder.tsx`, `PluginRegistryModal.tsx`
  - `TeamDashboardPanel.tsx`, `InvestigationManager.tsx`, `TaskManager.tsx`, `AuditLogModal.tsx`
  - `VerificationMetricCards.tsx`, `EventClusterVisualizer.tsx`, `EventDetailModal.tsx`

### 1.2 Backend API Architecture
- **Route Handlers**: Next.js App Router API endpoints (`src/app/api/`):
  - **Public REST v1**: `/api/v1/events`, `/api/v1/workflows`, `/api/v1/plugins`, `/api/v1/keys`, `/api/v1/webhooks`
  - **Intelligence & Core**: `/api/news`, `/api/events`, `/api/events/[id]`, `/api/agents/scout`, `/api/analysis/[clusterId]`, `/api/verification/[clusterId]`
  - **Knowledge Graph**: `/api/graph`, `/api/entities`, `/api/entities/[id]`, `/api/relationships`, `/api/query`, `/api/archive`
  - **Personalization**: `/api/feed`, `/api/profile`, `/api/watchlists`, `/api/briefings`, `/api/recommendations`, `/api/history`, `/api/alerts`
  - **Enterprise**: `/api/organizations`, `/api/workspaces`, `/api/investigations`, `/api/tasks`, `/api/comments`, `/api/audit`
  - **Runtime & Health**: `/api/runtime/run`, `/api/runtime/health`, `/api/runtime/status`, `/api/runtime/queue`, `/api/runtime/history`, `/api/runtime/notifications`

### 1.3 Data Storage & Persistence Model
- **Current State**: In-memory deterministic stores with caching layers (`graphStore`, `investigationsStore`, `tasksStore`, `auditLogsStore`, `pluginsStore`, `apiKeysStore`).
- **Database Readiness**: Structured schemas mapped in TypeScript interfaces designed for drop-in persistence (PostgreSQL / Redis).

### 1.4 Background Processing & Scheduling
- **Queues**: In-memory job queue with prioritization (`CRITICAL`, `HIGH`, `MEDIUM`, `LOW`) and status lifecycles (`PENDING` $\rightarrow$ `RUNNING` $\rightarrow$ `COMPLETED` $\rightarrow$ `FAILED`).
- **Workers**: Concurrent worker pools processing ingestion, story clustering, verification, and AI analysis.
- **Schedulers**: Periodic cron interval scheduler (`scheduler.ts`) managing autonomous pipeline sweeps.

### 1.5 External Integrations & Adapters
- **RSS News Feeds**: Multi-outlet live ingestion (TechCrunch, Ars Technica, Wired, BBC, CNBC, NPR).
- **Enterprise Notification Adapters**: Abstracted adapters for Slack, Microsoft Teams, Jira, GitHub, Email, Outbound Webhooks, and SIEM platforms.

### 1.6 Authentication & Authorization (RBAC)
- **RBAC Matrix**: 7 distinct roles (`OWNER`, `ADMIN`, `MANAGER`, `ANALYST`, `RESEARCHER`, `VIEWER`, `GUEST`) governing 10 granular permissions.
- **API Authentication**: Bearer API key token validation with permission scopes (`read:events`, `write:workflows`, `admin:plugins`) and token-bucket rate limiting.

---

## 2. End-to-End Data Flow

```
1. Ingestion Layer       --> Live RSS fetching from publishers (deduplicated & canonicalized)
2. Clustering Engine     --> Semantic token overlap & time-window deterministic grouping
3. Verification Engine   --> Multi-source corroboration scoring (independent diversity, primary sources)
4. AI Analysis Engine    --> Evidence-grounded report generation & claim extraction
5. Knowledge Graph       --> Entity resolution (aliases) & directed relationship discovery (334+ nodes)
6. Autonomous Pipeline   --> Breaking news detection & targeted user alerts
7. Enterprise Layer      --> Investigation state machines, task checklists, threaded evidence discussions
8. Platform Extensions   --> Capability-sandboxed plugins, visual workflows & signed outbound webhooks
```

---

## 3. Known Risks & Technical Debt

| Area | Risk / Debt | Severity | Remediation Strategy |
|---|---|---|---|
| **Process State** | In-memory storage resets upon server restart | Medium | Migrate stores to PostgreSQL + Redis persistence in production |
| **Scheduler Concurrency** | Multi-instance clustering could trigger duplicate cron runs | Medium | Implement distributed execution locks (`schedulerLock.ts`) |
| **Uncaught API Errors** | Potential internal stack trace exposure on unhandled exceptions | High | Deploy centralized sanitized API error wrapper (`errorHandler.ts`) |
| **Queue Deadlock** | Unrecoverable failed jobs might loop indefinitely | High | Implement exponential backoff, retry limits, and dead-letter queue (DLQ) |
| **Logging Sanitization** | Verbose logging may inadvertently output sensitive headers | High | Structured JSON logger with automated credential redaction (`logger.ts`) |

---

## 4. Production Blockers & Remediation Plan

1. **Structured Logging & Correlation**: Introduce `logger.ts` and `correlation.ts` to propagate `requestId` across all pipeline stages.
2. **Standardized Health Probes**: Expose `/api/health/live`, `/api/health/ready`, and `/api/health` for load balancers and orchestrators.
3. **Queue Reliability**: Introduce exponential backoff, idempotency keys, and dead-letter handling.
4. **Environment Validation**: Strict startup validation of runtime environment variables via `env.ts`.
5. **Operational Runbooks & Disaster Recovery**: Provide standard operating procedures for incident management.
