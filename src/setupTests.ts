// Setup file for Vitest
import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';

// Clean up after each test case (e.g., clearing jsdom)
afterEach(() => {
  cleanup();
});
