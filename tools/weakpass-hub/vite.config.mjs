import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// Relative base so the built app works when served from a GitHub Pages
// subpath, e.g. https://zzzteph.github.io/weakpass/tools/weakpass-hub/dist/
export default defineConfig({
  base: './',
  plugins: [vue()],
  worker: {
    format: 'es'
  },
  build: {
    target: 'es2020',
    chunkSizeWarningLimit: 2000
  }
})
