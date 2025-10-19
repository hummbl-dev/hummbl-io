import { useState, useMemo } from 'react';
import type { MentalModel } from '@/models/mentalModels';
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

    // Apply search filter
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      result = result.filter(
        (model) =>
          model.name.toLowerCase().includes(searchLower) ||
          model.description?.toLowerCase().includes(searchLower) ||
          model.tags?.some((tag) => tag.toLowerCase().includes(searchLower)) ||
          model.code?.toLowerCase().includes(searchLower)
      );
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
