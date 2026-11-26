
import { API } from '../config/api';
import { getJSON, ErrorHttp } from '../services/http';
import { dbLocal } from '../db/local';

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
  const db = await dbLocal;

  try {
    // Consultar los productos desde la API
    const datos = await getJSON(
      `${API.base}${API.lista}`,
      { signal }
    );

    // Convertir los datos al modelo de nuestra aplicación
    const productos = comoLista(datos).map(aProducto);

    // Guardar los productos en IndexedDB
    const tx = db.transaction('productos', 'readwrite');

    await Promise.all([
      ...productos.map((producto) => tx.store.put(producto)),
      tx.done,
    ]);

    // Indicar que los datos vienen de la API
    return {
      productos,
      origen: 'api',
    };

  } catch (error) {
    if (error.name === 'AbortError') {
      throw error;
    }

    // Recuperar los productos guardados localmente
    const productosLocales = await db.getAll('productos');

    if (productosLocales.length > 0) {
      return {
        productos: productosLocales,
        origen: 'cache',
      };
    }

    throw error;
  }
}

// Consultar un producto por su ID
export async function obtenerProducto(id, { signal } = {}) {
  const db = await dbLocal;

  try {
    // Consultar el producto desde la API
    const datos = await getJSON(
      `${API.base}${API.detalle(id)}`,
      { signal }
    );

    // Convertir los datos al modelo de nuestra aplicación
    const producto = aProducto(datos);

    // Guardar el producto en IndexedDB
    await db.put('productos', producto);

    return {
      producto,
      origen: 'api',
    };

  } catch (error) {
    if (error.name === 'AbortError') {
      throw error;
    }

    // Si el producto no existe en la API
    if (error instanceof ErrorHttp && error.status === 404) {
      return {
        producto: null,
        origen: 'api',
      };
    }

    // Si falla la API, buscar el producto en IndexedDB
    const productoLocal = await db.get('productos', String(id));

    if (productoLocal) {
      return {
        producto: productoLocal,
        origen: 'cache',
      };
    }

    throw error;
  }
}
