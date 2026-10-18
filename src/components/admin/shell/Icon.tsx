import type { IconName } from './nav'

/**
 * The admin icon set — drawn inline rather than pulled from an icon package so
 * the panel ships no extra kilobytes and every glyph shares one stroke weight.
 * All are 24×24 on a 1.6px stroke, which reads correctly at the 18px they are
 * rendered at in the sidebar.
 */
const PATHS: Record<IconName, React.ReactNode> = {
  gauge: (
    <>
      <path d="M12 13.5 16 9" />
      <path d="M3.5 18a9.5 9.5 0 1 1 17 0" />
      <circle cx="12" cy="13.5" r="1.4" />
    </>
  ),
  users: (
    <>
      <circle cx="9.5" cy="8.5" r="3.2" />
      <path d="M3.8 19.2a6 6 0 0 1 11.4 0" />
      <path d="M16.2 6.6a3 3 0 0 1 0 5.6" />
      <path d="M17.6 19.2a5.6 5.6 0 0 0-1.3-3.4" />
    </>
  ),
  card: (
    <>
      <rect x="3" y="5.5" width="18" height="13" rx="2.4" />
      <path d="M3 10h18" />
      <path d="M7 14.5h3.5" />
    </>
  ),
  coins: (
    <>
      <ellipse cx="12" cy="6.8" rx="7" ry="3.1" />
      <path d="M5 6.8v10.4c0 1.7 3.1 3.1 7 3.1s7-1.4 7-3.1V6.8" />
      <path d="M5 12c0 1.7 3.1 3.1 7 3.1s7-1.4 7-3.1" />
    </>
  ),
  bank: (
    <>
      <path d="M3.5 9.5 12 4.5l8.5 5" />
      <path d="M5.5 9.5v8M10 9.5v8M14 9.5v8M18.5 9.5v8" />
      <path d="M3 19.5h18" />
    </>
  ),
  upload: (
    <>
      <path d="M12 15.5V4.5" />
      <path d="m8 8 4-3.5L16 8" />
      <path d="M4.5 14v4a1.5 1.5 0 0 0 1.5 1.5h12a1.5 1.5 0 0 0 1.5-1.5v-4" />
    </>
  ),
  file: (
    <>
      <path d="M13.5 3.5H7A1.5 1.5 0 0 0 5.5 5v14A1.5 1.5 0 0 0 7 20.5h10a1.5 1.5 0 0 0 1.5-1.5V8.5Z" />
      <path d="M13.5 3.5v5h5" />
      <path d="M9 13h6M9 16.5h4" />
    </>
  ),
  globe: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M3.5 12h17" />
      <path d="M12 3.5c2.2 2.4 3.3 5.3 3.3 8.5S14.2 18.1 12 20.5c-2.2-2.4-3.3-5.3-3.3-8.5S9.8 5.9 12 3.5Z" />
    </>
  ),
  news: (
    <>
      <path d="M4.5 5.5h12v13H6a1.5 1.5 0 0 1-1.5-1.5Z" />
      <path d="M16.5 8.5H19a.5.5 0 0 1 .5.5v8a1.5 1.5 0 0 1-3 0Z" />
      <path d="M7.5 9h6M7.5 12h6M7.5 15h3.5" />
    </>
  ),
  plug: (
    <>
      <path d="M9 3.5v5M15 3.5v5" />
      <path d="M6.5 8.5h11v3a5.5 5.5 0 0 1-11 0Z" />
      <path d="M12 17v3.5" />
    </>
  ),
  key: (
    <>
      <circle cx="8" cy="12" r="3.8" />
      <path d="M11.8 12H20.5" />
      <path d="M17.5 12v3M14.5 12v2.2" />
    </>
  ),
  pulse: (
    <>
      <path d="M3.5 12.5h4l2-5 3.5 10 2.5-6.5 1.5 3h4" />
    </>
  ),
  scroll: (
    <>
      <path d="M6.5 4.5h11a1.5 1.5 0 0 1 1.5 1.5v13a1.5 1.5 0 0 1-1.5 1.5h-11" />
      <path d="M6.5 4.5A1.5 1.5 0 0 0 5 6v2h3.5" />
      <path d="M9 11h7M9 14.5h7M9 18h4" />
    </>
  ),
}

export function Icon({ name, className }: { name: IconName; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      {PATHS[name]}
    </svg>
  )
}
