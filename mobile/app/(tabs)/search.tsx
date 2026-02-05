// Using SY8 (Systems) - Search screen with fuzzy matching

import { useState, useMemo, useCallback } from 'react';
import { View, Text, TextInput, ScrollView, StyleSheet, Pressable } from 'react-native';
import { Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, layout, typography } from '../../theme';
import { fuzzySearch, highlightMatches } from '@hummbl/shared';

// Sample data - will be replaced with real data
const SEARCH_DATA = [
  { id: '1', type: 'model' as const, code: 'P1', name: 'First Principles', description: 'Break down complex problems into basic elements' },
  { id: '2', type: 'model' as const, code: 'IN1', name: 'Inversion', description: 'Think backwards from the desired outcome' },
  { id: '3', type: 'model' as const, code: 'CO1', name: 'Composition', description: 'Combine simple elements into complex systems' },
  { id: '4', type: 'model' as const, code: 'DE1', name: 'Decomposition', description: 'Break complex problems into manageable parts' },
  { id: '5', type: 'model' as const, code: 'RE1', name: 'Recursion', description: 'Apply patterns at multiple levels' },
  { id: '6', type: 'model' as const, code: 'SY1', name: 'Systems Thinking', description: 'Understand interconnections and feedback loops' },
  { id: '7', type: 'narrative' as const, name: 'Decision Making Under Uncertainty', description: 'Frameworks for making decisions with incomplete information' },
  { id: '8', type: 'narrative' as const, name: 'Cognitive Biases', description: 'Understanding systematic errors in thinking' },
];

function HighlightedText({ text, query }: { text: string; query: string }) {
  const parts = highlightMatches(text, query);

  return (
    <Text style={styles.resultTitle}>
      {parts.map((part, i) => (
        <Text
          key={i}
          style={part.highlight ? styles.highlight : undefined}
        >
          {part.text}
        </Text>
      ))}
    </Text>
  );
}

function SearchResult({ item, query }: { item: typeof SEARCH_DATA[0]; query: string }) {
  const href = item.type === 'model'
    ? `/mental-models/${item.id}`
    : `/narratives/${item.id}`;

  return (
    <Link href={href as any} asChild>
      <Pressable style={styles.resultCard}>
        <View style={styles.resultIcon}>
          <Ionicons
            name={item.type === 'model' ? 'grid' : 'document-text'}
            size={20}
            color={colors.primary[500]}
          />
        </View>
        <View style={styles.resultContent}>
          <View style={styles.resultHeader}>
            {item.code && (
              <Text style={styles.resultCode}>{item.code}</Text>
            )}
            <HighlightedText text={item.name} query={query} />
          </View>
          <Text style={styles.resultDescription} numberOfLines={2}>
            {item.description}
          </Text>
          <Text style={styles.resultType}>
            {item.type === 'model' ? 'Mental Model' : 'Narrative'}
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color={colors.text.secondary} />
      </Pressable>
    </Link>
  );
}

export default function SearchScreen() {
  const [query, setQuery] = useState('');
  const [recentSearches] = useState(['systems', 'cognitive', 'decision']);

  const results = useMemo(() => {
    if (!query.trim()) return [];

    return fuzzySearch(SEARCH_DATA, query, {
      keys: ['name', 'code', 'description'],
      threshold: 0.3,
      limit: 20,
    });
  }, [query]);

  const clearSearch = useCallback(() => {
    setQuery('');
  }, []);

  return (
    <View style={styles.container}>
      {/* Search input */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Ionicons name="search" size={20} color={colors.text.secondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search models, narratives..."
            placeholderTextColor={colors.text.secondary}
            value={query}
            onChangeText={setQuery}
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="search"
          />
          {query.length > 0 && (
            <Pressable onPress={clearSearch} hitSlop={8}>
              <Ionicons name="close-circle" size={20} color={colors.text.secondary} />
            </Pressable>
          )}
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {query.trim() ? (
          // Search results
          results.length > 0 ? (
            <View style={styles.resultsSection}>
              <Text style={styles.resultsCount}>
                {results.length} result{results.length !== 1 ? 's' : ''}
              </Text>
              {results.map((result) => (
                <SearchResult key={result.item.id} item={result.item} query={query} />
              ))}
            </View>
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="search-outline" size={48} color={colors.text.secondary} />
              <Text style={styles.emptyStateTitle}>No results found</Text>
              <Text style={styles.emptyStateText}>
                Try searching with different keywords
              </Text>
            </View>
          )
        ) : (
          // Recent searches
          <View style={styles.recentSection}>
            <Text style={styles.sectionTitle}>Recent Searches</Text>
            {recentSearches.map((search, index) => (
              <Pressable
                key={index}
                style={styles.recentItem}
                onPress={() => setQuery(search)}
              >
                <Ionicons name="time-outline" size={18} color={colors.text.secondary} />
                <Text style={styles.recentText}>{search}</Text>
              </Pressable>
            ))}

            <Text style={[styles.sectionTitle, { marginTop: spacing.lg }]}>
              Suggestions
            </Text>
            <View style={styles.suggestionsGrid}>
              {['First Principles', 'Systems', 'Decision Making', 'Cognitive'].map((suggestion) => (
                <Pressable
                  key={suggestion}
                  style={styles.suggestionChip}
                  onPress={() => setQuery(suggestion)}
                >
                  <Text style={styles.suggestionText}>{suggestion}</Text>
                </Pressable>
              ))}
            </View>
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
  searchContainer: {
    padding: layout.screenPadding,
    backgroundColor: colors.background.primary,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.secondary,
    paddingHorizontal: spacing.md,
    borderRadius: layout.inputBorderRadius,
    gap: spacing.sm,
  },
  searchInput: {
    flex: 1,
    ...typography.bodyMedium,
    color: colors.text.primary,
    paddingVertical: spacing.md,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: layout.screenPadding,
  },
  resultsSection: {
    gap: spacing.sm,
  },
  resultsCount: {
    ...typography.labelSmall,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
  },
  resultCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.primary,
    padding: layout.cardPadding,
    borderRadius: layout.cardBorderRadius,
  },
  resultIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: colors.primary[50],
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  resultContent: {
    flex: 1,
  },
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: spacing.xxs,
  },
  resultCode: {
    ...typography.labelSmall,
    color: colors.primary[500],
    backgroundColor: colors.primary[50],
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
    borderRadius: 4,
  },
  resultTitle: {
    ...typography.labelLarge,
    color: colors.text.primary,
  },
  highlight: {
    backgroundColor: colors.primary[100],
    color: colors.primary[700],
  },
  resultDescription: {
    ...typography.bodySmall,
    color: colors.text.secondary,
    marginBottom: spacing.xxs,
  },
  resultType: {
    ...typography.caption,
    color: colors.text.secondary,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: spacing.xxl,
  },
  emptyStateTitle: {
    ...typography.headingMedium,
    color: colors.text.primary,
    marginTop: spacing.md,
  },
  emptyStateText: {
    ...typography.bodyMedium,
    color: colors.text.secondary,
    marginTop: spacing.xs,
  },
  recentSection: {},
  sectionTitle: {
    ...typography.labelMedium,
    color: colors.text.secondary,
    marginBottom: spacing.sm,
  },
  recentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.sm,
  },
  recentText: {
    ...typography.bodyMedium,
    color: colors.text.primary,
  },
  suggestionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  suggestionChip: {
    backgroundColor: colors.background.primary,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  suggestionText: {
    ...typography.labelMedium,
    color: colors.text.primary,
  },
});
