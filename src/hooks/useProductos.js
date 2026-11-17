
import { useCallback } from 'react';
import { useConsulta } from './useConsulta';
import {
  listarProductos,
  obtenerProducto,
} from '../repositories/productosRepository';

// Controlador para consultar la lista de productos
export function useListaProductos() {
  const consultar = useCallback(
    (signal) => listarProductos({ signal }),
    []
  );

  return useConsulta('productos', consultar);
}

// Controlador para consultar un producto por su ID
export function useProducto(id) {
  const consultar = useCallback(
    (signal) => obtenerProducto(id, { signal }),
    [id]
  );

  return useConsulta(
    id ? `producto:${id}` : null,
    consultar
  );
}
