const Palette = {
  primary: "#6C63FF",
  primaryDark: "#5A52D5",
  secondary: "#FF6584",
  secondaryDark: "#E55B77",
  success: "#00B894",
  warning: "#FDCB6E",
  danger: "#FF7675",
  white: "#FFFFFF",
  black: "#1A1A1A",

  // Light Mode Specific
  lightBackground: "#F8F9FD",
  lightCard: "#FFFFFF",
  lightText: "#1A1A1A",
  lightSubtext: "#636E72",
  lightBorder: "#E5E9F2",

  // Dark Mode Specific
  darkBackground: "#0F0F12",
  darkCard: "#1C1C21",
  darkText: "#F5F5F7",
  darkSubtext: "#9BA1A6",
  darkBorder: "#2C2C34",
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const Typography = {
  h1: {
    fontSize: 40,
    fontWeight: "800" as const,
    letterSpacing: -0.5,
  },
  h2: {
    fontSize: 28,
    fontWeight: "700" as const,
    letterSpacing: -0.5,
  },
  h3: {
    fontSize: 22,
    fontWeight: "600" as const,
  },
  body: {
    fontSize: 16,
    fontWeight: "400" as const,
  },
  caption: {
    fontSize: 14,
    fontWeight: "400" as const,
  },
  button: {
    fontSize: 16,
    fontWeight: "600" as const,
    letterSpacing: 0.5,
  },
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
  },
};
