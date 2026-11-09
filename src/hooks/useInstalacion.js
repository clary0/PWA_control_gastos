
import { useSyncExternalStore } from 'react'

// Variable que almacena el evento de instalación
let aviso = null
const oyentes = new Set()

const notificar = () => oyentes.forEach((fn) => fn())

// Detectar cuando el navegador permite instalar la PWA
if (typeof window !== 'undefined') {
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault()
    aviso = e
    notificar()
  })

  // Detectar cuando Control de Gastos ya fue instalada
  window.addEventListener('appinstalled', () => {
    aviso = null
    notificar()
  })
}

// Suscripción a los cambios
function suscribir(fn) {
  oyentes.add(fn)
  return () => oyentes.delete(fn)
}

// Hook personalizado de instalación
export function useInstalacion() {
  const evento = useSyncExternalStore(
    suscribir,
    () => aviso,
    () => null
  )

  // Función para instalar la aplicación
  async function instalar() {
    if (!evento) return

    evento.prompt()

    const { outcome } = await evento.userChoice

    console.log('Instalación de Control de Gastos:', outcome)

    aviso = null
    notificar()
  }

  return {
    puedeInstalar: evento !== null,
    instalar,
  }
}
