import { defineConfig } from 'vite'

export default defineConfig({
  base: './',
  server: {
    port: 3000,
    open: true
  },
  build: {
    outDir: 'docs',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': ['papaparse'],
          'swiper': ['swiper']
        }
      }
    }
  }
})
