import React, { useState, useEffect, useRef } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon, 
  Search, 
  User,
  GripVertical, 
  ChevronDown, 
  X, 
  Trash2 
} from 'lucide-react';
import { format, addDays, startOfWeek, addWeeks, subWeeks, startOfToday } from 'date-fns';
import { es } from 'date-fns/locale';
import MainLayout from '../components/MainLayout';

// Definimos los estilos de colores que coinciden con los que el paciente puede tener
const colorOptions = {
  default: { bg: 'bg-indigo-100 dark:bg-indigo-900/40', text: 'text-indigo-700 dark:text-indigo-200', border: 'border-indigo-200 dark:border-indigo-700' },
  green:   { bg: 'bg-emerald-100 dark:bg-emerald-900/40', text: 'text-emerald-700 dark:text-emerald-200', border: 'border-emerald-200 dark:border-emerald-700' },
  amber:   { bg: 'bg-amber-100 dark:bg-amber-900/40', text: 'text-amber-800 dark:text-amber-200', border: 'border-amber-200 dark:border-amber-700' },
  red:     { bg: 'bg-rose-100 dark:bg-rose-900/40',     text: 'text-rose-800 dark:text-rose-200',   border: 'border-rose-200 dark:border-rose-700' },
};

const AgendaPage = () => {
  const [selectedDate, setSelectedDate] = useState(startOfToday());
  const [searchTerm, setSearchTerm] = useState('');
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  // Cargar datos de la base de datos
  const loadData = async () => {
    try {
      const [resP, resT] = await Promise.all([
        fetch('/api/pacientes'),
        fetch('/api/turnos')
      ]);
      setPatients(await resP.json());
      setAppointments(await resT.json());
    } catch (error) {
      console.error("Error al cargar datos:", error);
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

  // --- LÓGICA DE ARRASTRE ---
  const handleDragStart = (e, data, type) => {
    e.dataTransfer.setData("type", type);
    e.dataTransfer.setData("payload", JSON.stringify(data));
  };

  const onDrop = async (e, date, time) => {
    e.preventDefault();
    const type = e.dataTransfer.getData("type");
    const data = JSON.parse(e.dataTransfer.getData("payload"));

    if (type === "patient") {
      // Crear nuevo turno heredando el color del paciente
      const res = await fetch('/api/turnos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          fecha: format(date, 'yyyy-MM-dd'), 
          hora: time, 
          duracion: 30, 
          pacienteId: data.id 
        })
      });
      const nuevo = await res.json();
      setAppointments(prev => [...prev, nuevo]);
    } 
    else if (type === "appointment") {
      // Mover turno existente a nueva fecha/hora
      const res = await fetch(`/api/turnos/${data.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          fecha: format(date, 'yyyy-MM-dd'), 
          hora: time 
        })
      });
      const actualizado = await res.json();
      setAppointments(prev => prev.map(a => a.id === data.id ? actualizado : a));
    }
  };

  const deleteAppointment = async (e) => {
    e.preventDefault();
    const type = e.dataTransfer.getData("type");
    if (type !== "appointment") return;
    
    const data = JSON.parse(e.dataTransfer.getData("payload"));
    if (window.confirm(`¿Eliminar turno de ${data.paciente?.nombre}?`)) {
      await fetch(`/api/turnos/${data.id}`, { method: 'DELETE' });
      setAppointments(prev => prev.filter(a => a.id !== data.id));
    }
  };

  const updateTurno = async (id, campos) => {
    const res = await fetch(`/api/turnos/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(campos)
    });
    const actualizado = await res.json();
    setAppointments(prev => prev.map(a => a.id === id ? actualizado : a));
  };

  const filteredPatients = patients.filter(p => 
    p.nombre.toLowerCase().includes(searchTerm.toLowerCase()) || p.dni.includes(searchTerm)
  );

  const headerActions = (
    <div className="flex bg-slate-100 dark:bg-slate-700 rounded-lg p-1">
      <button onClick={() => setSelectedDate(subWeeks(selectedDate, 1))} className="p-1.5 hover:bg-white rounded-md transition-all"><ChevronLeft className="w-4 h-4 text-slate-600 dark:text-slate-300" /></button>
      <button onClick={() => setSelectedDate(startOfToday())} className="px-3 py-1 text-xs font-bold text-slate-600 dark:text-slate-300">Hoy</button>
      <button onClick={() => setSelectedDate(addWeeks(selectedDate, 1))} className="p-1.5 hover:bg-white rounded-md transition-all"><ChevronRight className="w-4 h-4 text-slate-600 dark:text-slate-300" /></button>
    </div>
  );

  return (
    <MainLayout title="Agenda Semanal" activePage="agenda" extraHeader={headerActions}>
      <div className="flex h-full gap-4 overflow-hidden">
        
        {/* PANEL IZQUIERDO */}
        <div className="w-72 flex flex-col gap-4 overflow-hidden">
          <div className="flex-1 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col overflow-hidden">
            <div className="p-4 border-b border-slate-100 dark:border-slate-700">
              <h2 className="text-sm font-bold text-slate-700 dark:text-slate-200 mb-3 flex items-center gap-2">
                <User className="w-4 h-4 text-indigo-500" /> Pacientes
              </h2>
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input type="text" placeholder="Buscar..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 rounded-lg outline-none dark:text-white" />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-3 space-y-2 custom-scrollbar">
              {filteredPatients.map(p => (
                <div 
                    key={p.id} 
                    draggable 
                    onDragStart={(e) => handleDragStart(e, p, "patient")} 
                    className={`group flex items-center gap-3 p-3 border border-transparent rounded-xl cursor-grab active:cursor-grabbing hover:border-indigo-400 transition-all shadow-sm ${colorOptions[p.colorType]?.bg || 'bg-slate-50'}`}
                >
                  <GripVertical className="w-4 h-4 text-slate-400" />
                  <div className="overflow-hidden leading-tight">
                    <p className="text-sm font-bold text-slate-700 dark:text-slate-200 truncate">{p.nombre}</p>
                    <p className="text-[10px] text-slate-500">{p.dni}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div 
            onDragOver={e => e.preventDefault()} 
            onDrop={deleteAppointment}
            className="h-24 bg-rose-50 dark:bg-rose-900/20 border-2 border-dashed border-rose-200 dark:border-rose-800 rounded-xl flex flex-col items-center justify-center gap-2 text-rose-500 transition-all hover:bg-rose-100"
          >
            <Trash2 className="w-6 h-6" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-center px-4">Arrastrar turno aquí para borrar</span>
          </div>
        </div>

        {/* GRILLA AGENDA */}
        <div className="flex-1 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col min-w-[800px] relative">
          <div className="grid grid-cols-[80px_1fr_1fr_1fr_1fr_1fr] border-b border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50 sticky top-0 z-20">
            <div className="p-3 border-r border-slate-200"></div>
            {days.map((day) => (
              <div key={day.toString()} className="p-3 text-center border-r border-slate-200 last:border-0">
                <p className="text-[10px] font-bold text-slate-400 uppercase">{format(day, 'EEEE', { locale: es })}</p>
                <div className={`inline-block px-2 py-0.5 rounded-full text-sm font-bold ${format(day, 'yyyy-MM-dd') === format(startOfToday(), 'yyyy-MM-dd') ? 'bg-indigo-600 text-white' : 'dark:text-white'}`}>{format(day, 'd')}</div>
              </div>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {timeSlots.map((time) => (
              <div key={time} className="grid grid-cols-[80px_1fr_1fr_1fr_1fr_1fr] border-b border-slate-100 dark:border-slate-700/50 last:border-0 min-h-[55px]">
                <div className="flex items-start justify-center pt-2 border-r border-slate-100 bg-slate-50/20 text-[10px] font-bold text-slate-400">
                  <span className={`${time.endsWith(':30') ? 'opacity-30 text-xs font-normal' : 'opacity-100'}`}>{time}</span>
                </div>
                {days.map((day) => {
                  const dayStr = format(day, 'yyyy-MM-dd');
                  const appointment = appointments.find(a => a.fecha === dayStr && a.hora === time);
                  
                  // ASIGNAR COLOR SEGÚN EL PACIENTE
                  const colors = (appointment && appointment.paciente && colorOptions[appointment.paciente.colorType]) 
                    ? colorOptions[appointment.paciente.colorType] 
                    : colorOptions.default;

                  return (
                    <div key={`${day}-${time}`} onDragOver={e => e.preventDefault()} onDrop={e => onDrop(e, day, time)} className="relative border-r border-slate-100 dark:border-slate-700/50 last:border-0">
                      {appointment && (
                        <div 
                          draggable 
                          onDragStart={(e) => handleDragStart(e, appointment, "appointment")}
                          style={{ height: `calc(${(appointment.duracion / 30) * 100}% - 6px)`, zIndex: 10 }}
                          className={`absolute inset-x-1 top-0.5 rounded-lg px-2 py-1.5 shadow-sm border flex flex-col justify-between group cursor-grab active:cursor-grabbing transition-all ${colors.bg} ${colors.text} ${colors.border}`}
                        >
                          <div className="leading-tight overflow-hidden">
                            <p className="text-[11px] font-bold truncate">{appointment.paciente?.nombre || 'Paciente'}</p>
                            <p className="text-[9px] font-medium opacity-80">{appointment.duracion} min</p>
                          </div>
                          
                          {/* BOTONES DE REDIMENSIONAR */}
                          <div className="absolute -bottom-3 left-0 right-0 flex justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20">
                            <div className="flex gap-1 bg-white dark:bg-slate-700 rounded-full shadow-lg border border-slate-200 p-0.5 scale-75">
                              <button 
                                onClick={(e) => { e.stopPropagation(); updateTurno(appointment.id, { duracion: appointment.duracion - 30 }) }} 
                                className="w-5 h-5 flex items-center justify-center text-indigo-600 text-xs font-black"
                              > - </button>
                              <div className="w-px h-3 bg-slate-200 self-center"></div>
                              <button 
                                onClick={(e) => { e.stopPropagation(); updateTurno(appointment.id, { duracion: appointment.duracion + 30 }) }} 
                                className="w-5 h-5 flex items-center justify-center text-indigo-600"
                              >
                                <ChevronDown className="w-3.5 h-3.5" />
                              </button>
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
    </MainLayout>
  );
};

export default AgendaPage;
