// Using CO5 (Composition) - Zustand store for bookmarks with persistence

import { create } from 'zustand';
import { persist, createJSONStorage, StateStorage } from 'zustand/middleware';
import type { Bookmark, BookmarkType, BookmarkState, BookmarkActions } from '../types';

// Generate unique ID
const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

type BookmarkStore = BookmarkState & BookmarkActions;

// Using DE3 (Decomposition) - Separate store creation for different storage backends
export const createBookmarkStore = (storage: StateStorage) =>
  create<BookmarkStore>()(
    persist(
      (set, get) => ({
        // State
        bookmarks: [],
        isLoading: false,
        error: null,

        // Actions
        addBookmark: (bookmarkData) => {
          const newBookmark: Bookmark = {
            ...bookmarkData,
            id: generateId(),
            createdAt: new Date().toISOString(),
          };
          set((state) => ({
            bookmarks: [...state.bookmarks, newBookmark],
          }));
        },

        removeBookmark: (id) => {
          set((state) => ({
            bookmarks: state.bookmarks.filter((b) => b.id !== id),
          }));
        },

        hasBookmark: (itemId, type) => {
          return get().bookmarks.some(
            (b) => b.itemId === itemId && b.type === type
          );
        },

        getBookmarksByType: (type) => {
          return get().bookmarks.filter((b) => b.type === type);
        },

        clearBookmarks: () => {
          set({ bookmarks: [] });
        },
      }),
      {
        name: 'hummbl-bookmarks',
        storage: createJSONStorage(() => storage),
      }
    )
  );

// Default store using localStorage (web) - mobile will override
let defaultStorage: StateStorage;

// Using SY8 (Systems) - Platform detection for storage
if (typeof window !== 'undefined' && window.localStorage) {
  defaultStorage = {
    getItem: (name) => window.localStorage.getItem(name),
    setItem: (name, value) => window.localStorage.setItem(name, value),
    removeItem: (name) => window.localStorage.removeItem(name),
  };
} else {
  // Fallback for SSR/non-browser
  const memoryStorage = new Map<string, string>();
  defaultStorage = {
    getItem: (name) => memoryStorage.get(name) ?? null,
    setItem: (name, value) => { memoryStorage.set(name, value); },
    removeItem: (name) => { memoryStorage.delete(name); },
  };
}

export const useBookmarkStore = createBookmarkStore(defaultStorage);
