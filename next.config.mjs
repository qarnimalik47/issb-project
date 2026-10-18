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
  // Dev-only: when the dev server is bound to 0.0.0.0 so another device on the
  // LAN can reach it, Next blocks its own /_next dev resources as cross-origin.
  // Allow the loopback and LAN hosts we actually serve on.
  allowedDevOrigins: ['127.0.0.1', 'localhost', '192.168.100.6'],
}

export default nextConfig
