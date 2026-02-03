import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../components/MainLayout';
import { Search, FolderOpen, User, ArrowRight } from 'lucide-react';

const PatientHistoryListPage = () => {
  const navigate = useNavigate();
  const [patients, setPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPatients = async () => {
      try {
        const res = await fetch('/api/pacientes');
        const data = await res.json();
        setPatients(data);
      } catch (error) {
        console.error("Error cargando pacientes:", error);
      } finally {
        setLoading(false);
      }
    };
    loadPatients();
  }, []);

  const filteredPatients = patients.filter(p => 
    p.nombre.toLowerCase().includes(searchTerm.toLowerCase()) || p.dni.includes(searchTerm)
  );

  return (
    <MainLayout title="Buscador de Historias Clínicas" activePage="historia">
      <div className="flex flex-col h-full space-y-6">
        
        {/* BUSCADOR ESTILO FICHERO */}
        <div className="relative max-w-2xl mx-auto w-full">
          <Search className="absolute left-4 top-3.5 h-6 w-6 text-slate-400" />
          <input 
            type="text"
            placeholder="Buscar por nombre, apellido o DNI del paciente..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-2xl shadow-sm focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none dark:text-white transition-all text-lg"
          />
        </div>

        {/* LISTADO DE RESULTADOS */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {loading ? (
              <div className="col-span-full text-center py-20 text-slate-400 font-bold">Cargando base de datos...</div>
            ) : filteredPatients.map(p => (
              <div 
                key={p.id} 
                onClick={() => navigate(`/pacientes/${p.id}/historia`)}
                className="group bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-indigo-500 shadow-sm hover:shadow-md transition-all cursor-pointer relative overflow-hidden"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600">
                    <User className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 transition-colors">{p.nombre}</h3>
                    <p className="text-sm text-slate-500 font-mono">DNI: {p.dni}</p>
                    <div className="mt-4 flex items-center text-xs font-bold text-indigo-600 uppercase tracking-wider gap-1">
                      <FolderOpen className="w-3 h-3" /> Ver Historia Clínica
                    </div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-indigo-500 transform group-hover:translate-x-1 transition-all" />
                </div>
                {/* Indicador de color del paciente */}
                <div className={`absolute top-0 right-0 w-1.5 h-full ${
                  p.colorType === 'green' ? 'bg-emerald-400' : 
                  p.colorType === 'amber' ? 'bg-amber-400' : 
                  p.colorType === 'red' ? 'bg-rose-400' : 'bg-indigo-400'
                }`} />
              </div>
            ))}

            {!loading && filteredPatients.length === 0 && (
              <div className="col-span-full p-20 text-center bg-slate-100 dark:bg-slate-800/50 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-700 text-slate-400">
                No se encontraron pacientes que coincidan con la búsqueda.
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default PatientHistoryListPage;
