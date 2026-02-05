// Using DE3 (Decomposition) - HUMMBL spacing system (8pt grid)

export const spacing = {
  // Base spacing unit: 4px
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
} as const;

// Semantic spacing
export const layout = {
  // Screen padding
  screenPadding: spacing.md,

  // Card spacing
  cardPadding: spacing.md,
  cardMargin: spacing.sm,
  cardBorderRadius: 12,

  // List spacing
  listItemPadding: spacing.md,
  listItemGap: spacing.sm,

  // Section spacing
  sectionGap: spacing.lg,

  // Button spacing
  buttonPaddingHorizontal: spacing.lg,
  buttonPaddingVertical: spacing.sm,
  buttonBorderRadius: 8,

  // Input spacing
  inputPadding: spacing.md,
  inputBorderRadius: 8,

  // Tab bar
  tabBarHeight: 56,

  // Header
  headerHeight: 56,
} as const;

export type Spacing = typeof spacing;
export type Layout = typeof layout;
