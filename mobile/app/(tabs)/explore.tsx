// Using DE3 (Decomposition) - Explore screen with filtering

import { useState, useMemo } from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, layout, typography } from '../../theme';
import { MentalModelCard, NarrativeCard } from '../../components';
import { SAMPLE_MODELS, SAMPLE_NARRATIVES } from '../../services/data';
import type { TransformationKey, EvidenceQuality } from '@hummbl/shared';

type ContentType = 'models' | 'narratives';
type TransformationFilter = TransformationKey | 'all';
type EvidenceFilter = EvidenceQuality | 'all';

const TRANSFORMATIONS: { key: TransformationFilter; label: string; color: string }[] = [
  { key: 'all', label: 'All', color: colors.primary[500] },
  { key: 'P', label: 'P', color: colors.transformations.P },
  { key: 'IN', label: 'IN', color: colors.transformations.IN },
  { key: 'CO', label: 'CO', color: colors.transformations.CO },
  { key: 'DE', label: 'DE', color: colors.transformations.DE },
  { key: 'RE', label: 'RE', color: colors.transformations.RE },
  { key: 'SY', label: 'SY', color: colors.transformations.SY },
];

const EVIDENCE_FILTERS: { key: EvidenceFilter; label: string; color: string }[] = [
  { key: 'all', label: 'All', color: colors.primary[500] },
  { key: 'A', label: 'Strong (A)', color: colors.evidence.A },
  { key: 'B', label: 'Moderate (B)', color: colors.evidence.B },
  { key: 'C', label: 'Limited (C)', color: colors.evidence.C },
];

export default function ExploreScreen() {
  const [contentType, setContentType] = useState<ContentType>('models');
  const [transformationFilter, setTransformationFilter] = useState<TransformationFilter>('all');
  const [evidenceFilter, setEvidenceFilter] = useState<EvidenceFilter>('all');

  const filteredModels = useMemo(() => {
    if (transformationFilter === 'all') return SAMPLE_MODELS;
    return SAMPLE_MODELS.filter((m) => m.transformation === transformationFilter);
  }, [transformationFilter]);

  const filteredNarratives = useMemo(() => {
    if (evidenceFilter === 'all') return SAMPLE_NARRATIVES;
    return SAMPLE_NARRATIVES.filter((n) => n.evidenceQuality === evidenceFilter);
  }, [evidenceFilter]);

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

      {/* Filters */}
      <View style={styles.filterContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScroll}
        >
          {contentType === 'models'
            ? TRANSFORMATIONS.map((t) => (
                <Pressable
                  key={t.key}
                  style={[
                    styles.filterChip,
                    transformationFilter === t.key && { backgroundColor: t.color },
                  ]}
                  onPress={() => setTransformationFilter(t.key)}
                >
                  <Text
                    style={[
                      styles.filterChipText,
                      transformationFilter === t.key && styles.filterChipTextActive,
                    ]}
                  >
                    {t.label}
                  </Text>
                </Pressable>
              ))
            : EVIDENCE_FILTERS.map((e) => (
                <Pressable
                  key={e.key}
                  style={[
                    styles.filterChip,
                    evidenceFilter === e.key && { backgroundColor: e.color },
                  ]}
                  onPress={() => setEvidenceFilter(e.key)}
                >
                  <Text
                    style={[
                      styles.filterChipText,
                      evidenceFilter === e.key && styles.filterChipTextActive,
                    ]}
                  >
                    {e.label}
                  </Text>
                </Pressable>
              ))}
        </ScrollView>
      </View>

      {/* Results count */}
      <View style={styles.resultsHeader}>
        <Text style={styles.resultsCount}>
          {contentType === 'models'
            ? `${filteredModels.length} model${filteredModels.length !== 1 ? 's' : ''}`
            : `${filteredNarratives.length} narrative${filteredNarratives.length !== 1 ? 's' : ''}`}
        </Text>
      </View>

      {/* Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {contentType === 'models' ? (
          <View style={styles.list}>
            {filteredModels.map((model) => (
              <MentalModelCard
                key={model.id}
                id={model.id}
                code={model.code}
                name={model.name}
                description={model.description}
                transformation={model.transformation}
                difficulty={model.difficulty}
              />
            ))}
          </View>
        ) : (
          <View style={styles.list}>
            {filteredNarratives.map((narrative) => (
              <NarrativeCard
                key={narrative.id}
                id={narrative.id}
                title={narrative.title}
                summary={narrative.summary}
                category={narrative.category}
                evidenceQuality={narrative.evidenceQuality}
                confidence={narrative.confidence}
              />
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
  filterContainer: {
    backgroundColor: colors.background.primary,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  filterScroll: {
    paddingHorizontal: layout.screenPadding,
    paddingVertical: spacing.sm,
    gap: spacing.xs,
  },
  filterChip: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    borderRadius: 16,
    backgroundColor: colors.background.secondary,
    marginRight: spacing.xs,
  },
  filterChipText: {
    ...typography.labelSmall,
    color: colors.text.secondary,
  },
  filterChipTextActive: {
    color: colors.text.inverse,
  },
  resultsHeader: {
    paddingHorizontal: layout.screenPadding,
    paddingVertical: spacing.sm,
  },
  resultsCount: {
    ...typography.caption,
    color: colors.text.secondary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: layout.screenPadding,
    paddingBottom: spacing.xl,
  },
  list: {
    gap: spacing.sm,
  },
});
