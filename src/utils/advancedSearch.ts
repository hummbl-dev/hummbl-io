// Advanced search engine with fuzzy matching and multi-field support

import type { Narrative } from '@cascade/types/narrative';
import type { MentalModel } from '../types/mental-model';

export interface SearchOptions {
  fuzzyThreshold?: number; // 0-1, lower = more strict
  maxResults?: number;
  fields?: string[];
  caseSensitive?: boolean;
  includeHighlights?: boolean;
}

export interface SearchResult<T> {
  item: T;
  score: number;
  matches: SearchMatch[];
  highlights?: Record<string, string>;
}

export interface SearchMatch {
  field: string;
  indices: [number, number][];
  score: number;
}

/**
 * Calculate Levenshtein distance between two strings
 * Optimized with early exit and length-based short circuit
 */
function levenshteinDistance(str1: string, str2: string): number {
  const len1 = str1.length;
  const len2 = str2.length;

  // Early exits for performance
  if (len1 === 0) return len2;
  if (len2 === 0) return len1;
  if (str1 === str2) return 0;

  // If length difference is too large, skip expensive calculation
  const maxLen = Math.max(len1, len2);
  const minLen = Math.min(len1, len2);
  if ((maxLen - minLen) / maxLen > 0.5) {
    return maxLen; // Too different to be a good match
  }

  // Use only two rows instead of full matrix for memory optimization
  let prevRow: number[] = new Array(len2 + 1);
  let currRow: number[] = new Array(len2 + 1);

  // Initialize first row
  for (let j = 0; j <= len2; j++) {
    prevRow[j] = j;
  }

  for (let i = 1; i <= len1; i++) {
    currRow[0] = i;

    for (let j = 1; j <= len2; j++) {
      const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
      currRow[j] = Math.min(
        prevRow[j] + 1, // deletion
        currRow[j - 1] + 1, // insertion
        prevRow[j - 1] + cost // substitution
      );
    }

    // Swap rows for next iteration
    [prevRow, currRow] = [currRow, prevRow];
  }

  return prevRow[len2];
}

// Cache for fuzzy score results to avoid recalculating
const fuzzyScoreCache = new Map<string, number>();
const MAX_CACHE_SIZE = 1000;

/**
 * Calculate fuzzy match score (0-1, higher is better)
 * Optimized with caching and early exits
 */
function fuzzyScore(query: string, text: string, caseSensitive = false): number {
  if (!query || !text) return 0;

  const q = caseSensitive ? query : query.toLowerCase();
  const t = caseSensitive ? text : text.toLowerCase();

  // Check cache first
  const cacheKey = `${q}:${t}`;
  if (fuzzyScoreCache.has(cacheKey)) {
    return fuzzyScoreCache.get(cacheKey)!;
  }

  let score = 0;

  // Exact match
  if (t === q) {
    score = 1.0;
  }
  // Contains match
  else if (t.includes(q)) {
    score = 0.9;
  }
  // Word boundary match
  else {
    const words = t.split(/\s+/);
    for (const word of words) {
      if (word === q) {
        score = 0.85;
        break;
      }
      if (word.startsWith(q)) {
        score = 0.8;
        break;
      }
    }

    // Fuzzy match using Levenshtein distance (only if no other match found)
    if (score === 0) {
      const distance = levenshteinDistance(q, t);
      const maxLen = Math.max(q.length, t.length);
      const similarity = 1 - distance / maxLen;
      score = similarity > 0.5 ? similarity * 0.7 : 0;
    }
  }

  // Cache the result (with size limit)
  if (fuzzyScoreCache.size >= MAX_CACHE_SIZE) {
    // Clear oldest entries (simple LRU approximation)
    const keysToDelete = Array.from(fuzzyScoreCache.keys()).slice(0, 100);
    keysToDelete.forEach((k) => fuzzyScoreCache.delete(k));
  }
  fuzzyScoreCache.set(cacheKey, score);

  return score;
}

/**
 * Find match indices in text
 */
function findMatchIndices(query: string, text: string, caseSensitive = false): [number, number][] {
  const indices: [number, number][] = [];
  const q = caseSensitive ? query : query.toLowerCase();
  const t = caseSensitive ? text : text.toLowerCase();

  let startIndex = 0;
  while (startIndex < t.length) {
    const index = t.indexOf(q, startIndex);
    if (index === -1) break;

    indices.push([index, index + q.length]);
    startIndex = index + 1;
  }

  return indices;
}

/**
 * Highlight matches in text
 */
function highlightMatches(text: string, indices: [number, number][]): string {
  if (indices.length === 0) return text;

  let result = '';
  let lastIndex = 0;

  // Sort and merge overlapping indices
  const sortedIndices = [...indices].sort((a, b) => a[0] - b[0]);
  const merged: [number, number][] = [];

  for (const [start, end] of sortedIndices) {
    if (merged.length === 0 || start > merged[merged.length - 1][1]) {
      merged.push([start, end]);
    } else {
      merged[merged.length - 1][1] = Math.max(merged[merged.length - 1][1], end);
    }
  }

  for (const [start, end] of merged) {
    result += text.substring(lastIndex, start);
    result += `<mark>${text.substring(start, end)}</mark>`;
    lastIndex = end;
  }

  result += text.substring(lastIndex);
  return result;
}

