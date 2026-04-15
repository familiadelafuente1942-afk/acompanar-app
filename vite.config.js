import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icons/*.png'],
      manifest: {
        name: 'Acompañar',
        short_name: 'Acompañar',
        description: 'Asistente personal para adultos mayores con Martita IA',
        theme_color: '#1B4F8A',
        background_color: '#F4F6F9',
        display: 'standalone',
        orientation: 'portrait',
        scope: '/',
        start_url: '/',
        lang: 'es-AR',
        icons: [
          { src:'icons/icon-72.png',  sizes:'72x72',   type:'image/png' },
          { src:'icons/icon-96.png',  sizes:'96x96',   type:'image/png' },
          { src:'icons/icon-128.png', sizes:'128x128', type:'image/png' },
          { src:'icons/icon-144.png', sizes:'144x144', type:'image/png' },
          { src:'icons/icon-152.png', sizes:'152x152', type:'image/png' },
          { src:'icons/icon-192.png', sizes:'192x192', type:'image/png', purpose:'any maskable' },
          { src:'icons/icon-384.png', sizes:'384x384', type:'image/png' },
          { src:'icons/icon-512.png', sizes:'512x512', type:'image/png', purpose:'any maskable' }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: { cacheName:'google-fonts', expiration:{ maxEntries:10, maxAgeSeconds:31536000 } }
          },
          {
            urlPattern: /^https:\/\/images\.unsplash\.com\/.*/i,
            handler: 'CacheFirst',
            options: { cacheName:'unsplash', expiration:{ maxEntries:50, maxAgeSeconds:2592000 } }
          }
        ]
      }
    })
  ]
})
