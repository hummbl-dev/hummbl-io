import { MentalModel } from '../models/mentalModels';
import { validateMentalModel } from '../utils/validation';

// Types
type CacheEntry<T> = {
  data: T;
  timestamp: number;
};

type MentalModelsResponse = {
  version: string;
  lastUpdated: string;
  models: MentalModel[];
};

// Constants
const CACHE_KEY = 'hummbl:mental-models:cache';
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
const DATA_URL = '/data/mental-models.json';

/**
 * Fetches mental models from the server
 */
export async function fetchMentalModels(): Promise<MentalModel[]> {
  try {
    // Try to get from cache first
    const cached = getFromCache<MentalModelsResponse>();
    if (cached) {
      return cached.models;
    }

    // Fetch from network
    const response = await fetch(DATA_URL);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch mental models: ${response.statusText}`);
    }

    const data: MentalModelsResponse = await response.json();
    
    // Validate the response
    if (!isValidMentalModelsResponse(data)) {
      throw new Error('Invalid mental models data format');
    }

    // Cache the response
    saveToCache(data);
    
    return data.models;
  } catch (error) {
    console.error('Error fetching mental models:', error);
    throw error;
  }
}

/**
 * React hook for using mental models
 */
export function useMentalModels() {
  const [models, setModels] = React.useState<MentalModel[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<Error | null>(null);

  React.useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      try {
        const data = await fetchMentalModels();
        if (isMounted) {
          setModels(data);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err : new Error('Failed to load mental models'));
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, []);

  return { models, isLoading, error };
}

// Cache helpers
function getFromCache<T>(): T | null {
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (!cached) return null;

    const { data, timestamp }: CacheEntry<T> = JSON.parse(cached);
    
    // Check if cache is still valid
    if (Date.now() - timestamp > CACHE_TTL) {
      localStorage.removeItem(CACHE_KEY);
      return null;
    }

    return data;
  } catch (error) {
    console.warn('Failed to read from cache:', error);
    return null;
  }
}

function saveToCache<T>(data: T): void {
  try {
    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now()
    };
    localStorage.setItem(CACHE_KEY, JSON.stringify(entry));
  } catch (error) {
    console.warn('Failed to save to cache:', error);
  }
}

// Validation
function isValidMentalModelsResponse(data: unknown): data is MentalModelsResponse {
  if (!data || typeof data !== 'object') return false;
  
  const response = data as Partial<MentalModelsResponse>;
  
  if (!response.version || !response.lastUpdated || !Array.isArray(response.models)) {
    return false;
  }

  // Validate each model in the response
  return response.models.every(validateMentalModel);
}

// Export types for testing
export type { MentalModelsResponse, CacheEntry };
