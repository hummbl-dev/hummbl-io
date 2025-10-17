import { afterEach, expect } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';

// Extend Vitest's expect with jest-dom matchers
Object.entries(matchers).forEach(([key, matcher]) => {
  // @ts-ignore
  expect.extend({ [key]: matcher });
});

// Run cleanup after each test case
afterEach(() => {
  cleanup();
});
