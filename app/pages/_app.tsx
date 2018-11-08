import '../static/styles.css'

import { defaultTheme } from 'evergreen-ui'
import App, { Container } from 'next/app'
import { createGlobalStyle, css, ThemeProvider } from 'styled-components'

export default class extends App {
  public render() {
    const { Component, pageProps } = this.props

    return (
      <Container>
        <ThemeProvider theme={defaultTheme}>
          <>
            <GlobalStyles />
            <Component {...pageProps} />
          </>
        </ThemeProvider>
      </Container>
    )
  }
}

const GlobalStyles = createGlobalStyle`
  ${({ theme: { scales } }: any) => css`
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
    }

    input[type] {
      color: ${scales.blue.B7};
      border: 0;
      border-bottom: 4px dashed ${scales.neutral.N4};
      box-shadow: none !important;
      background: none;

      &:not(:focus) {
        color: ${scales.blue.B7};
      }

      &::placeholder {
        color: ${scales.blue.B4};
      }
    }
  `})}
`
