import express from 'express'
import cors from 'cors'
import fs from 'fs'

const app = express()
const ARCHIVO = './gastos.json'

app.use(cors())
app.use(express.json())

const leer = () =>
  fs.existsSync(ARCHIVO) ? JSON.parse(fs.readFileSync(ARCHIVO, 'utf8')) : []
const guardar = (datos) =>
  fs.writeFileSync(ARCHIVO, JSON.stringify(datos, null, 2))

// Ver todos los gastos
app.get('/api/gastos', (req, res) => {
  res.json(leer())
})

// Agregar un gasto
app.post('/api/gastos', (req, res) => {
  const { concepto, monto } = req.body
  if (!concepto || typeof monto !== 'number') {
    return res.status(400).json({ error: 'concepto y monto son obligatorios' })
  }
  const gastos = leer()
  const nuevo = { id: Date.now(), concepto, monto, fecha: new Date().toISOString() }
  gastos.push(nuevo)
  guardar(gastos)
  res.status(201).json(nuevo)
})

// Borrar un gasto
app.delete('/api/gastos/:id', (req, res) => {
  const gastos = leer().filter(g => g.id !== Number(req.params.id))
  guardar(gastos)
  res.status(204).end()
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`API corriendo en http://localhost:${PORT}`))