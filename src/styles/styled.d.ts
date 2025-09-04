// src/styles/styled.d.ts
import 'styled-components';
import type { Theme } from './theme'; // exporta también el tipo

declare module 'styled-components' {
  export interface DefaultTheme {
    colors: Theme['colors'];
    fonts: Theme['fonts'];
    spacing: Theme['spacing'];
    borderRadius: Theme['borderRadius'];
  }
}
