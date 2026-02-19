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

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.json());

// Función auxiliar para que el frontend reciba lo que espera
const formatearTurno = (t) => {
  // Extraemos la fecha en formato YYYY-MM-DD local
  const anio = t.fechaHoraInicio.getFullYear();
  const mes = String(t.fechaHoraInicio.getMonth() + 1).padStart(2, '0');
  const dia = String(t.fechaHoraInicio.getDate()).padStart(2, '0');
  const fecha = `${anio}-${mes}-${dia}`;

  // Extraemos la hora en formato HH:mm local
  const horas = String(t.fechaHoraInicio.getHours()).padStart(2, '0');
  const minutos = String(t.fechaHoraInicio.getMinutes()).padStart(2, '0');
  const hora = `${horas}:${minutos}`;

  const duracion = Math.round((t.fechaHoraFin - t.fechaHoraInicio) / 60000) || 30;

  return {
    ...t,
    fecha,
    hora,
    duracion
  };
};

// --- RUTA DE AUTENTICACIÓN ---
app.post('/api/auth/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const profesional = await prisma.profesional.findUnique({
      where: { email: username }
    });

    if (profesional && profesional.password === password) {
      const { password: _, ...userWithoutPassword } = profesional;
      res.json(userWithoutPassword);
    } else {
      res.status(401).json({ error: 'Usuario o contraseña incorrectos' });
    }
  } catch (error) {
    console.error("Error en login:", error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

// --- PROFESIONALES ---
app.get('/api/profesionales', async (req, res) => {
  try {
    const pros = await prisma.profesional.findMany({
      select: { id: true, nombre: true, apellido: true, especialidad: true }
    });
    res.json(pros || []);
  } catch (error) {
    console.error("Error profesionales:", error);
    res.json([]); 
  }
});

// --- PACIENTES ---
app.get('/api/pacientes', async (req, res) => {
  try {
    const pacientes = await prisma.paciente.findMany({
      orderBy: { createdAt: 'desc' },
    });
    res.json(pacientes || []);
  } catch (error) {
    console.error("Error al listar pacientes (Verificá si corriste npx prisma migrate dev):", error);
    res.json([]); 
  }
});

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
    res.status(500).json({ error: 'Error al buscar paciente' });
  }
});

app.post('/api/pacientes', async (req, res) => {
  try {
    const nuevo = await prisma.paciente.create({
      data: { 
        ...req.body, 
        fechaNacimiento: new Date(req.body.fechaNacimiento) 
      }
    });
    res.status(201).json(nuevo);
  } catch (error) {
    // Log detallado para debugging en Railway
    console.error("Error detallado al crear paciente:", error);
    
    res.status(400).json({ 
      error: error.code === 'P2002' 
        ? 'El DNI ingresado ya existe en el sistema.' 
        : 'Error interno al procesar los datos (verificar esquema de DB).' 
    });
  }
});

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

app.delete('/api/pacientes/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
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
    res.json(turnos.map(formatearTurno));
  } catch (error) {
    console.error("Error en turnos:", error);
    res.json([]);
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
            include: { 
              paciente: { select: { id: true, nombre: true, apellido: true, colorType: true } }, 
              profesional: { select: { id: true, nombre: true, apellido: true } } 
            }
        });
        res.json(formatearTurno(nuevo));
    } catch (error) { 
        console.error("Error al crear turno:", error);
        res.status(500).json({error: "Error al crear turno"}); 
    }
});

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
            include: { 
              paciente: { select: { id: true, nombre: true, apellido: true, colorType: true } }, 
              profesional: { select: { id: true, nombre: true, apellido: true } } 
            }
        });
        res.json(formatearTurno(act));
    } catch (error) { 
        console.error("Error al actualizar turno:", error);
        res.status(500).json({error: "Error al actualizar turno"}); 
    }
});

app.delete('/api/turnos/:id', async (req, res) => {
    try {
        await prisma.turno.delete({ where: { id: parseInt(req.params.id) } });
        res.json({ ok: true });
    } catch (error) { res.status(500).json({error: "Error al borrar turno"}); }
});

// --- CONSULTAS ---
app.get('/api/pacientes/:id/consultas', async (req, res) => {
    try {
        const consultas = await prisma.consulta.findMany({
            where: { pacienteId: parseInt(req.params.id) },
            orderBy: { fecha: 'desc' }
        });
        res.json(consultas.map(c => ({
            ...c,
            observaciones: c.diagnostico, 
            odontograma: c.odontogramaData,
            profesionalId: c.profesionalId
        })));
    } catch (error) { res.json([]); }
});

app.post('/api/pacientes/:id/consultas', async (req, res) => {
    const { observaciones, odontograma, fecha, profesionalId } = req.body;
    try {
        let pId = parseInt(profesionalId);
        const profCheck = pId ? await prisma.profesional.findUnique({ where: { id: pId } }) : null;

        if (!profCheck) {
            const defaultPro = await prisma.profesional.findFirst();
            if (!defaultPro) {
                return res.status(400).json({ error: 'No hay profesionales registrados.' });
            }
            pId = defaultPro.id;
        }

        const nueva = await prisma.consulta.create({
            data: {
                pacienteId: parseInt(req.params.id),
                profesionalId: pId,
                fecha: new Date(fecha),
                diagnostico: observaciones || "",
                tratamiento: "Consulta General",
                odontogramaData: odontograma || {}
            }
        });
        res.json(nueva);
    } catch (error) { 
        res.status(500).json({ error: 'Error al guardar la consulta.' }); 
    }
});

app.patch('/api/consultas/:id', async (req, res) => {
    const { observaciones, odontograma, fecha, profesionalId } = req.body;
    try {
        const act = await prisma.consulta.update({
            where: { id: parseInt(req.params.id) },
            data: {
                fecha: fecha ? new Date(fecha) : undefined,
                diagnostico: observaciones,
                odontogramaData: odontograma,
                profesionalId: profesionalId ? parseInt(profesionalId) : undefined
            }
        });
        res.json(act);
    } catch (error) { res.status(500).json({error: "Error al editar consulta"}); }
});

app.delete('/api/consultas/:id', async (req, res) => {
    try {
        await prisma.consulta.delete({ where: { id: parseInt(req.params.id) } });
        res.json({ ok: true });
    } catch (error) { res.status(500).json({error: "Error al borrar consulta"}); }
});

app.use(express.static(path.join(__dirname, 'dist')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(port, () => {
  console.log(`Servidor corriendo en el puerto ${port}`);
});
