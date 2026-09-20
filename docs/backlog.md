# Backlog

Items discovered during a phase that belong to a **later** phase, plus open
questions deferred by the product owner. Nothing here is worked on until its
phase is approved (rule / phase protocol).

## Deferred open questions (Section 8 of the build prompt)

The product owner approved starting Phase 0 with the two decisions below settled
and the rest deferred to their relevant phases:

- **Answered — Redis (Q8):** Redis is installed and running; queue uses
  BullMQ + Redis on logical DB index 14. See ADR 0001.
- **Answered — AI providers (Q2):** adapters for Anthropic, Google and OpenAI.
  API keys deferred to Phase 5 (env vars are declared and optional until then).

Still to answer, at the relevant phase:

| #   | Question                                                                                                            | Needed by   |
| --- | ------------------------------------------------------------------------------------------------------------------- | ----------- |
| 1   | Which domain expert authors/validates the rubrics, and when available?                                              | Phase 2 / 5 |
| 3   | Source of story pictures & non-verbal figures (commissioned / licensed / AI-generated; ISSB's own must not be used) | Phase 2     |
| 4   | Plan tiers and prices                                                                                               | Phase 9     |
| 5   | Which news sources / APIs are licensed for ingestion                                                                | Phase 8     |
| 6   | Who performs daily editorial approval                                                                               | Phase 8     |
| 7   | Where are the PDF question banks, and what's inside (test types, languages, answers/explanations included?)         | Phase 2     |
| 9   | Target launch date and first cohort of test users                                                                   | Planning    |
| 10  | Legal entity that owns the product (terms, privacy, payments)                                                       | Phase 9     |

## Technical follow-ups noted during Phase 0

- **Urdu collation.** Databases are UTF-8 (Urdu stores correctly). Correct Urdu
  _sorting_ may want ICU collations on specific columns — decide in Phase 1 when
  the domain schema is designed.
- **External SSD.** The repo currently lives on `/Volumes/T9-Mac`; Next.js warns
  about a "slow filesystem". Consider moving to the internal disk for dev speed.
- **Rate limiting.** Infrastructure to add in Phase 1 (public endpoints) and
  Phase 5 (AI-invoking endpoints).
- **Error tracking.** Structured logging is in place; wire an error-tracking
  sink (rule 1.6) when the first real user flows land (Phase 1).
- ~~**Shared HTTP client with timeouts.**~~ Done: `src/lib/http/fetch.ts`
  (timeout, size cap, vetted redirects) is used by the scraper. The AI
  provider and news-feed calls predate it and carry their own timeouts; moving
  them onto it would add the size cap.
