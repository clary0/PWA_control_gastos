
import { useRegisterSW } from 'virtual:pwa-register/react'

// Registra el Service Worker y avisa cuando hay una versión nueva
export default function AvisoActualizacion() {
  const {
    needRefresh: [hayVersionNueva, setHayVersionNueva],
    updateServiceWorker,
  } = useRegisterSW()

  if (!hayVersionNueva) return null

  return (
    <div
      className="toast show position-fixed"
      role="alert"
      style={{
        top: '80px',
        right: '16px',
        bottom: 'auto',
        left: 'auto',
        zIndex: 2000,
      }}
    >
      <div className="toast-body">
        Hay una versión nueva de la app.

        <div className="mt-2 d-flex gap-2">
          <button
            className="btn btn-primary btn-sm"
            onClick={() => updateServiceWorker(true)}
          >
            Actualizar
          </button>

          <button
            className="btn btn-secondary btn-sm"
            onClick={() => setHayVersionNueva(false)}
          >
            Después
          </button>
        </div>
      </div>
    </div>
  )
}
