/**
 * Next.js configuration for the ISSB Preparation Platform.
 *
 * Kept intentionally minimal in Phase 0. The dev/prod server port is NOT set
 * here — it is resolved at runtime by the port-conflict detection utility
 * (see scripts/dev.mjs, scripts/start.mjs and src/lib/net/find-free-port.ts)
 * so that this project never collides with the other projects on this machine.
 */

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Fail the production build on type errors instead of silently shipping.
  // (Linting is run separately via `npm run lint` / `npm run ci`; Next 16 no
  // longer supports the `eslint` config key.)
  typescript: { ignoreBuildErrors: false },
  poweredByHeader: false,
}

export default nextConfig
