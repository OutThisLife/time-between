import Capture from '@/components/capture'
import FX from '@/components/fx'
import { getQuery } from '@/lib/utils'
import dayjs from 'dayjs'
import { Pane } from 'evergreen-ui'
import { RouterProps, withRouter } from 'next/router'
import {
  compose,
  setDisplayName,
  StateHandler,
  StateHandlerMap,
  withHandlers
} from 'recompose'
import { ThemeProps } from 'styled-components'

export interface ResultProps {
  result: {
    hours: number
    msg: string | number
    dates: dayjs.Dayjs[]
  }
}

interface TStateHandlers<T> extends StateHandlerMap<T> {
  getResult: StateHandler<T>
}

interface TInner extends ResultProps, ThemeProps<any> {
  router: RouterProps
}

export default compose<TInner & TStateHandlers<ResultProps>, {}>(
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
    justifyContent="center"
    height="100vh">
    <FX />
    <Capture />
  </Pane>
))
