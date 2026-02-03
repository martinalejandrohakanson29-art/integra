import express from 'express';
import { PrismaClient } from '@prisma/client';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const prisma = new PrismaClient();
const app = express();
const PORT = process.env.PORT || 3000;

// Configuración para servir la web de React
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.json());

// --- ENDPOINTS PARA PACIENTES ---
app.get('/api/pacientes', async (req, res) => {
  const pacientes = await prisma.paciente.findMany();
  res.json(pacientes);
});

app.post('/api/pacientes', async (req, res) => {
  const { nombre, dni, telefono, email } = req.body;
  const nuevo = await prisma.paciente.create({
    data: { nombre, dni, telefono, email }
  });
  res.json(nuevo);
});

// --- ENDPOINTS PARA TURNOS ---
app.get('/api/turnos', async (req, res) => {
  const turnos = await prisma.turno.findMany({
    include: { paciente: true }
  });
  res.json(turnos);
});

app.post('/api/turnos', async (req, res) => {
  const { fecha, hora, duracion, colorType, pacienteId } = req.body;
  const nuevoTurno = await prisma.turno.create({
    data: { fecha, hora, duracion, colorType, pacienteId }
  });
  res.json(nuevoTurno);
});

// Actualizar duración o color del turno
app.patch('/api/turnos/:id', async (req, res) => {
  const { id } = req.params;
  const { duracion, colorType } = req.body;
  const actualizado = await prisma.turno.update({
    where: { id },
    data: { duracion, colorType }
  });
  res.json(actualizado);
});

// Servir los archivos estáticos de React (Vite)
app.use(express.static(path.join(__dirname, 'dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Servidor Integra corriendo en puerto ${PORT}`);
});

app.delete('/api/pacientes/:id', async (req, res) => {
  const { id } = req.params;
  await prisma.paciente.delete({ where: { id } });
  res.json({ message: "Eliminado correctamente" });
});
