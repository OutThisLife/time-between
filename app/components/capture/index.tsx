import Result, { ResultProps } from '@/components/result'
import { Pane, TextInput } from 'evergreen-ui'
import { RouterProps, withRouter } from 'next/router'
import { arrayOf, object, string } from 'prop-types'
import {
  compose,
  setDisplayName,
  StateHandler,
  StateHandlerMap,
  withContext,
  withStateHandlers
} from 'recompose'
import { ThemeProps } from 'styled-components'

import { getQuery, parseUserQuery } from './utils'

interface TStateHandlers<T> extends StateHandlerMap<T> {
  getResult: StateHandler<T>
}

interface TInner extends ResultProps, ThemeProps<any> {
  router: RouterProps
}

export default compose<TInner & TStateHandlers<ResultProps>, {}>(
  setDisplayName('capture'),
  withRouter,
  withStateHandlers(
    ({ router: { query } }: TInner) => parseUserQuery(getQuery(query)),
    { getResult: () => (value: string) => parseUserQuery(value) }
  ),
  withContext(
    { dates: arrayOf(object), value: string },
    ({ dates, value }) => ({ dates, value })
  )
)(({ getResult }) => (
  <>
    <Pane
      is="form"
      action="javascript:;"
      gridRow={1}
      gridColumn="1 / -1"
      width="100%"
      height="100%"
      fontSize="var(--scale)"
      onChange={({
        currentTarget: {
          q: { value }
        }
      }) => {
        getResult(value)

        history.replaceState(
          null,
          null,
          value.length ? `?q=${encodeURIComponent(value)}` : ''
        )
      }}>
      <TextInput
        autoFocus
        tabIndex={1}
        id="query"
        name="q"
        placeholder="example: yesterday 5am to today 6pm"
        autoComplete="off"
        autoCorrect="off"
        spellCheck={false}
        width="100%"
        height="auto"
        fontSize="1.5em"
        paddingTop="calc(40vh - 1em)"
        paddingBottom="1.33vmax"
        paddingX={15}
        textAlign="center"
        textTransform="lowercase"
        borderRadius={0}
      />
    </Pane>

    <Result
      is="section"
      gridRow={2}
      gridColumn="1 / -1"
      alignSelf="flex-start"
      padding={25}
    />
  </>
))

export { parseUserQuery }
