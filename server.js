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

// --- SEED PROFESIONALES ---
const seedProfessionals = async () => {
  const count = await prisma.profesional.count();
  if (count === 0) {
    await prisma.profesional.createMany({
      data: [
        { nombre: "Dra. Martina Varela", username: "martina", password: "123", especialidad: "Odontóloga" },
        { nombre: "Dr. Alejandro Rossi", username: "alejandro", password: "123", especialidad: "Cirujano" }
      ]
    });
  }
};
seedProfessionals();

// --- PACIENTES ---
app.get('/api/pacientes', async (req, res) => {
  const pacientes = await prisma.paciente.findMany({ 
    include: { consultas: true },
    orderBy: { nombre: 'asc' } 
  });
  res.json(pacientes);
});

// NUEVA RUTA: Obtener un paciente específico por ID
app.get('/api/pacientes/:id', async (req, res) => {
  const paciente = await prisma.paciente.findUnique({ 
    where: { id: req.params.id } 
  });
  if (paciente) res.json(paciente);
  else res.status(404).json({ error: "Paciente no encontrado" });
});

app.post('/api/pacientes', async (req, res) => {
  try {
    const nuevo = await prisma.paciente.create({ data: req.body });
    res.json(nuevo);
  } catch (e) { res.status(400).json({ error: "Error al crear paciente" }); }
});

// NUEVA RUTA: Actualizar datos de paciente
app.patch('/api/pacientes/:id', async (req, res) => {
  try {
    const actualizado = await prisma.paciente.update({
      where: { id: req.params.id },
      data: req.body
    });
    res.json(actualizado);
  } catch (e) { res.status(500).json({ error: "No se pudo actualizar el paciente" }); }
});

app.delete('/api/pacientes/:id', async (req, res) => {
  try {
    await prisma.paciente.delete({ where: { id: req.params.id } });
    res.json({ message: "Paciente eliminado" });
  } catch (e) { res.status(500).json({ error: "No se pudo eliminar" }); }
});

// --- CONSULTAS (HISTORIAL) ---
app.get('/api/pacientes/:id/consultas', async (req, res) => {
  const consultas = await prisma.consulta.findMany({
    where: { pacienteId: req.params.id },
    orderBy: { fecha: 'desc' }
  });
  res.json(consultas);
});

app.post('/api/pacientes/:id/consultas', async (req, res) => {
  const nueva = await prisma.consulta.create({
    data: { ...req.body, pacienteId: req.params.id }
  });
  res.json(nueva);
});

app.patch('/api/consultas/:id', async (req, res) => {
  const actualizada = await prisma.consulta.update({
    where: { id: req.params.id },
    data: req.body
  });
  res.json(actualizada);
});

app.delete('/api/consultas/:id', async (req, res) => {
  await prisma.consulta.delete({ where: { id: req.params.id } });
  res.json({ message: "Consulta eliminada" });
});

// --- TURNOS Y DEMÁS RUTAS ---
app.get('/api/turnos', async (req, res) => {
  const turnos = await prisma.turno.findMany({ include: { paciente: true, profesional: true } });
  res.json(turnos);
});

app.post('/api/turnos', async (req, res) => {
  const nuevo = await prisma.turno.create({ data: req.body, include: { paciente: true, profesional: true } });
  res.json(nuevo);
});

app.patch('/api/turnos/:id', async (req, res) => {
  const actualizado = await prisma.turno.update({ where: { id: req.params.id }, data: req.body, include: { paciente: true, profesional: true } });
  res.json(actualizado);
});

app.delete('/api/turnos/:id', async (req, res) => {
  await prisma.turno.delete({ where: { id: req.params.id } });
  res.json({ message: "Turno eliminado" });
});

app.use(express.static(path.join(__dirname, 'dist')));
app.get('*', (req, res) => res.sendFile(path.join(__dirname, 'dist', 'index.html')));

app.listen(PORT, () => console.log(`Servidor Integra corriendo en puerto ${PORT}`));
