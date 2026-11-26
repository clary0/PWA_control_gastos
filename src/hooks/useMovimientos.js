
import { useCallback, useEffect, useState } from 'react';

import {
  escucharMovimientos,
  registrarMovimiento,
  eliminarMovimiento,
} from '../repositories/movimientosRepository';

import { useSesion } from '../sesion/useSesion';

export default function useMovimientos() {
  const { usuario } = useSesion();

  // Guardar los movimientos junto con el UID de su propietario
  const [estadoMovimientos, setEstadoMovimientos] = useState({
    uid: null,
    datos: [],
  });

  // Escuchar los movimientos del usuario en Firestore
  useEffect(() => {
    if (!usuario?.uid) return;

    const uid = usuario.uid;

    const dejarDeEscuchar = escucharMovimientos(uid, (lista) => {
      setEstadoMovimientos({
        uid,
        datos: lista,
      });
    });

    return dejarDeEscuchar;
  }, [usuario?.uid]);

  // Mostrar únicamente los movimientos del usuario actual
  const movimientos =
    estadoMovimientos.uid === (usuario?.uid ?? null)
      ? estadoMovimientos.datos
      : [];

  // Registrar un nuevo movimiento
  const agregar = useCallback(
    (movimiento) => {
      if (!usuario) return;

      registrarMovimiento(usuario, movimiento);
    },
    [usuario]
  );

  // Eliminar un movimiento
  const eliminar = useCallback((id) => {
    eliminarMovimiento(id);
  }, []);

  // Calcular ingresos
  const ingresos = movimientos
    .filter((movimiento) => movimiento.tipo === 'ingreso')
    .reduce((total, movimiento) => total + movimiento.cantidad, 0);

  // Calcular gastos
  const gastos = movimientos
    .filter((movimiento) => movimiento.tipo === 'gasto')
    .reduce((total, movimiento) => total + movimiento.cantidad, 0);

  // Calcular dinero disponible
  const disponible = ingresos - gastos;

  return {
    movimientos,
    ingresos,
    gastos,
    disponible,
    agregar,
    eliminar,
  };
}
