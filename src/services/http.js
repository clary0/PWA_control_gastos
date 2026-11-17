
// Error personalizado para identificar problemas HTTP
export class ErrorHttp extends Error {
  constructor(mensaje, status = 0) {
    super(mensaje);
    this.name = 'ErrorHttp';
    this.status = status;
  }
}

// Función para realizar peticiones y obtener JSON
export async function getJSON(url, { signal } = {}) {
  let res;

  try {
    res = await fetch(url, {
      signal,
      headers: {
        Accept: 'application/json',
      },
    });
  } catch (e) {
    if (e.name === 'AbortError') throw e;

    throw new ErrorHttp(
      navigator.onLine
        ? 'No se pudo conectar con la API'
        : 'Sin conexión a internet'
    );
  }

  if (!res.ok) {
    throw new ErrorHttp(
      `La API respondió ${res.status}`,
      res.status
    );
  }

  return res.json();
}
