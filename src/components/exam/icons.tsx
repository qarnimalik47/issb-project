/**
 * The handful of glyphs the exam needs, inline — an icon library for seven
 * shapes is not worth the dependency. All are decorative (`aria-hidden`): every
 * use sits next to visible or screen-reader text that carries the meaning.
 *
 * Direction: only the chevron is directional, and callers flip it with
 * `rtl:rotate-180`. Flag, clock and check must never mirror.
 */
type IconProps = { className?: string }

function Svg({ className, children }: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className={className ?? 'size-4'}
    >
      {children}
    </svg>
  )
}

/** Points toward the inline end (right in LTR). */
export function ChevronIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="m9 6 6 6-6 6" />
    </Svg>
  )
}

export function FlagIcon(props: IconProps & { filled?: boolean }) {
  return (
    <Svg className={props.className}>
      <path
        d="M5 21V4m0 0h11l-2 4 2 4H5"
        fill={props.filled ? 'currentColor' : 'none'}
        fillOpacity={props.filled ? 0.25 : 0}
      />
    </Svg>
  )
}

export function ClockIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </Svg>
  )
}

export function CheckIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="m5 12.5 4.5 4.5L19 7" />
    </Svg>
  )
}

export function CrossIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M6 6l12 12M18 6 6 18" />
    </Svg>
  )
}

export function DashIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M6 12h12" />
    </Svg>
  )
}

export function AlertIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M12 9v4m0 4h.01M10.3 3.9 2.4 17.5A2 2 0 0 0 4.1 20.5h15.8a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" />
    </Svg>
  )
}
