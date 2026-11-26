
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

  // Obtener los productos
  const productos = datos?.productos ?? [];

  // Estado sin resultados
  if (!productos.length) {
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

        {/* Aviso cuando los datos vienen de IndexedDB */}
        {datos.origen === 'cache' && (
          <div className="alert alert-info" role="alert">
            Datos guardados: estás consultando la información
            almacenada en este dispositivo.
          </div>
        )}

        <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-4 g-3">
          {productos.map((producto) => (
            <div className="col" key={producto.id}>
              <TarjetaProducto producto={producto} />
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
