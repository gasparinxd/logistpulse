const { pool } = require('../config/db');

const ESTADOS = ['PENDIENTE', 'EN_PREPARACION', 'EN_TRANSITO', 'ENTREGADO', 'CANCELADO'];

async function init() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS pedidos (
      id SERIAL PRIMARY KEY,
      cliente VARCHAR(100) NOT NULL,
      producto VARCHAR(150) NOT NULL,
      cantidad INTEGER NOT NULL CHECK (cantidad > 0),
      direccion_destino VARCHAR(255) NOT NULL,
      estado VARCHAR(20) NOT NULL DEFAULT 'PENDIENTE',
      creado_en TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);
}

function validar({ cliente, producto, cantidad, direccionDestino }) {
  const errores = [];
  if (!cliente || typeof cliente !== 'string') errores.push('cliente es obligatorio');
  if (!producto || typeof producto !== 'string') errores.push('producto es obligatorio');
  if (!Number.isInteger(Number(cantidad)) || Number(cantidad) <= 0) {
    errores.push('cantidad debe ser un entero mayor que 0');
  }
  if (!direccionDestino || typeof direccionDestino !== 'string') {
    errores.push('direccionDestino es obligatoria');
  }
  return errores;
}

async function crear({ cliente, producto, cantidad, direccionDestino }) {
  const { rows } = await pool.query(
    `INSERT INTO pedidos (cliente, producto, cantidad, direccion_destino)
     VALUES ($1, $2, $3, $4) RETURNING *`,
    [cliente, producto, Number(cantidad), direccionDestino]
  );
  return rows[0];
}

async function listar() {
  const { rows } = await pool.query('SELECT * FROM pedidos ORDER BY creado_en DESC');
  return rows;
}

async function buscarPorId(id) {
  const { rows } = await pool.query('SELECT * FROM pedidos WHERE id = $1', [id]);
  return rows[0] || null;
}

module.exports = { ESTADOS, init, validar, crear, listar, buscarPorId };
