import Result from '@/components/result'
import { getQuery, parseUserQuery } from '@/lib/utils'
import dayjs from 'dayjs'
import { Pane, TextInput } from 'evergreen-ui'
import { RouterProps, withRouter } from 'next/router'
import { any } from 'prop-types'
import {
  compose,
  setDisplayName,
  StateHandler,
  StateHandlerMap,
  withContext,
  withStateHandlers
} from 'recompose'
import { ThemeProps } from 'styled-components'

export interface ResultProps {
  result: {
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
  setDisplayName('capture'),
  withRouter,
  withStateHandlers(
    ({ router: { query } }: TInner) => parseUserQuery(getQuery(query)),
    { getResult: () => (value: string) => parseUserQuery(value) }
  ),
  withContext({ result: any }, ({ result }) => ({ result }))
)(({ getResult }) => (
  <>
    <Pane
      is="form"
      action="javascript:;"
      gridRow={1}
      gridColumn="1 / -1"
      width="100%"
      height="100%"
      maxWidth="1600px"
      marginX="auto"
      onChange={({ currentTarget }) =>
        'browser' in process && getResult(currentTarget.q.value)
      }>
      <TextInput
        autoFocus
        tabIndex={1}
        id="query"
        name="q"
        placeholder="example: yesterday 5am to today 6pm"
        autoComplete="off"
        autoCorrect="off"
        spellCheck={false}
        fontSize="calc(var(--scale) / 1.15)"
        width="100%"
        height="auto"
        paddingTop="calc(40vh - 1em)"
        paddingBottom="1.33vmax"
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
      fontSize="var(--scale)"
      padding={25}
    />
  </>
))
