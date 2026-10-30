
import { Component } from 'react'

// Si una vista falla al cargarse,
// el error se muestra aquí y se conserva el resto de la aplicación.
export default class ViewErrorBoundary extends Component {
  state = { error: null }

  static getDerivedStateFromError(error) {
    return { error }
  }

  render() {
    if (!this.state.error) return this.props.children

    return (
      <div className="text-center py-5">
        <i className="bi bi-wallet2 display-4 text-secondary"></i>

        <h2 className="h5 mt-3">
          No se pudo cargar esta sección
        </h2>

        <p className="small text-body-secondary">
          Ocurrió un problema al mostrar esta parte de tu
          aplicación. Revisa tu conexión e intenta nuevamente.
        </p>

        <button
          type="button"
          className="btn btn-gastos"
          onClick={() => window.location.reload()}
        >
          <i className="bi bi-arrow-clockwise me-2"></i>
          Reintentar
        </button>
      </div>
    )
  }
}
