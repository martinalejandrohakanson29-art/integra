import React from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../components/MainLayout';

const PatientListPage = () => {
  const navigate = useNavigate();

  // Mantenemos tus datos de ejemplo
  const patients = [
    { id: 1, name: "Sofía Martínez", dni: "45.123.890", tel: "+54 11 5555-0123", status: "Activo" },
    { id: 2, name: "Juan Pérez", dni: "38.221.445", tel: "+54 11 4444-2233", status: "Inactivo" },
    { id: 3, name: "Carla Rodríguez", dni: "40.112.556", tel: "+54 11 3333-1122", status: "Activo" }
  ];

  // Definimos el botón que irá en el header
  const headerActions = (
    <button 
      onClick={() => navigate('/nuevo-paciente')} 
      className="ml-auto flex items-center gap-2 bg-[#137fec] text-white px-3 md:px-4 py-2 rounded-lg hover:bg-opacity-90 shadow-sm text-sm font-bold transition-all"
    >
      <span className="material-symbols-outlined text-sm">person_add</span> 
      <span className="hidden sm:inline">Nuevo Paciente</span>
    </button>
  );

  return (
    <MainLayout 
      title="Pacientes" 
      activePage="pacientes" 
      extraHeader={headerActions}
    >
      {/* Contenedor principal de la tabla */}
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden h-full flex flex-col">
        
        {/* Contenedor de Scroll para la tabla */}
        <div className="overflow-auto custom-scrollbar">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="bg-gray-50 dark:bg-slate-800/50 sticky top-0">
                <th className="px-4 md:px-6 py-4 text-xs font-bold text-gray-500 uppercase">Paciente</th>
                <th className="px-4 md:px-6 py-4 text-xs font-bold text-gray-500 uppercase">DNI</th>
                <th className="px-4 md:px-6 py-4 text-xs font-bold text-gray-500 uppercase">Teléfono</th>
                <th className="px-4 md:px-6 py-4 text-xs font-bold text-gray-500 uppercase">Estado</th>
                <th className="px-4 md:px-6 py-4 text-xs font-bold text-gray-500 uppercase">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {patients.map(p => (
                <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="px-4 md:px-6 py-4 font-semibold text-slate-900 dark:text-white text-sm">
                    {p.name}
                  </td>
                  <td className="px-4 md:px-6 py-4 text-slate-500 text-sm">
                    {p.dni}
                  </td>
                  <td className="px-4 md:px-6 py-4 text-slate-500 text-sm">
                    {p.tel}
                  </td>
                  <td className="px-4 md:px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${
                      p.status === 'Activo' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="px-4 md:px-6 py-4">
                    <button 
                      onClick={() => navigate('/historia-clinica')} 
                      className="text-[#137fec] hover:underline font-medium text-sm"
                    >
                      Ver Historia
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </MainLayout>
  );
};

export default PatientListPage;
