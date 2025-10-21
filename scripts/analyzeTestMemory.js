#!/usr/bin/env node

import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs/promises';
import { performance } from 'perf_hooks';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configuration
const CONFIG = {
  reportsDir: join(process.cwd(), 'reports'),
  memoryThreshold: 100, // MB
  testTimeout: 30000, // ms
  maxWorkers: 1, // Run tests sequentially
  nodeOptions: [
    '--max-old-space-size=2048',
    '--expose-gc',
    '--gc-interval=100',
  ].join(' '),
};

// Ensure the reports directory exists
async function ensureReportsDir() {
  try {
    await fs.mkdir(CONFIG.reportsDir, { recursive: true });
  } catch (error) {
    console.error('Failed to create reports directory:', error);
    process.exit(1);
  }
}

// Get list of all test files
async function findTestFiles() {
  console.log('🔍 Finding test files...');
  try {
    const testFiles = execSync('find src -name "*.test.@(js|jsx|ts|tsx)" | sort')
      .toString()
      .trim()
      .split('\n')
      .filter(Boolean);
    
    console.log(`✅ Found ${testFiles.length} test files.`);
    return testFiles;
  } catch (error) {
    console.error('❌ Failed to find test files:', error.message);
    process.exit(1);
  }
}

// Run a single test file and measure memory usage
async function runTest(testFile) {
  const startTime = performance.now();
  const startMemory = process.memoryUsage();
  
  try {
    console.log(`\n🧪 Running: ${testFile}`);
    
    // Run the test with memory measurement
    execSync(
      `NODE_OPTIONS="${CONFIG.nodeOptions}" ` +
      `npx vitest run ${testFile} ` +
      `--no-watch ` +
      `--silent ` +
      `--run ` +
      `--pool=forks ` +
      `--poolOptions.forks.singleFork ` +
      `--testTimeout=${CONFIG.testTimeout} ` +
      `--maxConcurrency=1`,
      {
        stdio: 'inherit',
        env: { 
          ...process.env,
          NODE_ENV: 'test',
          // Enable debug logging if needed
          // DEBUG: 'vitest:*',
        },
      }
    );
    
    const endTime = performance.now();
    const endMemory = process.memoryUsage();
    
    const duration = (endTime - startTime) / 1000; // seconds
    const memoryUsed = {
      rss: (endMemory.rss - startMemory.rss) / 1024 / 1024,
      heapTotal: (endMemory.heapTotal - startMemory.heapTotal) / 1024 / 1024,
      heapUsed: (endMemory.heapUsed - startMemory.heapUsed) / 1024 / 1024,
      external: (endMemory.external - (startMemory.external || 0)) / 1024 / 1024,
    };
    
    const result = {
      file: testFile,
      status: 'passed',
      duration,
      memoryUsed,
      isMemoryIntensive: memoryUsed.heapUsed > CONFIG.memoryThreshold,
      timestamp: new Date().toISOString(),
    };
    
    console.log(`✅ ${testFile} - ${duration.toFixed(2)}s - ${memoryUsed.heapUsed.toFixed(2)}MB`);
    return result;
    
  } catch (error) {
    const endTime = performance.now();
    const endMemory = process.memoryUsage();
    
    const duration = (endTime - startTime) / 1000;
    const memoryUsed = {
      rss: (endMemory.rss - startMemory.rss) / 1024 / 1024,
      heapTotal: (endMemory.heapTotal - startMemory.heapTotal) / 1024 / 1024,
      heapUsed: (endMemory.heapUsed - startMemory.heapUsed) / 1024 / 1024,
      external: (endMemory.external - (startMemory.external || 0)) / 1024 / 1024,
    };
    
    console.error(`❌ ${testFile} - Failed after ${duration.toFixed(2)}s`);
    
    return {
      file: testFile,
      status: 'failed',
      duration,
      memoryUsed,
      isMemoryIntensive: memoryUsed.heapUsed > CONFIG.memoryThreshold,
      error: error.message,
      timestamp: new Date().toISOString(),
    };
  } finally {
    // Force garbage collection between test runs
    if (global.gc) {
      global.gc();
    }
    
    // Add a small delay between tests to allow for cleanup
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
}

// Generate a report of test memory usage
function generateReport(results) {
  // Sort by memory usage (descending)
  const sortedByMemory = [...results].sort((a, b) => 
    (b.memoryUsed?.heapUsed || 0) - (a.memoryUsed?.heapUsed || 0)
  );
  
  // Sort by duration (descending)
  const sortedByDuration = [...results].sort((a, b) => 
    (b.duration || 0) - (a.duration || 0)
  );
  
  // Count stats
  const stats = {
    total: results.length,
    passed: results.filter(r => r.status === 'passed').length,
    failed: results.filter(r => r.status === 'failed').length,
    memoryIntensive: results.filter(r => r.isMemoryIntensive).length,
    avgMemory: results.reduce((sum, r) => sum + (r.memoryUsed?.heapUsed || 0), 0) / results.length,
    avgDuration: results.reduce((sum, r) => sum + (r.duration || 0), 0) / results.length,
  };
  
  return {
    timestamp: new Date().toISOString(),
    config: CONFIG,
    stats,
    mostMemoryIntensive: sortedByMemory.slice(0, 20),
    slowestTests: sortedByDuration.slice(0, 20),
    allResults: results,
  };
}

// Save report to a file
async function saveReport(report) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const reportFile = join(CONFIG.reportsDir, `memory-report-${timestamp}.json`);
  
  try {
    await fs.writeFile(reportFile, JSON.stringify(report, null, 2));
    console.log(`\n📊 Report saved to: ${reportFile}`);
    return reportFile;
  } catch (error) {
    console.error('Failed to save report:', error);
    return null;
  }
}

