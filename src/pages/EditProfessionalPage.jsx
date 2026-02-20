import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import MainLayout from '../components/MainLayout';
import { Save, AlertCircle, Briefcase, Check } from 'lucide-react';

const colorOptions = [
    { id: 'default', bg: 'bg-indigo-100', border: 'border-indigo-300' },
    { id: 'green', bg: 'bg-emerald-100', border: 'border-emerald-300' },
    { id: 'amber', bg: 'bg-amber-100', border: 'border-amber-300' },
    { id: 'red', bg: 'bg-rose-100', border: 'border-rose-300' },
];

const EditProfessionalPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchPro = async () => {
      const res = await fetch(`/api/profesionales/${id}`);
      const data = await res.json();
      setFormData(data);
    };
    fetchPro();
  }, [id]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault(); setSaving(true);
    try {
      const res = await fetch(`/api/profesionales/${id}`, {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formData),
      });
      if (res.ok) navigate('/profesionales');
    } catch (error) { alert("Error al actualizar."); } 
    finally { setSaving(false); }
  };

  if (!formData) return <MainLayout title="Cargando..."><div className="p-10 text-center">Buscando...</div></MainLayout>;

  return (
    <MainLayout title="Editar Profesional" activePage="profesionales">
      <div className="max-w-3xl mx-auto h-full overflow-y-auto pr-2 pb-10 custom-scrollbar">
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-white dark:bg-slate-900 shadow-sm rounded-3xl border border-slate-200 p-8">
                <h2 className="text-lg font-bold flex items-center gap-2 mb-6 text-indigo-600"><Briefcase className="w-5 h-5"/> Editar Perfil y Acceso</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Nombre *</label>
                        <input name="nombre" value={formData.nombre} onChange={handleChange} required className="w-full p-3 bg-slate-50 border rounded-xl" />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Apellido *</label>
                        <input name="apellido" value={formData.apellido} onChange={handleChange} required className="w-full p-3 bg-slate-50 border rounded-xl" />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Email (Usuario)</label>
                        <input type="email" name="email" value={formData.email} onChange={handleChange} required className="w-full p-3 bg-slate-50 border rounded-xl" />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-rose-500 uppercase mb-1">Nueva Contraseña</label>
                        <input type="text" name="password" placeholder="Escribe aquí para cambiarla..." value={formData.password} onChange={handleChange} className="w-full p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-900 placeholder:text-rose-300 font-medium outline-none focus:ring-2 focus:ring-rose-400" />
                        <p className="text-[10px] text-slate-400 mt-1">Si dejas el texto original, la contraseña no cambiará.</p>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Especialidad</label>
                        <input name="especialidad" value={formData.especialidad || ''} onChange={handleChange} className="w-full p-3 bg-slate-50 border rounded-xl" />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Teléfono</label>
                        <input name="telefono" value={formData.telefono || ''} onChange={handleChange} className="w-full p-3 bg-slate-50 border rounded-xl" />
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
                <button type="submit" disabled={saving} className="px-10 py-3 bg-amber-500 text-white rounded-2xl font-black shadow-xl hover:bg-amber-600">
                    {saving ? 'Guardando...' : 'Guardar Cambios'}
                </button>
            </div>
        </form>
      </div>
    </MainLayout>
  );
};
export default EditProfessionalPage;
