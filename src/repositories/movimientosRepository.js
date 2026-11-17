
const CLAVE = 'control-gastos-movimientos';

// Obtener todos los movimientos guardados
export function listarMovimientos() {
  try {
    const datos = localStorage.getItem(CLAVE);
    return datos ? JSON.parse(datos) : [];
  } catch (error) {
    console.error('Error al consultar movimientos:', error);
    return [];
  }
}

// Guardar la lista de movimientos
function guardarMovimientos(movimientos) {
  localStorage.setItem(CLAVE, JSON.stringify(movimientos));
}

// Registrar un nuevo movimiento
export function registrarMovimiento(movimiento) {
  const movimientos = listarMovimientos();

  const nuevoMovimiento = {
    id: crypto.randomUUID(),
    tipo: movimiento.tipo,
    concepto: movimiento.concepto.trim(),
    cantidad: Number(movimiento.cantidad),
    fecha: movimiento.fecha,
  };

  movimientos.push(nuevoMovimiento);
  guardarMovimientos(movimientos);

  return nuevoMovimiento;
}

// Eliminar un movimiento por su ID
export function eliminarMovimiento(id) {
  const movimientos = listarMovimientos();

  const actualizados = movimientos.filter(
    (movimiento) => movimiento.id !== id
  );

  guardarMovimientos(actualizados);

  return actualizados;
}

