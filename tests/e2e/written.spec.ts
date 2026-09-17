import { test, expect } from '@playwright/test'

async function registerAndVerify(request: import('@playwright/test').APIRequestContext) {
  const email = `wr_${Date.now()}_${Math.floor(Math.random() * 1e9)}@example.com`
  const reg = await request.post('/api/auth/register', {
    data: {
      name: 'Written Tester',
      email,
      password: 'TestPass1234',
      acceptTerms: true,
      consent: { storeWritten: true, storeVoice: false, storeAssessment: true },
    },
  })
  expect(reg.ok(), `register ${reg.status()}: ${await reg.text()}`).toBeTruthy()
  const { code } = await (await request.get('/api/dev/last-otp')).json()
  await request.post('/api/auth/otp/confirm', { data: { purpose: 'verify_email', code } })
}

test('written SCT: typed capture and submit', async ({ page }) => {
  await registerAndVerify(page.request)
  await page.goto('/written')
  await expect(page.getByRole('heading', { name: 'Written tests' })).toBeVisible()

  const sct = page.locator('.rounded-lg', { hasText: 'Sentence Completion' })
  await sct.getByRole('link', { name: 'Type' }).click()

  const boxes = page.locator('textarea')
  await expect(boxes.first()).toBeVisible()
  const count = await boxes.count()
  for (let i = 0; i < count; i++) {
    await boxes.nth(i).fill(`My honest response ${i + 1}.`)
  }
  await page.getByRole('button', { name: 'Submit', exact: true }).click()
  await expect(page.getByText(/responses were captured/i)).toBeVisible()
})
