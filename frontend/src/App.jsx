import { usePedidosController } from './controllers/usePedidosController';
import HealthBadge from './views/HealthBadge';
import PedidoForm from './views/PedidoForm';
import PedidoList from './views/PedidoList';

export default function App() {
  const { pedidos, health, error, enviando, crearPedido } = usePedidosController();

  return (
    <main className="container">
      <header>
        <h1>LogistPulse</h1>
        <HealthBadge health={health} />
      </header>
      <PedidoForm onSubmit={crearPedido} enviando={enviando} />
      {error && <p className="error">{error}</p>}
      <PedidoList pedidos={pedidos} />
    </main>
  );
}
