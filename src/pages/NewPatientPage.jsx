import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { UserPlus, Check } from 'lucide-react';

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
        nombre: '', dni: '', telefono: '', email: '', colorType: 'default'
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await fetch('/api/pacientes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            navigate('/pacientes');
        } catch (error) { console.error(error); } finally { setLoading(false); }
    };

    return (
        <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white">
            <Sidebar activePage="pacientes" isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
            <main className="flex-1 overflow-y-auto py-10 px-6">
                <div className="max-w-[800px] mx-auto">
                    <h1 className="text-3xl font-black mb-8">Nuevo Paciente</h1>
                    
                    <form className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6" onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-bold">Nombre Completo</label>
                                <input required name="nombre" value={formData.nombre} onChange={(e) => setFormData({...formData, nombre: e.target.value})} className="bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-xl p-3 outline-none focus:ring-2 focus:ring-indigo-500" />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-bold">DNI</label>
                                <input required name="dni" value={formData.dni} onChange={(e) => setFormData({...formData, dni: e.target.value})} className="bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-xl p-3 outline-none focus:ring-2 focus:ring-indigo-500" />
                            </div>
                        </div>

                        {/* SELECTOR DE COLOR */}
                        <div className="flex flex-col gap-3">
                            <label className="text-sm font-bold">Color Identificador</label>
                            <div className="flex gap-4">
                                {colorOptions.map((color) => (
                                    <button
                                        key={color.id}
                                        type="button"
                                        onClick={() => setFormData({...formData, colorType: color.id})}
                                        className={`w-10 h-10 rounded-full border-2 ${color.bg} ${color.border} flex items-center justify-center transition-transform hover:scale-110 ${formData.colorType === color.id ? 'ring-4 ring-indigo-500/20' : ''}`}
                                    >
                                        {formData.colorType === color.id && <Check className="w-5 h-5 text-slate-600" />}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="flex justify-end gap-4 pt-6">
                            <button type="button" onClick={() => navigate('/pacientes')} className="px-6 py-2 text-slate-500 font-bold">Cancelar</button>
                            <button type="submit" disabled={loading} className="bg-indigo-600 text-white px-8 py-2 rounded-xl font-bold shadow-lg hover:bg-indigo-700 disabled:opacity-50">
                                {loading ? 'Guardando...' : 'Registrar'}
                            </button>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
};

export default NewPatientPage;
