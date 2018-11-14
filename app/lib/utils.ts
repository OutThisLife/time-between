import { ResultProps } from '@/components/result'
import { parse as nlp } from 'chrono-node'
import dayjs from 'dayjs'
import advancedFormat from 'dayjs/plugin/advancedFormat'
import plur from 'plur'

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

export const dmsg = (
  dates: ResultProps['dates'],
  seperator: string = ' ::: '
): string => {
  if (!dates.length) {
    return 'waiting for query'
  } else if (dates.length === 1) {
    return 'need one more'
  }

  const [start, end] = dates

  return ['hour', 'day', 'year'].reduce((acc: string, k: dayjs.UnitType, i) => {
    const diff = end.diff(start, k)

    if (Math.abs(diff)) {
      if (i > 0) {
        acc += seperator
      }

      acc += `${diff.toLocaleString()} ${plur(k, diff)}`
    }

    return acc
  }, '')
}

export const parseUserQuery = (value: string): ResultProps => {
  const dates = []

  if (!value.length) {
    return { dates }
  }

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
  }

  return { dates }
}

export const getQuery = (query: any): string =>
  (query.q as string) ||
  ('browser' in process &&
    /q=/.test(location.search) &&
    decodeURIComponent(location.search.split('?q=')[1])) ||
  ''

export const spawn = (fn: () => any): Worker =>
  new Worker(URL.createObjectURL(new Blob([`(${fn})()`])))
