import React from 'react';

const DarkModeToggle = () => {
    const toggle = () => document.documentElement.classList.toggle('dark');
    return (
        <button onClick={toggle} className="p-2 rounded-full text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 transition-colors">
            <span className="material-symbols-outlined block dark:hidden">dark_mode</span>
            <span className="material-symbols-outlined hidden dark:block">light_mode</span>
        </button>
    );
};

export default DarkModeToggle;
