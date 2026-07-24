# NewsPulse AI — Autonomous Multi-Agent News Intelligence Platform

NewsPulse AI is an autonomous multi-agent news intelligence platform designed to discover, verify, rank, analyze, and summarize important news from multiple sources.

---

## 🏗 Phase 2 Architecture & Ingestion Flow

In Phase 2, NewsPulse AI replaces mock news feeds with a production-quality, server-side news ingestion layer powered by verified RSS/Atom feeds.

```
RSS / Atom Feeds (TechCrunch, Ars Technica, Wired, CNBC, BBC, NPR)
                        │
                        ▼
      Central Source Registry (src/lib/news/sources.ts)
                        │
                        ▼
Parallel Fetchers with Timeout & Fault Tolerance (Promise.allSettled)
                        │
                        ▼
   Normalizer & HTML Sanitizer (src/lib/news/normalize.ts)
                        │
                        ▼
Deterministic Deduplication Engine (src/lib/news/deduplicate.ts)
                        │
                        ▼
    Server-Side Cache (src/lib/news/ingest.ts - 5m TTL)
                        │
                        ▼
       GET /api/news Endpoint (src/app/api/news/route.ts)
                        │
                        ▼
NewsPulse AI Command Dashboard (PulseContext -> Overview, Category & Sources pages)
```

---

## 📰 Source Strategy & Registry

All news stories originate from verified public RSS/Atom feeds configured in `src/lib/news/sources.ts`:

- **TechCrunch** (`https://techcrunch.com/feed/`) — AI & Tech
- **Ars Technica** (`https://feeds.arstechnica.com/arstechnica/index`) — AI & Tech
- **Wired** (`https://www.wired.com/feed/rss`) — AI & Tech
- **CNBC Business** (`https://www.cnbc.com/id/10000115/device/rss/rss.html`) — Business
- **BBC World News** (`https://feeds.bbci.co.uk/news/world/rss.xml`) — World
- **NPR World News** (`https://feeds.npr.org/1004/rss.xml`) — World

---

## ⚙️ Ingestion, Normalization & Deduplication

1. **Normalization (`normalize.ts`)**:
   - Strips raw HTML tags and decodes HTML entities (`&amp;`, `&quot;`, etc.) from XML descriptions.
   - Parses pubDates into clean ISO 8601 timestamps with fallback handling.
   - Maps raw source categories into `ai-tech`, `business`, and `world`.
2. **Deduplication (`deduplicate.ts`)**:
   - **Canonical Article URL**: Prevents duplicate entries sharing exact article URLs.
   - **Normalized Headline Match**: Strips punctuation, converts to lowercase, and collapses whitespace to detect identical stories across different outlets while merging corroborating source attributions.
3. **Fault Tolerance & Caching (`ingest.ts`)**:
   - Uses `Promise.allSettled` so an individual feed outage does not break other feeds.
   - 5-minute server-side memory cache with support for `?refresh=true` forced cache revalidations.

---

## 🚀 Getting Started & Local Development

### Prerequisites
- Node.js 18+
- npm

### Installation
```bash
# Install dependencies
npm install
```

### Run Tests
```bash
# Run Vitest unit test suite for deterministic ingestion logic
npx vitest run
```

### Run Linter & Build
```bash
# Run ESLint
npm run lint

# Build production bundle
npm run build
```

### Start Local Server
```bash
# Start Next.js server
npm run start
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📌 API Reference

### `GET /api/news`

Query parameters:
- `category` (optional): `ai-tech` | `business` | `world`
- `source` (optional): Source ID (e.g. `techcrunch`)
- `limit` (optional): Truncate response to N stories
- `refresh` (optional): Set to `true` to force a cache refresh

Example:
```bash
curl "http://localhost:3000/api/news?category=ai-tech&limit=10"
```

---

## ⚠️ Known Limitations & Future Phase Roadmap

- **Phase 3 (Upcoming)**: Autonomous multi-agent verification, LLM executive summaries, importance scoring, and semantic vector clustering.
- **Current Intelligence Metrics**: Real ingested stories do not display simulated scores. Intelligence fields are truthfully marked as *"Verification Pending"* or *"Not evaluated"*.
