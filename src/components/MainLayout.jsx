import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import DarkModeToggle from './DarkModeToggle';
import { Menu } from 'lucide-react';

const MainLayout = ({ children, activePage, title, extraHeader }) => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Guard de sesión: sin usuario logueado se redirige al login
  useEffect(() => {
    if (!localStorage.getItem('user')) {
      navigate('/login', { replace: true });
    }
  }, [navigate]);

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-950">
      <Sidebar
        activePage={activePage}
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
      />

      <div className="flex-1 flex flex-col h-full relative min-w-0">
        <header className="py-3 md:py-4 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between px-3 md:px-8 z-10 gap-x-4 gap-y-2 min-h-16 md:min-h-20">

          <div className="flex items-center gap-2 md:gap-4 min-w-0">
            <button
              onClick={() => setIsMenuOpen(true)}
              className="md:hidden p-2 -ml-1 text-gray-600 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg shrink-0"
              aria-label="Abrir menú"
            >
              <Menu className="w-6 h-6" />
            </button>

            <h1 className="text-base md:text-2xl font-bold text-gray-800 dark:text-white leading-tight truncate">
              {title}
            </h1>
          </div>

          {/* Aquí aparecerán los botones que cada página necesite */}
          <div className="flex items-center gap-2 md:gap-4 flex-wrap min-w-0">
            {extraHeader}
            <DarkModeToggle />
          </div>
        </header>

        <main className="flex-1 overflow-hidden p-3 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
