import React from 'react';
import { useNavigate } from 'react-router-dom';
import DarkModeToggle from '../components/DarkModeToggle';

const EditAppointmentPage = () => {
    const navigate = useNavigate();
    return (
        <div className="bg-slate-100 dark:bg-slate-950 min-h-screen flex flex-col font-display">
            <header className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-10 py-3">
                <div className="flex items-center gap-8">
                    <div className="flex items-center gap-4 text-slate-900 dark:text-white">
                        <span className="material-symbols-outlined text-3xl text-[#137fec]">dentistry</span>
                        <h2 className="text-lg font-bold leading-tight">Integra Estética & Salud</h2>
                    </div>
                </div>
                <div className="flex gap-4 items-center">
                    <DarkModeToggle />
                    <div className="bg-center bg-cover rounded-full size-10 border border-slate-200 dark:border-slate-700" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDxVelSNtaJUGfHHCbeC3ndyxw4r2QUMgoR1D6goG9GDeGN09J9PbNbRz82n24AAYGUqLu_o7s4Rh6STUIsiv_d0fTFhURiK6Re2NoacJIjgIOFCmOwsm7FEuEpxVKSvErIan1PAoG3U9oEeMvik3cEvfbGHCD_y8igGvA1pY9nyo3TEJA7bzW0V3YjrFdnr5_44cAX-qhOdWrdeCLehFfs7KilBMu9UiweznOCF7vCjGB0GyXqXhbh85ma6fk7OWCTkSoTUFnkpfY")' }}></div>
                </div>
            </header>
            <main className="flex-1 px-40 py-8 relative">
                <div className="flex flex-wrap justify-between gap-3 mb-6">
                    <h1 className="text-slate-900 dark:text-white text-3xl font-bold">Gestión de Turnos</h1>
                </div>
                <div className="fixed inset-0 modal-overlay z-40 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-slate-900 w-full max-w-[640px] rounded-xl shadow-2xl flex flex-col overflow-hidden">
                        <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800">
                            <div>
                                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Editar Turno</h2>
                                <p className="text-sm text-slate-500">Paciente: <strong>Luciana Méndez</strong></p>
                            </div>
                            <button onClick={() => navigate('/agenda')} className="text-slate-400 hover:text-slate-900 transition-colors">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>
                        <div className="p-6 overflow-y-auto max-h-[70vh]">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="flex flex-col gap-2">
                                    <label className="text-slate-900 dark:text-white text-sm font-semibold">Doctor / Profesional</label>
                                    <select className="form-select w-full rounded-lg border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 dark:text-white h-12">
                                        <option>Dr. Alejandro Rossi</option>
                                        <option selected>Dra. Martina Varela</option>
                                        <option>Dr. Carlos Gómez</option>
                                    </select>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-slate-900 dark:text-white text-sm font-semibold">Especialidad</label>
                                    <select className="form-select w-full rounded-lg border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 dark:text-white h-12">
                                        <option selected>Implantes Dentales</option>
                                        <option>Ortodoncia</option>
                                        <option>Estética Dental</option>
                                    </select>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-slate-900 dark:text-white text-sm font-semibold">Fecha</label>
                                    <input className="form-input w-full rounded-lg border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 dark:text-white h-12" type="date" defaultValue="2023-10-24" />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-slate-900 dark:text-white text-sm font-semibold">Hora</label>
                                    <select className="form-select w-full rounded-lg border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 dark:text-white h-12">
                                        <option>09:30</option>
                                        <option>10:00</option>
                                        <option selected>10:30</option>
                                        <option>11:00</option>
                                    </select>
                                </div>
                                <div className="flex flex-col gap-2 md:col-span-2">
                                    <label className="text-slate-900 dark:text-white text-sm font-semibold">Motivo de la consulta</label>
                                    <textarea className="form-textarea w-full rounded-lg border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 dark:text-white p-4" rows="3" defaultValue="Control post-operatorio de implante molar inferior derecho."></textarea>
                                </div>
                            </div>
                        </div>
                        <div className="p-6 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                            <button className="text-red-500 hover:text-red-700 text-sm font-semibold flex items-center gap-1 px-4 py-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20">
                                <span className="material-symbols-outlined text-lg">delete</span> Eliminar Turno
                            </button>
                            <div className="flex items-center gap-3 w-full sm:w-auto">
                                <button onClick={() => navigate('/agenda')} className="flex-1 sm:flex-none px-6 h-12 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold">Cancelar</button>
                                <button onClick={() => navigate('/agenda')} className="flex-1 sm:flex-none px-8 h-12 rounded-lg bg-[#137fec] text-white font-bold shadow-lg shadow-[#137fec]/20 hover:bg-opacity-90">Confirmar Cambios</button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};
export default EditAppointmentPage;
