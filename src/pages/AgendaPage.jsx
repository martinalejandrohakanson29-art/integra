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
  startOfToday, 
  parseISO 
} from 'date-fns';
import { es } from 'date-fns/locale';

const AgendaPage = () => {
  // Estado para la fecha seleccionada (por defecto hoy)
  const [selectedDate, setSelectedDate] = useState(startOfToday());

  // Generamos las horas de la agenda (de 8:00 a 20:00)
  const timeSlots = Array.from({ length: 13 }, (_, i) => {
    const hour = i + 8;
    return `${hour.toString().padStart(2, '0')}:00`;
  });

  // Funciones para navegar en los días
  const handlePrevDay = () => setSelectedDate(subDays(selectedDate, 1));
  const handleNextDay = () => setSelectedDate(addDays(selectedDate, 1));
  const handleToday = () => setSelectedDate(startOfToday());
  
  const handleDateChange = (e) => {
    const date = parseISO(e.target.value);
    setSelectedDate(date);
  };

  return (
    <div className="space-y-6">
      {/* Cabecera de la Agenda */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
            <CalendarIcon className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800 dark:text-white capitalize">
              {format(selectedDate, 'EEEE, d', { locale: es })}
            </h1>
            <p className="text-slate-500 dark:text-slate-400 capitalize">
              {format(selectedDate, 'MMMM yyyy', { locale: es })}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Navegación de Días */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-700 rounded-lg p-1">
            <button 
              onClick={handlePrevDay}
              className="p-2 hover:bg-white dark:hover:bg-slate-600 rounded-md transition-colors text-slate-600 dark:text-slate-300"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button 
              onClick={handleToday}
              className="px-3 py-1 text-sm font-medium hover:bg-white dark:hover:bg-slate-600 rounded-md transition-colors text-slate-600 dark:text-slate-300"
            >
              Hoy
            </button>
            <button 
              onClick={handleNextDay}
              className="p-2 hover:bg-white dark:hover:bg-slate-600 rounded-md transition-colors text-slate-600 dark:text-slate-300"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Selector de fecha manual */}
          <input 
            type="date" 
            value={format(selectedDate, 'yyyy-MM-dd')}
            onChange={handleDateChange}
            className="bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 p-2 rounded-lg border-none focus:ring-2 focus:ring-indigo-500 text-sm"
          />

          <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors shadow-md shadow-indigo-200 dark:shadow-none">
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Nuevo Turno</span>
          </button>
        </div>
      </div>

      {/* Grilla de Turnos */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="overflow-y-auto max-h-[calc(100vh-250px)]">
          {timeSlots.map((time) => (
            <div 
              key={time} 
              className="group flex border-b border-slate-100 dark:border-slate-700/50 last:border-0 min-h-[80px]"
            >
              {/* Columna de Hora */}
              <div className="w-20 md:w-24 flex flex-col items-center justify-start pt-4 border-r border-slate-100 dark:border-slate-700/50 bg-slate-50/50 dark:bg-slate-800/50">
                <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                  {time}
                </span>
                <Clock className="w-3 h-3 text-slate-300 dark:text-slate-600 mt-1" />
              </div>

              {/* Espacio para los turnos */}
              <div className="flex-1 p-2 relative group-hover:bg-slate-50/50 dark:group-hover:bg-slate-700/20 transition-colors">
                {/* Aquí es donde luego "mapearemos" los turnos reales de la base de datos */}
                <button className="absolute inset-2 opacity-0 group-hover:opacity-100 border-2 border-dashed border-slate-200 dark:border-slate-600 rounded-lg flex items-center justify-center text-slate-400 dark:text-slate-500 hover:border-indigo-400 hover:text-indigo-500 transition-all">
                  <Plus className="w-5 h-5 mr-1" />
                  <span className="text-sm font-medium">Agendar</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AgendaPage;
