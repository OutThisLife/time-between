import * as d3 from 'd3-timer'
import dayjs from 'dayjs'
import { Text } from 'evergreen-ui'
import Head from 'next/head'
import { arrayOf, object, string } from 'prop-types'
import {
  compose,
  getContext,
  setDisplayName,
  shallowEqual,
  withPropsOnChange
} from 'recompose'
import { ThemeProps, withTheme } from 'styled-components'

import Result from './style'
import { dfmt, dmsg } from './utils'

export interface ResultProps {
  dates: dayjs.Dayjs[]
  value?: string
}

interface TInner extends ThemeProps<any>, ResultProps {
  title: string
  [key: string]: any
}

export default compose<TInner, { [key: string]: any }>(
  setDisplayName('result-handler'),
  getContext({ dates: arrayOf(object), value: string }),
  withPropsOnChange(
    ({ dates }, { dates: nextDates }) => !shallowEqual(dates, nextDates),
    ({ dates = [] }) => {
      if ('browser' in process) {
        d3.timeout(() =>
          window.dispatchEvent(
            new CustomEvent('pixels', {
              detail: dates
            })
          )
        )
      }
    }
  )
)(({ value, dates, ...props }) => (
  <>
    {dates.length ? (
      <Head>
        <meta
          key="description"
          name="description"
          content={
            dates.length === 2
              ? `There are ${dmsg(dates, ', ')} between ${dfmt(
                  dates[0]
                )} and ${dfmt(dates[1])}.`
              : `${dates[0].format('HH:mm')} is ${dates[0].format('hh:mm A')}`
          }
        />
      </Head>
    ) : null}

    <Result
      id="result"
      fontWeight={400}
      lineHeight={1.75}
      textAlign="center"
      fontSize="var(--scale)"
      textTransform="lowercase"
      {...props}>
      {dates.length === 2 ? (
        <Message
          sup="there are"
          title={dmsg(dates)}
          sub={[
            'between',
            <>
              {dates.map(d => (
                <time key={d.valueOf()} title={d.format()}>
                  {dfmt(d)}
                </time>
              ))}
            </>
          ]}
        />
      ) : dates.length === 1 ? (
        <Message
          sup={
            /st/i.test(value) ? 'military to standard' : 'standard to military'
          }
          title={
            /st/i.test(value)
              ? dates[0].format('hh:mm a')
              : dates[0].format('HH:mm')
          }
        />
      ) : (
        <Message sup="waiting for query" />
      )}
    </Result>
  </>
))

const SubText = compose(setDisplayName('result-subtext'))(
  ({ children, ...props }) => (
    <Text is="p" opacity={0.5} fontSize="0.75em" color="inherit" {...props}>
      {children}
    </Text>
  )
)

interface MsgProps<T = string | JSX.Element> {
  sup?: T
  title?: T
  sub?: T[]
}

const Message = compose<MsgProps & ThemeProps<any>, MsgProps>(
  setDisplayName('result-msg'),
  withTheme
)(({ theme: { palette }, sup, title, sub = [] }) => (
  <>
    {sup && <SubText>{sup}</SubText>}

    {title && (
      <Text
        fontSize="1.5em"
        lineHeight={2}
        fontWeight={700}
        color={palette.neutral.dark}>
        {title}
      </Text>
    )}

    {sub.length
      ? sub.map(s => <SubText key={Math.random()}>{s}</SubText>)
      : null}
  </>
))
