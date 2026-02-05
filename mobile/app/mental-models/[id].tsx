// Using DE3 (Decomposition) - Mental model detail screen

import { View, Text, ScrollView, StyleSheet, Pressable } from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, layout, typography } from '../../theme';
import { useBookmarks } from '@hummbl/shared';

// Sample data - will be replaced with real data
const SAMPLE_MODEL = {
  id: '1',
  code: 'P1',
  name: 'First Principles Thinking',
  description: 'First principles thinking is a problem-solving approach that breaks down complex problems into their most basic, foundational elements. Instead of reasoning by analogy (how others have done it), you deconstruct the problem to its core truths and build up from there.',
  category: 'Perspective',
  transformation: 'P',
  example: 'Elon Musk used first principles thinking to reduce the cost of SpaceX rockets. Instead of accepting the market price for rocket components, he broke down a rocket into its raw materials and found he could build them for a fraction of the cost.',
  tags: ['problem-solving', 'innovation', 'critical-thinking'],
  sources: [
    { name: 'Aristotle', reference: 'Metaphysics' },
    { name: 'Elon Musk', reference: 'Various Interviews' },
  ],
  difficulty: 3,
  relatedModels: ['IN1', 'DE1', 'CO1'],
};

const transformationColors: Record<string, string> = {
  P: colors.transformations.P,
  IN: colors.transformations.IN,
  CO: colors.transformations.CO,
  DE: colors.transformations.DE,
  RE: colors.transformations.RE,
  SY: colors.transformations.SY,
};

export default function MentalModelDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { isBookmarked, toggleBookmark } = useBookmarks();

  // In real app, fetch model by id
  const model = SAMPLE_MODEL;
  const color = transformationColors[model.transformation] || colors.primary[500];
  const bookmarked = isBookmarked(model.id, 'mental-model');

  const handleBookmark = () => {
    toggleBookmark({
      type: 'mental-model',
      itemId: model.id,
      title: model.name,
      description: model.description.slice(0, 100) + '...',
    });
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: model.code,
          headerStyle: { backgroundColor: color },
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
          <View style={[styles.badge, { backgroundColor: color }]}>
            <Text style={styles.badgeText}>{model.code}</Text>
          </View>
          <Text style={styles.title}>{model.name}</Text>
          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <Ionicons name="folder" size={14} color={colors.text.secondary} />
              <Text style={styles.metaText}>{model.category}</Text>
            </View>
            <View style={styles.metaItem}>
              <Ionicons name="speedometer" size={14} color={colors.text.secondary} />
              <Text style={styles.metaText}>
                Difficulty: {model.difficulty}/5
              </Text>
            </View>
          </View>
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>{model.description}</Text>
        </View>

        {/* Example */}
        {model.example && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Example</Text>
            <View style={styles.exampleCard}>
              <Ionicons name="bulb" size={20} color={colors.warning} style={styles.exampleIcon} />
              <Text style={styles.exampleText}>{model.example}</Text>
            </View>
          </View>
        )}

        {/* Tags */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tags</Text>
          <View style={styles.tagsContainer}>
            {model.tags.map((tag) => (
              <View key={tag} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Sources */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sources</Text>
          {model.sources.map((source, index) => (
            <View key={index} style={styles.sourceItem}>
              <Ionicons name="document-text" size={16} color={colors.text.secondary} />
              <View style={styles.sourceContent}>
                <Text style={styles.sourceName}>{source.name}</Text>
                <Text style={styles.sourceRef}>{source.reference}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Related Models */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Related Models</Text>
          <View style={styles.relatedContainer}>
            {model.relatedModels.map((code) => (
              <View key={code} style={styles.relatedChip}>
                <Text style={styles.relatedText}>{code}</Text>
              </View>
            ))}
          </View>
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
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: 6,
    marginBottom: spacing.md,
  },
  badgeText: {
    ...typography.labelLarge,
    color: colors.text.inverse,
  },
  title: {
    ...typography.displaySmall,
    color: colors.text.primary,
    marginBottom: spacing.sm,
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
  description: {
    ...typography.bodyMedium,
    color: colors.text.primary,
    lineHeight: 24,
  },
  exampleCard: {
    backgroundColor: colors.background.secondary,
    padding: layout.cardPadding,
    borderRadius: layout.cardBorderRadius,
    flexDirection: 'row',
  },
  exampleIcon: {
    marginRight: spacing.md,
    marginTop: spacing.xxs,
  },
  exampleText: {
    ...typography.bodyMedium,
    color: colors.text.primary,
    flex: 1,
    lineHeight: 24,
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
  sourceItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
    gap: spacing.sm,
  },
  sourceContent: {
    flex: 1,
  },
  sourceName: {
    ...typography.labelMedium,
    color: colors.text.primary,
  },
  sourceRef: {
    ...typography.caption,
    color: colors.text.secondary,
    marginTop: spacing.xxs,
  },
  relatedContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  relatedChip: {
    backgroundColor: colors.background.secondary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  relatedText: {
    ...typography.labelMedium,
    color: colors.primary[500],
  },
});
