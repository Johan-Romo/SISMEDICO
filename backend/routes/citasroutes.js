const express = require('express');
const router = express.Router();
const { getCitas, createCita, updateCita, deleteCita } = require('../controllers/citas');

// Rutas para citas
router.get('/', getCitas);
router.post('/', createCita);
router.put('/:id', updateCita);
router.delete('/:id', deleteCita);

module.exports = router;