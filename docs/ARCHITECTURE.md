# Architecture

Phase 0 foundation. This document describes the shape of the system as it
stands and the principles every later phase must preserve.

## Runtime topology

Everything runs natively on a single Mac Mini (rule 2.1, 2.2 — no Docker, no
cloud). Three long-lived processes/services are involved:

```
┌─────────────────────────────────────────────────────────────┐
│  Mac Mini (macOS)                                            │
│                                                              │
│   Next.js (web + API)  ──┬──►  PostgreSQL  (issb_dev/_prod)  │
│    App Router, Node       │      dedicated role: issb_app    │
│    runtime, port 4310*    └──►  Redis  (logical DB index 14) │
│                                                              │
│   * resolved at startup by the port-conflict utility        │
└─────────────────────────────────────────────────────────────┘
```

Postgres and Redis are **pre-existing shared installs**. This project only ever
touches its own database (`issb_dev`, `issb_prod`) and its own Redis DB index
(`14`).

## Layers

- **Web + API** — Next.js App Router + TypeScript (strict). API routes serve the
  web app today and will serve the mobile app (Phase 10) later.
- **Configuration** (`src/lib/env`) — a Zod schema is the single source of truth
  for every env var. It is validated once at first import and **fails fast**
  with a human-readable report. No configuration value is hardcoded.
- **Database** (`src/lib/db`) — Drizzle ORM over the `postgres.js` driver with a
  pooled connection. Schema changes are made in `schema.ts`, then a versioned
  SQL migration is generated and committed (never hand-edited against the DB).
- **Redis** (`src/lib/redis`) — `ioredis` on a dedicated logical DB index. Backs
  the BullMQ queue (from Phase 4/5) and health checks.
- **Logging** (`src/lib/logger`) — pino structured JSON. Secrets and auth
  headers are redacted as a safety net; call sites still must not log user
  content.
- **Health** (`src/lib/health`, `/api/health`) — liveness + readiness. Returns
  200 only when Postgres and Redis are both reachable.

## Port-conflict handling (rule 2.3)

`scripts/lib/ports.ts` attempts a real bind on the preferred `APP_PORT`; if
busy it walks forward to the next free port and the start script reports the
change. We never kill a process holding a port. See [PORTS.md](./PORTS.md).

## Startup / shutdown

- `scripts/dev.ts` / `scripts/start.ts` validate env → resolve a free port →
  spawn Next → record the child PID under `.run/<mode>.pid`.
- `scripts/stop.sh` terminates only the PIDs recorded in `.run/` — never a
  process merely because it holds a port.

## Backup & restore (tested procedure)

Backups use `pg_dump --format=custom`. The restore path is verified as follows:

```bash
npm run backup                                   # dump issb_dev
createdb --owner=issb_app issb_restore_test      # scratch target
bash scripts/restore.sh backups/<file>.dump issb_restore_test --force
# compare app_metadata row counts between issb_dev and issb_restore_test
dropdb issb_restore_test
```

This was run during Phase 0 and the counts matched.

## Environments (rule 2.5)

`APP_ENV` is `development` or `production`, each with a **separate** database
(`issb_dev` / `issb_prod`). The env loader refuses to start a `production` app
whose `DATABASE_URL` points at a `_dev` database.

## Decisions

Non-obvious choices are recorded as ADRs in [`adr/`](./adr):

- [0001 — Queue: BullMQ + Redis](./adr/0001-queue-choice.md)
- [0002 — Storage abstraction](./adr/0002-storage-abstraction.md)
- [0003 — Auth approach](./adr/0003-auth-approach.md)
