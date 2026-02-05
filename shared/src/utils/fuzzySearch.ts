// Using SY8 (Systems) - Fuzzy search algorithm for mental models and narratives

export interface SearchResult<T> {
  item: T;
  score: number;
  matches: string[];
}

export interface FuzzySearchOptions {
  keys: string[];
  threshold?: number; // 0-1, lower = stricter
  limit?: number;
}

// Using DE3 (Decomposition) - Break search into composable parts

/**
 * Calculate similarity between two strings (0-1)
 */
function similarity(s1: string, s2: string): number {
  const longer = s1.length > s2.length ? s1 : s2;
  const shorter = s1.length > s2.length ? s2 : s1;

  if (longer.length === 0) return 1.0;

  const editDistance = levenshteinDistance(longer, shorter);
  return (longer.length - editDistance) / longer.length;
}

/**
 * Levenshtein distance between two strings
 */
function levenshteinDistance(s1: string, s2: string): number {
  const costs: number[] = [];

  for (let i = 0; i <= s1.length; i++) {
    let lastValue = i;
    for (let j = 0; j <= s2.length; j++) {
      if (i === 0) {
        costs[j] = j;
      } else if (j > 0) {
        let newValue = costs[j - 1];
        if (s1.charAt(i - 1) !== s2.charAt(j - 1)) {
          newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
        }
        costs[j - 1] = lastValue;
        lastValue = newValue;
      }
    }
    if (i > 0) costs[s2.length] = lastValue;
  }
  return costs[s2.length];
}

/**
 * Get nested value from object using dot notation
 */
function getNestedValue(obj: Record<string, unknown>, path: string): string {
  const value = path.split('.').reduce((acc: unknown, part) => {
    if (acc && typeof acc === 'object') {
      return (acc as Record<string, unknown>)[part];
    }
    return undefined;
  }, obj);

  if (Array.isArray(value)) {
    return value.join(' ');
  }

  return String(value ?? '');
}

/**
 * Fuzzy search through array of items
 */
export function fuzzySearch<T extends Record<string, unknown>>(
  items: T[],
  query: string,
  options: FuzzySearchOptions
): SearchResult<T>[] {
  const { keys, threshold = 0.3, limit = 50 } = options;
  const normalizedQuery = query.toLowerCase().trim();

  if (!normalizedQuery) {
    return items.slice(0, limit).map((item) => ({
      item,
      score: 1,
      matches: [],
    }));
  }

  const results: SearchResult<T>[] = [];

  for (const item of items) {
    let bestScore = 0;
    const matches: string[] = [];

    for (const key of keys) {
      const value = getNestedValue(item, key).toLowerCase();

      // Exact match
      if (value.includes(normalizedQuery)) {
        const exactScore = normalizedQuery.length / value.length;
        if (exactScore > bestScore) {
          bestScore = Math.min(1, exactScore + 0.5); // Boost exact matches
          matches.push(key);
        }
        continue;
      }

      // Fuzzy match
      const words = value.split(/\s+/);
      for (const word of words) {
        const score = similarity(normalizedQuery, word);
        if (score > threshold && score > bestScore) {
          bestScore = score;
          if (!matches.includes(key)) {
            matches.push(key);
          }
        }
      }
    }

    if (bestScore > threshold) {
      results.push({ item, score: bestScore, matches });
    }
  }

  // Sort by score descending
  results.sort((a, b) => b.score - a.score);

  return results.slice(0, limit);
}

/**
 * Highlight matching text in a string
 */
export function highlightMatches(
  text: string,
  query: string
): { text: string; highlight: boolean }[] {
  if (!query.trim()) {
    return [{ text, highlight: false }];
  }

  const normalizedQuery = query.toLowerCase();
  const normalizedText = text.toLowerCase();
  const result: { text: string; highlight: boolean }[] = [];

  let lastIndex = 0;
  let index = normalizedText.indexOf(normalizedQuery, lastIndex);

  while (index !== -1) {
    // Add non-matching text before match
    if (index > lastIndex) {
      result.push({
        text: text.slice(lastIndex, index),
        highlight: false,
      });
    }

    // Add matching text
    result.push({
      text: text.slice(index, index + query.length),
      highlight: true,
    });

    lastIndex = index + query.length;
    index = normalizedText.indexOf(normalizedQuery, lastIndex);
  }

  // Add remaining text
  if (lastIndex < text.length) {
    result.push({
      text: text.slice(lastIndex),
      highlight: false,
    });
  }

  return result.length > 0 ? result : [{ text, highlight: false }];
}
