import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../components/MainLayout'; // Corregido: Importamos MainLayout
import { UserPlus, Save, X, AlertCircle, FileText, Activity } from 'lucide-react';

const NewPatientPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const API_URL = import.meta.env.VITE_API_URL || '';
  
  // Estado inicial del formulario combinado
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    dni: '',
    fechaNacimiento: '',
    telefono: '',
    email: '',
    direccion: '',
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

    setFormData(prevState => ({
      ...prevState,
      [name]: finalValue
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!formData.nombre || !formData.apellido || !formData.dni || !formData.fechaNacimiento) {
        setError('Por favor complete los campos obligatorios marcados con *.');
        setLoading(false);
        return;
    }

    try {
      const response = await fetch(`${API_URL}/api/pacientes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al crear el paciente');
      }

      navigate('/pacientes');
      
    } catch (err) {
      console.error('Error al enviar formulario:', err);
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
          <input
            type="radio"
            name={name}
            value="true"
            checked={value === true}
            onChange={onChange}
            className="form-radio h-4 w-4 text-indigo-600 border-slate-300"
          />
          <span className="ml-2 text-slate-700 dark:text-slate-300">Sí</span>
        </label>
        <label className="inline-flex items-center cursor-pointer">
          <input
            type="radio"
            name={name}
            value="false"
            checked={value === false}
            onChange={onChange}
            className="form-radio h-4 w-4 text-rose-500 border-slate-300"
          />
          <span className="ml-2 text-slate-700 dark:text-slate-300">No</span>
        </label>
      </div>
    </div>
  );

  return (
    <MainLayout title="Nuevo Paciente" activePage="pacientes">
      <div className="max-w-4xl mx-auto h-full overflow-y-auto pr-2 custom-scrollbar pb-10">
        
        {/* Mensaje de Error */}
        {error && (
            <div className="mb-6 bg-rose-50 dark:bg-rose-900/20 border-l-4 border-rose-500 p-4 rounded-md flex items-start">
                <AlertCircle className="h-5 w-5 text-rose-500 mr-2 flex-shrink-0 mt-0.5" />
                <p className="text-rose-700 dark:text-rose-300 text-sm">{error}</p>
            </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Sección 1: Datos Personales */}
            <div className="bg-white dark:bg-slate-900 shadow-sm rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                <div className="bg-slate-50 dark:bg-slate-800/50 px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center">
                    <FileText className="h-5 w-5 text-slate-500 mr-2" />
                    <h2 className="text-lg font-bold text-slate-700 dark:text-white">Datos Personales</h2>
                </div>
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Nombre *</label>
                        <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} required
                            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none dark:text-white" placeholder="Ej: Juan" />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Apellido *</label>
                        <input type="text" name="apellido" value={formData.apellido} onChange={handleChange} required
                            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none dark:text-white" placeholder="Ej: Pérez" />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">DNI *</label>
                        <input type="text" name="dni" value={formData.dni} onChange={handleChange} required
                            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none dark:text-white" placeholder="Sin puntos" />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Fecha de Nacimiento *</label>
                        <input type="date" name="fechaNacimiento" value={formData.fechaNacimiento} onChange={handleChange} required
                            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none dark:text-white" />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Teléfono</label>
                        <input type="tel" name="telefono" value={formData.telefono} onChange={handleChange}
                            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none dark:text-white" placeholder="Ej: 351..." />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Email</label>
                        <input type="email" name="email" value={formData.email} onChange={handleChange}
                            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none dark:text-white" placeholder="correo@ejemplo.com" />
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Dirección</label>
                        <input type="text" name="direccion" value={formData.direccion} onChange={handleChange}
                            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none dark:text-white" placeholder="Calle, número, localidad..." />
                    </div>
                </div>
            </div>

             {/* Sección 2: Anamnesis */}
             <div className="bg-white dark:bg-slate-900 shadow-sm rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                <div className="bg-indigo-50 dark:bg-indigo-900/20 px-6 py-4 border-b border-indigo-100 dark:border-indigo-800 flex items-center">
                    <Activity className="h-5 w-5 text-indigo-600 mr-2" />
                    <h2 className="text-lg font-bold text-indigo-900 dark:text-indigo-300">Anamnesis Inicial</h2>
                </div>
                <div className="p-6">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Condiciones Médicas</p>
                    
                    <div className="bg-slate-50 dark:bg-slate-800/30 rounded-2xl p-4 border border-slate-100 dark:border-slate-800 mb-6">
                        <MedicalCheckRow label="¿Tiene alergias? (medicamentos, látex, etc.)" name="tieneAlergias" value={formData.tieneAlergias} onChange={handleChange} />
                        <MedicalCheckRow label="¿Tiene problemas cardíacos?" name="tieneProbCardiacos" value={formData.tieneProbCardiacos} onChange={handleChange} />
                        <MedicalCheckRow label="¿Sufre de hipertensión arterial?" name="tieneHipertension" value={formData.tieneHipertension} onChange={handleChange} />
                        <MedicalCheckRow label="¿Tiene diabetes?" name="tieneDiabetes" value={formData.tieneDiabetes} onChange={handleChange} />
                        <MedicalCheckRow label="¿Toma alguna medicación habitualmente?" name="tomaMedicacion" value={formData.tomaMedicacion} onChange={handleChange} />
                        <MedicalCheckRow label="¿Está embarazada o cree estarlo?" name="estaEmbarazada" value={formData.estaEmbarazada} onChange={handleChange} />
                        <MedicalCheckRow label="¿Otros antecedentes médicos de relevancia?" name="otrosAntecedentes" value={formData.otrosAntecedentes} onChange={handleChange} />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Observaciones Médicas Adicionales</label>
                        <textarea
                            name="observacionesAnamnesis"
                            rows="3"
                            value={formData.observacionesAnamnesis}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none dark:text-white resize-none"
                            placeholder="Detalle aquí alergias específicas, nombres de medicamentos, etc..."
                        ></textarea>
                    </div>
                </div>
            </div>

            {/* Botones de Acción */}
            <div className="flex justify-end gap-4 pt-4 pb-10">
                <button
                    type="button"
                    onClick={() => navigate('/pacientes')}
                    className="px-6 py-3 text-slate-500 font-bold hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
                >
                    Cancelar
                </button>
                <button
                    type="submit"
                    disabled={loading}
                    className={`px-10 py-3 bg-indigo-600 text-white rounded-2xl font-black shadow-xl hover:bg-indigo-700 flex items-center gap-2 transition-all transform hover:-translate-y-1 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                    {loading ? 'Guardando...' : <><Save className="h-5 w-5" /> Guardar Paciente</>}
                </button>
            </div>
        </form>
      </div>
    </MainLayout>
  );
};

export default NewPatientPage;