// Print a summary of the test results
function printSummary(report) {
  console.log('\n📋 Test Execution Summary');
  console.log('='.repeat(80));
  console.log(`Total tests: ${report.stats.total}`);
  console.log(`✅ Passed: ${report.stats.passed}`);
  console.log(`❌ Failed: ${report.stats.failed}`);
  console.log(`💾 Memory intensive (>${CONFIG.memoryThreshold}MB): ${report.stats.memoryIntensive}`);
  console.log(`⏱️  Average duration: ${report.stats.avgDuration.toFixed(2)}s`);
  console.log(`📊 Average memory: ${report.stats.avgMemory.toFixed(2)}MB`);
  
  if (report.stats.memoryIntensive > 0) {
    console.log('\n🔝 Top 10 Memory-Intensive Tests:');
    report.mostMemoryIntensive.slice(0, 10).forEach((test, i) => {
      console.log(`  ${i + 1}. ${test.file} - ${test.memoryUsed.heapUsed.toFixed(2)}MB`);
    });
  }
  
  console.log('\n🐌 Top 10 Slowest Tests:');
  report.slowestTests.slice(0, 10).forEach((test, i) => {
    console.log(`  ${i + 1}. ${test.file} - ${test.duration.toFixed(2)}s`);
  });
  
  console.log('='.repeat(80));
}

// Main function
async function main() {
  console.log('🚀 Starting test memory analysis...');
  
  try {
    // Setup environment
    await ensureReportsDir();
    const testFiles = await findTestFiles();
    
    if (testFiles.length === 0) {
      console.log('No test files found. Exiting.');
      return;
    }
    
    // Run tests one by one
    const results = [];
    for (const testFile of testFiles) {
      const result = await runTest(testFile);
      results.push(result);
    }
    
    // Generate and save report
    const report = generateReport(results);
    const reportFile = await saveReport(report);
    
    // Print summary
    printSummary(report);
    
    if (report.stats.failed > 0) {
      console.error('\n❌ Some tests failed. Check the report for details.');
      process.exit(1);
    } else {
      console.log('\n✅ All tests passed!');
    }
    
    // Exit with success code
    process.exit(0);
    
  } catch (error) {
    console.error('\n❌ Error during test analysis:', error);
    process.exit(1);
  }
}

// Run the script
main().catch(error => {
  console.error('Unhandled error:', error);
  process.exit(1);
});
