// Using CO5 (Composition) - Reusable mental model card component

import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, layout, typography } from '../../theme';
import type { TransformationKey } from '@hummbl/shared';

interface MentalModelCardProps {
  id: string;
  code: string;
  name: string;
  description: string;
  transformation: TransformationKey;
  difficulty?: number;
  onPress?: () => void;
}

const transformationColors: Record<TransformationKey, string> = {
  P: colors.transformations.P,
  IN: colors.transformations.IN,
  CO: colors.transformations.CO,
  DE: colors.transformations.DE,
  RE: colors.transformations.RE,
  SY: colors.transformations.SY,
};

export function MentalModelCard({
  id,
  code,
  name,
  description,
  transformation,
  difficulty,
  onPress,
}: MentalModelCardProps) {
  const color = transformationColors[transformation] || colors.primary[500];

  const cardContent = (
    <View style={styles.card}>
      <View style={[styles.colorStrip, { backgroundColor: color }]} />
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={[styles.badge, { backgroundColor: color }]}>
            <Text style={styles.badgeText}>{code}</Text>
          </View>
          {difficulty !== undefined && (
            <View style={styles.difficultyContainer}>
              {[1, 2, 3, 4, 5].map((level) => (
                <Ionicons
                  key={level}
                  name={level <= difficulty ? 'ellipse' : 'ellipse-outline'}
                  size={8}
                  color={level <= difficulty ? color : colors.neutral[300]}
                  style={styles.difficultyDot}
                />
              ))}
            </View>
          )}
        </View>
        <Text style={styles.name} numberOfLines={2}>
          {name}
        </Text>
        <Text style={styles.description} numberOfLines={2}>
          {description}
        </Text>
      </View>
      <Ionicons
        name="chevron-forward"
        size={20}
        color={colors.text.secondary}
        style={styles.chevron}
      />
    </View>
  );

  if (onPress) {
    return <Pressable onPress={onPress}>{cardContent}</Pressable>;
  }

  return (
    <Link href={`/mental-models/${id}`} asChild>
      <Pressable>{cardContent}</Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: colors.background.primary,
    borderRadius: layout.cardBorderRadius,
    marginBottom: spacing.sm,
    overflow: 'hidden',
  },
  colorStrip: {
    width: 4,
  },
  content: {
    flex: 1,
    padding: layout.cardPadding,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  badge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs,
    borderRadius: 4,
  },
  badgeText: {
    ...typography.labelSmall,
    color: colors.text.inverse,
    fontWeight: '600',
  },
  difficultyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  difficultyDot: {
    marginHorizontal: 1,
  },
  name: {
    ...typography.labelLarge,
    color: colors.text.primary,
    marginBottom: spacing.xxs,
  },
  description: {
    ...typography.bodySmall,
    color: colors.text.secondary,
  },
  chevron: {
    alignSelf: 'center',
    marginRight: spacing.md,
  },
});

export default MentalModelCard;
