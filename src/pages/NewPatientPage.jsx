import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { UserPlus, Check, ArrowLeft, HeartPulse, ClipboardList, Contact } from 'lucide-react';

const colorOptions = [
    { id: 'default', bg: 'bg-indigo-100', border: 'border-indigo-300' },
    { id: 'green', bg: 'bg-emerald-100', border: 'border-emerald-300' },
    { id: 'amber', bg: 'bg-amber-100', border: 'border-amber-300' },
    { id: 'red', bg: 'bg-rose-100', border: 'border-rose-300' },
];

const NewPatientPage = () => {
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [formData, setFormData] = useState({
        nombre: '', 
        dni: '', 
        telefono: '', 
        email: '', 
        fechaNacimiento: '',
        direccion: '',
        obraSocial: '',
        nroAfiliado: '',
        antecedentes: '',
        observaciones: '',
        colorType: 'default'
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch('/api/pacientes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            if (res.ok) navigate('/pacientes');
            else alert("Error: El DNI ya existe.");
        } catch (error) { 
            console.error(error); 
        } finally { 
            setLoading(false); 
        }
    };

    return (
        <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white font-display">
            <Sidebar activePage="pacientes" isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
            
            <main className="flex-1 overflow-y-auto py-8 px-4 md:px-10">
                <div className="max-w-[900px] mx-auto">
                    <button onClick={() => navigate('/pacientes')} className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-colors mb-6 font-bold text-sm">
                        <ArrowLeft className="w-4 h-4" /> Volver al listado
                    </button>

                    <div className="flex items-center gap-4 mb-8">
                        <div className="p-3 bg-indigo-600 rounded-2xl shadow-lg shadow-indigo-200 dark:shadow-none">
                            <UserPlus className="w-6 h-6 text-white" />
                        </div>
                        <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">Alta de Paciente</h1>
                    </div>
                    
                    <form className="space-y-6 pb-20" onSubmit={handleSubmit}>
                        
                        {/* SECCIÓN 1: DATOS PERSONALES */}
                        <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
                            <h2 className="text-lg font-bold mb-6 flex items-center gap-2 text-indigo-600">
                                <Contact className="w-5 h-5" /> Información Personal
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="flex flex-col gap-2">
                                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Nombre y Apellido *</label>
                                    <input required name="nombre" value={formData.nombre} onChange={handleChange} placeholder="Ej: Juan Pérez" className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 outline-none focus:ring-2 focus:ring-indigo-500 transition-all" />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500">DNI *</label>
                                    <input required name="dni" value={formData.dni} onChange={handleChange} placeholder="Sin puntos" className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 outline-none focus:ring-2 focus:ring-indigo-500 transition-all" />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Fecha de Nacimiento</label>
                                    <input type="date" name="fechaNacimiento" value={formData.fechaNacimiento} onChange={handleChange} className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 outline-none focus:ring-2 focus:ring-indigo-500 transition-all" />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Dirección</label>
                                    <input name="direccion" value={formData.direccion} onChange={handleChange} placeholder="Calle, Altura, Ciudad" className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 outline-none focus:ring-2 focus:ring-indigo-500 transition-all" />
                                </div>
                            </div>
                        </div>

                        {/* SECCIÓN 2: CONTACTO Y OBRA SOCIAL */}
                        <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
                            <h2 className="text-lg font-bold mb-6 flex items-center gap-2 text-indigo-600">
                                <ClipboardList className="w-5 h-5" /> Contacto y Cobertura
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="flex flex-col gap-2">
                                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Teléfono / WhatsApp</label>
                                    <input name="telefono" value={formData.telefono} onChange={handleChange} placeholder="+54 9..." className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 outline-none focus:ring-2 focus:ring-indigo-500 transition-all" />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Email</label>
                                    <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="ejemplo@correo.com" className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 outline-none focus:ring-2 focus:ring-indigo-500 transition-all" />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Obra Social / Prepaga</label>
                                    <input name="obraSocial" value={formData.obraSocial} onChange={handleChange} placeholder="Ej: OSDE, Swiss Medical..." className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 outline-none focus:ring-2 focus:ring-indigo-500 transition-all" />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500">N° de Afiliado</label>
                                    <input name="nroAfiliado" value={formData.nroAfiliado} onChange={handleChange} placeholder="N° de carnet" className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 outline-none focus:ring-2 focus:ring-indigo-500 transition-all" />
                                </div>
                            </div>
                        </div>

                        {/* SECCIÓN 3: FICHA CLÍNICA */}
                        <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
                            <h2 className="text-lg font-bold mb-6 flex items-center gap-2 text-rose-600">
                                <HeartPulse className="w-5 h-5" /> Antecedentes y Observaciones
                            </h2>
                            <div className="space-y-6">
                                <div className="flex flex-col gap-2">
                                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Antecedentes Médicos (Alergias, Medicación, Diabetes, etc.)</label>
                                    <textarea name="antecedentes" value={formData.antecedentes} onChange={handleChange} rows="3" placeholder="Información crítica para el tratamiento..." className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 outline-none focus:ring-2 focus:ring-rose-500 transition-all resize-none" />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Observaciones Generales</label>
                                    <textarea name="observaciones" value={formData.observaciones} onChange={handleChange} rows="2" placeholder="Notas adicionales..." className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 outline-none focus:ring-2 focus:ring-indigo-500 transition-all resize-none" />
                                </div>

                                {/* SELECTOR DE COLOR */}
                                <div className="flex flex-col gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Color Identificador en Agenda</label>
                                    <div className="flex gap-4">
                                        {colorOptions.map((color) => (
                                            <button
                                                key={color.id}
                                                type="button"
                                                onClick={() => setFormData({...formData, colorType: color.id})}
                                                className={`w-12 h-12 rounded-2xl border-2 ${color.bg} ${color.border} flex items-center justify-center transition-all hover:scale-110 ${formData.colorType === color.id ? 'ring-4 ring-indigo-500/30 border-indigo-500' : 'border-transparent'}`}
                                            >
                                                {formData.colorType === color.id && <Check className="w-6 h-6 text-indigo-700" />}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* BOTONES */}
                        <div className="flex justify-end gap-6 pt-4 pb-10">
                            <button type="button" onClick={() => navigate('/pacientes')} className="px-6 py-3 text-slate-500 font-bold hover:text-slate-700 transition-colors">Cancelar</button>
                            <button type="submit" disabled={loading} className="bg-indigo-600 text-white px-10 py-3 rounded-2xl font-black shadow-xl shadow-indigo-200 dark:shadow-none hover:bg-indigo-700 disabled:opacity-50 transition-all transform hover:-translate-y-1">
                                {loading ? 'Guardando...' : 'Registrar Paciente'}
                            </button>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
};

export default NewPatientPage;
