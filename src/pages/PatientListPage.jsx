import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../components/MainLayout';
import { Search, UserPlus, Trash2, Edit3, Phone, User, FileText } from 'lucide-react';

const PatientListPage = () => {
  const navigate = useNavigate();
  const [patients, setPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  const loadPatients = async () => {
    try {
      const res = await fetch('/api/pacientes');
      const data = await res.json();
      // Verificamos que 'data' sea una lista antes de guardarla
      if (Array.isArray(data)) {
        setPatients(data);
      } else {
        setPatients([]);
      }
    } catch (error) {
      console.error("Error cargando pacientes:", error);
      setPatients([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadPatients(); }, []);

  const handleDelete = async (id, name) => {
    if (window.confirm(`¿Estás seguro de eliminar a ${name}?`)) {
      try {
        const res = await fetch(`/api/pacientes/${id}`, { method: 'DELETE' });
        if (res.ok) {
          setPatients(prev => prev.filter(p => p.id !== id));
        }
      } catch (error) {
        alert("No se pudo conectar con el servidor.");
      }
    }
  };

  // Protección: si patients no es lista, filteredPatients será lista vacía
  const filteredPatients = Array.isArray(patients) ? patients.filter(p => 
    p.nombre.toLowerCase().includes(searchTerm.toLowerCase()) || p.dni.includes(searchTerm)
  ) : [];

  const headerActions = (
    <button 
      onClick={() => navigate('/nuevo-paciente')} 
      className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 shadow-md transition-all text-sm font-bold"
    >
      <UserPlus className="w-4 h-4" />
      <span>Nuevo Paciente</span>
    </button>
  );

  return (
    <MainLayout title="Gestión de Pacientes" activePage="pacientes" extraHeader={headerActions}>
      <div className="flex flex-col h-full space-y-4">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
          <input 
            type="text"
            placeholder="Buscar por nombre o DNI..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none dark:text-white shadow-sm"
          />
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden flex-1 flex flex-col">
          <div className="overflow-auto custom-scrollbar">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/50 sticky top-0">
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Paciente</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">DNI</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Contacto</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {loading ? (
                  <tr><td colSpan="4" className="text-center py-10 text-slate-400">Cargando base de datos...</td></tr>
                ) : filteredPatients.map(p => (
                  <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center text-indigo-600 font-bold text-xs">
                          {p.nombre.charAt(0)}
                        </div>
                        <span className="font-semibold text-slate-900 dark:text-white text-sm">{p.nombre}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-500 text-sm font-mono">{p.dni}</td>
                    <td className="px-6 py-4 text-slate-500 text-xs">
                        <div className="flex flex-col">
                          <span className="flex items-center gap-1 font-bold"><Phone className="w-3 h-3" /> {p.telefono || '-'}</span>
                          <span>{p.email || ''}</span>
                        </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => navigate(`/pacientes/${p.id}/historia`)} className="p-2 text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-lg" title="Historia Clínica">
                          <FileText className="w-4 h-4" />
                        </button>
                        <button onClick={() => navigate(`/pacientes/${p.id}/editar`)} className="p-2 text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-900/30 rounded-lg" title="Editar Datos">
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(p.id, p.nombre)} className="p-2 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/30 rounded-lg" title="Eliminar">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!loading && filteredPatients.length === 0 && (
              <div className="p-10 text-center text-slate-400">No se encontraron pacientes.</div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default PatientListPage;
