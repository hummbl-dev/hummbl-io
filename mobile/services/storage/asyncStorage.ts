// Using DE3 (Decomposition) - AsyncStorage adapter for Zustand persist

import AsyncStorage from '@react-native-async-storage/async-storage';
import type { StateStorage } from 'zustand/middleware';

/**
 * AsyncStorage adapter compatible with Zustand's persist middleware
 */
export const asyncStorageAdapter: StateStorage = {
  getItem: async (name: string): Promise<string | null> => {
    try {
      return await AsyncStorage.getItem(name);
    } catch (error) {
      console.warn(`Failed to get item ${name} from AsyncStorage:`, error);
      return null;
    }
  },

  setItem: async (name: string, value: string): Promise<void> => {
    try {
      await AsyncStorage.setItem(name, value);
    } catch (error) {
      console.warn(`Failed to set item ${name} in AsyncStorage:`, error);
    }
  },

  removeItem: async (name: string): Promise<void> => {
    try {
      await AsyncStorage.removeItem(name);
    } catch (error) {
      console.warn(`Failed to remove item ${name} from AsyncStorage:`, error);
    }
  },
};

export default asyncStorageAdapter;
