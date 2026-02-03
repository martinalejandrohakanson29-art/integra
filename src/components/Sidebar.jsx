import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Sidebar = ({ activePage, isOpen, onClose }) => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user')) || { nombre: "Invitado", especialidad: "S/D" };
    
    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/login');
    };

    return (
        <>
            {isOpen && <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={onClose} />}
            <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#517A91] dark:bg-slate-900 text-white transform transition-transform duration-300 md:relative md:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'} flex flex-col shadow-xl`}>
                <div className="h-24 flex flex-col items-center justify-center border-b border-white/10 px-6">
                    <h1 className="font-display text-3xl font-bold text-white lowercase">integra</h1>
                    <span className="text-[10px] tracking-wider opacity-70 italic">Gestión Clínica</span>
                </div>

                <nav className="flex-1 py-6 px-3 space-y-1">
                    <Link to="/agenda" className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl ${activePage === 'agenda' ? 'bg-white/20' : 'hover:bg-white/10'}`}>
                        <span className="material-symbols-outlined">calendar_today</span> Agenda
                    </Link>
                    <Link to="/pacientes" className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl ${activePage === 'pacientes' ? 'bg-white/20' : 'hover:bg-white/10'}`}>
                        <span className="material-symbols-outlined">group</span> Pacientes
                    </Link>
                    <Link to="/historia-clinica" className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl ${activePage === 'historia' ? 'bg-white/20' : 'hover:bg-white/10'}`}>
                        <span className="material-symbols-outlined">folder_shared</span> Historias Clínicas
                    </Link>
                </nav>

                <div className="p-4 border-t border-white/10">
                    <div className="flex items-center gap-3 px-2 mb-4">
                        <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center font-bold">
                            {user.nombre.charAt(0)}
                        </div>
                        <div className="flex flex-col">
                            <span className="text-white text-sm font-semibold">{user.nombre}</span>
                            <span className="text-white/60 text-[10px] uppercase font-bold">{user.especialidad}</span>
                        </div>
                    </div>
                    <button onClick={handleLogout} className="w-full py-2 bg-rose-500/20 text-rose-200 text-xs font-bold rounded-lg hover:bg-rose-500 hover:text-white transition-all">
                        Cerrar Sesión
                    </button>
                </div>
            </aside>
        </>
    );
};
export default Sidebar;
