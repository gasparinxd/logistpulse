import { useCallback, useEffect, useState } from 'react';
import { pedidoModel } from '../models/pedidoModel';

// Controlador: coordina el estado de la vista con el modelo.
export function usePedidosController() {
  const [pedidos, setPedidos] = useState([]);
  const [health, setHealth] = useState(null);
  const [error, setError] = useState('');
  const [enviando, setEnviando] = useState(false);

  const cargar = useCallback(async () => {
    try {
      const [listado, estado] = await Promise.all([pedidoModel.listar(), pedidoModel.health()]);
      setPedidos(listado);
      setHealth(estado);
      setError('');
    } catch (err) {
      setHealth({ status: 'DOWN' });
      setError(err.message);
    }
  }, []);

  useEffect(() => {
    cargar();
  }, [cargar]);

  const crearPedido = async (pedido) => {
    setEnviando(true);
    try {
      const nuevo = await pedidoModel.crear(pedido);
      setPedidos((prev) => [nuevo, ...prev]);
      setError('');
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setEnviando(false);
    }
  };

  return { pedidos, health, error, enviando, crearPedido };
}
