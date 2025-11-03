#!/usr/bin/env node
/**
 * Prepare script check - only runs build in non-CI environments
 * In CI, build is handled explicitly by workflow steps
 */
if (process.env.CI) {
  console.log('Skipping prepare script in CI environment (build handled by workflow)');
  process.exit(0);
}

try {
  const { execSync } = require('child_process');
  execSync('npm run build', { stdio: 'inherit' });
} catch (error) {
  console.error('Build failed during prepare:', error.message);
  process.exit(error.status || 1);
}

