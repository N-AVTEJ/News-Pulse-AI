# NewsPulse AI — Autonomous Multi-Agent News Intelligence Platform

NewsPulse AI is an autonomous multi-agent news intelligence platform designed to discover, verify, rank, analyze, and summarize important news from multiple sources.

---

## ⚡ Extensible Intelligence Platform Architecture (Phases 1–11)

```
                     EVENTS, VERIFICATION, & KNOWLEDGE GRAPH (Phases 1–10)
                                │
                                ▼
                       INTERNAL EVENT BUS
         (EventClusterCreated, VerificationCompleted, TaskAssigned)
                                │
                                ▼
               PLUGIN SDK & CAPABILITY-BASED SANDBOX
         (Data Connectors, Analysis Modules, Workflow Actions)
                                │
                                ▼
              VISUAL WORKFLOW AUTOMATION ENGINE
            (Triggers ➔ Conditions ➔ Actions ➔ Webhooks)
                                │
                                ▼
                 ENTERPRISE INTEGRATION ADAPTERS
              (Slack, Teams, Jira, GitHub, SIEM, Webhooks)
                                │
                                ▼
             VERSIONED PUBLIC API PLATFORM & AUTH
                (API Keys, Rate Limiting, SDKs)
                                │
                                ▼
          DEVELOPER PORTAL & CUSTOM DASHBOARD BUILDER (UI)
```

---

## 🛠 Phase 11: Platform SDK, Automation Builder & Enterprise Integrations

Phase 11 transforms NewsPulse AI into an extensible, enterprise-grade intelligence platform.

### 1. Plugin SDK & Capability Sandbox (`src/lib/platform/pluginManifest.ts`, `pluginSandbox.ts`)
- **Plugin Categories**: Data Connector, Analysis Module, Visualization, Notification Provider, Export Provider, Authentication Provider, Workflow Action, Utility.
- **Manifest Contract**: Strict semver validation (`1.0.0`), entryPoint declaration, capability list, and permissions (`READ_NEWS`, `WRITE_REPORTS`, `EMIT_NOTIFICATIONS`, `NETWORK_OUTBOUND`, `READ_GRAPH`).
- **Capability Sandbox**: Enforces strict permission validation before allowing filesystem, network, or data operations.

### 2. Internal Event Bus (`src/lib/platform/eventBus.ts`)
- Asynchronous publish/subscribe event bus supporting `EventClusterCreated`, `VerificationCompleted`, `AnalysisGenerated`, `InvestigationUpdated`, `TaskAssigned`, `NotificationSent`.

### 3. Visual Workflow Automation Engine (`src/lib/platform/workflow/engine.ts`)
- Visual node-edge workflow engine supporting node execution (`TRIGGER`, `VERIFICATION`, `CONDITION`, `NOTIFICATION`, `WEBHOOK`), versioning, execution logs, and retries.

### 4. Abstracted Enterprise Integration Adapters (`src/lib/platform/integrations/`)
- Plug-and-play adapter interface (`baseAdapter.ts`) supporting Slack, Microsoft Teams, Jira, GitHub, Email, Webhooks, and SIEM without hardcoding vendor logic into core platform.

### 5. Outbound Webhook Delivery System (`src/lib/platform/webhooks.ts`)
- Outbound webhooks with HMAC-SHA256 signature verification, delivery logs, and retries.

### 6. Versioned Public API & Auth (`src/lib/platform/api/auth.ts`, `rateLimiter.ts`)
- REST API v1 (`/api/v1/events`, `/api/v1/workflows`, `/api/v1/plugins`, `/api/v1/keys`, `/api/v1/webhooks`).
- Bearer API token authentication, scopes (`read:events`, `write:workflows`, `admin:plugins`), and token-bucket rate limiting.

---

## 📌 Public API Reference (v1)

### `GET /api/v1/events`
Returns verified intelligence events (supports `Authorization: Bearer <key>`).

### `GET & POST /api/v1/workflows`
Retrieve workflow definitions or trigger automated workflow executions.

### `GET & POST /api/v1/plugins`
Retrieve or register capability-validated platform extension plugins.

### `GET & POST /api/v1/keys`
Generate and list API keys and scopes.

### `GET & POST /api/v1/webhooks`
Dispatch signed outbound webhooks and view delivery logs.

### `GET /api/developer`
Returns developer portal metadata, platform SDK version, and rate limit specifications.

---

## 🚀 Getting Started & Testing

### Run Tests
```bash
# Run Vitest test suite (65 Unit & Integration tests)
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
Open [http://localhost:3000](http://localhost:3000) to view the Developer Portal & Workflow Builder.
