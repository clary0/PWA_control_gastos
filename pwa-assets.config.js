import {
  defineConfig,
  minimal2023Preset as preset,
} from '@vite-pwa/assets-generator/config'

// Fondo de los iconos maskable y Apple
// Utilizamos el color principal de Control de Gastos
const fondo = { background: '#1e4938' }

export default defineConfig({
  headLinkOptions: { preset: '2023' },

  preset: {
    ...preset,
    maskable: {
      ...preset.maskable,
      resizeOptions: fondo,
    },
    apple: {
      ...preset.apple,
      resizeOptions: fondo,
    },
  },

  // Logo de Control de Gastos
  images: ['public/logo.svg'],
})
