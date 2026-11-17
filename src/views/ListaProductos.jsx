
import { useListaProductos } from '../hooks/useProductos';
import TarjetaProducto from '../components/TarjetaProducto';
import {
  Cargando,
  ErrorCarga,
  Vacio,
} from '../components/Estados';

export default function ListaProductos() {
  const {
    cargando,
    datos,
    error,
    reintentar,
  } = useListaProductos();

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

  // Estado sin resultados
  if (!datos?.length) {
    return (
      <main className="shell-main">
        <Vacio />
      </main>
    );
  }

  // Estado con datos
  return (
    <main className="shell-main">
      <section className="vista-actual">
        <h1>Productos de prueba (DummyJSON)</h1>

        <p>
          Datos externos para demostrar el consumo de una API.
        </p>

        <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-4 g-3">
          {datos.map((producto) => (
            <div className="col" key={producto.id}>
              <TarjetaProducto producto={producto} />
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
