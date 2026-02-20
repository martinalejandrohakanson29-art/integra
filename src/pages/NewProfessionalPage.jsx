import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../components/MainLayout';
import { Save, AlertCircle, Briefcase, Check } from 'lucide-react';

const colorOptions = [
    { id: 'default', bg: 'bg-indigo-100', border: 'border-indigo-300' },
    { id: 'green', bg: 'bg-emerald-100', border: 'border-emerald-300' },
    { id: 'amber', bg: 'bg-amber-100', border: 'border-amber-300' },
    { id: 'red', bg: 'bg-rose-100', border: 'border-rose-300' },
];

const NewProfessionalPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const [formData, setFormData] = useState({
    nombre: '', apellido: '', email: '', password: '', especialidad: '', telefono: '', colorType: 'default'
  });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError(null);
    try {
      const res = await fetch('/api/profesionales', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error("Error al crear. Verifica que el correo no esté en uso.");
      navigate('/profesionales');
    } catch (err) { setError(err.message); } 
    finally { setLoading(false); }
  };

  return (
    <MainLayout title="Nuevo Profesional" activePage="profesionales">
      <div className="max-w-3xl mx-auto h-full overflow-y-auto pr-2 custom-scrollbar pb-10">
        {error && <div className="mb-6 bg-rose-50 p-4 border-l-4 border-rose-500 text-rose-700 flex items-center gap-2"><AlertCircle className="w-5 h-5"/>{error}</div>}
        
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-white dark:bg-slate-900 shadow-sm rounded-3xl border border-slate-200 p-8">
                <h2 className="text-lg font-bold flex items-center gap-2 mb-6 text-indigo-600"><Briefcase className="w-5 h-5"/> Datos de Perfil y Acceso</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Nombre *</label>
                        <input name="nombre" value={formData.nombre} onChange={handleChange} required className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 rounded-xl outline-none dark:text-white" />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Apellido *</label>
                        <input name="apellido" value={formData.apellido} onChange={handleChange} required className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 rounded-xl outline-none dark:text-white" />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Email (Usuario de Acceso) *</label>
                        <input type="email" name="email" value={formData.email} onChange={handleChange} required className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 rounded-xl outline-none dark:text-white" />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Contraseña de Acceso *</label>
                        <input type="text" name="password" value={formData.password} onChange={handleChange} required className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 rounded-xl outline-none dark:text-white" />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Especialidad</label>
                        <input name="especialidad" value={formData.especialidad} onChange={handleChange} className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 rounded-xl outline-none dark:text-white" />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Teléfono</label>
                        <input name="telefono" value={formData.telefono} onChange={handleChange} className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 rounded-xl outline-none dark:text-white" />
                    </div>
                </div>

                <div className="mt-8">
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-3">Color de Agenda</label>
                    <div className="flex gap-4">
                        {colorOptions.map(color => (
                            <button key={color.id} type="button" onClick={() => setFormData({...formData, colorType: color.id})} className={`w-12 h-12 rounded-2xl border-2 flex items-center justify-center transition-all ${color.bg} ${color.border} ${formData.colorType === color.id ? 'ring-4 ring-indigo-500/30 border-indigo-500 scale-110' : 'border-transparent'}`}>
                                {formData.colorType === color.id && <Check className="w-6 h-6 text-indigo-700" />}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="flex justify-end gap-4">
                <button type="button" onClick={() => navigate('/profesionales')} className="px-6 py-3 font-bold text-slate-500">Cancelar</button>
                <button type="submit" disabled={loading} className="px-10 py-3 bg-indigo-600 text-white rounded-2xl font-black shadow-xl hover:bg-indigo-700">
                    {loading ? 'Guardando...' : <span className="flex items-center gap-2"><Save className="w-5 h-5"/> Guardar Profesional</span>}
                </button>
            </div>
        </form>
      </div>
    </MainLayout>
  );
};
export default NewProfessionalPage;
