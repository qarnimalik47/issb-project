import next from 'eslint-config-next'
import prettier from 'eslint-config-prettier'
import tseslint from 'typescript-eslint'

/**
 * Flat ESLint config. `eslint-config-next` (v16) already bundles
 * typescript-eslint, react, react-hooks, import and jsx-a11y. We layer our
 * project standards on top and disable stylistic rules that conflict with
 * Prettier (kept last so it wins).
 */
const config = [
  {
    ignores: [
      '.next/**',
      'node_modules/**',
      'coverage/**',
      'playwright-report/**',
      'test-results/**',
      'next-env.d.ts',
      'mobile/**',
    ],
  },
  ...next,
  {
    files: ['**/*.ts', '**/*.tsx'],
    plugins: { '@typescript-eslint': tseslint.plugin },
    rules: {
      // Non-negotiable rule 1.2: no `any` shortcuts.
      '@typescript-eslint/no-explicit-any': 'error',
      // App Router app: we intentionally use full-navigation <a> across auth
      // boundaries and route groups, and <Link> for in-app client nav.
      '@next/next/no-html-link-for-pages': 'off',
    },
  },
  {
    rules: {
      // Non-negotiable rule 3: no accidental secret/answer leakage via console.
      'no-console': ['warn', { allow: ['warn', 'error'] }],
    },
  },
  {
    // Operational scripts are CLI tools — console output is their whole point.
    files: ['scripts/**', '*.config.mjs', '*.config.ts', 'drizzle.config.ts'],
    rules: {
      'no-console': 'off',
    },
  },
  prettier,
]

export default config
