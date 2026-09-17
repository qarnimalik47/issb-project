# 0003 — Authentication approach

- **Status:** Accepted
- **Date:** 2026-09-17
- **Phase:** 0

## Context

The product needs authentication for web now and mobile later (Phase 10). The
tech stack (§3) specifies: **session-based auth for web, JWT + refresh tokens for
mobile**, with **email and phone (OTP) login**. Auth itself is built in Phase 1;
this ADR records the approach and the Phase 0 groundwork so the rest of the
foundation is shaped correctly.

## Options considered

1. **Sessions everywhere (cookies).** Simple and secure for web; awkward for a
   native mobile client, which prefers bearer tokens.
2. **JWT everywhere.** Convenient for mobile; stateless JWTs are hard to revoke
   promptly, which is undesirable for a paid product with entitlements and
   account lockout.
3. **Hybrid (chosen): server sessions for web, JWT + refresh for mobile.**
   Matches the spec and each client's natural model.

## Decision

Use a **hybrid** model:

- **Web:** server-side sessions carried in a secure, http-only, same-site
  cookie. Session secret is `SESSION_SECRET` (validated at startup, ≥ 32 chars).
- **Mobile (Phase 10):** short-lived JWT access tokens plus rotating refresh
  tokens, issued by the same API.
- **Login methods:** email and phone (OTP), per §4 / Phase 1.
- **Passwords:** hashed with argon2id (or bcrypt at appropriate cost) — never
  stored in plaintext or reversibly.

Phase 0 groundwork: `SESSION_SECRET` is declared and validated now; no auth code
is written yet (rule 1.2 — no unused code).

## Consequences

- A single API backs both clients; authorisation checks live server-side and
  default deny (rule 1.3).
- Sessions allow prompt revocation (logout, lockout, entitlement changes);
  refresh-token rotation gives mobile similar control.
- Every route will declare its authN/authZ explicitly from Phase 1 onward.
