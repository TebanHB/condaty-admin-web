// src/styles/styled.d.ts
import 'styled-components';
import { theme } from './theme';

// Se infiere el tipo del objeto 'theme' que creamos
type Theme = typeof theme;

// Se extiende la interfaz DefaultTheme de styled-components
declare module 'styled-components' {
  export interface DefaultTheme extends Theme {}
}