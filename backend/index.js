const express = require('express');
const cors = require('cors');
const pacienteRoutes = require('./routes/pacientesroutes');
const medicoRoutes = require('./routes/medicosroutes');
const consultorioRoutes = require('./routes/consultoriosroutes');
const citaRoutes = require('./routes/citasroutes');
// Importa las demás rutas

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/pacientes', pacienteRoutes);
app.use('/api/medicos', medicoRoutes);
app.use('/api/consultorios', consultorioRoutes);
app.use('/api/citas', citaRoutes);

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});