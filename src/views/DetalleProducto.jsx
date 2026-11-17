
import { useParams, Link } from 'react-router';
import { useProducto } from '../hooks/useProductos';
import {
  Cargando,
  ErrorCarga,
  Vacio,
} from '../components/Estados';

export default function DetalleProducto() {
  const { id } = useParams();

  const {
    cargando,
    datos: producto,
    error,
    reintentar,
  } = useProducto(id);

  // Estado de carga
  if (cargando) {
    return (
      <main className="shell-main">
        <Cargando />
      </main>
    );
  }

  // Estado de error
  if (error) {
    return (
      <main className="shell-main">
        <ErrorCarga
          mensaje={error.message}
          onReintentar={reintentar}
        />
      </main>
    );
  }

  // Producto inexistente
  if (!producto) {
    return (
      <main className="shell-main">
        <Vacio texto="Ese producto no existe." />
      </main>
    );
  }

  // Producto encontrado
  return (
    <main className="shell-main">
      <section className="vista-actual">
        <h1>{producto.titulo}</h1>

        {producto.imagen && (
          <img
            src={producto.imagen}
            alt={producto.titulo}
            style={{
              width: '220px',
              height: '220px',
              objectFit: 'contain',
            }}
          />
        )}

        <p>{producto.descripcion}</p>

        <p>
          <strong>Precio:</strong> ${producto.precio}
        </p>

        <p>
          <strong>Categoría:</strong> {producto.categoria}
        </p>

        <p>
          <strong>Marca:</strong> {producto.marca}
        </p>

        <Link to="/productos" className="btn btn-outline-success">
          Volver a productos
        </Link>
      </section>
    </main>
  );
}
