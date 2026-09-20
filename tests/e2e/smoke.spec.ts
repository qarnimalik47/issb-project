import { test, expect } from '@playwright/test'

/**
 * Phase 0 smoke test: the app boots, the landing page renders with its
 * mandatory disclaimer, and the health endpoint reports all dependencies up.
 */
test('landing page renders with the independence disclaimer', async ({ page }) => {
  await page.goto('/')
  // The h1 is marketing copy and has been reworded once already; assert on the
  // brand in the masthead instead, which is what "the page rendered" means here.
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  await expect(page.getByRole('banner').getByText('ISSB Prep Platform').first()).toBeVisible()
  await expect(page.getByText(/not affiliated with/i)).toBeVisible()
})

test('health endpoint reports ok with database and redis up', async ({ request }) => {
  const res = await request.get('/api/health')
  expect(res.status()).toBe(200)
  const body = await res.json()
  expect(body.status).toBe('ok')
  const names = (body.checks as Array<{ name: string; ok: boolean }>).map((c) => c.name)
  expect(names).toContain('database')
  expect(names).toContain('redis')
  expect((body.checks as Array<{ ok: boolean }>).every((c) => c.ok)).toBe(true)
})
