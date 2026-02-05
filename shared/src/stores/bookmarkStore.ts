// Using CO5 (Composition) - Zustand store for bookmarks with persistence

import { create, StoreApi, UseBoundStore } from 'zustand';
import { persist, createJSONStorage, StateStorage } from 'zustand/middleware';
import type { Bookmark, BookmarkType, BookmarkState, BookmarkActions } from '../types';

// Generate unique ID
const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

type BookmarkStore = BookmarkState & BookmarkActions;

// Using DE3 (Decomposition) - Separate store creation for different storage backends
export const createBookmarkStore = (storage: StateStorage): UseBoundStore<StoreApi<BookmarkStore>> =>
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

// Using SY8 (Systems) - Platform-adaptive default storage
const createDefaultStorage = (): StateStorage => {
  if (typeof window !== 'undefined' && window.localStorage) {
    return {
      getItem: (name) => window.localStorage.getItem(name),
      setItem: (name, value) => window.localStorage.setItem(name, value),
      removeItem: (name) => window.localStorage.removeItem(name),
    };
  }
  // Fallback for SSR/non-browser (memory storage)
  const memoryStorage = new Map<string, string>();
  return {
    getItem: (name) => memoryStorage.get(name) ?? null,
    setItem: (name, value) => { memoryStorage.set(name, value); },
    removeItem: (name) => { memoryStorage.delete(name); },
  };
};

// Store singleton - can be re-initialized for mobile
let bookmarkStoreInstance: UseBoundStore<StoreApi<BookmarkStore>> | null = null;

/**
 * Initialize the bookmark store with a specific storage adapter.
 * Must be called before using useBookmarkStore on mobile.
 */
export const initializeBookmarkStore = (storage: StateStorage): void => {
  bookmarkStoreInstance = createBookmarkStore(storage);
};

/**
 * Get the bookmark store, initializing with default storage if needed.
 */
export const useBookmarkStore = (): BookmarkStore => {
  if (!bookmarkStoreInstance) {
    bookmarkStoreInstance = createBookmarkStore(createDefaultStorage());
  }
  return bookmarkStoreInstance();
};

/**
 * Get the raw store hook for direct Zustand usage.
 * Useful when you need the selector pattern: useBookmarkStoreHook(state => state.bookmarks)
 */
export const getBookmarkStoreHook = (): UseBoundStore<StoreApi<BookmarkStore>> => {
  if (!bookmarkStoreInstance) {
    bookmarkStoreInstance = createBookmarkStore(createDefaultStorage());
  }
  return bookmarkStoreInstance;
};
