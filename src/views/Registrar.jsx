
import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router';
import useMovimientos from '../hooks/useMovimientos';
import { useListaProductos } from '../hooks/useProductos';
import { guardarFotografia } from '../repositories/fotografiasRepository.js';
import { imagenesActivas } from '../config/cloudinary.js';
import { guardarImagenPendiente } from '../modules/imagenes/imagenesRepository.js';

export default function Registrar() {
  const navigate = useNavigate();
  const { agregar } = useMovimientos();

  const {
    datos,
    cargando,
    error,
    reintentar,
  } = useListaProductos();

  const productos = datos?.productos ?? [];

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

  // Producto seleccionado de la API.
  const [productoSeleccionado, setProductoSeleccionado] = useState('');
  const [productoDetalle, setProductoDetalle] = useState(null);

  // Fotografía del gasto.
  const [fotografia, setFotografia] = useState(null);

  // Crear la URL de vista previa de la fotografía.
  const vistaPrevia = useMemo(
    () => fotografia ? URL.createObjectURL(fotografia) : '',
    [fotografia]
  );

  // Liberar la URL cuando cambie la fotografía o se desmonte el componente.
  useEffect(() => {
    return () => {
      if (vistaPrevia) {
        URL.revokeObjectURL(vistaPrevia);
      }
    };
  }, [vistaPrevia]);

  // Seleccionar producto de la API.
  const manejarProducto = (e) => {
    const id = e.target.value;

    setProductoSeleccionado(id);

    const producto = productos.find((p) => p.id === id);

    if (producto) {
      setProductoDetalle(producto);
      setConcepto(producto.titulo);
      setCantidad(String(producto.precio));
    } else {
      setProductoDetalle(null);
      setConcepto('');
      setCantidad('');
    }
  };

  // Guardar movimiento y fotografía.
  const manejarEnvio = async (e) => {
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

    try {
      // Registrar el movimiento y obtener su ID.
      const id = await agregar({
        tipo,
        concepto: concepto.trim(),
        cantidad: Number(cantidad),
        fecha,
        conImagen: tipo === 'gasto' && Boolean(fotografia),
      });

      if (!id) {
        setMensaje('No se pudo registrar el movimiento. Revisa tu sesión.');
        return;
      }

      if (tipo === 'gasto' && fotografia) {
        // Guardar una copia local de la fotografía.
        await guardarFotografia(id, fotografia);

        // Agregar la fotografía a la cola de Cloudinary.
        if (imagenesActivas) {
          await guardarImagenPendiente(id, fotografia);
        }
      }

      setMensaje('');
      navigate('/movimientos');
    } catch (error) {
      console.error('Error al guardar el movimiento:', error);
      setMensaje('No se pudo guardar el movimiento o su fotografía. Inténtalo nuevamente.');
    }
  };

  // Cambiar tipo de movimiento.
  const manejarTipo = (e) => {
    const nuevoTipo = e.target.value;

    setTipo(nuevoTipo);
    setProductoSeleccionado('');
    setProductoDetalle(null);
    setConcepto('');
    setCantidad('');
    setFotografia(null);
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
            <>
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
                    disabled={!productos.length}
                  >
                    <option value="">
                      Selecciona un producto...
                    </option>

                    {productos.map((producto) => (
                      <option key={producto.id} value={producto.id}>
                        {producto.titulo} - ${producto.precio}
                      </option>
                    ))}
                  </select>
                )}

                <small className="text-secondary">
                  Los productos se obtienen desde la API DummyJSON.
                </small>
              </div>

              {/* Mostrar la imagen del producto seleccionado. */}
              {productoDetalle && (
                <div className="card mb-3">
                  <div className="card-body text-center">
                    <h3 className="h6">Producto seleccionado</h3>

                    {productoDetalle.imagen ? (
                      <img
                        src={productoDetalle.imagen}
                        alt={productoDetalle.titulo}
                        className="img-fluid rounded"
                        style={{
                          height: '180px',
                          maxWidth: '100%',
                          objectFit: 'contain',
                        }}
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    ) : (
                      <p className="text-secondary">
                        Este producto no tiene una imagen disponible.
                      </p>
                    )}

                    <p className="fw-semibold mt-2 mb-1">
                      {productoDetalle.titulo}
                    </p>

                    <p className="text-success mb-0">
                      ${productoDetalle.precio}
                    </p>
                  </div>
                </div>
              )}

              <div className="mb-3">
                <label htmlFor="fotografia" className="form-label">
                  <i className="bi bi-camera me-2"></i>
                  Fotografía del gasto
                </label>

                <input
                  id="fotografia"
                  type="file"
                  className="form-control"
                  accept="image/*"
                  capture="environment"
                  onChange={(e) => {
                    setFotografia(e.target.files?.[0] ?? null);
                  }}
                />

                <small className="text-secondary">
                  Puedes tomar una foto con tu cámara o seleccionar una imagen.
                </small>
              </div>

              {vistaPrevia && (
                <div className="mb-3">
                  <p className="fw-semibold">Vista previa:</p>

                  <img
                    src={vistaPrevia}
                    alt="Fotografía del gasto"
                    className="img-fluid rounded"
                    style={{
                      maxHeight: '220px',
                      objectFit: 'contain',
                    }}
                  />

                  <button
                    type="button"
                    className="btn btn-outline-danger btn-sm d-block mt-2"
                    onClick={() => {
                      setFotografia(null);
                    }}
                  >
                    Quitar fotografía
                  </button>
                </div>
              )}
            </>
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
