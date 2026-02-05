// Using CO5 (Composition) - React hook interface for bookmark functionality

import { useCallback, useMemo } from 'react';
import { useBookmarkStore } from '../stores';
import type { Bookmark, BookmarkType } from '../types';

export interface UseBookmarksReturn {
  // State
  bookmarks: Bookmark[];
  modelBookmarks: Bookmark[];
  narrativeBookmarks: Bookmark[];
  isLoading: boolean;
  error: string | null;

  // Actions
  addBookmark: (data: {
    type: BookmarkType;
    itemId: string;
    title: string;
    description?: string;
    tags?: string[];
  }) => void;
  removeBookmark: (id: string) => void;
  toggleBookmark: (data: {
    type: BookmarkType;
    itemId: string;
    title: string;
    description?: string;
    tags?: string[];
  }) => void;
  isBookmarked: (itemId: string, type: BookmarkType) => boolean;
  clearAll: () => void;
}

export function useBookmarks(): UseBookmarksReturn {
  const store = useBookmarkStore();

  // Using SY8 (Systems) - Memoized selectors for performance
  const modelBookmarks = useMemo(
    () => store.bookmarks.filter((b) => b.type === 'mental-model'),
    [store.bookmarks]
  );

  const narrativeBookmarks = useMemo(
    () => store.bookmarks.filter((b) => b.type === 'narrative'),
    [store.bookmarks]
  );

  // Using RE2 (Feedback Loops) - Toggle pattern for bookmark actions
  const toggleBookmark = useCallback(
    (data: {
      type: BookmarkType;
      itemId: string;
      title: string;
      description?: string;
      tags?: string[];
    }) => {
      const existing = store.bookmarks.find(
        (b) => b.itemId === data.itemId && b.type === data.type
      );

      if (existing) {
        store.removeBookmark(existing.id);
      } else {
        store.addBookmark(data);
      }
    },
    [store]
  );

  const isBookmarked = useCallback(
    (itemId: string, type: BookmarkType) => {
      return store.hasBookmark(itemId, type);
    },
    [store]
  );

  return {
    bookmarks: store.bookmarks,
    modelBookmarks,
    narrativeBookmarks,
    isLoading: store.isLoading,
    error: store.error,
    addBookmark: store.addBookmark,
    removeBookmark: store.removeBookmark,
    toggleBookmark,
    isBookmarked,
    clearAll: store.clearBookmarks,
  };
}
