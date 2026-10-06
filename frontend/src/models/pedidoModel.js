// Modelo: acceso a datos de pedidos a través de la API REST.
async function request(url, options) {
  const res = await fetch(url, options);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.errores?.join(', ') || data.error || `Error HTTP ${res.status}`);
  }
  return data;
}

export const pedidoModel = {
  listar: () => request('/api/pedidos'),
  crear: (pedido) =>
    request('/api/pedidos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(pedido),
    }),
  health: () => request('/health'),
};
