import React, { useState, useEffect } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Search,
  User,
  Users,
  GripVertical,
  ChevronDown,
  Trash2,
  Filter,
  Calendar,
  CalendarPlus,
  Move,
  X,
  Clock,
  Plus,
  FileText,
  Minus
} from 'lucide-react';
import { format, addDays, startOfWeek, addWeeks, subWeeks, startOfToday } from 'date-fns';
import { es } from 'date-fns/locale';
import MainLayout from '../components/MainLayout';
import NuevaEntradaModal from '../components/NuevaEntradaModal';

// Estilos de colores según la preferencia del paciente
const colorOptions = {
  default: { bg: 'bg-indigo-100 dark:bg-indigo-900/40', text: 'text-indigo-700 dark:text-indigo-200', border: 'border-indigo-200 dark:border-indigo-700' },
  green:   { bg: 'bg-emerald-100 dark:bg-emerald-900/40', text: 'text-emerald-700 dark:text-emerald-200', border: 'border-emerald-200 dark:border-emerald-700' },
  amber:   { bg: 'bg-amber-100 dark:bg-amber-900/40', text: 'text-amber-800 dark:text-amber-200', border: 'border-amber-200 dark:border-amber-700' },
  red:     { bg: 'bg-rose-100 dark:bg-rose-900/40',     text: 'text-rose-800 dark:text-rose-200',   border: 'border-rose-200 dark:border-rose-700' },
};

const nombreCompleto = (p) => p ? `${p.nombre}${p.apellido ? ' ' + p.apellido : ''}` : '';

