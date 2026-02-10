import React from 'react';

const Diente = ({ numero, secciones = {}, onChange }) => {
  // Función para cambiar el estado de una sección (ahora incluye 'centro')
  const toggleSeccion = (seccion) => {
    const nuevoEstado = { ...secciones };
    nuevoEstado[seccion] = !nuevoEstado[seccion];
    onChange(numero, nuevoEstado);
  };

  // Clase para el color: Azul si está marcado, blanco si no
  const getStyle = (seccion) => 
    secciones[seccion] ? 'fill-indigo-500' : 'fill-white dark:fill-slate-900';

  return (
    <div className="flex flex-col items-center">
      <div className="w-10 h-10">
        <svg viewBox="0 0 100 100" className="w-full h-full stroke-slate-400 dark:stroke-slate-600 stroke-[2px] cursor-pointer">
          {/* Sección Superior */}
          <path d="M0 0 L100 0 L75 25 L25 25 Z" onClick={() => toggleSeccion('superior')} className={`${getStyle('superior')} transition-colors hover:fill-indigo-100`} />
          {/* Sección Inferior */}
          <path d="M0 100 L100 100 L75 75 L25 75 Z" onClick={() => toggleSeccion('inferior')} className={`${getStyle('inferior')} transition-colors hover:fill-indigo-100`} />
          {/* Sección Izquierda */}
          <path d="M0 0 L25 25 L25 75 L0 100 Z" onClick={() => toggleSeccion('izquierda')} className={`${getStyle('izquierda')} transition-colors hover:fill-indigo-100`} />
          {/* Sección Derecha */}
          <path d="M100 0 L75 25 L75 75 L100 100 Z" onClick={() => toggleSeccion('derecha')} className={`${getStyle('derecha')} transition-colors hover:fill-indigo-100`} />
          {/* Sección Centro */}
          <rect x="25" y="25" width="50" height="50" onClick={() => toggleSeccion('centro')} className={`${getStyle('centro')} transition-colors hover:fill-indigo-100`} />
        </svg>
      </div>
    </div>
  );
};

export default Diente;
