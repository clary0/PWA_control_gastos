import { useEffect, useState } from 'react'
import { obtenerGastos, crearGasto, eliminarGasto } from './api'

function App() {
  const [gastos, setGastos] = useState([])
  const [concepto, setConcepto] = useState('')
  const [monto, setMonto] = useState('')

  useEffect(() => {
    obtenerGastos().then(setGastos).catch(console.error)
  }, [])

  async function agregar(e) {
    e.preventDefault()
    const nuevo = await crearGasto({ concepto, monto: Number(monto) })
    setGastos([...gastos, nuevo])
    setConcepto('')
    setMonto('')
  }

  async function borrar(id) {
    await eliminarGasto(id)
    setGastos(gastos.filter(g => g.id !== id))
  }

  const total = gastos.reduce((suma, g) => suma + g.monto, 0)

  return (
    <main>
      <h1>Control de gastos</h1>
      <form onSubmit={agregar}>
        <input value={concepto} onChange={e => setConcepto(e.target.value)} placeholder="Concepto" required />
        <input type="number" value={monto} onChange={e => setMonto(e.target.value)} placeholder="Monto" required />
        <button>Agregar</button>
      </form>
      <ul>
        {gastos.map(g => (
          <li key={g.id}>
            {g.concepto} - ${g.monto} <button onClick={() => borrar(g.id)}>X</button>
          </li>
        ))}
      </ul>
      <h2>Total: ${total}</h2>
    </main>
  )
}

export default App