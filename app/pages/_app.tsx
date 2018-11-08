import '../static/styles.css'

import { defaultTheme } from 'evergreen-ui'
import App, { Container } from 'next/app'
import { ThemeProvider } from 'styled-components'

import { GlobalStyles } from './style'

export default class extends App {
  public static async getInitialProps({ ctx, Component }) {
    const pageProps: any = {}

    if (ctx.req) {
      pageProps.headers = ctx.req.headers
    }

    if (Component && Component.getInitialProps) {
      const props = await Component.getInitialProps(ctx)

      for (const [k, v] of Object.entries(props)) {
        pageProps[k] = v
      }
    }

    return { pageProps }
  }

  public render() {
    const { Component, pageProps } = this.props

    return (
      <Container>
        <ThemeProvider theme={defaultTheme}>
          <>
            <GlobalStyles />
            <Component key={pageProps.headers.referer} {...pageProps} />
          </>
        </ThemeProvider>
      </Container>
    )
  }
}
