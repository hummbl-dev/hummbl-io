import { useState, useMemo } from 'react';
import type { MentalModel } from '@cascade/types/mental-model';
import type { FilterOptions } from '../components/mental-models/MentalModelsFilters';

export function useMentalModelFilters(models: MentalModel[]) {
  const [filters, setFilters] = useState<FilterOptions>({
    searchTerm: '',
    category: null,
    transformation: null,
    sortBy: 'name-asc',
  });

  // Get unique categories
  const categories = useMemo(() => {
    const cats = new Set<string>();
    models.forEach((model) => {
      if (model.category) cats.add(model.category);
    });
    return Array.from(cats).sort();
  }, [models]);

  // Get unique transformations
  const transformations = useMemo(() => {
    const trans = new Set<string>();
    models.forEach((model) => {
      model.transformations?.forEach((t) => trans.add(t));
    });
    return Array.from(trans).sort();
  }, [models]);

  // Filter and sort models
  const filteredModels = useMemo(() => {
    let result = [...models];

    // Apply search filter (minimum 2 characters for better accuracy)
    if (filters.searchTerm && filters.searchTerm.length >= 2) {
      const searchLower = filters.searchTerm.toLowerCase();
      const searchWords = searchLower.split(/\s+/).filter((w) => w.length > 0);

      // Pre-compile regex once for performance
      const wordBoundaryRegex = new RegExp(
        `\\b${searchLower.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`
      );

      // Score and filter in single pass to reduce memory allocations
      const scored: Array<{ model: MentalModel; score: number }> = [];

      for (const model of result) {
        let score = 0;
        const nameLower = model.name.toLowerCase();
        const descLower = model.description?.toLowerCase() || '';
        const codeLower = model.code?.toLowerCase() || '';

        // Exact name match (highest priority)
        if (nameLower === searchLower) {
          score += 1000;
        }
        // Name starts with search term
        else if (nameLower.startsWith(searchLower)) {
          score += 500;
        }
        // Name contains search at word boundary
        else if (wordBoundaryRegex.test(nameLower)) {
          score += 300;
        }
        // Name contains search anywhere
        else if (nameLower.includes(searchLower)) {
          score += 100;
        }

        // Code exact match
        if (codeLower === searchLower) {
          score += 400;
        } else if (codeLower.includes(searchLower)) {
          score += 50;
        }

        // Check if all search words match (only if we have multiple words)
        if (searchWords.length > 1) {
          const allWordsMatch = searchWords.every(
            (word) =>
              nameLower.includes(word) ||
              descLower.includes(word) ||
              model.tags?.some((tag) => tag.toLowerCase().includes(word))
          );

          if (allWordsMatch) {
            score += 200;
          }
        }

        // Description contains search (only check if score is still low)
        if (score < 100 && descLower.includes(searchLower)) {
          score += 50;
        }

        // Tags contain search (only check if score is still low)
        if (score < 100 && model.tags?.some((tag) => tag.toLowerCase().includes(searchLower))) {
          score += 75;
        }

        // Only add if score is positive
        if (score > 0) {
          scored.push({ model, score });
        }
      }

      // Sort by score descending and extract models
      scored.sort((a, b) => b.score - a.score);
      result = scored.map(({ model }) => model);
    }

    // Apply category filter
    if (filters.category) {
      result = result.filter((model) => model.category === filters.category);
    }

    // Apply transformation filter
    if (filters.transformation) {
      result = result.filter((model) =>
        model.transformations?.includes(filters.transformation as any)
      );
    }

    // Apply sorting
    result.sort((a, b) => {
      switch (filters.sortBy) {
        case 'name-asc':
          return a.name.localeCompare(b.name);
        case 'name-desc':
          return b.name.localeCompare(a.name);
        case 'difficulty-asc':
          return (a.meta?.difficulty || 0) - (b.meta?.difficulty || 0);
        case 'difficulty-desc':
          return (b.meta?.difficulty || 0) - (a.meta?.difficulty || 0);
        default:
          return 0;
      }
    });

    return result;
  }, [models, filters]);

  return {
    filters,
    setFilters,
    filteredModels,
    categories,
    transformations,
    resultCount: filteredModels.length,
    totalCount: models.length,
  };
}
