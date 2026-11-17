
import useMovimientos from '../hooks/useMovimientos';

export default function Movimientos() {
  const { movimientos, eliminar } = useMovimientos();

  // Formato de moneda mexicana
  const formatoDinero = (cantidad) => {
    return cantidad.toLocaleString('es-MX', {
      style: 'currency',
      currency: 'MXN',
    });
  };

  // Formato de fecha
  const formatoFecha = (fecha) => {
    const [anio, mes, dia] = fecha.split('-');
    return `${dia}/${mes}/${anio}`;
  };

  // Ordenar del más reciente al más antiguo
  const movimientosOrdenados = [...movimientos].sort(
    (a, b) => b.fecha.localeCompare(a.fecha)
  );

  const manejarEliminacion = (id) => {
    const confirmar = window.confirm(
      '¿Estás segura de que deseas eliminar este movimiento?'
    );

    if (confirmar) {
      eliminar(id);
    }
  };

  return (
    <main className="shell-main">
      <section className="vista-actual">
        <p className="etiqueta">HISTORIAL FINANCIERO</p>

        <h2>Mis movimientos</h2>

        <p>Consulta los ingresos y gastos que has registrado.</p>

        {movimientosOrdenados.length === 0 ? (
          <div className="area-contenido movimientos-recientes">
            <i className="bi bi-clipboard-x fs-1"></i>
            <h3>No tienes movimientos registrados</h3>
            <p>Cuando registres un ingreso o gasto aparecerá aquí.</p>
          </div>
        ) : (
          <div className="area-contenido">
            <div className="table-responsive">
              <table className="table align-middle">
                <thead>
                  <tr>
                    <th>Tipo</th>
                    <th>Concepto</th>
                    <th>Fecha</th>
                    <th>Cantidad</th>
                    <th>Acción</th>
                  </tr>
                </thead>

                <tbody>
                  {movimientosOrdenados.map((movimiento) => (
                    <tr key={movimiento.id}>
                      <td>
                        <span
                          className={
                            movimiento.tipo === 'ingreso'
                              ? 'badge bg-success'
                              : 'badge bg-danger'
                          }
                        >
                          {movimiento.tipo === 'ingreso'
                            ? 'Ingreso'
                            : 'Gasto'}
                        </span>
                      </td>

                      <td>{movimiento.concepto}</td>

                      <td>{formatoFecha(movimiento.fecha)}</td>

                      <td
                        className={
                          movimiento.tipo === 'ingreso'
                            ? 'text-success fw-bold'
                            : 'text-danger fw-bold'
                        }
                      >
                        {movimiento.tipo === 'ingreso' ? '+' : '-'}
                        {formatoDinero(movimiento.cantidad)}
                      </td>

                      <td>
                        <button
                          type="button"
                          className="btn btn-outline-danger btn-sm"
                          onClick={() => manejarEliminacion(movimiento.id)}
                          aria-label={`Eliminar ${movimiento.concepto}`}
                        >
                          <i className="bi bi-trash"></i>
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}

