#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Ensure the reports directory exists
const reportsDir = path.join(process.cwd(), 'reports');
if (!fs.existsSync(reportsDir)) {
  fs.mkdirSync(reportsDir, { recursive: true });
}

// Get list of all test files
console.log('🔍 Finding test files...');
const testFiles = execSync('find src -name "*.test.@(js|jsx|ts|tsx)" | sort')
  .toString()
  .trim()
  .split('\n')
  .filter(Boolean);

console.log(`Found ${testFiles.length} test files.`);

const results = [];
const memoryThreshold = 100; // MB

// Run tests one by one and measure memory usage
async function runTests() {
  for (const testFile of testFiles) {
    try {
      console.log(`\n🧪 Testing: ${testFile}`);
      
      // Run the test with memory measurement
      const startMemory = process.memoryUsage().heapUsed / 1024 / 1024;
      const startTime = Date.now();
      
      execSync(`NODE_OPTIONS='--max-old-space-size=2048 --expose-gc' npx vitest run ${testFile} --no-watch --silent --run`, {
        stdio: 'inherit',
        env: { ...process.env, NODE_ENV: 'test' },
      });
      
      const endTime = Date.now();
      const endMemory = process.memoryUsage().heapUsed / 1024 / 1024;
      const memoryUsed = Math.round((endMemory - startMemory) * 100) / 100;
      const duration = (endTime - startTime) / 1000;
      
      console.log(`✅ ${testFile} - ${duration.toFixed(2)}s - ${memoryUsed}MB`);
      
      results.push({
        file: testFile,
        duration,
        memoryUsed,
        isMemoryIntensive: memoryUsed > memoryThreshold,
      });
      
      // Force garbage collection between test files
      if (global.gc) {
        global.gc();
      }
      
      // Add a small delay between tests
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.error(`❌ Failed to run ${testFile}:`, error.message);
      results.push({
        file: testFile,
        error: error.message,
      });
    }
  }
  
  // Sort by memory usage (descending)
  results.sort((a, b) => (b.memoryUsed || 0) - (a.memoryUsed || 0));
  
  // Generate report
  const report = {
    timestamp: new Date().toISOString(),
    memoryThreshold,
    results,
  };
  
  const reportFile = path.join(reportsDir, `memory-report-${Date.now()}.json`);
  fs.writeFileSync(reportFile, JSON.stringify(report, null, 2));
  
  console.log('\n📊 Memory Usage Report:');
  console.log('='.repeat(80));
  console.log('Most memory-intensive tests:');
  results
    .filter(r => r.memoryUsed > memoryThreshold)
    .slice(0, 10)
    .forEach((r, i) => {
      console.log(`${i + 1}. ${r.file} - ${r.memoryUsed}MB (${r.duration.toFixed(2)}s)`);
    });
    
  console.log('\n✅ Report saved to:', reportFile);
  console.log('='.repeat(80));
}

// Make the script executable
if (process.platform !== 'win32') {
  fs.chmodSync(__filename, '755');
}

runTests().catch(console.error);
