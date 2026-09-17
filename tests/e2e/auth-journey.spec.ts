import { test, expect } from '@playwright/test'

/**
 * Phase 1 critical journey: register → verify email (via dev OTP) → set profile
 * → switch language (RTL) → export data → delete account.
 */
test('full account lifecycle', async ({ page }) => {
  const stamp = Date.now()
  const email = `e2e_${stamp}@example.com`
  const password = 'TestPass1234'

  // Register
  await page.goto('/register')
  await page.fill('input[name="name"]', 'E2E Tester')
  await page.fill('input[name="email"]', email)
  await page.fill('input[name="password"]', password)
  await page.check('input[name="acceptTerms"]')
  await page.click('button[type="submit"]')
  await page.waitForURL('**/verify')

  // Fetch the dev OTP (dev-only endpoint) using the shared session cookie
  const otpRes = await page.request.get('/api/dev/last-otp')
  expect(otpRes.ok()).toBeTruthy()
  const { code } = await otpRes.json()
  expect(code).toMatch(/^[0-9]{6}$/)

  // Verify
  await page.fill('input[name="code"]', code)
  await page.click('button[type="submit"]')
  await page.waitForURL('**/dashboard')
  await expect(page.getByRole('heading', { level: 1 })).toContainText('E2E Tester')

  // Profile update
  await page.goto('/profile')
  await page.fill('input[name="name"]', 'E2E Renamed')
  await page.getByRole('button', { name: /save|محفوظ/i }).click()
  await expect(page.getByText(/saved|محفوظ/i)).toBeVisible()

  // Language switch → RTL
  await page.getByRole('button', { name: 'اردو' }).click()
  await expect(page.locator('html')).toHaveAttribute('dir', 'rtl')

  // Export data
  const exportRes = await page.request.get('/api/me/export')
  expect(exportRes.ok()).toBeTruthy()
  const dump = await exportRes.json()
  expect(dump.profile.email).toBe(email)

  // Delete account (handle confirm dialog)
  page.on('dialog', (d) => d.accept())
  await page.getByRole('button', { name: /delete my account|حذف/i }).click()
  await page.waitForURL('**/register')

  // Session should be gone: /api/me now 401
  const meRes = await page.request.get('/api/me')
  expect(meRes.status()).toBe(401)
})
