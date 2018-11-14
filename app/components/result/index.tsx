import { dfmt, dmsg } from '@/lib/utils'
import * as d3 from 'd3-timer'
import dayjs from 'dayjs'
import { Text } from 'evergreen-ui'
import Head from 'next/head'
import {
  compose,
  setDisplayName,
  shallowEqual,
  withPropsOnChange
} from 'recompose'
import { ThemeProps, withTheme } from 'styled-components'

import Result from './style'

export interface ResultProps {
  dates: dayjs.Dayjs[]
}

interface TInner extends ThemeProps<any>, ResultProps {
  title: string
  [key: string]: any
}

export default compose<TInner, { [key: string]: any }>(
  setDisplayName('result-handler'),
  withTheme,
  withPropsOnChange(
    ({ dates }, { dates: nextDates }) => !shallowEqual(dates, nextDates),
    ({ dates = [] }) => {
      if (!('browser' in process)) {
        return
      }

      d3.timeout(() =>
        window.dispatchEvent(
          new CustomEvent('pixels', {
            detail: dates
          })
        )
      )
    }
  )
)(({ theme: { palette }, dates, ...props }) => (
  <>
    {dates.length ? (
      <Head>
        <meta
          key="description"
          name="description"
          content={`
          There are ${dmsg(dates, ', ')} between ${dfmt(dates[0])}
          and ${dfmt(dates[1])}.
          `}
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
      {dates.length ? (
        <>
          <SubText>there are</SubText>
          <Text
            fontSize="1.5em"
            lineHeight={2}
            fontWeight={700}
            color={palette.neutral.dark}>
            {dmsg(dates)}
          </Text>
          <SubText>between</SubText>

          <SubText>
            {dates.map(d => (
              <time key={d.valueOf()} title={d.format()}>
                {dfmt(d)}
              </time>
            ))}
          </SubText>
        </>
      ) : (
        'waiting for query'
      )}
    </Result>
  </>
))

const SubText = ({ children, ...props }) => (
  <Text is="p" opacity={0.5} fontSize="0.75em" color="inherit" {...props}>
    {children}
  </Text>
)
