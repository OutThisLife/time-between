import Capture from '@/components/capture'
import { getQuery } from '@/components/capture/utils'
import FX from '@/components/fx'
import { Pane } from 'evergreen-ui'
import { RouterProps, withRouter } from 'next/router'
import { compose, setDisplayName, withHandlers } from 'recompose'
import { ThemeProps } from 'styled-components'

interface TInner extends ThemeProps<any> {
  onRef: () => void
  router: RouterProps
}

export default compose<TInner, {}>(
  setDisplayName('index'),
  withRouter,
  withHandlers(() => ({
    onRef: ({ router: { query } }) => () => {
      if (!('browser' in process)) {
        return
      }

      const $input = document.getElementById('query') as HTMLInputElement

      window.addEventListener('keydown', e => {
        if (document.activeElement === $input) {
          return
        } else if (e.keyCode === 9) {
          e.preventDefault()
        }

        $input.focus()
      })

      $input.defaultValue = getQuery(query)
    }
  }))
)(({ onRef }) => (
  <Pane
    innerRef={onRef}
    is="main"
    display="grid"
    gridTemplateColumns="repeat(40, 1fr)"
    gridTemplateRows="min-content min-content"
    gridRowGap="calc(var(--scale) * 2)"
    justifyContent="center">
    <FX />
    <Capture />
  </Pane>
))
