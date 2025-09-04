// src/styles/theme.ts
export type Theme = typeof theme;

export const theme = {
  colors: {
    primary: '#00E38C',
    primaryBlack: '#212121',
    secondaryBlack: '#A7A7A7',
    thirdBlack: '#333536',
    primaryWhite: '#FAFAFA',
    background: '#f0f2f5',
    danger: '#FF5B4D',
    success: '#45BC65',
    info: '#1C65F2',
    warning: '#F89634',
    text: '#212121',
  },
  fonts: { main: 'Poppins, sans-serif' },
  spacing: { small: '8px', medium: '16px', large: '24px' },
  borderRadius: '8px',
} as const;
