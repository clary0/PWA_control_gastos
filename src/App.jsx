
import { useState, useEffect } from 'react'
import './styles/app.css'

function App() {
  const [vista, setVista] = useState('Resumen')
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState('')
  const [enLinea, setEnLinea] = useState(() => navigator.onLine)

  // Detectar cuando se recupera o se pierde la conexión
  useEffect(() => {
    function conexionRestaurada() {
      setEnLinea(true)
    }

    function conexionPerdida() {
      setEnLinea(false)
    }

    window.addEventListener('online', conexionRestaurada)
    window.addEventListener('offline', conexionPerdida)

    // Limpiar los eventos al desmontar el componente
    return () => {
      window.removeEventListener('online', conexionRestaurada)
      window.removeEventListener('offline', conexionPerdida)
    }
  }, [])

  function navegar(nuevaVista) {
    setError('')
    setCargando(false)
    setVista(nuevaVista)
  }

  return (
    <div className="app-shell">

      {/* SHELL: encabezado */}
      <header className="shell-header">
        <div className="marca">
          <span className="icono">💰</span>

          <div>
            <h1>Control de Gastos</h1>
            <p>Mis finanzas personales</p>
          </div>
        </div>

        <span
          className={`estado ${enLinea ? 'online' : 'offline'}`}
          role="status"
          aria-live="polite"
        >
          <span className="punto" aria-hidden="true" />
          {enLinea ? 'En línea' : 'Sin conexión'}
        </span>
      </header>

      {/* Aviso cuando no hay conexión */}
      {!enLinea && (
        <div className="aviso-conexion" role="status">
          No tienes conexión de red. Algunas funciones podrían
          no estar disponibles.
        </div>
      )}

      {/* SHELL: área que contiene cada vista */}
      <main className="shell-main">
        {cargando ? (
          <div
            className="estado-carga"
            role="status"
            aria-label="Cargando contenido"
          >
            <div className="skeleton titulo-skeleton" />
            <div className="skeleton linea-skeleton" />
            <div className="skeleton tarjeta-skeleton" />
          </div>
        ) : error ? (
          <section className="mensaje-error" role="alert">
            <h2>No se pudo mostrar el contenido</h2>
            <p>{error}</p>

            <button onClick={() => setError('')}>
              Cerrar mensaje
            </button>
          </section>
        ) : (
          <section className="vista-actual">
            <p className="etiqueta">CONTROL DE GASTOS PERSONALES</p>
            <h2>{vista}</h2>

            <p>
              Aquí se mostrará el contenido de la sección seleccionada.
            </p>

            <div className="area-contenido">
              Área reservada para esta vista
            </div>
          </section>
        )}
      </main>

      {/* SHELL: navegación inferior */}
      <nav className="shell-nav" aria-label="Navegación principal">
        <button
          type="button"
          className={vista === 'Resumen' ? 'activo' : ''}
          aria-current={vista === 'Resumen' ? 'page' : undefined}
          onClick={() => navegar('Resumen')}
        >
          <span aria-hidden="true">📊</span>
          Resumen
        </button>

        <button
          type="button"
          className={vista === 'Registrar' ? 'activo' : ''}
          aria-current={vista === 'Registrar' ? 'page' : undefined}
          onClick={() => navegar('Registrar')}
        >
          <span aria-hidden="true">➕</span>
          Registrar
        </button>

        <button
          type="button"
          className={vista === 'Movimientos' ? 'activo' : ''}
          aria-current={vista === 'Movimientos' ? 'page' : undefined}
          onClick={() => navegar('Movimientos')}
        >
          <span aria-hidden="true">📋</span>
          Movimientos
        </button>
      </nav>
    </div>
  )
}

export default App
