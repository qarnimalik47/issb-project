/**
 * PostCSS configuration. Tailwind CSS v4 is loaded via its dedicated PostCSS
 * plugin package (@tailwindcss/postcss). No tailwind.config.js is required in
 * v4 — theme configuration lives in CSS via the @theme directive.
 */
const config = {
  plugins: {
    '@tailwindcss/postcss': {},
  },
}

export default config
