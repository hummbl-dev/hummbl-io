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
    testTimeout: 30000,
    hookTimeout: 30000,
    maxConcurrency: 1, // Reduced from 2 to 1 to limit parallel test execution
    logHeapUsage: true,
    clearMocks: true, // Clear mocks between tests to free memory
    mockReset: true, // Reset mocks between tests
    restoreMocks: true, // Restore original implementations between tests

    // Optimized pool configuration for better memory management
    poolOptions: {
      threads: {
        minThreads: 1,
        maxThreads: 1, // Reduced to 1 thread to minimize memory usage
        useAtomics: false, // Can cause memory leaks in some cases
        isolate: true,
        singleThread: true, // Run tests in a single thread
        execArgv: [
          '--max-old-space-size=4096', // Reduced memory per worker
          '--gc-interval=100', // More frequent garbage collection
          '--expose-gc', // Enable manual garbage collection
        ],
      },
      forks: {
        // Fork mode can be more memory efficient for some test suites
        singleFork: true,
        isolate: true,
      },
    },

    // Optimize coverage settings
    coverage: {
      provider: 'v8',
      reporter: ['text-summary', 'html'], // Faster CI with essential reports
      all: true, // Check all files, not just tested ones
      clean: true, // Clean coverage results before running
      include: ['src/**/*.{ts,tsx}'],
      exclude: [
        // Test files and utilities
        '**/__tests__/**',
        '**/*.test.*',
        '**/test-utils/**',
        '**/setupTests.*',
        
        // Generated code and types
        '**/generated/**',
        '**/types/**',
        '**/*.d.ts',
        
        // Configuration and tooling
        '**/vite.config.*',
        '**/vitest.config.*',
        '**/jest.config.*',
        
        // Storybook and documentation
        '**/*.stories.*',
        '**/.storybook/**',
        
        // Build outputs and dependencies
        '**/node_modules/**',
        '**/dist/**',
        '**/coverage/**',
      ],
      // Enforce minimum coverage thresholds
      thresholds: {
        lines: 85,
        functions: 85,
        branches: 80,
        statements: 85,
      },
      // Show uncovered files in the report
      reportOnFailure: true,
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
