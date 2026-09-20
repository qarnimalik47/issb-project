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

/** Open the GK card from the catalog and get past the instructions screen. */
async function startGk(page: import('@playwright/test').Page) {
  await page.goto('/practice')
  await expect(page.getByRole('heading', { name: 'Practice tests' })).toBeVisible()
  await page.getByTestId('test-card-gk').getByRole('link', { name: 'Start' }).click()
  // The attempt (and its clock) is only created on Begin.
  await page.getByRole('button', { name: 'Begin test' }).click()
  await expect(page.getByText(/Question 1 \//)).toBeVisible()
}

test('objective test: start, answer, submit, get explained result', async ({ page }) => {
  await registerAndVerify(page.request)
  await startGk(page)

  const total = Number(
    (await page.getByText(/Question 1 \/ (\d+)/).textContent())!.match(/\/ (\d+)/)![1],
  )

  // Answer each question, then review and submit.
  for (let i = 0; i < total; i++) {
    await page.locator('input[type="radio"]').first().check()
    if (i < total - 1) {
      await page.getByRole('button', { name: 'Next', exact: true }).click()
    }
  }
  await page.getByRole('button', { name: 'Review', exact: true }).click()
  // Everything answered and nothing flagged → no confirmation dialog.
  await page.getByRole('button', { name: 'Submit', exact: true }).click()

  // Result screen with a score out of total.
  await expect(page.getByText(new RegExp(`/ ${total} \\(`))).toBeVisible()
})

test('objective test resumes an in-progress attempt after reload', async ({ page }) => {
  await registerAndVerify(page.request)
  await startGk(page)

  // Answer Q1 and wait for the autosave request to complete.
  const savePromise = page.waitForResponse(
    (r) => r.url().includes('/autosave') && r.request().method() === 'POST',
  )
  await page.locator('input[type="radio"]').first().check()
  await savePromise

  // Reload → same attempt resumes with the answer preserved, straight into the test.
  await page.reload()
  await expect(page.getByText(/Question 1 \//)).toBeVisible()
  await expect(page.locator('input[type="radio"]').first()).toBeChecked()
})

test('a flag for review survives a reload', async ({ page }) => {
  await registerAndVerify(page.request)
  await startGk(page)

  const savePromise = page.waitForResponse(
    (r) => r.url().includes('/autosave') && r.request().method() === 'POST',
  )
  await page.getByRole('button', { name: 'Flag for review' }).click()
  await savePromise

  await page.reload()
  await expect(page.getByText(/Question 1 \//)).toBeVisible()
  await expect(page.getByRole('button', { name: 'Remove flag' })).toBeVisible()
})

test('the exam route is not reachable signed out', async ({ page }) => {
  await page.goto('/practice/00000000-0000-4000-8000-000000000000')
  await expect(page).toHaveURL(/\/login/)
})
