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
- **MCQ milestone** — full-screen exam player (instructions, flag for review,
  review screen, keyboard shortcuts, accessible, Urdu RTL, figures that never
  mirror), deadline enforced server-side, ~300 original questions (verbal,
  mechanical, GK; English + Urdu), and an admin question bank at
  `/admin/questions` with editor, figure upload, bulk publish and CSV/JSON
  import. Scraping of third-party sites is built but **off by default** — see
  below.
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
  subscriptions, invoices, refunds, expert-review queue, credit ledger,
  incident runbook.
- **Admin panel** (`/admin`) — its own full-width shell with a business
  dashboard, user administration, billing, credits, provider integrations,
  issued API keys, system health and the audit trail. See below.
- **Mobile** — Expo/React Native app (`mobile/`) consuming the same API with
  offline flashcards/digest and queued submission sync.

Background jobs (PDF import, OCR, STT, AI evaluation, news ingestion,
scraping) run in a worker: **`npm run worker`** (separate process).

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

| Command                  | What it does                                                       |
| ------------------------ | ------------------------------------------------------------------ |
| `npm run dev`            | Start the dev server on a guaranteed-free port                     |
| `npm run build`          | Production build (fails on type errors)                            |
| `npm start`              | Start the production server (after `build`)                        |
| `npm run stop`\*         | Stop a backgrounded server this project started                    |
| `npm run lint`           | ESLint (flat config)                                               |
| `npm run typecheck`      | `tsc --noEmit`                                                     |
| `npm run format`         | Prettier write                                                     |
| `npm test`               | Vitest unit/integration suite                                      |
| `npm run test:e2e`       | Playwright end-to-end suite (starts the app itself)                |
| `npm run ci`             | **The gate:** format check + lint + typecheck + tests, in sequence |
| `npm run check-env`      | Validate `.env` against the schema                                 |
| `npm run preflight`      | Validate env + confirm Postgres/Redis reachable                    |
| `npm run db:setup`       | Create DB + role (idempotent)                                      |
| `npm run db:generate`    | Generate a Drizzle migration from schema changes                   |
| `npm run db:migrate`     | Apply pending migrations                                           |
| `npm run db:seed`        | Seed baseline data (idempotent)                                    |
| `npm run db:studio`      | Open Drizzle Studio                                                |
| `npm run backup`         | Dump the database to `backups/`                                    |
| `npm run restore`        | Restore a dump (prompts before overwriting)                        |
| `npm run sweep-attempts` | Close timed tests left open past their deadline (run hourly)       |

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
  app/
    (app)/             candidate-facing shell
    (admin)/           admin panel shell (full width, own nav and auth boundary)
    (auth)/ (exam)/    sign-in and distraction-free exam shells
    api/               route handlers
  components/
    admin/             admin screens, shell, shared table/figure primitives
    ui/                design-system primitives shared across shells
  lib/
    env/               Zod-validated environment config (fail-fast)
    db/                Drizzle client + schema
    admin/             user administration, metrics, integrations, API clients
    billing/           plans, quota, subscriptions, credit ledger
    crypto/            AES-256-GCM envelope for secrets stored in the database
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

## Admin panel

`/admin` is a separate route group (`src/app/(admin)/`) with its own shell: a
dark navigation rail, full desktop width, and an authorisation boundary at the
layout. Admins see everything; content editors see only the content screens.

| Screen                | What it is for                                                           |
| --------------------- | ------------------------------------------------------------------------ |
| `/admin`              | Signups, revenue, active users, AI spend, conversion, alerts, health     |
| `/admin/users`        | Roster with filters; a drawer per account for plan, credits, role, state |
| `/admin/billing`      | Payments, refunds, invoices, gateway mix, plan pricing and entitlements  |
| `/admin/credits`      | Credit ledger, balances, and bulk grants by email or by plan             |
| `/admin/integrations` | Provider credentials, connection tests, AI and gateway usage             |
| `/admin/api-keys`     | Issue and revoke inbound API keys with scopes and per-key rate limits    |
| `/admin/system`       | Dependency health, queue depth, storage, backups, pipeline backlog       |
| `/admin/audit`        | Every administrative action, append-only                                 |

Three rules the code depends on:

- **Credits are overflow, not the meter.** One credit buys one AI evaluation,
  and only once the plan's daily allowance is spent — so a credit balance can
  never make a candidate worse off. Every movement writes to `credit_ledger`
  in the same transaction as the cached balance
  (`src/lib/billing/credits.ts`).
- **Integration secrets are write-only.** Credentials are encrypted with
  AES-256-GCM (`src/lib/crypto/secrets.ts`) and API responses carry a mask,
  never the value. A stored credential overrides the matching environment
  variable, so keys can be rotated without a redeploy; with nothing stored the
  `.env` value still wins.
- **Inbound API keys are hashed.** The plaintext is returned once, at creation,
  and never again — only a SHA-256 hash and the public prefix are stored.

Promote an account with `npm run set-role -- you@example.com admin`.

---

## Question content and scraping

- **Hand-authored banks** live in `src/lib/db/seed-data/*-questions.ts` and are
  loaded by `npm run db:seed` (re-running it also applies corrected answer
  keys). Admins add more at `/admin/questions` or in bulk at
  `/admin/questions/import` (dry run first; download the CSV template there).
- **Scraping** (`/admin/sources`) fetches nothing unless ALL of these hold:
  `SCRAPE_ENABLED=true` and the domain in `SCRAPE_ALLOWED_DOMAINS` (server
  `.env`), the domain enabled in `/admin/sources`, a person has confirmed they
  read that site's terms, and robots.txt allows it. It uses an honest
  User-Agent (`SCRAPE_CONTACT`), keeps `SCRAPE_DOMAIN_DELAY_MS` between
  requests to a site, and stops on any sign of access control.
- Scraped third-party questions land in review marked **Rewrite required** and
  cannot be approved until they are reworded (checked on the server). Keep any
  one site's share of the bank small — `/admin/sources` shows it per site.
  robots.txt compliance is not terms-of-service compliance, and rewording does
  not cure copying a whole collection.

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
