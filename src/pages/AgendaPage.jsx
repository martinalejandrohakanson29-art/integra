import React, { useState } from 'react'; // 1. Agregamos useState
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import DarkModeToggle from '../components/DarkModeToggle';

const AgendaPage = () => {
    const navigate = useNavigate();
    
    // 2. Estado para controlar si el menú lateral está abierto en el celular
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-950">
            {/* 3. Le pasamos el estado y la función de cierre al Sidebar */}
            <Sidebar 
                activePage="agenda" 
                isOpen={isMenuOpen} 
                onClose={() => setIsMenuOpen(false)} 
            />
            
            <div className="flex-1 flex flex-col h-full relative">
                {/* Header con botón de menú para móvil */}
                <header className="min-h-20 py-4 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 md:px-8 z-10 gap-4">
                    
                    {/* 4. Botón de Hamburguesa: Solo visible en móvil (md:hidden) */}
                    <button 
                        onClick={() => setIsMenuOpen(true)}
                        className="md:hidden p-2 -ml-2 text-gray-600 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
                    >
                        <span className="material-symbols-outlined">menu</span>
                    </button>

                    <div className="flex flex-col flex-1 md:flex-none">
                        <h1 className="text-lg md:text-2xl font-bold text-gray-800 dark:text-white">Agenda Semanal</h1>
                        <p className="text-[10px] md:text-sm text-gray-500 dark:text-gray-400">16 - 22 de Octubre, 2023</p>
                    </div>
                    
                    {/* Buscador: lo mantenemos igual pero ajustado */}
                    <div className="hidden sm:block flex-1 max-w-lg mx-4">
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <span className="material-symbols-outlined text-gray-400 text-sm">search</span>
                            </div>
                            <input className="block w-full pl-9 pr-3 py-2 border border-gray-200 dark:border-gray-700 rounded-full bg-slate-100 dark:bg-slate-800 text-sm" placeholder="Buscar por DNI..." type="text" />
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <button className="flex items-center gap-2 bg-[#527E95] text-white px-3 py-2 rounded-lg hover:bg-opacity-90 shadow-sm transition-all" onClick={() => navigate('/editar-turno')}>
                            <span className="material-symbols-outlined text-sm">add</span>
                            <span className="hidden xs:inline text-xs font-medium">Nueva Cita</span>
                        </button>
                        <DarkModeToggle />
                    </div>
                </header>

                <main className="flex-1 overflow-hidden p-3 md:p-6">
                    <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 h-full flex flex-col overflow-hidden">
                        
                        {/* Contenedor con scroll horizontal para que la agenda no se aplaste */}
                        <div className="flex-1 overflow-auto custom-scrollbar">
                            <div className="min-w-[850px] h-full flex flex-col">
                                
                                {/* Header de la Grilla */}
                                <div className="grid grid-cols-6 border-b border-slate-200 dark:border-slate-800 bg-gray-50 dark:bg-slate-800/50 sticky top-0 z-10">
                                    <div className="py-4 text-center border-r border-slate-200 dark:border-slate-800"><span className="text-xs font-semibold text-gray-400">HORA</span></div>
                                    <div className="py-4 px-2 text-center border-r border-slate-200 dark:border-slate-800 relative">
                                        <span className="block text-[10px] font-bold text-gray-500 uppercase">Lunes</span>
                                        <div className="flex justify-center mt-1"><span className="flex items-center justify-center w-7 h-7 rounded-full bg-[#527E95] text-white font-bold text-xs">16</span></div>
                                    </div>
                                    {["Martes 17", "Miércoles 18", "Jueves 19", "Viernes 20"].map((day, i) => (
                                        <div key={i} className={`py-4 px-2 text-center ${i < 3 ? 'border-r border-slate-200 dark:border-slate-800' : ''}`}>
                                            <span className="block text-[10px] font-bold text-gray-500 uppercase">{day.split(' ')[0]}</span>
                                            <div className="flex justify-center mt-1"><span className="flex items-center justify-center w-7 h-7 rounded-full text-gray-700 dark:text-gray-300 text-xs font-semibold">{day.split(' ')[1]}</span></div>
                                        </div>
                                    ))}
                                </div>

                                {/* Cuerpo de la Grilla */}
                                <div className="grid grid-cols-6 flex-1">
                                    <div className="col-span-1 bg-gray-50 dark:bg-slate-800/30 border-r border-slate-200 dark:border-slate-800">
                                        {[9, 10, 11, 12, 1, 2, 3, 4].map((h, i) => (
                                            <div key={i} className="h-24 border-b border-slate-200 dark:border-slate-800 p-2 text-right">
                                                <span className="text-[10px] text-gray-500 dark:text-gray-400 font-medium">{h < 9 ? `0${h}:00 PM` : `${h < 12 ? h.toString().padStart(2, '0') + ':00 AM' : '12:00 PM'}`}</span>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="col-span-5 grid grid-cols-5 relative">
                                        <div className="absolute inset-0 grid grid-cols-5 pointer-events-none">
                                            {[...Array(5)].map((_, i) => <div key={i} className="border-r border-slate-200 dark:border-slate-800 h-full"></div>)}
                                        </div>
                                        
                                        {/* Ejemplo de Turno */}
                                        <div className="relative w-full h-full col-start-1">
                                            <div onClick={() => navigate('/editar-turno')} className="absolute top-0 left-1 right-1 h-36 mt-2 rounded-lg bg-blue-100 dark:bg-blue-900/40 border-l-4 border-[#527E95] p-2 cursor-pointer hover:shadow-md transition-shadow">
                                                <span className="text-[10px] font-bold text-[#527E95] dark:text-blue-300">09:00 - 10:30</span>
                                                <h3 className="text-xs font-semibold text-gray-800 dark:text-gray-100 mt-0.5 truncate">Carla Rodríguez</h3>
                                                <p className="text-[10px] text-gray-600 dark:text-gray-400 truncate italic">Limpieza Dental</p>
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
