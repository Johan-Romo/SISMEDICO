const pool = require('../config/db');

const getMedicos = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM Medicos');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

const createMedico = async (req, res) => {
  const { nombre, apellido, especialidad } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO Medicos (nombre, apellido, especialidad) VALUES ($1, $2, $3) RETURNING *',
      [nombre, apellido, especialidad]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

const updateMedico = async (req, res) => {
  const id = parseInt(req.params.id);
  const { nombre, apellido, especialidad } = req.body;
  try {
    const result = await pool.query(
      'UPDATE Medicos SET nombre = $1, apellido = $2, especialidad = $3 WHERE id = $4 RETURNING *',
      [nombre, apellido, especialidad, id]
    );
    if (result.rows.length > 0) {
      res.json(result.rows[0]);
    } else {
      res.status(404).json({ message: 'Médico no encontrado' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

const deleteMedico = async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const result = await pool.query('DELETE FROM Medicos WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length > 0) {
      res.json({ message: 'Médico eliminado con éxito' });
    } else {
      res.status(404).json({ message: 'Médico no encontrado' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

module.exports = {
  getMedicos,
  createMedico,
  updateMedico,
  deleteMedico
};