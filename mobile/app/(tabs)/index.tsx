// Using P1 (First Principles) - Home screen with featured content

import { View, Text, ScrollView, StyleSheet, Pressable } from 'react-native';
import { Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, layout, typography } from '../../theme';
import { SAMPLE_MODELS, SAMPLE_NARRATIVES } from '../../services/data';
import { useBookmarks } from '@hummbl/shared';

interface QuickActionProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
  href: string;
  color: string;
}

function QuickAction({ icon, title, description, href, color }: QuickActionProps) {
  return (
    <Link href={href as any} asChild>
      <Pressable style={styles.quickAction}>
        <View style={[styles.quickActionIcon, { backgroundColor: color }]}>
          <Ionicons name={icon} size={24} color={colors.text.inverse} />
        </View>
        <View style={styles.quickActionContent}>
          <Text style={styles.quickActionTitle}>{title}</Text>
          <Text style={styles.quickActionDescription}>{description}</Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color={colors.text.secondary} />
      </Pressable>
    </Link>
  );
}

// Featured model of the day (rotates based on date)
const getFeaturedModel = () => {
  const dayIndex = new Date().getDate() % SAMPLE_MODELS.length;
  return SAMPLE_MODELS[dayIndex];
};

// Featured narrative
const getFeaturedNarrative = () => {
  const dayIndex = new Date().getDate() % SAMPLE_NARRATIVES.length;
  return SAMPLE_NARRATIVES[dayIndex];
};

