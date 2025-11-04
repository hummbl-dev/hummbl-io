import { defineConfig, loadEnv, type PluginOption } from 'vite';
import react from '@vitejs/plugin-react';
import { sentryVitePlugin, type SentryVitePluginOptions } from '@sentry/vite-plugin';
import path from 'path';
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig(({ mode }) => {
  // Load env variables based on the current mode
  const env = loadEnv(mode, process.cwd(), '');
  
  const isProduction = mode === 'production';
  const sentryPlugin: PluginOption | false = isProduction && 
    env.VITE_SENTRY_ORG && 
    env.VITE_SENTRY_PROJECT && 
    env.VITE_SENTRY_AUTH_TOKEN
      ? sentryVitePlugin({
          org: env.VITE_SENTRY_ORG,
          project: env.VITE_SENTRY_PROJECT,
          authToken: env.VITE_SENTRY_AUTH_TOKEN,
          release: {
            name: `hummbl-io@${env.npm_package_version || '1.0.0'}`,
            setCommits: undefined,
            deploy: undefined,
            sourcemaps: {
              filesToDeleteAfterUpload: ['**/*.map'],
            },
          },
          sourcemaps: {
            include: [
              { 
                paths: ['dist'],
                urlPrefix: '~/',
                ignore: ['node_modules'],
              },
            ],
          },
        } as SentryVitePluginOptions)
      : false;

  return {
    plugins: [
      react(),
      sentryPlugin,
      // Bundle analyzer (only in production and when ANALYZE env var is set)
      isProduction && env.ANALYZE === 'true'
        ? visualizer({
            open: true,
            filename: 'dist/stats.html',
            gzipSize: true,
            brotliSize: true,
          })
        : false,
    ].filter(Boolean),
    build: {
      sourcemap: true, // Source map generation must be turned on for Sentry
      // Optimize chunk splitting
      rollupOptions: {
        output: {
          manualChunks: (id) => {
            // React and React DOM in separate vendor chunk
            if (id.includes('node_modules/react') || id.includes('node_modules/react-dom')) {
              return 'vendor-react';
            }
            // Sentry in separate chunk (only in production)
            if (isProduction && id.includes('node_modules/@sentry')) {
              return 'vendor-sentry';
            }
            // Supabase client
            if (id.includes('node_modules/@supabase')) {
              return 'vendor-supabase';
            }
            // Large utility libraries
            if (id.includes('node_modules/zod') || id.includes('node_modules/uuid')) {
              return 'vendor-utils';
            }
            // All other node_modules in vendor chunk
            if (id.includes('node_modules')) {
              return 'vendor';
            }
          },
          // Optimize chunk file names
          chunkFileNames: (chunkInfo) => {
            const facadeModuleId = chunkInfo.facadeModuleId
              ? chunkInfo.facadeModuleId.split('/').pop()
              : 'chunk';
            return `assets/js/[name]-[hash].js`;
          },
          entryFileNames: 'assets/js/[name]-[hash].js',
          assetFileNames: (assetInfo) => {
            if (assetInfo.name?.endsWith('.css')) {
              return 'assets/css/[name]-[hash][extname]';
            }
            return 'assets/[name]-[hash][extname]';
          },
        },
      },
      // Target modern browsers for smaller bundle
      target: 'esnext',
      // Minification
      minify: 'esbuild', // Faster than terser
      // CSS code splitting
      cssCodeSplit: true,
      // Increase chunk size warning limit (we're doing manual chunking)
      chunkSizeWarningLimit: 500,
      // Build optimization
      reportCompressedSize: true, // Show gzipped sizes
      emptyOutDir: true,
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    // Optimize dependencies
    optimizeDeps: {
      include: ['react', 'react-dom'],
      exclude: ['@sentry/react'], // Exclude Sentry from pre-bundling in dev
    },
    // Experimental features for better performance
    experimental: {
      renderBuiltUrl(filename: string) {
        // Use relative URLs for better caching
        return { relative: true };
      },
    },
  };
});
