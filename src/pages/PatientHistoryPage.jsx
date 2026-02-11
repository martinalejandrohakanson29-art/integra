import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import MainLayout from '../components/MainLayout';
import Odontograma from '../components/Odontograma';
import { Calendar, Phone, Activity, ArrowLeft, FileText, X, Plus, Clock, Eye } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const PatientHistoryPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [patient, setPatient] = useState(null);
    const [consultas, setConsultas] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Estados para el Modal (Sirve para Nueva y para Ver Detalle)
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState('create'); // 'create' o 'view'
    const [saving, setSaving] = useState(false);
    
    const [currentEntry, setCurrentEntry] = useState({
        fecha: new Date().toISOString().split('T')[0],
        observaciones: '',
        odontograma: {}
    });

    const loadData = async () => {
        try {
            const [resP, resC] = await Promise.all([
                fetch('/api/pacientes'),
                fetch(`/api/pacientes/${id}/consultas`)
            ]);
            const pacientes = await resP.json();
            const found = pacientes.find(p => p.id === id);
            setPatient(found);
            setConsultas(await resC.json());
        } catch (error) {
            console.error("Error cargando datos:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadData(); }, [id]);

    // Abrir para Nueva Consulta
    const handleOpenCreate = () => {
        setModalMode('create');
        setCurrentEntry({
            fecha: new Date().toISOString().split('T')[0],
            observaciones: '',
            odontograma: patient?.odontograma || {} // Empezamos con el estado actual del paciente
        });
        setIsModalOpen(true);
    };

    // Abrir para Ver Detalle de una Consulta Pasada
    const handleOpenView = (consulta) => {
        setModalMode('view');
        setCurrentEntry({
            fecha: format(new Date(consulta.fecha), 'yyyy-MM-dd'),
            observaciones: consulta.observaciones,
            odontograma: consulta.odontograma || {}
        });
        setIsModalOpen(true);
    };

    const handleSaveConsulta = async (e) => {
        e.preventDefault();
        if (modalMode === 'view') {
            setIsModalOpen(false);
            return;
        }

        setSaving(true);
        try {
            const res = await fetch(`/api/pacientes/${id}/consultas`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(currentEntry)
            });
            if (res.ok) {
                setIsModalOpen(false);
                loadData();
            }
        } catch (error) {
            console.error(error);
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <MainLayout title="Cargando..."> <div className="p-10 text-center">Buscando ficha médica...</div> </MainLayout>;
    if (!patient) return <MainLayout title="Error"><div className="p-10 text-center"><button onClick={() => navigate('/historia-clinica')} className="bg-indigo-600 text-white px-6 py-2 rounded-lg">Volver</button></div></MainLayout>;

    return (
        <MainLayout title={patient.nombre} activePage="historia">
            <div className="h-full overflow-y-auto pr-2 custom-scrollbar">
                <div className="max-w-6xl mx-auto space-y-6 pb-20">
                    
                    <button onClick={() => navigate('/historia-clinica')} className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-colors font-bold text-sm mb-2">
                        <ArrowLeft className="w-4 h-4" /> Volver al buscador
                    </button>

                    {/* CABECERA (INFO PACIENTE) */}
                    <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-sm border border-slate-200 dark:border-slate-800">
                        <div className="flex flex-col md:flex-row gap-8 items-start">
                            <div className="w-24 h-24 rounded-2xl bg-[#517A91] flex items-center justify-center text-white text-4xl font-black shadow-xl">
                                {patient.nombre.charAt(0)}
                            </div>
                            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                <div>
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Documento</label>
                                    <p className="text-slate-900 dark:text-white font-bold text-lg">{patient.dni}</p>
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Obra Social</label>
                                    <p className="text-indigo-600 dark:text-indigo-400 font-bold">{patient.obraSocial || 'Particular'}</p>
                                </div>
                                <div className="lg:col-span-3 p-4 bg-rose-50 dark:bg-rose-900/20 rounded-2xl border border-rose-100 dark:border-rose-800">
                                    <label className="text-[10px] font-bold text-rose-600 uppercase tracking-widest flex items-center gap-2 mb-1">
                                      <Activity className="w-3 h-3" /> Antecedentes
                                    </label>
                                    <p className="text-slate-700 dark:text-slate-200 text-sm italic">{patient.antecedentes || 'Sin registros.'}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* HISTORIAL CRONOLÓGICO */}
                    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50">
                            <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                <FileText className="w-5 h-5 text-indigo-500" /> Historial de Consultas
                            </h3>
                            <button 
                                onClick={handleOpenCreate}
                                className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl text-sm font-black shadow-lg hover:bg-indigo-700 transition-all flex items-center gap-2"
                            >
                                <Plus className="w-4 h-4" /> Nueva Entrada
                            </button>
                        </div>
                        
                        <div className="divide-y divide-slate-100 dark:divide-slate-800">
                            {consultas.length === 0 ? (
                                <div className="p-20 text-center text-slate-400">No hay consultas registradas aún.</div>
                            ) : consultas.map((c) => (
                                <div 
                                    key={c.id} 
                                    className="p-6 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors cursor-pointer group"
                                    onClick={() => handleOpenView(c)}
                                >
                                    <div className="flex justify-between items-start">
                                        <div className="flex items-center gap-3 mb-3">
                                            <div className="p-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg text-indigo-600">
                                                <Clock className="w-4 h-4" />
                                            </div>
                                            <span className="font-black text-slate-900 dark:text-white">
                                                {format(new Date(c.fecha), "dd 'de' MMMM, yyyy", { locale: es })}
                                            </span>
                                        </div>
                                        <div className="text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 text-xs font-bold uppercase">
                                            <Eye className="w-4 h-4" /> Ver Ficha
                                        </div>
                                    </div>
                                    <p className="text-slate-600 dark:text-slate-300 text-sm line-clamp-2 bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-100 dark:border-slate-700">
                                        {c.observaciones || "Sin observaciones."}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* MODAL DE CONSULTA (CREAR / VER) */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-slate-50 dark:bg-slate-950 w-full max-w-5xl max-h-[90vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col border border-white/10">
                        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-white dark:bg-slate-900">
                            <div>
                                <h2 className="text-xl font-black text-slate-900 dark:text-white">
                                    {modalMode === 'create' ? 'Nueva Entrada Médica' : 'Detalle de Consulta'}
                                </h2>
                                <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">
                                    {modalMode === 'create' ? `Paciente: ${patient.nombre}` : `Fecha: ${format(new Date(currentEntry.fecha), 'dd/MM/yyyy')}`}
                                </p>
                            </div>
                            <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full">
                                <X className="w-6 h-6 text-slate-400" />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="flex flex-col gap-2">
                                    <label className="text-xs font-black uppercase text-slate-400 tracking-tighter">Fecha</label>
                                    <input 
                                        type="date" 
                                        disabled={modalMode === 'view'}
                                        value={currentEntry.fecha}
                                        onChange={(e) => setCurrentEntry({...currentEntry, fecha: e.target.value})}
                                        className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-70 dark:text-white"
                                    />
                                </div>
                                <div className="md:col-span-2 flex flex-col gap-2">
                                    <label className="text-xs font-black uppercase text-slate-400 tracking-tighter">Observaciones</label>
                                    <textarea 
                                        rows="3"
                                        disabled={modalMode === 'view'}
                                        placeholder="Descripción del tratamiento..."
                                        value={currentEntry.observaciones}
                                        onChange={(e) => setCurrentEntry({...currentEntry, observaciones: e.target.value})}
                                        className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-70 dark:text-white resize-none"
                                    />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <label className="text-xs font-black uppercase text-slate-400 tracking-tighter">
                                    {modalMode === 'create' ? 'Actualizar Odontograma' : 'Estado Dental en esta fecha'}
                                </label>
                                <div className={`bg-white dark:bg-slate-900 p-2 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-x-auto ${modalMode === 'view' ? 'pointer-events-none' : ''}`}>
                                    <Odontograma 
                                        data={currentEntry.odontograma}
                                        onChange={(nuevaData) => {
                                            if (modalMode === 'create') setCurrentEntry({...currentEntry, odontograma: nuevaData});
                                        }}
                                    />
                                </div>
                                {modalMode === 'view' && <p className="text-[10px] text-center text-slate-400 italic">El gráfico superior es una captura histórica y no se puede editar.</p>}
                            </div>
                        </div>

                        <div className="p-6 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex justify-end gap-4">
                            <button onClick={() => setIsModalOpen(false)} className="px-6 py-3 text-slate-500 font-bold hover:text-slate-700">
                                {modalMode === 'create' ? 'Cancelar' : 'Cerrar'}
                            </button>
                            {modalMode === 'create' && (
                                <button 
                                    onClick={handleSaveConsulta}
                                    disabled={saving}
                                    className="bg-indigo-600 text-white px-10 py-3 rounded-2xl font-black shadow-xl hover:bg-indigo-700 disabled:opacity-50 transition-all"
                                >
                                    {saving ? "Guardando..." : "Guardar Consulta"}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </MainLayout>
    );
};

export default PatientHistoryPage;
