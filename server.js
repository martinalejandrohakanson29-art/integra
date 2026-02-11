import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();
const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// --- Rutas de API ---

// --- PACIENTES ---

// Obtener todos los pacientes
app.get('/api/pacientes', async (req, res) => {
  try {
    const pacientes = await prisma.paciente.findMany({
      orderBy: { createdAt: 'desc' },
    });
    res.json(pacientes);
  } catch (error) {
    console.error('Error al obtener pacientes:', error);
    res.status(500).json({ error: 'Error al obtener pacientes' });
  }
});

// Obtener un paciente por ID (con historial de consultas)
app.get('/api/pacientes/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const paciente = await prisma.paciente.findUnique({
      where: { id: parseInt(id) },
      include: {
        consultas: {
          include: { profesional: true },
          orderBy: { fecha: 'desc' },
        },
        turnos: {
            orderBy: { fechaHoraInicio: 'desc'},
            take: 5 // Traer solo los ultimos 5 turnos para el dashboard del paciente
        }
      },
    });

    if (!paciente) {
      return res.status(404).json({ error: 'Paciente no encontrado' });
    }
    res.json(paciente);
  } catch (error) {
    console.error('Error al obtener paciente:', error);
    res.status(500).json({ error: 'Error al obtener paciente' });
  }
});


// Crear un nuevo paciente
app.post('/api/pacientes', async (req, res) => {
  // 1. Extraemos todos los datos del cuerpo de la petición, incluyendo los nuevos campos médicos
  const {
    nombre,
    apellido,
    dni,
    fechaNacimiento,
    telefono,
    email,
    // Campos de Anamnesis
    tieneAlergias,
    tieneProbCardiacos,
    tieneHipertension,
    tieneDiabetes,
    tomaMedicacion,
    estaEmbarazada,
    otrosAntecedentes,
    observacionesAnamnesis
  } = req.body;

  // Validación básica
  if (!nombre || !apellido || !dni || !fechaNacimiento) {
    return res.status(400).json({ error: 'Faltan campos obligatorios (nombre, apellido, dni, fecha nacimiento)' });
  }

  try {
    // Validar si el DNI ya existe
    const existingPaciente = await prisma.paciente.findUnique({
        where: { dni }
    });

    if (existingPaciente) {
        return res.status(400).json({ error: 'Ya existe un paciente con este DNI.' });
    }

    const nuevoPaciente = await prisma.paciente.create({
      data: {
        nombre,
        apellido,
        dni,
        // Aseguramos que la fecha se guarde correctamente (Prisma espera objeto Date)
        fechaNacimiento: new Date(fechaNacimiento),
        telefono,
        email,
        // Guardamos los campos médicos. Si no vienen, Prisma usará el valor por defecto (false)
        tieneAlergias: tieneAlergias || false,
        tieneProbCardiacos: tieneProbCardiacos || false,
        tieneHipertension: tieneHipertension || false,
        tieneDiabetes: tieneDiabetes || false,
        tomaMedicacion: tomaMedicacion || false,
        estaEmbarazada: estaEmbarazada || false,
        otrosAntecedentes: otrosAntecedentes || false,
        observacionesAnamnesis: observacionesAnamnesis || ""
      },
    });
    res.status(201).json(nuevoPaciente);
  } catch (error) {
    console.error('Error al crear paciente:', error);
     // Manejo básico de errores de Prisma (ej. DNI duplicado si pasara la primera validación)
    if (error.code === 'P2002') {
       return res.status(400).json({ error: 'Ya existe un paciente con ese DNI.' });
    }
    res.status(500).json({ error: 'Error al crear paciente' });
  }
});

// --- PROFESIONALES ---
// (Se usa principalmente para selectores en turnos/consultas)
app.get('/api/profesionales', async (req, res) => {
    try {
        // Por seguridad, no devolvemos el password
        const profesionales = await prisma.profesional.findMany({
            select: { id: true, nombre: true, apellido: true, especialidad: true }
        });
        res.json(profesionales);
    } catch (error) {
      console.error('Error al obtener profesionales:', error);
      res.status(500).json({ error: 'Error al obtener profesionales' });
    }
  });

// --- TURNOS ---

// Obtener turnos (con filtros opcionales por fecha)
app.get('/api/turnos', async (req, res) => {
    const { fechaInicio, fechaFin, profesionalId } = req.query;

    const where = {};
    // Filtro por rango de fechas si se proveen
    if (fechaInicio && fechaFin) {
        where.fechaHoraInicio = {
            gte: new Date(fechaInicio),
            lte: new Date(fechaFin)
        };
    }
     // Filtro por profesional
    if (profesionalId) {
        where.profesionalId = parseInt(profesionalId);
    }


  try {
    const turnos = await prisma.turno.findMany({
      where,
      include: {
        paciente: { select: { id: true, nombre: true, apellido: true } },
        profesional: { select: { id: true, nombre: true, apellido: true } },
      },
      orderBy: { fechaHoraInicio: 'asc' },
    });
    res.json(turnos);
  } catch (error) {
    console.error('Error al obtener turnos:', error);
    res.status(500).json({ error: 'Error al obtener turnos' });
  }
});

