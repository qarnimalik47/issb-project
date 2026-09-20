import { CheckIcon } from './icons'
import type { ExamOption, ExamStrings } from './types'

/**
 * Answer options as a real radio group: a `<fieldset>` of native
 * `<input type="radio">`, which brings arrow-key roving focus and correct
 * screen-reader semantics for free.
 *
 * Each input is stretched invisibly over its whole row, so the row *is* the
 * control — clicks land on the input itself, and the row shows the focus ring
 * via `has-focus-visible`. Selection is never colour alone: the letter badge
 * fills and a check mark appears. Rows have no fixed height; Urdu's taller
 * line-height would clip two-line options.
 */
export function OptionList({
  questionId,
  options,
  selected,
  onSelect,
  ur,
  t,
}: {
  questionId: string
  options: ExamOption[]
  selected: string | undefined
  onSelect: (key: string) => void
  ur: boolean
  t: ExamStrings
}) {
  return (
    <fieldset className="m-0 flex min-w-0 flex-col gap-3 border-0 p-0">
      <legend className="sr-only">{t.optionsLegend}</legend>
      {options.map((o) => {
        const useUr = ur && Boolean(o.textUr)
        return (
          <label
            key={o.key}
            data-testid="exam-option"
            className="group relative flex cursor-pointer items-center gap-4 rounded-xl border border-line bg-raised px-4 py-3.5 transition-colors duration-150 hover:border-brand-300 hover:bg-brand-50/50 has-checked:border-brand-600 has-checked:bg-brand-50 has-checked:ring-1 has-checked:ring-brand-600 has-focus-visible:ring-2 has-focus-visible:ring-brand-500 has-focus-visible:ring-offset-2 has-focus-visible:ring-offset-surface dark:hover:border-brand-700 dark:hover:bg-brand-950/30 dark:has-checked:border-brand-400 dark:has-checked:bg-brand-950/50 dark:has-checked:ring-brand-400"
          >
            <input
              type="radio"
              name={`q-${questionId}`}
              value={o.key}
              checked={selected === o.key}
              onChange={() => onSelect(o.key)}
              className="absolute inset-0 m-0 size-full cursor-pointer appearance-none rounded-xl opacity-0 outline-none"
            />
            <span className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-line bg-surface font-mono text-sm font-semibold text-ink-muted transition-colors group-has-checked:border-brand-700 group-has-checked:bg-brand-700 group-has-checked:text-white dark:group-has-checked:border-brand-400 dark:group-has-checked:bg-brand-400 dark:group-has-checked:text-brand-950">
              {o.key}
            </span>
            <span
              lang={useUr ? 'ur' : 'en'}
              dir={useUr ? 'rtl' : 'ltr'}
              className="min-w-0 flex-1 text-start text-base leading-relaxed text-ink"
            >
              {useUr ? o.textUr : o.textEn}
            </span>
            <CheckIcon className="hidden size-5 shrink-0 text-brand-700 group-has-checked:block dark:text-brand-300" />
          </label>
        )
      })}
    </fieldset>
  )
}
