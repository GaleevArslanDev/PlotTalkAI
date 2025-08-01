import { fileURLToPath, URL } from 'node:url'
import fs from 'fs'
import path from 'path'
import { nodePolyfills } from 'vite-plugin-node-polyfills'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(), 
    vueDevTools(),
    nodePolyfills({
      include: ['crypto'],  // Явно включаем полифил для crypto
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  base: '/PlotTalkAI/',
  build: {
    assetsDir: 'assets', // Папка для ресурсов (опционально)
  }
})
