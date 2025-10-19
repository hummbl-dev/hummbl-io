// Multi-user state management store

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { getAuthService, type User, type AuthTokens } from '../services/authService';
import { getSyncService } from '../services/syncService';

export interface UserState {
  // Authentication
  user: User | null;
  tokens: AuthTokens | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Sync status
  lastSync: number | null;
  syncInProgress: boolean;
  syncError: string | null;

  // Actions
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  loginWithOAuth: (provider: 'google' | 'github', code: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  updateProfile: (updates: Partial<Pick<User, 'name' | 'avatar'>>) => Promise<void>;
  
  // Sync actions
  syncToBackend: () => Promise<void>;
  pullFromBackend: () => Promise<void>;
  setLastSync: (timestamp: number) => void;
  
  // State management
  setUser: (user: User | null) => void;
  setTokens: (tokens: AuthTokens | null) => void;
  setError: (error: string | null) => void;
  setLoading: (loading: boolean) => void;
  clearError: () => void;
  reset: () => void;
}

const initialState = {
  user: null,
  tokens: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  lastSync: null,
  syncInProgress: false,
  syncError: null,
};

/**
 * User store with multi-user support
 */
export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      ...initialState,

      // ==================== AUTHENTICATION ====================

      login: async (email, password) => {
        set({ isLoading: true, error: null });
        
        try {
          const authService = getAuthService();
          const { user, tokens } = await authService.login({ email, password });
          
          set({
            user,
            tokens,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });

          // Auto-sync after login
          get().syncToBackend().catch((error) => {
            console.warn('Post-login sync failed:', error);
          });
        } catch (error) {
          set({
            isLoading: false,
            error: error instanceof Error ? error.message : 'Login failed',
          });
          throw error;
        }
      },

      register: async (email, password, name) => {
        set({ isLoading: true, error: null });
        
        try {
          const authService = getAuthService();
          const { user, tokens } = await authService.register({ email, password, name });
          
          set({
            user,
            tokens,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } catch (error) {
          set({
            isLoading: false,
            error: error instanceof Error ? error.message : 'Registration failed',
          });
          throw error;
        }
      },

      loginWithOAuth: async (provider, code) => {
        set({ isLoading: true, error: null });
        
        try {
          const authService = getAuthService();
          const { user, tokens } = await authService.loginWithOAuth(provider, code);
          
          set({
            user,
            tokens,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });

          // Auto-sync after OAuth login
          get().syncToBackend().catch((error) => {
            console.warn('Post-OAuth sync failed:', error);
          });
        } catch (error) {
          set({
            isLoading: false,
            error: error instanceof Error ? error.message : 'OAuth login failed',
          });
          throw error;
        }
      },

      logout: async () => {
        set({ isLoading: true });
        
        try {
          const authService = getAuthService();
          await authService.logout();
          
          set({ ...initialState });
        } catch (error) {
          console.warn('Logout error:', error);
          // Clear state anyway
          set({ ...initialState });
        }
      },

      refreshUser: async () => {
        const { isAuthenticated } = get();
        if (!isAuthenticated) return;

        set({ isLoading: true });
        
        try {
          const authService = getAuthService();
          const user = await authService.getCurrentUser();
          
          set({ user, isLoading: false });
        } catch (error) {
          set({ 
            isLoading: false,
            error: error instanceof Error ? error.message : 'Failed to refresh user',
          });
        }
      },

      updateProfile: async (updates) => {
        const { isAuthenticated } = get();
        if (!isAuthenticated) {
          throw new Error('Not authenticated');
        }

        set({ isLoading: true });
        
        try {
          const authService = getAuthService();
          const user = await authService.updateProfile(updates);
          
          set({ user, isLoading: false });
        } catch (error) {
          set({ 
            isLoading: false,
            error: error instanceof Error ? error.message : 'Failed to update profile',
          });
          throw error;
        }
      },

      // ==================== SYNC ====================

      syncToBackend: async () => {
        const { isAuthenticated } = get();
        if (!isAuthenticated) {
          console.warn('Cannot sync: not authenticated');
          return;
        }

        set({ syncInProgress: true, syncError: null });
        
        try {
          const syncService = getSyncService();
          
          // Gather local data
          const notes = JSON.parse(localStorage.getItem('hummbl_notes') || '[]');
          const bookmarks = JSON.parse(localStorage.getItem('hummbl_bookmarks') || '[]');
          const history = JSON.parse(localStorage.getItem('hummbl_reading_history') || '[]');

          const result = await syncService.syncAll({
            notes,
            bookmarks,
            history,
          });

          if (result.success) {
            set({
              lastSync: Date.now(),
              syncInProgress: false,
              syncError: null,
            });
          } else {
            throw new Error(result.error || 'Sync failed');
          }
        } catch (error) {
          set({
            syncInProgress: false,
            syncError: error instanceof Error ? error.message : 'Sync failed',
          });
          throw error;
        }
      },

      pullFromBackend: async () => {
        const { isAuthenticated, lastSync } = get();
        if (!isAuthenticated) {
          console.warn('Cannot pull: not authenticated');
          return;
        }

        set({ syncInProgress: true, syncError: null });
        
        try {
          const syncService = getSyncService();
          
          const result = await syncService.pullAll(lastSync || undefined);

          if (result.success && result.data) {
            // Merge with local data
            localStorage.setItem('hummbl_notes', JSON.stringify(result.data.notes));
            localStorage.setItem('hummbl_bookmarks', JSON.stringify(result.data.bookmarks));
            localStorage.setItem('hummbl_reading_history', JSON.stringify(result.data.history));

            set({
              lastSync: Date.now(),
              syncInProgress: false,
              syncError: null,
            });
          } else {
            throw new Error(result.error || 'Pull failed');
          }
        } catch (error) {
          set({
            syncInProgress: false,
            syncError: error instanceof Error ? error.message : 'Pull failed',
          });
          throw error;
        }
      },

      setLastSync: (timestamp) => {
        set({ lastSync: timestamp });
      },

      // ==================== STATE MANAGEMENT ====================

      setUser: (user) => {
        set({ user, isAuthenticated: user !== null });
      },

      setTokens: (tokens) => {
        set({ tokens });
      },

      setError: (error) => {
        set({ error });
      },

      setLoading: (loading) => {
        set({ isLoading: loading });
      },

      clearError: () => {
        set({ error: null, syncError: null });
      },

      reset: () => {
        set({ ...initialState });
      },
    }),
    {
      name: 'hummbl-user-store',
      partialize: (state) => ({
        user: state.user,
        tokens: state.tokens,
        isAuthenticated: state.isAuthenticated,
        lastSync: state.lastSync,
      }),
    }
  )
);

/**
 * Initialize user store on app load
 */
export function initializeUserStore() {
  const authService = getAuthService();
  const storedUser = authService.getStoredUser();
  const isAuth = authService.isAuthenticated();

  if (storedUser && isAuth) {
    useUserStore.getState().setUser(storedUser);
    
    // Refresh user data in background
    useUserStore.getState().refreshUser().catch((error) => {
      console.warn('Failed to refresh user on init:', error);
    });
  }
}
