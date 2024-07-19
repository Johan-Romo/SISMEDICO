const pool = require('../config/db');

const getConsultorios = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM Consultorios');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

const createConsultorio = async (req, res) => {
  const { numero, piso } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO Consultorios (numero, piso) VALUES ($1, $2) RETURNING *',
      [numero, piso]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

const updateConsultorio = async (req, res) => {
  const id = parseInt(req.params.id);
  const { numero, piso } = req.body;
  try {
    const result = await pool.query(
      'UPDATE Consultorios SET numero = $1, piso = $2 WHERE id = $3 RETURNING *',
      [numero, piso, id]
    );
    if (result.rows.length > 0) {
      res.json(result.rows[0]);
    } else {
      res.status(404).json({ message: 'Consultorio no encontrado' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

const deleteConsultorio = async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const result = await pool.query('DELETE FROM Consultorios WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length > 0) {
      res.json({ message: 'Consultorio eliminado con éxito' });
    } else {
      res.status(404).json({ message: 'Consultorio no encontrado' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

module.exports = {
  getConsultorios,
  createConsultorio,
  updateConsultorio,
  deleteConsultorio
};