import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../components/MainLayout';
import { Search, UserPlus, Trash2, Edit3, Briefcase } from 'lucide-react';

const ProfessionalListPage = () => {
  const navigate = useNavigate();
  const [profesionales, setProfesionales] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  const loadProfesionales = async () => {
    try {
      const res = await fetch('/api/profesionales');
      const data = await res.json();
      setProfesionales(Array.isArray(data) ? data : []);
    } catch (error) { setProfesionales([]); } 
    finally { setLoading(false); }
  };

  useEffect(() => { loadProfesionales(); }, []);

  const handleDelete = async (id, name) => {
    if (window.confirm(`¿Seguro que deseas eliminar al profesional ${name} y todos sus turnos?`)) {
      await fetch(`/api/profesionales/${id}`, { method: 'DELETE' });
      setProfesionales(prev => prev.filter(p => p.id !== id));
    }
  };

  const filtered = profesionales.filter(p => 
    p.nombre.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.apellido.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const headerActions = (
    <button onClick={() => navigate('/nuevo-profesional')} className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 shadow-md font-bold text-sm">
      <UserPlus className="w-4 h-4" /> Nuevo Profesional
    </button>
  );

  return (
    <MainLayout title="Gestión de Profesionales" activePage="profesionales" extraHeader={headerActions}>
      <div className="flex flex-col h-full space-y-4">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
          <input type="text" placeholder="Buscar por nombre..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none dark:text-white" />
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 flex-1 overflow-auto custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50">
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Profesional</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Usuario (Email)</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Especialidad</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {loading ? <tr><td colSpan="4" className="text-center py-10 text-slate-400">Cargando...</td></tr> : 
               filtered.map(p => (
                <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-xs">{p.nombre.charAt(0)}</div>
                      <span className="font-semibold text-slate-900 dark:text-white">{p.nombre} {p.apellido}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-500 text-sm">{p.email}</td>
                  <td className="px-6 py-4 text-slate-500 text-sm">{p.especialidad || '-'}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => navigate(`/profesionales/${p.id}/editar`)} className="p-2 text-amber-500 hover:bg-amber-50 rounded-lg"><Edit3 className="w-4 h-4" /></button>
                      <button onClick={() => handleDelete(p.id, p.nombre)} className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                    </div>
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
export default ProfessionalListPage;
