// Using DE12 (Interface Segregation) - Bookmark types for cross-platform use

export type BookmarkType = 'mental-model' | 'narrative';

export interface Bookmark {
  id: string;
  type: BookmarkType;
  itemId: string;
  title: string;
  description?: string;
  createdAt: string;
  tags?: string[];
}

export interface BookmarkState {
  bookmarks: Bookmark[];
  isLoading: boolean;
  error: string | null;
}

export interface BookmarkActions {
  addBookmark: (bookmark: Omit<Bookmark, 'id' | 'createdAt'>) => void;
  removeBookmark: (id: string) => void;
  hasBookmark: (itemId: string, type: BookmarkType) => boolean;
  getBookmarksByType: (type: BookmarkType) => Bookmark[];
  clearBookmarks: () => void;
}
