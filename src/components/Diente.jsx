import React from 'react';

const Diente = ({ numero, secciones = {}, onChange }) => {
  // Las 4 secciones que pidió el usuario
  const caras = ['superior', 'inferior', 'izquierda', 'derecha'];

  const toggleCara = (cara) => {
    const nuevoEstado = { ...secciones };
    nuevoEstado[cara] = !nuevoEstado[cara];
    onChange(numero, nuevoEstado);
  };

  return (
    <div className="flex flex-col items-center gap-1">
      <span className="text-[10px] font-bold text-slate-400">{numero}</span>
      <div className="relative w-10 h-10 border-2 border-slate-300 dark:border-slate-600 rotate-45 overflow-hidden bg-white dark:bg-slate-800">
        {/* Sección Superior */}
        <div 
          onClick={() => toggleCara('superior')}
          className={`absolute top-0 left-0 w-full h-1/2 border-b border-slate-200 cursor-pointer hover:bg-indigo-100 ${secciones.superior ? 'bg-indigo-500' : ''}`}
        />
        {/* Sección Inferior */}
        <div 
          onClick={() => toggleCara('inferior')}
          className={`absolute bottom-0 left-0 w-full h-1/2 cursor-pointer hover:bg-indigo-100 ${secciones.inferior ? 'bg-indigo-500' : ''}`}
        />
        {/* Sección Izquierda */}
        <div 
          onClick={() => toggleCara('izquierda')}
          className={`absolute top-0 left-0 w-1/2 h-full border-r border-slate-200 cursor-pointer hover:bg-indigo-100 ${secciones.izquierda ? 'bg-indigo-500' : ''}`}
        />
        {/* Sección Derecha */}
        <div 
          onClick={() => toggleCara('derecha')}
          className={`absolute top-0 right-0 w-1/2 h-full cursor-pointer hover:bg-indigo-100 ${secciones.derecha ? 'bg-indigo-500' : ''}`}
        />
      </div>
    </div>
  );
};

export default Diente;
