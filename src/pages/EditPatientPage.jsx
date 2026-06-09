import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import MainLayout from '../components/MainLayout';
import SignatureCanvas from '../components/SignatureCanvas';
import { Save, Check, ArrowLeft, Contact, ClipboardList, HeartPulse, PenLine } from 'lucide-react';

const colorOptions = [
    { id: 'default', bg: 'bg-indigo-100', border: 'border-indigo-300' },
    { id: 'green', bg: 'bg-emerald-100', border: 'border-emerald-300' },
    { id: 'amber', bg: 'bg-amber-100', border: 'border-amber-300' },
    { id: 'red', bg: 'bg-rose-100', border: 'border-rose-300' },
];

const inputClass = "bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white";

const EditPatientPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [mostrarFirma, setMostrarFirma] = useState(false);

    useEffect(() => {
        const fetchPatient = async () => {
            try {
                const res = await fetch(`/api/pacientes/${id}`);
                if (!res.ok) throw new Error('No encontrado');
                const data = await res.json();
                setFormData(data);
            } catch (error) {
                console.error("Error cargando paciente:", error);
                setFormData(null);
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
            // No enviamos relaciones ni la fotoUrl (es una URL firmada temporal; se gestiona por su propio endpoint)
            const { consultas, turnos, fotoUrl, createdAt, updatedAt, ...datos } = formData;
            const res = await fetch(`/api/pacientes/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(datos),
            });
            if (res.ok) navigate('/pacientes');
            else alert("Error al actualizar los datos.");
        } catch (error) {
            console.error(error);
            alert("Error de conexión.");
        }
        finally { setSaving(false); }
    };

    if (loading) return (
        <MainLayout title="Cargando..." activePage="pacientes">
            <div className="p-10 text-center text-slate-400">Cargando datos del paciente...</div>
        </MainLayout>
    );

    if (!formData) return (
        <MainLayout title="Error" activePage="pacientes">
            <div className="p-10 text-center flex flex-col items-center gap-4">
                <p className="text-slate-500 font-bold">No se encontró el paciente solicitado.</p>
                <button onClick={() => navigate('/pacientes')} className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-bold shadow-lg">
                    Volver al listado
                </button>
            </div>
        </MainLayout>
    );

    return (
        <MainLayout title="Editar Paciente" activePage="pacientes">
            <div className="h-full overflow-y-auto pr-1 md:pr-2 custom-scrollbar">
                <div className="max-w-[900px] mx-auto">
                    <button onClick={() => navigate('/pacientes')} className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-colors mb-6 font-bold text-sm">
                        <ArrowLeft className="w-4 h-4" /> Cancelar cambios
                    </button>

                    <form className="space-y-6 pb-20" onSubmit={handleSubmit}>
                        {/* SECCIÓN 1: DATOS PERSONALES */}
                        <div className="bg-white dark:bg-slate-900 p-5 md:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
                            <h2 className="text-lg font-bold mb-6 flex items-center gap-2 text-indigo-600">
                                <Contact className="w-5 h-5" /> Información Personal
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
                                <div className="flex flex-col gap-2">
                                    <label className="text-xs font-bold uppercase text-slate-500">Nombre</label>
                                    <input required name="nombre" value={formData.nombre} onChange={handleChange} className={inputClass} />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-xs font-bold uppercase text-slate-500">Apellido</label>
                                    <input required name="apellido" value={formData.apellido || ''} onChange={handleChange} className={inputClass} />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-xs font-bold uppercase text-slate-500">DNI</label>
                                    <input required name="dni" value={formData.dni} onChange={handleChange} className={inputClass} />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-xs font-bold uppercase text-slate-500">Fecha de Nacimiento</label>
                                    <input type="date" name="fechaNacimiento" value={formData.fechaNacimiento ? String(formData.fechaNacimiento).split('T')[0] : ''} onChange={handleChange} className={inputClass} />
                                </div>
                            </div>
                        </div>

                        {/* SECCIÓN 2: CONTACTO */}
                        <div className="bg-white dark:bg-slate-900 p-5 md:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
                            <h2 className="text-lg font-bold mb-6 flex items-center gap-2 text-indigo-600">
                                <ClipboardList className="w-5 h-5" /> Contacto y Cobertura
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
                                <div className="flex flex-col gap-2">
                                    <label className="text-xs font-bold uppercase text-slate-500">Teléfono / WhatsApp</label>
                                    <input name="telefono" value={formData.telefono || ''} onChange={handleChange} className={inputClass} />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-xs font-bold uppercase text-slate-500">Email</label>
                                    <input type="email" name="email" value={formData.email || ''} onChange={handleChange} className={inputClass} />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-xs font-bold uppercase text-slate-500">Dirección</label>
                                    <input name="direccion" value={formData.direccion || ''} onChange={handleChange} className={inputClass} />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-xs font-bold uppercase text-slate-500">Obra Social</label>
                                    <input name="obraSocial" value={formData.obraSocial || ''} onChange={handleChange} className={inputClass} />
                                </div>
                            </div>
                        </div>

                        {/* SECCIÓN 3: FICHA MÉDICA */}
                        <div className="bg-white dark:bg-slate-900 p-5 md:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
                            <h2 className="text-lg font-bold mb-6 flex items-center gap-2 text-rose-600">
                                <HeartPulse className="w-5 h-5" /> Antecedentes y Color
                            </h2>
                            <div className="space-y-6">
                                <textarea name="observacionesAnamnesis" value={formData.observacionesAnamnesis || ''} onChange={handleChange} rows="3" placeholder="Antecedentes médicos relevantes..." className={`w-full resize-none ${inputClass} focus:ring-rose-500`} />

                                <div className="flex gap-4 flex-wrap">
                                    {colorOptions.map((color) => (
                                        <button key={color.id} type="button" onClick={() => setFormData(prev => ({ ...prev, colorType: color.id }))} className={`w-12 h-12 rounded-2xl border-2 ${color.bg} ${color.border} flex items-center justify-center transition-all ${formData.colorType === color.id ? 'ring-4 ring-indigo-500/30 border-indigo-500 scale-110' : 'border-transparent'}`}>
                                            {formData.colorType === color.id && <Check className="w-6 h-6 text-indigo-700" />}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* FIRMA DIGITAL */}
                        <div className="bg-white dark:bg-slate-900 p-5 md:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
                            <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-slate-600 dark:text-slate-300">
                                <PenLine className="w-5 h-5" /> Firma Digital
                            </h2>

                            {formData.firmaDigital && !mostrarFirma && (
                                <div className="mb-4 flex flex-col gap-2">
                                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Firma actual</p>
                                    <div className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-3 inline-block">
                                        <img src={formData.firmaDigital} alt="Firma digital" className="max-h-24 w-auto" />
                                    </div>
                                </div>
                            )}

                            <button
                                type="button"
                                onClick={() => setMostrarFirma(v => !v)}
                                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold border transition-all ${mostrarFirma ? 'bg-indigo-600 text-white border-indigo-600 shadow-md' : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-indigo-400'}`}
                            >
                                <PenLine className="w-4 h-4" />
                                {formData.firmaDigital ? 'Reemplazar firma' : 'Agregar firma'}
                            </button>

                            {mostrarFirma && (
                                <div className="mt-4">
                                    <SignatureCanvas
                                        onChange={(dataUrl) => setFormData(prev => ({ ...prev, firmaDigital: dataUrl }))}
                                    />
                                </div>
                            )}
                        </div>

                        <div className="flex justify-end gap-6 pt-4 pb-10">
                            <button type="submit" disabled={saving} className="w-full sm:w-auto bg-amber-500 text-white px-8 md:px-12 py-4 rounded-2xl font-black shadow-xl hover:bg-amber-600 disabled:opacity-50 transition-all flex items-center justify-center gap-2">
                                <Save className="w-5 h-5" /> {saving ? 'Guardando...' : 'Guardar Cambios'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </MainLayout>
    );
};

export default EditPatientPage;
