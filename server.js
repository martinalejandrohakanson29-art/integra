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

// --- SEED DE PROFESIONALES (Se crean al iniciar si no existen) ---
const seedProfessionals = async () => {
  const count = await prisma.profesional.count();
  if (count === 0) {
    await prisma.profesional.createMany({
      data: [
        { nombre: "Dra. Martina Varela", username: "martina", password: "123", especialidad: "Odontóloga" },
        { nombre: "Dr. Alejandro Rossi", username: "alejandro", password: "123", especialidad: "Cirujano" }
      ]
    });
    console.log("Profesionales creados por defecto.");
  }
};
seedProfessionals();

// --- AUTH ---
app.post('/api/auth/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await prisma.profesional.findUnique({ where: { username } });
  
  if (user && user.password === password) {
    res.json(user);
  } else {
    res.status(401).json({ error: "Credenciales inválidas" });
  }
});

// --- PACIENTES ---
app.get('/api/pacientes', async (req, res) => {
  const pacientes = await prisma.paciente.findMany({ orderBy: { nombre: 'asc' } });
  res.json(pacientes);
});

app.post('/api/pacientes', async (req, res) => {
  const nuevo = await prisma.paciente.create({ data: req.body });
  res.json(nuevo);
});

// --- TURNOS ---
app.get('/api/turnos', async (req, res) => {
  const turnos = await prisma.turno.findMany({
    include: { paciente: true, profesional: true } // Incluimos profesional para ver quién lo atiende
  });
  res.json(turnos);
});

app.post('/api/turnos', async (req, res) => {
  const { fecha, hora, duracion, pacienteId, profesionalId } = req.body;
  const nuevo = await prisma.turno.create({
    data: { fecha, hora, duracion, pacienteId, profesionalId },
    include: { paciente: true, profesional: true }
  });
  res.json(nuevo);
});

app.patch('/api/turnos/:id', async (req, res) => {
  const actualizado = await prisma.turno.update({
    where: { id: req.params.id },
    data: req.body,
    include: { paciente: true, profesional: true }
  });
  res.json(actualizado);
});

app.delete('/api/turnos/:id', async (req, res) => {
  await prisma.turno.delete({ where: { id: req.params.id } });
  res.json({ message: "Turno eliminado" });
});

app.use(express.static(path.join(__dirname, 'dist')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => console.log(`Servidor Integra corriendo en puerto ${PORT}`));
