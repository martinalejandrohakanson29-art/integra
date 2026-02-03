import React, { useState } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon, 
  Plus,
  Clock
} from 'lucide-react';
import { 
  format, 
  addDays, 
  subDays, 
  startOfWeek, 
  addWeeks, 
  subWeeks,
  startOfToday, 
  parseISO 
} from 'date-fns';
import { es } from 'date-fns/locale';

const AgendaPage = () => {
  const [selectedDate, setSelectedDate] = useState(startOfToday());

  // Calculamos el inicio de la semana (Lunes)
  const weekStart = startOfWeek(selectedDate, { weekStartsOn: 1 });
  
  // Generamos los 5 días (Lunes a Viernes)
  const days = Array.from({ length: 5 }, (_, i) => addDays(weekStart, i));

  // Horas de 08:00 a 20:00
  const timeSlots = Array.from({ length: 13 }, (_, i) => `${(i + 8).toString().padStart(2, '0')}:00`);

  return (
    <div className="flex flex-col h-full space-y-4">
      {/* Cabecera */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
        <div className="flex items-center gap-4">
          <div className="p-2.5 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
            <CalendarIcon className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-800 dark:text-white capitalize">
              {format(weekStart, 'MMMM yyyy', { locale: es })}
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Semana del {format(weekStart, 'd')} al {format(days[4], 'd')}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center bg-slate-100 dark:bg-slate-700 rounded-lg p-1">
            <button onClick={() => setSelectedDate(subWeeks(selectedDate, 1))} className="p-1.5 hover:bg-white dark:hover:bg-slate-600 rounded-md transition-all text-slate-600 dark:text-slate-300">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button onClick={() => setSelectedDate(startOfToday())} className="px-3 py-1 text-xs font-semibold hover:bg-white dark:hover:bg-slate-600 rounded-md transition-all text-slate-600 dark:text-slate-300">
              Hoy
            </button>
            <button onClick={() => setSelectedDate(addWeeks(selectedDate, 1))} className="p-1.5 hover:bg-white dark:hover:bg-slate-600 rounded-md transition-all text-slate-600 dark:text-slate-300">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          
          <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all shadow-sm">
            <Plus className="w-4 h-4" />
            <span>Nuevo Turno</span>
          </button>
        </div>
      </div>

      {/* Grilla Semanal */}
      <div className="flex-1 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col">
        {/* Encabezado de Días */}
        <div className="grid grid-cols-[80px_1fr_1fr_1fr_1fr_1fr] border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
          <div className="p-3 border-r border-slate-200 dark:border-slate-700"></div>
          {days.map((day) => (
            <div key={day.toString()} className="p-3 text-center border-r border-slate-200 dark:border-slate-700 last:border-0">
              <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                {format(day, 'EEE', { locale: es })}
              </p>
              <p className={`text-lg font-bold ${format(day, 'yyyy-MM-dd') === format(startOfToday(), 'yyyy-MM-dd') ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-700 dark:text-slate-200'}`}>
                {format(day, 'd')}
              </p>
            </div>
          ))}
        </div>

        {/* Cuerpo de la Grilla */}
        <div className="flex-1 overflow-y-auto">
          {timeSlots.map((time) => (
            <div key={time} className="grid grid-cols-[80px_1fr_1fr_1fr_1fr_1fr] border-b border-slate-100 dark:border-slate-700/50 last:border-0 min-h-[60px]">
              {/* Hora */}
              <div className="flex items-center justify-center border-r border-slate-100 dark:border-slate-700/50 bg-slate-50/30 dark:bg-slate-800/30">
                <span className="text-xs font-medium text-slate-400 dark:text-slate-500">{time}</span>
              </div>
              
              {/* Columnas de Días */}
              {days.map((day) => (
                <div 
                  key={`${day}-${time}`} 
                  className="group relative border-r border-slate-100 dark:border-slate-700/50 last:border-0 hover:bg-indigo-50/30 dark:hover:bg-indigo-900/10 transition-colors cursor-pointer"
                  onClick={() => console.log(`Agendar para ${format(day, 'dd/MM')} a las ${time}`)}
                >
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <Plus className="w-4 h-4 text-indigo-400" />
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AgendaPage;
