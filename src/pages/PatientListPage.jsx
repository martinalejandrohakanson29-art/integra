import React from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import DarkModeToggle from '../components/DarkModeToggle';

const PatientListPage = () => {
    const navigate = useNavigate();
    const patients = [
        { id: 1, name: "Sofía Martínez", dni: "45.123.890", tel: "+54 11 5555-0123", status: "Activo" },
        { id: 2, name: "Juan Pérez", dni: "38.221.445", tel: "+54 11 4444-2233", status: "Inactivo" },
        { id: 3, name: "Carla Rodríguez", dni: "40.112.556", tel: "+54 11 3333-1122", status: "Activo" }
    ];

    return (
        <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-950">
            <Sidebar activePage="pacientes" />
            <div className="flex-1 flex flex-col h-full">
                <header className="min-h-20 py-4 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 md:px-8 gap-4">
                    <h1 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-white">Pacientes</h1>
                    <div className="flex items-center gap-2 md:gap-4">
                        <button onClick={() => navigate('/nuevo-paciente')} className="flex items-center gap-2 bg-[#137fec] text-white px-3 md:px-4 py-2 rounded-lg hover:bg-opacity-90 shadow-sm text-sm">
                            <span className="material-symbols-outlined text-sm">person_add</span> 
                            <span className="hidden sm:inline">Nuevo Paciente</span>
                        </button>
                        <DarkModeToggle />
                    </div>
                </header>
                <main className="flex-1 p-3 md:p-6 overflow-hidden">
                    <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden h-full flex flex-col">
                        {/* Contenedor de Scroll para la tabla */}
                        <div className="overflow-auto custom-scrollbar">
                            <table className="w-full text-left border-collapse min-w-[600px]">
                                <thead>
                                    <tr className="bg-gray-50 dark:bg-slate-800/50 sticky top-0">
                                        <th className="px-4 md:px-6 py-4 text-xs font-bold text-gray-500 uppercase">Paciente</th>
                                        <th className="px-4 md:px-6 py-4 text-xs font-bold text-gray-500 uppercase">DNI</th>
                                        <th className="px-4 md:px-6 py-4 text-xs font-bold text-gray-500 uppercase">Teléfono</th>
                                        <th className="px-4 md:px-6 py-4 text-xs font-bold text-gray-500 uppercase">Estado</th>
                                        <th className="px-4 md:px-6 py-4 text-xs font-bold text-gray-500 uppercase">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                    {patients.map(p => (
                                        <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                                            <td className="px-4 md:px-6 py-4 font-semibold text-slate-900 dark:text-white text-sm">{p.name}</td>
                                            <td className="px-4 md:px-6 py-4 text-slate-500 text-sm">{p.dni}</td>
                                            <td className="px-4 md:px-6 py-4 text-slate-500 text-sm">{p.tel}</td>
                                            <td className="px-4 md:px-6 py-4">
                                                <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${p.status === 'Activo' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                                                    {p.status}
                                                </span>
                                            </td>
                                            <td className="px-4 md:px-6 py-4">
                                                <button onClick={() => navigate('/historia-clinica')} className="text-[#137fec] hover:underline font-medium text-sm">Ver Historia</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};
export default PatientListPage;
