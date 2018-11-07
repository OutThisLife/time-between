import nlp from 'compromise'
import dayjs from 'dayjs'
import { defaultTheme, Icon, Pane, Text, TextInput } from 'evergreen-ui'
import {
  compose,
  onlyUpdateForKeys,
  setDisplayName,
  StateHandler,
  StateHandlerMap,
  withHandlers,
  withStateHandlers
} from 'recompose'

interface IState {
  result: string
}

interface IStateHandlers extends StateHandlerMap<IState> {
  getResult: StateHandler<IState>
}

export default compose<IState & IStateHandlers, {}>(
  setDisplayName('index'),
  withStateHandlers(
    { result: '' },
    {
      getResult: () => ({
        target: { value }
      }: React.ChangeEvent<HTMLInputElement>) => {
        localStorage.setItem('LAST_INPUT', value)

        const doc: any[] = nlp(value)
          .dates()
          .data()

        const dates = doc.reduce(
          (acc, { date }) => acc.push(iter(date)) && acc,
          []
        )

        if (dates.length === 2) {
          return {
            result: `${Math.abs(
              dates[0].diff(dates[1], 'hour', true)
            ).toLocaleString()} hours`
          }
        }

        return { result: '' }
      }
    }
  ),
  withHandlers(() => ({
    onRef: ({ getResult }) => (ref: HTMLElement) => {
      if (!ref) {
        return
      }

      const $input = ref.querySelector('input')
      const lastInput = localStorage.getItem('LAST_INPUT')

      window.addEventListener(
        'keydown',
        () => document.activeElement !== $input && $input.focus()
      )

      if (lastInput) {
        $input.placeholder = lastInput
        getResult({ target: { value: lastInput } })
      }
    }
  })),
  onlyUpdateForKeys(['result'])
)(({ onRef, getResult, result }) => (
  <Pane
    innerRef={onRef}
    display="flex"
    alignItems="center"
    justifyContent="center"
    minHeight="100vh"
    background={defaultTheme.scales.blue.B1}>
    <Pane is="form" width="100%" paddingX="2.5vmax">
      <Icon
        zIndex={0}
        position="absolute"
        top="50%"
        left="50%"
        transform="translate(-50%, -50%)"
        icon="time"
        size="70vw"
        color={defaultTheme.scales.blue.B5}
        opacity={0.08}
      />

      <TextInput
        zIndex={1}
        position="relative"
        autoFocus
        tabIndex={1}
        id="query"
        name="query"
        placeholder="yesterday 5am and today 6pm"
        fontSize="2vmax"
        width="100%"
        height="auto"
        paddingX="5vmax"
        paddingY="1.5vmax"
        marginBottom="5vmax"
        textAlign="center"
        textTransform="lowercase"
        autoComplete="off"
        background={defaultTheme.scales.neutral.N1}
        onChange={getResult}
      />

      <Text
        zIndex={1}
        position="relative"
        is="h1"
        display="block"
        color={
          result ? defaultTheme.scales.blue.B6 : defaultTheme.scales.blue.B4
        }
        fontWeight={400}
        fontStyle="italic"
        fontSize="3vmax"
        textAlign="center"
        textTransform="lowercase"
        transition="0.2s ease-in-out">
        {result || 'Waiting for query'}
      </Text>
    </Pane>
  </Pane>
))

const iter = (obj: object, t = dayjs()) => {
  const entries = Object.entries(obj).filter(
    ([k, v]) => v && !['timezone', 'logic'].includes(k)
  ) as Array<[dayjs.UnitType, number | string]>

  for (const [k, v] of entries) {
    if (v === 'yesterday') {
      t = t.subtract(1, 'day')
    } else if (v === 'tomorrow') {
      t = t.add(1, 'day')
    } else if (typeof v === 'number') {
      t = t.set(k, v)
    } else if (typeof v === 'object') {
      t = iter(v, t)
    }
  }

  return t
}
