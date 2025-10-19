// Temporary stub for userStore until zustand dependency is properly added
// This prevents TypeScript compilation errors

import { type User, type AuthTokens } from '../services/authService';

export interface UserState {
  // Authentication
  user: User | null;
  tokens: AuthTokens | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Multi-user support
  users: User[];
  currentUserId: string | null;
  
  // Sync state
  lastSync: Date | null;
  syncInProgress: boolean;
  syncError: string | null;

  // Actions (placeholder)
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  switchUser: (userId: string) => void;
}

// Placeholder implementation - replace with actual zustand store
export const useUserStore = (): UserState => {
  return {
    user: null,
    tokens: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
    users: [],
    currentUserId: null,
    lastSync: null,
    syncInProgress: false,
    syncError: null,
    login: async () => { throw new Error('UserStore not implemented - install zustand'); },
    register: async () => { throw new Error('UserStore not implemented - install zustand'); },
    logout: () => { throw new Error('UserStore not implemented - install zustand'); },
    switchUser: () => { throw new Error('UserStore not implemented - install zustand'); }
  };
};
