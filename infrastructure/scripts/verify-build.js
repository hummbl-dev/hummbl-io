#!/usr/bin/env node
/**
 * Verify that the build produced the expected binary file
 */
const fs = require('fs');
const path = require('path');

const binPath = path.join(__dirname, '..', 'bin', 'infrastructure.js');

if (!fs.existsSync(binPath)) {
  console.error(`❌ Error: ${binPath} not found after build`);
  console.error('Expected binary file is missing. Build may have failed.');
  console.error('');
  console.error('Checking for other build artifacts:');
  const binDir = path.join(__dirname, '..', 'bin');
  if (fs.existsSync(binDir)) {
    const files = fs.readdirSync(binDir);
    console.error(`Files in bin/ directory:`, files.join(', ') || '(none)');
  } else {
    console.error('bin/ directory does not exist');
  }
  process.exit(1);
}

const stats = fs.statSync(binPath);
console.log(`✅ infrastructure bin exists: ${binPath} (${Math.round(stats.size / 1024)}KB)`);

