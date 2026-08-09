# NewsPulse AI — Autonomous Multi-Agent News Intelligence Platform

NewsPulse AI is an autonomous multi-agent news intelligence platform designed to discover, verify, rank, analyze, and summarize important news from multiple sources.

---

## 🏗 System Architecture & Personalization Flow

```
                     EVENTS & VERIFIED INTELLIGENCE (Phases 1–7)
                                │
                                ▼
                       USER PROFILE & WORKSPACES
                                │
                                ▼
                      CUSTOM WATCHLIST ENGINE
                                │
                                ▼
                     EXPLAINABLE RANKING ENGINE
                    ("Why Am I Seeing This?")
                                │
                                ▼
                    PERSONAL INTELLIGENCE FEED
                                │
                                ▼
             DAILY BRIEFINGS & WEEKLY INTELLIGENCE REPORTS
                                │
                                ▼
            AI INTELLIGENCE REPORT & COMMAND CENTER (UI)
```

---

## 🎯 Phase 8: Personalized Intelligence Platform

Phase 8 transforms NewsPulse AI into a personalized news intelligence platform.

### 1. Custom Watchlists Engine (`src/lib/personalization/watchlists.ts`)
- Unlimited custom watchlists with keyword, company, product, person, technology, and exclude rules.
- Evaluates incoming Event Clusters against active workspace watchlists and extracts matching entities.

### 2. Personal Feed & Explainable Ranking Engine (`src/lib/personalization/ranking.ts`, `feedEngine.ts`)
- Computes 0–100 relevance scores based on Watchlist matches (+35 pts), Entity matches (+25 pts), Category match (+20 pts), and Breaking News/Corroboration level (+25 pts).
- Displays transparent, human-readable match reasons ("Why am I seeing this?").

### 3. Executive Daily Briefings & Weekly Reports (`src/lib/personalization/briefings.ts`)
- **Daily Morning Briefing**: Synthesizes Top Verified Events, Watchlist Updates, Breaking News, AI Summaries, and Pending Developments.
- **Weekly Intelligence Summary**: Synthesizes Major Events, Emerging Trends, Active Entities, and Sector Summaries.

### 4. Workspaces & Profile Management (`src/lib/personalization/profile.ts`)
- Supports multiple isolated workspaces (`Personal Space`, `Academic Research`, `Business Intelligence`, `Startup Space`, `University`) with independent watchlists, preferences, saved searches, and alerts.

---

## 📌 Personalization API Reference

### `GET /api/feed`
Returns personalized intelligence feed with 0–100 relevance scores and explainable match reasons.

### `GET & PUT /api/profile`
Get user profile and switch active workspaces.

### `GET & POST /api/watchlists`
Retrieve and create custom watchlists.

### `GET /api/briefings`
Returns daily morning briefing and weekly intelligence report.

### `GET /api/recommendations`
Returns explainable recommendations.

### `GET & DELETE /api/history`
Retrieve or clear reading history.

### `GET /api/alerts`
Returns personal alerts.

---

## 🚀 Getting Started & Testing

### Run Tests
```bash
# Run Vitest test suite (52 Unit & Integration tests)
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
