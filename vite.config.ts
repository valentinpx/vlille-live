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
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/media\.ilevia\.fr\/opendata\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'vlille-api-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 5 * 60, // 5 minutes
              },
            },
          },
          {
            urlPattern: /^https:\/\/tile\.openstreetmap\.org\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'osm-tiles-cache',
              expiration: {
                maxEntries: 200,
                maxAgeSeconds: 7 * 24 * 60 * 60, // 7 jours
              },
            },
          },
        ],
      },
      manifest: {
        id: 'vlille-live',
        name: 'Vlille Live - V\'lille en temps réel',
        short_name: 'Vlille Live',
        description: 'Consultez en temps réel la disponibilité des vélos et stations V\'lille à Lille. Application web progressive gratuite et open source.',
        lang: 'fr',
        start_url: '/',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#22C55E',
        orientation: 'portrait-primary',
        categories: ['productivity', 'travel', 'navigation', 'utilities'],
        icons: [
          {
            src: '/favicon.png',
            sizes: '32x32',
            type: 'image/png'
          },
          {
            src: '/icons/512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          },
          {
            src: '/icons/1024.png',
            sizes: '1024x1024',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ],
        screenshots: [
          {
            src: '/screenshots/mobile/map.png',
            sizes: '1179x2556',
            type: 'image/png',
            form_factor: 'narrow',
            label: 'Vue carte des stations V\'lille sur mobile'
          },
          {
            src: '/screenshots/mobile/station.png',
            sizes: '1179x2556',
            type: 'image/png',
            form_factor: 'narrow',
            label: 'Détails d\'une station V\'lille sur mobile'
          },
          {
            src: '/screenshots/desktop/map.png',
            sizes: '1200x630',
            type: 'image/png',
            form_factor: 'wide',
            label: 'Vue carte des stations V\'lille sur desktop'
          },
          {
            src: '/screenshots/desktop/station.png',
            sizes: '1200x630',
            type: 'image/png',
            form_factor: 'wide',
            label: 'Détails d\'une station V\'lille sur desktop'
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
