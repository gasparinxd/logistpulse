// Capa de Vista del backend: define cómo se representa un pedido en la respuesta JSON.
function render(pedido) {
  return {
    id: pedido.id,
    cliente: pedido.cliente,
    producto: pedido.producto,
    cantidad: pedido.cantidad,
    direccionDestino: pedido.direccion_destino,
    estado: pedido.estado,
    creadoEn: pedido.creado_en,
  };
}

function renderMany(pedidos) {
  return pedidos.map(render);
}

module.exports = { render, renderMany };
