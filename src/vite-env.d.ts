/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL?: string;
  readonly VITE_BUILD_OUTPUT_DIR?: string;
  readonly VITE_USE_STATIC_DATA?: string;
  readonly VITE_ENABLE_CACHING?: string;
  readonly VITE_CACHE_TTL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
