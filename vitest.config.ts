import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    globals: true,
    environment: 'happy-dom',
    setupFiles: './vitest.setup.ts',
    testTimeout: 30000,
    hookTimeout: 30000,
    maxConcurrency: 2,
    logHeapUsage: true,
    poolOptions: {
      threads: {
        minThreads: 1,
        maxThreads: 2,
        useAtomics: true,
        isolate: true,
        singleThread: false,
        execArgv: ['--max-old-space-size=8192'],
      },
    },
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'json-summary'],
      // Enable per-test coverage to identify memory hogs
      all: false,
      // Thresholds temporarily disabled for CI troubleshooting
      // thresholds: {
      //   lines: 7,
      //   functions: 55,
      //   branches: 70,
      //   statements: 7
      // }
    },
    // Run tests in sequence to reduce memory pressure
    sequence: {
      shuffle: false,
      concurrent: false,
    },
  },
});
