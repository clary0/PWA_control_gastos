import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  where,
} from 'firebase/firestore';

import { db } from '../config/firebase.js';

// Colección de movimientos en Firestore.
const movimientos = collection(db, 'movimientos');

// Escuchar los movimientos del usuario autenticado.
export function escucharMovimientos(uid, alCambiar) {
  const consulta = query(
    movimientos,
    where('uid', '==', uid)
  );

  return onSnapshot(
    consulta,
    { includeMetadataChanges: true },
    (resultado) => {
      const lista = resultado.docs.map((documento) => ({
        id: documento.id,
        ...documento.data({ serverTimestamps: 'estimate' }),
        pendiente: documento.metadata.hasPendingWrites,
      }));

      alCambiar(lista);
    },
    (error) => {
      console.error(
        'No se pudieron consultar los movimientos:',
        error.code
      );
    }
  );
}

// Registrar un nuevo movimiento.
export function registrarMovimiento(usuario, movimiento) {
  const referencia = doc(movimientos);

  setDoc(referencia, {
    uid: usuario.uid,
    tipo: movimiento.tipo,
    concepto: movimiento.concepto.trim(),
    cantidad: Number(movimiento.cantidad),
    fecha: movimiento.fecha,
    conImagen: Boolean(movimiento.conImagen),
    imagen: movimiento.conImagen ? 'pendiente' : null,
    creadoEn: serverTimestamp(),
  }).catch((error) => {
    console.error('No se pudo guardar el movimiento:', error.code);
  });

  return referencia.id;
}

// Eliminar un movimiento.
export function eliminarMovimiento(id) {
  deleteDoc(doc(movimientos, id)).catch((error) => {
    console.error('No se pudo eliminar el movimiento:', error.code);
  });
}
