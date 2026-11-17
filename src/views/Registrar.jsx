
import { useState } from 'react';
import { useNavigate } from 'react-router';
import useMovimientos from '../hooks/useMovimientos';
import { useListaProductos } from '../hooks/useProductos';

export default function Registrar() {
  const navigate = useNavigate();
  const { agregar } = useMovimientos();

  // Consultar productos de DummyJSON
  const {
    datos: productos,
    cargando,
    error,
    reintentar,
  } = useListaProductos();

  const obtenerFechaActual = () => {
    const fecha = new Date();
    const anio = fecha.getFullYear();
    const mes = String(fecha.getMonth() + 1).padStart(2, '0');
    const dia = String(fecha.getDate()).padStart(2, '0');

    return `${anio}-${mes}-${dia}`;
  };

  const [tipo, setTipo] = useState('ingreso');
  const [concepto, setConcepto] = useState('');
  const [cantidad, setCantidad] = useState('');
  const [fecha, setFecha] = useState(obtenerFechaActual());
  const [mensaje, setMensaje] = useState('');
  const [productoSeleccionado, setProductoSeleccionado] = useState('');

  // Seleccionar producto de la API
  const manejarProducto = (e) => {
    const id = e.target.value;
    setProductoSeleccionado(id);

    const producto = productos?.find(
      (p) => p.id === id
    );

    if (producto) {
      setConcepto(producto.titulo);
      setCantidad(String(producto.precio));
    } else {
      setConcepto('');
      setCantidad('');
    }
  };

  const manejarEnvio = (e) => {
    e.preventDefault();

    if (
      !concepto.trim() ||
      !cantidad ||
      Number(cantidad) <= 0 ||
      !Number.isFinite(Number(cantidad)) ||
      !fecha
    ) {
      setMensaje('Completa todos los campos con información válida.');
      return;
    }

    agregar({
      tipo,
      concepto: concepto.trim(),
      cantidad: Number(cantidad),
      fecha,
    });

    setMensaje('');
    navigate('/movimientos');
  };

  const manejarTipo = (e) => {
    const nuevoTipo = e.target.value;

    setTipo(nuevoTipo);
    setProductoSeleccionado('');
    setConcepto('');
    setCantidad('');
    setMensaje('');
  };

  return (
    <main className="shell-main">
      <section className="vista-actual">
        <p className="etiqueta">CONTROL DE TUS FINANZAS</p>

        <h2>Registrar movimiento</h2>

        <p>Ingresa los datos del movimiento que deseas guardar.</p>

        <form onSubmit={manejarEnvio}>
          <div className="mb-3">
            <label htmlFor="tipo" className="form-label">
              Tipo de movimiento
            </label>

            <select
              id="tipo"
              className="form-select"
              value={tipo}
              onChange={manejarTipo}
            >
              <option value="ingreso">Ingreso</option>
              <option value="gasto">Gasto</option>
            </select>
          </div>

          {tipo === 'gasto' && (
            <div className="mb-3">
              <label htmlFor="producto" className="form-label">
                Seleccionar producto
              </label>

              {cargando && (
                <p className="text-secondary">
                  Cargando productos...
                </p>
              )}

              {error && (
                <div className="alert alert-warning" role="alert">
                  No se pudieron cargar los productos.
                  <button
                    type="button"
                    className="btn btn-link"
                    onClick={reintentar}
                  >
                    Intentar nuevamente
                  </button>
                </div>
              )}

              {!cargando && !error && (
                <select
                  id="producto"
                  className="form-select"
                  value={productoSeleccionado}
                  onChange={manejarProducto}
                  disabled={!productos?.length}
                >
                  <option value="">
                    Selecciona un producto...
                  </option>

                  {productos?.map((producto) => (
                    <option
                      key={producto.id}
                      value={producto.id}
                    >
                      {producto.titulo} - ${producto.precio}
                    </option>
                  ))}
                </select>
              )}

              <small className="text-secondary">
                Los productos se obtienen desde la API DummyJSON.
              </small>
            </div>
          )}

          <div className="mb-3">
            <label htmlFor="concepto" className="form-label">
              Concepto
            </label>

            <input
              id="concepto"
              type="text"
              className="form-control"
              placeholder="Ej. Pago de sueldo, comida..."
              value={concepto}
              onChange={(e) => setConcepto(e.target.value)}
              maxLength={100}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="cantidad" className="form-label">
              Cantidad (MXN)
            </label>

            <input
              id="cantidad"
              type="number"
              className="form-control"
              placeholder="Ej. 500"
              value={cantidad}
              onChange={(e) => setCantidad(e.target.value)}
              min="0.01"
              step="0.01"
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="fecha" className="form-label">
              Fecha
            </label>

            <input
              id="fecha"
              type="date"
              className="form-control"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
              required
            />
          </div>

          {mensaje && (
            <div className="alert alert-danger" role="alert">
              {mensaje}
            </div>
          )}

          <button type="submit" className="btn btn-success w-100">
            Guardar movimiento
          </button>
        </form>
      </section>
    </main>
  );
}
