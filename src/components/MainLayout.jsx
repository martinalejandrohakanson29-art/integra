import React, { useState } from 'react';
import Sidebar from './Sidebar';
import DarkModeToggle from './DarkModeToggle';

const MainLayout = ({ children, activePage, title, subtitle }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-950">
      {/* Sidebar centralizado */}
      <Sidebar 
        activePage={activePage} 
        isOpen={isMenuOpen} 
        onClose={() => setIsMenuOpen(false)} 
      />
      
      <div className="flex-1 flex flex-col h-full relative">
        {/* Header centralizado */}
        <header className="min-h-20 py-4 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 md:px-8 z-10 gap-4">
          
          <div className="flex items-center gap-4">
            {/* Botón Hamburguesa para móvil */}
            <button 
              onClick={() => setIsMenuOpen(true)}
              className="md:hidden p-2 -ml-2 text-gray-600 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
            >
              <span className="material-symbols-outlined">menu</span>
            </button>

            <div className="flex flex-col">
              <h1 className="text-lg md:text-2xl font-bold text-gray-800 dark:text-white">{title}</h1>
              {subtitle && <p className="text-[10px] md:text-sm text-gray-500 dark:text-gray-400">{subtitle}</p>}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <DarkModeToggle />
          </div>
        </header>

        {/* Contenido de la página */}
        <main className="flex-1 overflow-hidden p-3 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
