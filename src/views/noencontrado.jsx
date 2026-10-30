
export default function NoEncontrado({ volverInicio }) {
  return (
    <section className="vista-actual pagina-no-encontrada">
      <p className="etiqueta">CONTROL DE GASTOS PERSONALES</p>

      <div className="area-contenido">
        <h2>¡Ups! Esta página no existe</h2>
        <p>
          La dirección que ingresaste no es válida
          o la página que buscas no está disponible.
        </p>

        <button type="button" onClick={volverInicio}>
          Volver al inicio
        </button>
      </div>
    </section>
  )
}
