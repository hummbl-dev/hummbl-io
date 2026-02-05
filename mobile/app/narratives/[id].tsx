// Using SY8 (Systems) - Narrative detail screen

import { View, Text, ScrollView, StyleSheet, Pressable } from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, layout, typography } from '../../theme';
import { useBookmarks } from '@hummbl/shared';

// Sample data - will be replaced with real data
const SAMPLE_NARRATIVE = {
  id: '1',
  narrative_id: 'NAR-001',
  title: 'Decision Making Under Uncertainty',
  summary: 'This narrative explores evidence-based frameworks for making decisions when outcomes are uncertain and information is incomplete.',
  content: `Decision making under uncertainty is a fundamental challenge in both personal and professional contexts. Traditional rational decision-making models assume complete information, but real-world decisions often involve significant uncertainty.

Key frameworks for handling uncertainty include:

1. **Expected Value Analysis**: Weighing outcomes by their probabilities to find the optimal choice.

2. **Scenario Planning**: Developing multiple plausible futures and creating flexible strategies.

3. **Real Options Thinking**: Treating decisions as options that can be exercised, delayed, or abandoned.

4. **Bayesian Updating**: Continuously revising beliefs as new information becomes available.

The evidence suggests that experts who embrace uncertainty and use probabilistic thinking tend to make better predictions and decisions than those who express overconfident certainty.`,
  category: 'Decision Science',
  evidence_quality: 'A' as const,
  confidence: 0.85,
  tags: ['decision-making', 'uncertainty', 'probability', 'risk'],
  domain: ['Business', 'Psychology', 'Economics'],
  complexity: {
    cognitive_load: 'Medium',
    time_to_elicit: '15-30 minutes',
    expertise_required: 'Intermediate',
  },
  citations: [
    { author: 'Kahneman, D.', year: 2011, title: 'Thinking, Fast and Slow', source: 'Farrar, Straus and Giroux' },
    { author: 'Tetlock, P.', year: 2015, title: 'Superforecasting', source: 'Crown Publishing' },
  ],
  methods: [
    { method: 'Pre-mortem Analysis', description: 'Imagine the decision failed and work backwards', duration: '30 min', difficulty: 'Beginner' as const },
    { method: 'Decision Matrix', description: 'Score options against weighted criteria', duration: '1 hour', difficulty: 'Intermediate' as const },
  ],
};

const evidenceColors: Record<string, string> = {
  A: colors.evidence.A,
  B: colors.evidence.B,
  C: colors.evidence.C,
};

