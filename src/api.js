const URL = import.meta.env.VITE_API_URL

export async function obtenerGastos() {
  const res = await fetch(`${URL}/gastos`)
  if (!res.ok) throw new Error('Error al obtener gastos')
  return res.json()
}

export async function crearGasto(gasto) {
  const res = await fetch(`${URL}/gastos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(gasto),
  })
  if (!res.ok) throw new Error('Error al crear gasto')
  return res.json()
}

export async function eliminarGasto(id) {
  const res = await fetch(`${URL}/gastos/${id}`, { method: 'DELETE' })
  if (!res.ok) throw new Error('Error al eliminar gasto')
}