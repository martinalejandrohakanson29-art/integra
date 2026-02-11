import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const prisma = new PrismaClient();
const app = express();
const port = process.env.PORT || 3001;

// Configuración para servir los archivos del frontend
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.json());

// --- RUTA DE AUTENTICACIÓN (LOGIN) ---
app.post('/api/auth/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    // Buscamos al profesional por email (usando username como email en este caso)
    const profesional = await prisma.profesional.findUnique({
      where: { email: username }
    });

    // Validación simple (en producción deberías usar bcrypt para comparar contraseñas hasheadas)
    if (profesional && profesional.password === password) {
      const { password: _, ...userWithoutPassword } = profesional;
      res.json(userWithoutPassword);
    } else {
      res.status(401).json({ error: 'Usuario o contraseña incorrectos' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

// --- PACIENTES ---

// Obtener todos los pacientes
app.get('/api/pacientes', async (req, res) => {
  try {
    const pacientes = await prisma.paciente.findMany({
      orderBy: { createdAt: 'desc' },
    });
    res.json(pacientes);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener pacientes' });
  }
});

// Obtener un paciente por ID
app.get('/api/pacientes/:id', async (req, res) => {
  try {
    const paciente = await prisma.paciente.findUnique({
      where: { id: parseInt(req.params.id) },
      include: {
        consultas: { orderBy: { fecha: 'desc' } },
        turnos: { orderBy: { fechaHoraInicio: 'desc' }, take: 5 }
      },
    });
    if (!paciente) return res.status(404).json({ error: 'No encontrado' });
    res.json(paciente);
  } catch (error) {
    res.status(500).json({ error: 'Error' });
  }
});

// Crear paciente
app.post('/api/pacientes', async (req, res) => {
  try {
    const nuevo = await prisma.paciente.create({
      data: { ...req.body, fechaNacimiento: new Date(req.body.fechaNacimiento) }
    });
    res.status(201).json(nuevo);
  } catch (error) {
    res.status(400).json({ error: 'Error al crear (DNI duplicado o faltan datos)' });
  }
});

// Editar paciente (NUEVA RUTA)
app.patch('/api/pacientes/:id', async (req, res) => {
  try {
    const actualizado = await prisma.paciente.update({
      where: { id: parseInt(req.params.id) },
      data: { 
        ...req.body, 
        fechaNacimiento: req.body.fechaNacimiento ? new Date(req.body.fechaNacimiento) : undefined 
      }
    });
    res.json(actualizado);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar' });
  }
});

// Eliminar paciente (NUEVA RUTA)
app.delete('/api/pacientes/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    // Prisma borrará en cascada si está configurado, o puedes borrar manual:
    await prisma.turno.deleteMany({ where: { pacienteId: id } });
    await prisma.consulta.deleteMany({ where: { pacienteId: id } });
    await prisma.paciente.delete({ where: { id } });
    res.json({ message: 'Eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar' });
  }
});

// --- TURNOS ---

app.get('/api/turnos', async (req, res) => {
  try {
    const turnos = await prisma.turno.findMany({
      include: {
        paciente: { select: { id: true, nombre: true, apellido: true, colorType: true } },
        profesional: { select: { id: true, nombre: true, apellido: true } },
      }
    });
    // Ajuste de formato para el front
    const turnosFormateados = turnos.map(t => ({
      ...t,
      fecha: t.fechaHoraInicio.toISOString().split('T')[0],
      hora: t.fechaHoraInicio.toISOString().split('T')[1].substring(0, 5),
      duracion: 30 // O calcular diferencia entre inicio y fin
    }));
    res.json(turnosFormateados);
  } catch (error) {
    res.status(500).json({ error: 'Error' });
  }
});

app.post('/api/turnos', async (req, res) => {
    const { fecha, hora, pacienteId, profesionalId } = req.body;
    const inicio = new Date(`${fecha}T${hora}:00`);
    const fin = new Date(inicio.getTime() + 30 * 60000);
    try {
        const nuevo = await prisma.turno.create({
            data: {
                fechaHoraInicio: inicio,
                fechaHoraFin: fin,
                pacienteId: parseInt(pacienteId),
                profesionalId: parseInt(profesionalId),
                estado: 'PENDIENTE'
            },
            include: { paciente: true, profesional: true }
        });
        res.json(nuevo);
    } catch (error) { res.status(500).json(error); }
});

// PATCH para actualizar turnos (arrastrar y soltar)
app.patch('/api/turnos/:id', async (req, res) => {
    const { fecha, hora, duracion, estado } = req.body;
    let data = {};
    if (fecha && hora) {
        data.fechaHoraInicio = new Date(`${fecha}T${hora}:00`);
        data.fechaHoraFin = new Date(data.fechaHoraInicio.getTime() + (duracion || 30) * 60000);
    }
    if (estado) data.estado = estado;
    
    try {
        const act = await prisma.turno.update({
            where: { id: parseInt(req.params.id) },
            data,
            include: { paciente: true, profesional: true }
        });
        res.json(act);
    } catch (error) { res.status(500).json(error); }
});

app.delete('/api/turnos/:id', async (req, res) => {
    try {
        await prisma.turno.delete({ where: { id: parseInt(req.params.id) } });
        res.json({ ok: true });
    } catch (error) { res.status(500).json(error); }
});

// --- CONSULTAS ---

app.get('/api/pacientes/:id/consultas', async (req, res) => {
    const consultas = await prisma.consulta.findMany({
        where: { pacienteId: parseInt(req.params.id) },
        orderBy: { fecha: 'desc' }
    });
    // Mapeo para que el front lo entienda (observaciones <-> diagnostico)
    res.json(consultas.map(c => ({
        ...c,
        observaciones: c.diagnostico, 
        odontograma: c.odontogramaData
    })));
});

app.post('/api/pacientes/:id/consultas', async (req, res) => {
    const { observaciones, odontograma, fecha } = req.body;
    try {
        const nueva = await prisma.consulta.create({
            data: {
                pacienteId: parseInt(req.params.id),
                profesionalId: 1, // Por defecto al primer pro si no hay login real
                fecha: new Date(fecha),
                diagnostico: observaciones,
                tratamiento: "Consulta General",
                odontogramaData: odontograma
            }
        });
        res.json(nueva);
    } catch (error) { res.status(500).json(error); }
});

// --- CONFIGURACIÓN PARA PRODUCCIÓN ---
// Servir archivos estáticos de la carpeta 'dist'
app.use(express.static(path.join(__dirname, 'dist')));

// Cualquier ruta que no sea de la API, devuelve el index.html (para React Router)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(port, () => {
  console.log(`Servidor corriendo en el puerto ${port}`);
});
