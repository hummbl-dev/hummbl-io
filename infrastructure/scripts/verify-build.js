#!/usr/bin/env node
/**
 * Verify that the build produced the expected binary file
 */
const fs = require('fs');
const path = require('path');

const packageRoot = path.resolve(__dirname, '..');
const binPath = path.join(packageRoot, 'bin', 'infrastructure.js');

console.log('=== Build Verification ===');
console.log('Package root:', packageRoot);
console.log('Expected binary:', binPath);
console.log('Current working directory:', process.cwd());
console.log('');

// Check if bin directory exists
const binDir = path.join(packageRoot, 'bin');
if (!fs.existsSync(binDir)) {
  console.error(`❌ Error: ${binDir} directory does not exist`);
  console.error('Build may have failed or TypeScript did not compile files.');
  process.exit(1);
}

// List all files in bin directory
const binFiles = fs.readdirSync(binDir);
console.log('Files in bin/ directory:', binFiles.join(', ') || '(none)');

// Check for the expected file
if (!fs.existsSync(binPath)) {
  console.error(`❌ Error: ${binPath} not found after build`);
  console.error('Expected binary file is missing. Build may have failed.');
  console.error('');
  console.error('Checking for TypeScript compilation errors...');
  const libDir = path.join(packageRoot, 'lib');
  if (fs.existsSync(libDir)) {
    const libFiles = fs.readdirSync(libDir);
    console.error(`Files in lib/ directory:`, libFiles.join(', ') || '(none)');
  }
  process.exit(1);
}

const stats = fs.statSync(binPath);
console.log(`✅ infrastructure bin exists: ${binPath} (${Math.round(stats.size / 1024)}KB)`);
console.log('File permissions:', stats.mode.toString(8));

// Check if the binary is executable
if ((stats.mode & 0o111) === 0) {
  console.warn(`⚠️  Warning: ${binPath} is not marked as executable. CLI tools should have the execute bit set.`);
  console.warn('You may need to run: chmod +x ' + binPath);
}
