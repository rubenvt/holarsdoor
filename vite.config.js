import { defineConfig } from 'vite'

export default defineConfig({
  // Ensure environment variables are properly loaded
  envPrefix: 'VITE_',
  
  // Configure server for development
  server: {
    port: 3000,
    strictPort: true,
    host: true,
    open: true
  },
  
  // Configure build options
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: true,
    // Optimize for production
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: false, // Keep console logs for debugging
        drop_debugger: true
      }
    }
  }
})
