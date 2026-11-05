import { useEffect, useState } from 'react'
import './App.css'

// API publicada en Render (se puede cambiar con VITE_API_URL en .env)
const BASE = import.meta.env.VITE_API_URL || 'https://pwa-control-gastos.onrender.com'
const API = BASE + '/api/v2'

const CATEGORIAS = ['comida', 'transporte', 'escuela', 'entretenimiento', 'salud', 'servicios', 'otros']
const hoy = () => new Date().toISOString().slice(0, 10)
const dinero = (n) => Number(n).toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })
const vacio = () => ({ descripcion: '', monto: '', categoria: 'comida', fecha: hoy() })

function App() {
  const [gastos, setGastos] = useState([])
  const [resumen, setResumen] = useState(null)
  const [categoria, setCategoria] = useState('')
  const [orden, setOrden] = useState('reciente')
  const [desde, setDesde] = useState('')
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')
  const [enLinea, setEnLinea] = useState(navigator.onLine)
  const [modal, setModal] = useState(false)
  const [editando, setEditando] = useState(null)
  const [form, setForm] = useState(vacio())

  useEffect(() => {
    const on = () => setEnLinea(true)
    const off = () => setEnLinea(false)
    window.addEventListener('online', on)
    window.addEventListener('offline', off)
    return () => {
      window.removeEventListener('online', on)
      window.removeEventListener('offline', off)
    }
  }, [])

  async function cargar() {
    try {
      setError('')
      const q = categoria ? `?categoria=${categoria}&limit=200` : '?limit=200'
      const [g, r] = await Promise.all([
        fetch(`${API}/gastos/${q}`).then((x) => x.json()),
        fetch(`${API}/resumen/`).then((x) => x.json()),
      ])
      setGastos(g.results || [])
      setResumen(r)
    } catch {
      setError('No se pudo conectar con la API. Si es la primera visita, espera un minuto y recarga.')
    } finally {
      setCargando(false)
    }
  }

  useEffect(() => {
    cargar()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoria])

  const visibles = gastos
    .filter((g) => !desde || g.fecha >= desde)
    .sort((a, b) => (orden === 'monto' ? b.monto - a.monto : b.fecha.localeCompare(a.fecha) || b.id - a.id))

  function abrirNuevo() {
    setEditando(null)
    setForm(vacio())
    setError('')
    setModal(true)
  }
  function abrirEditar(g) {
    setEditando(g.id)
    setForm({ descripcion: g.descripcion, monto: String(g.monto), categoria: g.categoria, fecha: g.fecha })
    setError('')
    setModal(true)
  }

  async function guardar(e) {
    e.preventDefault()
    setError('')
    const url = editando ? `${API}/gastos/${editando}/` : `${API}/gastos/`
    const res = await fetch(url, {
      method: editando ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, monto: Number(form.monto) }),
    })
    if (!res.ok) {
      const err = await res.json()
      setError(Object.values(err).flat().join(' '))
      return
    }
    setModal(false)
    cargar()
  }

  async function eliminar(id) {
    if (!window.confirm('¿Eliminar este gasto?')) return
    await fetch(`${API}/gastos/${id}/`, { method: 'DELETE' })
    cargar()
  }

  return (
    <div className="app">
      <header className="top">
        <div>
          <h1>Mis gastos</h1>
          <p>
            {resumen
              ? `${resumen.total_gastos} registrados · Total ${dinero(resumen.monto_total)}`
              : 'Cargando…'}
          </p>
        </div>
        <span className={enLinea ? 'badge ok' : 'badge off'}>{enLinea ? 'En línea' : 'Sin conexión'}</span>
      </header>

      <main className="contenido">
        <section className="filtros">
          <label>
            Categoría
            <select value={categoria} onChange={(e) => setCategoria(e.target.value)}>
              <option value="">Todas</option>
              {CATEGORIAS.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </label>
          <label>
            Orden
            <select value={orden} onChange={(e) => setOrden(e.target.value)}>
              <option value="reciente">Más recientes</option>
              <option value="monto">Mayor monto</option>
            </select>
          </label>
          <label>
            Gastos desde
            <input type="date" value={desde} onChange={(e) => setDesde(e.target.value)} />
          </label>
        </section>

        {error && !modal && <p className="error">{error}</p>}

        {cargando ? (
          <p className="aviso">Cargando… la primera vez puede tardar hasta un minuto.</p>
        ) : visibles.length === 0 ? (
          <p className="aviso">No hay gastos registrados.</p>
        ) : (
          visibles.map((g) => (
            <article className="tarjeta" key={g.id}>
              <div className="fila">
                <h2>{g.descripcion}</h2>
                <span className="monto">{dinero(g.monto)}</span>
              </div>
              <p className="meta">
                {g.categoria} · Fecha {g.fecha}
              </p>
              <details>
                <summary>Ver detalles</summary>
                <p className="detalle">
                  Gasto #{g.id} ·{' '}
                  <a href={g.url} target="_blank" rel="noreferrer">
                    ver en la API
                  </a>
                </p>
              </details>
              <div className="acciones">
                <button className="btn-borde" onClick={() => abrirEditar(g)}>
                  Editar
                </button>
                <button className="btn-peligro" onClick={() => eliminar(g.id)}>
                  Eliminar
                </button>
              </div>
            </article>
          ))
        )}

        <div className="flotante">
          <button className="btn-principal" onClick={abrirNuevo}>
            Nuevo gasto
          </button>
        </div>
      </main>

      {modal && (
        <div className="fondo" onClick={() => setModal(false)}>
          <form className="modal" onClick={(e) => e.stopPropagation()} onSubmit={guardar}>
            <h2>{editando ? 'Editar gasto' : 'Nuevo gasto'}</h2>
            <label>
              Descripción
              <input
                value={form.descripcion}
                onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
                required
              />
            </label>
            <label>
              Monto
              <input
                type="number"
                min="0.01"
                step="0.01"
                value={form.monto}
                onChange={(e) => setForm({ ...form, monto: e.target.value })}
                required
              />
            </label>
            <label>
              Categoría
              <select value={form.categoria} onChange={(e) => setForm({ ...form, categoria: e.target.value })}>
                {CATEGORIAS.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </label>
            <label>
              Fecha
              <input
                type="date"
                value={form.fecha}
                onChange={(e) => setForm({ ...form, fecha: e.target.value })}
                required
              />
            </label>
            {error && <p className="error">{error}</p>}
            <div className="acciones">
              <button type="submit" className="btn-principal">
                Guardar
              </button>
              <button type="button" className="btn-borde" onClick={() => setModal(false)}>
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}

export default App
