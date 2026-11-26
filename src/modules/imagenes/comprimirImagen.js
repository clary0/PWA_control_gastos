// Reduce la fotografía a un máximo de 1024 píxeles
// y la convierte a formato JPEG para ocupar menos espacio.

export async function comprimirImagen(archivo, maximo = 1024) {
  const imagen = await createImageBitmap(archivo);

  const escala = Math.min(
    1,
    maximo / Math.max(imagen.width, imagen.height)
  );

  const canvas = document.createElement('canvas');

  canvas.width = Math.round(imagen.width * escala);
  canvas.height = Math.round(imagen.height * escala);

  const contexto = canvas.getContext('2d');

  contexto.drawImage(
    imagen,
    0,
    0,
    canvas.width,
    canvas.height
  );

  return new Promise((resolver, rechazar) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolver(blob);
        } else {
          rechazar(new Error('No se pudo comprimir la fotografía.'));
        }
      },
      'image/jpeg',
      0.7
    );
  });
}