export default function HomeScreen() {
  const { bookmarks } = useBookmarks();
  const featuredModel = getFeaturedModel();
  const featuredNarrative = getFeaturedNarrative();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Welcome section */}
      <View style={styles.welcomeSection}>
        <Text style={styles.welcomeTitle}>Welcome to HUMMBL</Text>
        <Text style={styles.welcomeSubtitle}>
          Mental models and frameworks for better thinking
        </Text>
      </View>

      {/* Daily Insight */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Today's Model</Text>
        <Link href={`/mental-models/${featuredModel.id}` as any} asChild>
          <Pressable style={styles.featuredCard}>
            <View style={[styles.featuredBadge, { backgroundColor: colors.transformations[featuredModel.transformation] }]}>
              <Text style={styles.featuredBadgeText}>{featuredModel.code}</Text>
            </View>
            <Text style={styles.featuredTitle}>{featuredModel.name}</Text>
            <Text style={styles.featuredDescription} numberOfLines={2}>
              {featuredModel.description}
            </Text>
            <View style={styles.featuredFooter}>
              <Text style={styles.featuredCategory}>{featuredModel.category}</Text>
              <Ionicons name="arrow-forward" size={16} color={colors.primary[500]} />
            </View>
          </Pressable>
        </Link>
      </View>

      {/* Quick actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Access</Text>

        <QuickAction
          icon="grid"
          title="Mental Models"
          description={`${SAMPLE_MODELS.length} thinking frameworks`}
          href="/explore"
          color={colors.transformations.DE}
        />

        <QuickAction
          icon="document-text"
          title="Narratives"
          description={`${SAMPLE_NARRATIVES.length} evidence-based insights`}
          href="/explore"
          color={colors.transformations.SY}
        />

        <QuickAction
          icon="search"
          title="Search"
          description="Find specific models"
          href="/search"
          color={colors.transformations.CO}
        />

        <QuickAction
          icon="bookmark"
          title="Bookmarks"
          description={bookmarks.length > 0 ? `${bookmarks.length} saved items` : 'Your saved items'}
          href="/bookmarks"
          color={colors.transformations.P}
        />
      </View>

      {/* Featured Narrative */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Featured Narrative</Text>
        <Link href={`/narratives/${featuredNarrative.id}` as any} asChild>
          <Pressable style={styles.narrativeCard}>
            <View style={styles.narrativeHeader}>
              <View style={[styles.evidenceBadge, { backgroundColor: colors.evidence[featuredNarrative.evidenceQuality] }]}>
                <Text style={styles.evidenceBadgeText}>
                  {featuredNarrative.evidenceQuality === 'A' ? 'Strong' : featuredNarrative.evidenceQuality === 'B' ? 'Moderate' : 'Limited'}
                </Text>
              </View>
              <Text style={styles.confidenceText}>
                {Math.round(featuredNarrative.confidence * 100)}% confidence
              </Text>
            </View>
            <Text style={styles.narrativeTitle}>{featuredNarrative.title}</Text>
            <Text style={styles.narrativeDescription} numberOfLines={2}>
              {featuredNarrative.summary}
            </Text>
          </Pressable>
        </Link>
      </View>

      {/* Stats section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>At a Glance</Text>
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{SAMPLE_MODELS.length}</Text>
            <Text style={styles.statLabel}>Models</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>6</Text>
            <Text style={styles.statLabel}>Domains</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{SAMPLE_NARRATIVES.length}</Text>
            <Text style={styles.statLabel}>Narratives</Text>
          </View>
        </View>
      </View>

      {/* Transformation domains */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Transformation Domains</Text>
        <View style={styles.domainsGrid}>
          {[
            { code: 'P', name: 'Perspective', color: colors.transformations.P },
            { code: 'IN', name: 'Inversion', color: colors.transformations.IN },
            { code: 'CO', name: 'Composition', color: colors.transformations.CO },
            { code: 'DE', name: 'Decomposition', color: colors.transformations.DE },
            { code: 'RE', name: 'Recursion', color: colors.transformations.RE },
            { code: 'SY', name: 'Systems', color: colors.transformations.SY },
          ].map((domain) => (
            <View key={domain.code} style={styles.domainChip}>
              <View style={[styles.domainDot, { backgroundColor: domain.color }]} />
              <Text style={styles.domainCode}>{domain.code}</Text>
              <Text style={styles.domainName}>{domain.name}</Text>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.secondary,
  },
  content: {
    padding: layout.screenPadding,
    paddingBottom: spacing.xxl,
  },
  welcomeSection: {
    paddingVertical: spacing.lg,
  },
  welcomeTitle: {
    ...typography.displaySmall,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  welcomeSubtitle: {
    ...typography.bodyLarge,
    color: colors.text.secondary,
  },
  section: {
    marginTop: spacing.lg,
  },
  sectionTitle: {
    ...typography.headingMedium,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  quickAction: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.primary,
    padding: layout.cardPadding,
    borderRadius: layout.cardBorderRadius,
    marginBottom: spacing.sm,
  },
  quickActionIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  quickActionContent: {
    flex: 1,
  },
  quickActionTitle: {
    ...typography.labelLarge,
    color: colors.text.primary,
  },
  quickActionDescription: {
    ...typography.bodySmall,
    color: colors.text.secondary,
    marginTop: spacing.xxs,
  },
  featuredCard: {
    backgroundColor: colors.background.primary,
    padding: layout.cardPadding,
    borderRadius: layout.cardBorderRadius,
  },
  featuredBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: 6,
    marginBottom: spacing.sm,
  },
  featuredBadgeText: {
    ...typography.labelMedium,
    color: colors.text.inverse,
  },
  featuredTitle: {
    ...typography.headingMedium,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  featuredDescription: {
    ...typography.bodyMedium,
    color: colors.text.secondary,
    lineHeight: 22,
    marginBottom: spacing.md,
  },
  featuredFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  featuredCategory: {
    ...typography.labelSmall,
    color: colors.text.secondary,
  },
  narrativeCard: {
    backgroundColor: colors.background.primary,
    padding: layout.cardPadding,
    borderRadius: layout.cardBorderRadius,
  },
  narrativeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  evidenceBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs,
    borderRadius: 4,
  },
  evidenceBadgeText: {
    ...typography.caption,
    color: colors.text.inverse,
  },
  confidenceText: {
    ...typography.caption,
    color: colors.text.secondary,
  },
  narrativeTitle: {
    ...typography.labelLarge,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  narrativeDescription: {
    ...typography.bodyMedium,
    color: colors.text.secondary,
    lineHeight: 22,
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.background.primary,
    padding: layout.cardPadding,
    borderRadius: layout.cardBorderRadius,
    alignItems: 'center',
  },
  statNumber: {
    ...typography.displaySmall,
    color: colors.primary[500],
  },
  statLabel: {
    ...typography.labelSmall,
    color: colors.text.secondary,
    marginTop: spacing.xxs,
  },
  domainsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  domainChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.primary,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: 20,
  },
  domainDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: spacing.xs,
  },
  domainCode: {
    ...typography.labelMedium,
    color: colors.text.primary,
    marginRight: spacing.xs,
  },
  domainName: {
    ...typography.bodySmall,
    color: colors.text.secondary,
  },
});
