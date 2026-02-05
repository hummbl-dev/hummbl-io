// Using DE3 (Decomposition) - Explore screen with mental models and narratives

import { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable } from 'react-native';
import { Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, layout, typography } from '../../theme';

type ContentType = 'models' | 'narratives';

// Sample data - will be replaced with real data from shared package
const SAMPLE_MODELS = [
  { id: '1', code: 'P1', name: 'First Principles', category: 'Perspective', transformation: 'P' },
  { id: '2', code: 'IN1', name: 'Inversion', category: 'Inversion', transformation: 'IN' },
  { id: '3', code: 'CO1', name: 'Composition', category: 'Composition', transformation: 'CO' },
  { id: '4', code: 'DE1', name: 'Decomposition', category: 'Decomposition', transformation: 'DE' },
  { id: '5', code: 'RE1', name: 'Recursion', category: 'Recursion', transformation: 'RE' },
  { id: '6', code: 'SY1', name: 'Systems Thinking', category: 'Systems', transformation: 'SY' },
];

const SAMPLE_NARRATIVES = [
  { id: '1', title: 'Decision Making Under Uncertainty', evidence_quality: 'A', category: 'Decision Science' },
  { id: '2', title: 'Cognitive Biases in Judgment', evidence_quality: 'A', category: 'Psychology' },
  { id: '3', title: 'Risk Assessment Frameworks', evidence_quality: 'B', category: 'Risk Management' },
];

const transformationColors: Record<string, string> = {
  P: colors.transformations.P,
  IN: colors.transformations.IN,
  CO: colors.transformations.CO,
  DE: colors.transformations.DE,
  RE: colors.transformations.RE,
  SY: colors.transformations.SY,
};

const evidenceColors: Record<string, string> = {
  A: colors.evidence.A,
  B: colors.evidence.B,
  C: colors.evidence.C,
};

function ModelCard({ model }: { model: typeof SAMPLE_MODELS[0] }) {
  const color = transformationColors[model.transformation] || colors.primary[500];

  return (
    <Link href={`/mental-models/${model.id}` as any} asChild>
      <Pressable style={styles.card}>
        <View style={[styles.cardBadge, { backgroundColor: color }]}>
          <Text style={styles.cardBadgeText}>{model.code}</Text>
        </View>
        <Text style={styles.cardTitle}>{model.name}</Text>
        <Text style={styles.cardSubtitle}>{model.category}</Text>
      </Pressable>
    </Link>
  );
}

function NarrativeCard({ narrative }: { narrative: typeof SAMPLE_NARRATIVES[0] }) {
  const evidenceColor = evidenceColors[narrative.evidence_quality] || colors.evidence.C;

  return (
    <Link href={`/narratives/${narrative.id}` as any} asChild>
      <Pressable style={styles.narrativeCard}>
        <View style={styles.narrativeContent}>
          <Text style={styles.cardTitle} numberOfLines={2}>{narrative.title}</Text>
          <Text style={styles.cardSubtitle}>{narrative.category}</Text>
        </View>
        <View style={[styles.evidenceBadge, { backgroundColor: evidenceColor }]}>
          <Text style={styles.evidenceBadgeText}>{narrative.evidence_quality}</Text>
        </View>
      </Pressable>
    </Link>
  );
}

export default function ExploreScreen() {
  const [contentType, setContentType] = useState<ContentType>('models');

  return (
    <View style={styles.container}>
      {/* Content type tabs */}
      <View style={styles.tabBar}>
        <Pressable
          style={[styles.tab, contentType === 'models' && styles.tabActive]}
          onPress={() => setContentType('models')}
        >
          <Ionicons
            name="grid"
            size={18}
            color={contentType === 'models' ? colors.primary[500] : colors.text.secondary}
          />
          <Text style={[styles.tabText, contentType === 'models' && styles.tabTextActive]}>
            Mental Models
          </Text>
        </Pressable>
        <Pressable
          style={[styles.tab, contentType === 'narratives' && styles.tabActive]}
          onPress={() => setContentType('narratives')}
        >
          <Ionicons
            name="document-text"
            size={18}
            color={contentType === 'narratives' ? colors.primary[500] : colors.text.secondary}
          />
          <Text style={[styles.tabText, contentType === 'narratives' && styles.tabTextActive]}>
            Narratives
          </Text>
        </Pressable>
      </View>

      {/* Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {contentType === 'models' ? (
          <View style={styles.grid}>
            {SAMPLE_MODELS.map((model) => (
              <ModelCard key={model.id} model={model} />
            ))}
          </View>
        ) : (
          <View style={styles.list}>
            {SAMPLE_NARRATIVES.map((narrative) => (
              <NarrativeCard key={narrative.id} narrative={narrative} />
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.secondary,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: colors.background.primary,
    paddingHorizontal: layout.screenPadding,
    paddingVertical: spacing.sm,
    gap: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: layout.buttonBorderRadius,
    gap: spacing.xs,
  },
  tabActive: {
    backgroundColor: colors.primary[50],
  },
  tabText: {
    ...typography.labelMedium,
    color: colors.text.secondary,
  },
  tabTextActive: {
    color: colors.primary[500],
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: layout.screenPadding,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  list: {
    gap: spacing.sm,
  },
  card: {
    width: '48%',
    backgroundColor: colors.background.primary,
    padding: layout.cardPadding,
    borderRadius: layout.cardBorderRadius,
  },
  cardBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs,
    borderRadius: 4,
    marginBottom: spacing.sm,
  },
  cardBadgeText: {
    ...typography.labelSmall,
    color: colors.text.inverse,
  },
  cardTitle: {
    ...typography.labelLarge,
    color: colors.text.primary,
    marginBottom: spacing.xxs,
  },
  cardSubtitle: {
    ...typography.caption,
    color: colors.text.secondary,
  },
  narrativeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.primary,
    padding: layout.cardPadding,
    borderRadius: layout.cardBorderRadius,
  },
  narrativeContent: {
    flex: 1,
    marginRight: spacing.md,
  },
  evidenceBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  evidenceBadgeText: {
    ...typography.labelMedium,
    color: colors.text.inverse,
  },
});
