
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
      <main className="shell-main shell-main--productos">
        <Cargando />
      </main>
    );
  }

  // Estado de error
  if (error) {
    return (
      <main className="shell-main shell-main--productos">
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
      <main className="shell-main shell-main--productos">
        <Vacio />
      </main>
    );
  }

  // Estado con datos
  return (
    <main className="shell-main shell-main--productos">
      <section className="vista-actual vista-actual--productos">
        <h1>Productos</h1>

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
