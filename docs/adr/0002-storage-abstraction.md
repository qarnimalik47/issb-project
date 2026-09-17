# 0002 — File storage abstraction

- **Status:** Accepted
- **Date:** 2026-09-17
- **Phase:** 0

## Context

Later phases store user-uploaded files: answer-sheet photos (Phase 4), voice
recordings (Phase 7), generated PDF reports (Phase 6). Rule 1.3 requires uploads
to be validated, stored **outside the web root**, and served only through
**signed URLs**. The tech stack (§3) says: local filesystem now, but the storage
layer must be **abstracted so it can move to S3-compatible storage later without
rewrites**.

## Options considered

1. **Write directly to the local filesystem at each call site.** Simplest, but
   couples every feature to local paths and makes a future move to object
   storage a large, risky refactor.
2. **A storage interface with a local-filesystem adapter now.** One small
   interface (`put`, `get`, `delete`, `signUrl`, metadata) with a local adapter;
   an S3-compatible adapter can be added later behind the same interface.

## Decision

Adopt a **storage interface with pluggable adapters**. Phase 0 records the
decision and reserves configuration (`STORAGE_DIR`, default `./storage`, which is
outside Next.js's `public/` web root and git-ignored). The interface and local
adapter are implemented in Phase 4, when the first upload feature lands — we do
not build unused code in Phase 0 (rule 1.2).

## Consequences

- All file access in later phases goes through the storage interface; no feature
  reads or writes disk paths directly.
- Signed-URL generation is part of the interface from the start, so access
  control is consistent regardless of backend.
- Moving to S3-compatible storage means adding one adapter and swapping config —
  no call-site changes.
- `STORAGE_DIR` lives outside the web root; files are never served statically,
  only via signed URLs through an authorised route.
