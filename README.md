# NewsPulse AI — Autonomous Multi-Agent News Intelligence Platform

NewsPulse AI is an autonomous multi-agent news intelligence platform designed to discover, verify, rank, analyze, and summarize important news from multiple sources.

---

## 🏗 System Architecture & Ingestion Flow

```
                         SCHEDULER (Phase 7)
                                │
                                ▼
                   INCREMENTAL INGESTION (Phase 7)
                                │
                                ▼
                       CHANGE DETECTOR (Phase 7)
                                │
                                ▼
                     STORY CLUSTERING ENGINE (Phase 4)
                                │
                                ▼
                     VERIFICATION ENGINE (Phase 5)
                                │
                                ▼
                        EVIDENCE GRAPH (Phase 5)
                                │
                                ▼
                     AI ANALYSIS ENGINE (Phase 6)
                                │
                                ▼
                       SCOUT ORCHESTRATOR (Phase 3)
                                │
                                ▼
                    BREAKING EVENT DETECTOR (Phase 7)
                                │
                                ▼
                    NOTIFICATION ENGINE (Phase 7)
                                │
                                ▼
            AI INTELLIGENCE REPORT & COMMAND CENTER (UI)
```

---

## ⚡ Phase 7: Autonomous Intelligence Pipeline

Phase 7 transforms NewsPulse AI into a continuously operating autonomous news intelligence platform.

### 1. Autonomous Pipeline Orchestrator (`src/lib/runtime/pipeline.ts`)
Executes 8 independent stages per pipeline run:
1. `INGESTION`: Real Phase 2 news ingestion.
2. `INCREMENTAL_DETECTION`: Detects new vs unchanged articles.
3. `CLUSTERING`: Phase 4 deterministic story clustering.
4. `VERIFICATION`: Phase 5 verification & evidence graph building.
5. `SCOUTS`: Phase 3 multi-agent scout evaluation.
6. `AI_ANALYSIS`: Phase 6 evidence-grounded AI intelligence reports.
7. `BREAKING_DETECTION`: Deterministic breaking event detection & lifecycle management.
8. `NOTIFICATIONS`: User notifications with deduplication & preference filters.

### 2. Job Queue & Background Workers (`src/lib/runtime/jobQueue.ts`, `worker.ts`)
- Manages stage execution statuses (`QUEUED`, `RUNNING`, `COMPLETED`, `FAILED`, `CANCELLED`).
- Concurrent background workers process safe pipeline stages while preventing duplicate active stage executions.

### 3. Breaking News Lifecycle (`src/lib/runtime/breakingDetector.ts`)
Supports 4 lifecycle states:
- `DEVELOPING`: Initial single or two-publisher coverage.
- `BREAKING`: High publisher velocity ($\ge 3$ publishers in $\le 4\text{h}$) or official primary announcement.
- `CONFIRMED`: Strong corroboration with primary source backing.
- `ARCHIVED`: Coverage inactive for $> 48\text{h}$.

### 4. Health Monitor & Execution History (`src/lib/runtime/healthMonitor.ts`, `executionHistory.ts`)
- **Health Monitor**: Tracks scheduler status, worker activity, queue length, average latency, source availability, and failed jobs.
- **Execution History**: Searchable logs of every pipeline run (`runId`, `trigger`, `durationMs`, `jobs`, `status`).

---

## 📌 API Reference

### `POST /api/runtime/run`
Triggers an autonomous pipeline run across all 8 stages.

### `GET /api/runtime/status`
Returns live pipeline status, scheduler mode, active workers, and queue length.

### `GET /api/runtime/health`
Returns system health metrics and source availability percentage.

### `GET /api/runtime/history`
Returns searchable pipeline run execution history.

### `GET /api/runtime/notifications`
Returns user notifications and unread alert counts.

---

## 🚀 Getting Started & Testing

### Run Tests
```bash
# Run Vitest test suite (49 Unit & Integration tests)
npx vitest run
```

### Run Linter & Build
```bash
# Run ESLint
npm run lint

# Build production bundle
npm run build
```

### Start Server
```bash
# Start local production server
npm run start
```
Open [http://localhost:3000](http://localhost:3000) to view the Autonomous Intelligence Command Center.
