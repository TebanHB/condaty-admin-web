'use client';

import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  /*
   * 1. Un reseteo de CSS básico y sensato.
   */
  *, *::before, *::after {
    box-sizing: border-box;
  }

  body {
    margin: 0;
    padding: 0;
    font-family: ${({ theme }) => theme.fonts.main};
    background-color: ${({ theme }) => theme.colors.background};
    color: ${({ theme }) => theme.colors.text};
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  /*
   * 2. Otros estilos globales que quieras añadir.
   */
  a {
    color: inherit;
    text-decoration: none;
  }
`;

export default GlobalStyle;