import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Sidebar = ({ activePage }) => {
    const navigate = useNavigate();
    return (
        <aside className="w-64 bg-[#517A91] dark:bg-slate-900 text-white hidden md:flex flex-col shadow-xl z-20">
            <div className="h-24 flex flex-col items-center justify-center border-b border-white/10 px-6">
                <h1 className="font-display text-3xl font-bold tracking-tight text-white lowercase">integra</h1>
                <span className="font-serif text-[10px] tracking-wider opacity-90 italic mt-[-4px]">Estética & Salud</span>
            </div>
            <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
                <Link to="/agenda" className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-colors ${activePage === 'agenda' ? 'bg-white/20 text-white shadow-sm' : 'text-white/70 hover:bg-white/10'}`}>
                    <span className="material-symbols-outlined">calendar_today</span> Agenda
                </Link>
                <Link to="/pacientes" className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-colors ${activePage === 'pacientes' ? 'bg-white/20 text-white shadow-sm' : 'text-white/70 hover:bg-white/10'}`}>
                    <span className="material-symbols-outlined">group</span> Pacientes
                </Link>
                <Link to="/historia-clinica" className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-colors ${activePage === 'historia' ? 'bg-white/20 text-white shadow-sm' : 'text-white/70 hover:bg-white/10'}`}>
                    <span className="material-symbols-outlined">folder_shared</span> Historias Clínicas
                </Link>
                <Link to="/configuracion" className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-colors text-white/70 hover:bg-white/10">
                    <span className="material-symbols-outlined">settings</span> Configuración
                </Link>
            </nav>
            <div className="p-4 border-t border-white/10">
                <div className="flex items-center gap-3 px-2">
                    <img alt="Dra. Lopez" className="h-10 w-10 rounded-full border-2 border-white/30 object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDpFAhc6Zs0kqnz81hRR9I6demdF17r5w0qUWZ0w_AIPDLFiNO0ol7DT7YyI0UXHPpL6NQZLKuhHryY9wyDmdJD-RQsy6eI6-gdYnV1D-IWQFm1nUk0jibOjLp2AKsDyJ_4laAZyUwB4N8cnv20qp3X9IRs3IPQUelnOEAQGon6KqyWGnFxEYEtIB2pQoQt65VRWhfVXXEColnnTWC9BwBnpGaGLjDnco-aNz_UhN0mRuFfc7PXv3LpMlX3h-F7eENBvYAVczpzAlU" />
                    <div className="flex flex-col">
                        <span className="text-white text-sm font-semibold">Dra. Lopez</span>
                        <span className="text-white/60 text-xs">Odontóloga</span>
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
