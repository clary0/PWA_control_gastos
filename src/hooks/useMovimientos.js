import { useCallback, useState } from 'react';

import {
  listarMovimientos,
  registrarMovimiento,
  eliminarMovimiento,
} from '../repositories/movimientosRepository';

export default function useMovimientos() {
  const [movimientos, setMovimientos] = useState(() => listarMovimientos());

  // Registrar un nuevo movimiento
  const agregar = useCallback((movimiento) => {
    const nuevo = registrarMovimiento(movimiento);

    setMovimientos((actuales) => [...actuales, nuevo]);
  }, []);

  // Eliminar un movimiento
  const eliminar = useCallback((id) => {
    eliminarMovimiento(id);

    setMovimientos(listarMovimientos());
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
