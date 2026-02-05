// Using CO5 (Composition) - Bookmarks screen using shared hook

import { View, Text, ScrollView, StyleSheet, Pressable } from 'react-native';
import { Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, layout, typography } from '../../theme';
import { useBookmarks } from '@hummbl/shared';

function EmptyState() {
  return (
    <View style={styles.emptyState}>
      <Ionicons name="bookmark-outline" size={64} color={colors.text.secondary} />
      <Text style={styles.emptyTitle}>No bookmarks yet</Text>
      <Text style={styles.emptyText}>
        Save mental models and narratives to access them quickly
      </Text>
      <Link href="/explore" asChild>
        <Pressable style={styles.exploreButton}>
          <Text style={styles.exploreButtonText}>Explore Content</Text>
        </Pressable>
      </Link>
    </View>
  );
}

function BookmarkItem({ bookmark, onRemove }: {
  bookmark: { id: string; type: string; title: string; description?: string; createdAt: string };
  onRemove: () => void;
}) {
  const href = bookmark.type === 'mental-model'
    ? `/mental-models/${bookmark.id}`
    : `/narratives/${bookmark.id}`;

  return (
    <View style={styles.bookmarkCard}>
      <Link href={href as any} asChild>
        <Pressable style={styles.bookmarkContent}>
          <View style={styles.bookmarkIcon}>
            <Ionicons
              name={bookmark.type === 'mental-model' ? 'grid' : 'document-text'}
              size={20}
              color={colors.primary[500]}
            />
          </View>
          <View style={styles.bookmarkInfo}>
            <Text style={styles.bookmarkTitle}>{bookmark.title}</Text>
            {bookmark.description && (
              <Text style={styles.bookmarkDescription} numberOfLines={2}>
                {bookmark.description}
              </Text>
            )}
            <Text style={styles.bookmarkMeta}>
              {bookmark.type === 'mental-model' ? 'Mental Model' : 'Narrative'} ·{' '}
              {new Date(bookmark.createdAt).toLocaleDateString()}
            </Text>
          </View>
        </Pressable>
      </Link>
      <Pressable onPress={onRemove} style={styles.removeButton} hitSlop={8}>
        <Ionicons name="close-circle" size={24} color={colors.text.secondary} />
      </Pressable>
    </View>
  );
}

export default function BookmarksScreen() {
  const { bookmarks, modelBookmarks, narrativeBookmarks, removeBookmark } = useBookmarks();

  if (bookmarks.length === 0) {
    return <EmptyState />;
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Stats */}
      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{modelBookmarks.length}</Text>
          <Text style={styles.statLabel}>Models</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{narrativeBookmarks.length}</Text>
          <Text style={styles.statLabel}>Narratives</Text>
        </View>
      </View>

      {/* Model bookmarks */}
      {modelBookmarks.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Mental Models</Text>
          {modelBookmarks.map((bookmark) => (
            <BookmarkItem
              key={bookmark.id}
              bookmark={bookmark}
              onRemove={() => removeBookmark(bookmark.id)}
            />
          ))}
        </View>
      )}

      {/* Narrative bookmarks */}
      {narrativeBookmarks.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Narratives</Text>
          {narrativeBookmarks.map((bookmark) => (
            <BookmarkItem
              key={bookmark.id}
              bookmark={bookmark}
              onRemove={() => removeBookmark(bookmark.id)}
            />
          ))}
        </View>
      )}
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
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: layout.screenPadding,
    backgroundColor: colors.background.secondary,
  },
  emptyTitle: {
    ...typography.headingMedium,
    color: colors.text.primary,
    marginTop: spacing.md,
  },
  emptyText: {
    ...typography.bodyMedium,
    color: colors.text.secondary,
    textAlign: 'center',
    marginTop: spacing.xs,
    marginBottom: spacing.lg,
  },
  exploreButton: {
    backgroundColor: colors.primary[500],
    paddingVertical: layout.buttonPaddingVertical,
    paddingHorizontal: layout.buttonPaddingHorizontal,
    borderRadius: layout.buttonBorderRadius,
  },
  exploreButtonText: {
    ...typography.labelLarge,
    color: colors.text.inverse,
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.lg,
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
  section: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    ...typography.headingSmall,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  bookmarkCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.primary,
    borderRadius: layout.cardBorderRadius,
    marginBottom: spacing.sm,
  },
  bookmarkContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: layout.cardPadding,
  },
  bookmarkIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: colors.primary[50],
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  bookmarkInfo: {
    flex: 1,
  },
  bookmarkTitle: {
    ...typography.labelLarge,
    color: colors.text.primary,
  },
  bookmarkDescription: {
    ...typography.bodySmall,
    color: colors.text.secondary,
    marginTop: spacing.xxs,
  },
  bookmarkMeta: {
    ...typography.caption,
    color: colors.text.secondary,
    marginTop: spacing.xxs,
  },
  removeButton: {
    padding: spacing.md,
  },
});
