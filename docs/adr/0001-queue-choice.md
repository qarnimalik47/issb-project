# 0001 — Background queue: BullMQ + Redis

- **Status:** Accepted
- **Date:** 2026-09-17
- **Phase:** 0

## Context

Rule 1.4 forbids running slow work inside an HTTP request: AI evaluation, OCR,
speech-to-text, PDF parsing, email and news ingestion must all go to a
background queue. We need to pick the queue technology now so the storage and
worker abstractions can be designed around it, even though jobs are not
implemented until Phase 4/5.

Environment constraints (§2): the app runs natively on a Mac Mini with no
Docker. The build prompt (§2.4, tech stack) specifies **BullMQ + Redis, or
pg-boss if Redis is unavailable**, with the decision recorded as an ADR.

## Options considered

1. **BullMQ + Redis.** Mature, widely used, good observability, supports
   retries, delays, rate limiting, dead-letter patterns and concurrency — all of
   which the AI pipeline (Phase 5) needs. Requires Redis.
2. **pg-boss (Postgres-backed).** No extra service; uses the existing Postgres.
   Fewer moving parts, but less throughput headroom and fewer built-in features
   for the AI workload.

## Decision

Use **BullMQ + Redis**. During Phase 0 setup we confirmed Redis is already
installed and running on the machine (`redis-cli ping` → `PONG`). To avoid
disturbing the other projects that share this Redis, we use a **dedicated
logical database index** (`REDIS_DB`, default **14**, empty at setup time).

## Consequences

- A running Redis is a hard dependency; the health check and preflight verify it.
- Job code (Phase 4/5) targets BullMQ's API. Redis connection is centralised in
  `src/lib/redis`.
- If Redis ever becomes unavailable on this machine, revisit with a pg-boss
  fallback; the worker layer will be written behind a thin interface to keep
  that option open.
- Redis index selection is documented in `docs/PORTS.md`.
