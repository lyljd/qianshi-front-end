import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from "unplugin-auto-import/vite"
import viteCompression from 'vite-plugin-compression'
import prismjs from 'vite-plugin-prismjs'

export default defineConfig({
  plugins: [
    vue(),
    AutoImport({
      imports: ['vue'],
      dts: 'src/auto-import.d.ts',
    }),
    viteCompression(),
    prismjs({
      languages: 'all',
      plugins: [
        'show-language',
        'copy-to-clipboard',
        'line-numbers',
      ],
      theme: 'default',
      css: true
    }),
  ],
  server: {
    host: '0.0.0.0',
    port: 9000,
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      }
    }
  },
  resolve: {
    alias: {
      '@': '/src',
    },
  },
})
