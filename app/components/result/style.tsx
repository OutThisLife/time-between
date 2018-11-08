import { Text } from 'evergreen-ui'
import styled from 'styled-components'

export default styled(Text)`
  time {
    @media (min-width: 767px) {
      + time:before {
        content: '\\2014 ';
        margin: 0 0.3em;
      }
    }

    @media (max-width: 767px) {
      display: block;

      + time {
        margin-top: 0.5em;
      }
    }
  }
`