/**
 * Search narratives with fuzzy matching
 */
export function searchNarratives(
  narratives: Narrative[],
  query: string,
  options: SearchOptions = {}
): SearchResult<Narrative>[] {
  const {
    fuzzyThreshold = 0.3,
    maxResults = 50,
    fields = ['title', 'summary', 'category', 'tags'],
    caseSensitive = false,
    includeHighlights = true,
  } = options;

  if (!query.trim()) return [];

  const results: SearchResult<Narrative>[] = [];

  for (const narrative of narratives) {
    const matches: SearchMatch[] = [];
    let totalScore = 0;

    // Search each field
    for (const field of fields) {
      let fieldValue = '';

      if (field === 'tags' && narrative.tags) {
        fieldValue = narrative.tags.join(' ');
      } else if (field === 'domain' && narrative.domain) {
        fieldValue = narrative.domain.join(' ');
      } else if (field in narrative) {
        fieldValue = String(narrative[field as keyof Narrative] || '');
      }

      if (!fieldValue) continue;

      const score = fuzzyScore(query, fieldValue, caseSensitive);

      if (score >= fuzzyThreshold) {
        const indices = findMatchIndices(query, fieldValue, caseSensitive);
        matches.push({ field, indices, score });
        totalScore += score;
      }
    }

    if (matches.length > 0) {
      const result: SearchResult<Narrative> = {
        item: narrative,
        score: totalScore / matches.length,
        matches,
      };

      if (includeHighlights) {
        result.highlights = {};
        for (const match of matches) {
          const fieldValue =
            match.field === 'tags' && narrative.tags
              ? narrative.tags.join(', ')
              : match.field === 'domain' && narrative.domain
                ? narrative.domain.join(', ')
                : String(narrative[match.field as keyof Narrative] || '');

          result.highlights[match.field] = highlightMatches(fieldValue, match.indices);
        }
      }

      results.push(result);
    }
  }

  // Sort by score descending
  results.sort((a, b) => b.score - a.score);

  return results.slice(0, maxResults);
}

/**
 * Search mental models with fuzzy matching
 */
export function searchMentalModels(
  models: MentalModel[],
  query: string,
  options: SearchOptions = {}
): SearchResult<MentalModel>[] {
  const {
    fuzzyThreshold = 0.3,
    maxResults = 50,
    fields = ['name', 'description', 'category', 'tags'],
    caseSensitive = false,
    includeHighlights = true,
  } = options;

  if (!query.trim()) return [];

  const results: SearchResult<MentalModel>[] = [];

  for (const model of models) {
    const matches: SearchMatch[] = [];
    let totalScore = 0;

    // Search each field
    for (const field of fields) {
      let fieldValue = '';

      if (field === 'tags' && model.tags) {
        fieldValue = model.tags.join(' ');
      } else if (field in model) {
        fieldValue = String(model[field as keyof MentalModel] || '');
      }

      if (!fieldValue) continue;

      const score = fuzzyScore(query, fieldValue, caseSensitive);

      if (score >= fuzzyThreshold) {
        const indices = findMatchIndices(query, fieldValue, caseSensitive);
        matches.push({ field, indices, score });
        totalScore += score;
      }
    }

    if (matches.length > 0) {
      const result: SearchResult<MentalModel> = {
        item: model,
        score: totalScore / matches.length,
        matches,
      };

      if (includeHighlights) {
        result.highlights = {};
        for (const match of matches) {
          const fieldValue =
            match.field === 'tags' && model.tags
              ? model.tags.join(', ')
              : String(model[match.field as keyof MentalModel] || '');

          result.highlights[match.field] = highlightMatches(fieldValue, match.indices);
        }
      }

      results.push(result);
    }
  }

  // Sort by score descending
  results.sort((a, b) => b.score - a.score);

  return results.slice(0, maxResults);
}

/**
 * Multi-query search (AND logic)
 */
export function multiQuerySearch<T>(
  items: T[],
  queries: string[],
  searchFn: (items: T[], query: string, options?: SearchOptions) => SearchResult<T>[],
  options: SearchOptions = {}
): SearchResult<T>[] {
  if (queries.length === 0) return [];

  // Get results for first query
  let results = searchFn(items, queries[0], options);

  // Filter by remaining queries
  for (let i = 1; i < queries.length; i++) {
    const query = queries[i];
    const queryResults = searchFn(items, query, options);
    const resultIds = new Set(queryResults.map((r) => r.item));

    results = results.filter((r) => resultIds.has(r.item));
  }

  return results;
}

/**
 * Get search suggestions based on query
 */
export function getSearchSuggestions(
  query: string,
  recentSearches: string[],
  maxSuggestions = 5
): string[] {
  if (!query.trim()) return recentSearches.slice(0, maxSuggestions);

  const q = query.toLowerCase();
  const suggestions: Array<{ text: string; score: number }> = [];

  for (const search of recentSearches) {
    const score = fuzzyScore(q, search);
    if (score > 0.3) {
      suggestions.push({ text: search, score });
    }
  }

  suggestions.sort((a, b) => b.score - a.score);
  return suggestions.slice(0, maxSuggestions).map((s) => s.text);
}
