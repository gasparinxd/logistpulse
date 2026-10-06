const { Router } = require('express');
const pedidoController = require('../controllers/pedidoController');

const router = Router();
router.post('/', pedidoController.crear);
router.get('/', pedidoController.listar);
router.get('/estados', pedidoController.estados);
router.get('/:id', pedidoController.obtener);

module.exports = router;
