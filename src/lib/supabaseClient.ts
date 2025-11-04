// Supabase client configuration with lazy initialization

import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Check if Supabase is configured
export const isAuthEnabled = !!(supabaseUrl && supabaseAnonKey);

// Lazy-initialized client (initialized on first access, not at module load)
let supabaseInstance: SupabaseClient | null = null;

// Initialize client only when first accessed
function initializeClient(): SupabaseClient {
  if (!supabaseInstance) {
    if (!isAuthEnabled) {
      console.warn(
        '⚠️ Supabase not configured. Auth features disabled. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to enable.'
      );
      // Create client with dummy values if not configured (prevents crashes)
      supabaseInstance = createClient(
        'https://placeholder.supabase.co',
        'placeholder-key',
        {
          auth: {
            autoRefreshToken: false,
            persistSession: false,
            detectSessionInUrl: false,
          },
        }
      );
    } else {
      // Create properly configured client
      supabaseInstance = createClient(supabaseUrl!, supabaseAnonKey!, {
        auth: {
          autoRefreshToken: true,
          persistSession: true,
          detectSessionInUrl: true,
        },
      });
    }
  }
  return supabaseInstance;
}

// Create a proxy that initializes the client on first property access
// This ensures the client is only created when actually used, not at module import time
export const supabase = new Proxy({} as SupabaseClient, {
  get(_target, prop, receiver) {
    const client = initializeClient();
    const value = Reflect.get(client, prop, receiver);
    // If it's a function, ensure it's bound to the client instance
    if (typeof value === 'function') {
      return value.bind(client);
    }
    // Return nested objects directly (e.g., supabase.auth will return the auth object)
    return value;
  },
  has(_target, prop) {
    const client = initializeClient();
    return Reflect.has(client, prop);
  },
  ownKeys(_target) {
    const client = initializeClient();
    return Reflect.ownKeys(client);
  },
  getOwnPropertyDescriptor(_target, prop) {
    const client = initializeClient();
    return Reflect.getOwnPropertyDescriptor(client, prop);
  },
});
