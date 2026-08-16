# NewsPulse AI — Autonomous Multi-Agent News Intelligence Platform

NewsPulse AI is an autonomous multi-agent news intelligence platform designed to discover, verify, rank, analyze, and summarize important news from multiple sources.

---

## 🌐 Intelligence Operating System Architecture (Phases 1–10)

```
                     EVENTS, VERIFICATION, & AI REPORTS (Phases 1–9)
                                │
                                ▼
                   DETERMINISTIC ENTITY RESOLUTION
             (OpenAI Inc. / OpenAI / Open AI ➔ Canonical OpenAI)
                                │
                                ▼
                 EVIDENCE-GROUNDED RELATIONSHIP DISCOVERY
            (acquired, released, partnered, reported_by, located_in)
                                │
                                ▼
                    ENTERPRISE KNOWLEDGE GRAPH
             (Companies, Tech, People, Gov, Events, Investigations)
                                │
                                ▼
           NATURAL LANGUAGE QUERY ENGINE & HISTORICAL ARCHIVE
         ("Show verified OpenAI events", "NVIDIA reports")
                                │
                                ▼
        GRAPH EXPLORER, ENTITY PROFILES, & EXECUTIVE COMMAND CENTER (UI)
```

---

## 🏛 Phase 10: Global Knowledge Graph & Executive Command Center

Phase 10 completes NewsPulse AI's evolution into a full Intelligence Operating System.

### 1. In-Memory Graph Database Abstraction (`src/lib/knowledge/graph.ts`)
- **12 Node Types**: `COMPANY`, `ORGANIZATION`, `PERSON`, `GOVERNMENT`, `TECHNOLOGY`, `PRODUCT`, `COUNTRY`, `CITY`, `EVENT`, `INVESTIGATION`, `REPORT`, `SOURCE`.
- **10 Edge Relations**: `acquired`, `released`, `partnered`, `reported_by`, `located_in`, `works_for`, `investigates`, `mentions`, `references`, `related_to`.

### 2. Deterministic Entity Resolution (`src/lib/knowledge/entityResolver.ts`)
- Normalizes raw name variations (`"OpenAI Inc."`, `"Open AI"`, `"OpenAI"`) $\rightarrow$ canonical `"OpenAI"`.
- Preserves alias arrays without improper merges of distinct entities.

### 3. Natural Language Intelligence Query Engine (`src/lib/knowledge/queryEngine.ts`)
- Translates natural language queries (e.g., `"Show all verified OpenAI events"`, `"Find reports mentioning NVIDIA"`) into structured filter parameters (`category`, `entity`, `verificationStatus`).

### 4. Historical Intelligence Archive & Unified Timelines (`archive.ts`, `timeline.ts`)
- Searchable historical archive repository and multi-source timeline engine merging verified events, AI reports, and investigation milestones.

---

## 📌 Knowledge Graph API Reference

### `GET /api/graph`
Returns Knowledge Graph nodes, directed relationship edges, and executive analytics.

### `GET /api/entities` & `GET /api/entities/[id]`
Returns catalog of resolved entities and detailed entity profile node details.

### `GET /api/relationships`
Returns evidence-grounded entity relationship triples.

### `POST /api/query`
Executes natural language intelligence queries and returns matching event clusters.

### `GET /api/archive`
Returns historical intelligence archives.

---

## 🚀 Getting Started & Testing

### Run Tests
```bash
# Run Vitest test suite (60 Unit & Integration tests)
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
Open [http://localhost:3000](http://localhost:3000) to view the Executive Command Center & Graph Explorer.
