# Incident response & rollback

Operational runbook for the ISSB platform (build prompt §9).

## Monitoring signals

- **App health:** `GET /api/health` (DB + Redis). Non-200 = degraded.
- **Business/ops dashboard:** `/admin` (admin only) — signups, conversion,
  AI spend, failed payments, evaluations needing review, queue depth.
- **Structured logs:** JSON to stdout (pipe through `pino-pretty` locally).
- **Backups:** `npm run backup` output; verify size and recency.

## Common incidents

### Queue backing up (evaluation/OCR/STT/pdf-import/news)

1. Check `/admin` queue depth and worker logs (`npm run worker`).
2. Confirm Redis is up (`redis-cli -n $REDIS_DB ping`).
3. Restart the worker: stop the process and run `npm run worker` again.
   Jobs are idempotent (jobId) and retried, so restarts are safe.

### Failed payments spike

1. `/admin` → failed payments count; inspect `payments` rows (status=failed).
2. Verify gateway webhook signature config (`*_INTEGRITY_SALT`).
3. Webhooks are idempotent by `(gateway, gateway_ref)`; safe to re-deliver.

### AI spend anomaly

1. `/admin` → AI spend (USD, summed from `evaluations.cost_usd`).
2. Per-user daily quota is enforced before any AI call; tighten plan
   entitlements in `src/lib/billing/plans.ts` if needed and redeploy.

### Bad deploy / migration

1. Stop servers: `npm run stop` (or Ctrl+C the foreground dev server).
2. Roll back code: `git revert <sha>` or check out the previous release tag.
3. Database: migrations are forward-only in git. If a migration caused the
   incident, restore the pre-deploy backup:
   ```
   npm run restore backups/<pre-deploy>.dump
   ```
   (Restore is tested — see docs/ARCHITECTURE.md.)
4. Re-run `npm run ci`, then restart: `npm run build && npm start`.

### Distress-flagged submissions

Evaluations with status `blocked_distress` are surfaced on `/admin`
(evaluations needing review). These users saw a supportive message and were NOT
scored. A human should follow up per policy.

## Rollback checklist

- [ ] Servers stopped
- [ ] Offending change reverted (code and/or DB restored from backup)
- [ ] `npm run ci` green
- [ ] Health endpoint 200 after restart
- [ ] Root cause noted in `docs/backlog.md` / issue tracker
