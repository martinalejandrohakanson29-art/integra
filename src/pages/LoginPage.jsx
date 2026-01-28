import React from 'react';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
    const navigate = useNavigate();
    return (
        <div className="bg-[#4e7c91] dark:bg-slate-950 min-h-screen flex items-center justify-center p-4 font-display">
            <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden">
                <div className="relative bg-[#FDFBF7] dark:bg-slate-800 p-10 flex flex-col items-center justify-center border-b border-gray-100 dark:border-gray-700/50">
                    <img alt="Logo" className="w-56 h-auto object-contain" src="https://lh3.googleusercontent.com/aida-public/AB6AXuApGM-ZCUU-bssUonL1A262-pgIggHOMb6EU_Hkzb79y-dPv71hhMwl1NXBexQ2JBTqwrd_Wigbjn-otpEGl96QSFj7LWia8SijZaWVXShxfsgWzvcpga2FtwVpt2imtPfX8GcGrnuu2HBA6y5xDLIAhY6Z828Gg8Mg4vDinFc5tq56PbyBzUQy6PZvK4raIDvd91oup_dYB0aOiDfrcyEApiBZy6zy3e8GseZiwjhv0aLCODTedzpbfz0XURvuJsXQhslVvitwmpw" />
                    <p className="mt-6 text-[#4e7c91] dark:text-gray-300 text-sm font-medium tracking-wide uppercase text-center opacity-80">Portal de Gestión Clínica</p>
                </div>
                <div className="p-8 pt-10">
                    <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); navigate('/agenda'); }}>
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Nombre de usuario o correo</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <span className="material-symbols-outlined text-gray-400">person</span>
                                </div>
                                <input className="block w-full pl-11 pr-4 py-3 bg-gray-100 dark:bg-slate-800 border-transparent rounded-xl text-sm" placeholder="usuario@clinica.com" type="text" required />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Contraseña</label>
                                <a className="text-xs font-medium text-[#4e7c91]" href="#">¿Olvidaste tu contraseña?</a>
                            </div>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <span className="material-symbols-outlined text-gray-400">lock</span>
                                </div>
                                <input className="block w-full pl-11 pr-12 py-3 bg-gray-100 dark:bg-slate-800 border-transparent rounded-xl text-sm" placeholder="••••••••" type="password" required />
                            </div>
                        </div>
                        <button type="submit" className="w-full py-3.5 px-4 rounded-xl text-sm font-bold text-white bg-[#4e7c91] hover:bg-opacity-90 shadow-md flex justify-center items-center">
                            Iniciar Sesión <span className="material-symbols-outlined ml-2 text-[18px]">arrow_forward</span>
                        </button>
                    </form>
                </div>
            </div>
            <button onClick={() => document.documentElement.classList.toggle('dark')} className="fixed bottom-6 right-6 p-3 bg-white dark:bg-slate-800 text-[#4e7c91] rounded-full shadow-lg border border-gray-100 dark:border-gray-700">
                <span className="material-symbols-outlined block dark:hidden">dark_mode</span>
                <span className="material-symbols-outlined hidden dark:block">light_mode</span>
            </button>
        </div>
    );
};
export default LoginPage;
