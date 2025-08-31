// src/app/providers.tsx
'use client';

import { ThemeProvider } from 'styled-components';
import StyledComponentsRegistry from '@/lib/registry';
import { theme } from '@/styles/theme';
import GlobalStyle from '@/styles/GlobalStyle';
import { AuthProvider } from '@/context/AuthContext';

export function Providers({ children }: { readonly children: React.ReactNode }) {
  return (
    <StyledComponentsRegistry>
      <ThemeProvider theme={theme}>
        <GlobalStyle />
        <AuthProvider>
          {children}
        </AuthProvider>
      </ThemeProvider>
    </StyledComponentsRegistry>
  );
}