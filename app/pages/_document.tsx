import { extractStyles } from 'evergreen-ui'
import Document, { Head, Main, NextScript } from 'next/document'
import { ServerStyleSheet } from 'styled-components'

export default class extends Document<{
  styleTags?: string
  evergreenCSS?: string
  hydrationScript?: any
}> {
  public static getInitialProps({ renderPage }) {
    const sheet = new ServerStyleSheet()
    const page = renderPage(App => props =>
      sheet.collectStyles(<App {...props} />)
    )
    const styleTags = sheet.getStyleElement()
    const { css: evergreenCSS, hydrationScript } = extractStyles()

    return { ...page, styleTags, evergreenCSS, hydrationScript }
  }

  public render() {
    const { styleTags, evergreenCSS, hydrationScript } = this.props

    return (
      <html lang="en-US">
        <Head>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <meta httpEquiv="X-UA-Compatible" content="IE=edge,chrome=1" />
          <meta name="robots" content="index" />

          <meta
            name="description"
            content="Get the time between any two dates"
          />

          <link rel="shortcut icon" href="/static/favicon.ico" />

          <link
            rel="stylesheet"
            href="//cdn.jsdelivr.net/npm/normalize.css@8.0.0/normalize.min.css"
          />

          {styleTags}
          <style dangerouslySetInnerHTML={{ __html: evergreenCSS }} />
        </Head>

        <body>
          <Main />
          {hydrationScript}
          <NextScript />

          <script
            key="ga-tag"
            src="https://www.googletagmanager.com/gtag/js?id=UA-10405648-10"
            async
          />

          <script
            key="ga-snippet"
            dangerouslySetInnerHTML={{
              __html: `window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}gtag('js', new Date());gtag('config', 'UA-10405648-10');`
            }}
          />
        </body>
      </html>
    )
  }
}
