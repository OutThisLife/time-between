import { ResultProps } from '@/pages'
import { parse as nlp } from 'chrono-node'
import dayjs from 'dayjs'
import advancedFormat from 'dayjs/plugin/advancedFormat'

dayjs.extend(advancedFormat)

export const dfmt = (d: dayjs.Dayjs): string =>
  [
    (() => {
      const diff = d.diff(dayjs(), 'day')

      if (!diff) {
        return 'today'
      } else if (diff === -1) {
        return 'yesterday'
      } else if (diff === 1) {
        return 'tomorrow'
      }

      return d.format('MMMM Do YYYY')
    })(),
    d.format('hh:mm A')
  ].join(' at ')

export const parseUserQuery = (value: string): ResultProps => {
  const result = {
    dates: [],
    msg: 'waiting for you <3'
  }

  if (!value.length) {
    return { result }
  }

  const doc = nlp(value)[0] || {}

  if ('end' in doc) {
    const res = [dayjs(doc.start.date()), dayjs(doc.end.date())].sort(
      (a, b) => (a.isAfter(b) ? 1 : -1)
    )

    const start = res.shift()
    const end = res.shift()
    const diff = end.diff(start, 'hour')

    if (Math.abs(diff)) {
      result.dates = [start, end]
      result.msg = `${diff.toLocaleString()} hours`
    }
  } else if ('start' in doc) {
    result.msg = 'keep trying'
  }

  return { result }
}

export const getQuery = (query: any): string =>
  (query.q as string) ||
  ('browser' in process &&
    /q=/.test(location.search) &&
    decodeURIComponent(location.search.split('?q=')[1])) ||
  ''

export const spawn = (fn: () => any): Worker =>
  new Worker(URL.createObjectURL(new Blob([`(${fn})()`])))
