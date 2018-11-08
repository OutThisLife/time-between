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
    () => true,
    ({ result: { dates, msg } }) => {
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
          hours: dates.length ? parseInt(msg.replace(/\D+/g, ''), 10) : 0,
          width: window.innerWidth
        })
      }

      return {
        title: dates.length ? msg : `Easily get the hours between two dates`
      }
    }
  ),
  withTheme
)(({ title, theme: { scales }, result: { dates, msg }, ...props }) => (
  <>
    <Head>
      <title key="title">{title} | hoursBetween</title>
    </Head>

    <Result
      zIndex={1}
      color={dates.length ? scales.blue.B6 : scales.blue.B4}
      fontWeight={400}
      lineHeight={1.75}
      textAlign="center"
      textTransform="lowercase"
      {...props}>
      {dates.length ? (
        <>
          <SubText>there are</SubText>
          <Text fontSize="inherit">{msg}</Text>
          <SubText>between</SubText>

          <SubText opacity={1}>
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
  <Text
    is="p"
    opacity={0.66}
    color="inherit"
    fontSize="0.75em"
    fontWeight={100}
    {...props}>
    {children}
  </Text>
)
