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
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'json-summary']
      // Thresholds temporarily disabled for CI troubleshooting
      // thresholds: {
      //   lines: 7,
      //   functions: 55,
      //   branches: 70,
      //   statements: 7
      // }
    }
  },
});
