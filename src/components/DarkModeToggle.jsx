import React from 'react';
import { Moon, Sun } from 'lucide-react';

const DarkModeToggle = () => {
    const toggle = () => document.documentElement.classList.toggle('dark');
    return (
        <button onClick={toggle} className="p-2 rounded-full text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 transition-colors">
            {/* Icono de Luna (para activar dark mode, visible en light) */}
            <Moon className="w-6 h-6 block dark:hidden" />
            {/* Icono de Sol (para activar light mode, visible en dark) */}
            <Sun className="w-6 h-6 hidden dark:block" />
        </button>
    );
};
export default DarkModeToggle;