export default function NarrativeDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { isBookmarked, toggleBookmark } = useBookmarks();

  // In real app, fetch narrative by id
  const narrative = SAMPLE_NARRATIVE;
  const evidenceColor = evidenceColors[narrative.evidence_quality] || colors.evidence.C;
  const bookmarked = isBookmarked(narrative.id, 'narrative');

  const handleBookmark = () => {
    toggleBookmark({
      type: 'narrative',
      itemId: narrative.id,
      title: narrative.title,
      description: narrative.summary.slice(0, 100) + '...',
    });
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Narrative',
          headerRight: () => (
            <Pressable onPress={handleBookmark} hitSlop={8} style={{ marginRight: spacing.sm }}>
              <Ionicons
                name={bookmarked ? 'bookmark' : 'bookmark-outline'}
                size={24}
                color={colors.text.inverse}
              />
            </Pressable>
          ),
        }}
      />
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View style={[styles.evidenceBadge, { backgroundColor: evidenceColor }]}>
              <Text style={styles.evidenceBadgeText}>
                Evidence: {narrative.evidence_quality}
              </Text>
            </View>
            <Text style={styles.confidence}>
              {Math.round(narrative.confidence * 100)}% confidence
            </Text>
          </View>
          <Text style={styles.title}>{narrative.title}</Text>
          <Text style={styles.summary}>{narrative.summary}</Text>
          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <Ionicons name="folder" size={14} color={colors.text.secondary} />
              <Text style={styles.metaText}>{narrative.category}</Text>
            </View>
            <View style={styles.metaItem}>
              <Ionicons name="time" size={14} color={colors.text.secondary} />
              <Text style={styles.metaText}>{narrative.complexity.time_to_elicit}</Text>
            </View>
          </View>
        </View>

        {/* Content */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Overview</Text>
          <Text style={styles.contentText}>{narrative.content}</Text>
        </View>

        {/* Complexity */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Complexity</Text>
          <View style={styles.complexityGrid}>
            <View style={styles.complexityItem}>
              <Text style={styles.complexityLabel}>Cognitive Load</Text>
              <Text style={styles.complexityValue}>{narrative.complexity.cognitive_load}</Text>
            </View>
            <View style={styles.complexityItem}>
              <Text style={styles.complexityLabel}>Time Required</Text>
              <Text style={styles.complexityValue}>{narrative.complexity.time_to_elicit}</Text>
            </View>
            <View style={styles.complexityItem}>
              <Text style={styles.complexityLabel}>Expertise</Text>
              <Text style={styles.complexityValue}>{narrative.complexity.expertise_required}</Text>
            </View>
          </View>
        </View>

        {/* Methods */}
        {narrative.methods && narrative.methods.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Methods</Text>
            {narrative.methods.map((method, index) => (
              <View key={index} style={styles.methodCard}>
                <View style={styles.methodHeader}>
                  <Text style={styles.methodName}>{method.method}</Text>
                  <View style={styles.methodBadge}>
                    <Text style={styles.methodBadgeText}>{method.difficulty}</Text>
                  </View>
                </View>
                <Text style={styles.methodDescription}>{method.description}</Text>
                <View style={styles.methodMeta}>
                  <Ionicons name="time-outline" size={14} color={colors.text.secondary} />
                  <Text style={styles.methodDuration}>{method.duration}</Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Tags & Domains */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tags & Domains</Text>
          <View style={styles.tagsContainer}>
            {narrative.tags.map((tag) => (
              <View key={tag} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>
          <View style={[styles.tagsContainer, { marginTop: spacing.sm }]}>
            {narrative.domain.map((domain) => (
              <View key={domain} style={styles.domainTag}>
                <Text style={styles.domainTagText}>{domain}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Citations */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Citations</Text>
          {narrative.citations.map((citation, index) => (
            <View key={index} style={styles.citationItem}>
              <Ionicons name="book" size={16} color={colors.text.secondary} />
              <View style={styles.citationContent}>
                <Text style={styles.citationAuthor}>
                  {citation.author} ({citation.year})
                </Text>
                <Text style={styles.citationTitle}>{citation.title}</Text>
                <Text style={styles.citationSource}>{citation.source}</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.secondary,
  },
  content: {
    paddingBottom: spacing.xxl,
  },
  header: {
    backgroundColor: colors.background.primary,
    padding: layout.screenPadding,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  evidenceBadge: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: 6,
  },
  evidenceBadgeText: {
    ...typography.labelSmall,
    color: colors.text.inverse,
  },
  confidence: {
    ...typography.labelSmall,
    color: colors.text.secondary,
  },
  title: {
    ...typography.displaySmall,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  summary: {
    ...typography.bodyMedium,
    color: colors.text.secondary,
    lineHeight: 24,
    marginBottom: spacing.md,
  },
  metaRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  metaText: {
    ...typography.bodySmall,
    color: colors.text.secondary,
  },
  section: {
    padding: layout.screenPadding,
    backgroundColor: colors.background.primary,
    marginTop: spacing.sm,
  },
  sectionTitle: {
    ...typography.headingSmall,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  contentText: {
    ...typography.bodyMedium,
    color: colors.text.primary,
    lineHeight: 26,
  },
  complexityGrid: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  complexityItem: {
    flex: 1,
    backgroundColor: colors.background.secondary,
    padding: spacing.md,
    borderRadius: layout.cardBorderRadius,
    alignItems: 'center',
  },
  complexityLabel: {
    ...typography.caption,
    color: colors.text.secondary,
    marginBottom: spacing.xxs,
  },
  complexityValue: {
    ...typography.labelMedium,
    color: colors.text.primary,
  },
  methodCard: {
    backgroundColor: colors.background.secondary,
    padding: layout.cardPadding,
    borderRadius: layout.cardBorderRadius,
    marginBottom: spacing.sm,
  },
  methodHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  methodName: {
    ...typography.labelLarge,
    color: colors.text.primary,
  },
  methodBadge: {
    backgroundColor: colors.primary[100],
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs,
    borderRadius: 4,
  },
  methodBadgeText: {
    ...typography.caption,
    color: colors.primary[700],
  },
  methodDescription: {
    ...typography.bodySmall,
    color: colors.text.secondary,
    marginBottom: spacing.sm,
  },
  methodMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xxs,
  },
  methodDuration: {
    ...typography.caption,
    color: colors.text.secondary,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  tag: {
    backgroundColor: colors.primary[50],
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: 16,
  },
  tagText: {
    ...typography.labelSmall,
    color: colors.primary[700],
  },
  domainTag: {
    backgroundColor: colors.neutral[100],
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: 16,
  },
  domainTagText: {
    ...typography.labelSmall,
    color: colors.text.secondary,
  },
  citationItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
    gap: spacing.sm,
  },
  citationContent: {
    flex: 1,
  },
  citationAuthor: {
    ...typography.labelMedium,
    color: colors.text.primary,
  },
  citationTitle: {
    ...typography.bodySmall,
    color: colors.text.primary,
    fontStyle: 'italic',
    marginTop: spacing.xxs,
  },
  citationSource: {
    ...typography.caption,
    color: colors.text.secondary,
    marginTop: spacing.xxs,
  },
});