const AgendaPage = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const [selectedDate, setSelectedDate] = useState(startOfToday());
  const [searchTerm, setSearchTerm] = useState('');
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterProf, setFilterProf] = useState('all');

  const [patientDetailModal, setPatientDetailModal] = useState(null);
  const [nuevaEntradaModal, setNuevaEntradaModal] = useState(null);
  // Soporte táctil / móvil
  const [showPatientsPanel, setShowPatientsPanel] = useState(false);
  const [assignPatient, setAssignPatient] = useState(null);   // paciente seleccionado para asignar turno tocando un horario
  const [moveAppt, setMoveAppt] = useState(null);             // turno seleccionado para mover tocando un horario
  const [apptActionModal, setApptActionModal] = useState(null); // turno con modal de acciones abierto

  const loadData = async () => {
    try {
      const [resP, resT] = await Promise.all([
        fetch('/api/pacientes'),
        fetch('/api/turnos')
      ]);

      const dataP = await resP.json();
      const dataT = await resT.json();

      if (Array.isArray(dataP)) setPatients(dataP);
      if (Array.isArray(dataT)) setAppointments(dataT);
      else setAppointments([]);
    } catch (error) {
      console.error("Error al cargar datos:", error);
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const weekStart = startOfWeek(selectedDate, { weekStartsOn: 1 });
  const days = Array.from({ length: 5 }, (_, i) => addDays(weekStart, i));
  const timeSlots = [];
  for (let h = 8; h <= 20; h++) {
    timeSlots.push(`${h.toString().padStart(2, '0')}:00`, `${h.toString().padStart(2, '0')}:30`);
  }

  const startDay = days[0];
  const endDay = days[4];
  const isSameMonth = startDay.getMonth() === endDay.getMonth();
  const rangeLabel = isSameMonth
    ? `${format(startDay, 'd')} - ${format(endDay, 'd MMM', { locale: es })}`
    : `${format(startDay, 'd MMM', { locale: es })} - ${format(endDay, 'd MMM', { locale: es })}`;

  const currentMonthTitle = format(selectedDate, 'MMMM yyyy', { locale: es });
  const capitalizedTitle = currentMonthTitle.charAt(0).toUpperCase() + currentMonthTitle.slice(1);

  const handleDateChange = (e) => {
    if (e.target.value) {
      const [year, month, day] = e.target.value.split('-').map(Number);
      setSelectedDate(new Date(year, month - 1, day));
    }
  };

  const handleDragStart = (e, data, type) => {
    e.dataTransfer.setData("type", type);
    e.dataTransfer.setData("payload", JSON.stringify(data));
  };

  const crearTurno = async (date, time, pacienteId) => {
    if (!user?.id) {
      alert("Debes iniciar sesión para asignar turnos.");
      return;
    }
    const res = await fetch('/api/turnos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fecha: format(date, 'yyyy-MM-dd'),
        hora: time,
        pacienteId,
        profesionalId: user.id
      })
    });
    if (res.ok) {
      const nuevo = await res.json();
      setAppointments(prev => [...prev, nuevo]);
    } else {
      alert("No se pudo crear el turno.");
    }
  };

  const moverTurno = async (id, date, time) => {
    const res = await fetch(`/api/turnos/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fecha: format(date, 'yyyy-MM-dd'),
        hora: time
      })
    });
    if (res.ok) {
      const actualizado = await res.json();
      setAppointments(prev => prev.map(a => a.id === id ? actualizado : a));
    }
  };

  const eliminarTurno = async (turno) => {
    if (window.confirm(`¿Eliminar turno de ${nombreCompleto(turno.paciente) || 'este paciente'}?`)) {
      await fetch(`/api/turnos/${turno.id}`, { method: 'DELETE' });
      setAppointments(prev => prev.filter(a => a.id !== turno.id));
      setApptActionModal(null);
    }
  };

  const onDrop = async (e, date, time) => {
    e.preventDefault();
    try {
      const type = e.dataTransfer.getData("type");
      const payload = e.dataTransfer.getData("payload");
      if (!payload) return;

      const data = JSON.parse(payload);

      if (type === "patient") {
        await crearTurno(date, time, data.id);
      } else if (type === "appointment") {
        await moverTurno(data.id, date, time);
      }
    } catch (err) {
      console.error("Error en el drop:", err);
    }
  };

  const updateTurno = async (id, campos) => {
    // La duración mínima de un turno es de 30 minutos
    if (campos.duracion !== undefined && campos.duracion < 30) return;
    const res = await fetch(`/api/turnos/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(campos)
    });
    if (res.ok) {
      const actualizado = await res.json();
      setAppointments(prev => prev.map(a => a.id === id ? actualizado : a));
      setApptActionModal(prev => prev && prev.id === id ? actualizado : prev);
    }
  };

  // Toque/clic sobre una celda vacía: asignar o mover según el modo activo
  const handleSlotTap = async (date, time, ocupado) => {
    if (ocupado) return;
    if (assignPatient) {
      await crearTurno(date, time, assignPatient.id);
      setAssignPatient(null);
    } else if (moveAppt) {
      await moverTurno(moveAppt.id, date, time);
      setMoveAppt(null);
    }
  };

  const iniciarAsignacion = (paciente) => {
    setMoveAppt(null);
    setAssignPatient(paciente);
    setShowPatientsPanel(false);
    setPatientDetailModal(null);
  };

  const filteredAppointments = filterProf === 'all'
    ? appointments
    : appointments.filter(a => a.profesionalId === parseInt(filterProf));

  const filteredPatients = patients.filter(p =>
    nombreCompleto(p).toLowerCase().includes(searchTerm.toLowerCase()) || p.dni.includes(searchTerm)
  );

  const headerActions = (
    <div className="flex items-center gap-2 md:gap-4 flex-wrap">
      <div className="flex items-center gap-1 md:gap-2 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
        <Filter className="w-4 h-4 ml-1 md:ml-2 text-slate-400 shrink-0" />
        <select
          className="bg-transparent text-xs font-bold outline-none pr-1 md:pr-2 text-slate-600 dark:text-slate-300 cursor-pointer max-w-[90px] md:max-w-none"
          value={filterProf}
          onChange={(e) => setFilterProf(e.target.value)}
        >
          <option value="all">Ver Todos</option>
          {user && <option value={user.id}>Mis Turnos</option>}
        </select>
      </div>

      <div className="flex bg-slate-100 dark:bg-slate-700 rounded-lg p-1 items-center">
        <button onClick={() => setSelectedDate(subWeeks(selectedDate, 1))} className="p-1.5 hover:bg-white dark:hover:bg-slate-600 rounded-md transition-all"><ChevronLeft className="w-4 h-4 text-slate-600 dark:text-slate-300" /></button>
        <button onClick={() => setSelectedDate(startOfToday())} className="px-2 md:px-3 py-1 text-[11px] md:text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-indigo-600 transition-colors capitalize min-w-[90px] md:min-w-[110px]">
          {rangeLabel}
        </button>
        <button onClick={() => setSelectedDate(addWeeks(selectedDate, 1))} className="p-1.5 hover:bg-white dark:hover:bg-slate-600 rounded-md transition-all"><ChevronRight className="w-4 h-4 text-slate-600 dark:text-slate-300" /></button>
        <div className="w-px h-3 bg-slate-300 dark:bg-slate-600 mx-1"></div>
        <div className="relative p-1.5 hover:bg-white dark:hover:bg-slate-600 rounded-md transition-all cursor-pointer group">
           <Calendar className="w-4 h-4 text-slate-600 dark:text-slate-300 group-hover:text-indigo-600" />
           <input type="date" onChange={handleDateChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
        </div>
      </div>
    </div>
  );

  return (
    <MainLayout title={`Agenda - ${capitalizedTitle}`} activePage="agenda" extraHeader={headerActions}>
      <div className="flex h-full gap-4 overflow-hidden relative">

        {/* Backdrop del panel de pacientes (solo móvil) */}
        {showPatientsPanel && (
          <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setShowPatientsPanel(false)} />
        )}

        {/* PANEL DE PACIENTES: fijo deslizable en móvil, columna estática en escritorio */}
        <div className={`fixed inset-y-0 left-0 z-50 w-80 max-w-[85vw] p-3 bg-slate-50 dark:bg-slate-950 shadow-2xl transform transition-transform duration-300 flex flex-col gap-4 ${showPatientsPanel ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:z-10 lg:w-72 lg:p-0 lg:bg-transparent lg:dark:bg-transparent lg:shadow-none lg:shrink-0`}>
          <div className="flex-1 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col overflow-hidden">
            <div className="p-4 border-b border-slate-100 dark:border-slate-700">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-bold text-slate-700 dark:text-slate-200 flex items-center gap-2">
                  <User className="w-4 h-4 text-indigo-500" /> Pacientes
                </h2>
                <button onClick={() => setShowPatientsPanel(false)} className="lg:hidden p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg" aria-label="Cerrar panel">
                  <X className="w-4 h-4 text-slate-400" />
                </button>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input type="text" placeholder="Buscar..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg outline-none dark:text-white" />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-3 space-y-2 custom-scrollbar">
              {filteredPatients.map(p => (
                <div
                  key={p.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, p, "patient")}
                  onClick={() => setPatientDetailModal(p)}
                  className={`group flex items-center gap-2 p-3 border border-transparent rounded-xl cursor-grab active:cursor-grabbing hover:border-indigo-400 transition-all shadow-sm ${colorOptions[p.colorType]?.bg || 'bg-slate-50'}`}
                >
                  <GripVertical className="w-4 h-4 text-slate-400 hidden lg:block shrink-0" />
                  <div className="overflow-hidden leading-tight flex-1">
                    <p className="text-sm font-bold text-slate-700 dark:text-slate-200 truncate">{nombreCompleto(p)}</p>
                    <p className="text-[10px] text-slate-500 font-mono">{p.dni}</p>
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); iniciarAsignacion(p); }}
                    title="Asignar turno tocando un horario"
                    className="p-2 bg-white/70 dark:bg-slate-900/60 hover:bg-indigo-600 hover:text-white text-indigo-600 dark:text-indigo-300 rounded-lg shadow-sm transition-colors shrink-0"
                  >
                    <CalendarPlus className="w-4 h-4" />
                  </button>
                </div>
              ))}
              {!loading && filteredPatients.length === 0 && (
                <p className="text-xs text-slate-400 text-center py-6">No se encontraron pacientes.</p>
              )}
            </div>
          </div>

          {/* Zona de borrado por arrastre: solo tiene sentido con mouse (escritorio) */}
          <div
            onDragOver={e => e.preventDefault()}
            onDrop={async (e) => {
              e.preventDefault();
              const type = e.dataTransfer.getData("type");
              if (type !== "appointment") return;
              const data = JSON.parse(e.dataTransfer.getData("payload"));
              if (window.confirm(`¿Eliminar turno de ${nombreCompleto(data.paciente)}?`)) {
                await fetch(`/api/turnos/${data.id}`, { method: 'DELETE' });
                setAppointments(prev => prev.filter(a => a.id !== data.id));
              }
            }}
            className="h-24 hidden lg:flex bg-rose-50 dark:bg-rose-900/20 border-2 border-dashed border-rose-200 dark:border-rose-800 rounded-xl flex-col items-center justify-center gap-2 text-rose-500 transition-all hover:bg-rose-100"
          >
            <Trash2 className="w-6 h-6" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-center px-4">Arrastrar para borrar</span>
          </div>
        </div>

        {/* CALENDARIO */}
        <div className="flex-1 min-w-0 flex flex-col gap-2 relative z-0">

          {/* Banner de modo asignar/mover */}
          {(assignPatient || moveAppt) && (
            <div className="flex items-center justify-between gap-3 bg-indigo-600 text-white px-4 py-2.5 rounded-xl shadow-lg text-xs md:text-sm font-bold">
              <span className="truncate">
                {assignPatient
                  ? `Toca un horario libre para asignar a ${nombreCompleto(assignPatient)}`
                  : `Toca el nuevo horario para mover el turno de ${nombreCompleto(moveAppt?.paciente)}`}
              </span>
              <button
                onClick={() => { setAssignPatient(null); setMoveAppt(null); }}
                className="flex items-center gap-1 bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-lg shrink-0"
              >
                <X className="w-3.5 h-3.5" /> Cancelar
              </button>
            </div>
          )}

          <div className="flex-1 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-x-auto custom-scrollbar">
            <div className="min-w-[800px] h-full flex flex-col">
              <div className="grid grid-cols-[60px_1fr_1fr_1fr_1fr_1fr] md:grid-cols-[80px_1fr_1fr_1fr_1fr_1fr] border-b border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50 sticky top-0 z-20">
                <div className="p-3 border-r border-slate-200 dark:border-slate-700"></div>
                {days.map((day) => (
                  <div key={day.toString()} className="p-3 text-center border-r border-slate-200 dark:border-slate-700 last:border-0">
                    <p className="text-[10px] font-bold text-slate-400 uppercase">{format(day, 'EEEE', { locale: es })}</p>
                    <div className={`inline-block px-2 py-0.5 rounded-full text-sm font-bold ${format(day, 'yyyy-MM-dd') === format(startOfToday(), 'yyyy-MM-dd') ? 'bg-indigo-600 text-white' : 'dark:text-white'}`}>{format(day, 'd')}</div>
                  </div>
                ))}
              </div>

              <div className="flex-1 overflow-y-auto custom-scrollbar">
                {loading ? (
                  <div className="p-10 text-center text-slate-400 font-bold">Cargando agenda...</div>
                ) : timeSlots.map((time) => (
                  <div key={time} className="grid grid-cols-[60px_1fr_1fr_1fr_1fr_1fr] md:grid-cols-[80px_1fr_1fr_1fr_1fr_1fr] border-b border-slate-100 dark:border-slate-700/50 last:border-0 min-h-[70px]">
                    <div className="flex items-start justify-center pt-2 border-r border-slate-100 dark:border-slate-700/50 text-[10px] font-bold text-slate-400">
                      <span className={`${time.endsWith(':30') ? 'opacity-30' : 'opacity-100'}`}>{time}</span>
                    </div>
                    {days.map((day) => {
                      const dayStr = format(day, 'yyyy-MM-dd');
                      const appointment = filteredAppointments.find(a => a.fecha === dayStr && a.hora === time);
                      const colors = (appointment && appointment.paciente && colorOptions[appointment.paciente.colorType])
                        ? colorOptions[appointment.paciente.colorType]
                        : colorOptions.default;
                      const modoSeleccion = !!(assignPatient || moveAppt);

                      return (
                        <div
                          key={`${day}-${time}`}
                          onDragOver={e => e.preventDefault()}
                          onDrop={e => onDrop(e, day, time)}
                          onClick={() => handleSlotTap(day, time, !!appointment)}
                          className={`relative border-r border-slate-100 dark:border-slate-700/50 last:border-0 ${modoSeleccion && !appointment ? 'cursor-pointer hover:bg-indigo-50 dark:hover:bg-indigo-900/20' : ''}`}
                        >
                          {appointment && (
                            <div
                              draggable
                              onDragStart={(e) => handleDragStart(e, appointment, "appointment")}
                              onClick={(e) => { e.stopPropagation(); if (!assignPatient && !moveAppt) setApptActionModal(appointment); }}
                              style={{ height: `calc(${(appointment.duracion / 30) * 100}% - 6px)`, zIndex: 10 }}
                              className={`absolute inset-x-1 top-0.5 rounded-xl px-2 py-1.5 shadow-sm border flex flex-col justify-between group cursor-pointer lg:cursor-grab active:cursor-grabbing transition-all ${colors.bg} ${colors.text} ${colors.border}`}
                            >
                              <div className="leading-tight overflow-hidden">
                                <p className="text-[11px] font-black truncate uppercase">{appointment.paciente?.nombre || 'Paciente'}</p>
                                <p className="text-[9px] font-medium opacity-80">{appointment.duracion} min</p>
                              </div>

                              <div className="flex items-center gap-1.5 mt-1 pt-1.5 border-t border-black/10">
                                <div className="w-4 h-4 rounded-full bg-white/60 flex items-center justify-center text-[9px] font-bold text-slate-800">
                                  {appointment.profesional?.nombre ? appointment.profesional.nombre.charAt(0) : '?'}
                                </div>
                                <span className="text-[9px] font-normal text-slate-900 dark:text-slate-200 truncate">
                                  {appointment.profesional?.nombre || 'Sin asignar'}
                                </span>
                              </div>

                              {/* Accesos rápidos solo visibles con mouse; en táctil se usa el modal de acciones */}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setNuevaEntradaModal({
                                    patientId: appointment.paciente?.id,
                                    patientName: nombreCompleto(appointment.paciente)
                                  });
                                }}
                                title="Agregar entrada en historia clínica"
                                className="absolute top-1 right-1 w-5 h-5 bg-white/80 hover:bg-white rounded-full hidden lg:flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20 shadow-sm cursor-pointer"
                              >
                                <Plus className="w-3 h-3 text-indigo-600" />
                              </button>

                              <div className="absolute -bottom-3 left-0 right-0 hidden lg:flex justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20">
                                <div className="flex gap-1 bg-white dark:bg-slate-700 rounded-full shadow-lg border border-slate-200 dark:border-slate-600 p-0.5 scale-75">
                                  <button onClick={(e) => { e.stopPropagation(); updateTurno(appointment.id, { duracion: appointment.duracion - 30 }) }} className="w-5 h-5 flex items-center justify-center text-indigo-600 text-xs font-black cursor-pointer"> - </button>
                                  <div className="w-px h-3 bg-slate-200 self-center"></div>
                                  <button onClick={(e) => { e.stopPropagation(); updateTurno(appointment.id, { duracion: appointment.duracion + 30 }) }} className="w-5 h-5 flex items-center justify-center text-indigo-600 cursor-pointer"> <ChevronDown className="w-3.5 h-3.5" /> </button>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Botón flotante para abrir el panel de pacientes (solo móvil) */}
        <button
          onClick={() => setShowPatientsPanel(true)}
          className="lg:hidden fixed bottom-5 right-5 z-40 p-4 bg-indigo-600 text-white rounded-full shadow-2xl active:scale-95 transition-transform"
          aria-label="Ver pacientes"
        >
          <Users className="w-6 h-6" />
        </button>
      </div>

      <NuevaEntradaModal
        patientId={nuevaEntradaModal?.patientId}
        patientName={nuevaEntradaModal?.patientName}
        isOpen={!!nuevaEntradaModal}
        onClose={() => setNuevaEntradaModal(null)}
      />

      {/* Modal de acciones sobre un turno (funciona con mouse y táctil) */}
      {apptActionModal && (
        <div
          className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center sm:p-4 bg-black/60 backdrop-blur-sm"
          onClick={() => setApptActionModal(null)}
        >
          <div
            className="bg-white dark:bg-slate-900 w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800"
            onClick={e => e.stopPropagation()}
          >
            <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50">
              <div className="min-w-0">
                <h2 className="text-lg font-black text-slate-900 dark:text-white truncate">
                  {nombreCompleto(apptActionModal.paciente) || 'Paciente'}
                </h2>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-0.5 capitalize">
                  {format(new Date(`${apptActionModal.fecha}T00:00:00`), "EEEE d 'de' MMMM", { locale: es })} · {apptActionModal.hora} hs
                </p>
              </div>
              <button onClick={() => setApptActionModal(null)} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition-colors shrink-0">
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-3 border border-slate-100 dark:border-slate-800">
                <span className="text-sm font-bold text-slate-600 dark:text-slate-300 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-indigo-500" /> Duración
                </span>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => updateTurno(apptActionModal.id, { duracion: apptActionModal.duracion - 30 })}
                    disabled={apptActionModal.duracion <= 30}
                    className="w-9 h-9 flex items-center justify-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-indigo-600 disabled:opacity-30 active:scale-95"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="font-black text-slate-900 dark:text-white min-w-[60px] text-center">{apptActionModal.duracion} min</span>
                  <button
                    onClick={() => updateTurno(apptActionModal.id, { duracion: apptActionModal.duracion + 30 })}
                    className="w-9 h-9 flex items-center justify-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-indigo-600 active:scale-95"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  onClick={() => { setAssignPatient(null); setMoveAppt(apptActionModal); setApptActionModal(null); }}
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 font-bold rounded-2xl border border-indigo-100 dark:border-indigo-800 active:scale-95 transition-all text-sm"
                >
                  <Move className="w-4 h-4" /> Mover turno
                </button>
                <button
                  onClick={() => {
                    setNuevaEntradaModal({
                      patientId: apptActionModal.paciente?.id,
                      patientName: nombreCompleto(apptActionModal.paciente)
                    });
                    setApptActionModal(null);
                  }}
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 font-bold rounded-2xl border border-emerald-100 dark:border-emerald-800 active:scale-95 transition-all text-sm"
                >
                  <FileText className="w-4 h-4" /> Nueva entrada HC
                </button>
              </div>

              <button
                onClick={() => eliminarTurno(apptActionModal)}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-300 font-bold rounded-2xl border border-rose-100 dark:border-rose-800 active:scale-95 transition-all text-sm"
              >
                <Trash2 className="w-4 h-4" /> Eliminar turno
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal detalle de turnos del paciente */}
      {patientDetailModal && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-3 md:p-4 bg-black/60 backdrop-blur-sm"
          onClick={() => setPatientDetailModal(null)}
        >
          <div
            className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden flex flex-col border border-slate-200 dark:border-slate-800 max-h-[90vh]"
            onClick={e => e.stopPropagation()} // Evita que el click cierre el modal si clickeas adentro
          >
            <div className="p-4 md:p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50 gap-3">
              <div className="min-w-0">
                <h2 className="text-lg md:text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-indigo-500 shrink-0" />
                  Turnos Agendados
                </h2>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1 truncate">
                  Paciente: {nombreCompleto(patientDetailModal)}
                </p>
              </div>
              <button onClick={() => setPatientDetailModal(null)} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition-colors shrink-0">
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <div className="p-4 md:p-6 flex-1 overflow-y-auto custom-scrollbar flex flex-col gap-3">
              {(() => {
                // Filtramos los turnos para este paciente específico y los ordenamos por fecha
                const turnosDelPaciente = appointments
                  .filter(a => a.paciente?.id === patientDetailModal.id)
                  .sort((a, b) => new Date(`${a.fecha}T${a.hora}`) - new Date(`${b.fecha}T${b.hora}`));

                if (turnosDelPaciente.length === 0) {
                  return (
                    <div className="text-center py-10 bg-slate-50 dark:bg-slate-800/30 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700">
                      <p className="text-slate-400 font-bold">Este paciente no tiene turnos agendados.</p>
                    </div>
                  );
                }

                const hoy = format(new Date(), 'yyyy-MM-dd');

                return turnosDelPaciente.map(turno => {
                  const esPasado = turno.fecha < hoy;
                  return (
                    <div key={turno.id} className={`p-4 rounded-2xl border ${esPasado ? 'border-slate-100 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-800/30 opacity-75' : 'border-indigo-100 bg-indigo-50/50 dark:border-indigo-900/30 dark:bg-indigo-900/20 shadow-sm'}`}>
                      <div className="flex justify-between items-start mb-2 gap-2 flex-wrap">
                        <div className="flex items-center gap-2 min-w-0">
                          <Clock className={`w-4 h-4 shrink-0 ${esPasado ? 'text-slate-400' : 'text-indigo-500'}`} />
                          <span className={`font-bold text-sm md:text-base ${esPasado ? 'text-slate-600 dark:text-slate-400' : 'text-indigo-700 dark:text-indigo-300'} capitalize`}>
                            {format(new Date(`${turno.fecha}T00:00:00`), "EEEE, dd 'de' MMMM yyyy", { locale: es })}
                          </span>
                        </div>
                        <span className="text-xs font-black bg-white dark:bg-slate-800 px-2 py-1 rounded-md shadow-sm text-slate-700 dark:text-slate-300 shrink-0">
                          {turno.hora} hs
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 mt-2">
                        <User className="w-3.5 h-3.5" />
                        <span>Profesional: <strong>{turno.profesional?.nombre || 'Sin asignar'}</strong></span>
                      </div>
                      <div className="mt-1 pl-5 text-[11px] text-slate-500 font-medium">
                        Duración: {turno.duracion} minutos
                      </div>
                    </div>
                  );
                });
              })()}
            </div>

            <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex flex-col-reverse sm:flex-row justify-end gap-3">
                <button onClick={() => setPatientDetailModal(null)} className="px-6 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold rounded-xl shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                  Cerrar
                </button>
                <button
                  onClick={() => iniciarAsignacion(patientDetailModal)}
                  className="px-6 py-2.5 bg-indigo-600 text-white font-bold rounded-xl shadow-md hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
                >
                  <CalendarPlus className="w-4 h-4" /> Asignar turno
                </button>
            </div>
          </div>
        </div>
      )}
    </MainLayout>
  );
};

export default AgendaPage;
