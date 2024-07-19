const pool = require('../config/db');

const getCitas = async (req, res) => {
  try {
    const result = await pool.query('SELECT c.id, p.nombre AS paciente_nombre, p.apellido AS paciente_apellido, m.nombre AS medico_nombre, m.apellido AS medico_apellido, c.fecha, c.hora, c.consultorio FROM Citas c INNER JOIN Pacientes p ON c.paciente_id = p.id INNER JOIN Medicos m ON c.medico_id = m.id');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

const createCita = async (req, res) => {
  const { paciente_id, medico_id, fecha, hora, consultorio } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO Citas (paciente_id, medico_id, fecha, hora, consultorio) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [paciente_id, medico_id, fecha, hora, consultorio]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

const updateCita = async (req, res) => {
  const id = parseInt(req.params.id);
  const { paciente_id, medico_id, fecha, hora, consultorio } = req.body;
  try {
    const result = await pool.query(
      'UPDATE Citas SET paciente_id = $1, medico_id = $2, fecha = $3, hora = $4, consultorio = $5 WHERE id = $6 RETURNING *',
      [paciente_id, medico_id, fecha, hora, consultorio, id]
    );
    if (result.rows.length > 0) {
      res.json(result.rows[0]);
    } else {
      res.status(404).json({ message: 'Cita no encontrada' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

const deleteCita = async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const result = await pool.query('DELETE FROM Citas WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length > 0) {
      res.json({ message: 'Cita eliminada con éxito' });
    } else {
      res.status(404).json({ message: 'Cita no encontrada' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

module.exports = {
  getCitas,
  createCita,
  updateCita,
  deleteCita
};