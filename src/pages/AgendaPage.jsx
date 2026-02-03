import React, { useState } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon, 
  Plus, 
  Search,
  User,
  GripVertical
} from 'lucide-react';
import { format, addDays, startOfWeek, addWeeks, subWeeks, startOfToday } from 'date-fns';
import { es } from 'date-fns/locale';

const AgendaPage = () => {
  const [selectedDate, setSelectedDate] = useState(startOfToday());
  const [searchTerm, setSearchTerm] = useState('');
  
  // Estado para los turnos ya agendados (esto vendría de tu base de datos después)
  const [appointments, setAppointments] = useState([
    { id: 1, patientName: 'Martin Jakson', date: format(startOfToday(), 'yyyy-MM-dd'), time: '09:00', type: 'Limpieza' }
  ]);

  // Lista de pacientes de prueba para arrastrar
  const [patients] = useState([
    { id: 'p1', name: 'Ana García', dni: '35.123.456' },
    { id: 'p2', name: 'Juan Pérez', dni: '28.987.654' },
    { id: 'p3', name: 'Lucía Fernández', dni: '40.555.222' },
    { id: 'p4', name: 'Roberto Gómez', dni: '32.111.999' },
  ]);

  const weekStart = startOfWeek(selectedDate, { weekStartsOn: 1 });
  const days = Array.from({ length: 5 }, (_, i) => addDays(weekStart, i));
  const timeSlots = Array.from({ length: 13 }, (_, i) => `${(i + 8).toString().padStart(2, '0')}:00`);

  // --- LÓGICA DE ARRASTRE (DRAG & DROP) ---
  
  const onDragStart = (e, patient) => {
    // Guardamos la información del paciente en el "evento" de arrastre
    e.dataTransfer.setData("patient", JSON.stringify(patient));
  };

  const onDragOver = (e) => {
    // Esto es necesario para permitir que se pueda soltar
    e.preventDefault();
  };

  const onDrop = (e, date, time) => {
    e.preventDefault();
    const patientData = e.dataTransfer.getData("patient");
    
    if (patientData) {
      const patient = JSON.parse(patientData);
      
      // Creamos el nuevo turno
      const newAppointment = {
        id: Date.now(),
        patientName: patient.name,
        date: format(date, 'yyyy-MM-dd'),
        time: time,
        type: 'Consulta'
      };

      setAppointments([...appointments, newAppointment]);
      alert(`Turno agendado para ${patient.name} el ${format(date, 'dd/MM')} a las ${time}`);
    }
  };

  // Filtrar pacientes por búsqueda
  const filteredPatients = patients.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.dni.includes(searchTerm)
  );

  return (
    <div className="flex h-full gap-4 overflow-hidden">
      
      {/* PANEL IZQUIERDO: Buscador de Pacientes (Draggable) */}
      <div className="w-72 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col overflow-hidden">
        <div className="p-4 border-b border-slate-100 dark:border-slate-700">
          <h2 className="text-sm font-bold text-slate-700 dark:text-slate-200 mb-3 flex items-center gap-2">
            <User className="w-4 h-4 text-indigo-500" />
            Arrastrar Paciente
          </h2>
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input 
              type="text"
              placeholder="Buscar por nombre o DNI..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none dark:text-white"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-2 custom-scrollbar">
          {filteredPatients.map(patient => (
            <div 
              key={patient.id}
              draggable
              onDragStart={(e) => onDragStart(e, patient)}
              className="group flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl cursor-grab active:cursor-grabbing hover:border-indigo-400 dark:hover:border-indigo-500 transition-all shadow-sm"
            >
              <div className="p-2 bg-white dark:bg-slate-800 rounded-lg border border-slate-100 dark:border-slate-700 text-slate-400 group-hover:text-indigo-500">
                <GripVertical className="w-4 h-4" />
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-bold text-slate-700 dark:text-slate-200 truncate">{patient.name}</p>
                <p className="text-[10px] text-slate-500">{patient.dni}</p>
              </div>
            </div>
          ))}
          {filteredPatients.length === 0 && (
            <p className="text-center text-xs text-slate-400 mt-4">No se encontraron pacientes</p>
          )}
        </div>
      </div>

      {/* PANEL DERECHO: La Agenda */}
      <div className="flex-1 flex flex-col min-w-0 space-y-4">
        {/* Controles superiores */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg text-indigo-600 dark:text-indigo-400">
              <CalendarIcon className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-800 dark:text-white capitalize leading-none mb-1">
                {format(weekStart, 'MMMM yyyy', { locale: es })}
              </h1>
              <p className="text-[10px] text-slate-500 uppercase font-semibold">
                Semana {format(weekStart, 'd')} - {format(days[4], 'd')}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center bg-slate-100 dark:bg-slate-700 rounded-lg p-1">
              <button onClick={() => setSelectedDate(subWeeks(selectedDate, 1))} className="p-1.5 hover:bg-white dark:hover:bg-slate-600 rounded-md transition-all text-slate-600 dark:text-slate-300">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button onClick={() => setSelectedDate(startOfToday())} className="px-3 py-1 text-xs font-bold hover:bg-white dark:hover:bg-slate-600 rounded-md transition-all text-slate-600 dark:text-slate-300">
                Hoy
              </button>
              <button onClick={() => setSelectedDate(addWeeks(selectedDate, 1))} className="p-1.5 hover:bg-white dark:hover:bg-slate-600 rounded-md transition-all text-slate-600 dark:text-slate-300">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Grilla Semanal */}
        <div className="flex-1 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col min-w-[800px]">
          {/* Header de Días */}
          <div className="grid grid-cols-[80px_1fr_1fr_1fr_1fr_1fr] border-b border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50">
            <div className="p-3 border-r border-slate-200 dark:border-slate-700"></div>
            {days.map((day) => (
              <div key={day.toString()} className="p-3 text-center border-r border-slate-200 dark:border-slate-700 last:border-0">
                <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">
                  {format(day, 'EEEE', { locale: es })}
                </p>
                <div className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold ${format(day, 'yyyy-MM-dd') === format(startOfToday(), 'yyyy-MM-dd') ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200' : 'text-slate-700 dark:text-slate-200'}`}>
                  {format(day, 'd')}
                </div>
              </div>
            ))}
          </div>

          {/* Cuerpo de la Agenda */}
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {timeSlots.map((time) => (
              <div key={time} className="grid grid-cols-[80px_1fr_1fr_1fr_1fr_1fr] border-b border-slate-100 dark:border-slate-700/50 last:border-0 min-h-[70px]">
                {/* Hora */}
                <div className="flex items-start justify-center pt-3 border-r border-slate-100 dark:border-slate-700/50 bg-slate-50/20 dark:bg-slate-800/20">
                  <span className="text-[11px] font-bold text-slate-400">{time}</span>
                </div>
                
                {/* Celdas de Días (Zonas de Soltado) */}
                {days.map((day) => {
                  const dayStr = format(day, 'yyyy-MM-dd');
                  const appointment = appointments.find(a => a.date === dayStr && a.time === time);

                  return (
                    <div 
                      key={`${day}-${time}`} 
                      onDragOver={onDragOver}
                      onDrop={(e) => onDrop(e, day, time)}
                      className={`relative border-r border-slate-100 dark:border-slate-700/50 last:border-0 p-1 transition-colors ${!appointment ? 'hover:bg-indigo-50/30 dark:hover:bg-indigo-900/10' : ''}`}
                    >
                      {appointment ? (
                        <div className="h-full w-full bg-indigo-100 dark:bg-indigo-900/40 border-l-4 border-indigo-500 rounded-md p-2 shadow-sm animate-in fade-in zoom-in duration-300">
                          <p className="text-[11px] font-bold text-indigo-700 dark:text-indigo-300 truncate">
                            {appointment.patientName}
                          </p>
                          <p className="text-[9px] text-indigo-500 dark:text-indigo-400/70 font-medium">
                            {appointment.type}
                          </p>
                        </div>
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100">
                           <div className="w-full h-full border-2 border-dashed border-indigo-200 dark:border-indigo-800 m-1 rounded-lg flex items-center justify-center text-indigo-300">
                              <Plus className="w-4 h-4" />
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
  );
};

export default AgendaPage;
