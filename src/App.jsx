
import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [movimientos, setMovimientos] = useState(() => {
    const datos = localStorage.getItem('movimientos')
    return datos ? JSON.parse(datos) : []
  })

  const [tipo, setTipo] = useState('Gasto')
  const [concepto, setConcepto] = useState('')
  const [cantidad, setCantidad] = useState('')
  const [fecha, setFecha] = useState('')
  const [filtro, setFiltro] = useState('Todos')
  const [idEditar, setIdEditar] = useState(null)

  useEffect(() => {
    localStorage.setItem('movimientos', JSON.stringify(movimientos))
  }, [movimientos])

  let ingresos = 0
  let gastos = 0

  movimientos.forEach((movimiento) => {
    if (movimiento.tipo === 'Ingreso') {
      ingresos += movimiento.cantidad
    } else {
      gastos += movimiento.cantidad
    }
  })

  const saldo = ingresos - gastos

  function guardarMovimiento(e) {
    e.preventDefault()

    if (concepto.trim() === '' || Number(cantidad) <= 0 || !fecha) {
      alert('Completa todos los datos correctamente')
      return
    }

    const nuevo = {
      id: idEditar !== null ? idEditar : Date.now(),
      tipo: tipo,
      concepto: concepto,
      cantidad: Number(cantidad),
      fecha: fecha,
    }

    if (idEditar !== null) {
      setMovimientos(movimientos.map((m) =>
        m.id === idEditar ? nuevo : m
      ))
    } else {
      setMovimientos([...movimientos, nuevo])
    }

    limpiarFormulario()
  }

  function limpiarFormulario() {
    setTipo('Gasto')
    setConcepto('')
    setCantidad('')
    setFecha('')
    setIdEditar(null)
  }

  function editarMovimiento(movimiento) {
    setIdEditar(movimiento.id)
    setTipo(movimiento.tipo)
    setConcepto(movimiento.concepto)
    setCantidad(movimiento.cantidad)
    setFecha(movimiento.fecha)
  }

  function eliminarMovimiento(id) {
    if (confirm('¿Quieres eliminar este movimiento?')) {
      setMovimientos(movimientos.filter((m) => m.id !== id))
    }
  }

  return (
    <div className="app">
      <header>
        <h1>Control de Gastos</h1>
        <p>Mis finanzas personales</p>
      </header>

      <main>
        <section className="resumen">
          <h2>Resumen</h2>
          <p>Ingresos: ${ingresos.toFixed(2)}</p>
          <p>Gastos: ${gastos.toFixed(2)}</p>
          <h3>Dinero disponible: ${saldo.toFixed(2)}</h3>
        </section>

        <section className="formulario">
          <h2>{idEditar !== null ? 'Editar movimiento' : 'Registrar movimiento'}</h2>

          <form onSubmit={guardarMovimiento}>
            <label>Tipo:</label>
            <select
              value={tipo}
              onChange={(e) => setTipo(e.target.value)}
            >
              <option value="Ingreso">Ingreso</option>
              <option value="Gasto">Gasto</option>
            </select>

            <label>Concepto:</label>
            <input
              type="text"
              value={concepto}
              onChange={(e) => setConcepto(e.target.value)}
              placeholder="Ej. Alimentación"
              required
            />

            <label>Cantidad:</label>
            <input
              type="number"
              min="0.01"
              step="0.01"
              value={cantidad}
              onChange={(e) => setCantidad(e.target.value)}
              placeholder="Ej. 500"
              required
            />

            <label>Fecha:</label>
            <input
              type="date"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
              required
            />

            <button type="submit">
              {idEditar !== null ? 'Guardar cambios' : 'Guardar'}
            </button>

            {idEditar !== null && (
              <button type="button" onClick={limpiarFormulario}>
                Cancelar
              </button>
            )}
          </form>
        </section>

        <section className="historial">
          <h2>Historial de movimientos</h2>

          <label>Filtrar por tipo:</label>
          <select
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
          >
            <option value="Todos">Todos</option>
            <option value="Ingreso">Ingresos</option>
            <option value="Gasto">Gastos</option>
          </select>

          {movimientos.length === 0 ? (
            <p>Aún no hay movimientos registrados.</p>
          ) : (
            <ul>
              {movimientos
                .filter((m) => filtro === 'Todos' || m.tipo === filtro)
                .map((m) => (
                  <li key={m.id}>
                    <strong>{m.concepto}</strong>
                    <p>Tipo: {m.tipo}</p>
                    <p>Cantidad: ${m.cantidad.toFixed(2)}</p>
                    <p>Fecha: {m.fecha}</p>

                    <button onClick={() => editarMovimiento(m)}>
                      Editar
                    </button>

                    <button onClick={() => eliminarMovimiento(m.id)}>
                      Eliminar
                    </button>
                  </li>
                ))}
            </ul>
          )}
        </section>
      </main>

      <footer>
        <p>Proyecto escolar - Control de Gastos Personales</p>
      </footer>
    </div>
  )
}

export default App
