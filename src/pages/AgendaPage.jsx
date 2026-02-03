import React, { useState, useEffect, useRef } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon, 
  Search,
  User,
  GripVertical,
  ChevronDown,
  Palette,
  X
} from 'lucide-react';
import { format, addDays, startOfWeek, addWeeks, subWeeks, startOfToday } from 'date-fns';
import { es } from 'date-fns/locale';
import MainLayout from '../components/MainLayout'; // Importamos el Layout

const colorOptions = {
  default: { label: 'Neutro', bg: 'bg-indigo-100 dark:bg-indigo-900/40', text: 'text-indigo-700 dark:text-indigo-200', border: 'border-indigo-200 dark:border-indigo-700' },
  green:   { label: 'Confirmado', bg: 'bg-emerald-100 dark:bg-emerald-900/40', text: 'text-emerald-700 dark:text-emerald-200', border: 'border-emerald-200 dark:border-emerald-700' },
  amber:   { label: 'Pendiente', bg: 'bg-amber-100 dark:bg-amber-900/40', text: 'text-amber-800 dark:text-amber-200', border: 'border-amber-200 dark:border-amber-700' },
  red:     { label: 'Urgente', bg: 'bg-rose-100 dark:bg-rose-900/40',     text: 'text-rose-800 dark:text-rose-200',   border: 'border-rose-200 dark:border-rose-700' },
};

