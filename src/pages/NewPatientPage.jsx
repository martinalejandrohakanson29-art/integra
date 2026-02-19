import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../components/MainLayout';
import { UserPlus, Save, X, AlertCircle, FileText, Activity } from 'lucide-react';

const NewPatientPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    dni: '',
    fechaNacimiento: '',
    telefono: '',
    email: '',
    direccion: '',
    colorType: 'default',
    tieneAlergias: false,
    tieneProbCardiacos: false,
    tieneHipertension: false,
    tieneDiabetes: false,
    tomaMedicacion: false,
    estaEmbarazada: false,
    otrosAntecedentes: false,
    observacionesAnamnesis: '' 
  });

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    const finalValue = type === 'radio' ? value === 'true' : value;
    setFormData(prevState => ({ ...prevState, [name]: finalValue }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/pacientes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al crear el paciente');
      }
      navigate('/pacientes');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const MedicalCheckRow = ({ label, name, value, onChange }) => (
    <div className="flex items-center justify-between py-3 border-b border-slate-100 dark:border-slate-800 last:border-0">
      <span className="text-slate-700 dark:text-slate-300 font-medium">{label}</span>
      <div className="flex items-center space-x-4">
        <label className="inline-flex items-center cursor-pointer">
          <input type="radio" name={name} value="true" checked={value === true} onChange={onChange} className="form-radio h-4 w-4 text-indigo-600" />
          <span className="ml-2 text-slate-700 dark:text-slate-300">Sí</span>
        </label>
        <label className="inline-flex items-center cursor-pointer">
          <input type="radio" name={name} value="false" checked={value === false} onChange={onChange} className="form-radio h-4 w-4 text-rose-500" />
          <span className="ml-2 text-slate-700 dark:text-slate-300">No</span>
        </label>
      </div>
    </div>
  );

  return (
    <MainLayout title="Nuevo Paciente" activePage="pacientes">
      <div className="max-w-4xl mx-auto h-full overflow-y-auto pr-2 custom-scrollbar pb-10">
        {error && (
            <div className="mb-6 bg-rose-50 dark:bg-rose-900/20 border-l-4 border-rose-500 p-4 rounded-md flex items-start">
                <AlertCircle className="h-5 w-5 text-rose-500 mr-2" />
                <p className="text-rose-700 dark:text-rose-300 text-sm">{error}</p>
            </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-white dark:bg-slate-900 shadow-sm rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                <div className="bg-slate-50 dark:bg-slate-800/50 px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center">
                    <FileText className="h-5 w-5 text-slate-500 mr-2" />
                    <h2 className="text-lg font-bold text-slate-700 dark:text-white">Datos Personales</h2>
                </div>
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Nombre *</label>
                        <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} required className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none dark:text-white" />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Apellido *</label>
                        <input type="text" name="apellido" value={formData.apellido} onChange={handleChange} required className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none dark:text-white" />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">DNI *</label>
                        <input type="text" name="dni" value={formData.dni} onChange={handleChange} required className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none dark:text-white" />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Fecha de Nacimiento *</label>
                        <input type="date" name="fechaNacimiento" value={formData.fechaNacimiento} onChange={handleChange} required className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none dark:text-white" />
                    </div>
                </div>
            </div>

             <div className="bg-white dark:bg-slate-900 shadow-sm rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                <div className="bg-indigo-50 dark:bg-indigo-900/20 px-6 py-4 border-b border-indigo-100 dark:border-indigo-800 flex items-center">
                    <Activity className="h-5 w-5 text-indigo-600 mr-2" />
                    <h2 className="text-lg font-bold text-indigo-900 dark:text-indigo-300">Anamnesis Inicial</h2>
                </div>
                <div className="p-6">
                    <div className="bg-slate-50 dark:bg-slate-800/30 rounded-2xl p-4 border border-slate-100 dark:border-slate-800 mb-6">
                        <MedicalCheckRow label="¿Tiene alergias?" name="tieneAlergias" value={formData.tieneAlergias} onChange={handleChange} />
                        <MedicalCheckRow label="¿Tiene problemas cardíacos?" name="tieneProbCardiacos" value={formData.tieneProbCardiacos} onChange={handleChange} />
                        <MedicalCheckRow label="¿Sufre de hipertensión?" name="tieneHipertension" value={formData.tieneHipertension} onChange={handleChange} />
                        <MedicalCheckRow label="¿Tiene diabetes?" name="tieneDiabetes" value={formData.tieneDiabetes} onChange={handleChange} />
                        <MedicalCheckRow label="¿Toma alguna medicación?" name="tomaMedicacion" value={formData.tomaMedicacion} onChange={handleChange} />
                        <MedicalCheckRow label="¿Está embarazada?" name="estaEmbarazada" value={formData.estaEmbarazada} onChange={handleChange} />
                        <MedicalCheckRow label="¿Otros antecedentes?" name="otrosAntecedentes" value={formData.otrosAntecedentes} onChange={handleChange} />
                    </div>
                    <textarea name="observacionesAnamnesis" rows="3" value={formData.observacionesAnamnesis} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none dark:text-white resize-none" placeholder="Detalles adicionales..."></textarea>
                </div>
            </div>

            <div className="flex justify-end gap-4 pt-4 pb-10">
                <button type="button" onClick={() => navigate('/pacientes')} className="px-6 py-3 text-slate-500 font-bold hover:text-slate-700">Cancelar</button>
                <button type="submit" disabled={loading} className="px-10 py-3 bg-indigo-600 text-white rounded-2xl font-black shadow-xl hover:bg-indigo-700 transition-all">
                    {loading ? 'Guardando...' : <><Save className="h-5 w-5" /> Guardar Paciente</>}
                </button>
            </div>
        </form>
      </div>
    </MainLayout>
  );
};

export default NewPatientPage;
