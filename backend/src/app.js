const express = require('express');
const cors = require('cors');
const healthRoutes = require('./routes/healthRoutes');
const pedidoRoutes = require('./routes/pedidoRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/health', healthRoutes);
app.use('/api/pedidos', pedidoRoutes);

app.use((req, res) => res.status(404).json({ error: 'Ruta no encontrada' }));

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Error interno del servidor' });
});

module.exports = app;
