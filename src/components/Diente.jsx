import React from 'react';

const Diente = ({ numero, estado = {}, herramientaActual = 'blue', onChange }) => {
  
  const handleClic = (seccion) => {
    // Copiamos el estado actual de la muela (o creamos uno vacío)
    const nuevoEstado = { ...estado };

    if (herramientaActual === 'x-red') {
      // Si ya tiene cruz roja, se la quitamos (toggle). Si no, se la ponemos.
      nuevoEstado.marcaX = nuevoEstado.marcaX === 'red' ? null : 'red';
    } else if (herramientaActual === 'x-blue') {
      // Si ya tiene cruz azul, se la quitamos. Si no, se la ponemos.
      nuevoEstado.marcaX = nuevoEstado.marcaX === 'blue' ? null : 'blue';
    } else if (herramientaActual === 'borrar') {
      // Borramos la sección tocada y también la cruz por si acaso
      nuevoEstado[seccion] = null;
      nuevoEstado.marcaX = null;
    } else {
      // Si la herramienta es 'blue' o 'red' (Pintar)
      const valorActual = nuevoEstado[seccion];
      // Compatibilidad con datos viejos donde guardábamos "true"
      const valorInterpretado = valorActual === true ? 'blue' : valorActual;
      
      // Si tocamos el mismo color que ya tiene, lo despintamos. Si no, lo pintamos del nuevo color.
      if (valorInterpretado === herramientaActual) {
        nuevoEstado[seccion] = null;
      } else {
        nuevoEstado[seccion] = herramientaActual;
      }
    }
    
    // Enviamos los cambios hacia arriba
    onChange(numero, nuevoEstado);
  };

  // Función para saber qué clase de Tailwind aplicar según el color guardado
  const getStyle = (seccion) => {
    const valor = estado[seccion];
    // Soporte para legacy (true = blue)
    if (valor === true || valor === 'blue') return 'fill-indigo-500';
    if (valor === 'red') return 'fill-rose-500';
    return 'fill-white dark:fill-slate-900';
  };

  return (
    <div className="flex flex-col items-center">
      <div className="w-10 h-10 relative">
        {/* SVG de la Muela */}
        <svg viewBox="0 0 100 100" className="w-full h-full stroke-slate-400 dark:stroke-slate-600 stroke-[2px] cursor-pointer absolute inset-0 z-10">
          {/* Sección Superior */}
          <path d="M0 0 L100 0 L75 25 L25 25 Z" onClick={() => handleClic('superior')} className={`${getStyle('superior')} transition-colors hover:brightness-90`} />
          {/* Sección Inferior */}
          <path d="M0 100 L100 100 L75 75 L25 75 Z" onClick={() => handleClic('inferior')} className={`${getStyle('inferior')} transition-colors hover:brightness-90`} />
          {/* Sección Izquierda */}
          <path d="M0 0 L25 25 L25 75 L0 100 Z" onClick={() => handleClic('izquierda')} className={`${getStyle('izquierda')} transition-colors hover:brightness-90`} />
          {/* Sección Derecha */}
          <path d="M100 0 L75 25 L75 75 L100 100 Z" onClick={() => handleClic('derecha')} className={`${getStyle('derecha')} transition-colors hover:brightness-90`} />
          {/* Sección Centro */}
          <rect x="25" y="25" width="50" height="50" onClick={() => handleClic('centro')} className={`${getStyle('centro')} transition-colors hover:brightness-90`} />
        </svg>
        
        {/* SVG de la Cruz (X) Superpuesta. Se muestra solo si marcaX tiene valor */}
        {estado.marcaX && (
            <svg viewBox="0 0 100 100" className="w-full h-full absolute inset-0 z-20 pointer-events-none">
                <line x1="15" y1="15" x2="85" y2="85" stroke={estado.marcaX === 'red' ? '#f43f5e' : '#6366f1'} strokeWidth="8" strokeLinecap="round" />
                <line x1="85" y1="15" x2="15" y2="85" stroke={estado.marcaX === 'red' ? '#f43f5e' : '#6366f1'} strokeWidth="8" strokeLinecap="round" />
            </svg>
        )}
      </div>
    </div>
  );
};

export default Diente;
