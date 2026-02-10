import React from 'react';
import Diente from './Diente';

const Odontograma = ({ data = {}, onChange }) => {
  // Configuración de los cuadrantes según la ficha física
  const adultoSupDer = [18, 17, 16, 15, 14, 13, 12, 11];
  const adultoSupIzq = [21, 22, 23, 24, 25, 26, 27, 28];
  const adultoInfDer = [48, 47, 46, 45, 44, 43, 42, 41];
  const adultoInfIzq = [31, 32, 33, 34, 35, 36, 37, 38];

  const infantilSupDer = [55, 54, 53, 52, 51];
  const infantilSupIzq = [61, 62, 63, 64, 65];
  const infantilInfDer = [85, 84, 83, 82, 81];
  const infantilInfIzq = [71, 72, 73, 74, 75];

  const handleUpdate = (num, secc) => {
    onChange({ ...data, [num]: secc });
  };

  const RenderFila = ({ lista, posicionLabel = 'top' }) => (
    <div className="flex gap-1">
      {lista.map(num => (
        <div key={num} className="flex flex-col items-center gap-1">
          {posicionLabel === 'top' && <span className="text-[10px] font-bold text-slate-500">{num}</span>}
          <Diente numero={num} secciones={data[num]} onChange={handleUpdate} />
          {posicionLabel === 'bottom' && <span className="text-[10px] font-bold text-slate-500">{num}</span>}
        </div>
      ))}
    </div>
  );

  return (
    <div className="bg-white dark:bg-slate-900 p-8 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-x-auto">
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

        {/* BLOQUE INFANTIL (Dentadura de leche) */}
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
