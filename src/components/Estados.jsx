
// Muestra un indicador mientras se cargan los datos
export function Cargando() {
  return (
    <div className="text-center py-5" role="status">
      <div
        className="spinner-border"
        aria-hidden="true"
      />
      <p className="mt-2 mb-0">Cargando productos...</p>
    </div>
  );
}

// Muestra un error y permite volver a consultar
export function ErrorCarga({ mensaje, onReintentar }) {
  return (
    <div
      className="alert alert-danger d-flex align-items-center gap-3"
      role="alert"
    >
      <span className="flex-grow-1">{mensaje}</span>

      <button
        className="btn btn-outline-danger btn-sm"
        onClick={onReintentar}
      >
        Reintentar
      </button>
    </div>
  );
}

// Se muestra cuando no hay resultados
export function Vacio({
  texto = 'No hay productos disponibles',
}) {
  return (
    <p className="text-center text-body-secondary py-5">
      {texto}
    </p>
  );
}
