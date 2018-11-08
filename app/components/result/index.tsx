import { dfmt } from '@/lib/utils'
import { ResultProps } from '@/pages'
import * as d3 from 'd3-timer'
import { Text } from 'evergreen-ui'
import Head from 'next/head'
import { any } from 'prop-types'
import {
  compose,
  getContext,
  setDisplayName,
  withPropsOnChange
} from 'recompose'
import { ThemeProps, withTheme } from 'styled-components'

import Result from './style'
import worker from './worker'

interface TInner extends ThemeProps<any>, ResultProps {
  title: string
  [key: string]: any
}

export default compose<TInner, { [key: string]: any }>(
  setDisplayName('result-handler'),
  getContext({ result: any }),
  withPropsOnChange(
    ({ result }, { result: nextResult }) => result.hours !== nextResult.hours,
    ({ result: { msg, hours } }) => {
      if ('browser' in process) {
        const { value } = document.getElementById('query') as HTMLInputElement

        d3.timeout(() =>
          history.replaceState(
            null,
            null,
            value.length ? `?q=${encodeURIComponent(value)}` : ''
          )
        )

        worker.postMessage({
          hours: hours ? Math.min(250, hours) : 0,
          width: window.innerWidth
        })
      }

      return {
        title: hours ? msg : `Easily get the hours between two dates`
      }
    }
  ),
  withTheme
)(({ theme, title, result: { dates, msg }, ...props }) => (
  <>
    <Head>
      <title key="title">{title} | hoursBetween</title>
    </Head>

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
            color={theme.palette.neutral.dark}>
            {msg}
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
        msg
      )}
    </Result>
  </>
))

const SubText = ({ children, ...props }) => (
  <Text is="p" opacity={0.5} fontSize="0.75em" color="inherit" {...props}>
    {children}
  </Text>
)
