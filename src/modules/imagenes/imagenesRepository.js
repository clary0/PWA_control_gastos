import { doc, updateDoc } from 'firebase/firestore';
import { CLOUD_NAME, UPLOAD_PRESET, imagenesActivas } from '../../config/cloudinary.js';
import { db } from '../../config/firebase.js';
import { dbLocal } from '../../db/local.js';
import { comprimirImagen } from './comprimirImagen.js';

// Evita ejecutar dos sincronizaciones al mismo tiempo.
let sincronizando = false;

// Sube una fotografía a Cloudinary.
async function subirACloudinary(blob) {
  const datos = new FormData();

  datos.append('file', blob);
  datos.append('upload_preset', UPLOAD_PRESET);

  const url = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

  const respuesta = await fetch(url, {
    method: 'POST',
    body: datos,
  });

  if (!respuesta.ok) {
    throw new Error(`Cloudinary respondió ${respuesta.status}`);
  }

  const resultado = await respuesta.json();

  if (!resultado.secure_url) {
    throw new Error('Cloudinary no devolvió una URL segura.');
  }

  return resultado.secure_url;
}

// Guarda una fotografía para sincronizarla posteriormente.
export async function guardarImagenPendiente(movimientoId, archivo) {
  if (!movimientoId || !archivo) {
    throw new Error('Se necesita el ID del movimiento y una fotografía.');
  }

  const blob = await comprimirImagen(archivo);

  if (!blob) {
    throw new Error('No se pudo comprimir la fotografía.');
  }

  const local = await dbLocal;

  await local.put('imagenesPendientes', {
    id: movimientoId,
    blob,
    fecha: Date.now(),
  });

  // Si hay Internet, intenta subirla inmediatamente.
  await sincronizarImagenes();
}

// Sube las fotografías pendientes y actualiza Firestore.
export async function sincronizarImagenes() {
  if (sincronizando || !navigator.onLine || !imagenesActivas) {
    return;
  }

  sincronizando = true;

  try {
    const local = await dbLocal;
    const pendientes = await local.getAll('imagenesPendientes');

    for (const pendiente of pendientes) {
      try {
        // Si ya existe una URL guardada, evita subir otra vez la fotografía.
        let imagenUrl = pendiente.imagenUrl;

        if (!imagenUrl) {
          imagenUrl = await subirACloudinary(pendiente.blob);

          // Conserva la URL por si falla la actualización de Firestore.
          await local.put('imagenesPendientes', {
            ...pendiente,
            imagenUrl,
          });
        }

        // Actualiza el movimiento correspondiente en Firestore.
        await updateDoc(doc(db, 'movimientos', pendiente.id), {
          imagen: 'subida',
          imagenUrl,
        });

        // Elimina la fotografía de la cola cuando todo salió bien.
        await local.delete('imagenesPendientes', pendiente.id);

        console.log('Fotografía sincronizada:', pendiente.id);
      } catch (error) {
        console.error(
          'No se pudo sincronizar la fotografía:',
          pendiente.id,
          error
        );
      }
    }
  } catch (error) {
    console.error('Error al consultar las fotografías pendientes:', error);
  } finally {
    sincronizando = false;
  }
}

// Inicia la sincronización al abrir la aplicación
// y cuando vuelve la conexión a Internet.
export function iniciarSincronizacionImagenes() {
  if (!imagenesActivas) return;

  sincronizarImagenes();

  window.addEventListener('online', sincronizarImagenes);
}
