import { describe, it, expect } from 'vitest';
import { fuzzySearch, highlightMatches } from './fuzzySearch';

describe('fuzzySearch', () => {
  const items = [
    { id: '1', name: 'First Principles', code: 'P1' },
    { id: '2', name: 'Inversion', code: 'IN1' },
    { id: '3', name: 'Composition', code: 'CO1' },
  ];

  it('finds exact matches', () => {
    const results = fuzzySearch(items, 'Inversion', { keys: ['name'] });
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].item.name).toBe('Inversion');
  });

  it('finds partial matches', () => {
    const results = fuzzySearch(items, 'First', { keys: ['name'] });
    expect(results.length).toBeGreaterThan(0);
  });

  it('searches by code', () => {
    const results = fuzzySearch(items, 'P1', { keys: ['code'] });
    expect(results.length).toBeGreaterThan(0);
  });

  it('respects limit option', () => {
    const results = fuzzySearch(items, 'i', { keys: ['name'], limit: 1 });
    expect(results.length).toBeLessThanOrEqual(1);
  });
});

describe('highlightMatches', () => {
  it('highlights matching substring', () => {
    const parts = highlightMatches('hello world', 'world');
    expect(parts.some(p => p.highlight && p.text === 'world')).toBe(true);
  });

  it('returns unhighlighted text for no match', () => {
    const parts = highlightMatches('hello', 'xyz');
    expect(parts.every(p => !p.highlight)).toBe(true);
  });

  it('handles empty query', () => {
    const parts = highlightMatches('hello', '');
    expect(parts.length).toBe(1);
    expect(parts[0].text).toBe('hello');
  });
});
