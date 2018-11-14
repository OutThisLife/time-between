import { ResultProps } from '@/components/result'
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
