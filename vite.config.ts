import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    vue(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      // Tambah 'launchericon-*.png' supaya Vite cache semua ikon ini
      includeAssets: ['favicon.svg', 'logo/logo.png', 'splash/*.jpeg', 'launchericon-*.png'],
      manifest: {
        name: 'eBorneensis',
        short_name: 'eBorneensis',
        description: 'A comprehensive biodiversity monitoring platform for Borneo.',
        theme_color: '#000000',
        background_color: '#ffffff',
        display: 'standalone',
        icons: [
          {
            src: 'launchericon-48x48.png',
            sizes: '48x48',
            type: 'image/png'
          },
          {
            src: 'launchericon-72x72.png',
            sizes: '72x72',
            type: 'image/png'
          },
          {
            src: 'launchericon-96x96.png',
            sizes: '96x96',
            type: 'image/png'
          },
          {
            src: 'launchericon-144x144.png',
            sizes: '144x144',
            type: 'image/png'
          },
          {
            src: 'launchericon-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'launchericon-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: 'launchericon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,jpeg,jpg,webp}']
      }
    })
  ],
})