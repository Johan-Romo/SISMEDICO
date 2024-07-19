const pool = require('../config/db');

const getPacientes = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM Pacientes');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

const createPaciente = async (req, res) => {
  const { nombre, apellido, fecha_nacimiento, email } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO Pacientes (nombre, apellido, fecha_nacimiento, email) VALUES ($1, $2, $3, $4) RETURNING *',
      [nombre, apellido, fecha_nacimiento, email]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

const updatePaciente = async (req, res) => {
  const id = parseInt(req.params.id);
  const { nombre, apellido, fecha_nacimiento, email } = req.body;
  try {
    const result = await pool.query(
      'UPDATE Pacientes SET nombre = $1, apellido = $2, fecha_nacimiento = $3, email = $4 WHERE id = $5 RETURNING *',
      [nombre, apellido, fecha_nacimiento, email, id]
    );
    if (result.rows.length > 0) {
      res.json(result.rows[0]);
    } else {
      res.status(404).json({ message: 'Paciente no encontrado' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

const deletePaciente = async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const result = await pool.query('DELETE FROM Pacientes WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length > 0) {
      res.json({ message: 'Paciente eliminado con éxito' });
    } else {
      res.status(404).json({ message: 'Paciente no encontrado' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

module.exports = {
  getPacientes,
  createPaciente,
  updatePaciente,
  deletePaciente
};