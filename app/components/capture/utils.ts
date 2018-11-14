import { ResultProps } from '@/components/result'
import { parse as nlp } from 'chrono-node'
import dayjs from 'dayjs'
import advancedFormat from 'dayjs/plugin/advancedFormat'

dayjs.extend(advancedFormat)

export const parseUserQuery = (value: string): ResultProps => {
  const dates = []

  if (value.length) {
    const doc = nlp(value)[0] || {}

    if ('end' in doc) {
      const res = [dayjs(doc.start.date()), dayjs(doc.end.date())].sort(
        (a, b) => (a.isAfter(b) ? 1 : -1)
      )

      const start = res.shift()
      const end = res.shift()

      if (!start.isSame(end)) {
        dates.push(start, end)
      }
    } else if (/to\s(st|mil).?/i.test(value) && 'start' in doc) {
      dates.push(dayjs(doc.start.date()))
    }
  }

  return { dates, value }
}

export const getQuery = (query: any): string =>
  (query.q as string) ||
  ('browser' in process &&
    /q=/.test(location.search) &&
    decodeURIComponent(location.search.split('?q=')[1])) ||
  ''
