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
    setupFiles: ['./vitest.setup.ts', './src/__mocks__/compliance-report.json'],
    // ESM support for Node 20
    pool: 'forks',
    reporters: process.env.CI
      ? [['junit', { outputFile: './test-results/junit.xml' }], 'verbose']
      : ['verbose'],
    poolOptions: {
      forks: {
        singleFork: true,
      },
    },
    css: true, // Enable CSS imports in tests
    testTimeout: 30000,
    hookTimeout: 30000,
    maxConcurrency: 1, // Reduced from 2 to 1 to limit parallel test execution
    logHeapUsage: true,
    typecheck: {
      tsconfig: './tsconfig.test.json',
    },
    clearMocks: true, // Clear mocks between tests to free memory
    mockReset: true, // Reset mocks between tests
    restoreMocks: true, // Restore original implementations between tests

    // Enable caching for faster CI runs
    cache: {
      dir: '.vitest-cache',
    },

    // Enable changed file detection
    changed: process.env.CI === 'true' ? false : undefined, // Disable in CI to run all tests

    // Optimized pool configuration for better memory management (forks mode is set above)
    // Note: poolOptions is only needed once when pool is set

    // Optimize coverage settings
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'json-summary'],
      all: false, // Only instrument files that are tested
      clean: true, // Clean coverage results before running
      cleanOnRerun: true, // Clean coverage results on watch mode
      exclude: [
        '**/node_modules/**',
        '**/dist/**',
        '**/coverage/**',
        '**/*.d.ts',
        '**/*.test.{js,jsx,ts,tsx}',
        '**/__tests__/**',
        '**/test-utils/**',
      ],
      // Thresholds disabled for now
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

    // Enable test isolation
    isolate: true,
  },
});
