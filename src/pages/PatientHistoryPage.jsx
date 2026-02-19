import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import MainLayout from '../components/MainLayout';
import Odontograma from '../components/Odontograma';
import { Calendar, Phone, Activity, ArrowLeft, FileText, X, Plus, Clock, Eye, Trash2, Edit3, Check } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'es'; // Cambiado para evitar error si la librería falla

const PatientHistoryPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [patient, setPatient] = useState(null);
    const [consultas, setConsultas] = useState([]);
    const [profesionales, setProfesionales] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState('create'); 
    const [saving, setSaving] = useState(false);
    
    const [currentEntry, setCurrentEntry] = useState({
        id: null,
        fecha: new Date().toISOString().split('T')[0],
        observaciones: '',
        odontograma: {},
        profesionalId: ''
    });

    const loadData = async () => {
        try {
            const [resP, resC, resPros] = await Promise.all([
                fetch(`/api/pacientes/${id}`),
                fetch(`/api/pacientes/${id}/consultas`),
                fetch('/api/profesionales')
            ]);

            if (resP.ok) setPatient(await resP.json());
            
            const dataC = await resC.json();
            setConsultas(Array.isArray(dataC) ? dataC : []);

            const dataPros = await resPros.json();
            setProfesionales(Array.isArray(dataPros) ? dataPros : []);

        } catch (error) {
            console.error("Error cargando datos:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { if (id) loadData(); }, [id]);

    const handleOpenCreate = () => {
        const user = JSON.parse(localStorage.getItem('user'));
        setModalMode('create');
        const ultimoOdontograma = consultas.length > 0 ? consultas[0].odontograma : {};
        setCurrentEntry({
            id: null,
            fecha: new Date().toISOString().split('T')[0],
            observaciones: '',
            odontograma: ultimoOdontograma || {},
            profesionalId: user?.id || ''
        });
        setIsModalOpen(true);
    };

    const handleSave = async () => {
        if (!currentEntry.observaciones.trim() || !currentEntry.profesionalId) {
            alert("Completa las observaciones y selecciona un profesional.");
            return;
        }
        setSaving(true);
        try {
            const url = modalMode === 'create' ? `/api/pacientes/${id}/consultas` : `/api/consultas/${currentEntry.id}`;
            const method = modalMode === 'create' ? 'POST' : 'PATCH';
            const res = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(currentEntry)
            });
            if (res.ok) {
                setIsModalOpen(false);
                loadData();
            }
        } catch (error) { alert("Error al guardar."); } 
        finally { setSaving(false); }
    };

    if (loading) return <MainLayout title="Cargando..."> <div className="p-10 text-center text-slate-400">Cargando...</div> </MainLayout>;
    if (!patient) return <MainLayout title="Error"> <div className="p-10 text-center">Paciente no encontrado.</div> </MainLayout>;

    return (
        <MainLayout title={patient.nombre} activePage="historia">
            <div className="h-full overflow-y-auto pr-2 custom-scrollbar">
                <div className="max-w-6xl mx-auto space-y-6 pb-20">
                    <button onClick={() => navigate('/historia-clinica')} className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-colors font-bold text-sm mb-2">
                        <ArrowLeft className="w-4 h-4" /> Volver
                    </button>
                    {/* ... Resto del diseño igual ... */}
                    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold">Historial</h3>
                            <button onClick={handleOpenCreate} className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-lg">
                                + Nueva Entrada
                            </button>
                        </div>
                        <div className="divide-y">
                            {consultas.length === 0 ? <p className="p-10 text-center text-slate-400">Sin consultas.</p> : consultas.map(c => (
                                <div key={c.id} className="p-4 hover:bg-slate-50 cursor-pointer" onClick={() => {
                                    setModalMode('view');
                                    setCurrentEntry({
                                        id: c.id,
                                        fecha: c.fecha.split('T')[0],
                                        observaciones: c.observaciones,
                                        odontograma: c.odontograma || {},
                                        profesionalId: c.profesionalId
                                    });
                                    setIsModalOpen(true);
                                }}>
                                    <p className="font-bold text-sm">{c.fecha.split('T')[0]}</p>
                                    <p className="text-xs text-slate-500 truncate">{c.observaciones}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-white dark:bg-slate-950 w-full max-w-5xl max-h-[90vh] rounded-3xl overflow-hidden flex flex-col">
                        <div className="p-6 border-b flex justify-between items-center">
                            <h2 className="font-bold">Consulta</h2>
                            <button onClick={() => setIsModalOpen(false)}><X /></button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-6 space-y-6">
                            <select value={currentEntry.profesionalId} onChange={e => setCurrentEntry({...currentEntry, profesionalId: e.target.value})} className="w-full p-3 border rounded-xl">
                                <option value="">Seleccionar Profesional...</option>
                                {profesionales.map(p => <option key={p.id} value={p.id}>{p.nombre}</option>)}
                            </select>
                            <textarea value={currentEntry.observaciones} onChange={e => setCurrentEntry({...currentEntry, observaciones: e.target.value})} className="w-full p-3 border rounded-xl" rows="4" placeholder="Observaciones..." />
                            <div className="border p-4 rounded-xl">
                                <Odontograma data={currentEntry.odontograma} onChange={d => setCurrentEntry({...currentEntry, odontograma: d})} />
                            </div>
                        </div>
                        <div className="p-6 border-t flex justify-end gap-4">
                            <button onClick={() => setIsModalOpen(false)}>Cerrar</button>
                            {modalMode !== 'view' && <button onClick={handleSave} className="bg-indigo-600 text-white px-6 py-2 rounded-xl">{saving ? "Guardando..." : "Guardar"}</button>}
                        </div>
                    </div>
                </div>
            )}
        </MainLayout>
    );
};

export default PatientHistoryPage;
