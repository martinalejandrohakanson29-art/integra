import React from 'react';
import Diente from './Diente';

const Odontograma = ({ data = {}, onChange }) => {
  // Numeración estándar de adultos (FDI)
  const superior = [18, 17, 16, 15, 14, 13, 12, 11, 21, 22, 23, 24, 25, 26, 27, 28];
  const inferior = [48, 47, 46, 45, 44, 43, 42, 41, 31, 32, 33, 34, 35, 36, 37, 38];

  const handleDienteChange = (num, seccionesDiente) => {
    const nuevaData = { ...data, [num]: seccionesDiente };
    onChange(nuevaData);
  };

  return (
    <div className="p-6 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-x-auto">
      <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-6 text-center">Mapa Dental (Odontograma)</h3>
      
      <div className="flex flex-col gap-8 min-w-[800px]">
        {/* Fila Superior */}
        <div className="flex justify-center gap-2">
          {superior.map(num => (
            <Diente 
              key={num} 
              numero={num} 
              secciones={data[num]} 
              onChange={handleDienteChange} 
            />
          ))}
        </div>

        <div className="h-px bg-slate-200 dark:bg-slate-700 w-full" />

        {/* Fila Inferior */}
        <div className="flex justify-center gap-2">
          {inferior.map(num => (
            <Diente 
              key={num} 
              numero={num} 
              secciones={data[num]} 
              onChange={handleDienteChange} 
            />
          ))}
        </div>
      </div>
      
      <p className="text-[10px] text-slate-400 mt-6 text-center italic">
        Haz clic en las secciones de cada diente para marcar el trabajo a realizar.
      </p>
    </div>
  );
};

export default Odontograma;
