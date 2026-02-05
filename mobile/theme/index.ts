// Using CO5 (Composition) - HUMMBL mobile design system

import { colors, darkColors, type Colors } from './colors';
import { spacing, layout, type Spacing, type Layout } from './spacing';
import { typography, fontWeights, fontSizes, lineHeights, type Typography } from './typography';

// Re-export everything
export { colors, darkColors };
export type { Colors };

export { spacing, layout };
export type { Spacing, Layout };

export { typography, fontWeights, fontSizes, lineHeights };
export type { Typography };

// Combined theme
export const lightTheme = {
  colors,
  spacing,
  layout,
  typography,
} as const;

export const darkTheme = {
  colors: darkColors,
  spacing,
  layout,
  typography,
} as const;

export type Theme = typeof lightTheme;
