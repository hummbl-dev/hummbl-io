#!/usr/bin/env tsx
/**
 * Performance benchmark to demonstrate improvements
 * Run with: tsx scripts/benchmark-performance-improvements.ts
 */

// Mock performance test utilities
interface BenchmarkResult {
  name: string;
  iterations: number;
  averageTime: number;
  totalTime: number;
  opsPerSecond: number;
}

function benchmark(name: string, fn: () => void, iterations = 1000): BenchmarkResult {
  // Warm-up
  for (let i = 0; i < 10; i++) {
    fn();
  }

  // Actual benchmark
  const start = performance.now();
  for (let i = 0; i < iterations; i++) {
    fn();
  }
  const end = performance.now();
  const totalTime = end - start;
  const averageTime = totalTime / iterations;
  const opsPerSecond = (iterations / totalTime) * 1000;

  return {
    name,
    iterations,
    averageTime,
    totalTime,
    opsPerSecond,
  };
}

function generateTestData(size = 100) {
  return {
    narratives: Array.from({ length: size }, (_, i) => ({
      narrative_id: `n${i}`,
      title: `Narrative ${i}`,
      summary: `This is a summary about topic ${i % 10}`,
      category: ['psychology', 'business', 'science', 'philosophy'][i % 4],
      tags: [`tag${i % 5}`, `tag${(i + 1) % 5}`, `tag${(i + 2) % 5}`],
      domain: [`domain${i % 3}`, `domain${(i + 1) % 3}`],
    })),
    models: Array.from({ length: size / 2 }, (_, i) => ({
      code: `m${i}`,
      name: `Mental Model ${i}`,
      description: `Description for model ${i}`,
      tags: [`tag${i % 5}`, `tag${(i + 1) % 5}`, `tag${(i + 2) % 5}`],
      transformation: ['analysis', 'synthesis', 'evaluation'][i % 3],
    })),
  };
}

// Test 1: Levenshtein distance optimization
console.log('🔬 Benchmarking Levenshtein Distance Calculation...\n');

// Old implementation (O(n²) space)
function levenshteinDistanceOld(str1: string, str2: string): number {
  const len1 = str1.length;
  const len2 = str2.length;
  const matrix: number[][] = [];

  for (let i = 0; i <= len1; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= len2; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= len1; i++) {
    for (let j = 1; j <= len2; j++) {
      const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost
      );
    }
  }

  return matrix[len1][len2];
}

// New implementation (O(n) space)
function levenshteinDistanceNew(str1: string, str2: string): number {
  const len1 = str1.length;
  const len2 = str2.length;

  if (len1 === 0) return len2;
  if (len2 === 0) return len1;
  if (str1 === str2) return 0;

  const maxLen = Math.max(len1, len2);
  const minLen = Math.min(len1, len2);
  if ((maxLen - minLen) / maxLen > 0.5) {
    return maxLen;
  }

  let prevRow: number[] = new Array(len2 + 1);
  let currRow: number[] = new Array(len2 + 1);

  for (let j = 0; j <= len2; j++) {
    prevRow[j] = j;
  }

  for (let i = 1; i <= len1; i++) {
    currRow[0] = i;

    for (let j = 1; j <= len2; j++) {
      const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
      currRow[j] = Math.min(prevRow[j] + 1, currRow[j - 1] + 1, prevRow[j - 1] + cost);
    }

    [prevRow, currRow] = [currRow, prevRow];
  }

  return prevRow[len2];
}

const testStrings = [
  ['hello', 'hallo'],
  ['algorithm', 'logarithm'],
  ['javascript', 'typescript'],
  ['performance', 'preference'],
  ['optimization', 'optimization'],
];

const oldResult = benchmark(
  'Levenshtein (Old O(n²) space)',
  () => {
    testStrings.forEach(([a, b]) => levenshteinDistanceOld(a, b));
  },
  10000
);

