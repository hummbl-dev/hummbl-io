// Using CO5 (Composition) - HUMMBL mobile design system

export { colors, darkColors } from './colors';
export type { Colors } from './colors';

export { spacing, layout } from './spacing';
export type { Spacing, Layout } from './spacing';

export { typography, fontWeights, fontSizes, lineHeights } from './typography';
export type { Typography } from './typography';

// Combined theme type
import { colors, darkColors } from './colors';
import { spacing, layout } from './spacing';
import { typography } from './typography';

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
