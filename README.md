# NewsPulse AI — Autonomous Multi-Agent News Intelligence Platform

NewsPulse AI is an autonomous multi-agent news intelligence platform designed to discover, verify, rank, analyze, and summarize important news from multiple sources.

---

## 🏗 System Architecture & Ingestion Flow

```
                   NEWS INGESTION (Phase 2)
                             │
                             ▼
                     NORMALIZED STORIES
                             │
                             ▼
                     SCOUT ORCHESTRATOR
                             │
      +----------------------+----------------------+
      │                      │                      │
      v                      v                      v
AI & TECH SCOUT       BUSINESS SCOUT           WORLD SCOUT
      │                      │                      │
      +----------------------+----------------------+
                             │
                             ▼
                       RESULT MERGER
                             │
                             ▼
                     SCOUT INTELLIGENCE
                             │
                             ▼
                   AGENTS DASHBOARD (UI)
```

---

## 🤖 Phase 3: Multi-Agent News Scout System

Phase 3 introduces a deterministic, explainable runtime multi-agent scout architecture:

### 1. Common Scout Interface (`src/lib/agents/types.ts`)
All Scouts implement a unified TypeScript interface `ScoutAgent`:
- `id`: Unique identifier (`tech-scout`, `business-scout`, `world-scout`).
- `name`: Human readable Scout title.
- `category`: Domain area (`ai-tech`, `business`, `world`).
- `description`: Role definition.
- `execute(stories: NewsStory[], config?: ScoutConfigOptions)`: Returns structured `ScoutResult` containing telemetry & selected candidates.

### 2. Configurable Signal Dictionaries (`src/lib/agents/shared/keywords.ts`)
- **AI & Tech Scout**: `MODEL_RELEASE`, `PRODUCT_LAUNCH`, `SECURITY_INCIDENT`, `MAJOR_RESEARCH`, `REGULATORY_CHANGE`, `ACQUISITION`, `FUNDING`, `INFRASTRUCTURE`, `PLATFORM_CHANGE`.
- **Business Scout**: `EARNINGS`, `ACQUISITION`, `MERGER`, `FUNDING`, `LAYOFF`, `EXECUTIVE_CHANGE`, `REGULATION`, `INVESTMENT`, `PARTNERSHIP`, `MARKET_MOVE`.
- **World News Scout**: `GOVERNMENT_ACTION`, `ELECTION`, `DIPLOMACY`, `ECONOMIC_POLICY`, `DISASTER`, `INFRASTRUCTURE`, `INTERNATIONAL_AGREEMENT`, `PUBLIC_SAFETY`.

### 3. Deterministic 0-100 Selection Scoring Model (`src/lib/agents/shared/scoring.ts`)
Calculates an explainable **Scout Selection Score** (0-100):
- **Domain Alignment**: +25 pts
- **Primary Signal Match**: +30 pts
- **Secondary Signals**: +10 pts each (max +20)
- **Corroborating Outlets**: +10/+15 pts (from Phase 2 deduplicated outlets)
- **Publication Recency**: +10 pts (<24h) / +5 pts (<48h)
- **Score Clamp**: 0 to 100 limit.
- **Explainable Breakdown**: Returns exact score contribution object.

> **Note**: Scout Selection Score represents candidate selection relevance. It is NOT a truth or confidence score.

### 4. Scout Orchestrator & Result Merger (`src/lib/agents/orchestrator.ts`)
- **Execution ID**: Generates unique `run_<timestamp>_<rand>`.
- **Concurrency & Fault Isolation**: Executes all registered Scouts concurrently via `Promise.allSettled()`. A failure in one Scout does not break execution or destroy results from others.
- **Cross-Scout Result Merging**: Merges articles sharing canonical URLs while preserving `matchedScouts` (e.g. `['tech-scout', 'business-scout']`), combined signals, and per-scout scores.

---

## 📌 API Reference

### `POST /api/agents/scout`
Triggers Phase 2 ingestion and runs the Scout Orchestrator on real news feeds.

Body parameters (optional):
- `minScore`: Minimum candidate selection score threshold (default: `40`).
- `refresh`: Force fresh ingestion scan (`true`).

Response sample:
```json
{
  "executionId": "run_1785169773152_79rkmq",
  "status": "SUCCESS",
  "startedAt": "2026-07-27T21:59:33.152Z",
  "completedAt": "2026-07-27T21:59:33.520Z",
  "durationMs": 368,
  "totalStoriesProcessed": 166,
  "totalSelected": 42,
  "agentTelemetry": [...],
  "intelligence": [...]
}
```

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
# Start local server
npm run start
```
Open [http://localhost:3000/agents](http://localhost:3000/agents) to view the Agent Operations Command Center.
