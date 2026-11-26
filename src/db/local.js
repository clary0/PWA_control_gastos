import { openDB } from 'idb'

// Base de datos local de Control de Gastos.
// Es independiente de la base de datos de Firestore.
export const dbLocal = openDB('control-gastos', 1, {
  upgrade(db) {
    // Almacén para guardar los productos consultados desde la API.
    // La propiedad id será la llave de cada producto.
    db.createObjectStore('productos', { keyPath: 'id' })
  },
})