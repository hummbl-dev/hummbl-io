/**
 * Search Hook
 * 
 * Provides fuzzy search functionality across mental models.
 * Searches code, name, tags, and description fields.
 * 
 * @module hooks/useSearch
 * @version 1.0.0
 */

import { useState, useMemo } from 'react';
import type { MentalModel } from '../types/models';

interface SearchResult {
  model: MentalModel;
  score: number;
  matches: string[];
}

// Using P4 (Lens Shifting) to enable different search perspectives
export const useSearch = (models: MentalModel[]) => {
  const [query, setQuery] = useState<string>('');

  // Using DE5 (Optimization) for efficient search
  const results = useMemo((): SearchResult[] => {
    if (!query.trim()) {
      return models.map(model => ({ model, score: 1, matches: [] }));
    }

    const searchTerms = query.toLowerCase().trim().split(/\s+/);
    
    return models
      .map(model => {
        let score = 0;
        const matches: string[] = [];

        // Search in code (highest weight)
        if (model.code.toLowerCase().includes(query.toLowerCase())) {
          score += 100;
          matches.push('code');
        }

        // Search in name (high weight)
        const nameLower = model.name.toLowerCase();
        searchTerms.forEach(term => {
          if (nameLower.includes(term)) {
            score += 50;
            if (!matches.includes('name')) matches.push('name');
          }
        });

        // Search in tags (medium weight)
        model.tags.forEach(tag => {
          const tagLower = tag.toLowerCase();
          searchTerms.forEach(term => {
            if (tagLower.includes(term)) {
              score += 20;
              if (!matches.includes('tags')) matches.push('tags');
            }
          });
        });

        // Search in description (lower weight)
        const descLower = model.description.toLowerCase();
        searchTerms.forEach(term => {
          if (descLower.includes(term)) {
            score += 10;
            if (!matches.includes('description')) matches.push('description');
          }
        });

        return { model, score, matches };
      })
      .filter(result => result.score > 0)
      .sort((a, b) => b.score - a.score);
  }, [models, query]);

  const resultCount = results.length;
  const hasQuery = query.trim().length > 0;

  return {
    query,
    setQuery,
    results,
    resultCount,
    hasQuery,
  };
};
