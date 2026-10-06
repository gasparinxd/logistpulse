const Pedido = require('../models/pedidoModel');
const pedidoView = require('../views/pedidoView');

async function crear(req, res, next) {
  try {
    const errores = Pedido.validar(req.body);
    if (errores.length) return res.status(400).json({ errores });
    const pedido = await Pedido.crear(req.body);
    res.status(201).json(pedidoView.render(pedido));
  } catch (err) {
    next(err);
  }
}

async function listar(req, res, next) {
  try {
    res.json(pedidoView.renderMany(await Pedido.listar()));
  } catch (err) {
    next(err);
  }
}

async function obtener(req, res, next) {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) return res.status(400).json({ error: 'id inválido' });
    const pedido = await Pedido.buscarPorId(id);
    if (!pedido) return res.status(404).json({ error: 'Pedido no encontrado' });
    res.json(pedidoView.render(pedido));
  } catch (err) {
    next(err);
  }
}

module.exports = { crear, listar, obtener };
