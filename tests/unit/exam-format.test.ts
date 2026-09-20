import { describe, it, expect } from 'vitest'
import {
  formatClock,
  optionLetter,
  questionStatus,
  counts,
  timerTone,
  milestoneFor,
  humanizeTopic,
} from '../../src/lib/tests/exam-format'
import { interpolate } from '../../src/lib/i18n/format'

describe('formatClock', () => {
  it('formats under a minute', () => {
    expect(formatClock(0)).toBe('0:00')
    expect(formatClock(9)).toBe('0:09')
    expect(formatClock(59)).toBe('0:59')
  })

  it('formats minutes', () => {
    expect(formatClock(60)).toBe('1:00')
    expect(formatClock(1800)).toBe('30:00')
    expect(formatClock(3599)).toBe('59:59')
  })

  it('switches to hours past 3600', () => {
    expect(formatClock(3600)).toBe('1:00:00')
    expect(formatClock(3661)).toBe('1:01:01')
  })

  it('never renders a negative clock', () => {
    expect(formatClock(-5)).toBe('0:00')
  })

  it('floors fractional seconds rather than rendering a decimal', () => {
    expect(formatClock(59.9)).toBe('0:59')
  })
})

describe('optionLetter', () => {
  it('maps indexes to letters', () => {
    expect(optionLetter(0)).toBe('A')
    expect(optionLetter(3)).toBe('D')
    expect(optionLetter(7)).toBe('H')
  })
})

describe('questionStatus', () => {
  it('ranks current above every other state', () => {
    expect(questionStatus({ current: true, flagged: true, answered: true })).toBe('current')
  })

  it('ranks flagged above answered', () => {
    expect(questionStatus({ current: false, flagged: true, answered: true })).toBe('flagged')
  })

  it('reports answered and blank', () => {
    expect(questionStatus({ current: false, flagged: false, answered: true })).toBe('answered')
    expect(questionStatus({ current: false, flagged: false, answered: false })).toBe('blank')
  })
})

describe('counts', () => {
  it('counts answered, unanswered and flagged', () => {
    const c = counts(['a', 'b', 'c', 'd'], { a: 'A', c: 'B' }, new Set(['b', 'c']))
    expect(c).toEqual({ total: 4, answered: 2, unanswered: 2, flagged: 2 })
  })

  it('treats an empty-string answer as unanswered, matching scoreMcq', () => {
    const c = counts(['a', 'b'], { a: '', b: 'C' }, [])
    expect(c.answered).toBe(1)
    expect(c.unanswered).toBe(1)
  })

  it('ignores answers for questions outside the attempt', () => {
    const c = counts(['a'], { a: 'A', zzz: 'D' }, [])
    expect(c.total).toBe(1)
    expect(c.answered).toBe(1)
  })

  it('accepts a plain iterable of flags as well as a Set', () => {
    expect(counts(['a', 'b'], {}, ['a']).flagged).toBe(1)
  })

  it('handles an empty attempt', () => {
    expect(counts([], {}, [])).toEqual({ total: 0, answered: 0, unanswered: 0, flagged: 0 })
  })
})

describe('timerTone', () => {
  it('is danger inside the last minute', () => {
    expect(timerTone(0)).toBe('danger')
    expect(timerTone(60)).toBe('danger')
  })

  it('is warning inside the last five minutes', () => {
    expect(timerTone(61)).toBe('warning')
    expect(timerTone(300)).toBe('warning')
  })

  it('is normal above five minutes', () => {
    expect(timerTone(301)).toBe('normal')
    expect(timerTone(1800)).toBe('normal')
  })
})

describe('milestoneFor', () => {
  it('fires as the clock crosses a boundary', () => {
    expect(milestoneFor(301, 300)).toBe(300)
    expect(milestoneFor(61, 60)).toBe(60)
    expect(milestoneFor(1, 0)).toBe(0)
  })

  it('does not fire twice for the same boundary', () => {
    expect(milestoneFor(300, 299)).toBeNull()
    expect(milestoneFor(299, 298)).toBeNull()
  })

  it('still fires when a throttled tab skips over the boundary', () => {
    expect(milestoneFor(310, 280)).toBe(300)
  })

  it('reports the largest boundary crossed in one jump', () => {
    // A long background-tab stall crosses 600 and 300 at once; announcing the
    // earlier one is right, since the later one is about to follow.
    expect(milestoneFor(700, 290)).toBe(600)
  })

  it('never fires when the clock does not move or goes backwards', () => {
    expect(milestoneFor(300, 300)).toBeNull()
    expect(milestoneFor(200, 400)).toBeNull()
  })
})

describe('interpolate', () => {
  it('substitutes named placeholders', () => {
    expect(interpolate('Question {n} / {total}', { n: 3, total: 20 })).toBe('Question 3 / 20')
  })

  it('substitutes a repeated placeholder everywhere', () => {
    expect(interpolate('{n} of {n}', { n: 5 })).toBe('5 of 5')
  })

  it('leaves an unknown placeholder visible rather than blanking it', () => {
    expect(interpolate('{a} {b}', { a: 'x' })).toBe('x {b}')
  })

  it('returns a template with no placeholders untouched', () => {
    expect(interpolate('Submit', {})).toBe('Submit')
  })
})

describe('humanizeTopic', () => {
  it('turns slugs into sentence case', () => {
    expect(humanizeTopic('number-series')).toBe('Number series')
    expect(humanizeTopic('inclined_planes')).toBe('Inclined planes')
    expect(humanizeTopic('gears')).toBe('Gears')
  })

  it('handles empty and messy input', () => {
    expect(humanizeTopic('')).toBe('')
    expect(humanizeTopic('  wheel--and-axle ')).toBe('Wheel and axle')
  })
})
