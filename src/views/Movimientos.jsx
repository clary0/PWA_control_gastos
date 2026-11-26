
import { useEffect, useState } from 'react';
import useMovimientos from '../hooks/useMovimientos';
import {
  obtenerFotografia,
  eliminarFotografia,
} from '../repositories/fotografiasRepository.js';

// Componente para mostrar la fotografía de cada movimiento.
function FotoMovimiento({ id, imagenUrl }) {
  const [foto, setFoto] = useState('');

  useEffect(() => {
    let url;
    let activo = true;

    obtenerFotografia(id)
      .then((registro) => {
        if (!activo) return;

        if (registro?.archivo) {
          // Primero intenta mostrar la fotografía local.
          url = URL.createObjectURL(registro.archivo);
          setFoto(url);
        } else if (imagenUrl) {
          // Si no existe localmente, muestra la de Cloudinary.
          setFoto(imagenUrl);
        }
      })
      .catch((error) => {
        console.error('No se pudo consultar la fotografía:', error);

        if (activo && imagenUrl) {
          setFoto(imagenUrl);
        }
      });

    return () => {
      activo = false;

      if (url) {
        URL.revokeObjectURL(url);
      }
    };
  }, [id, imagenUrl]);

  if (!foto) {
    return <span className="text-secondary">Sin fotografía</span>;
  }

  return (
    <img
      src={foto}
      alt="Fotografía del gasto"
      width="65"
      height="65"
      className="rounded"
      style={{ objectFit: 'cover' }}
    />
  );
}

export default function Movimientos() {
  const { movimientos, eliminar } = useMovimientos();

  // Formato de moneda mexicana.
  const formatoDinero = (cantidad) => {
    return cantidad.toLocaleString('es-MX', {
      style: 'currency',
      currency: 'MXN',
    });
  };

  // Formato de fecha.
  const formatoFecha = (fecha) => {
    const [anio, mes, dia] = fecha.split('-');
    return `${dia}/${mes}/${anio}`;
  };

  // Ordenar del más reciente al más antiguo.
  const movimientosOrdenados = [...movimientos].sort(
    (a, b) => b.fecha.localeCompare(a.fecha)
  );

  // Eliminar movimiento y su fotografía local.
  const manejarEliminacion = async (id) => {
    const confirmar = window.confirm(
      '¿Estás segura de que deseas eliminar este movimiento?'
    );

    if (!confirmar) return;

    try {
      await eliminarFotografia(id);
      eliminar(id);
    } catch (error) {
      console.error('No se pudo eliminar la fotografía:', error);
      eliminar(id);
    }
  };

  return (
    <main className="shell-main">
      <section className="vista-actual">
        <p className="etiqueta">HISTORIAL FINANCIERO</p>

        <h2>Mis movimientos</h2>

        <p>Consulta los ingresos y gastos que has registrado.</p>

        {movimientosOrdenados.length === 0 ? (
          <div className="area-contenido movimientos-recientes">
            <i className="bi bi-clipboard-x fs-1"></i>
            <h3>No tienes movimientos registrados</h3>
            <p>Cuando registres un ingreso o gasto aparecerá aquí.</p>
          </div>
        ) : (
          <div className="area-contenido">
            <div className="table-responsive">
              <table className="table align-middle">
                <thead>
                  <tr>
                    <th>Tipo</th>
                    <th>Concepto</th>
                    <th>Fotografía</th>
                    <th>Fecha</th>
                    <th>Cantidad</th>
                    <th>Sincronización</th>
                    <th>Acción</th>
                  </tr>
                </thead>

                <tbody>
                  {movimientosOrdenados.map((movimiento) => (
                    <tr key={movimiento.id}>
                      <td>
                        <span
                          className={
                            movimiento.tipo === 'ingreso'
                              ? 'badge bg-success'
                              : 'badge bg-danger'
                          }
                        >
                          {movimiento.tipo === 'ingreso'
                            ? 'Ingreso'
                            : 'Gasto'}
                        </span>
                      </td>

                      <td>{movimiento.concepto}</td>

                      <td>
                        {movimiento.tipo === 'gasto' ? (
                          <FotoMovimiento
                            id={movimiento.id}
                            imagenUrl={movimiento.imagenUrl}
                          />
                        ) : (
                          <span className="text-secondary">No aplica</span>
                        )}
                      </td>

                      <td>{formatoFecha(movimiento.fecha)}</td>

                      <td
                        className={
                          movimiento.tipo === 'ingreso'
                            ? 'text-success fw-bold'
                            : 'text-danger fw-bold'
                        }
                      >
                        {movimiento.tipo === 'ingreso' ? '+' : '-'}
                        {formatoDinero(movimiento.cantidad)}
                      </td>

                      <td>
                        <span
                          className={
                            movimiento.pendiente
                              ? 'badge bg-warning text-dark'
                              : 'badge bg-success'
                          }
                        >
                          {movimiento.pendiente ? 'Pendiente' : 'Enviado'}
                        </span>
                      </td>

                      <td>
                        <button
                          type="button"
                          className="btn btn-outline-danger btn-sm"
                          onClick={() => manejarEliminacion(movimiento.id)}
                          aria-label={`Eliminar ${movimiento.concepto}`}
                        >
                          <i className="bi bi-trash"></i>
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
