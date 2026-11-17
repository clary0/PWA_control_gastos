
import { useEffect, useState } from 'react';

// Hook genérico para controlar las consultas
export function useConsulta(clave, consultar) {
  const [intento, setIntento] = useState(0);

  const id = `${clave}#${intento}`;

  const [r, setR] = useState({});

  useEffect(() => {
    if (!clave) return;

    const c = new AbortController();

    consultar(c.signal)
      .then((datos) => setR({ id, datos }))
      .catch((e) => {
        if (e.name !== 'AbortError') {
          setR({ id, error: e });
        }
      });

    return () => c.abort();

  }, [clave, id, consultar]);

  const listo = r.id === id;

  return {
    datos: listo ? r.datos : undefined,
    error: listo ? r.error : undefined,
    cargando: Boolean(clave) && !listo,
    reintentar: () => setIntento((n) => n + 1),
  };
}
