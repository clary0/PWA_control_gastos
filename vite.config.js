
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      devOptions: {
        enabled: true,
  },
      manifest: {
        name: 'Control de Gastos Personales',
        short_name: 'Mis Gastos',
        description: 'Aplicacion para registrar ingresos y gastos',
        lang: 'es-MX',
        theme_color: '#dce8f7',
        background_color: '#f4f4f4',
        display: 'standalone',
        start_url: '/',
        scope: '/',
        icons: [
          {
            src: '/icono.svg',
            sizes: 'any',
            type: 'image/svg+xml',
            purpose: 'any',
        },
      ],
    },
    }),
  ],
})
