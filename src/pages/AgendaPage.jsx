import React, { useState } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon, 
  Plus, 
  Search,
  User,
  GripVertical,
  ChevronDown
} from 'lucide-react';
import { format, addDays, startOfWeek, addWeeks, subWeeks, startOfToday } from 'date-fns';
import { es } from 'date-fns/locale';

const AgendaPage = () => {
  const [selectedDate, setSelectedDate] = useState(startOfToday());
  const [searchTerm, setSearchTerm] = useState('');
  
  const [appointments, setAppointments] = useState([
    { id: 1, patientName: 'Martin Jakson', date: format(startOfToday(), 'yyyy-MM-dd'), time: '09:00', duration: 60, type: 'Limpieza' }
  ]);

  const [patients] = useState([
    { id: 'p1', name: 'Ana García', dni: '35.123.456' },
    { id: 'p2', name: 'Juan Pérez', dni: '28.987.654' },
    { id: 'p3', name: 'Lucía Fernández', dni: '40.555.222' },
  ]);

  const weekStart = startOfWeek(selectedDate, { weekStartsOn: 1 });
  const days = Array.from({ length: 5 }, (_, i) => addDays(weekStart, i));

  const timeSlots = [];
  for (let hour = 8; hour <= 20; hour++) {
    timeSlots.push(`${hour.toString().padStart(2, '0')}:00`);
    timeSlots.push(`${hour.toString().padStart(2, '0')}:30`);
  }

  const onDragStart = (e, patient) => {
    e.dataTransfer.setData("patient", JSON.stringify(patient));
  };

  const onDragOver = (e) => e.preventDefault();

  const onDrop = (e, date, time) => {
    e.preventDefault();
    const patientData = e.dataTransfer.getData("patient");
    if (patientData) {
      const patient = JSON.parse(patientData);
      const newAppointment = {
        id: Date.now(),
        patientName: patient.name,
        date: format(date, 'yyyy-MM-dd'),
        time: time,
        duration: 30,
        type: 'Consulta'
      };
      setAppointments(prev => [...prev, newAppointment]);
    }
  };

  const handleExtend = (e, id) => {
    e.stopPropagation();
    setAppointments(prev => prev.map(app => 
      app.id === id ? { ...app, duration: app.duration + 30 } : app
    ));
  };

  const handleReduce = (e, id) => {
    e.stopPropagation();
    setAppointments(prev => prev.map(app => 
      (app.id === id && app.duration > 30) ? { ...app, duration: app.duration - 30 } : app
    ));
  };

  const filteredPatients = patients.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.dni.includes(searchTerm)
  );

  return (
    <div className="flex h-full gap-4 overflow-hidden">
      
      {/* SIDEBAR DE PACIENTES */}
      <div className="w-72 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col overflow-hidden">
        <div className="p-4 border-b border-slate-100 dark:border-slate-700">
          <h2 className="text-sm font-bold text-slate-700 dark:text-slate-200 mb-3 flex items-center gap-2">
            <User className="w-4 h-4 text-indigo-500" />
            Pacientes
          </h2>
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input 
              type="text"
              placeholder="Buscar..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg outline-none dark:text-white"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-2 custom-scrollbar">
          {filteredPatients.map(patient => (
            <div 
              key={patient.id}
              draggable
              onDragStart={(e) => onDragStart(e, patient)}
              className="group flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl cursor-grab active:cursor-grabbing hover:border-indigo-400 transition-all"
            >
              <GripVertical className="w-4 h-4 text-slate-300" />
              <div className="overflow-hidden">
                <p className="text-sm font-bold text-slate-700 dark:text-slate-200 truncate">{patient.name}</p>
                <p className="text-[10px] text-slate-500">{patient.dni}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AGENDA */}
      <div className="flex-1 flex flex-col min-w-0 space-y-4">
        <div className="flex items-center justify-between bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg text-indigo-600">
              <CalendarIcon className="w-5 h-5" />
            </div>
            <h1 className="text-lg font-bold text-slate-800 dark:text-white capitalize">
              {format(weekStart, 'MMMM yyyy', { locale: es })}
            </h1>
          </div>
          <div className="flex bg-slate-100 dark:bg-slate-700 rounded-lg p-1">
            <button onClick={() => setSelectedDate(subWeeks(selectedDate, 1))} className="p-1.5 hover:bg-white rounded-md transition-all"><ChevronLeft className="w-4 h-4 text-slate-600 dark:text-slate-300" /></button>
            <button onClick={() => setSelectedDate(startOfToday())} className="px-3 py-1 text-xs font-bold text-slate-600 dark:text-slate-300">Hoy</button>
            <button onClick={() => setSelectedDate(addWeeks(selectedDate, 1))} className="p-1.5 hover:bg-white rounded-md transition-all"><ChevronRight className="w-4 h-4 text-slate-600 dark:text-slate-300" /></button>
          </div>
        </div>

        <div className="flex-1 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col min-w-[800px]">
          {/* Días */}
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

          {/* Cuerpo con Horas */}
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {timeSlots.map((time) => (
              <div key={time} className="grid grid-cols-[80px_1fr_1fr_1fr_1fr_1fr] border-b border-slate-100 dark:border-slate-700/50 last:border-0 min-h-[55px]">
                {/* Etiqueta de Hora con Media Hora Suave */}
                <div className="flex items-start justify-center pt-2 border-r border-slate-100 dark:border-slate-700/50 bg-slate-50/20">
                  <span className={`text-[10px] font-bold ${time.endsWith(':30') ? 'text-slate-300 dark:text-slate-600' : 'text-slate-500 dark:text-slate-400'}`}>
                    {time}
                  </span>
                </div>
                
                {days.map((day) => {
                  const dayStr = format(day, 'yyyy-MM-dd');
                  const appointment = appointments.find(a => a.date === dayStr && a.time === time);

                  return (
                    <div 
                      key={`${day}-${time}`} 
                      onDragOver={onDragOver}
                      onDrop={(e) => onDrop(e, day, time)}
                      className="relative border-r border-slate-100 dark:border-slate-700/50 last:border-0"
                    >
                      {appointment && (
                        <div 
                          style={{ 
                            height: `calc(${(appointment.duration / 30) * 100}% - 6px)`,
                            zIndex: 10
                          }}
                          className="absolute inset-x-1 top-0.5 bg-indigo-600 text-white rounded-lg px-2 py-1.5 shadow-lg flex flex-col justify-between group overflow-visible border border-indigo-500/50"
                        >
                          <div className="leading-tight">
                            <p className="text-[11px] font-bold truncate mb-0.5">{appointment.patientName}</p>
                            <p className="text-[9px] font-medium opacity-90 bg-white/20 inline-block px-1 rounded">
                              {appointment.duration} min
                            </p>
                          </div>

                          {/* MANILLAR PARA ESTIRAR */}
                          <div className="absolute -bottom-3 left-0 right-0 flex justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20">
                            <div className="flex gap-1 bg-white dark:bg-slate-700 rounded-full shadow-lg border border-slate-200 dark:border-slate-600 p-0.5 scale-90">
                              <button 
                                onClick={(e) => handleReduce(e, appointment.id)}
                                className="w-5 h-5 flex items-center justify-center text-indigo-600 dark:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-600 rounded-full text-xs font-black"
                              > - </button>
                              <div className="w-px h-3 bg-slate-200 dark:bg-slate-600 self-center"></div>
                              <button 
                                onClick={(e) => handleExtend(e, appointment.id)}
                                className="w-5 h-5 flex items-center justify-center text-indigo-600 dark:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-600 rounded-full"
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
    </div>
  );
};

export default AgendaPage;
