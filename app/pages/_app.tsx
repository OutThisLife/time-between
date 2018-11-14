import '../static/styles.css'

import { defaultTheme } from 'evergreen-ui'
import App, { Container } from 'next/app'
import Head from 'next/head'
import { createGlobalStyle, css, ThemeProvider } from 'styled-components'

export default class extends App {
  public render() {
    const { Component, pageProps } = this.props

    return (
      <Container>
        <ThemeProvider theme={defaultTheme}>
          <>
            <Head>
              <title key="title">
                Ask Chronos how much time is between two dates
              </title>
            </Head>

            <GlobalStyles />
            <Component {...pageProps} />
          </>
        </ThemeProvider>
      </Container>
    )
  }
}

const GlobalStyles = createGlobalStyle`
  ${({ theme: { scales, palette } }: any) => css`
    * {
      box-sizing: border-box;

      &::selection {
        color: #4a4a4a;
        background: #ffd0f7;
      }

      &:focus {
        outline: none;
      }
    }

    body {
      --scale: 2.5vmax;
      background: ${scales.blue.B1};

      @media (min-width: 1600px) {
        --scale: 1.5vmax;
      }
    }

    input[type] {
      border: 0;
      color: ${palette.purple.dark};
      border-bottom: 4px dashed ${palette.purple.light};
      box-shadow: none !important;
      background: none;

      &::placeholder {
        color: ${palette.purple.dark};
      }
    }
  `})}
`
