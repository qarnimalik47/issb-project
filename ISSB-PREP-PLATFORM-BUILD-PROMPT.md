# ISSB PREPARATION PLATFORM — MASTER BUILD PROMPT

**Document version:** 1.0
**Audience:** AI coding CLI / engineering agent
**Product owner:** POP
**Read this entire document before writing a single line of code.**

---

## 0. HOW TO USE THIS DOCUMENT

1. This document defines a **premium commercial product**. It is not a prototype, not a demo, not a proof of concept.
2. The work is divided into **10 independent phases**. Each phase is self-contained: it has its own deliverables, its own tests, its own documentation, and its own acceptance criteria.
3. **Do not start a phase until the product owner explicitly approves it.** At the start of each phase, restate the scope of that phase and wait for a "go".
4. At the end of each phase, produce a completion report (see Section 5) and stop. Do not roll into the next phase automatically.
5. If anything in this document is ambiguous, contradictory, or missing, **ask the product owner**. Do not guess. Do not invent. Do not silently choose.

---

## 1. NON-NEGOTIABLE RULES

These rules apply to every phase, every file, every commit. Violating them means the work is rejected.

### 1.1 No guessing

- Never invent an API, a library function, a config key, a database column, or a business rule.
- If a fact is needed (an ISSB test timing, a payment gateway parameter, a library's behaviour), **verify it** in the official documentation or ask the product owner.
- If you are less than certain about something, say so explicitly and stop.
- Never write placeholder logic that "looks right" and silently returns fake data.

### 1.2 No shortcuts

- No `any` in TypeScript except where a third-party type genuinely forces it, and then with a comment explaining why.
- No commented-out dead code left in the repo.
- No "TODO: fix later" in merged code. Either fix it or open a tracked issue and reference it.
- No copy-pasted logic. Extract shared behaviour into properly named modules.
- No hardcoded values that belong in configuration, in the database, or in an environment variable.

### 1.3 Security is a requirement, not a phase

- Validate **every** input at the boundary with a schema (Zod). Never trust a request body, a query parameter, a header, a file upload, or an AI response.
- Never trust the client for anything that matters: test timing, scoring, entitlement, user identity, or quota.
- All secrets live in environment variables loaded from a `.env` file that is **git-ignored**. Never commit a key. Never log a key. Never send a key to the client.
- Every API route declares its authentication and authorisation requirements explicitly. Default deny.
- Parameterised queries only. No string-concatenated SQL anywhere, ever.
- Rate limit every public endpoint and every AI-invoking endpoint.
- Uploads: validate MIME type and magic bytes, enforce size limits, strip EXIF from images, store outside the web root, serve only through signed URLs.
- Treat all user-supplied text sent to an AI model as **data, never instruction**. Assume prompt-injection attempts. Validate the shape of every AI response before use.
- Hash passwords with a modern algorithm (argon2id or bcrypt with an appropriate cost). Never store plaintext or reversible secrets.

### 1.4 Performance is a requirement

- Every database query that runs in a request path must use an index. Prove it with `EXPLAIN ANALYZE` for any non-trivial query.
- No N+1 queries. Ever.
- Nothing slow runs inside an HTTP request: AI calls, OCR, speech-to-text, PDF parsing, email, and news ingestion all go to a background queue.
- Paginate every list endpoint. No unbounded `SELECT *`.
- Set explicit timeouts on every external call.
- Target: p95 under 300 ms for standard API routes (excluding queued work).

### 1.5 Accuracy is the product

- Objective tests (verbal, non-verbal, mechanical, GK MCQ) must be scored **deterministically and server-side**. These results are exactly correct or the product has failed.
- Subjective evaluations (WAT, SCT, stories, SRT, self-description, essay, planning, interview) must be produced against a **stored, versioned rubric**, never an open-ended "judge this" prompt.
- Every evaluation record stores: model name, model version, prompt version, rubric version, input hash, raw model output, parsed output, token counts, cost, latency, timestamp.
- Evaluations are **immutable**. Re-evaluation creates a new record; it never overwrites an old one.
- The system must never state or imply that it predicts a real ISSB outcome. Language is always about strengths, weaknesses and improvement.

### 1.6 Documentation

- Every phase produces documentation in `/docs` before it is considered complete.
- Every module has a header comment explaining its purpose.
- Every non-obvious decision is recorded as an ADR (Architecture Decision Record) in `/docs/adr/NNNN-title.md`: context, options considered, decision, consequences.
- The database schema is documented with a description for every table and every column.
- `README.md` must let a new developer set the project up from scratch on a clean machine.

### 1.7 Testing

- Business logic has unit tests. Scoring logic has exhaustive unit tests, including edge cases.
- API routes have integration tests covering success, validation failure, unauthorised access, and quota exceeded.
- AI evaluation has a **golden-set regression test**: a fixed set of sample answers with expected rubric outcomes, run whenever a prompt, rubric, or model changes.
- Critical user journeys have end-to-end tests.
- No phase is complete with a failing or skipped test.

### 1.8 Git discipline

- Small, focused commits with clear messages (Conventional Commits).
- One branch per phase, merged only after the phase acceptance criteria pass.
- Never commit generated files, uploads, `.env`, or dependencies.

---

## 2. ENVIRONMENT CONSTRAINTS (READ CAREFULLY)

### 2.1 Hosting

- The application runs **locally on a Mac Mini**. There is no cloud hosting.
- Design for this: no assumptions about managed services, serverless functions, cloud load balancers, or vendor-specific platform features.
- All services must run natively on macOS.

### 2.2 No Docker

- **Do not use Docker, Docker Compose, or containers of any kind.** The machine already has the required services installed natively.
- Use the existing local installations. Do not install duplicate versions of Postgres or other services.
- Provide plain shell scripts (`/scripts`) for start, stop, migrate, seed, backup, and restore.

### 2.3 Ports — critical

- **Multiple other projects run on this machine.** Port conflicts are unacceptable.
- Before binding any port, **check whether it is in use** (`lsof -i :PORT`). If it is busy, select a free port automatically and clearly report the port chosen.
- All ports must be configurable via environment variables, never hardcoded.
- Maintain `/docs/PORTS.md` listing every port this project uses and what runs on it.
- Never kill a process that is occupying a port. Never assume a port belongs to this project.

### 2.4 Existing services

- **PostgreSQL** is already installed and running. Use it. Create a **dedicated database and a dedicated database user** for this project with the minimum required privileges. Do not touch other databases.
- If Redis is needed for the queue, first check whether it is already installed and running; if it is, use a **dedicated Redis database index** so other projects are unaffected. If Redis is not present, use a Postgres-backed queue instead and record the decision as an ADR.

### 2.5 Environments

- Two local configurations: `development` and `production` (production still runs on the Mac Mini).
- Separate databases per environment. Never point development at production data.

---

## 3. TECHNOLOGY STACK

Locked unless the product owner approves a change in writing.

| Layer             | Choice                                                                            | Notes                                                                                   |
| ----------------- | --------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| Web + API         | Next.js (App Router) + TypeScript (strict)                                        | Single codebase, API serves web and, later, mobile                                      |
| Validation        | Zod                                                                               | At every boundary                                                                       |
| Database          | PostgreSQL (existing local install)                                               | Dedicated DB and user                                                                   |
| ORM / migrations  | Drizzle ORM                                                                       | Versioned migrations in git; no manual schema edits                                     |
| Auth              | Session-based for web, JWT + refresh for mobile                                   | Email and phone (OTP) login                                                             |
| Queue             | BullMQ + Redis, or pg-boss if Redis is unavailable                                | Decision recorded as ADR                                                                |
| File storage      | Local filesystem outside web root, served via signed URLs                         | Storage layer abstracted so it can move to S3-compatible storage later without rewrites |
| AI                | Provider-agnostic internal service with adapters for Anthropic, Google and OpenAI | Swappable; supports dual-model cross-check                                              |
| OCR               | Pluggable adapter                                                                 | Must handle English and Urdu handwriting; accuracy measured before use                  |
| Speech-to-text    | Pluggable adapter                                                                 | Must handle Urdu and mixed Urdu-English                                                 |
| Styling / UI      | Tailwind CSS + a headless component library                                       | Must be fast on low-end Android phones                                                  |
| Testing           | Vitest (unit/integration), Playwright (E2E)                                       |                                                                                         |
| Errors / logs     | Structured JSON logs + error tracking                                             | No secrets or full user answers in logs                                                 |
| Mobile (Phase 10) | React Native (Expo)                                                               | Shares API and types                                                                    |

**Localisation:** the entire product is bilingual, English and Urdu, including RTL layout, Urdu-capable fonts, correct database collation, and Urdu content in the question banks. Urdu is tested from Phase 1, not bolted on at the end.

---

## 4. PRODUCT SPECIFICATION

### 4.1 What the product is

A web (later mobile) platform that lets Pakistani ISSB aspirants practise the full ISSB test battery under realistic conditions, then receive structured, rubric-based feedback on their performance, their personality indicators, and their weak areas — the way a high-quality coaching academy would, but consistently and at scale.

### 4.2 What the product is NOT

- It is not affiliated with, endorsed by, or connected to ISSB or the Pakistan Armed Forces. This must be stated clearly in the UI and in the terms.
- It does not predict, promise, or guarantee recommendation.
- It does not reproduce ISSB's actual copyrighted test materials.
- It does not provide clinical psychological diagnosis.

### 4.3 The ISSB test battery to be covered

Derived from the official ISSB selection system and cross-checked against the major Pakistani preparation platforms. Where sources conflict, the conflict is recorded in `/docs/issb-reference.md` and the product owner decides.

**Dimension 1 — Psychologist (written)**

| Test                          | Format                                                                                       | Timing                                    | Scoring type               |
| ----------------------------- | -------------------------------------------------------------------------------------------- | ----------------------------------------- | -------------------------- |
| Verbal Intelligence           | MCQ: general info, comprehension, arithmetic reasoning, similarities, digit span, vocabulary | Timed, per-set                            | Objective                  |
| Non-Verbal Intelligence       | MCQ: 3×3 matrices, pattern completion                                                        | Timed, per-set                            | Objective                  |
| Mechanical Aptitude (MAT)     | 50 items                                                                                     | 15 minutes                                | Objective                  |
| Sentence Completion (SCT)     | 26 incomplete sentences, Urdu and English versions                                           | ~6 minutes per set                        | Rubric-based               |
| Word Association (WAT)        | Words shown one at a time                                                                    | 10 seconds per word                       | Rubric-based               |
| Picture Story                 | 1 example + 4 story pictures                                                                 | 4 min each (30 s view + 3 min 30 s write) | Rubric-based               |
| Pointer Story                 | Complete a story from a given opening sentence                                               | 4 minutes each                            | Rubric-based               |
| Self Description              | As seen by a friend (positive) and an opponent (negative)                                    | 4 minutes each                            | Rubric-based               |
| SRT (Situation Reaction Test) | 10 everyday situations                                                                       | 20 minutes                                | Rubric-based               |
| OPI                           | 150 statements, 7-point agree/disagree scale                                                 | Timed                                     | Consistency analysis       |
| Essay                         | Written essay on a given topic                                                               | ~30 minutes                               | Rubric-based               |
| PIQ / Biodata                 | Structured personal information form                                                         | Untimed practice                          | Guided + consistency check |

**Dimension 2 — GTO**

| Task                                                           | App treatment                                                                                                                                                            |
| -------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Group Discussion                                               | Topic bank, preparation guidance, voice practice, structure feedback                                                                                                     |
| Lecturette                                                     | 2 min prepare + 2 min speak, voice recorded, feedback on structure, timing, fillers, language switching                                                                  |
| Group Planning Exercise                                        | Scenario + map, written or spoken plan, rubric feedback on prioritisation, time/distance realism, resource use                                                           |
| PGT, HGT, Individual Obstacles, Command Task, Final Group Task | Cannot be simulated online. Deliver as explainers, diagrams, principles, common mistakes, and a targeted fitness plan. **Be explicit with users about this limitation.** |

**Dimension 3 — Deputy President**

| Item                  | App treatment                                                                                                  |
| --------------------- | -------------------------------------------------------------------------------------------------------------- |
| Personal interview    | AI mock interview generated from the user's own PIQ, voice-based, with cross-questioning, then rubric feedback |
| Psych post-test probe | Short follow-up questioning on the user's own written responses                                                |

**Cross-cutting**

- General Knowledge and Current Affairs (see 4.5)
- Cross-test personality profile (see 4.4)

### 4.4 The personality profile (the core differentiator)

No single test is meaningful in isolation. The system maintains a running profile per user, built from all completed tests:

- Scores per quality (defined in the rubric set: e.g. responsibility, initiative, planning, emotional stability, social confidence, determination, expression) — each with evidence quoting the user's own words.
- **Contradiction detection** across tests: e.g. PIQ claims leadership, but stories consistently show a passive protagonist.
- **Authenticity signals**: detection of rehearsed, memorised, academy-template responses, which the real board penalises.
- **Confidence level** of the profile, based on how many tests have been completed. Low-confidence profiles must say so prominently.
- Trend over time across attempts.

### 4.5 General Knowledge and Current Affairs module

Six components:

1. **Daily digest** — 8 to 12 items per day. Each item: headline, 2–3 line original summary (English and Urdu), category (Pakistan / Defence / International / Economy / Science & Tech / Sports), an "ISSB angle" line explaining why an interviewer might ask about it, and a link to the original source.
2. **Static GK banks** — constitution, Pakistan history and geography, armed forces structure, ranks and insignia, major equipment, Islamiat, world organisations, capitals and currencies, important days.
3. **Flashcards with spaced repetition** — an SM-2-style scheduling algorithm so cards resurface just before the user would forget them. This must be implemented properly, with per-user card state.
4. **Auto-generated quizzes** — daily 10-question quiz from the week's approved items; monthly consolidated quiz. Questions generated by AI from approved items, then reviewed before publication.
5. **Interview-ready one-liners** — a 30-second spoken answer per major topic that the user can adapt.
6. **Editorial workflow** — ingestion from RSS/news APIs, AI drafts an original summary, a human editor approves before anything is published. Nothing is auto-published.

**Hard rules for this module**

- Never republish source article text. Summaries must be original and short, with attribution and a link.
- Never publish an unreviewed AI summary of political or security news.
- Every published item carries its source and publication date.
- Ingestion runs as a scheduled background job and must be resilient to a feed being down.

### 4.6 Question bank import from PDFs

The product owner has existing question banks in PDF form.

- Build an **admin import tool** that accepts a local file path or an upload.
- Parse the PDF, extract questions, options, correct answers and explanations into a **staging area**.
- Every imported item must be **reviewed and approved by an admin** in the UI before it becomes live. Nothing imports straight into the live bank.
- Report parse failures clearly, per page, rather than silently dropping content.
- Support re-import without creating duplicates (content hashing).
- Support Urdu text extraction, and flag items where extraction confidence is low.

### 4.7 Plans and monetisation

- **Free:** MCQ practice (limited), GK flashcards, daily digest.
- **Paid:** AI evaluation of written tests, personality profile, mock interview, full simulation, unlimited practice.
- **Premium:** adds a limited number of human expert reviews per month.
- Payments: JazzCash and Easypaisa, plus card. Pricing set by the product owner.
- **Quota enforcement is server-side** at the API layer, before any AI call is made. AI spend per user per plan must be capped and monitored.

### 4.8 Compliance, privacy and safety

- Explicit consent at signup for storing written responses, voice recordings and personality assessments.
- Users can export and delete their data.
- Voice recordings and answer images have a defined retention period.
- Privacy policy and terms of service in English and Urdu.
- A visible disclaimer that this is an independent practice tool, unaffiliated with ISSB, with no guarantee of any outcome.
- If a user's written responses contain indications of serious distress or self-harm, the system must not produce a scored personality critique; it must show a supportive message directing them to appropriate help, and flag the submission for human review. Specify this behaviour explicitly during Phase 5.

---

## 5. PHASE PROTOCOL

Every phase follows this protocol without exception.

**Before starting**

1. Restate the phase scope and the acceptance criteria in your own words.
2. List any open questions. **Wait for answers.**
3. Wait for explicit approval to begin.

**While working** 4. Work only within the phase scope. If you find something that belongs to another phase, note it in `/docs/backlog.md` and move on. 5. Ask rather than assume, every time.

**On completion, produce a report containing**

- What was built, file by file
- Database changes made
- Ports used
- Environment variables added
- How to run and test it
- Test results (all passing)
- Known limitations
- Anything deferred, and to which phase
- Open questions for the product owner

Then **stop and wait**.

**Independence requirement:** each phase must leave the application in a working, runnable, demonstrable state. A phase must never leave the system broken pending a later phase. Later phases extend earlier work; they do not repair it.

---

## 6. THE PHASES

### PHASE 0 — Foundation and Standards

**Goal:** a professionally configured, empty application that runs cleanly on the Mac Mini.

Deliverables:

- Repository, Next.js + TypeScript (strict), ESLint, Prettier, pre-commit hooks
- Environment configuration system with validation at startup (fail fast on missing config)
- Port-conflict detection utility used by every service the project starts; `/docs/PORTS.md`
- Dedicated Postgres database and user; connection pooling configured
- Drizzle set up with the first migration; migration and seed scripts in `/scripts`
- Structured logging, error handling, and a global error boundary
- Health-check endpoint
- Test harness (Vitest + Playwright) with one passing example of each
- CI-equivalent local script that runs lint, typecheck and tests in one command
- Backup and restore scripts for the database, **with a documented, tested restore**
- `/docs`: README, ARCHITECTURE, PORTS, ADR folder, CONTRIBUTING, SECURITY
- ADRs for: queue choice, storage abstraction, auth approach

Acceptance: a clean checkout can be set up and run by following the README alone, with no undocumented step.

---

### PHASE 1 — Identity, Accounts and Core Domain

**Goal:** users exist, are secure, and the core data model is in place.

Deliverables:

- Registration and login: email and phone with OTP; secure sessions; refresh tokens prepared for mobile
- Password reset, email/phone verification, account lockout on repeated failures
- Roles and permissions: student, content editor, expert reviewer, admin
- User profile: name, course track (PMA / GDP / Navy / LCC / technical / other), target ISSB date, language preference
- Consent capture and versioned terms acceptance
- Core schema: courses, test types, question banks, attempts, responses, evaluations, profiles — designed and documented before implementation
- Bilingual UI shell (English/Urdu, RTL), responsive, tested on a low-end Android device
- Rate limiting and audit logging of sensitive actions
- Data export and account deletion

Acceptance: a user can register, verify, log in, set their profile, switch language, export their data, and delete their account.

---

### PHASE 2 — Admin, Content Management and PDF Import

**Goal:** content can be created, imported, reviewed and published without touching the database by hand.

Deliverables:

- Admin panel: question bank CRUD for every test type, with Urdu and English content
- Media management for non-verbal figures and story pictures (own or licensed material only)
- Versioning and publish/unpublish workflow; drafts never appear to students
- **PDF import pipeline**: accept a local path or upload, parse, extract to staging, admin review and approval, duplicate detection by content hash, per-page failure reporting, low-confidence flags for Urdu extraction
- Bulk operations, search, filtering, tagging by difficulty and topic
- Rubric management: create and version rubrics for each subjective test type (content authored with the domain expert; the system stores and serves them)
- Audit trail of every content change

Acceptance: an admin can import a real PDF question bank, review it, publish it, and see it available to students — with no manual SQL.

---

### PHASE 3 — Objective Test Engine (MCQ)

**Goal:** verbal, non-verbal, mechanical and GK tests run exactly like the real thing and are scored perfectly.

Deliverables:

- Test player: **server-authoritative timing**, one question at a time or paged, progress indicator, autosave every few seconds, resume after disconnection or browser crash
- Instructions screen and practice questions mirroring the real test experience
- Deterministic server-side scoring; the client never computes or receives the answer key before submission
- Result screen: score, time per question, comparison to the user's own history, weak topics identified, full step-by-step explanation per question
- Anti-cheat basics: server timing, tab-visibility logging, one active attempt per test
- Analytics: per-topic strength over time
- Exhaustive unit tests of the scoring engine

Acceptance: a student completes a full timed mechanical aptitude test, loses connection midway, resumes, submits, and receives a correct, explained result.

---

### PHASE 4 — Written Test Player (capture only, no AI yet)

**Goal:** every written psych test can be taken under authentic conditions and captured reliably.

Deliverables:

- WAT player: word shown for exactly 10 seconds, auto-advance, typed entry, blanks allowed
- SCT player: 26 sentences, Urdu and English sets, timed
- Picture story player: 30 s viewing, 3 min 30 s writing, four stories
- Pointer story player, self-description player, SRT player, essay editor — each with correct timing
- **Paper mode**: the app runs the timer and displays the stimulus; immediately afterwards it opens a short upload window for a photo of the answer sheet. Upload is stored with the exact timing metadata of the attempt.
- OCR pipeline (queued): image → text, then a **mandatory user confirmation screen** where the extracted text can be corrected before evaluation
- Robust autosave: a dropped connection must never lose completed responses
- All responses stored with per-item timing metadata
- Urdu input and rendering fully working

Acceptance: a student completes a 50-word WAT and a 4-picture story set in both typed and paper modes without data loss, and confirms their OCR text.

---

### PHASE 5 — AI Evaluation Engine

**Goal:** subjective responses receive consistent, rubric-based, explainable evaluations.

Deliverables:

- Internal evaluation service with provider adapters (Anthropic / Google / OpenAI), swappable via configuration
- Prompt templates **versioned and stored**, never inline in application code
- Rubric-driven evaluation: the model fills a fixed structured schema; free-form verdicts are rejected
- Strict output validation; malformed output triggers a retry, then a human-review flag — never a fabricated result
- **Dual-model cross-check**: two independent evaluations; material disagreement flags the item for review rather than showing a confident wrong answer
- Queue-based processing with retries, timeouts, dead-letter handling and idempotency
- Full evaluation audit record (model, versions, tokens, cost, latency, raw output)
- Per-user, per-plan quota enforcement **before** any AI call; daily cost monitoring and alerting
- Prompt-injection defences: user text is delimited and treated as data; the system prompt is never user-controllable; output shape is always validated
- **Golden-set regression suite**: fixed sample answers with expected outcomes, run on every prompt, rubric or model change
- **Accuracy measurement**: an expert-rated sample set, with agreement between system and expert measured and reported before this phase is accepted
- Distress-signal handling as specified in 4.8
- Result presentation: strengths, weaknesses, and improvement guidance, **always quoting the user's own words as evidence**, never supplying a ready-made "ideal answer" to memorise

Acceptance: 300+ expert-rated sample responses are evaluated by the system, agreement is measured and documented, and the golden-set suite passes.

---

### PHASE 6 — Personality Profile and Reporting

**Goal:** the cross-test profile that makes this product premium.

Deliverables:

- Profile engine aggregating all completed tests into per-quality scores with evidence
- Contradiction detection across PIQ, self-description, stories, WAT, SCT, SRT and OPI
- OPI consistency and faking-good analysis
- Profile confidence level driven by test coverage, displayed prominently when low
- Progress tracking across attempts and over time
- PIQ builder with guidance, samples, and a consistency check against written responses
- Downloadable PDF report (professional layout, disclaimers included)
- Personalised study plan generated from weak areas, with a countdown to the user's ISSB date
- **Full Simulation mode**: the complete psychologist-day battery in the real order and timing, producing a single consolidated report

Acceptance: a user who completes the full battery receives a coherent, evidence-backed profile that correctly surfaces at least the contradictions present in a deliberately inconsistent test fixture.

---

### PHASE 7 — Voice: Lecturette, Planning and Mock Interview

**Goal:** spoken practice with structured feedback.

Deliverables:

- Voice recording in browser with clear permission handling and a fallback to upload
- Speech-to-text adapter supporting Urdu, English and code-switching
- **Lecturette**: topic card, 2 min preparation, 2 min recording, feedback on structure (intro / analysis / solution), timing, filler words, pace and clarity
- **Group Discussion**: topic banks, preparation frameworks, argument banks, spoken practice
- **Group Planning Exercise**: scenario and map, written or spoken plan, rubric feedback on prioritisation of life over property, time and distance realism, resource allocation, clarity of briefing
- **AI mock interview**: questions generated from the user's own PIQ, voice-based, with follow-ups and cross-questioning; then rubric feedback on content, honesty and consistency with written tests
- GTO outdoor tasks: explainers, diagrams, common mistakes, and a fitness plan — with an explicit statement that these cannot be practised in an app

Acceptance: a user delivers a lecturette and completes a mock interview built from their own PIQ, receiving consistent structured feedback.

---

### PHASE 8 — General Knowledge and Current Affairs

**Goal:** the daily-use habit feature, built exactly as specified in 4.5.

Deliverables:

- Static GK banks with full content model
- Spaced-repetition flashcard engine with per-user scheduling state, properly implemented and unit tested
- News ingestion from RSS/news APIs as a scheduled, fault-tolerant background job
- AI drafting of original bilingual summaries with the "ISSB angle" line
- **Editorial approval queue** — nothing publishes without human approval
- Daily digest UI, category filtering, bookmarking, search
- Auto-generated daily and monthly quizzes from approved items, with review before publication
- Interview-ready one-liners per major topic
- Source attribution and links on every item; no reproduction of source text
- Offline-friendly behaviour for flashcards on weak connections

Acceptance: a full week of digests is ingested, drafted, approved, published, and converted into a quiz — with no source text reproduced verbatim anywhere.

---

### PHASE 9 — Plans, Payments and Operations

**Goal:** the product can be sold and supported.

Deliverables:

- Plan definitions, entitlements and server-side quota enforcement
- JazzCash and Easypaisa integration, plus card; webhook handling with signature verification and idempotency
- Invoices, receipts, subscription lifecycle, upgrades, downgrades, expiry and grace periods
- Refund handling
- Human expert-review queue: submission routing, reviewer workspace, turnaround tracking, reviewer ratings feeding the future training dataset
- Admin operations: user lookup, entitlement fixes, re-evaluation, content corrections, support notes
- Business dashboard: signups, conversion, active users, AI cost per user, margin per plan
- Monitoring and alerting: errors, queue depth, failed payments, AI spend, disk usage, backup success
- Documented incident and rollback procedure

Acceptance: a user can subscribe, be charged, receive entitlements immediately, hit a quota limit correctly, and be supported entirely from the admin panel.

---

### PHASE 10 — Mobile Application

**Goal:** the same product on Android and iOS.

Deliverables:

- React Native (Expo) app consuming the existing versioned API, with shared types
- Full parity for test-taking, results, profile, flashcards and digest
- Offline support for flashcards and digest; queued sync for submissions
- Push notifications for daily practice, digest and results
- Camera capture optimised for answer-sheet photos
- Voice recording for lecturette and interview
- Store listings, privacy declarations and release pipeline

Acceptance: a student can complete a full test on a mid-range Android phone on a weak connection without losing data.

---

## 7. CROSS-PHASE STANDARDS CHECKLIST

Apply at the end of every phase:

- [ ] No hardcoded ports; port conflicts detected and handled; `/docs/PORTS.md` current
- [ ] No secrets in code, logs or the repo
- [ ] Every input validated with a schema
- [ ] Every route's auth and authorisation explicit
- [ ] Every list endpoint paginated
- [ ] Every query indexed; no N+1
- [ ] Nothing slow inside a request; long work is queued
- [ ] All errors handled; user-facing messages are helpful and leak nothing
- [ ] Urdu and RTL verified
- [ ] Tested on a low-end Android device
- [ ] Tests written and passing
- [ ] Documentation and ADRs updated
- [ ] Migrations reversible and committed
- [ ] Backup and restore still working
- [ ] Completion report delivered, then stop

---

## 8. OPEN QUESTIONS FOR THE PRODUCT OWNER

Answer before Phase 0 begins. Do not assume any of these.

1. Which domain expert (ex-ISSB psychologist / GTO / experienced trainer) will author and validate the rubrics, and when are they available?
2. Which AI providers will be used, and are the API keys available?
3. What is the source of story pictures and non-verbal figures — commissioned, licensed, or generated? (ISSB's own materials must not be used.)
4. What are the plan tiers and prices?
5. Which news sources and APIs are licensed or permitted for ingestion?
6. Who performs daily editorial approval for the current affairs module?
7. Where are the PDF question banks located, and what is inside them (test types, languages, whether answers and explanations are included)?
8. Is Redis already installed on the Mac Mini?
9. What is the target launch date and the first cohort of test users?
10. Which entity owns the product legally, for terms, privacy policy and payment onboarding?

---

**END OF DOCUMENT — do not begin work until Section 8 is answered and Phase 0 is approved.**
