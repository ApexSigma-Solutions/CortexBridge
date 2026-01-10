import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  server: {
    port: 6001,
    strictPort: true,
    proxy: {
      '/api/omega': {
        target: 'http://127.0.0.1:8765',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/omega/, '')
      },
      '/api/ingest': {
        target: 'http://127.0.0.1:8766',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/ingest/, '')
      },
      '/api/memos': {
        target: 'http://127.0.0.1:8768',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/memos/, '')
      }
    }
  }
})
