import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

// eslint-disable-next-line no-undef
const isProd = /pro/.test(process.env.NODE_ENV)

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    AutoImport({
      resolvers: [ElementPlusResolver()]
    }),
    Components({
      resolvers: [ElementPlusResolver()]
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },

  server: {
    port: 4000,
    proxy: {
      '/rest': {
        target: 'http://localhost:3000',
        changeOrigin: true //支持跨域
      },
      '/file': {
        target: 'http://localhost:3000',
        changeOrigin: true //支持跨域
      }
    }
  }
})
