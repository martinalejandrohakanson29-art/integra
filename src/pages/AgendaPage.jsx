import React from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import DarkModeToggle from '../components/DarkModeToggle';

const AgendaPage = () => {
    const navigate = useNavigate();
    return (
        <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-950">
            <Sidebar activePage="agenda" />
            <div className="flex-1 flex flex-col h-full relative">
                {/* Header Adaptado: px-4 en móvil, px-8 en pc. flex-wrap para evitar cortes */}
                <header className="min-h-20 py-4 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between px-4 md:px-8 z-10 gap-4">
                    <div className="flex flex-col">
                        <h1 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-white">Agenda Semanal</h1>
                        <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400">16 de Octubre - 22 de Octubre, 2023</p>
                    </div>
                    
                    {/* Buscador: oculto en móviles muy pequeños o reducido */}
                    <div className="flex-1 min-w-[200px] max-w-lg order-3 md:order-2">
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <span className="material-symbols-outlined text-gray-400">search</span>
                            </div>
                            <input className="block w-full pl-10 pr-3 py-2 border border-gray-200 dark:border-gray-700 rounded-full bg-slate-100 dark:bg-slate-800 text-sm" placeholder="Buscar por DNI..." type="text" />
                        </div>
                    </div>

                    <div className="flex items-center gap-2 md:gap-4 order-2 md:order-3">
                        <button className="flex items-center gap-2 bg-[#527E95] text-white px-3 md:px-4 py-2 rounded-lg hover:bg-opacity-90 shadow-sm" onClick={() => navigate('/editar-turno')}>
                            <span className="material-symbols-outlined text-sm">add</span>
                            <span className="hidden sm:inline text-sm font-medium">Nueva Cita</span>
                        </button>
                        <DarkModeToggle />
                    </div>
                </header>

                <main className="flex-1 overflow-hidden p-3 md:p-6">
                    <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 h-full flex flex-col overflow-hidden">
                        
                        {/* Contenedor con scroll horizontal para la tabla de agenda */}
                        <div className="flex-1 overflow-auto custom-scrollbar">
                            {/* Forzamos un ancho mínimo para que las 6 columnas no se encimen */}
                            <div className="min-w-[800px] h-full flex flex-col">
                                
                                {/* Header de la Grilla */}
                                <div className="grid grid-cols-6 border-b border-slate-200 dark:border-slate-800 bg-gray-50 dark:bg-slate-800/50 sticky top-0 z-10">
                                    <div className="py-4 text-center border-r border-slate-200 dark:border-slate-800"><span className="text-xs font-semibold text-gray-400">HORA</span></div>
                                    <div className="py-4 px-2 text-center border-r border-slate-200 dark:border-slate-800 relative">
                                        <span className="block text-xs font-bold text-gray-500 uppercase">Lunes</span>
                                        <div className="flex justify-center mt-1"><span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#527E95] text-white font-bold text-sm">16</span></div>
                                    </div>
                                    {["Martes 17", "Miércoles 18", "Jueves 19", "Viernes 20"].map((day, i) => (
                                        <div key={i} className={`py-4 px-2 text-center ${i < 3 ? 'border-r border-slate-200 dark:border-slate-800' : ''}`}>
                                            <span className="block text-xs font-bold text-gray-500 uppercase">{day.split(' ')[0]}</span>
                                            <div className="flex justify-center mt-1"><span className="flex items-center justify-center w-8 h-8 rounded-full text-gray-700 dark:text-gray-300 text-sm">{day.split(' ')[1]}</span></div>
                                        </div>
                                    ))}
                                </div>

                                {/* Cuerpo de la Grilla */}
                                <div className="grid grid-cols-6 flex-1">
                                    <div className="col-span-1 bg-gray-50 dark:bg-slate-800/30 border-r border-slate-200 dark:border-slate-800">
                                        {[9, 10, 11, 12, 1, 2, 3, 4].map((h, i) => (
                                            <div key={i} className="h-24 border-b border-slate-200 dark:border-slate-800 p-2 text-right">
                                                <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">{h < 9 ? `0${h}:00 PM` : `${h < 12 ? h.toString().padStart(2, '0') + ':00 AM' : '12:00 PM'}`}</span>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="col-span-5 grid grid-cols-5 relative">
                                        <div className="absolute inset-0 grid grid-cols-5 pointer-events-none">
                                            {[...Array(5)].map((_, i) => <div key={i} className="border-r border-slate-200 dark:border-slate-800 h-full"></div>)}
                                        </div>
                                        
                                        {/* Turnos con tamaños de texto corregidos */}
                                        <div className="relative w-full h-full col-start-1">
                                            <div onClick={() => navigate('/editar-turno')} className="absolute top-0 left-1 right-1 h-36 mt-2 rounded-lg bg-blue-100 dark:bg-blue-900/40 border-l-4 border-[#527E95] p-2 cursor-pointer hover:shadow-md transition-shadow">
                                                <span className="text-[10px] font-bold text-[#527E95] dark:text-blue-300">09:00 - 10:30</span>
                                                <h3 className="text-xs font-semibold text-gray-800 dark:text-gray-100 mt-1 truncate">Carla Rodríguez</h3>
                                                <p className="text-[10px] text-gray-600 dark:text-gray-400 truncate">Limpieza Dental</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};
export default AgendaPage;
