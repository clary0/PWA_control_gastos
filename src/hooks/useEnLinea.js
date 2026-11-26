import { useSyncExternalStore } from 'react'

function suscribir(avisar) {
  window.addEventListener('online', avisar)
  window.addEventListener('offline', avisar)

  return () => {
    window.removeEventListener('online', avisar)
    window.removeEventListener('offline', avisar)
  }
}

// true con red, false sin red; se actualiza solo
export function useEnLinea() {
  return useSyncExternalStore(suscribir, () => navigator.onLine)
}