# NewsPulse AI — Autonomous Multi-Agent News Intelligence Platform

NewsPulse AI is an autonomous multi-agent news intelligence platform designed to discover, verify, rank, analyze, and summarize important news from multiple sources.

---

## 🏗 System Architecture & Ingestion Flow

```
                      NEWS SOURCES (Phase 2)
                                │
                                ▼
                       NORMALIZED STORIES
                                │
                                ▼
                       DEDUPLICATED STORIES
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
                       SCOUT ORCHESTRATOR (Phase 3)
                                │
                                ▼
                 VERIFICATION DASHBOARD & UI PANELS
```

---

## 🛡 Phase 5: Verification Engine & Evidence Graph

Phase 5 builds a deterministic **Verification Engine & Evidence Graph** that evaluates `EventCluster` objects using transparent engineering rules to measure corroboration structure, source diversity, primary evidence presence, and publication consistency.

### 1. Verification Status Definitions (`src/lib/verification/types.ts`)
- `STRONG_CORROBORATION`: 3+ independent publishers OR 2+ independent publishers with primary evidence.
- `LIMITED_CORROBORATION`: 2 independent publishers OR 1 publisher with primary source evidence.
- `INSUFFICIENT_EVIDENCE`: Single secondary publisher report without primary source backing.
- `CONFLICTING_REPORTS`: Contradictory monetary figures, headcount numbers, or conflicting statements detected across outlets.
- `PENDING` / `UNASSESSED`: Verification in progress.

> ⚠️ **Critical Disclaimer**: Verification statuses represent **evidence quality & corroboration structure ONLY**. They are **NEVER** presented as truth labels. Corroboration is not proof of truth.

### 2. Source Classification Registry (`src/lib/verification/sourceClassification.ts`)
Classifies publisher endpoints into primary evidence vs secondary reporting:
- **Primary Sources**: `GOVERNMENT` (`.gov`), `ACADEMIC` (`.edu`, `arxiv.org`), `COMPANY_BLOG` (`blog.google`, `openai.com/index`, `newsroom.apple.com`), `OFFICIAL_ORG`.
- **Secondary Sources**: `WIRE_SERVICE` (Reuters, AP, AFP), `NEWS_ORG` (BBC, CNBC, NPR), `INDUSTRY_PUB` (Ars Technica, TechCrunch, Wired).

### 3. Claim Matching & Conflict Detection (`src/lib/verification/claimMatcher.ts`)
- **Numerical Claim Extraction**: Extracts dollar amounts (`$4.5M` vs `$45M`) and headcount figures (`500 layoffs` vs `5,000 layoffs`).
- **Conflict Flagging**: If contradictory numbers differ by ratio $\ge 1.5$ across publishers, flags `CONFLICTING_REPORTS` and records conflicting stories.

### 4. Evidence Graph Engine (`src/lib/verification/evidenceGraph.ts`)
Constructs an internal graph model:
- **Nodes**: `CLUSTER` (center), `PRIMARY_SOURCE`, `SECONDARY_SOURCE`, `STORY`, `ENTITY`.
- **Edges**: `REPORTED_BY`, `CITES_PRIMARY`, `CONFLICTS_WITH`, `ASSOCIATED_ENTITY`.

---

## 📌 API Reference

### `GET /api/verification/[clusterId]`
Returns verification result, evidence graph nodes/edges, supporting sources, rule reasons, and evidence timeline.

### `GET /api/events`
Returns all active Event Clusters, clustering telemetry, and verification results.

### `POST /api/agents/scout`
Triggers Phase 2 ingestion $\rightarrow$ Phase 4 story clustering $\rightarrow$ Phase 5 Verification Engine $\rightarrow$ Phase 3 Scout Orchestrator. Returns `{ executionId, status, durationMs, agentTelemetry, intelligence, eventClusters, clusterTelemetry, verificationTelemetry }`.

---

## 🚀 Getting Started & Testing

### Run Tests
```bash
# Run Vitest test suite (40 Unit & Integration tests)
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
Open [http://localhost:3000](http://localhost:3000) to view the Verified Event Intelligence Command Center.
