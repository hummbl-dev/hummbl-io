// Tests for useSearchHistory hook

import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useSearchHistory } from '../useSearchHistory';

describe('useSearchHistory', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('addToHistory', () => {
    it('adds search to history', () => {
      const { result } = renderHook(() => useSearchHistory());

      act(() => {
        result.current.addToHistory({ query: 'test query', resultCount: 5 });
      });

      expect(result.current.history).toHaveLength(1);
      expect(result.current.history[0].query).toBe('test query');
    });

    it('does not add duplicate recent queries', () => {
      const { result } = renderHook(() => useSearchHistory());

      act(() => {
        result.current.addToHistory({ query: 'test query' });
        result.current.addToHistory({ query: 'test query' });
      });

      expect(result.current.history).toHaveLength(1);
    });

    it('limits history to MAX_HISTORY entries', () => {
      const { result } = renderHook(() => useSearchHistory());

      act(() => {
        for (let i = 0; i < 60; i++) {
          result.current.addToHistory({ query: `query ${i}` });
        }
      });

      expect(result.current.history.length).toBeLessThanOrEqual(50);
    });

    it('adds timestamp to entries', () => {
      const { result } = renderHook(() => useSearchHistory());

      act(() => {
        result.current.addToHistory({ query: 'test' });
      });

      expect(result.current.history[0].timestamp).toBeDefined();
      expect(result.current.history[0].timestamp).toBeGreaterThan(0);
    });
  });

  describe('updateHistoryEntry', () => {
    it('updates entry with selection info', () => {
      const { result } = renderHook(() => useSearchHistory());

      act(() => {
        result.current.addToHistory({ query: 'test query' });
        result.current.updateHistoryEntry('test query', 'result-1', 'title');
      });

      const entry = result.current.history.find((e) => e.query === 'test query');
      expect(entry?.selectedResult).toBe('result-1');
      expect(entry?.selectedField).toBe('title');
    });
  });

  describe('clearHistory', () => {
    it('clears all history', () => {
      const { result } = renderHook(() => useSearchHistory());

      act(() => {
        result.current.addToHistory({ query: 'test1' });
        result.current.addToHistory({ query: 'test2' });
        result.current.clearHistory();
      });

      expect(result.current.history).toHaveLength(0);
    });
  });

  describe('removeFromHistory', () => {
    it('removes specific entry', async () => {
      // Use a test component to better control the test flow
      const { result, rerender } = renderHook(() => useSearchHistory());
      
      // Clear any existing state
      act(() => {
        result.current.clearHistory();
      });
      rerender();
      
      // Add first item
      act(() => {
        result.current.addToHistory({ query: 'test1' });
      });
      rerender();
      
      // Add second item (will be at the beginning of the array)
      act(() => {
        result.current.addToHistory({ query: 'test2' });
      });
      rerender();
      
      // Verify the order is [test2, test1] since addToHistory adds to the beginning
      const initialQueries = result.current.history.map(entry => entry.query);
      console.log('Initial queries:', initialQueries);
      expect(initialQueries).toEqual(['test2', 'test1']);
      
      // Get the timestamps
      const timestamps = result.current.history.map(entry => entry.timestamp);
      console.log('Timestamps:', timestamps);
      expect(timestamps).toHaveLength(2);
      
      // Log the state before removal
      console.log('Before removal - history:', result.current.history);
      
      // Remove the first item (test2)
      act(() => {
        console.log('Removing timestamp:', timestamps[0]);
        result.current.removeFromHistory(timestamps[0]);
      });
      rerender();
      
      // Log the state after removal
      console.log('After removal - history:', result.current.history);
      
      // Verify the result - should only have test1 left
      expect(result.current.history).toHaveLength(1);
      expect(result.current.history[0].query).toBe('test1');
      expect(result.current.history[0].timestamp).toBe(timestamps[1]);
      
      // Verify the item was actually removed by checking the timestamp
      expect(result.current.history.some(entry => entry.timestamp === timestamps[0])).toBe(false);
    });
  });

  describe('getRecentSearches', () => {
    it('returns recent unique searches', () => {
      const { result } = renderHook(() => useSearchHistory());

      act(() => {
        result.current.addToHistory({ query: 'query1' });
        result.current.addToHistory({ query: 'query2' });
        result.current.addToHistory({ query: 'query3' });
      });

      const recent = result.current.getRecentSearches(2);

      expect(recent).toHaveLength(2);
      expect(recent).toEqual(['query3', 'query2']);
    });

    it('removes duplicate queries', () => {
      const { result } = renderHook(() => useSearchHistory());

      act(() => {
        result.current.addToHistory({ query: 'test' });
      });

      // Manually add duplicate with different case
      act(() => {
        result.current.history.push({
          query: 'TEST',
          timestamp: Date.now() - 10000,
        });
      });

      const recent = result.current.getRecentSearches(10);

      // Should only have one entry (normalized)
      const uniqueQueries = new Set(recent.map((q) => q.toLowerCase()));
      expect(uniqueQueries.size).toBe(recent.length);
    });
  });

  describe('getPopularSearches', () => {
    it('returns most frequent searches', () => {
      const { result } = renderHook(() => useSearchHistory());

      act(() => {
        // Manually add entries to test frequency
        const now = Date.now();
        result.current.history.push(
          { query: 'popular', timestamp: now - 1000 },
          { query: 'popular', timestamp: now - 2000 },
          { query: 'popular', timestamp: now - 3000 },
          { query: 'rare', timestamp: now - 4000 }
        );
      });

      const popular = result.current.getPopularSearches(2);

      expect(popular[0].query).toBe('popular');
      expect(popular[0].count).toBe(3);
    });
  });

  describe('Saved Searches', () => {
    it('saves a search', () => {
      const { result } = renderHook(() => useSearchHistory());

      act(() => {
        result.current.saveSearch('My Search', 'test query', { category: 'Test' });
      });

      expect(result.current.savedSearches).toHaveLength(1);
      expect(result.current.savedSearches[0].name).toBe('My Search');
      expect(result.current.savedSearches[0].query).toBe('test query');
    });

    it('deletes a saved search', () => {
      const { result } = renderHook(() => useSearchHistory());

      // Setup state
      act(() => {
        result.current.saveSearch('Search 1', 'query1');
      });

      // Ensure state is ready
      expect(result.current.savedSearches).toHaveLength(1);
      const id = result.current.savedSearches[0].id;

      // Perform the deletion
      act(() => {
        result.current.deleteSavedSearch(id);
      });

      // Verify the result
      expect(result.current.savedSearches).toHaveLength(0);
    });

    it('updates a saved search', () => {
      const { result } = renderHook(() => useSearchHistory());

      act(() => {
        result.current.saveSearch('Original', 'query');
      });

      const id = result.current.savedSearches[0].id;

      act(() => {
        result.current.updateSavedSearch(id, { name: 'Updated' });
      });

      expect(result.current.savedSearches[0].name).toBe('Updated');
    });

    it('gets saved search by ID', () => {
      const { result } = renderHook(() => useSearchHistory());

      act(() => {
        result.current.saveSearch('Test', 'query');
      });

      const id = result.current.savedSearches[0].id;
      const search = result.current.getSavedSearch(id);

      expect(search).toBeDefined();
      expect(search?.name).toBe('Test');
    });
  });

  describe('getSuggestions', () => {
    it('returns recent searches for empty query', () => {
      const { result } = renderHook(() => useSearchHistory());

      act(() => {
        result.current.addToHistory({ query: 'test1' });
        result.current.addToHistory({ query: 'test2' });
      });

      const suggestions = result.current.getSuggestions('');

      expect(suggestions.length).toBeGreaterThan(0);
    });

    it('filters suggestions by partial query', () => {
      const { result } = renderHook(() => useSearchHistory());

      act(() => {
        result.current.addToHistory({ query: 'cognitive bias' });
        result.current.addToHistory({ query: 'systems thinking' });
      });

      const suggestions = result.current.getSuggestions('cogn');

      expect(suggestions.length).toBeGreaterThan(0);
      expect(suggestions[0]).toBe('cognitive bias');
    });

    it('respects limit', () => {
      const { result } = renderHook(() => useSearchHistory());

      act(() => {
        for (let i = 0; i < 10; i++) {
          result.current.addToHistory({ query: `query${i}` });
        }
      });

      const suggestions = result.current.getSuggestions('query', 3);

      expect(suggestions.length).toBeLessThanOrEqual(3);
    });
  });

  describe('getStatistics', () => {
    it('calculates statistics', () => {
      const { result } = renderHook(() => useSearchHistory());

      act(() => {
        result.current.addToHistory({ query: 'test1', resultCount: 10 });
        result.current.addToHistory({ query: 'test2', resultCount: 5 });
        result.current.addToHistory({ query: 'test1', resultCount: 8 });
      });

      act(() => {
        result.current.updateHistoryEntry('test1', 'result-1', 'title');
      });

      const stats = result.current.getStatistics();

      expect(stats.totalSearches).toBeGreaterThan(0);
      expect(stats.uniqueQueries).toBeGreaterThan(0);
      expect(stats.searchesWithResults).toBeGreaterThan(0);
    });
  });

  describe('Persistence', () => {
    it('persists history to localStorage', () => {
      const { result } = renderHook(() => useSearchHistory());

      act(() => {
        result.current.addToHistory({ query: 'test' });
      });

      const stored = localStorage.getItem('hummbl_search_history');
      expect(stored).toBeTruthy();

      const parsed = JSON.parse(stored!);
      expect(parsed).toHaveLength(1);
    });

    it('loads history from localStorage', () => {
      const { result: result1 } = renderHook(() => useSearchHistory());

      act(() => {
        result1.current.addToHistory({ query: 'persisted' });
      });

      // Create new instance
      const { result: result2 } = renderHook(() => useSearchHistory());

      expect(result2.current.history).toHaveLength(1);
      expect(result2.current.history[0].query).toBe('persisted');
    });
  });
});
