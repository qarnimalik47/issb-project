import { test, expect } from '@playwright/test'

async function registerAndVerify(request: import('@playwright/test').APIRequestContext) {
  const email = `mcq_${Date.now()}_${Math.floor(Math.random() * 1e9)}@example.com`
  const reg = await request.post('/api/auth/register', {
    data: {
      name: 'MCQ Tester',
      email,
      password: 'TestPass1234',
      acceptTerms: true,
      consent: { storeWritten: true, storeVoice: false, storeAssessment: true },
    },
  })
  expect(reg.ok(), `register failed ${reg.status()}: ${await reg.text()}`).toBeTruthy()
  const otpRes = await request.get('/api/dev/last-otp')
  const { code } = await otpRes.json()
  const conf = await request.post('/api/auth/otp/confirm', {
    data: { purpose: 'verify_email', code },
  })
  expect(conf.ok()).toBeTruthy()
  return email
}

test('objective test: start, answer, submit, get explained result', async ({ page }) => {
  await registerAndVerify(page.request)

  await page.goto('/practice')
  await expect(page.getByRole('heading', { name: 'Practice tests' })).toBeVisible()

  // Start the GK test (seeded with sample questions).
  const gkCard = page.locator('.rounded-lg', { hasText: 'General Knowledge' })
  await gkCard.getByRole('link', { name: 'Start' }).click()

  // Answer each question, then submit.
  await expect(page.getByText(/Question 1 \//)).toBeVisible()
  const total = Number(
    (await page.getByText(/Question 1 \/ (\d+)/).textContent())!.match(/\/ (\d+)/)![1],
  )

  for (let i = 0; i < total; i++) {
    await page.locator('input[type="radio"]').first().check()
    if (i < total - 1) {
      await page.getByRole('button', { name: 'Next', exact: true }).click()
    }
  }
  await page.getByRole('button', { name: 'Submit', exact: true }).click()

  // Result screen with a score out of total.
  await expect(page.getByText(new RegExp(`/ ${total} \\(`))).toBeVisible()
})

test('objective test resumes an in-progress attempt after reload', async ({ page }) => {
  await registerAndVerify(page.request)
  await page.goto('/practice')
  const card = page.locator('.rounded-lg', { hasText: 'General Knowledge' })
  await card.getByRole('link', { name: 'Start' }).click()
  await expect(page.getByText(/Question 1 \//)).toBeVisible()

  // Answer Q1 and wait for the autosave request to complete.
  const savePromise = page.waitForResponse(
    (r) => r.url().includes('/autosave') && r.request().method() === 'POST',
  )
  await page.locator('input[type="radio"]').first().check()
  await savePromise

  // Reload → same attempt resumes with the answer preserved.
  await page.reload()
  await expect(page.getByText(/Question 1 \//)).toBeVisible()
  await expect(page.locator('input[type="radio"]').first()).toBeChecked()
})
