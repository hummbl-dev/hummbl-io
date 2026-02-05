// Using IN2 (Premortem) - Handle empty state gracefully

import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, layout, typography } from '../../theme';

interface EmptyStateProps {
  icon?: keyof typeof Ionicons.glyphMap;
  title: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({
  icon = 'folder-open-outline',
  title,
  message,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <View style={styles.container}>
      <Ionicons name={icon} size={64} color={colors.text.secondary} />
      <Text style={styles.title}>{title}</Text>
      {message && <Text style={styles.message}>{message}</Text>}
      {actionLabel && onAction && (
        <Pressable style={styles.button} onPress={onAction}>
          <Text style={styles.buttonText}>{actionLabel}</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: layout.screenPadding,
    backgroundColor: colors.background.secondary,
  },
  title: {
    ...typography.headingMedium,
    color: colors.text.primary,
    marginTop: spacing.md,
    textAlign: 'center',
  },
  message: {
    ...typography.bodyMedium,
    color: colors.text.secondary,
    marginTop: spacing.xs,
    marginBottom: spacing.lg,
    textAlign: 'center',
  },
  button: {
    backgroundColor: colors.primary[500],
    paddingVertical: layout.buttonPaddingVertical,
    paddingHorizontal: layout.buttonPaddingHorizontal,
    borderRadius: layout.buttonBorderRadius,
  },
  buttonText: {
    ...typography.labelLarge,
    color: colors.text.inverse,
  },
});

export default EmptyState;
