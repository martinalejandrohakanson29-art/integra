import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        const res = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        if (res.ok) {
            const user = await res.json();
            localStorage.setItem('user', JSON.stringify(user));
            navigate('/agenda');
        } else {
            setError('Usuario o contraseña incorrectos');
        }
    };

    return (
        <div className="bg-[#4e7c91] dark:bg-slate-950 min-h-screen flex items-center justify-center p-4 font-display">
            <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden">
                <div className="p-10 flex flex-col items-center border-b border-gray-100 dark:border-gray-700/50">
                    <h1 className="text-4xl font-black text-[#4e7c91]">integra</h1>
                    <p className="mt-2 text-slate-400 text-xs font-bold uppercase tracking-widest">Acceso Profesionales</p>
                </div>
                <div className="p-8">
                    <form className="space-y-6" onSubmit={handleLogin}>
                        {error && <p className="text-red-500 text-sm font-bold text-center">{error}</p>}
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700 dark:text-gray-200">Usuario</label>
                            <input className="block w-full px-4 py-3 bg-gray-100 dark:bg-slate-800 rounded-xl outline-none" 
                                value={username} onChange={e => setUsername(e.target.value)} required />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700 dark:text-gray-200">Contraseña</label>
                            <input className="block w-full px-4 py-3 bg-gray-100 dark:bg-slate-800 rounded-xl outline-none" 
                                type="password" value={password} onChange={e => setPassword(e.target.value)} required />
                        </div>
                        <button type="submit" className="w-full py-3.5 rounded-xl text-white bg-[#4e7c91] font-bold shadow-lg">
                            Ingresar
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};
export default LoginPage;
