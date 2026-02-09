const Palette = {
  primary: '#6C63FF',
  secondary: '#FF6584',
  success: '#00B894',
  warning: '#FDCB6E',
  danger: '#FF7675',
  white: '#FFFFFF',
  black: '#000000',
  
  // Light Mode Specific
  lightBackground: '#F0F2F5',
  lightCard: '#FFFFFF',
  lightText: '#2D3436',
  lightSubtext: '#636E72',
  lightBorder: '#DFE6E9',

  // Dark Mode Specific
  darkBackground: '#121212',
  darkCard: '#1E1E1E',
  darkText: '#E0E0E0',
  darkSubtext: '#A0A0A0',
  darkBorder: '#333333',
};

export const Colors = {
  ...Palette,
  light: {
    primary: Palette.primary,
    secondary: Palette.secondary,
    background: Palette.lightBackground,
    card: Palette.lightCard,
    text: Palette.lightText,
    subtext: Palette.lightSubtext,
    success: Palette.success,
    warning: Palette.warning,
    danger: Palette.danger,
    border: Palette.lightBorder,
    white: Palette.white,
    black: Palette.black,
  },
  dark: {
    primary: Palette.primary,
    secondary: Palette.secondary,
    background: Palette.darkBackground,
    card: Palette.darkCard,
    text: Palette.darkText,
    subtext: Palette.darkSubtext,
    success: Palette.success,
    warning: Palette.warning,
    danger: Palette.danger,
    border: Palette.darkBorder,
    white: Palette.white,
    black: Palette.black,
  }
};
