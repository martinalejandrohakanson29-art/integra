import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

const NewPatientPage = () => {
    const navigate = useNavigate();
    
    // 1. Estado para controlar el menú lateral en móviles
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // 2. Estado para los datos del formulario
    const [formData, setFormData] = useState({
        nombre: '',
        dni: '',
        telefono: '',
        email: ''
    });

    // 3. Estado para manejar errores o carga
    const [loading, setLoading] = useState(false);

    // Función para actualizar el estado cuando el usuario escribe
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // 4. Función para enviar los datos a la Base de Datos
    const handleSubmit = async (e) => {
        e.preventDefault(); // Evita que la página se recargue
        setLoading(true);

        try {
            const response = await fetch('/api/pacientes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                // Si se guardó bien, volvemos a la lista de pacientes
                navigate('/pacientes');
            } else {
                alert("Hubo un error al guardar el paciente. Revisa si el DNI ya existe.");
            }
        } catch (error) {
            console.error("Error:", error);
            alert("No se pudo conectar con el servidor.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex h-screen overflow-hidden bg-[#fdfbf7] dark:bg-slate-950">
            <Sidebar 
                activePage="pacientes" 
                isOpen={isMenuOpen} 
                onClose={() => setIsMenuOpen(false)} 
            />

            <main className="flex-1 overflow-y-auto py-6 md:py-10 px-4 md:px-6">
                <div className="max-w-[800px] mx-auto flex flex-col">
                    
                    <div className="md:hidden mb-4 flex items-center">
                        <button 
                            onClick={() => setIsMenuOpen(true)}
                            className="p-2 -ml-2 text-gray-600 dark:text-gray-300 hover:bg-white/50 dark:hover:bg-slate-800 rounded-lg transition-colors"
                        >
                            <span className="material-symbols-outlined">menu</span>
                        </button>
                    </div>

                    <div className="flex flex-wrap justify-between gap-3 px-2 md:p-4 mb-6">
                        <div className="flex flex-col gap-2">
                            <p className="text-[#0d141b] dark:text-white text-2xl md:text-4xl font-black leading-tight">
                                Registro de Nuevo Paciente
                            </p>
                            <p className="text-[#4c739a] dark:text-slate-400 text-sm md:text-base font-normal">
                                Ingrese los datos personales para dar de alta al paciente en el sistema.
                            </p>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-slate-900 shadow-sm rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden p-5 md:p-8">
                        <form className="flex flex-col gap-5 md:gap-6" onSubmit={handleSubmit}>
                            
                            <div className="flex flex-col gap-2">
                                <label className="text-[#0d141b] dark:text-slate-200 text-sm md:text-base font-medium pb-1 md:pb-2">Nombre Completo</label>
                                <input 
                                    name="nombre"
                                    value={formData.nombre}
                                    onChange={handleChange}
                                    required
                                    className="form-input w-full rounded-lg border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 h-12 md:h-14 p-4 dark:text-white text-sm md:text-base" 
                                    placeholder="Ej: Juan Pérez" 
                                    type="text" 
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
                                <div className="flex flex-col gap-2">
                                    <label className="text-[#0d141b] dark:text-slate-200 text-sm md:text-base font-medium pb-1 md:pb-2">DNI (Único)</label>
                                    <input 
                                        name="dni"
                                        value={formData.dni}
                                        onChange={handleChange}
                                        required
                                        className="form-input w-full rounded-lg border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 h-12 md:h-14 p-4 dark:text-white text-sm" 
                                        placeholder="Número de documento" 
                                        type="text" 
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-[#0d141b] dark:text-slate-200 text-sm md:text-base font-medium pb-1 md:pb-2">Teléfono</label>
                                    <input 
                                        name="telefono"
                                        value={formData.telefono}
                                        onChange={handleChange}
                                        className="form-input w-full rounded-lg border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 h-12 md:h-14 p-4 dark:text-white text-sm" 
                                        placeholder="Ej: 3511234567" 
                                        type="tel" 
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="text-[#0d141b] dark:text-slate-200 text-sm md:text-base font-medium pb-1 md:pb-2">Correo Electrónico</label>
                                <input 
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="form-input w-full rounded-lg border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 h-12 md:h-14 p-4 dark:text-white text-sm" 
                                    placeholder="ejemplo@correo.com" 
                                    type="email" 
                                />
                            </div>

                            <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-3 md:gap-4 mt-4 pt-6 border-t border-slate-100 dark:border-slate-800">
                                <button 
                                    onClick={() => navigate('/pacientes')} 
                                    className="w-full sm:w-auto px-6 py-3 rounded-lg text-sm font-semibold text-[#4c739a] hover:bg-slate-100 dark:hover:bg-slate-800 transition-all" 
                                    type="button"
                                    disabled={loading}
                                >
                                    Cancelar
                                </button>
                                <button 
                                    className={`w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3 bg-[#137fec] text-white rounded-lg text-sm font-bold shadow-md hover:bg-opacity-90 transition-all ${loading ? 'opacity-50 cursor-not-allowed' : ''}`} 
                                    type="submit"
                                    disabled={loading}
                                >
                                    <span className="material-symbols-outlined text-lg">
                                        {loading ? 'sync' : 'person_add'}
                                    </span> 
                                    {loading ? 'Guardando...' : 'Guardar Paciente'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default NewPatientPage;
