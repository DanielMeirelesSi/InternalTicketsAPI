const express = require('express');
const ticketsController = require('../controllers/ticketsController');

const router = express.Router();

router.get('/', ticketsController.list);
router.get('/:id', ticketsController.getById);
router.post('/', ticketsController.create);
router.patch('/:id/status', ticketsController.updateStatus);
router.delete('/:id', ticketsController.remove);

module.exports = router;