// Crear un nuevo turno
app.post('/api/turnos', async (req, res) => {
    const { fechaHoraInicio, fechaHoraFin, pacienteId, profesionalId, motivo } = req.body;

    if (!fechaHoraInicio || !fechaHoraFin || !pacienteId || !profesionalId) {
        return res.status(400).json({ error: 'Faltan datos obligatorios para el turno.' });
    }

    try {
        // TODO: Validar que el profesional no tenga otro turno en ese horario (opcional pero recomendable)

        const nuevoTurno = await prisma.turno.create({
            data: {
                fechaHoraInicio: new Date(fechaHoraInicio),
                fechaHoraFin: new Date(fechaHoraFin),
                pacienteId: parseInt(pacienteId),
                profesionalId: parseInt(profesionalId),
                motivo,
                estado: 'PENDIENTE'
            },
            include: { // Incluir datos para devolver al frontend
                 paciente: { select: { id: true, nombre: true, apellido: true } },
                 profesional: { select: { id: true, nombre: true, apellido: true } },
            }
        });
        res.status(201).json(nuevoTurno);
    } catch (error) {
        console.error('Error al crear turno:', error);
        res.status(500).json({ error: 'Error al crear turno' });
    }
});

// Actualizar un turno (ej. cambiar fecha o estado)
app.put('/api/turnos/:id', async (req, res) => {
    const { id } = req.params;
    const { fechaHoraInicio, fechaHoraFin, estado, motivo } = req.body;

    try {
        const dataToUpdate = {};
        if (fechaHoraInicio) dataToUpdate.fechaHoraInicio = new Date(fechaHoraInicio);
        if (fechaHoraFin) dataToUpdate.fechaHoraFin = new Date(fechaHoraFin);
        if (estado) dataToUpdate.estado = estado;
        if (motivo !== undefined) dataToUpdate.motivo = motivo;

        const turnoActualizado = await prisma.turno.update({
            where: { id: parseInt(id) },
            data: dataToUpdate,
            include: {
                paciente: { select: { id: true, nombre: true, apellido: true } },
                profesional: { select: { id: true, nombre: true, apellido: true } },
           }
        });
        res.json(turnoActualizado);

    } catch (error) {
         console.error('Error al actualizar turno:', error);
         if (error.code === 'P2025') { // Record not found
             return res.status(404).json({ error: 'Turno no encontrado' });
         }
        res.status(500).json({ error: 'Error al actualizar turno' });
    }
});


// --- CONSULTAS (Historial) ---

// Crear una nueva consulta (y opcionalmente cerrar el turno asociado)
app.post('/api/consultas', async (req, res) => {
    const { pacienteId, profesionalId, turnoId, diagnostico, tratamiento, notas, odontogramaData, costo } = req.body;

    if (!pacienteId || !profesionalId || !diagnostico || !tratamiento) {
         return res.status(400).json({ error: 'Faltan datos obligatorios de la consulta.' });
    }

    try {
        // Usamos una transacción de Prisma para asegurar que todo se haga o nada
        const result = await prisma.$transaction(async (prismaTx) => {
            // 1. Crear la consulta
            const nuevaConsulta = await prismaTx.consulta.create({
                data: {
                    pacienteId: parseInt(pacienteId),
                    profesionalId: parseInt(profesionalId),
                    turnoId: turnoId ? parseInt(turnoId) : null,
                    diagnostico,
                    tratamiento,
                    notas,
                    odontogramaData: odontogramaData || null, // JSON exacto enviado desde el front
                    costo: costo ? parseFloat(costo) : null
                }
            });

            // 2. Si hay un turno asociado, actualizar su estado a ATENDIDO
            if (turnoId) {
                await prismaTx.turno.update({
                    where: { id: parseInt(turnoId) },
                    data: { estado: 'ATENDIDO' }
                });
            }

            return nuevaConsulta;
        });

        res.status(201).json(result);

    } catch (error) {
        console.error('Error al guardar consulta:', error);
        // Error específico de clave única si se intenta usar el mismo turnoId dos veces
        if (error.code === 'P2002' && error.meta?.target?.includes('turnoId')) {
             return res.status(400).json({ error: 'Este turno ya tiene una consulta asociada.' });
        }
        res.status(500).json({ error: 'Error al guardar la consulta' });
    }
});


// --- Ruta de prueba básica ---
app.get('/', (req, res) => {
  res.send('API de Integra funcionando!');
});

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
