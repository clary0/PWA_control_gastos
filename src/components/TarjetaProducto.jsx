
export default function TarjetaProducto({ producto }) {
  return (
    <article className="card h-100">
      <img
        src={producto.imagen}
        alt={producto.titulo}
        className="card-img-top"
        loading="lazy"
        style={{
          height: '180px',
          objectFit: 'contain',
          padding: '12px',
        }}
      />

      <div className="card-body">
        <h2 className="h6 mb-2">
          {producto.titulo}
        </h2>

        <p className="small text-body-secondary">
          {producto.descripcion}
        </p>

        <p className="mb-1">
          <strong>Precio:</strong> ${producto.precio}
        </p>

        <p className="small text-body-secondary mb-0">
          {producto.categoria}
        </p>
      </div>
    </article>
  );
}
