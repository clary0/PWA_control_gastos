
import { openDB } from 'idb'

// Base de datos local de Control de Gastos.
export const dbLocal = openDB('control-gastos', 3, {
  upgrade(db) {
    // Almacén para los productos de DummyJSON.
    if (!db.objectStoreNames.contains('productos')) {
      db.createObjectStore('productos', { keyPath: 'id' })
    }

    // Almacén para las fotografías de los movimientos.
    if (!db.objectStoreNames.contains('fotografias')) {
      db.createObjectStore('fotografias', { keyPath: 'id' })
    }

    // Almacén para las fotografías pendientes de subir a Cloudinary.
    if (!db.objectStoreNames.contains('imagenesPendientes')) {
      db.createObjectStore('imagenesPendientes', { keyPath: 'id' })
    }
  },
})
