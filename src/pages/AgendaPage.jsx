import React from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../components/MainLayout';

const AgendaPage = () => {
  const navigate = useNavigate();

  // Definimos qué queremos mostrar en la parte derecha del header específicamente para esta página
  const agendaHeaderActions = (
    <>
      {/* Buscador */}
      <div className="hidden sm:block flex-1 max-w-lg mx-4">
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="material-symbols-outlined text-gray-400 text-sm">search</span>
          </div>
          <input 
            className="block w-full pl-9 pr-3 py-2 border border-gray-200 dark:border-gray-700 rounded-full bg-slate-100 dark:bg-slate-800 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" 
            placeholder="Buscar por DNI..." 
            type="text" 
          />
        </div>
      </div>

      {/* Botón Nueva Cita */}
      <button 
        className="flex items-center gap-2 bg-[#527E95] text-white px-3 py-2 rounded-lg hover:bg-opacity-90 shadow-sm transition-all" 
        onClick={() => navigate('/editar-turno')}
      >
        <span className="material-symbols-outlined text-sm">add</span>
        <span className="hidden xs:inline text-xs font-medium">Nueva Cita</span>
      </button>
    </>
  );

  return (
    <MainLayout 
      title="Agenda Semanal" 
      subtitle="16 - 22 de Octubre, 2023" 
      activePage="agenda"
      extraHeader={agendaHeaderActions} // Le pasamos el buscador y el botón aquí
    >
      {/* TODO EL CONTENIDO DE TU GRILLA DE AGENDA VA AQUÍ ABAJO */}
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 h-full flex flex-col overflow-hidden">
        <div className="flex-1 overflow-auto custom-scrollbar">
          <div className="min-w-[850px] h-full flex flex-col">
            
            {/* Header de la Grilla */}
            <div className="grid grid-cols-6 border-b border-slate-200 dark:border-slate-800 bg-gray-50 dark:bg-slate-800/50 sticky top-0 z-10">
              <div className="py-4 text-center border-r border-slate-200 dark:border-slate-800">
                <span className="text-xs font-semibold text-gray-400">HORA</span>
              </div>
              <div className="py-4 px-2 text-center border-r border-slate-200 dark:border-slate-800 relative">
                <span className="block text-[10px] font-bold text-gray-500 uppercase">Lunes</span>
                <div className="flex justify-center mt-1">
                  <span className="flex items-center justify-center w-7 h-7 rounded-full bg-[#527E95] text-white font-bold text-xs">16</span>
                </div>
              </div>
              {["Martes 17", "Miércoles 18", "Jueves 19", "Viernes 20"].map((day, i) => (
                <div key={i} className={`py-4 px-2 text-center ${i < 3 ? 'border-r border-slate-200 dark:border-slate-800' : ''}`}>
                  <span className="block text-[10px] font-bold text-gray-500 uppercase">{day.split(' ')[0]}</span>
                  <div className="flex justify-center mt-1">
                    <span className="flex items-center justify-center w-7 h-7 rounded-full text-gray-700 dark:text-gray-300 text-xs font-semibold">{day.split(' ')[1]}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Cuerpo de la Grilla (puedes pegar el resto de tu código de las horas aquí) */}
            <div className="grid grid-cols-6 flex-1">
               {/* ... Aquí va el resto de tu código de los turnos y las horas ... */}
               <div className="p-4 dark:text-gray-400 italic">Aquí continúan tus turnos...</div>
            </div>

          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default AgendaPage;
