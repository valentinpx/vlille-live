/// <reference types="vitest" />

import legacy from '@vitejs/plugin-legacy'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    legacy(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        id: 'vlille-live',
        lang: 'fr',
        icons: [
          {
            src: '/icons/512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: '/icons/1024.png',
            sizes: '1024x1024',
            type: 'image/png'
          }
        ],
        screenshots: [
          {
            src: '/screenshots/mobile/map.png',
            sizes: '1179x2556',
            type: 'image/png',
            form_factor: 'narrow'
          },
          {
            src: '/screenshots/mobile/station.png',
            sizes: '1179x2556',
            type: 'image/png',
            form_factor: 'narrow'
          },
          {
            src: '/screenshots/desktop/map.png',
            sizes: '1920x970',
            type: 'image/jpeg',
            form_factor: 'wide'
          },
          {
            src: '/screenshots/desktop/station.png',
            sizes: '1920x970',
            type: 'image/jpeg',
            form_factor: 'wide'
          }
        ]
      }
    })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom'
  }
})
