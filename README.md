# NewsPulse AI — Autonomous Multi-Agent News Intelligence Platform

NewsPulse AI is an autonomous multi-agent news intelligence platform designed to discover, verify, rank, analyze, and summarize important news from multiple sources.

---

## 🏗 Enterprise Platform Architecture

```
                     EVENTS & VERIFIED INTELLIGENCE (Phases 1–8)
                                │
                                ▼
                       ORGANIZATION & RBAC ENGINE
                 (Owner, Admin, Manager, Analyst, Viewer)
                                │
                                ▼
                        SHARED WORKSPACES
           (Cyber Intel, AI Monitoring, Business Intel, Executive)
                                │
                                ▼
             INVESTIGATIONS & TASK MANAGEMENT ENGINE
      (Draft ➔ Open ➔ Active ➔ Review ➔ Completed ➔ Archived)
                                │
                                ▼
                 EVIDENCE DISCUSSIONS & ANNOTATIONS
               (Threaded Comments, @Mentions, Evidence Quotes)
                                │
                                ▼
              IMMUTABLE AUDIT LOG & TEAM ACTIVITY TIMELINE
                                │
                                ▼
            AI INTELLIGENCE REPORT & COMMAND CENTER (UI)
```

---

## 🏢 Phase 9: Enterprise Collaboration & Investigation Platform

Phase 9 transforms NewsPulse AI into a multi-user enterprise collaboration platform for strategic intelligence operations.

### 1. Granular Role-Based Access Control (`src/lib/enterprise/roles.ts`, `permissions.ts`)
- **Roles**: `OWNER`, `ADMIN`, `MANAGER`, `ANALYST`, `RESEARCHER`, `VIEWER`, `GUEST`.
- **Permissions**: `VIEW_EVENTS`, `EDIT_INVESTIGATIONS`, `ASSIGN_TASKS`, `MANAGE_MEMBERS`, `MANAGE_WATCHLISTS`, `EXPORT_REPORTS`, `DELETE_COMMENTS`, `MANAGE_ORGANIZATION`, `INVITE_MEMBERS`, `CONFIGURE_ALERTS`.

### 2. Investigation Lifecycle Engine (`src/lib/enterprise/investigations.ts`)
- **State Machine**: `DRAFT` $\rightarrow$ `OPEN` $\rightarrow$ `ACTIVE` $\rightarrow$ `AWAITING_REVIEW` $\rightarrow$ `COMPLETED` $\rightarrow$ `ARCHIVED`.
- Tracks priority (`CRITICAL`, `HIGH`, `MEDIUM`, `LOW`), assignees, linked event clusters, evidence counts, and tags.

### 3. Collaborative Tasks & Evidence Discussions (`src/lib/enterprise/tasks.ts`, `comments.ts`, `mentions.ts`)
- **Tasks**: Analyst assignments (`TODO`, `IN_PROGRESS`, `REVIEW`, `DONE`) with due dates and evidence checklists.
- **Evidence Discussions**: Threaded discussion comments with `@username` mentions, quoted evidence references, and emoji reactions attached directly to event clusters or investigations.

### 4. Immutable Audit Logging (`src/lib/enterprise/audit.ts`)
- Records user actions, privilege changes, investigation state transitions, task assignments, and posted comments (`timestamp`, `userId`, `userName`, `userRole`, `action`, `targetResource`).

---

## 📌 Enterprise API Reference

### `GET /api/organizations`
Returns organization profile, departments, teams, and member roster.

### `GET /api/workspaces`
Returns shared enterprise workspaces.

### `GET & POST /api/investigations`
Retrieve, create, or update enterprise investigations and lifecycle statuses.

### `GET & POST /api/tasks`
Retrieve, create, or update collaborative analyst tasks and checklists.

### `GET & POST /api/comments`
Retrieve and post evidence-linked discussion thread comments.

### `GET /api/audit`
Returns searchable immutable audit logs.

---

## 🚀 Getting Started & Testing

### Run Tests
```bash
# Run Vitest test suite (57 Unit & Integration tests)
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
