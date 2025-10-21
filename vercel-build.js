const { execSync } = require('child_process');
const fs = require('fs');

console.log('Starting Vercel build process...');

// Ensure .npmrc exists with correct settings
if (!fs.existsSync('.npmrc')) {
  console.log('Creating .npmrc file...');
  fs.writeFileSync('.npmrc', 'auto-install-peers=true\nshamefully-hoist=true\nnode-linker=hoisted');
}

try {
  // Install dependencies
  console.log('Installing dependencies...');
  execSync('pnpm install --no-frozen-lockfile', { stdio: 'inherit' });
  
  // Run the build
  console.log('Running build...');
  execSync('pnpm run build', { stdio: 'inherit' });
  
  console.log('Build completed successfully!');
  process.exit(0);
} catch (error) {
  console.error('Build failed:', error);
  process.exit(1);
}
