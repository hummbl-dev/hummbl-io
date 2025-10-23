// Tests for useSearchHistory hook

import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
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
      const { result } = renderHook(() => useSearchHistory());

      // Add first entry
      await act(async () => {
        result.current.addToHistory({ query: 'test1' });
      });

      // Verify first entry was added
      expect(result.current.history).toHaveLength(1);
      const firstEntry = result.current.history[0];

      // Add second entry with a different query
      await act(async () => {
        result.current.addToHistory({ query: 'test2' });
      });

      // Verify we have exactly 2 entries
      expect(result.current.history).toHaveLength(2);
      
      // Get the second entry
      const secondEntry = result.current.history.find(
        entry => entry.query === 'test2'
      );
      
      // Make sure we found the second entry
      expect(secondEntry).toBeDefined();
      expect(secondEntry?.query).toBe('test2');
      
      // Remove the second entry
      await act(async () => {
        if (secondEntry) {
          result.current.removeFromHistory(secondEntry.timestamp);
        }
      });

      // Verify only the first entry remains
      expect(result.current.history).toHaveLength(1);
      expect(result.current.history[0].query).toBe('test1');
      expect(result.current.history[0].timestamp).toBe(firstEntry.timestamp);
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

    it('deletes a saved search', async () => {
      const { result } = renderHook(() => useSearchHistory());

      // Add first search
      await act(async () => {
        await result.current.saveSearch('Search 1', 'query1');
      });

      // Wait for the first search to be added
      await waitFor(() => {
        expect(result.current.savedSearches).toHaveLength(1);
      });

      // Get the ID of the first search
      const search1Id = result.current.savedSearches[0]?.id;
      expect(search1Id).toBeDefined();

      // Add second search
      await act(async () => {
        await result.current.saveSearch('Search 2', 'query2');
      });

      // Verify both searches were added
      await waitFor(() => {
        expect(result.current.savedSearches).toHaveLength(2);
      });
      
      // Delete the first search
      await act(async () => {
        await result.current.deleteSavedSearch(search1Id);
      });

      // Wait for state updates and verify
      await waitFor(() => {
        // Verify the search was deleted by checking the saved searches array
        expect(result.current.savedSearches).toHaveLength(1);
        
        // Verify the remaining search is the second one
        expect(result.current.savedSearches[0].name).toBe('Search 2');
        
        // Verify the deleted search is gone
        const deletedSearch = result.current.savedSearches.find(s => s.id === search1Id);
        expect(deletedSearch).toBeUndefined();
      });
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
