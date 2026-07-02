import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../components/MainLayout';
import { Search, Plus, Trash2, Edit3, Receipt } from 'lucide-react';
import { format } from 'date-fns';

const formatearMonto = (valor) => `$${new Intl.NumberFormat('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(valor || 0)}`;

const PresupuestoListPage = () => {
  const navigate = useNavigate();
  const [presupuestos, setPresupuestos] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  const loadPresupuestos = async () => {
    try {
      const res = await fetch('/api/presupuestos');
      const data = await res.json();
      setPresupuestos(Array.isArray(data) ? data : []);
    } catch (error) {
      setPresupuestos([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadPresupuestos(); }, []);

  const handleDelete = async (id, cliente, e) => {
    e.stopPropagation();
    if (window.confirm(`¿Estás seguro de eliminar el presupuesto de ${cliente}?`)) {
      await fetch(`/api/presupuestos/${id}`, { method: 'DELETE' });
      setPresupuestos(prev => prev.filter(p => p.id !== id));
    }
  };

  const filtrados = presupuestos.filter(p =>
    (p.nombreCliente || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const headerActions = (
    <button
      onClick={() => navigate('/presupuestos/nuevo')}
      className="flex items-center gap-2 bg-indigo-600 text-white px-3 md:px-4 py-2 rounded-lg hover:bg-indigo-700 shadow-md transition-all text-sm font-bold"
    >
      <Plus className="w-4 h-4" />
      <span className="hidden sm:inline">Nuevo Presupuesto</span>
      <span className="sm:hidden">Nuevo</span>
    </button>
  );

  return (
    <MainLayout title="Presupuestos" activePage="presupuestos" extraHeader={headerActions}>
      <div className="flex flex-col h-full space-y-4">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por cliente..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none dark:text-white shadow-sm"
          />
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden flex-1 flex flex-col">
          <div className="overflow-auto custom-scrollbar flex-1">
            <table className="w-full min-w-[560px] text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/50 sticky top-0">
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Cliente</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Fecha</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Total</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {loading ? (
                  <tr><td colSpan="4" className="text-center py-10 text-slate-400">Cargando presupuestos...</td></tr>
                ) : filtrados.map(p => (
                  <tr key={p.id} onClick={() => navigate(`/presupuestos/${p.id}/editar`)} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors group cursor-pointer">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center text-indigo-600 shrink-0">
                          <Receipt className="w-4 h-4" />
                        </div>
                        <span className="font-semibold text-slate-900 dark:text-white text-sm group-hover:text-indigo-600 transition-colors">{p.nombreCliente || 'Sin nombre'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-500 text-sm">
                      {p.createdAt ? format(new Date(p.createdAt), 'dd/MM/yyyy') : '-'}
                    </td>
                    <td className="px-6 py-4 text-slate-900 dark:text-white text-sm font-bold">{formatearMonto(p.total)}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-1 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
                        <button onClick={(e) => { e.stopPropagation(); navigate(`/presupuestos/${p.id}/editar`); }} className="p-2 text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-900/30 rounded-lg" title="Editar">
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button onClick={(e) => handleDelete(p.id, p.nombreCliente, e)} className="p-2 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/30 rounded-lg" title="Eliminar">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!loading && filtrados.length === 0 && (
              <div className="p-10 text-center text-slate-400">No se encontraron presupuestos.</div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default PresupuestoListPage;
