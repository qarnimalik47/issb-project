# Security

Security is a requirement across every phase, not a phase of its own (rule 1.3).
This document records the Phase 0 posture and the standing rules all later work
must follow.

## Secrets

- All secrets live in `.env`, which is **git-ignored**. `.env.example` is the
  committed template and contains no real values.
- Secrets are never logged. The logger (`src/lib/logger`) redacts `password`,
  `token`, `secret`, `apiKey`, `authorization`/`cookie` headers, `DATABASE_URL`
  and `REDIS_URL` as a safety net.
- Secrets are never sent to the client. Configuration is only read on the server
  via `src/lib/env`.

## Configuration validation

Every environment variable is validated at startup against a Zod schema
(`src/lib/env/schema.ts`). The app fails fast with a readable report rather than
running with bad or missing configuration. `SESSION_SECRET` must be ≥ 32 chars.

## Database

- A **dedicated role** (`issb_app`) with `NOSUPERUSER NOCREATEROLE NOCREATEDB`
  owns only this project's databases. It cannot touch other projects' data.
- Access is over `127.0.0.1` only.
- Drizzle uses parameterised queries; no string-concatenated SQL (rule 1.3).

## Network

- The app binds to `127.0.0.1` by default (local, non-public machine).
- `poweredByHeader` is disabled. `robots` is set to no-index for now.
- The health endpoint sends `cache-control: no-store`.

## Standing rules for later phases

These are enforced as each surface is built:

- Validate **every** input at the boundary with Zod — request bodies, query
  params, headers, uploads, and **AI responses**.
- Every API route declares its authN/authZ explicitly; default deny.
- Rate-limit every public and every AI-invoking endpoint.
- Treat all user text sent to an AI model as **data, never instruction**;
  assume prompt injection; validate the shape of every AI response.
- Uploads: validate MIME + magic bytes, size limits, strip EXIF, store outside
  the web root, serve only via signed URLs.
- Hash passwords with argon2id or bcrypt (appropriate cost).
- Never trust the client for timing, scoring, entitlement, identity or quota.

## Reporting

This is a private project in Phase 0. A vulnerability disclosure process will be
added before any public exposure (Phase 9).
