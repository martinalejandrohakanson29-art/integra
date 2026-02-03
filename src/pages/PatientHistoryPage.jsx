import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import MainLayout from '../components/MainLayout';
import { differenceInYears, parseISO } from 'date-fns';

const PatientHistoryPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [paciente, setPaciente] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPaciente = async () => {
            try {
                const res = await fetch('/api/pacientes');
                const data = await res.json();
                const p = data.find(item => item.id === id);
                setPaciente(p);
            } catch (err) { console.error(err); }
            finally { setLoading(false); }
        };
        fetchPaciente();
    }, [id]);

    const calcularEdad = (fecha) => {
        if (!fecha) return '--';
        try {
            return differenceInYears(new Date(), parseISO(fecha));
        } catch { return '--'; }
    };

    if (loading) return <div className="p-10 text-center">Cargando...</div>;
    if (!paciente) return <div className="p-10 text-center text-rose-500 font-bold">Paciente no encontrado</div>;

    return (
        <MainLayout 
            title={paciente.nombre} 
            subtitle="Historia Clínica" 
            activePage="pacientes" 
        >
            <div className="h-full overflow-y-auto pr-2 custom-scrollbar">
                <div className="max-w-6xl mx-auto space-y-6 pb-10">
                    
                    {/* Tarjeta de Perfil Expandida */}
                    <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-sm border border-slate-200 dark:border-slate-800 transition-colors">
                        <div className="flex flex-col lg:flex-row gap-8">
                            <div className="flex flex-col items-center gap-4">
                                <div className="w-24 h-24 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                                    <span className="text-3xl font-black">{paciente.nombre.charAt(0)}</span>
                                </div>
                                <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full">Activo</span>
                            </div>

                            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                <div>
                                    <p className="text-[10px] font-bold uppercase text-slate-400 mb-1">DNI</p>
                                    <p className="text-slate-900 dark:text-white font-semibold">{paciente.dni}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold uppercase text-slate-400 mb-1">Edad</p>
                                    <p className="text-slate-900 dark:text-white font-semibold">{calcularEdad(paciente.fechaNacimiento)} años</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold uppercase text-slate-400 mb-1">Teléfono</p>
                                    <p className="text-slate-900 dark:text-white font-semibold">{paciente.telefono || '--'}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold uppercase text-slate-400 mb-1">Obra Social</p>
                                    <p className="text-indigo-600 dark:text-indigo-400 font-bold">{paciente.obraSocial || 'Particular'} {paciente.nroAfiliado && `(${paciente.nroAfiliado})`}</p>
                                </div>
                                <div className="md:col-span-2">
                                    <p className="text-[10px] font-bold uppercase text-rose-500 mb-1">Antecedentes Médicos</p>
                                    <p className="text-slate-700 dark:text-slate-300 text-sm italic">{paciente.antecedentes || 'Sin antecedentes reportados'}</p>
                                </div>
                            </div>

                            <div className="flex flex-col gap-3">
                                <button className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-indigo-100">Nueva Cita</button>
                                <button className="px-6 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-white rounded-xl text-sm font-bold">Editar Perfil</button>
                            </div>
                        </div>
                    </div>

                    {/* Contenido Clínico */}
                    <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 p-8">
                        <h3 className="text-lg font-bold mb-6">Tratamientos Realizados</h3>
                        <div className="text-slate-400 text-center py-20 border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-2xl">
                            Aquí se listarán los turnos y notas del paciente.
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};

export default PatientHistoryPage;
