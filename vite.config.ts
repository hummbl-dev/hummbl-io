import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  
  build: {
    // Production optimizations
    minify: 'esbuild',
    target: 'esnext',
    
    // Code splitting for better caching
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Vendor chunks
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom')) {
              return 'react-vendor';
            }
            if (id.includes('lucide-react')) {
              return 'icons';
            }
          }
        },
      },
    },
    
    // Chunk size warnings
    chunkSizeWarningLimit: 1000,
    
    // Source maps for debugging (disable in production if not needed)
    sourcemap: false,
  },
  
  // Performance optimizations
  optimizeDeps: {
    include: ['react', 'react-dom', 'lucide-react'],
  },
  
  // Server configuration
  server: {
    port: 5173,
    strictPort: false,
    open: false,
  },
  
  // Preview configuration
  preview: {
    port: 4173,
    strictPort: false,
  },
})
