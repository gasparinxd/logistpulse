const app = require('./app');
const { waitForDatabase } = require('./config/db');
const Pedido = require('./models/pedidoModel');

const PORT = Number(process.env.PORT || 3000);

async function start() {
  await waitForDatabase();
  await Pedido.init();
  app.listen(PORT, () => console.log(`[api] LogistPulse escuchando en el puerto ${PORT}`));
}

start().catch((err) => {
  console.error('[api] Error al iniciar:', err.message);
  process.exit(1);
});
