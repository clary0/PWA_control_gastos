
import { API } from '../config/api';
import { getJSON, ErrorHttp } from '../services/http';

// Traducir los datos de DummyJSON a nuestro propio modelo
export function aProducto(json) {
  return {
    id: String(json.id),
    titulo: json.title ?? 'Sin título',
    descripcion: json.description ?? '',
    precio: Number(json.price ?? 0),
    categoria: json.category ?? 'Sin categoría',
    imagen: json.thumbnail ?? null,
    marca: json.brand ?? 'Sin marca',
  };
}

// Obtener la lista de productos
function comoLista(datos) {
  if (Array.isArray(datos)) return datos;

  return datos.products ?? [];
}

// Consultar todos los productos
export async function listarProductos({ signal } = {}) {
  const datos = await getJSON(
    `${API.base}${API.lista}`,
    { signal }
  );

  return comoLista(datos).map(aProducto);
}

// Consultar un producto por su ID
export async function obtenerProducto(id, { signal } = {}) {
  try {
    const datos = await getJSON(
      `${API.base}${API.detalle(id)}`,
      { signal }
    );

    return aProducto(datos);

  } catch (e) {
    if (e instanceof ErrorHttp && e.status === 404) {
      return null;
    }

    throw e;
  }
}
