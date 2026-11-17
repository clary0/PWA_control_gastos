
import useMovimientos from '../hooks/useMovimientos';

export default function Resumen() {
  const { movimientos, ingresos, gastos, disponible } = useMovimientos();

  // Formato de moneda mexicana
  const formatoDinero = (cantidad) => {
    return cantidad.toLocaleString('es-MX', {
      style: 'currency',
      currency: 'MXN',
    });
  };

  // Obtener los últimos cinco movimientos
  const recientes = [...movimientos]
    .sort((a, b) => b.fecha.localeCompare(a.fecha))
    .slice(0, 5);

  // Convertir la fecha al formato día/mes/año
  const formatoFecha = (fecha) => {
    const [anio, mes, dia] = fecha.split('-');
    return `${dia}/${mes}/${anio}`;
  };

  return (
    <main className="shell-main">
      <section className="vista-actual">
        <p className="etiqueta">TU DINERO, BAJO CONTROL</p>
        <h2>Resumen</h2>
        <p>Consulta el estado de tus finanzas personales.</p>

        <div className="tarjetas-resumen">
          <article className="tarjeta-financiera">
            <i className="bi bi-trending-up icono-ingreso"></i>
            <h3>Ingresos</h3>
            <p>{formatoDinero(ingresos)}</p>
          </article>

          <article className="tarjeta-financiera">
            <i className="bi bi-trending-down icono-gasto"></i>
            <h3>Gastos</h3>
            <p>{formatoDinero(gastos)}</p>
          </article>

          <article className="tarjeta-financiera disponible">
            <i className="bi bi-wallet2"></i>
            <h3>Dinero disponible</h3>
            <p>{formatoDinero(disponible)}</p>
            <small>Ingresos menos gastos</small>
          </article>
        </div>

        <div className="area-contenido movimientos-recientes">
          <h3>
            <i className="bi bi-clock-history me-2"></i>
            Movimientos recientes
          </h3>

          {recientes.length === 0 ? (
            <p>Todavía no tienes movimientos registrados.</p>
          ) : (
            <div className="table-responsive">
              <table className="table align-middle">
                <thead>
                  <tr>
                    <th>Tipo</th>
                    <th>Concepto</th>
                    <th>Fecha</th>
                    <th>Cantidad</th>
                  </tr>
                </thead>

                <tbody>
                  {recientes.map((movimiento) => (
                    <tr key={movimiento.id}>
                      <td>
                        <span className={
                          movimiento.tipo === 'ingreso'
                            ? 'badge bg-success'
                            : 'badge bg-danger'
                        }>
                          {movimiento.tipo === 'ingreso' ? 'Ingreso' : 'Gasto'}
                        </span>
                      </td>

                      <td>{movimiento.concepto}</td>

                      <td>{formatoFecha(movimiento.fecha)}</td>

                      <td className={
                        movimiento.tipo === 'ingreso'
                          ? 'text-success fw-bold'
                          : 'text-danger fw-bold'
                      }>
                        {movimiento.tipo === 'ingreso' ? '+' : '-'}
                        {formatoDinero(movimiento.cantidad)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
