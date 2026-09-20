import { test, expect } from '@playwright/test'

async function registerAndVerify(request: import('@playwright/test').APIRequestContext) {
  const email = `sets_${Date.now()}_${Math.floor(Math.random() * 1e9)}@example.com`
  const reg = await request.post('/api/auth/register', {
    data: {
      name: 'Sets Tester',
      email,
      password: 'TestPass1234',
      acceptTerms: true,
      consent: { storeWritten: true, storeVoice: false, storeAssessment: true },
    },
  })
  expect(reg.ok(), `register failed ${reg.status()}: ${await reg.text()}`).toBeTruthy()
  const { code } = await (await request.get('/api/dev/last-otp')).json()
  const conf = await request.post('/api/auth/otp/confirm', {
    data: { purpose: 'verify_email', code },
  })
  expect(conf.ok()).toBeTruthy()
  return email
}

test('a numbered set can be taken and is then marked done', async ({ page }) => {
  await registerAndVerify(page.request)

  // Reach the sets from the catalogue, the way a student would.
  await page.goto('/practice')
  await page
    .getByTestId('test-card-gk')
    .getByRole('link', { name: /tests$/ })
    .click()
  await expect(page.getByRole('heading', { name: /General Knowledge tests/ })).toBeVisible()

  const firstSet = page.locator('[data-testid^="test-set-"]').first()
  await expect(firstSet).toHaveAttribute('data-state', 'available')
  await firstSet.getByRole('link', { name: 'Start' }).click()

  await page.getByRole('button', { name: 'Begin test' }).click()
  const total = Number(
    (await page.getByText(/Question 1 \/ (\d+)/).textContent())!.match(/\/ (\d+)/)![1],
  )

  for (let i = 0; i < total; i++) {
    await page.locator('input[type="radio"]').first().check()
    // `exact` matters: Next.js injects its own "Open Next.js Dev Tools" button.
    if (i < total - 1) await page.getByRole('button', { name: 'Next', exact: true }).click()
  }
  await page.getByRole('button', { name: 'Review', exact: true }).click()
  // Everything answered and nothing flagged → submits without a confirmation.
  await page.getByRole('button', { name: 'Submit', exact: true }).click()
  await expect(page.getByText(new RegExp(`/ ${total} \\(`))).toBeVisible({ timeout: 15_000 })

  // Back on the list the set now reads Done, and the progress counter moved.
  await page.goto('/practice/sets/gk')
  const done = page.locator('[data-testid^="test-set-"][data-state="done"]')
  await expect(done).toHaveCount(1)
  await expect(done.getByText('Done')).toBeVisible()
  await expect(done.getByRole('link', { name: 'Retake' })).toBeVisible()
  await expect(page.getByText(/1 of \d+ done/)).toBeVisible()
})

test('a psychological (written) set can be taken and is then marked done', async ({ page }) => {
  await registerAndVerify(page.request)

  // SRT is rubric-scored, so its sets run through the written player rather
  // than the MCQ one — the same list, a different route. SRT rather than WAT
  // because WAT is a timed one-word-at-a-time player (50 items × 10s), which
  // is a fine test to sit and a terrible one to automate.
  await page.goto('/practice/sets/srt')
  await expect(page.getByRole('heading', { name: /Situation Reaction.*tests/ })).toBeVisible()

  const firstSet = page.locator('[data-testid^="test-set-"]').first()
  await expect(firstSet).toHaveAttribute('data-state', 'available')
  await firstSet.getByRole('link', { name: 'Start' }).click()

  const boxes = page.locator('textarea')
  await expect(boxes.first()).toBeVisible()
  // Reacting to each situation in a line is the whole task; three is enough to
  // prove capture works without writing out the full set.
  for (let i = 0; i < 3; i++) await boxes.nth(i).fill(`A steady response ${i + 1}.`)
  await page.getByRole('button', { name: 'Submit', exact: true }).click()
  await expect(page.getByText(/responses were captured/i)).toBeVisible({ timeout: 15_000 })

  await page.goto('/practice/sets/srt')
  const done = page.locator('[data-testid^="test-set-"][data-state="done"]')
  await expect(done).toHaveCount(1)
  await expect(done.getByRole('link', { name: 'Retake' })).toBeVisible()
  await expect(page.getByText(/1 of \d+ done/)).toBeVisible()
})

test('a set whose items are not all published stays locked', async ({ page }) => {
  await registerAndVerify(page.request)
  // SCT's early sets come from the original bank and are live; the later ones
  // hold the imported drafts, so they stay gated.
  await page.goto('/practice/sets/sct')
  await expect(page.getByRole('heading', { name: /Sentence Completion.*tests/ })).toBeVisible()

  const locked = page.locator('[data-testid^="test-set-"][data-state="locked"]').first()
  await expect(locked.getByText('Not available yet')).toBeVisible()
  // Locked sets offer no way in.
  await expect(locked.getByRole('link')).toHaveCount(0)
})
