import { useState } from 'react';

const INICIAL = { cliente: '', producto: '', cantidad: '', direccionDestino: '' };

export default function PedidoForm({ onSubmit, enviando }) {
  const [form, setForm] = useState(INICIAL);

  const cambiar = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const enviar = async (e) => {
    e.preventDefault();
    const ok = await onSubmit({ ...form, cantidad: Number(form.cantidad) });
    if (ok) setForm(INICIAL);
  };

  return (
    <form className="card" onSubmit={enviar}>
      <h2>Nuevo pedido</h2>
      <input name="cliente" placeholder="Cliente" value={form.cliente} onChange={cambiar} required />
      <input name="producto" placeholder="Producto" value={form.producto} onChange={cambiar} required />
      <input name="cantidad" type="number" min="1" step="1" placeholder="Cantidad" value={form.cantidad} onChange={cambiar} required />
      <input name="direccionDestino" placeholder="Dirección de destino" value={form.direccionDestino} onChange={cambiar} required />
      <button type="submit" disabled={enviando}>{enviando ? 'Enviando…' : 'Crear pedido'}</button>
    </form>
  );
}