const AgendaPage = () => {
  const [selectedDate, setSelectedDate] = useState(startOfToday());
  const [searchTerm, setSearchTerm] = useState('');
  const [activeColorMenuId, setActiveColorMenuId] = useState(null);
  const menuRef = useRef(null);

  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  // CARGAR DATOS
  useEffect(() => {
    const loadData = async () => {
      try {
        const [resPacientes, resTurnos] = await Promise.all([
          fetch('/api/pacientes'),
          fetch('/api/turnos')
        ]);
        const dataPacientes = await resPacientes.json();
        const dataTurnos = await resTurnos.json();
        setPatients(dataPacientes);
        setAppointments(dataTurnos);
      } catch (error) {
        console.error("Error cargando datos:", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const weekStart = startOfWeek(selectedDate, { weekStartsOn: 1 });
  const days = Array.from({ length: 5 }, (_, i) => addDays(weekStart, i));
  const timeSlots = [];
  for (let hour = 8; hour <= 20; hour++) {
    timeSlots.push(`${hour.toString().padStart(2, '0')}:00`);
    timeSlots.push(`${hour.toString().padStart(2, '0')}:30`);
  }

  // --- LÓGICA DE TURNOS (Persistencia) ---
  const onDrop = async (e, date, time) => {
    e.preventDefault();
    const patientData = e.dataTransfer.getData("patient");
    if (patientData) {
      const patient = JSON.parse(patientData);
      const nuevoTurnoData = {
        fecha: format(date, 'yyyy-MM-dd'),
        hora: time,
        duracion: 30,
        colorType: 'default',
        pacienteId: patient.id
      };
      try {
        const response = await fetch('/api/turnos', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(nuevoTurnoData)
        });
        const guardado = await response.json();
        setAppointments(prev => [...prev, { ...guardado, paciente: patient }]);
      } catch (error) {}
    }
  };

  const updateTurno = async (id, campos) => {
    try {
      const response = await fetch(`/api/turnos/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(campos)
      });
      const actualizado = await response.json();
      setAppointments(prev => prev.map(app => app.id === id ? { ...app, ...actualizado } : app));
    } catch (error) {}
  };

  const filteredPatients = patients.filter(p => 
    p.nombre.toLowerCase().includes(searchTerm.toLowerCase()) || p.dni.includes(searchTerm)
  );

  // Título y controles para el Header
  const headerActions = (
    <div className="flex bg-slate-100 dark:bg-slate-700 rounded-lg p-1">
      <button onClick={() => setSelectedDate(subWeeks(selectedDate, 1))} className="p-1.5 hover:bg-white rounded-md transition-all"><ChevronLeft className="w-4 h-4 text-slate-600 dark:text-slate-300" /></button>
      <button onClick={() => setSelectedDate(startOfToday())} className="px-3 py-1 text-xs font-bold text-slate-600 dark:text-slate-300">Hoy</button>
      <button onClick={() => setSelectedDate(addWeeks(selectedDate, 1))} className="p-1.5 hover:bg-white rounded-md transition-all"><ChevronRight className="w-4 h-4 text-slate-600 dark:text-slate-300" /></button>
    </div>
  );

  return (
    <MainLayout 
      title="Agenda Semanal" 
      activePage="agenda" 
      extraHeader={headerActions}
    >
      <div className="flex h-full gap-4 overflow-hidden" onClick={() => setActiveColorMenuId(null)}>
        
        {/* PANEL IZQUIERDO DE LA AGENDA (Pacientes para arrastrar) */}
        <div className="w-72 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col overflow-hidden" onClick={e => e.stopPropagation()}>
          <div className="p-4 border-b border-slate-100 dark:border-slate-700">
            <h2 className="text-sm font-bold text-slate-700 dark:text-slate-200 mb-3 flex items-center gap-2">
              <User className="w-4 h-4 text-indigo-500" /> Arrastrar Paciente
            </h2>
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input 
                type="text" placeholder="Buscar..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg outline-none dark:text-white"
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-2 custom-scrollbar">
            {filteredPatients.map(patient => (
              <div 
                key={patient.id} 
                draggable 
                onDragStart={(e) => e.dataTransfer.setData("patient", JSON.stringify(patient))}
                className="group flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl cursor-grab active:cursor-grabbing hover:border-indigo-400 transition-all shadow-sm"
              >
                <GripVertical className="w-4 h-4 text-slate-300" />
                <div className="overflow-hidden">
                  <p className="text-sm font-bold text-slate-700 dark:text-slate-200 truncate">{patient.nombre}</p>
                  <p className="text-[10px] text-slate-500">{patient.dni}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* GRILLA DE LA AGENDA */}
        <div className="flex-1 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col min-w-[800px] relative">
          <div className="grid grid-cols-[80px_1fr_1fr_1fr_1fr_1fr] border-b border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50 sticky top-0 z-20">
            <div className="p-3 border-r border-slate-200"></div>
            {days.map((day) => (
              <div key={day.toString()} className="p-3 text-center border-r border-slate-200 last:border-0">
                <p className="text-[10px] font-bold text-slate-400 uppercase">{format(day, 'EEEE', { locale: es })}</p>
                <div className={`inline-block px-2 py-0.5 rounded-full text-sm font-bold ${format(day, 'yyyy-MM-dd') === format(startOfToday(), 'yyyy-MM-dd') ? 'bg-indigo-600 text-white' : 'dark:text-white'}`}>
                  {format(day, 'd')}
                </div>
              </div>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {timeSlots.map((time) => (
              <div key={time} className="grid grid-cols-[80px_1fr_1fr_1fr_1fr_1fr] border-b border-slate-100 dark:border-slate-700/50 last:border-0 min-h-[55px]">
                <div className="flex items-start justify-center pt-2 border-r border-slate-100 dark:border-slate-700/50 bg-slate-50/20 text-[10px] font-bold text-slate-400">
                  <span className={`${time.endsWith(':30') ? 'opacity-30' : 'opacity-100'}`}>{time}</span>
                </div>
                {days.map((day) => {
                  const dayStr = format(day, 'yyyy-MM-dd');
                  const appointment = appointments.find(a => a.fecha === dayStr && a.hora === time);
                  const colors = appointment ? colorOptions[appointment.colorType] : colorOptions.default;
                  const isMenuOpen = appointment && activeColorMenuId === appointment.id;

                  return (
                    <div key={`${day}-${time}`} onDragOver={(e) => e.preventDefault()} onDrop={(e) => onDrop(e, day, time)} className="relative border-r border-slate-100 dark:border-slate-700/50 last:border-0">
                      {appointment && (
                        <div 
                          style={{ height: `calc(${(appointment.duracion / 30) * 100}% - 6px)`, zIndex: isMenuOpen ? 30 : 10 }}
                          className={`absolute inset-x-1 top-0.5 rounded-lg px-2 py-1.5 shadow-sm border flex flex-col justify-between group transition-all ${colors.bg} ${colors.text} ${colors.border}`}
                        >
                          <div className="flex justify-between items-start">
                            <div className="leading-tight overflow-hidden">
                              <p className="text-[11px] font-bold truncate">{appointment.paciente?.nombre || 'Paciente'}</p>
                              <p className="text-[9px] font-medium opacity-80">{appointment.duracion} min</p>
                            </div>
                            <button onClick={(e) => { e.stopPropagation(); setActiveColorMenuId(appointment.id); }} className="p-1 opacity-60 hover:opacity-100"><Palette className="w-3 h-3" /></button>
                          </div>
                          {/* Botones de estirar/achicar */}
                          <div className="absolute -bottom-3 left-0 right-0 flex justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20">
                            <div className="flex gap-1 bg-white dark:bg-slate-700 rounded-full shadow-lg border border-slate-200 p-0.5 scale-75">
                              <button onClick={(e) => { e.stopPropagation(); updateTurno(appointment.id, { duracion: appointment.duracion - 30 }) }} className="w-5 h-5 flex items-center justify-center text-indigo-600 text-xs font-black"> - </button>
                              <button onClick={(e) => { e.stopPropagation(); updateTurno(appointment.id, { duracion: appointment.duracion + 30 }) }} className="w-5 h-5 flex items-center justify-center text-indigo-600"><ChevronDown className="w-3.5 h-3.5" /></button>
                            </div>
                          </div>
                          {/* Menú de colores */}
                          {isMenuOpen && (
                            <div ref={menuRef} className="absolute top-7 right-0 bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-slate-200 p-2 z-40 flex gap-2">
                              {Object.entries(colorOptions).map(([type, style]) => (
                                <button key={type} onClick={(e) => { e.stopPropagation(); updateTurno(appointment.id, { colorType: type }); setActiveColorMenuId(null); }} className={`w-5 h-5 rounded-full border ${style.bg} ${style.border}`} />
                              ))}
                            </div>
                          )}
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
