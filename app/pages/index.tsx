import { defaultTheme, Pane, Text, TextInput } from 'evergreen-ui'
import { KeyboardEventHandler } from 'react'
import {
  compose,
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
    {
      result: ''
    },

    {
      getResult: () => ({
        target: { value: result }
      }: React.ChangeEvent<HTMLInputElement>) => {
        return { result }
      }
    }
  ),
  withHandlers(() => ({
    onRef: () => (ref: HTMLElement) => {
      if (!ref) {
        return
      }

      const $input = ref.querySelector('input')

      window.addEventListener(
        'keydown',
        () => document.activeElement !== $input && $input.focus()
      )
    }
  }))
)(({ onRef, getResult, result }) => (
  <Pane
    display="flex"
    alignItems="center"
    justifyContent="center"
    minHeight="100vh"
    background={defaultTheme.scales.blue.B1}>
    <Pane innerRef={onRef} width="100%" paddingX="2.5vmax">
      <TextInput
        autoFocus
        tabIndex={1}
        name="query"
        placeholder="How many hours are there between yesterday and now?&hellip;"
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
        is="h1"
        display="block"
        color={defaultTheme.scales.blue.B4}
        fontWeight={400}
        fontStyle="italic"
        fontSize="2.5vmax"
        textAlign="center"
        textTransform="lowercase">
        {result || 'Waiting for query'}
      </Text>
    </Pane>
  </Pane>
))
