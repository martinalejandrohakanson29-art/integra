import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { UserPlus, Save, X, AlertCircle, FileText, Activity } from 'lucide-react';

const NewPatientPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Estado inicial del formulario combinado (Datos personales + Anamnesis)
  const [formData, setFormData] = useState({
    // Datos Personales
    nombre: '',
    apellido: '',
    dni: '',
    fechaNacimiento: '',
    telefono: '',
    email: '',
    direccion: '',
    // Datos de Anamnesis (Historial Médico) - Booleanos inician en false (NO)
    tieneAlergias: false,
    tieneProbCardiacos: false,
    tieneHipertension: false,
    tieneDiabetes: false,
    tomaMedicacion: false,
    estaEmbarazada: false,
    otrosAntecedentes: false,
    observacionesAnamnesis: '' // Campo de texto para detalles
  });

  // Manejador único para todos los inputs
  const handleChange = (e) => {
    const { name, value, type } = e.target;
    
    // Si es un radio button de sí/no, convertimos el value string ("true"/"false") a booleano real
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

    // Validación básica en frontend
    if (!formData.nombre || !formData.apellido || !formData.dni || !formData.fechaNacimiento) {
        setError('Por favor complete los campos obligatorios marcados con *.');
        setLoading(false);
        return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/pacientes`, {
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

      // Si sale bien, redirigir a la lista de pacientes
      navigate('/pacientes');
      
    } catch (err) {
      console.error('Error al enviar formulario:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Componente auxiliar para una fila del checklist médico (Radio Buttons Sí/No)
  const MedicalCheckRow = ({ label, name, value, onChange }) => (
    <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
      <span className="text-gray-700 font-medium">{label}</span>
      <div className="flex items-center space-x-4">
        <label className="inline-flex items-center">
          <input
            type="radio"
            name={name}
            value="true"
            checked={value === true}
            onChange={onChange}
            className="form-radio h-4 w-4 text-teal-600 border-gray-300 focus:ring-teal-500"
          />
          <span className="ml-2 text-gray-700">Sí</span>
        </label>
        <label className="inline-flex items-center">
          <input
            type="radio"
            name={name}
            value="false"
            checked={value === false} // Esto asegura que 'No' esté marcado por defecto si el estado es false
            onChange={onChange}
            className="form-radio h-4 w-4 text-red-500 border-gray-300 focus:ring-red-500"
          />
          <span className="ml-2 text-gray-700">No</span>
        </label>
      </div>
    </div>
  );


  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        {/* Encabezado */}
        <div className="flex items-center mb-6">
            <UserPlus className="h-8 w-8 text-teal-600 mr-3" />
            <div>
                <h1 className="text-2xl font-bold text-gray-800">Nuevo Paciente</h1>
                <p className="text-gray-600">Complete la ficha de ingreso y la anamnesis inicial.</p>
            </div>
        </div>

        {/* Mensaje de Error */}
        {error && (
            <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-md flex items-start">
                <AlertCircle className="h-5 w-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
                <p className="text-red-700">{error}</p>
            </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Sección 1: Datos Personales */}
            <div className="bg-white shadow rounded-lg overflow-hidden">
                <div className="bg-gray-50 px-4 py-3 border-b flex items-center">
                    <FileText className="h-5 w-5 text-gray-500 mr-2" />
                    <h2 className="text-lg font-semibold text-gray-700">Datos Personales</h2>
                </div>
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                     {/* Nombre */}
                    <div>
                        <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
                        <input type="text" id="nombre" name="nombre" value={formData.nombre} onChange={handleChange} required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500" placeholder="Ej: Juan" />
                    </div>
                     {/* Apellido */}
                    <div>
                        <label htmlFor="apellido" className="block text-sm font-medium text-gray-700 mb-1">Apellido *</label>
                        <input type="text" id="apellido" name="apellido" value={formData.apellido} onChange={handleChange} required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500" placeholder="Ej: Pérez" />
                    </div>
                     {/* DNI */}
                    <div>
                        <label htmlFor="dni" className="block text-sm font-medium text-gray-700 mb-1">DNI *</label>
                        <input type="text" id="dni" name="dni" value={formData.dni} onChange={handleChange} required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500" placeholder="Sin puntos ni guiones" />
                    </div>
                     {/* Fecha de Nacimiento */}
                    <div>
                        <label htmlFor="fechaNacimiento" className="block text-sm font-medium text-gray-700 mb-1">Fecha de Nacimiento *</label>
                        <input type="date" id="fechaNacimiento" name="fechaNacimiento" value={formData.fechaNacimiento} onChange={handleChange} required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500" />
                    </div>
                    {/* Teléfono */}
                    <div>
                        <label htmlFor="telefono" className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                        <input type="tel" id="telefono" name="telefono" value={formData.telefono} onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500" placeholder="Ej: 11 1234-5678" />
                    </div>
                    {/* Email */}
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input type="email" id="email" name="email" value={formData.email} onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500" placeholder="correo@ejemplo.com" />
                    </div>
                     {/* Dirección (span-2 para ocupar todo el ancho) */}
                    <div className="md:col-span-2">
                        <label htmlFor="direccion" className="block text-sm font-medium text-gray-700 mb-1">Dirección</label>
                        <input type="text" id="direccion" name="direccion" value={formData.direccion} onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500" placeholder="Calle, número, localidad..." />
                    </div>
                </div>
            </div>

             {/* Sección 2: Anamnesis (Historial Médico) */}
             <div className="bg-white shadow rounded-lg overflow-hidden">
                <div className="bg-teal-50 px-4 py-3 border-b flex items-center">
                    <Activity className="h-5 w-5 text-teal-600 mr-2" />
                    <h2 className="text-lg font-semibold text-teal-800">Anamnesis Inicial</h2>
                </div>
                <div className="p-6 bg-white">
                    <p className="text-sm text-gray-500 mb-4">Marque 'Sí' si el paciente presenta alguna de las siguientes condiciones:</p>
                    
                    <div className="bg-gray-50 rounded-md p-4 border border-gray-200 mb-4">
                        <MedicalCheckRow label="¿Tiene alergias? (medicamentos, látex, etc.)" name="tieneAlergias" value={formData.tieneAlergias} onChange={handleChange} />
                        <MedicalCheckRow label="¿Tiene problemas cardíacos?" name="tieneProbCardiacos" value={formData.tieneProbCardiacos} onChange={handleChange} />
                        <MedicalCheckRow label="¿Sufre de hipertensión arterial?" name="tieneHipertension" value={formData.tieneHipertension} onChange={handleChange} />
                        <MedicalCheckRow label="¿Tiene diabetes?" name="tieneDiabetes" value={formData.tieneDiabetes} onChange={handleChange} />
                        <MedicalCheckRow label="¿Toma alguna medicación habitualmente?" name="tomaMedicacion" value={formData.tomaMedicacion} onChange={handleChange} />
                        <MedicalCheckRow label="¿Está embarazada o cree estarlo?" name="estaEmbarazada" value={formData.estaEmbarazada} onChange={handleChange} />
                        <MedicalCheckRow label="¿Otros antecedentes médicos de relevancia?" name="otrosAntecedentes" value={formData.otrosAntecedentes} onChange={handleChange} />
                    </div>

                     {/* Campo de Observaciones */}
                    <div>
                        <label htmlFor="observacionesAnamnesis" className="block text-sm font-medium text-gray-700 mb-1">Observaciones Médicas Adicionales</label>
                        <textarea
                            id="observacionesAnamnesis"
                            name="observacionesAnamnesis"
                            rows="3"
                            value={formData.observacionesAnamnesis}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                            placeholder="Detalle aquí alergias específicas, nombres de medicamentos, etc..."
                        ></textarea>
                    </div>
                </div>
            </div>

            {/* Botones de Acción */}
            <div className="flex justify-end space-x-3 pt-4">
                <button
                    type="button"
                    onClick={() => navigate('/pacientes')}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 flex items-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                    <X className="h-5 w-5 mr-2" />
                    Cancelar
                </button>
                <button
                    type="submit"
                    disabled={loading}
                    className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-white bg-teal-600 hover:bg-teal-700 flex items-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 ${loading ? 'opacity-75 cursor-not-allowed' : ''}`}
                >
                    {loading ? (
                        <>
                         <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                         </svg>
                         Guardando...
                        </>
                    ) : (
                        <>
                        <Save className="h-5 w-5 mr-2" />
                        Guardar Paciente
                        </>
                    )}
                </button>
            </div>
        </form>
      </div>
    </Layout>
  );
};

export default NewPatientPage;
