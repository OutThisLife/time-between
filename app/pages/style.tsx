import { createGlobalStyle, css } from 'styled-components'

export const GlobalStyles = createGlobalStyle`
  ${({ theme: { scales } }: any) => css`
    * {
      box-sizing: border-box;

      &::selection {
        color: #4a4a4a;
        background: #ffd0f7;
      }

      &:focus {
        outline: none;
      }
    }

    body {
      --scale: 2.5vmax;
      background: ${scales.blue.B1};
    }

    input[type] {
      color: ${scales.blue.B7};
      border: 0;
      border-bottom: 4px dashed ${scales.neutral.N4};
      box-shadow: none !important;
      background: none;

      &:not(:focus) {
        color: ${scales.blue.B7};
      }

      &::placeholder {
        color: ${scales.blue.B4};
      }
    }
  `})}
`
