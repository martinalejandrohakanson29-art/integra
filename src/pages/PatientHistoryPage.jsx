import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import MainLayout from '../components/MainLayout';
import { Calendar, Phone, BadgeInfo, Activity, ArrowLeft, FileText } from 'lucide-react';

const PatientHistoryPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [patient, setPatient] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPatient = async () => {
            try {
                const res = await fetch('/api/pacientes');
                const data = await res.json();
                const found = data.find(p => p.id === id);
                setPatient(found);
            } catch (error) {
                console.error("Error cargando ficha:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchPatient();
    }, [id]);

    if (loading) return <MainLayout title="Cargando..."> <div className="p-10 text-center">Buscando ficha médica...</div> </MainLayout>;
    
    if (!patient) return (
      <MainLayout title="Error">
        <div className="p-10 text-center">
          <p className="text-rose-500 font-bold mb-4">No se encontró el paciente.</p>
          <button onClick={() => navigate('/historia-clinica')} className="bg-indigo-600 text-white px-6 py-2 rounded-lg">Volver al buscador</button>
        </div>
      </MainLayout>
    );

    return (
        <MainLayout 
            title={patient.nombre} 
            activePage="historia"
        >
            <div className="h-full overflow-y-auto pr-2 custom-scrollbar">
                <div className="max-w-6xl mx-auto space-y-6 pb-10">
                    
                    {/* BOTÓN VOLVER */}
                    <button onClick={() => navigate('/historia-clinica')} className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-colors font-bold text-sm mb-2">
                        <ArrowLeft className="w-4 h-4" /> Volver al buscador
                    </button>

                    {/* CABECERA DE FICHA */}
                    <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-sm border border-slate-200 dark:border-slate-800">
                        <div className="flex flex-col md:flex-row gap-8 items-start">
                            <div className="w-24 h-24 rounded-2xl bg-indigo-600 flex items-center justify-center text-white text-4xl font-black shadow-xl shadow-indigo-100 dark:shadow-none">
                                {patient.nombre.charAt(0)}
                            </div>
                            
                            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                <div>
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Documento</label>
                                    <p className="text-slate-900 dark:text-white font-bold text-lg">{patient.dni}</p>
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Contacto</label>
                                    <p className="text-slate-900 dark:text-white font-semibold flex items-center gap-2"><Phone className="w-4 h-4 text-slate-400" /> {patient.telefono || 'Sin teléfono'}</p>
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Obra Social</label>
                                    <p className="text-indigo-600 dark:text-indigo-400 font-bold">{patient.obraSocial || 'Particular'}</p>
                                </div>
                                <div className="lg:col-span-3 p-4 bg-rose-50 dark:bg-rose-900/20 rounded-2xl border border-rose-100 dark:border-rose-800">
                                    <label className="text-[10px] font-bold text-rose-600 uppercase tracking-widest flex items-center gap-2 mb-1">
                                      <Activity className="w-3 h-3" /> Antecedentes Médicos Relevantes
                                    </label>
                                    <p className="text-slate-700 dark:text-slate-200 text-sm italic">
                                      {patient.antecedentes || 'No se registraron alergias o enfermedades preexistentes.'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* LÍNEA DE TIEMPO DE TRATAMIENTOS */}
                    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                            <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2"><FileText className="w-5 h-5 text-indigo-500" /> Evolución y Tratamientos</h3>
                            <button className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all">Nueva Entrada</button>
                        </div>
                        
                        <div className="p-10 text-center space-y-4">
                            <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto">
                                <FileText className="w-8 h-8 text-slate-300" />
                            </div>
                            <p className="text-slate-400 text-sm max-w-xs mx-auto">No hay registros médicos cargados aún. Haz clic en "Nueva Entrada" para comenzar el historial.</p>
                        </div>
                    </div>

                </div>
            </div>
        </MainLayout>
    );
};

export default PatientHistoryPage;
