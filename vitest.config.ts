import { defineConfig } from 'vitest/config'

/**
 * Vitest runs the fast, dependency-free unit/integration suite (tests/unit).
 * End-to-end browser tests live under tests/e2e and are run by Playwright
 * (npm run test:e2e), not here.
 */
export default defineConfig({
  test: {
    environment: 'node',
    include: ['tests/unit/**/*.test.ts', 'tests/integration/**/*.test.ts'],
    setupFiles: ['./vitest.setup.ts'],
    clearMocks: true,
  },
})
