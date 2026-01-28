import React from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../components/MainLayout';

const PatientHistoryPage = () => {
    const navigate = useNavigate();

    // Definimos el buscador para pasarlo al header del Layout
    const historySearch = (
        <div className="relative hidden sm:block">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="material-symbols-outlined text-slate-400 text-lg">search</span>
            </span>
            <input 
                className="pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-800 border-none rounded-full text-sm focus:ring-2 focus:ring-[#517A91] w-48 md:w-64 text-slate-900 dark:text-white outline-none transition-all" 
                placeholder="Buscar registros..." 
                type="text" 
            />
        </div>
    );

    return (
        <MainLayout 
            title="Sofía Martínez" 
            subtitle="Historia Clínica" 
            activePage="pacientes" 
            showBackButton={true} // Esto activa la flecha para volver a la lista
            extraHeader={historySearch}
        >
            {/* Contenedor con scroll para el contenido médico */}
            <div className="h-full overflow-y-auto pr-2 custom-scrollbar">
                <div className="max-w-6xl mx-auto space-y-6 pb-10">
                    
                    {/* Tarjeta de Perfil del Paciente */}
                    <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 transition-colors">
                        <div className="flex items-center gap-6">
                            <div className="relative">
                                <img 
                                    alt="Sofía" 
                                    className="w-20 h-20 rounded-full object-cover border-4 border-slate-50 dark:border-slate-800 shadow-md" 
                                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuD2D3QJMxRzljuROdy0KbzVaLBs6E2ySVG8XjLbQ-CAMVqi-NXqLXNB8wWdGKLIuSImgjaAYKqfhT5cebjcLOwuZdt4XAxt9SmQF_9uPeSMGKFUV8Stzlri8L2_yt9hCUEu1zxFbykE-wb5jqCPUHXFKIjloMGzom3Gxm4zS919iZGQVUZPvTabUz3EX2F7_q4gNDexa6QL_SFh8RG7SH7DnKNPhIJUTH2CJhLIOifhYN9ffPUM1PPam8dosG6UeV15GxjWwZS3KTI" 
                                />
                                <span className="absolute bottom-1 right-1 w-5 h-5 bg-green-500 border-2 border-white dark:border-slate-900 rounded-full"></span>
                            </div>
                            <div>
                                <div className="flex items-center gap-3 mb-1">
                                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Sofía Martínez</h2>
                                    <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-semibold rounded-full border border-blue-200 dark:border-blue-800">Activo</span>
                                </div>
                                <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-slate-500">
                                    <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800 px-2 py-1 rounded-lg border border-slate-100 dark:border-slate-700">
                                        <span className="material-symbols-outlined text-lg opacity-70">badge</span>
                                        <span className="font-bold">DNI:</span> <span className="text-slate-900 dark:text-white font-medium">45.123.890</span>
                                    </div>
                                    <div className="flex items-center gap-1.5"><span className="material-symbols-outlined text-lg opacity-70">cake</span><span>32 Años</span></div>
                                    <div className="flex items-center gap-1.5"><span className="material-symbols-outlined text-lg opacity-70">phone</span><span>+54 11 5555-0123</span></div>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 w-full md:w-auto">
                            <button className="flex-1 md:flex-none px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-700 shadow-sm transition-colors text-slate-700 dark:text-slate-200">Editar Info</button>
                            <button 
                                onClick={() => navigate('/editar-turno')}
                                className="flex-1 md:flex-none px-4 py-2.5 bg-[#517A91] text-white rounded-xl text-sm font-medium hover:bg-opacity-90 shadow-lg shadow-[#517A91]/20 transition-all"
                            >
                                Nueva Cita
                            </button>
                        </div>
                    </div>

                    {/* Contenedor de Tabs e Historial */}
                    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 min-h-[600px] flex flex-col transition-colors overflow-hidden">
                        <div className="border-b border-slate-200 dark:border-slate-800 px-2 md:px-6">
                            <nav className="flex space-x-2 md:space-x-8 overflow-x-auto no-scrollbar">
                                {['Información Personal', 'Historial de Tratamientos', 'Notas', 'Facturación'].map((tab, i) => (
                                    <a key={tab} href="#" className={`${i === 1 ? 'border-[#517A91] text-[#517A91]' : 'border-transparent text-slate-500 hover:text-slate-700'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}>
                                        {tab}
                                    </a>
                                ))}
                            </nav>
                        </div>

                        <div className="p-6 md:p-8 flex-1">
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Historial Médico</h3>
                            </div>

                            {/* Línea de Tiempo (Timeline) */}
                            <div className="relative pl-4 md:pl-8 border-l-2 border-slate-200 dark:border-slate-800 space-y-12">
                                
                                {/* Entrada de Historia 1 */}
                                <div className="relative">
                                    <div className="absolute -left-[23px] md:-left-[39px] mt-1.5 h-5 w-5 rounded-full border-4 border-white dark:border-slate-900 bg-yellow-400"></div>
                                    <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                                        <div className="sm:w-32 flex-shrink-0 pt-1">
                                            <p className="text-sm font-bold text-slate-900 dark:text-white">12 Nov, 2023</p>
                                            <p className="text-xs text-slate-500">10:30 AM</p>
                                            <span className="inline-flex mt-2 px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300">Programado</span>
                                        </div>
                                        <div className="flex-1 bg-slate-50 dark:bg-slate-800/50 rounded-xl p-5 border border-slate-100 dark:border-slate-700 hover:border-[#517A91]/30 transition-all">
                                            <h4 className="text-base font-bold text-slate-900 dark:text-white mb-2">Ajuste de Ortodoncia</h4>
                                            <p className="text-sm text-slate-500 mb-3">Ajuste mensual de rutina de brackets superiores e inferiores. Control de avance en alineación de caninos.</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Entrada de Historia 2 */}
                                <div className="relative">
                                    <div className="absolute -left-[23px] md:-left-[39px] mt-1.5 h-5 w-5 rounded-full border-4 border-white dark:border-slate-900 bg-[#517A91]"></div>
                                    <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                                        <div className="sm:w-32 flex-shrink-0 pt-1">
                                            <p className="text-sm font-bold text-slate-900 dark:text-white">15 Oct, 2023</p>
                                            <p className="text-xs text-slate-500">09:00 AM</p>
                                            <span className="inline-flex mt-2 px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">Completado</span>
                                        </div>
                                        <div className="flex-1 bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200 dark:border-slate-700 hover:border-[#517A91]/30 transition-all">
                                            <h4 className="text-base font-bold text-slate-900 dark:text-white mb-2">Higiene Dental y Limpieza</h4>
                                            <p className="text-sm text-slate-500">Profilaxis completada. El paciente reportó ligera sensibilidad en el cuadrante inferior izquierdo.</p>
                                            <div className="mt-3 flex gap-2">
                                                <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-50 dark:bg-slate-700/50 text-slate-500 rounded-lg text-xs border border-slate-200 dark:border-slate-600 cursor-pointer hover:bg-slate-100 transition-colors">
                                                    <span className="material-symbols-outlined text-sm text-red-400">picture_as_pdf</span> Reporte_Limpieza.pdf
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};

export default PatientHistoryPage;
