// Using CO5 (Composition) - Reusable narrative card component

import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, layout, typography } from '../../theme';
import type { EvidenceQuality } from '@hummbl/shared';

interface NarrativeCardProps {
  id: string;
  title: string;
  summary: string;
  category: string;
  evidenceQuality: EvidenceQuality;
  confidence?: number;
  onPress?: () => void;
}

const evidenceColors: Record<EvidenceQuality, string> = {
  A: colors.evidence.A,
  B: colors.evidence.B,
  C: colors.evidence.C,
};

const evidenceLabels: Record<EvidenceQuality, string> = {
  A: 'Strong',
  B: 'Moderate',
  C: 'Limited',
};

export function NarrativeCard({
  id,
  title,
  summary,
  category,
  evidenceQuality,
  confidence,
  onPress,
}: NarrativeCardProps) {
  const evidenceColor = evidenceColors[evidenceQuality] || colors.evidence.C;

  const cardContent = (
    <View style={styles.card}>
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={[styles.evidenceBadge, { backgroundColor: evidenceColor }]}>
            <Text style={styles.evidenceBadgeText}>
              {evidenceLabels[evidenceQuality]} Evidence
            </Text>
          </View>
          {confidence !== undefined && (
            <Text style={styles.confidence}>
              {Math.round(confidence * 100)}%
            </Text>
          )}
        </View>
        <Text style={styles.title} numberOfLines={2}>
          {title}
        </Text>
        <Text style={styles.summary} numberOfLines={2}>
          {summary}
        </Text>
        <View style={styles.footer}>
          <Ionicons name="folder" size={14} color={colors.text.secondary} />
          <Text style={styles.category}>{category}</Text>
        </View>
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
    <Link href={`/narratives/${id}`} asChild>
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
  evidenceBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs,
    borderRadius: 4,
  },
  evidenceBadgeText: {
    ...typography.caption,
    color: colors.text.inverse,
    fontWeight: '600',
  },
  confidence: {
    ...typography.caption,
    color: colors.text.secondary,
  },
  title: {
    ...typography.labelLarge,
    color: colors.text.primary,
    marginBottom: spacing.xxs,
  },
  summary: {
    ...typography.bodySmall,
    color: colors.text.secondary,
    marginBottom: spacing.sm,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  category: {
    ...typography.caption,
    color: colors.text.secondary,
  },
  chevron: {
    alignSelf: 'center',
    marginRight: spacing.md,
  },
});

export default NarrativeCard;
