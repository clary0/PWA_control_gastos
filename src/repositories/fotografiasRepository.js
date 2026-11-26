
import { dbLocal } from '../db/local.js';

// Guardar una fotografía relacionada con un movimiento.
export async function guardarFotografia(id, archivo) {
  if (!id || !archivo) {
    throw new Error('Se necesita un ID y una fotografía.');
  }

  const db = await dbLocal;

  await db.put('fotografias', {
    id,
    archivo,
    tipo: archivo.type,
    nombre: archivo.name || 'fotografia',
    creadoEn: new Date().toISOString(),
  });
}

// Consultar la fotografía de un movimiento.
export async function obtenerFotografia(id) {
  if (!id) return null;

  const db = await dbLocal;

  return db.get('fotografias', id);
}

// Eliminar la fotografía de un movimiento.
export async function eliminarFotografia(id) {
  if (!id) return;

  const db = await dbLocal;

  await db.delete('fotografias', id);
}
