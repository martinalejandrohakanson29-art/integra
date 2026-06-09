import React, { useState, useEffect, useRef } from 'react';
import Odontograma from './Odontograma';
import SignatureCanvas from './SignatureCanvas';
import { X, Check, ImagePlus, ZoomIn, PenLine } from 'lucide-react';

const NuevaEntradaModal = ({ patientId, patientName, isOpen, onClose, onSaved }) => {
    const [profesionales, setProfesionales] = useState([]);
    const [saving, setSaving] = useState(false);
    const [imagenesPreview, setImagenesPreview] = useState([]);
    const [lightboxUrl, setLightboxUrl] = useState(null);
    const [mostrarFirma, setMostrarFirma] = useState(false);
    const fileInputRef = useRef(null);

    const [currentEntry, setCurrentEntry] = useState({
        fecha: new Date().toISOString().split('T')[0],
        observaciones: '',
        odontograma: {},
        profesionalId: '',
        imagenesUrls: [],
        firmaDigital: null
    });

    useEffect(() => {
        if (!isOpen || !patientId) return;

        const user = JSON.parse(localStorage.getItem('user'));

        const init = async () => {
            try {
                const [resPros, resC] = await Promise.all([
                    fetch('/api/profesionales'),
                    fetch(`/api/pacientes/${patientId}/consultas`)
                ]);
                const dataPros = await resPros.json();
                setProfesionales(Array.isArray(dataPros) ? dataPros : []);

                const dataConsultas = await resC.json();
                const consultas = Array.isArray(dataConsultas) ? dataConsultas : [];
                const ultimoOdontograma = consultas.length > 0 ? consultas[0].odontograma : {};

                setCurrentEntry({
                    fecha: new Date().toISOString().split('T')[0],
                    observaciones: '',
                    odontograma: ultimoOdontograma || {},
                    profesionalId: user?.id || '',
                    imagenesUrls: [],
                    firmaDigital: null
                });
                setImagenesPreview([]);
                setMostrarFirma(false);
            } catch (err) {
                console.error('Error cargando datos del modal:', err);
            }
        };

        init();
    }, [isOpen, patientId]);

    const handleImagenesChange = (e) => {
        const files = Array.from(e.target.files);
        const nuevas = files.map(file => ({ file, previewUrl: URL.createObjectURL(file) }));
        setImagenesPreview(prev => [...prev, ...nuevas]);
        e.target.value = '';
    };

    const handleRemovePreview = (index) => {
        setImagenesPreview(prev => {
            URL.revokeObjectURL(prev[index].previewUrl);
            return prev.filter((_, i) => i !== index);
        });
    };

    const handleSave = async () => {
        if (!currentEntry.observaciones.trim() || !currentEntry.profesionalId) {
            alert("Por favor, ingresa las observaciones y selecciona un profesional.");
            return;
        }
        setSaving(true);
        try {
            const res = await fetch(`/api/pacientes/${patientId}/consultas`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(currentEntry)
            });
            if (res.ok) {
                const consultaGuardada = await res.json();
                if (imagenesPreview.length > 0) {
                    const formData = new FormData();
                    imagenesPreview.forEach(({ file }) => formData.append('imagenes', file));
                    await fetch(`/api/consultas/${consultaGuardada.id}/imagenes`, { method: 'POST', body: formData });
                }
                setImagenesPreview([]);
                onSaved?.();
                onClose();
            }
        } catch (error) {
            alert("Error de conexión.");
        } finally {
            setSaving(false);
        }
    };

    if (!isOpen) return null;

    return (
        <>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 md:p-4 bg-black/60 backdrop-blur-sm">
                <div className="bg-slate-50 dark:bg-slate-950 w-full max-w-6xl h-[96dvh] md:h-[95vh] rounded-2xl md:rounded-3xl shadow-2xl overflow-hidden flex flex-col border border-white/10">

                    <div className="p-4 md:p-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center gap-2 bg-white dark:bg-slate-900 flex-shrink-0">
                        <div className="min-w-0">
                            <h2 className="text-lg md:text-xl font-black text-slate-900 dark:text-white">Nueva Entrada</h2>
                            <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1 truncate">Paciente: {patientName}</p>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full shrink-0">
                            <X className="w-6 h-6 text-slate-400" />
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 md:space-y-8 custom-scrollbar min-h-0">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-black text-slate-400 uppercase tracking-tighter">Fecha</label>
                                <input
                                    type="date"
                                    value={currentEntry.fecha}
                                    onChange={(e) => setCurrentEntry({ ...currentEntry, fecha: e.target.value })}
                                    className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white font-bold"
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-black text-slate-400 uppercase tracking-tighter">Profesional a cargo</label>
                                <select
                                    value={currentEntry.profesionalId}
                                    onChange={(e) => setCurrentEntry({ ...currentEntry, profesionalId: e.target.value })}
                                    className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white font-bold"
                                >
                                    <option value="">Seleccionar...</option>
                                    {profesionales.map(p => (
                                        <option key={p.id} value={p.id}>{p.nombre} {p.apellido}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="md:col-span-3 flex flex-col gap-2">
                                <label className="text-xs font-black text-slate-400 uppercase tracking-tighter">Observaciones del Tratamiento</label>
                                <textarea
                                    rows="4"
                                    placeholder="Describe el tratamiento realizado..."
                                    value={currentEntry.observaciones}
                                    onChange={(e) => setCurrentEntry({ ...currentEntry, observaciones: e.target.value })}
                                    className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white resize-none"
                                />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <label className="text-xs font-black text-slate-400 uppercase tracking-tighter">Estado Odontograma</label>
                            <div className="bg-white dark:bg-slate-900 p-2 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-x-auto">
                                <Odontograma
                                    data={currentEntry.odontograma}
                                    onChange={(nuevaData) => setCurrentEntry({ ...currentEntry, odontograma: nuevaData })}
                                />
                            </div>
                        </div>

                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <label className="text-xs font-black text-slate-400 uppercase tracking-tighter">Imágenes adjuntas</label>
                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    className="flex items-center gap-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 px-4 py-2 rounded-xl text-xs font-bold hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-all border border-indigo-200 dark:border-indigo-800"
                                >
                                    <ImagePlus className="w-4 h-4" />
                                    Cargar imagen
                                </button>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    className="hidden"
                                    onChange={handleImagenesChange}
                                />
                            </div>
                            {imagenesPreview.length > 0 ? (
                                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                                    {imagenesPreview.map((img, i) => (
                                        <div key={i} className="relative group rounded-xl overflow-hidden border-2 border-indigo-300 dark:border-indigo-700 aspect-square">
                                            <img src={img.previewUrl} alt="preview" className="w-full h-full object-cover" />
                                            {/* En táctil el botón de quitar queda siempre visible */}
                                            <button onClick={() => handleRemovePreview(i)} className="absolute top-0 right-0 m-1 p-1.5 bg-rose-500 rounded-full text-white shadow-lg lg:opacity-0 lg:group-hover:opacity-100 transition-opacity z-10">
                                                <X className="w-3.5 h-3.5" />
                                            </button>
                                            <div className="absolute bottom-1 left-1 bg-indigo-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">NUEVA</div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-xs text-slate-400 italic">No hay imágenes adjuntas.</p>
                            )}
                        </div>

                        {/* FIRMA DIGITAL */}
                        <div className="space-y-3 pt-2">
                            <button
                                type="button"
                                onClick={() => setMostrarFirma(v => !v)}
                                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold border transition-all ${mostrarFirma ? 'bg-indigo-600 text-white border-indigo-600 shadow-md' : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-indigo-400'}`}
                            >
                                <PenLine className="w-4 h-4" />
                                Firma Digital
                                {currentEntry.firmaDigital && !mostrarFirma && (
                                    <span className="ml-1 text-[10px] font-black bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">✓ Firmado</span>
                                )}
                            </button>

                            {mostrarFirma && (
                                <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
                                    <SignatureCanvas
                                        onChange={(dataUrl) => setCurrentEntry(prev => ({ ...prev, firmaDigital: dataUrl }))}
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="p-4 md:p-6 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex justify-end gap-3 md:gap-4 flex-shrink-0">
                        <button onClick={onClose} className="px-4 md:px-6 py-3 text-slate-500 font-bold hover:text-slate-700">Cerrar</button>
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="bg-indigo-600 text-white px-6 md:px-10 py-3 rounded-2xl font-black shadow-xl hover:bg-indigo-700 disabled:opacity-50 flex items-center justify-center gap-2 transition-all active:scale-95"
                        >
                            {saving ? "Guardando..." : <><Check className="w-5 h-5" /> Guardar Consulta</>}
                        </button>
                    </div>
                </div>
            </div>

            {lightboxUrl && (
                <div
                    className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 backdrop-blur-md p-4"
                    onClick={() => setLightboxUrl(null)}
                >
                    <button
                        className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-all"
                        onClick={() => setLightboxUrl(null)}
                    >
                        <X className="w-6 h-6 text-white" />
                    </button>
                    <img
                        src={lightboxUrl}
                        alt="ampliada"
                        className="max-h-[90vh] max-w-[95vw] rounded-2xl shadow-2xl object-contain"
                        onClick={e => e.stopPropagation()}
                    />
                </div>
            )}
        </>
    );
};

export default NuevaEntradaModal;
