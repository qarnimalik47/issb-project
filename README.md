# ISSB Preparation Platform

An independent web (later mobile) platform for practising the full ISSB test
battery under realistic conditions, with structured, rubric-based feedback.

> **Disclaimer.** This is an independent practice tool. It is **not** affiliated
> with, endorsed by, or connected to the ISSB or the Pakistan Armed Forces, and
> it does **not** predict, promise, or guarantee any selection outcome.

**Current status: Phases 0–10 implemented.** See
[`ISSB-PREP-PLATFORM-BUILD-PROMPT.md`](./ISSB-PREP-PLATFORM-BUILD-PROMPT.md) for
the full plan.

What's built:

- **Foundation** — Next.js 16 + strict TS, Zod env, port-conflict handling,
  Drizzle, structured logging, health checks, backup/restore, docs + ADRs.
- **Identity** — email/phone OTP auth, web sessions + mobile JWT/refresh, RBAC,
  bilingual (English/Urdu, RTL) UI, rate limiting, audit log, export/delete.
- **Admin & content** — question CRUD, queued PDF import (staging/review/dedup),
  rubric management, storage abstraction + signed URLs.
- **Objective engine** — server-authoritative timed MCQ, autosave/resume,
  deterministic scoring, one-active-attempt, analytics.
- **Written capture** — WAT/SCT/SRT/essay/story players, paper mode + queued
  OCR + mandatory confirmation.
- **AI evaluation** — provider-agnostic (mock + Anthropic/OpenAI/Google),
  versioned prompts, rubric-driven strict validation, dual cross-check, quota
  enforcement, prompt-injection defences, golden-set + accuracy harness,
  distress handling.
- **Profile** — cross-test scores with evidence, contradiction detection,
  confidence, OPI analysis, study plan, PDF report, full simulation.
- **Voice** — browser recording + STT, lecturette analysis, PIQ-based mock
  interview, GD/GPE, GTO explainers.
- **GK** — SM-2 flashcards, RSS ingestion, editorial approval, digest, quizzes.
- **Payments/ops** — mock + JazzCash/Easypaisa gateways, idempotent webhooks,
  subscriptions, invoices, refunds, expert-review queue, admin dashboard,
  incident runbook.
- **Mobile** — Expo/React Native app (`mobile/`) consuming the same API with
  offline flashcards/digest and queued submission sync.

Background jobs (PDF import, OCR, STT, AI evaluation, news ingestion) run in a
worker: **`npm run worker`** (separate process).

---

## Prerequisites

This project runs **natively on macOS** (no Docker, by design — rule 2.2).

| Requirement | Version used         | Notes                                          |
| ----------- | -------------------- | ---------------------------------------------- |
| Node.js     | ≥ 20 (dev used 25.4) | See `.nvmrc`.                                  |
| PostgreSQL  | 16+                  | Must already be installed and running locally. |
| Redis       | any recent           | Must already be installed and running locally. |

Verify they are up:

```bash
node -v
psql --version && psql -d postgres -c 'select 1'   # Postgres reachable
redis-cli ping                                      # → PONG
```

---

## Setup from a clean checkout

```bash
# 1. Install dependencies
npm install

# 2. Create your local environment file and fill in secrets
cp .env.example .env
#    - set SESSION_SECRET:   openssl rand -hex 32
#    - set the password in DATABASE_URL to a value you choose

# 3. Create the dedicated database + least-privilege role (idempotent).
#    Reads the app password from your .env. Requires a local Postgres superuser
#    (the default homebrew install makes your macOS user one).
npm run db:setup

# 4. Apply migrations and seed baseline data
npm run db:migrate
npm run db:seed

# 5. (optional) Verify env + dependencies are reachable
npm run preflight

# 6. Run it
npm run dev
```

The dev server prints the URL it bound to (default `http://127.0.0.1:4310`; it
auto-selects a free port if 4310 is busy). Open it, and check
`http://127.0.0.1:4310/api/health` — it should report `status: "ok"` with
`database` and `redis` both healthy.

---

## Everyday commands

| Command               | What it does                                                       |
| --------------------- | ------------------------------------------------------------------ |
| `npm run dev`         | Start the dev server on a guaranteed-free port                     |
| `npm run build`       | Production build (fails on type errors)                            |
| `npm start`           | Start the production server (after `build`)                        |
| `npm run stop`\*      | Stop a backgrounded server this project started                    |
| `npm run lint`        | ESLint (flat config)                                               |
| `npm run typecheck`   | `tsc --noEmit`                                                     |
| `npm run format`      | Prettier write                                                     |
| `npm test`            | Vitest unit/integration suite                                      |
| `npm run test:e2e`    | Playwright end-to-end suite (starts the app itself)                |
| `npm run ci`          | **The gate:** format check + lint + typecheck + tests, in sequence |
| `npm run check-env`   | Validate `.env` against the schema                                 |
| `npm run preflight`   | Validate env + confirm Postgres/Redis reachable                    |
| `npm run db:setup`    | Create DB + role (idempotent)                                      |
| `npm run db:generate` | Generate a Drizzle migration from schema changes                   |
| `npm run db:migrate`  | Apply pending migrations                                           |
| `npm run db:seed`     | Seed baseline data (idempotent)                                    |
| `npm run db:studio`   | Open Drizzle Studio                                                |
| `npm run backup`      | Dump the database to `backups/`                                    |
| `npm run restore`     | Restore a dump (prompts before overwriting)                        |

\* `stop` is for servers started in the background; a foreground `npm run dev`
is stopped with Ctrl+C.

---

## Backup & restore

```bash
npm run backup                                   # → backups/issb_dev_<timestamp>.dump
npm run restore backups/issb_dev_<timestamp>.dump   # prompts for confirmation
```

The restore path is **tested**: back up, restore into a scratch DB, compare row
counts. See `docs/ARCHITECTURE.md` for the exact procedure.

---

## Project layout

```
src/
  app/                 Next.js App Router (pages, layout, error boundaries, /api/health)
  lib/
    env/               Zod-validated environment config (fail-fast)
    db/                Drizzle client + schema
    redis/             ioredis client (dedicated DB index)
    logger/            pino structured JSON logging (secrets redacted)
    health/            dependency health checks
scripts/               operational scripts (start/stop/migrate/seed/backup/restore, port util)
drizzle/               versioned SQL migrations (committed)
tests/
  unit/                Vitest unit/integration tests
  e2e/                 Playwright end-to-end tests
docs/                  ARCHITECTURE, PORTS, SECURITY, CONTRIBUTING, DATABASE, ADRs, backlog
```

---

## Notes / known local quirks

- The repo currently lives on an external SSD (`/Volumes/T9-Mac`). Next.js prints
  a "slow filesystem" notice; it is harmless. Moving the repo to the internal
  disk removes it.
- Two environments are supported (`APP_ENV=development|production`) with
  **separate databases** (`issb_dev`, `issb_prod`). Production refuses to start
  against a `_dev` database.

See [`docs/`](./docs) for architecture, security posture, ports, database schema
and Architecture Decision Records.
