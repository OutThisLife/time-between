import '../static/styles.css'

import App, { Container } from 'next/app'

export default class extends App {
  public render() {
    const { Component, router, pageProps } = this.props

    return (
      <Container key={router.asPath}>
        <Component
          key={Math.random() + router.asPath}
          router={router}
          {...pageProps}
        />
      </Container>
    )
  }
}
