const express = require('express');
const { getConsultorios, createConsultorio, updateConsultorio, deleteConsultorio } = require('../controllers/consultoros');

const router = express.Router();

router.get('/', getConsultorios);
router.post('/', createConsultorio);
router.put('/:id', updateConsultorio);
router.delete('/:id', deleteConsultorio);

module.exports = router;