// Using DE3 (Decomposition) - HUMMBL design system colors

export const colors = {
  // Primary palette
  primary: {
    50: '#E8F5E9',
    100: '#C8E6C9',
    200: '#A5D6A7',
    300: '#81C784',
    400: '#66BB6A',
    500: '#4CAF50', // Main brand color
    600: '#43A047',
    700: '#388E3C',
    800: '#2E7D32',
    900: '#1B5E20',
  },

  // Neutral palette
  neutral: {
    50: '#FAFAFA',
    100: '#F5F5F5',
    200: '#EEEEEE',
    300: '#E0E0E0',
    400: '#BDBDBD',
    500: '#9E9E9E',
    600: '#757575',
    700: '#616161',
    800: '#424242',
    900: '#212121',
  },

  // Semantic colors
  success: '#4CAF50',
  warning: '#FF9800',
  error: '#F44336',
  info: '#2196F3',

  // Evidence quality indicators
  evidence: {
    A: '#4CAF50', // High quality - green
    B: '#FF9800', // Medium quality - amber
    C: '#9E9E9E', // Low quality - gray
  },

  // Transformation domain colors
  transformations: {
    P: '#9C27B0',  // Perspective - purple
    IN: '#FF5722', // Inversion - deep orange
    CO: '#2196F3', // Composition - blue
    DE: '#4CAF50', // Decomposition - green
    RE: '#FFC107', // Recursion - amber
    SY: '#00BCD4', // Systems - cyan
  },

  // Background colors
  background: {
    primary: '#FFFFFF',
    secondary: '#F5F5F5',
    tertiary: '#EEEEEE',
  },

  // Text colors
  text: {
    primary: '#212121',
    secondary: '#757575',
    disabled: '#BDBDBD',
    inverse: '#FFFFFF',
  },

  // Border colors
  border: {
    light: '#E0E0E0',
    medium: '#BDBDBD',
    dark: '#9E9E9E',
  },
} as const;

// Dark mode colors
export const darkColors = {
  ...colors,
  background: {
    primary: '#121212',
    secondary: '#1E1E1E',
    tertiary: '#2C2C2C',
  },
  text: {
    primary: '#FFFFFF',
    secondary: '#B0B0B0',
    disabled: '#666666',
    inverse: '#212121',
  },
  border: {
    light: '#333333',
    medium: '#444444',
    dark: '#555555',
  },
} as const;

export type Colors = typeof colors;
