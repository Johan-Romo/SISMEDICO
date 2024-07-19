const express = require('express');
const { getMedicos, createMedico, updateMedico, deleteMedico } = require('../controllers/medicos');

const router = express.Router();

router.get('/', getMedicos);
router.post('/', createMedico);
router.put('/:id', updateMedico);
router.delete('/:id', deleteMedico);

module.exports = router;