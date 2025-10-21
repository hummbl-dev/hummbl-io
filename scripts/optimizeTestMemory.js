#!/usr/bin/env node

/**
 * This script helps identify and fix common memory leak patterns in test files.
 * It analyzes test files and suggests optimizations to reduce memory usage.
 */

import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs/promises';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configuration
const CONFIG = {
  testDir: path.join(process.cwd(), 'src'),
  reportsDir: path.join(process.cwd(), 'reports'),
  maxFileSizeKB: 100, // Warn about large test files
  maxTestLength: 200, // Lines
  maxDescribeNesting: 3, // Maximum describe nesting level
  maxBeforeEach: 3, // Maximum number of beforeEach/afterEach hooks
};

// Patterns to detect potential memory leaks
const MEMORY_LEAK_PATTERNS = [
  // Global variables
  { 
    pattern: /^(\s*)(let|const|var)\s+([a-zA-Z_$][\w$]*)\s*=/gm,
    message: 'Avoid global variables in test files. Use describe/test scopes or before/after hooks.'
  },
  // Unhandled promises
  {
    pattern: /(\w+)\.(then|catch|finally)\([^)]*\)(?!\s*\.(catch|finally)\()/g,
    message: 'Unhandled promise chain. Consider using async/await or properly chaining .catch()'
  },
  // Large test data
  {
    pattern: /const\s+\w+\s*=\s*\[\s*(?:\{[^}]*\}(?:\s*,\s*\{[^}]*\}){20,})\s*\]/s,
    message: 'Large inline test data detected. Consider moving to a separate fixture file.'
  },
  // Unmocked timers
  {
    pattern: /setTimeout|setInterval|setImmediate|requestAnimationFrame/g,
    message: 'Unmocked timer detected. Use vi.useFakeTimers() and vi.runAllTimers() in tests.'
  },
  // Unmocked network requests
  {
    pattern: /fetch\(|axios\.|XMLHttpRequest|new\s+Worker\(/g,
    message: 'Unmocked network request detected. Use MSW or similar to mock HTTP requests.'
  },
  // Memory-intensive operations
  {
    pattern: /JSON\.parse\(|JSON\.stringify\(|Array\(\d+\)\.fill\(/g,
    message: 'Potentially memory-intensive operation. Consider using more efficient data structures.'
  }
];

// Helper to find all test files
async function findTestFiles(dir = CONFIG.testDir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  let testFiles = [];
  
  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    
    if (entry.isDirectory()) {
      // Skip node_modules and other non-source directories
      if (['node_modules', 'dist', 'build', '.next', '.cache'].includes(entry.name)) {
        continue;
      }
      testFiles = testFiles.concat(await findTestFiles(fullPath));
    } else if (
      entry.isFile() && 
      /\.test\.(js|jsx|ts|tsx)$/.test(entry.name) &&
      !entry.name.endsWith('.d.ts')
    ) {
      testFiles.push(fullPath);
    }
  }
  
  return testFiles;
}

// Analyze a single test file
async function analyzeTestFile(filePath) {
  const content = await fs.readFile(filePath, 'utf8');
  const stats = await fs.stat(filePath);
  const lines = content.split('\n');
  
  const issues = [];
  const statsData = {
    filePath,
    sizeKB: Math.round(stats.size / 1024 * 100) / 100,
    lineCount: lines.length,
    testCount: (content.match(/\bit\(/g) || []).length,
    describeCount: (content.match(/\bdescribe\(/g) || []).length,
    beforeEachCount: (content.match(/\bbeforeEach\(/g) || []).length,
    afterEachCount: (content.match(/\bafterEach\(/g) || []).length,
    beforeAllCount: (content.match(/\bbeforeAll\(/g) || []).length,
    afterAllCount: (content.match(/\bafterAll\(/g) || []).length,
    issues: []
  };
  
  // Check for potential memory leaks
  MEMORY_LEAK_PATTERNS.forEach(({ pattern, message }) => {
    const matches = content.match(pattern);
    if (matches) {
      issues.push({
        type: 'potential_issue',
        message,
        pattern: pattern.toString(),
        matches: matches.length,
        sample: matches[0].slice(0, 100) + (matches[0].length > 100 ? '...' : '')
      });
    }
  });
  
  // Check for large test files
  if (statsData.sizeKB > CONFIG.maxFileSizeKB) {
    issues.push({
      type: 'large_file',
      message: `Test file is large (${statsData.sizeKB}KB). Consider splitting into smaller test files.`,
      sizeKB: statsData.sizeKB
    });
  }
  
  // Check for long test files
  if (statsData.lineCount > CONFIG.maxTestLength) {
    issues.push({
      type: 'long_file',
      message: `Test file is long (${statsData.lineCount} lines). Consider splitting into smaller test files.`,
      lineCount: statsData.lineCount
    });
  }
  
  // Check for too many hooks
  const totalHooks = statsData.beforeEachCount + statsData.afterEachCount + 
                    statsData.beforeAllCount + statsData.afterAllCount;
  
  if (totalHooks > CONFIG.maxBeforeEach * 2) {
    issues.push({
      type: 'many_hooks',
      message: `Test file has many test hooks (${totalHooks}). Consider consolidating setup/teardown logic.`,
      hooks: {
        beforeEach: statsData.beforeEachCount,
        afterEach: statsData.afterEachCount,
        beforeAll: statsData.beforeAllCount,
        afterAll: statsData.afterAllCount
      }
    });
  }
  
  statsData.issues = issues;
  return statsData;
}

// Generate optimization suggestions
function generateSuggestions(analysis) {
  const suggestions = [];
  
  analysis.files.forEach(file => {
    if (file.issues.length > 0) {
      suggestions.push({
        file: file.filePath,
        issues: file.issues,
        suggestions: file.issues.map(issue => ({
          type: issue.type,
          message: issue.message,
          fix: getFixSuggestion(issue)
        }))
      });
    }
  });
  
  return suggestions;
}

// Get fix suggestion for an issue
function getFixSuggestion(issue) {
  switch (issue.type) {
    case 'large_file':
      return 'Split this test file into smaller, focused test files (e.g., by component or feature).';
      
    case 'long_file':
      return 'Break this test file into smaller, more focused test files or use describe blocks to better organize tests.';
      
    case 'many_hooks':
      return 'Consolidate test setup/teardown logic into reusable helper functions or custom test utilities.';
      
    case 'potential_issue':
      return issue.message + ' ' + getPatternSpecificSuggestion(issue.pattern);
      
    default:
      return 'Review the test file for potential memory leaks or performance issues.';
  }
}

// Get pattern-specific suggestions
function getPatternSpecificSuggestion(pattern) {
  if (pattern.includes('JSON.parse') || pattern.includes('JSON.stringify')) {
    return 'For large objects, consider using more efficient serialization or streaming JSON parsers.';
  }
  
  if (pattern.includes('Array(') || pattern.includes('.fill(')) {
    return 'For large arrays, consider using TypedArrays or generators for better memory efficiency.';
  }
  
  if (pattern.includes('fetch') || pattern.includes('axios') || pattern.includes('XMLHttpRequest')) {
    return 'Always mock network requests in tests to avoid flakiness and improve performance.';
  }
  
  return 'Review the code for potential memory leaks or performance bottlenecks.';
}

// Generate a report
function generateReport(analysis) {
  const totalIssues = analysis.files.reduce((sum, file) => sum + file.issues.length, 0);
  const filesWithIssues = analysis.files.filter(f => f.issues.length > 0);
  
  return {
    timestamp: new Date().toISOString(),
    summary: {
      totalFiles: analysis.files.length,
      totalTests: analysis.files.reduce((sum, f) => sum + f.testCount, 0),
      filesWithIssues: filesWithIssues.length,
      totalIssues,
      issueTypes: analysis.files
        .flatMap(f => f.issues.map(i => i.type))
        .reduce((acc, type) => {
          acc[type] = (acc[type] || 0) + 1;
          return acc;
        }, {})
    },
    files: analysis.files.map(file => ({
      path: file.filePath,
      stats: {
        sizeKB: file.sizeKB,
        lineCount: file.lineCount,
        testCount: file.testCount,
        describeCount: file.describeCount,
        hooks: {
          beforeEach: file.beforeEachCount,
          afterEach: file.afterEachCount,
          beforeAll: file.beforeAllCount,
          afterAll: file.afterAllCount
        }
      },
      issues: file.issues
    })),
    suggestions: generateSuggestions(analysis)
  };
}

// Print report to console
function printReport(report) {
  console.log('\n📊 Test Optimization Report');
  console.log('='.repeat(80));
  console.log(`📂 Total files: ${report.summary.totalFiles}`);
  console.log(`🧪 Total tests: ${report.summary.totalTests}`);
  console.log(`⚠️  Files with issues: ${report.summary.filesWithIssues}`);
  console.log(`❌ Total issues: ${report.summary.totalIssues}`);
  
  console.log('\n🔍 Issue Types:');
  Object.entries(report.summary.issueTypes).forEach(([type, count]) => {
    console.log(`  - ${type}: ${count}`);
  });
  
  if (report.suggestions.length > 0) {
    console.log('\n💡 Optimization Suggestions:');
    report.suggestions.forEach((suggestion, index) => {
      console.log(`\n${index + 1}. ${suggestion.file}`);
      suggestion.suggestions.forEach((s, i) => {
        console.log(`   ${i + 1}. [${s.type}] ${s.message}`);
        console.log(`      💡 Suggestion: ${s.fix}`);
      });
    });
  }
  
  console.log('\n✅ Analysis complete!');
  console.log('='.repeat(80));
}

// Main function
async function main() {
  console.log('🔍 Analyzing test files for memory optimization opportunities...');
  
  try {
    // Ensure the reports directory exists
    await import('fs/promises').then(({ mkdir }) => mkdir(CONFIG.reportsDir, { recursive: true }));
    
    // Find all test files
    const testFiles = await findTestFiles(import('path').then(({ join }) => join(process.cwd(), 'src')));
    console.log(`\nFound ${testFiles.length} test files to analyze.`);
    
    // Analyze each test file
    const analysis = {
      files: [],
      timestamp: new Date().toISOString()
    };
    
    for (const file of testFiles) {
      process.stdout.write(`\rAnalyzing ${import('path').then(({ relative }) => relative(process.cwd(), file))}...`);
      const fileAnalysis = await analyzeTestFile(file);
      analysis.files.push(fileAnalysis);
    }
    
    // Generate and save report
    const report = generateReport(analysis);
    await import('fs/promises').then(({ mkdir, writeFile }) => {
      mkdir(CONFIG.reportsDir, { recursive: true });
      const reportFile = import('path').then(({ join }) => join(CONFIG.reportsDir, 'test-optimization-report.json'));
      writeFile(reportFile, JSON.stringify(report, null, 2));
    });
    
    // Print summary to console
    console.log('\n');
    printReport(report);
    
    console.log(`\n📄 Full report saved to: ${import('path').then(({ join }) => join(CONFIG.reportsDir, 'test-optimization-report.json'))}`);
    
  } catch (error) {
    console.error('\n❌ Error during analysis:', error);
    process.exit(1);
  }
}

// Run the script
main().catch(error => {
  console.error('Unhandled error:', error);
  process.exit(1);
});
