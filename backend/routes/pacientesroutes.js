const express = require('express');
const { getPacientes, createPaciente, updatePaciente, deletePaciente } = require('../controllers/pacientes');

const router = express.Router();

router.get('/', getPacientes);
router.post('/', createPaciente);
router.put('/:id', updatePaciente);
router.delete('/:id', deletePaciente);

module.exports = router;