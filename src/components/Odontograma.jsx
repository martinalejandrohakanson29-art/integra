import React, { useState } from 'react';
import Diente from './Diente';
import { Eraser, X } from 'lucide-react';

const Odontograma = ({ data = {}, onChange }) => {
  // Estado para la barra de herramientas. Por defecto arranca en 'blue' (Pintar Azul)
  const [herramienta, setHerramienta] = useState('blue');

  // Configuración de los cuadrantes según la ficha física
  const adultoSupDer = [18, 17, 16, 15, 14, 13, 12, 11];
  const adultoSupIzq = [21, 22, 23, 24, 25, 26, 27, 28];
  const adultoInfDer = [48, 47, 46, 45, 44, 43, 42, 41];
  const adultoInfIzq = [31, 32, 33, 34, 35, 36, 37, 38];

  const infantilSupDer = [55, 54, 53, 52, 51];
  const infantilSupIzq = [61, 62, 63, 64, 65];
  const infantilInfDer = [85, 84, 83, 82, 81];
  const infantilInfIzq = [71, 72, 73, 74, 75];

  const handleUpdate = (num, estadoDiente) => {
    onChange({ ...data, [num]: estadoDiente });
  };

  const RenderFila = ({ lista, posicionLabel = 'top' }) => (
    <div className="flex gap-1">
      {lista.map(num => (
        <div key={num} className="flex flex-col items-center gap-1">
          {posicionLabel === 'top' && <span className="text-[10px] font-bold text-slate-500">{num}</span>}
          <Diente 
            numero={num} 
            estado={data[num] || {}} 
            herramientaActual={herramienta} 
            onChange={handleUpdate} 
          />
          {posicionLabel === 'bottom' && <span className="text-[10px] font-bold text-slate-500">{num}</span>}
        </div>
      ))}
    </div>
  );

  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-x-auto flex flex-col gap-6">
      
      {/* BARRA DE HERRAMIENTAS */}
      <div className="flex flex-wrap items-center gap-2 bg-slate-50 dark:bg-slate-800/50 p-2 rounded-lg border border-slate-100 dark:border-slate-800 self-start">
        <span className="text-xs font-bold text-slate-500 mr-2 uppercase tracking-wider hidden sm:block">Herramientas:</span>
        
        {/* Herramienta: Pintar Azul */}
        <button type="button" onClick={() => setHerramienta('blue')} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition-all ${herramienta === 'blue' ? 'bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 ring-2 ring-indigo-500 border-transparent' : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700'}`}>
            <div className="w-3 h-3 rounded-full bg-indigo-500"></div> Azul
        </button>
        
        {/* Herramienta: Pintar Rojo */}
        <button type="button" onClick={() => setHerramienta('red')} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition-all ${herramienta === 'red' ? 'bg-rose-100 dark:bg-rose-900/40 text-rose-700 dark:text-rose-300 ring-2 ring-rose-500 border-transparent' : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700'}`}>
            <div className="w-3 h-3 rounded-full bg-rose-500"></div> Rojo
        </button>

        <div className="w-px h-6 bg-slate-300 dark:bg-slate-600 mx-1"></div>

        {/* Herramienta: Cruz Azul */}
        <button type="button" onClick={() => setHerramienta('x-blue')} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition-all ${herramienta === 'x-blue' ? 'bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 ring-2 ring-indigo-500 border-transparent' : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700'}`}>
            <X className="w-3.5 h-3.5 text-indigo-500 stroke-[3px]" /> Marca Azul
        </button>
        
        {/* Herramienta: Cruz Roja */}
        <button type="button" onClick={() => setHerramienta('x-red')} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition-all ${herramienta === 'x-red' ? 'bg-rose-100 dark:bg-rose-900/40 text-rose-700 dark:text-rose-300 ring-2 ring-rose-500 border-transparent' : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700'}`}>
            <X className="w-3.5 h-3.5 text-rose-500 stroke-[3px]" /> Marca Roja
        </button>

        <div className="w-px h-6 bg-slate-300 dark:bg-slate-600 mx-1"></div>

        {/* Herramienta: Borrar */}
        <button type="button" onClick={() => setHerramienta('borrar')} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition-all ${herramienta === 'borrar' ? 'bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-white ring-2 ring-slate-500 border-transparent' : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700'}`}>
            <Eraser className="w-3.5 h-3.5" /> Borrar
        </button>
      </div>

      <div className="min-w-[850px] flex flex-col gap-10">
        
        {/* BLOQUE ADULTOS */}
        <div className="relative border-2 border-slate-100 dark:border-slate-800 p-6 rounded-lg">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 h-full w-[2px] bg-slate-200 dark:bg-slate-700"></div>
          <div className="flex flex-col gap-6">
            <div className="flex justify-center gap-12">
              <RenderFila lista={adultoSupDer} />
              <RenderFila lista={adultoSupIzq} />
            </div>
            <div className="flex justify-center gap-12">
              <RenderFila lista={adultoInfDer} posicionLabel="bottom" />
              <RenderFila lista={adultoInfIzq} posicionLabel="bottom" />
            </div>
          </div>
        </div>

        {/* BLOQUE INFANTIL */}
        <div className="flex items-center gap-4">
          <span className="text-[10px] font-black text-slate-300 uppercase rotate-180 [writing-mode:vertical-lr]">Derecha</span>
          <div className="flex-1 relative border-2 border-slate-100 dark:border-slate-800 p-6 rounded-lg bg-slate-50/30 dark:bg-slate-800/20">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 h-full w-[1px] bg-slate-200 dark:bg-slate-700"></div>
            <div className="flex flex-col gap-6">
              <div className="flex justify-center gap-12">
                <RenderFila lista={infantilSupDer} />
                <RenderFila lista={infantilSupIzq} />
              </div>
              <div className="flex justify-center gap-12">
                <RenderFila lista={infantilInfDer} posicionLabel="bottom" />
                <RenderFila lista={infantilInfIzq} posicionLabel="bottom" />
              </div>
            </div>
          </div>
          <span className="text-[10px] font-black text-slate-300 uppercase [writing-mode:vertical-lr]">Izquierda</span>
        </div>

      </div>
    </div>
  );
};

export default Odontograma;
