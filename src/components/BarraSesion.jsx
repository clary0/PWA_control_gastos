import { useEnLinea } from '../hooks/useEnLinea.js'
import { useSesion } from '../sesion/useSesion.js'

export default function BarraSesion() {
  const { usuario, entrarConGoogle, salir } = useSesion()

  const enLinea = useEnLinea() // Google necesita red

  if (!usuario) return <span className="navbar-text">Sin sesión</span>

    if (usuario.isAnonymous) {
    return (
      <button
        className="btn btn-light btn-sm"
        disabled={!enLinea}
        onClick={entrarConGoogle}
      >
        Entrar con Google
      </button>
    )
  }

  return (
    <div className="d-flex align-items-center gap-2">
      <span className="navbar-text">{usuario.displayName}</span>
      <button
        className="btn btn-outline-light btn-sm"
        disabled={!enLinea}
        onClick={salir}
      >
        Salir
      </button>
    </div>
  )
}