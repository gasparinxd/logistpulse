export default function PedidoList({ pedidos }) {
  return (
    <section className="card">
      <h2>Pedidos</h2>
      {pedidos.length === 0 ? (
        <p>No hay pedidos registrados.</p>
      ) : (
        <table>
          <thead>
            <tr><th>#</th><th>Cliente</th><th>Producto</th><th>Cant.</th><th>Destino</th><th>Estado</th><th>Fecha</th></tr>
          </thead>
          <tbody>
            {pedidos.map((p) => (
              <tr key={p.id}>
                <td>{p.id}</td>
                <td>{p.cliente}</td>
                <td>{p.producto}</td>
                <td>{p.cantidad}</td>
                <td>{p.direccionDestino}</td>
                <td>{p.estado}</td>
                <td>{new Date(p.creadoEn).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}