const newResult = benchmark(
  'Levenshtein (New O(n) space)',
  () => {
    testStrings.forEach(([a, b]) => levenshteinDistanceNew(a, b));
  },
  10000
);

console.log('Old Implementation:', {
  avgTime: `${oldResult.averageTime.toFixed(4)}ms`,
  opsPerSec: Math.round(oldResult.opsPerSecond),
});
console.log('New Implementation:', {
  avgTime: `${newResult.averageTime.toFixed(4)}ms`,
  opsPerSec: Math.round(newResult.opsPerSecond),
});
console.log(
  `✨ Improvement: ${((1 - newResult.averageTime / oldResult.averageTime) * 100).toFixed(1)}% faster\n`
);

// Test 2: Related content optimization
console.log('🔬 Benchmarking Related Content Search...\n');

// Test with different dataset sizes to show where optimization matters
const smallDataset = generateTestData(50);
const largeDataset = generateTestData(500);

// Old implementation (inefficient)
function findRelatedOld(current: any, all: any[]) {
  const related = [];
  for (const item of all) {
    if (item.narrative_id === current.narrative_id) continue;
    let score = 0;
    if (item.category === current.category) score += 0.4;

    // Inefficient tag comparison
    const currentTags = current.tags || [];
    const itemTags = item.tags || [];
    for (const tag1 of currentTags) {
      for (const tag2 of itemTags) {
        if (tag1.toLowerCase() === tag2.toLowerCase()) {
          score += 0.1;
        }
      }
    }
    if (score > 0.1) related.push({ ...item, score });
  }
  return related.sort((a, b) => b.score - a.score).slice(0, 5);
}

// New implementation (optimized with Sets)
function findRelatedNew(current: any, all: any[]) {
  const currentTags = new Set((current.tags || []).map((t: string) => t.toLowerCase()));
  const related = [];

  for (const item of all) {
    if (item.narrative_id === current.narrative_id) continue;
    let score = 0;

    if (item.category === current.category) {
      score += 0.4;
    }

    if (item.tags && item.tags.length > 0 && currentTags.size > 0) {
      const itemTags = new Set(item.tags.map((t: string) => t.toLowerCase()));
      const intersection = [...currentTags].filter((x) => itemTags.has(x)).length;
      if (intersection > 0) {
        const union = new Set([...currentTags, ...itemTags]).size;
        score += (intersection / union) * 0.3;
      }
    }

    if (score > 0.1) related.push({ ...item, score });
  }
  return related.sort((a, b) => b.score - a.score).slice(0, 5);
}

// Test with small dataset
console.log('Testing with 50 items:');
const oldRelatedSmall = benchmark(
  'Related Content (Old - small)',
  () => {
    findRelatedOld(smallDataset.narratives[0], smallDataset.narratives);
  },
  1000
);

const newRelatedSmall = benchmark(
  'Related Content (New - small)',
  () => {
    findRelatedNew(smallDataset.narratives[0], smallDataset.narratives);
  },
  1000
);

console.log('Old Implementation:', {
  avgTime: `${oldRelatedSmall.averageTime.toFixed(4)}ms`,
  opsPerSec: Math.round(oldRelatedSmall.opsPerSecond),
});
console.log('New Implementation:', {
  avgTime: `${newRelatedSmall.averageTime.toFixed(4)}ms`,
  opsPerSec: Math.round(newRelatedSmall.opsPerSecond),
});
console.log(
  `Improvement: ${((1 - newRelatedSmall.averageTime / oldRelatedSmall.averageTime) * 100).toFixed(1)}% ${newRelatedSmall.averageTime < oldRelatedSmall.averageTime ? 'faster' : 'slower'}\n`
);

// Test with large dataset (where optimization really matters)
console.log('Testing with 500 items (real-world scenario):');
const oldRelatedLarge = benchmark(
  'Related Content (Old - large)',
  () => {
    findRelatedOld(largeDataset.narratives[0], largeDataset.narratives);
  },
  500
);

