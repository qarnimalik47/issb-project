# Contributing

## Ground rules (from the master build prompt)

- **No guessing.** Never invent an API, config key, column, or business rule. If
  a fact is needed, verify it or ask the product owner.
- **No shortcuts.** No `any` (except where a third-party type forces it, with a
  comment). No dead/commented-out code. No `TODO` in merged code — fix it or
  file it in [`backlog.md`](./backlog.md).
- **Security and performance are requirements**, not afterthoughts. See
  [SECURITY.md](./SECURITY.md) and rule 1.4 (indexes, no N+1, queue slow work,
  paginate lists, explicit timeouts).
- **Accuracy is the product.** Objective scoring is deterministic and
  server-side. Subjective evaluation uses stored, versioned rubrics.

## Workflow

1. One branch per phase. Do not start a phase until the product owner approves
   it. Restate scope and open questions first.
2. Small, focused commits using **Conventional Commits**
   (`feat:`, `fix:`, `chore:`, `docs:`, `refactor:`, `test:`).
3. Before opening/merging, `npm run ci` must pass (format + lint + typecheck +
   tests). No phase is complete with a failing or skipped test.
4. Update docs and ADRs in the same change that introduces the behaviour.
5. Migrations are generated (`npm run db:generate`), reviewed, and committed.
   Never hand-edit the schema against the database.

## Code style

- Prettier + ESLint (flat config) enforce style; a pre-commit hook runs
  `lint-staged`. Run `npm run format` before committing if needed.
- Keep modules small with a header comment stating their purpose (rule 1.6).
- Inside `src/lib`, prefer relative imports (not the `@/` alias) so scripts run
  under `tsx` resolve the same modules.

## Tests

- Business logic → unit tests. Scoring logic → exhaustive unit tests.
- API routes → integration tests (success, validation failure, unauthorised,
  quota exceeded).
- AI evaluation → golden-set regression tests (Phase 5+).
- Critical journeys → Playwright E2E.

## Adding an ADR

Copy the format of an existing file in [`adr/`](./adr): context, options
considered, decision, consequences. Number sequentially.
