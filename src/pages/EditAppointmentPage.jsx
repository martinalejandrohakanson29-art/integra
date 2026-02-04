import React from 'react';
import { useNavigate } from 'react-router-dom';
import DarkModeToggle from '../components/DarkModeToggle';
import { HeartPulse, X, Trash2 } from 'lucide-react';

const EditAppointmentPage = () => {
    const navigate = useNavigate();
    return (
        <div className="bg-slate-100 dark:bg-slate-950 min-h-screen flex flex-col font-display">
            <header className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 md:px-10 py-3 gap-4">
                <div className="flex items-center gap-2 md:gap-8">
                    <div className="flex items-center gap-2 text-slate-900 dark:text-white">
                        <HeartPulse className="text-[#137fec] w-8 h-8" />
                        <h2 className="text-sm md:text-lg font-bold leading-tight">Integra</h2>
                    </div>
                </div>
                <div className="flex gap-4 items-center">
                    <DarkModeToggle />
                    <div className="bg-center bg-cover rounded-full size-8 md:size-10 border border-slate-200 dark:border-slate-700" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDxVelSNtaJUGfHHCbeC3ndyxw4r2QUMgoR1D6goG9GDeGN09J9PbNbRz82n24AAYGUqLu_o7s4Rh6STUIsiv_d0fTFhURiK6Re2NoacJIjgIOFCmOwsm7FEuEpxVKSvErIan1PAoG3U9oEeMvik3cEvfbGHCD_y8igGvA1pY9nyo3TEJA7bzW0V3YjrFdnr5_44cAX-qhOdWrdeCLehFfs7KilBMu9UiweznOCF7vCjGB0GyXqXhbh85ma6fk7OWCTkSoTUFnkpfY")' }}></div>
                </div>
            </header>
            
            <main className="flex-1 px-4 md:px-20 lg:px-40 py-8 relative">
                <div className="flex flex-wrap justify-between gap-3 mb-6">
                    <h1 className="text-slate-900 dark:text-white text-2xl md:text-3xl font-bold">Gestión de Turnos</h1>
                </div>
                
                <div className="fixed inset-0 modal-overlay z-40 flex items-center justify-center p-2 md:p-4">
                    <div className="bg-white dark:bg-slate-900 w-full max-w-[640px] max-h-[95vh] rounded-xl shadow-2xl flex flex-col overflow-hidden">
                        <div className="flex items-center justify-between p-4 md:p-6 border-b border-slate-100 dark:border-slate-800">
                            <div>
                                <h2 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white">Editar Turno</h2>
                                <p className="text-xs md:text-sm text-slate-500">Paciente: <strong>Luciana Méndez</strong></p>
                            </div>
                            <button onClick={() => navigate('/agenda')} className="text-slate-400 hover:text-slate-900">
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        
                        <div className="p-4 md:p-6 overflow-y-auto">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                                <div className="flex flex-col gap-2">
                                    <label className="text-slate-900 dark:text-white text-xs md:text-sm font-semibold">Profesional</label>
                                    <select className="form-select w-full rounded-lg border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 dark:text-white h-11 md:h-12 text-sm">
                                        <option>Dr. Alejandro Rossi</option>
                                        <option selected>Dra. Martina Varela</option>
                                    </select>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-slate-900 dark:text-white text-xs md:text-sm font-semibold">Especialidad</label>
                                    <select className="form-select w-full rounded-lg border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 dark:text-white h-11 md:h-12 text-sm">
                                        <option selected>Implantes Dentales</option>
                                    </select>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-slate-900 dark:text-white text-xs md:text-sm font-semibold">Fecha</label>
                                    <input className="form-input w-full rounded-lg border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 dark:text-white h-11 md:h-12 text-sm" type="date" defaultValue="2023-10-24" />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-slate-900 dark:text-white text-xs md:text-sm font-semibold">Hora</label>
                                    <select className="form-select w-full rounded-lg border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 dark:text-white h-11 md:h-12 text-sm">
                                        <option selected>10:30</option>
                                    </select>
                                </div>
                                <div className="flex flex-col gap-2 md:col-span-2">
                                    <label className="text-slate-900 dark:text-white text-xs md:text-sm font-semibold">Motivo</label>
                                    <textarea className="form-textarea w-full rounded-lg border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 dark:text-white p-3 text-sm" rows="3" defaultValue="Control post-operatorio."></textarea>
                                </div>
                            </div>
                        </div>
                        
                        <div className="p-4 md:p-6 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                            <button className="text-red-500 hover:text-red-700 text-xs font-semibold flex items-center gap-1 w-full sm:w-auto justify-center">
                                <Trash2 className="w-4 h-4" /> Eliminar Turno
                            </button>
                            <div className="flex items-center gap-3 w-full sm:w-auto">
                                <button onClick={() => navigate('/agenda')} className="flex-1 px-4 h-11 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold text-sm">Cancelar</button>
                                <button onClick={() => navigate('/agenda')} className="flex-1 px-4 h-11 rounded-lg bg-[#137fec] text-white font-bold text-sm">Confirmar</button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};
export default EditAppointmentPage;
