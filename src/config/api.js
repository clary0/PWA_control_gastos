export const API = {
  base: import.meta.env.VITE_API_URL,

  // Endpoint para consultar los productos
  lista: '/products?limit=20',

  // Endpoint para consultar un producto específico
  detalle: (id) => `/products/${encodeURIComponent(id)}`,
};
