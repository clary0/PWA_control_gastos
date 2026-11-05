const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 4000;
const ARCHIVO = path.join(__dirname, 'gastos.json');
const BASE = '/api/v2';

app.use(cors());
app.use(express.json());

// ---------- Datos (se guardan en gastos.json) ----------
const CATEGORIAS = ['comida', 'transporte', 'escuela', 'entretenimiento', 'salud', 'servicios', 'otros'];

function leer() {
  try {
    return JSON.parse(fs.readFileSync(ARCHIVO, 'utf8'));
  } catch {
    return [];
  }
}
function guardar(gastos) {
  fs.writeFileSync(ARCHIVO, JSON.stringify(gastos, null, 2));
}
function validar(body, parcial = false) {
  const errores = {};
  const { descripcion, monto, categoria, fecha } = body;
  if (!parcial || descripcion !== undefined) {
    if (typeof descripcion !== 'string' || !descripcion.trim()) errores.descripcion = ['Este campo es obligatorio.'];
  }
  if (!parcial || monto !== undefined) {
    if (typeof monto !== 'number' || !(monto > 0)) errores.monto = ['Debe ser un número mayor que 0.'];
  }
  if (!parcial || categoria !== undefined) {
    if (!CATEGORIAS.includes(categoria)) errores.categoria = ['Categoría inválida. Opciones: ' + CATEGORIAS.join(', ')];
  }
  if (!parcial || fecha !== undefined) {
    if (typeof fecha !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(fecha)) errores.fecha = ['Formato esperado: AAAA-MM-DD.'];
  }
  return errores;
}

