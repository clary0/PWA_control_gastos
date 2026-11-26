
import { useLayoutEffect } from 'react'
import { Routes, Route, useNavigate, useLocation } from 'react-router'

import AppHeader from './components/shell/AppHeader.jsx'
import useOnlineStatus from './hooks/useOnlineStatus.js'
import NoEncontrado from './views/noencontrado.jsx'
import ViewErrorBoundary from './components/shell/ViewErrorBoundary.jsx'

import Resumen from './views/Resumen.jsx'
import ListaProductos from './views/ListaProductos.jsx'
import DetalleProducto from './views/DetalleProducto.jsx'
import Registrar from './views/Registrar.jsx'
import Movimientos from './views/Movimientos.jsx'
import Perfil from './views/Perfil.jsx'

import AvisoActualizacion from './components/AvisoActualizacion.jsx'

// Navegación inferior
function NavegacionInferior() {
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <nav className="shell-nav" aria-label="Navegación principal">
      <button
        type="button"
        className={location.pathname === '/' ? 'activo' : ''}
        aria-current={location.pathname === '/' ? 'page' : undefined}
        onClick={() => navigate('/')}
      >
        <span aria-hidden="true">📊</span>
        Resumen
      </button>

      <button
        type="button"
        className={location.pathname === '/registrar' ? 'activo' : ''}
        aria-current={location.pathname === '/registrar' ? 'page' : undefined}
        onClick={() => navigate('/registrar')}
      >
        <span aria-hidden="true">➕</span>
        Registrar
      </button>

      <button
        type="button"
        className={location.pathname === '/movimientos' ? 'activo' : ''}
        aria-current={location.pathname === '/movimientos' ? 'page' : undefined}
        onClick={() => navigate('/movimientos')}
      >
        <span aria-hidden="true">📋</span>
        Movimientos
      </button>

      <button
        type="button"
        className={location.pathname === '/perfil' ? 'activo' : ''}
        aria-current={location.pathname === '/perfil' ? 'page' : undefined}
        onClick={() => navigate('/perfil')}
      >
        <span aria-hidden="true">
          <i className="bi bi-person-circle"></i>
        </span>
        Perfil
      </button>
    </nav>
  )
}

// Página no encontrada
function PaginaNoEncontrada() {
  const navigate = useNavigate()

  return (
    <main className="shell-main">
      <NoEncontrado volverInicio={() => navigate('/')} />
    </main>
  )
}

// Aplicación principal
function App() {
  const enLinea = useOnlineStatus()

  useLayoutEffect(() => {
    document.getElementById('pre-shell')?.remove()
  }, [])

  return (
    <div className="app-shell">
      <AppHeader enLinea={enLinea} />

      {!enLinea && (
        <div className="aviso-conexion" role="status">
          No tienes conexión de red. Algunas funciones podrían no estar
          disponibles.
        </div>
      )}

      {/* Rutas de la aplicación */}
      <Routes>
        <Route
          path="/"
          element={
            <ViewErrorBoundary>
              <Resumen />
            </ViewErrorBoundary>
          }
        />

        <Route
          path="/registrar"
          element={
            <ViewErrorBoundary>
              <Registrar />
            </ViewErrorBoundary>
          }
        />

        <Route
          path="/movimientos"
          element={
            <ViewErrorBoundary>
              <Movimientos />
            </ViewErrorBoundary>
          }
        />

        <Route
          path="/perfil"
          element={
            <ViewErrorBoundary>
              <Perfil />
            </ViewErrorBoundary>
          }
        />

        <Route
          path="/productos"
          element={
            <ViewErrorBoundary>
              <ListaProductos />
            </ViewErrorBoundary>
          }
        />

        <Route
          path="/productos/:id"
          element={
            <ViewErrorBoundary>
              <DetalleProducto />
            </ViewErrorBoundary>
          }
        />

        <Route
          path="*"
          element={<PaginaNoEncontrada />}
        />
      </Routes>

      {/* Navegación inferior */}
      <NavegacionInferior />

      {/* Aviso de actualización de la PWA */}
      <AvisoActualizacion />
    </div>
  )
}

export default App
