
import { useLayoutEffect } from 'react'
import { Routes, Route, useNavigate, useLocation } from 'react-router'
import AppHeader from './components/shell/AppHeader.jsx'
import useOnlineStatus from './hooks/useOnlineStatus.js'
import NoEncontrado from './views/noencontrado.jsx'
import ViewErrorBoundary from './components/shell/ViewErrorBoundary.jsx'
import Resumen from './views/Resumen.jsx'

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
    </nav>
  )
}

function PaginaNoEncontrada() {
  const navigate = useNavigate()

  return (
    <main className="shell-main">
      <NoEncontrado volverInicio={() => navigate('/')} />
    </main>
  )
}

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
            <main className="shell-main">
              <section className="vista-actual">
                <h2>Registrar movimiento</h2>
                <p>Próximamente podrás registrar ingresos y gastos.</p>
              </section>
            </main>
          }
        />

        <Route
          path="/movimientos"
          element={
            <main className="shell-main">
              <section className="vista-actual">
                <h2>Movimientos</h2>
                <p>Aquí aparecerán tus ingresos y gastos registrados.</p>
              </section>
            </main>
          }
        />

        <Route path="*" element={<PaginaNoEncontrada />} />
      </Routes>

      <NavegacionInferior />
    </div>
  )
}

export default App
