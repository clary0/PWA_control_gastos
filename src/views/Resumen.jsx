
export default function Resumen() {
  // Valores iniciales de los movimientos
  const ingresos = 0
  const gastos = 0

  // Calcular el dinero disponible
  const disponible = ingresos - gastos

  // Formato de moneda mexicana
  const formatoDinero = (cantidad) => {
    return cantidad.toLocaleString('es-MX', {
      style: 'currency',
      currency: 'MXN',
    })
  }

  return (
    <main className="shell-main">
      <section className="vista-actual">
        <p className="etiqueta">TU DINERO, BAJO CONTROL</p>

        <h2>Resumen</h2>

        <p>
          Consulta el estado de tus finanzas personales.
        </p>

        {/* Tarjetas financieras */}
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

        {/* Movimientos recientes */}
        <div className="area-contenido movimientos-recientes">
          <h3>
            <i className="bi bi-clock-history me-2"></i>
            Movimientos recientes
          </h3>

          <p>
            Todavía no tienes movimientos registrados.
          </p>
        </div>
      </section>
    </main>
  )
}
