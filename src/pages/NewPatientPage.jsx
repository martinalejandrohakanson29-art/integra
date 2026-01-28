import React, { useState } from 'react'; // Agregamos useState
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

const NewPatientPage = () => {
    const navigate = useNavigate();
    
    // Estado para controlar el menú lateral en móviles
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <div className="flex h-screen overflow-hidden bg-[#fdfbf7] dark:bg-slate-950">
            {/* Sidebar con soporte para móvil */}
            <Sidebar 
                activePage="pacientes" 
                isOpen={isMenuOpen} 
                onClose={() => setIsMenuOpen(false)} 
            />

            <main className="flex-1 overflow-y-auto py-6 md:py-10 px-4 md:px-6">
                <div className="max-w-[800px] mx-auto flex flex-col">
                    
                    {/* Botón de Menú para celular (Solo visible en pantallas pequeñas) */}
                    <div className="md:hidden mb-4">
                        <button 
                            onClick={() => setIsMenuOpen(true)}
                            className="p-2 -ml-2 text-gray-600 dark:text-gray-300 hover:bg-white/50 dark:hover:bg-slate-800 rounded-lg transition-colors"
                        >
                            <span className="material-symbols-outlined">menu</span>
                        </button>
                    </div>

                    <div className="flex flex-wrap justify-between gap-3 px-2 md:p-4 mb-6">
                        <div className="flex flex-col gap-2">
                            {/* Título responsivo: text-2xl en móvil, text-4xl en PC */}
                            <h1 className="text-[#0d141b] dark:text-white text-2xl md:text-4xl font-black leading-tight">
                                Registro de Nuevo Paciente
                            </h1>
                            <p className="text-[#4c739a] dark:text-slate-400 text-sm md:text-base font-normal">
                                Ingrese los datos personales para dar de alta al paciente.
                            </p>
                        </div>
                    </div>

                    {/* Formulario con padding ajustado para móviles */}
                    <div className="bg-white dark:bg-slate-900 shadow-sm rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden p-5 md:p-8">
                        <form className="flex flex-col gap-5 md:gap-6" onSubmit={(e) => { e.preventDefault(); navigate('/pacientes'); }}>
                            
                            <div className="flex flex-col gap-2">
                                <label className="text-[#0d141b] dark:text-slate-200 text-sm md:text-base font-medium">Nombre Completo</label>
                                <input 
                                    className="form-input w-full rounded-lg border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 h-12 md:h-14 p-4 dark:text-white text-sm md:text-base" 
                                    placeholder="Ej: Juan Pérez" 
                                    type="text" 
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
                                <div className="flex flex-col gap-2">
                                    <label className="text-[#0d141b] dark:text-slate-200 text-sm md:text-base font-medium">DNI</label>
                                    <input 
                                        className="form-input w-full rounded-lg border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 h-12 md:h-14 p-4 dark:text-white text-sm" 
                                        placeholder="Número de documento" 
                                        type="text" 
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-[#0d141b] dark:text-slate-200 text-sm md:text-base font-medium">Teléfono</label>
                                    <input 
                                        className="form-input w-full rounded-lg border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 h-12 md:h-14 p-4 dark:text-white text-sm" 
                                        placeholder="Ej: +54 11 1234 5678" 
                                        type="tel" 
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="text-[#0d141b] dark:text-slate-200 text-sm md:text-base font-medium">Correo Electrónico</label>
                                <input 
                                    className="form-input w-full rounded-lg border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 h-12 md:h-14 p-4 dark:text-white text-sm" 
                                    placeholder="ejemplo@correo.com" 
                                    type="email" 
                                />
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="text-[#0d141b] dark:text-slate-200 text-sm md:text-base font-medium">Obra Social / Prepaga</label>
                                <input 
                                    className="form-input w-full rounded-lg border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 h-12 md:h-14 p-4 dark:text-white text-sm" 
                                    placeholder="Ej: OSDE 210, Particular" 
                                    type="text" 
                                />
                            </div>

                            {/* Botones de acción: Cambian a columna en móviles pequeños para que no se corten */}
                            <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-3 md:gap-4 mt-4 pt-6 border-t border-slate-100 dark:border-slate-800">
                                <button 
                                    onClick={() => navigate('/pacientes')} 
                                    className="w-full sm:w-auto px-6 py-3 rounded-lg text-sm font-semibold text-[#4c739a] hover:bg-slate-100 dark:hover:bg-slate-800 transition-all" 
                                    type="button"
                                >
                                    Cancelar
                                </button>
                                <button 
                                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3 bg-[#137fec] text-white rounded-lg text-sm font-bold shadow-md hover:bg-opacity-90 transition-all" 
                                    type="submit"
                                >
                                    <span className="material-symbols-outlined text-lg">person_add</span> 
                                    Guardar Paciente
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default NewPatientPage;
