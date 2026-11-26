
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

// Configuración de la PWA Control de Gastos
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      // Avisar cuando exista una nueva versión
      registerType: 'prompt',

      includeAssets: [
        'favicon.ico',
        'apple-touch-icon-180x180.png',
      ],

      manifest: {
        id: '/',
        name: 'Control de Gastos',
        short_name: 'Mis Gastos',
        description: 'Administra tus ingresos, registra tus gastos y controla tus finanzas personales.',
        lang: 'es-MX',

        start_url: '/',
        scope: '/',
        display: 'standalone',

        theme_color: '#1e4938',
        background_color: '#F5F7F5',

        icons: [
          {
            src: '/pwa-64x64.png',
            sizes: '64x64',
            type: 'image/png',
          },
          {
            src: '/pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: '/maskable-icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],

        shortcuts: [
          {
            name: 'Registrar gasto',
            url: '/registrar',
          },
          {
            name: 'Ver movimientos',
            url: '/movimientos',
          },
        ],
      },

      // Configuración para trabajar sin conexión
      workbox: {
        // 1. Guardar los archivos generados por el build
        globPatterns: [
          '**/*.{js,css,html,svg,png,ico,webmanifest}',
        ],

        // 2. Permitir navegar por las rutas sin internet
        navigateFallback: 'index.html',
        navigateFallbackDenylist: [/^\/__\//],

        // 3. Guardar imágenes externas en caché
        runtimeCaching: [
          {
            urlPattern: ({ request, sameOrigin }) =>
              request.destination === 'image' && !sameOrigin,

            handler: 'CacheFirst',

            options: {
              cacheName: 'imagenes-externas',

              expiration: {
                maxEntries: 60,
                maxAgeSeconds: 60 * 60 * 24 * 30,
              },

              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
        ],
      },
    }),
  ],
})
