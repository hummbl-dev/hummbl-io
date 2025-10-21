const { execSync } = require('child_process');
const fs = require('fs');

console.log('Starting Vercel build process...');

// Configure pnpm environment
process.env.PNPM_HOME = '/tmp/pnpm';
process.env.PNPM_CACHE_DIR = '/tmp/pnpm-cache';
process.env.PNPM_FETCH_RETRIES = '5';
process.env.PNPM_FETCH_RETRY_FACTOR = '2';
process.env.NODE_OPTIONS = '--max_old_space_size=4096';

// Ensure .npmrc exists with correct settings
if (!fs.existsSync('.npmrc')) {
  console.log('Creating .npmrc file...');
  const npmrcContent = [
    'strict-peer-dependencies=false',
    'prefer-offline=true',
    'shamefully-hoist=true',
    'auto-install-peers=true',
    'node-linker=hoisted',
    'prefer-frozen-lockfile=false'
  ].join('\n');
  fs.writeFileSync('.npmrc', npmrcContent);
}

const runCommand = (command) => {
  console.log(`\n>>> ${command}`);
  try {
    execSync(command, { stdio: 'inherit', env: process.env });
    return true;
  } catch (error) {
    console.error(`Command failed: ${command}`, error);
    return false;
  }
};

const installWithFallback = () => {
  console.log('\n=== Starting dependency installation ===');
  
  // Try pnpm install first
  console.log('\n[1/2] Attempting pnpm install...');
  if (runCommand('pnpm install --prefer-offline --ignore-scripts')) {
    return true;
  }
  
  // Fallback to npm if pnpm fails
  console.log('\n[2/2] pnpm install failed, falling back to npm install...');
  return runCommand('npm install --prefer-offline --no-package-lock');
};

try {
  // Install dependencies with fallback
  if (!installWithFallback()) {
    throw new Error('Both pnpm and npm installation failed');
  }
  
  // Run the build
  console.log('\n=== Running build ===');
  if (!runCommand('pnpm run build')) {
    throw new Error('Build failed');
  }
  
  console.log('\n✓ Build completed successfully!');
  process.exit(0);
} catch (error) {
  console.error('\n✗ Build failed:', error.message);
  process.exit(1);
}
