import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

// Agregamos las props isOpen y onClose para controlar el menú en móviles
const Sidebar = ({ activePage, isOpen, onClose }) => {
    const navigate = useNavigate();
    
    return (
        <>
            {/* Overlay: Fondo oscuro cuando el menú está abierto en móvil */}
            {isOpen && (
                <div 
                    className="fixed inset-0 bg-black/50 z-40 md:hidden" 
                    onClick={onClose}
                />
            )}

            {/* Sidebar */}
            <aside className={`
                fixed inset-y-0 left-0 z-50 w-64 bg-[#517A91] dark:bg-slate-900 text-white 
                transform transition-transform duration-300 ease-in-out
                md:relative md:translate-x-0 
                ${isOpen ? 'translate-x-0' : '-translate-x-full'}
                flex flex-col shadow-xl
            `}>
                <div className="h-24 flex flex-col items-center justify-center border-b border-white/10 px-6 relative">
                    {/* Botón para cerrar en móvil */}
                    <button onClick={onClose} className="absolute right-4 top-4 md:hidden">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                    
                    <h1 className="font-display text-3xl font-bold tracking-tight text-white lowercase">integra</h1>
                    <span className="font-serif text-[10px] tracking-wider opacity-90 italic mt-[-4px]">Estética & Salud</span>
                </div>

                <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
                    <Link to="/agenda" onClick={onClose} className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-colors ${activePage === 'agenda' ? 'bg-white/20 text-white shadow-sm' : 'text-white/70 hover:bg-white/10'}`}>
                        <span className="material-symbols-outlined">calendar_today</span> Agenda
                    </Link>
                    <Link to="/pacientes" onClick={onClose} className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-colors ${activePage === 'pacientes' ? 'bg-white/20 text-white shadow-sm' : 'text-white/70 hover:bg-white/10'}`}>
                        <span className="material-symbols-outlined">group</span> Pacientes
                    </Link>
                    <Link to="/historia-clinica" onClick={onClose} className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-colors ${activePage === 'historia' ? 'bg-white/20 text-white shadow-sm' : 'text-white/70 hover:bg-white/10'}`}>
                        <span className="material-symbols-outlined">folder_shared</span> Historias Clínicas
                    </Link>
                    <Link to="/configuracion" onClick={onClose} className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-colors text-white/70 hover:bg-white/10">
                        <span className="material-symbols-outlined">settings</span> Configuración
                    </Link>
                </nav>

                <div className="p-4 border-t border-white/10">
                    <div className="flex items-center gap-3 px-2">
                        <img alt="Dra. Lopez" className="h-10 w-10 rounded-full border-2 border-white/30 object-cover" src="https://ui-avatars.com/api/?name=Dra+Lopez&background=random" />
                        <div className="flex flex-col">
                            <span className="text-white text-sm font-semibold">Dra. Lopez</span>
                            <span className="text-white/60 text-xs">Odontóloga</span>
                        </div>
                    </div>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
