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
                     STORY CLUSTERING ENGINE
                                │
                                ▼
                         EVENT CLUSTERS
                                │
                                ▼
                       SCOUT ORCHESTRATOR
                                │
        +-----------------------+-----------------------+
        │                       │                       │
        v                       v                       v
  AI & TECH SCOUT        BUSINESS SCOUT            WORLD SCOUT
        │                       │                       │
        +-----------------------+-----------------------+
                                │
                                ▼
                       SCOUT INTELLIGENCE
                                │
                                ▼
                 EVENT DASHBOARD & TIMELINES (UI)
```

---

## 🎯 Phase 4: Story Clustering & Event Intelligence

Phase 4 transforms NewsPulse AI from listing isolated single articles into a unified **Event Intelligence Platform**. Related articles reporting on the same real-world event across multiple publishers are grouped deterministically into an **EventCluster**.

### 1. Deterministic Similarity Scoring Engine (`src/lib/clustering/similarityEngine.ts`)
Calculates a 0–100 similarity score between stories without LLMs or embeddings:
- **Headline Overlap (0–40 pts)**: Token Jaccard index + n-gram overlap on normalized headlines (after stripping stop words, punctuation, unicode quotes, and possessives).
- **Entity Overlap (0–30 pts)**: Shared organization names, product names, locations (e.g. OpenAI, ChatGPT, Nvidia, Microsoft, EU, TSMC).
- **Publication Time Proximity (0–20 pts)**:
  - $\le 6\text{h}$: +20 pts
  - $\le 12\text{h}$: +15 pts
  - $\le 24\text{h}$: +10 pts
  - $> 24\text{h}$: 0 pts
- **Category Domain Alignment (0–10 pts)**: +10 pts if categories match.
- **Clustering Threshold**: Configurable `minSimilarityThreshold` (default: `50`). If similarity $\ge 50$, stories are grouped into an `EventCluster`.

### 2. Canonical Headline & Summary (`src/lib/clustering/canonicalHeadline.ts`)
- **Canonical Headline**: Selected deterministically based on longest descriptive headline length (7–20 words) from the earliest reporting publisher.
- **Event Summary**: Extracted from the earliest published story in the cluster.

### 3. Chronological Event Timeline (`src/components/EventTimelineComponent.tsx`)
- Displays the chronological progression of news reports (earliest report $\rightarrow$ latest update).
- Preserves all publisher attributions and direct article links (`target="_blank"`).

### 4. Scout Integration for Event Clusters (`src/lib/agents/orchestrator.ts`)
- Runtime Scouts (`AI & Tech Scout`, `Business Scout`, `World News Scout`) evaluate `EventCluster` objects concurrently using `Promise.allSettled()`.
- Multiple Scouts matching the same event are displayed as `"Detected by X Scouts"`.

> ⚠️ **Cluster &ne; Verification Notice**:  
> Multiple publishers reporting on the same event indicates widespread media coverage. It does NOT independently prove factual truth without multi-agent cross-verification (Phase 5+).

---

## 📌 API Reference

### `GET /api/events`
Returns all active Event Clusters and clustering telemetry stats.

Query parameters:
- `category`: Filter by category (`ai-tech`, `business`, `world`).
- `minSimilarity`: Minimum similarity threshold (default: `50`).
- `refresh`: Force fresh ingestion scan (`true`).

### `GET /api/events/[id]`
Returns single Event Cluster details matching `[id]`.

### `POST /api/agents/scout`
Triggers Phase 2 ingestion $\rightarrow$ Phase 4 story clustering $\rightarrow$ Phase 3 Scout Orchestrator. Returns `{ executionId, status, durationMs, agentTelemetry, intelligence, eventClusters, clusterTelemetry }`.

---

## 🚀 Getting Started & Testing

### Run Tests
```bash
# Run Vitest test suite (Unit & Integration tests)
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
Open [http://localhost:3000](http://localhost:3000) to view the Event Intelligence Command Dashboard.
