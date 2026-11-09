
import { useState, useEffect } from 'react'
import { useInstalacion } from '../../hooks/useInstalacion.js'

export default function InstallButton() {
  const { puedeInstalar, instalar } = useInstalacion()
  const [ayuda, setAyuda] = useState(false)
  const [yaInstalada, setYaInstalada] = useState(false)

  const esIOS =
    typeof navigator !== 'undefined' &&
    /iphone|ipad|ipod/i.test(navigator.userAgent)

  useEffect(() => {
    const comprobarInstalacion = () => {
      const instalada =
        window.matchMedia('(display-mode: standalone)').matches ||
        window.navigator.standalone === true

      setYaInstalada(instalada)
    }

    comprobarInstalacion()

    window.addEventListener('appinstalled', comprobarInstalacion)

    return () => {
      window.removeEventListener('appinstalled', comprobarInstalacion)
    }
  }, [])

  if (yaInstalada) return null

  if (puedeInstalar) {
    return (
      <button
        type="button"
        className="btn btn-light btn-sm text-nowrap"
        onClick={instalar}
      >
        <i className="bi bi-download me-1" aria-hidden="true"></i>
        Instalar
      </button>
    )
  }

  if (!esIOS) return null

  return (
    <>
      <button
        type="button"
        className="btn btn-light btn-sm text-nowrap"
        onClick={() => setAyuda(!ayuda)}
        aria-expanded={ayuda}
      >
        <i className="bi bi-download me-1" aria-hidden="true"></i>
        Instalar
      </button>

      {ayuda && (
        <div className="alert alert-light shadow small mb-0">
          Toca <i className="bi bi-box-arrow-up" aria-hidden="true"></i>
          <b> Compartir</b> y después
          <b> Agregar a pantalla de inicio</b>.
        </div>
      )}
    </>
  )
}
