
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

// Configuración de la PWA Control de Gastos
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',

      includeAssets: [
        'favicon.ico',
        'apple-touch-icon-180x180.png',
      ],

      manifest: {
        // 1. Identidad de la aplicación
        id: '/',
        name: 'Control de Gastos',
        short_name: 'Mis Gastos',
        description: 'Administra tus ingresos, registra tus gastos y controla tus finanzas personales.',
        lang: 'es-MX',

        // 2. Inicio y visualización
        start_url: '/',
        scope: '/',
        display: 'standalone',

        // 3. Colores de la aplicación
        theme_color: '#1e4938',
        background_color: '#F5F7F5',

        // 4. Iconos de la aplicación
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

        // 5. Accesos directos de la aplicación
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
    }),
  ],
})
