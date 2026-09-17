import { defineConfig, devices } from '@playwright/test'
import 'dotenv/config'

/**
 * Playwright E2E configuration. Starts the app (which resolves a free port and
 * connects to Postgres + Redis) and drives it through a real browser. This is
 * the Phase 0 end-to-end example; critical user journeys are added per phase.
 */
const baseURL = process.env.APP_BASE_URL ?? 'http://127.0.0.1:4310'

export default defineConfig({
  testDir: './tests/e2e',
  globalSetup: './tests/e2e/global-setup.ts',
  timeout: 30_000,
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: [['list']],
  use: {
    baseURL,
    trace: 'on-first-retry',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: 'npm run dev',
    url: `${baseURL}/api/health`,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
})
