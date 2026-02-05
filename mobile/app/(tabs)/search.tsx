// Using SY8 (Systems) - Search screen with fuzzy matching

import { useState, useMemo, useCallback } from 'react';
import { View, Text, TextInput, ScrollView, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, layout, typography } from '../../theme';
import { MentalModelCard, NarrativeCard } from '../../components';
import { SAMPLE_MODELS, SAMPLE_NARRATIVES } from '../../services/data';
import { fuzzySearch, highlightMatches } from '@hummbl/shared';

type SearchResult = {
  type: 'model' | 'narrative';
  item: typeof SAMPLE_MODELS[0] | typeof SAMPLE_NARRATIVES[0];
  score: number;
};

const SUGGESTIONS = ['First Principles', 'Systems', 'Decision Making', 'Risk', 'Feedback'];

export default function SearchScreen() {
  const [query, setQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState(['systems', 'cognitive', 'decision']);

  const results = useMemo(() => {
    if (!query.trim()) return [];

    // Search both models and narratives
    const modelResults = fuzzySearch(
      SAMPLE_MODELS.map((m) => ({ ...m, searchText: `${m.code} ${m.name} ${m.description}` })),
      query,
      { keys: ['name', 'code', 'description', 'tags'], threshold: 0.4, limit: 10 }
    ).map((r) => ({ type: 'model' as const, item: r.item, score: r.score }));

    const narrativeResults = fuzzySearch(
      SAMPLE_NARRATIVES.map((n) => ({ ...n, searchText: `${n.title} ${n.summary}` })),
      query,
      { keys: ['title', 'summary', 'category', 'tags'], threshold: 0.4, limit: 10 }
    ).map((r) => ({ type: 'narrative' as const, item: r.item, score: r.score }));

    // Combine and sort by score
    return [...modelResults, ...narrativeResults].sort((a, b) => b.score - a.score);
  }, [query]);

  const clearSearch = useCallback(() => {
    setQuery('');
  }, []);

  const handleSearch = useCallback((searchQuery: string) => {
    setQuery(searchQuery);
    if (searchQuery.trim() && !recentSearches.includes(searchQuery.toLowerCase())) {
      setRecentSearches((prev) => [searchQuery.toLowerCase(), ...prev.slice(0, 4)]);
    }
  }, [recentSearches]);

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
            onSubmitEditing={() => handleSearch(query)}
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
              {results.map((result, index) => (
                result.type === 'model' ? (
                  <MentalModelCard
                    key={`model-${result.item.id}`}
                    id={result.item.id}
                    code={(result.item as typeof SAMPLE_MODELS[0]).code}
                    name={(result.item as typeof SAMPLE_MODELS[0]).name}
                    description={(result.item as typeof SAMPLE_MODELS[0]).description}
                    transformation={(result.item as typeof SAMPLE_MODELS[0]).transformation}
                    difficulty={(result.item as typeof SAMPLE_MODELS[0]).difficulty}
                  />
                ) : (
                  <NarrativeCard
                    key={`narrative-${result.item.id}`}
                    id={result.item.id}
                    title={(result.item as typeof SAMPLE_NARRATIVES[0]).title}
                    summary={(result.item as typeof SAMPLE_NARRATIVES[0]).summary}
                    category={(result.item as typeof SAMPLE_NARRATIVES[0]).category}
                    evidenceQuality={(result.item as typeof SAMPLE_NARRATIVES[0]).evidenceQuality}
                    confidence={(result.item as typeof SAMPLE_NARRATIVES[0]).confidence}
                  />
                )
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
          // Recent searches and suggestions
          <View style={styles.recentSection}>
            {recentSearches.length > 0 && (
              <>
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
              </>
            )}

            <Text style={[styles.sectionTitle, { marginTop: spacing.lg }]}>
              Suggestions
            </Text>
            <View style={styles.suggestionsGrid}>
              {SUGGESTIONS.map((suggestion) => (
                <Pressable
                  key={suggestion}
                  style={styles.suggestionChip}
                  onPress={() => setQuery(suggestion)}
                >
                  <Text style={styles.suggestionText}>{suggestion}</Text>
                </Pressable>
              ))}
            </View>

            {/* Transformation quick filters */}
            <Text style={[styles.sectionTitle, { marginTop: spacing.lg }]}>
              Browse by Transformation
            </Text>
            <View style={styles.transformationGrid}>
              {(['P', 'IN', 'CO', 'DE', 'RE', 'SY'] as const).map((t) => (
                <Pressable
                  key={t}
                  style={[styles.transformationChip, { borderColor: colors.transformations[t] }]}
                  onPress={() => setQuery(t)}
                >
                  <View style={[styles.transformationDot, { backgroundColor: colors.transformations[t] }]} />
                  <Text style={[styles.transformationText, { color: colors.transformations[t] }]}>{t}</Text>
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
  transformationGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  transformationChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.primary,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: 20,
    borderWidth: 1,
    gap: spacing.xs,
  },
  transformationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  transformationText: {
    ...typography.labelMedium,
  },
});