// ---------- Respuesta estilo wger (JSON o página navegable) ----------
function urlBase(req) {
  return `${req.protocol}://${req.get('host')}`;
}
function escapar(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
function paginaHTML(req, status, datos) {
  const textoStatus = { 200: 'OK', 201: 'Created', 204: 'No Content', 400: 'Bad Request', 404: 'Not Found' }[status] || '';
  const json = escapar(JSON.stringify(datos, null, 4)).replace(
    /(https?:\/\/[^"\s<]+)/g,
    '<a href="$1">$1</a>'
  );
  return `<!DOCTYPE html>
<html lang="es"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>REST API - Control de gastos</title>
<style>
  body{margin:0;font-family:system-ui,Segoe UI,Arial,sans-serif;color:#222}
  nav{background:#2a4d7c;color:#fff;padding:18px 40px;font-size:18px}
  nav a{color:#fff;margin-right:24px;text-decoration:none}
  main{max-width:900px;margin:30px auto;padding:0 20px}
  h1{border-bottom:1px solid #ccc;padding-bottom:16px}
  .ruta{background:#f5f5f5;border:1px solid #e3e3e3;padding:12px;font-family:monospace}
  pre{background:#f5f5f5;border:1px solid #e3e3e3;padding:16px;overflow:auto;line-height:1.5}
  a{color:#a00}
  .crumb a{color:#1a5fb4}
</style></head><body>
<nav><a href="${BASE}/"><b>Control de gastos</b></a><a href="${BASE}/gastos/">Gastos</a><a href="${BASE}/categorias/">Categorías</a><a href="${BASE}/resumen/">Resumen</a></nav>
<main>
<h1>REST API - ${escapar(req.tituloVista || 'Api Root')}</h1>
<p class="crumb"><a href="${BASE}/">Api Root</a></p>
<div class="ruta"><b>${req.method}</b> ${escapar(req.originalUrl)}</div>
<pre><b>HTTP ${status} ${textoStatus}</b>
Content-Type: application/json

${json}</pre>
</main></body></html>`;
}
function responder(req, res, status, datos, titulo) {
  req.tituloVista = titulo;
  const quiereJSON = req.query.format === 'json';
  if (!quiereJSON && req.accepts(['json', 'html']) === 'html') {
    return res.status(status).type('html').send(paginaHTML(req, status, datos));
  }
  if (status === 204) return res.status(204).end();
  return res.status(status).json(datos);
}

// ---------- Rutas ----------
app.get('/', (req, res) => res.redirect(`${BASE}/`));

// Raíz de la API: lista de endpoints (como wger.de/api/v2/)
app.get(`${BASE}/`, (req, res) => {
  const b = urlBase(req) + BASE;
  responder(req, res, 200, {
    gastos: `${b}/gastos/`,
    categorias: `${b}/categorias/`,
    resumen: `${b}/resumen/`
  }, 'Api Root');
});

// Categorías
app.get(`${BASE}/categorias/`, (req, res) => {
  responder(req, res, 200, {
    count: CATEGORIAS.length,
    next: null,
    previous: null,
    results: CATEGORIAS.map((nombre, i) => ({ id: i + 1, nombre }))
  }, 'Categorías');
});

// Resumen de gastos
app.get(`${BASE}/resumen/`, (req, res) => {
  const gastos = leer();
  const porCategoria = {};
  let total = 0;
  for (const g of gastos) {
    total += g.monto;
    porCategoria[g.categoria] = (porCategoria[g.categoria] || 0) + g.monto;
  }
  responder(req, res, 200, {
    total_gastos: gastos.length,
    monto_total: Number(total.toFixed(2)),
    por_categoria: porCategoria
  }, 'Resumen');
});

// Listar gastos (con paginación y filtros: ?categoria=comida&limit=10&offset=0)
app.get(`${BASE}/gastos/`, (req, res) => {
  let gastos = leer();
  if (req.query.categoria) gastos = gastos.filter(g => g.categoria === req.query.categoria);
  if (req.query.fecha) gastos = gastos.filter(g => g.fecha === req.query.fecha);

  const limit = Math.max(1, parseInt(req.query.limit, 10) || 20);
  const offset = Math.max(0, parseInt(req.query.offset, 10) || 0);
  const pagina = gastos.slice(offset, offset + limit);
  const b = `${urlBase(req)}${BASE}/gastos/`;
  const otros = Object.entries(req.query)
    .filter(([k]) => !['limit', 'offset', 'format'].includes(k))
    .map(([k, v]) => `&${encodeURIComponent(k)}=${encodeURIComponent(v)}`).join('');

  responder(req, res, 200, {
    count: gastos.length,
    next: offset + limit < gastos.length ? `${b}?limit=${limit}&offset=${offset + limit}${otros}` : null,
    previous: offset > 0 ? `${b}?limit=${limit}&offset=${Math.max(0, offset - limit)}${otros}` : null,
    results: pagina.map(g => ({ ...g, url: `${b}${g.id}/` }))
  }, 'Gasto List');
});

// Crear gasto
app.post(`${BASE}/gastos/`, (req, res) => {
  const errores = validar(req.body || {});
  if (Object.keys(errores).length) return responder(req, res, 400, errores, 'Gasto List');
  const gastos = leer();
  const id = gastos.reduce((m, g) => Math.max(m, g.id), 0) + 1;
  const { descripcion, monto, categoria, fecha } = req.body;
  const nuevo = { id, descripcion: descripcion.trim(), monto, categoria, fecha };
  gastos.push(nuevo);
  guardar(gastos);
  responder(req, res, 201, { ...nuevo, url: `${urlBase(req)}${BASE}/gastos/${id}/` }, 'Gasto List');
});

// Detalle de un gasto
app.get(`${BASE}/gastos/:id/`, (req, res) => {
  const g = leer().find(x => x.id === Number(req.params.id));
  if (!g) return responder(req, res, 404, { detail: 'No encontrado.' }, 'Gasto Detail');
  responder(req, res, 200, { ...g, url: `${urlBase(req)}${BASE}/gastos/${g.id}/` }, 'Gasto Detail');
});

// Reemplazar (PUT) o modificar parcialmente (PATCH)
function actualizar(parcial) {
  return (req, res) => {
    const gastos = leer();
    const i = gastos.findIndex(x => x.id === Number(req.params.id));
    if (i === -1) return responder(req, res, 404, { detail: 'No encontrado.' }, 'Gasto Detail');
    const errores = validar(req.body || {}, parcial);
    if (Object.keys(errores).length) return responder(req, res, 400, errores, 'Gasto Detail');
    const { descripcion, monto, categoria, fecha } = req.body;
    const cambios = { descripcion, monto, categoria, fecha };
    Object.keys(cambios).forEach(k => cambios[k] === undefined && delete cambios[k]);
    gastos[i] = { ...gastos[i], ...cambios };
    guardar(gastos);
    responder(req, res, 200, { ...gastos[i], url: `${urlBase(req)}${BASE}/gastos/${gastos[i].id}/` }, 'Gasto Detail');
  };
}
app.put(`${BASE}/gastos/:id/`, actualizar(false));
app.patch(`${BASE}/gastos/:id/`, actualizar(true));

// Eliminar
app.delete(`${BASE}/gastos/:id/`, (req, res) => {
  const gastos = leer();
  const i = gastos.findIndex(x => x.id === Number(req.params.id));
  if (i === -1) return responder(req, res, 404, { detail: 'No encontrado.' }, 'Gasto Detail');
  gastos.splice(i, 1);
  guardar(gastos);
  res.status(204).end();
});

// 404 general
app.use((req, res) => responder(req, res, 404, { detail: 'Ruta no encontrada.' }, 'Not Found'));

app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
  console.log(`Raíz de la API: http://localhost:${PORT}${BASE}/`);
});
