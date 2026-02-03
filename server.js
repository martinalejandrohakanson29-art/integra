import express from 'express';
import { PrismaClient } from '@prisma/client';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const prisma = new PrismaClient();
const app = express();
const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.json());

// --- PACIENTES ---
app.get('/api/pacientes', async (req, res) => {
  const pacientes = await prisma.paciente.findMany({
    orderBy: { nombre: 'asc' }
  });
  res.json(pacientes);
});

app.post('/api/pacientes', async (req, res) => {
  const { 
    nombre, dni, telefono, email, fechaNacimiento, 
    direccion, obraSocial, nroAfiliado, antecedentes, 
    observaciones, colorType 
  } = req.body;
  
  try {
    const nuevo = await prisma.paciente.create({
      data: { 
        nombre, dni, telefono, email, fechaNacimiento, 
        direccion, obraSocial, nroAfiliado, antecedentes, 
        observaciones, colorType 
      }
    });
    res.json(nuevo);
  } catch (error) {
    res.status(400).json({ error: "Error al crear paciente (DNI duplicado o datos faltantes)" });
  }
});

app.delete('/api/pacientes/:id', async (req, res) => {
  const { id } = req.params;
  await prisma.paciente.delete({ where: { id } });
  res.json({ message: "Paciente eliminado" });
});

// --- TURNOS ---
app.get('/api/turnos', async (req, res) => {
  const turnos = await prisma.turno.findMany({
    include: { paciente: true }
  });
  res.json(turnos);
});

app.post('/api/turnos', async (req, res) => {
  const { fecha, hora, duracion, pacienteId } = req.body;
  const nuevo = await prisma.turno.create({
    data: { fecha, hora, duracion, pacienteId },
    include: { paciente: true }
  });
  res.json(nuevo);
});

app.patch('/api/turnos/:id', async (req, res) => {
  const { id } = req.params;
  const { fecha, hora, duracion } = req.body;
  const actualizado = await prisma.turno.update({
    where: { id },
    data: { fecha, hora, duracion },
    include: { paciente: true }
  });
  res.json(actualizado);
});

app.delete('/api/turnos/:id', async (req, res) => {
  const { id } = req.params;
  await prisma.turno.delete({ where: { id } });
  res.json({ message: "Turno eliminado" });
});

app.use(express.static(path.join(__dirname, 'dist')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Servidor Integra corriendo en puerto ${PORT}`);
});
