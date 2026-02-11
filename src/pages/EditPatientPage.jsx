import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Odontograma from '../components/Odontograma';
import { Save, Check, ArrowLeft, Contact, ClipboardList, HeartPulse, Activity } from 'lucide-react';

const colorOptions = [
    { id: 'default', bg: 'bg-indigo-100', border: 'border-indigo-300' },
    { id: 'green', bg: 'bg-emerald-100', border: 'border-emerald-300' },
    { id: 'amber', bg: 'bg-amber-100', border: 'border-amber-300' },
    { id: 'red', bg: 'bg-rose-100', border: 'border-rose-300' },
];

const EditPatientPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const fetchPatient = async () => {
            try {
                const res = await fetch(`/api/pacientes/${id}`);
                const data = await res.json();
                setFormData(data);
            } catch (error) {
                console.error("Error cargando paciente:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchPatient();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const res = await fetch(`/api/pacientes/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            if (res.ok) navigate('/pacientes');
            else alert("Error al actualizar los datos.");
        } catch (error) { console.error(error); } 
        finally { setSaving(false); }
    };

    if (loading) return <div className="p-10 text-center text-slate-400">Cargando datos del paciente...</div>;

    return (
        <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white font-display">
            <Sidebar activePage="pacientes" />
            <main className="flex-1 overflow-y-auto py-8 px-4 md:px-10">
                <div className="max-w-[900px] mx-auto">
                    <button onClick={() => navigate('/pacientes')} className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-colors mb-6 font-bold text-sm">
                        <ArrowLeft className="w-4 h-4" /> Cancelar cambios
                    </button>

                    <div className="flex items-center gap-4 mb-8">
                        <div className="p-3 bg-amber-500 rounded-2xl shadow-lg">
                            <Save className="w-6 h-6 text-white" />
                        </div>
                        <h1 className="text-3xl font-black tracking-tight">Editar Paciente</h1>
                    </div>
                    
                    <form className="space-y-6 pb-20" onSubmit={handleSubmit}>
                        {/* SECCIÓN 1: DATOS PERSONALES */}
                        <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
                            <h2 className="text-lg font-bold mb-6 flex items-center gap-2 text-indigo-600">
                                <Contact className="w-5 h-5" /> Información Personal
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="flex flex-col gap-2">
                                    <label className="text-xs font-bold uppercase text-slate-500">Nombre y Apellido</label>
                                    <input required name="nombre" value={formData.nombre} onChange={handleChange} className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 outline-none focus:ring-2 focus:ring-indigo-500" />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-xs font-bold uppercase text-slate-500">DNI</label>
                                    <input required name="dni" value={formData.dni} onChange={handleChange} className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 outline-none focus:ring-2 focus:ring-indigo-500" />
                                </div>
                            </div>
                        </div>

                        {/* SECCIÓN 2: CONTACTO */}
                        <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
                            <h2 className="text-lg font-bold mb-6 flex items-center gap-2 text-indigo-600">
                                <ClipboardList className="w-5 h-5" /> Contacto y Cobertura
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="flex flex-col gap-2">
                                    <label className="text-xs font-bold uppercase text-slate-500">Teléfono / WhatsApp</label>
                                    <input name="telefono" value={formData.telefono || ''} onChange={handleChange} className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 outline-none focus:ring-2 focus:ring-indigo-500" />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-xs font-bold uppercase text-slate-500">Email</label>
                                    <input type="email" name="email" value={formData.email || ''} onChange={handleChange} className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 outline-none focus:ring-2 focus:ring-indigo-500" />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-xs font-bold uppercase text-slate-500">Obra Social</label>
                                    <input name="obraSocial" value={formData.obraSocial || ''} onChange={handleChange} className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 outline-none focus:ring-2 focus:ring-indigo-500" />
                                </div>
                            </div>
                        </div>

                        {/* SECCIÓN 3: FICHA MÉDICA */}
                        <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
                            <h2 className="text-lg font-bold mb-6 flex items-center gap-2 text-rose-600">
                                <HeartPulse className="w-5 h-5" /> Antecedentes y Color
                            </h2>
                            <div className="space-y-6">
                                <textarea name="antecedentes" value={formData.antecedentes || ''} onChange={handleChange} rows="3" className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 outline-none focus:ring-2 focus:ring-rose-500 resize-none" />
                                
                                <div className="flex gap-4">
                                    {colorOptions.map((color) => (
                                        <button key={color.id} type="button" onClick={() => setFormData({...formData, colorType: color.id})} className={`w-12 h-12 rounded-2xl border-2 ${color.bg} ${color.border} flex items-center justify-center transition-all ${formData.colorType === color.id ? 'ring-4 ring-indigo-500/30 border-indigo-500 scale-110' : 'border-transparent'}`}>
                                            {formData.colorType === color.id && <Check className="w-6 h-6 text-indigo-700" />}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end gap-6 pt-4 pb-10">
                            <button type="submit" disabled={saving} className="bg-amber-500 text-white px-12 py-4 rounded-2xl font-black shadow-xl hover:bg-amber-600 disabled:opacity-50 transition-all transform hover:-translate-y-1">
                                {saving ? 'Guardando...' : 'Guardar Cambios'}
                            </button>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
};

export default EditPatientPage;