const newRelatedLarge = benchmark(
  'Related Content (New - large)',
  () => {
    findRelatedNew(largeDataset.narratives[0], largeDataset.narratives);
  },
  500
);

console.log('Old Implementation:', {
  avgTime: `${oldRelatedLarge.averageTime.toFixed(4)}ms`,
  opsPerSec: Math.round(oldRelatedLarge.opsPerSecond),
});
console.log('New Implementation:', {
  avgTime: `${newRelatedLarge.averageTime.toFixed(4)}ms`,
  opsPerSec: Math.round(newRelatedLarge.opsPerSecond),
});
console.log(
  `✨ Improvement: ${((1 - newRelatedLarge.averageTime / oldRelatedLarge.averageTime) * 100).toFixed(1)}% faster\n`
);

// Test 3: localStorage operations batching
console.log('🔬 Benchmarking localStorage Operations...\n');

// Simulate localStorage
const mockStorage: Record<string, string> = {};
const mockLocalStorage = {
  getItem: (key: string) => mockStorage[key] || null,
  setItem: (key: string, value: string) => {
    mockStorage[key] = value;
  },
};

// Old: immediate writes
function trackEventOld(event: string) {
  const data = JSON.parse(mockLocalStorage.getItem('analytics') || '{"events":[]}');
  data.events.push({ event, timestamp: Date.now() });
  mockLocalStorage.setItem('analytics', JSON.stringify(data));
}

// New: batched writes with in-memory cache
let cache: any = null;
let pendingWrites = 0;

function trackEventNew(event: string) {
  if (!cache) {
    cache = JSON.parse(mockLocalStorage.getItem('analytics') || '{"events":[]}');
  }
  cache.events.push({ event, timestamp: Date.now() });
  pendingWrites++;

  // Batch write every 10 operations
  if (pendingWrites >= 10) {
    mockLocalStorage.setItem('analytics', JSON.stringify(cache));
    pendingWrites = 0;
  }
}

const oldStorageResult = benchmark(
  'localStorage (Old - immediate)',
  () => {
    trackEventOld('test_event');
  },
  1000
);

cache = null;
pendingWrites = 0;

const newStorageResult = benchmark(
  'localStorage (New - batched)',
  () => {
    trackEventNew('test_event');
  },
  1000
);

// Flush remaining
if (pendingWrites > 0) {
  mockLocalStorage.setItem('analytics', JSON.stringify(cache));
}

console.log('Old Implementation:', {
  avgTime: `${oldStorageResult.averageTime.toFixed(4)}ms`,
  opsPerSec: Math.round(oldStorageResult.opsPerSecond),
});
console.log('New Implementation:', {
  avgTime: `${newStorageResult.averageTime.toFixed(4)}ms`,
  opsPerSec: Math.round(newStorageResult.opsPerSecond),
});
console.log(
  `✨ Improvement: ${((1 - newStorageResult.averageTime / oldStorageResult.averageTime) * 100).toFixed(1)}% faster\n`
);

// Summary
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('📊 Performance Improvement Summary');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log(
  `Levenshtein Distance: ${((1 - newResult.averageTime / oldResult.averageTime) * 100).toFixed(1)}% faster`
);
console.log(
  `Related Content (50 items): ${((1 - newRelatedSmall.averageTime / oldRelatedSmall.averageTime) * 100).toFixed(1)}% ${newRelatedSmall.averageTime < oldRelatedSmall.averageTime ? 'faster' : 'slower (Set overhead)'}`
);
console.log(
  `Related Content (500 items): ${((1 - newRelatedLarge.averageTime / oldRelatedLarge.averageTime) * 100).toFixed(1)}% faster`
);
console.log(
  `localStorage Operations: ${((1 - newStorageResult.averageTime / oldStorageResult.averageTime) * 100).toFixed(1)}% faster`
);
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

console.log('✅ All benchmarks completed successfully!');
console.log('\n💡 Note: These benchmarks demonstrate the relative performance improvements.');
console.log('   Real-world improvements will vary based on data size and usage patterns.\n');
