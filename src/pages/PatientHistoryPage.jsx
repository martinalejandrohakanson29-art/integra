import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import MainLayout from '../components/MainLayout';
import Odontograma from '../components/Odontograma';
import SignatureCanvas from '../components/SignatureCanvas';
import { Calendar, Phone, Activity, ArrowLeft, FileText, X, Plus, Clock, Eye, Trash2, Edit3, Check, Stethoscope, ImagePlus, ZoomIn, PenLine, Mail, MapPin, CreditCard, ShieldCheck, FileDown } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import jsPDF from 'jspdf';
import { crearHelpersPdf, coloresPdf, MARGIN_X, MARGIN_TOP, MARGIN_BOTTOM } from '../utils/pdfEstilos';

// Las fechas vienen como ISO UTC ("2026-06-09T00:00:00.000Z"): si se parsean directo,
// en husos horarios negativos se muestra el día anterior. Usamos solo la parte de fecha.
const fechaLocal = (iso) => new Date(`${String(iso).split('T')[0]}T00:00:00`);

const calcularEdad = (iso) => {
    if (!iso) return null;
    const nac = fechaLocal(iso);
    const hoy = new Date();
    let edad = hoy.getFullYear() - nac.getFullYear();
    const m = hoy.getMonth() - nac.getMonth();
    if (m < 0 || (m === 0 && hoy.getDate() < nac.getDate())) edad--;
    return edad;
};

const PatientHistoryPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [patient, setPatient] = useState(null);
    const [consultas, setConsultas] = useState([]);
    const [profesionales, setProfesionales] = useState([]);
    const [loading, setLoading] = useState(true);
    
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState('create');
    const [saving, setSaving] = useState(false);
    const [uploadingImages, setUploadingImages] = useState(false);
    const [imagenesPreview, setImagenesPreview] = useState([]); // { file, previewUrl }
    const [lightboxUrl, setLightboxUrl] = useState(null);
    const [mostrarFirma, setMostrarFirma] = useState(false);
    const [mostrarFirmaPaciente, setMostrarFirmaPaciente] = useState(false);
    const [firmaPacienteTemp, setFirmaPacienteTemp] = useState(null);
    const [savingFirma, setSavingFirma] = useState(false);
    const fileInputRef = useRef(null);

    const [currentEntry, setCurrentEntry] = useState({
        id: null,
        fecha: new Date().toISOString().split('T')[0],
        observaciones: '',
        odontograma: {},
        profesionalId: '',
        imagenesUrls: [],
        firmaDigital: null
    });

    const loadData = async () => {
        try {
            const [resP, resC, resPros] = await Promise.all([
                fetch(`/api/pacientes/${id}`),
                fetch(`/api/pacientes/${id}/consultas`),
                fetch('/api/profesionales')
            ]);

            if (resP.ok) {
                const dataPaciente = await resP.json();
                setPatient(dataPaciente);
            }

            const dataConsultas = await resC.json();
            setConsultas(Array.isArray(dataConsultas) ? dataConsultas : []);

            const dataPros = await resPros.json();
            setProfesionales(Array.isArray(dataPros) ? dataPros : []);

        } catch (error) {
            console.error("Error cargando datos:", error);
            setPatient(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { 
        if (id) loadData(); 
    }, [id]);

    const handleOpenCreate = () => {
        const user = JSON.parse(localStorage.getItem('user'));
        setModalMode('create');
        const ultimoOdontograma = consultas.length > 0 ? consultas[0].odontograma : {};
        setCurrentEntry({
            id: null,
            fecha: new Date().toISOString().split('T')[0],
            observaciones: '',
            odontograma: ultimoOdontograma || {},
            profesionalId: user?.id || '',
            imagenesUrls: [],
            firmaDigital: null
        });
        setImagenesPreview([]);
        setMostrarFirma(false);
        setIsModalOpen(true);
    };

    const handleOpenView = (consulta) => {
        setModalMode('view');
        setCurrentEntry({
            id: consulta.id,
            fecha: consulta.fecha ? consulta.fecha.split('T')[0] : new Date().toISOString().split('T')[0],
            observaciones: consulta.observaciones || '',
            odontograma: consulta.odontograma || {},
            profesionalId: consulta.profesionalId || '',
            imagenesUrls: consulta.imagenesUrls || [],
            firmaDigital: consulta.firmaDigital || null
        });
        setImagenesPreview([]);
        setMostrarFirma(false);
        setIsModalOpen(true);
    };

    const handleDeleteConsulta = async (consultaId, e) => {
        e.stopPropagation(); 
        if (window.confirm("¿Estás seguro de eliminar esta entrada?")) {
            await fetch(`/api/consultas/${consultaId}`, { method: 'DELETE' });
            loadData();
        }
    };

    const handleGeneratePdf = () => {
        const doc = new jsPDF({ unit: 'pt', format: 'a4' });
        const { pageWidth, pageHeight, centrarTexto, lineaPunteada, dibujarEncabezado, dibujarPie } = crearHelpersPdf(doc);
        const maxWidth = pageWidth - MARGIN_X * 2;

        let y = dibujarEncabezado('Historial de Consultas');

        // DATOS DEL PACIENTE
        centrarTexto(`${patient.nombre} ${patient.apellido || ''}`.trim(), y, 12, 'bold');
        y += 16;
        if (patient.dni) {
            centrarTexto(`DNI: ${patient.dni}`, y, 9, 'normal', coloresPdf.grisTexto);
            y += 14;
        }
        y += 10;
        lineaPunteada(y, coloresPdf.indigo);
        y += 26;

        const asegurarEspacio = (alturaNecesaria) => {
            if (y + alturaNecesaria > pageHeight - MARGIN_BOTTOM) {
                doc.addPage();
                y = MARGIN_TOP;
            }
        };

        if (consultas.length === 0) {
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(10);
            doc.setTextColor(...coloresPdf.grisTexto);
            doc.text('No hay consultas registradas.', MARGIN_X, y);
        }

        consultas.forEach((c, index) => {
            const fechaTexto = c.fecha ? format(fechaLocal(c.fecha), "dd 'de' MMMM, yyyy", { locale: es }) : 'Fecha no disponible';
            const observaciones = c.observaciones || 'Sin observaciones.';
            const lineasObs = doc.splitTextToSize(observaciones, maxWidth);
            const alturaBloque = 18 + lineasObs.length * 13 + 22;

            asegurarEspacio(alturaBloque);

            doc.setFont('helvetica', 'bold');
            doc.setFontSize(11);
            doc.setTextColor(...coloresPdf.indigo);
            doc.text(fechaTexto, MARGIN_X, y);
            y += 18;

            doc.setFont('helvetica', 'normal');
            doc.setFontSize(10);
            doc.setTextColor(...coloresPdf.textoCuerpo);
            doc.text(lineasObs, MARGIN_X, y);
            y += lineasObs.length * 13 + 16;

            if (index < consultas.length - 1) {
                lineaPunteada(y);
                y += 22;
            }
        });

        dibujarPie();

        doc.save(`historial-${(patient.nombre || 'paciente').replace(/\s+/g, '_')}.pdf`);
    };

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

    const handleDeleteImagen = async (url, e) => {
        e.stopPropagation();
        if (window.confirm("¿Estás seguro de eliminar esta imagen permanentemente?")) {
            try {
                const res = await fetch(`/api/consultas/${currentEntry.id}/imagenes`, {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ url })
                });
                if (res.ok) {
                    const data = await res.json();
                    setCurrentEntry(prev => ({ ...prev, imagenesUrls: data.imagenesUrls }));
                    loadData();
                }
            } catch (err) {
                alert("Error al eliminar la imagen.");
            }
        }
    };

    const uploadImagenes = async (consultaId) => {
        if (imagenesPreview.length === 0) return;
        setUploadingImages(true);
        try {
            const formData = new FormData();
            imagenesPreview.forEach(({ file }) => formData.append('imagenes', file));
            await fetch(`/api/consultas/${consultaId}/imagenes`, { method: 'POST', body: formData });
        } catch (err) {
            console.error('Error subiendo imágenes:', err);
        } finally {
            setUploadingImages(false);
        }
    };

    const handleSave = async () => {
        if (!currentEntry.observaciones.trim() || !currentEntry.profesionalId) {
            alert("Por favor, ingresa las observaciones y selecciona un profesional.");
            return;
        }

        setSaving(true);
        try {
            const url = modalMode === 'create' 
                ? `/api/pacientes/${id}/consultas` 
                : `/api/consultas/${currentEntry.id}`;
            
            const method = modalMode === 'create' ? 'POST' : 'PATCH';

            const res = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(currentEntry)
            });

            if (res.ok) {
                const consultaGuardada = await res.json();
                // Subir imágenes si las hay
                await uploadImagenes(consultaGuardada.id || currentEntry.id);
                setIsModalOpen(false);
                setImagenesPreview([]);
                loadData();
            }
        } catch (error) {
            alert("Error de conexión.");
        } finally {
            setSaving(false);
        }
    };

    const handleSaveFirmaPaciente = async () => {
        if (!firmaPacienteTemp) return;
        setSavingFirma(true);
        try {
            const res = await fetch(`/api/pacientes/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ firmaDigital: firmaPacienteTemp })
            });
            if (res.ok) {
                setPatient(prev => ({ ...prev, firmaDigital: firmaPacienteTemp }));
                setMostrarFirmaPaciente(false);
                setFirmaPacienteTemp(null);
            }
        } catch {
            alert('Error al guardar la firma.');
        } finally {
            setSavingFirma(false);
        }
    };

    if (loading) return <MainLayout title="Cargando..."> <div className="p-10 text-center text-slate-400">Buscando ficha médica...</div> </MainLayout>;
    
    if (!patient) return (
        <MainLayout title="Error">
            <div className="p-10 text-center flex flex-col items-center gap-4">
                <p className="text-slate-500 font-bold">No se encontró el paciente solicitado.</p>
                <button onClick={() => navigate('/pacientes')} className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-bold shadow-lg">
                    Volver a Pacientes
                </button>
            </div>
        </MainLayout>
    );

    return (
        <>
        <MainLayout title={patient.nombre + " " + (patient.apellido || "")} activePage="pacientes">
            <div className="h-full overflow-y-auto pr-2 custom-scrollbar">
                <div className="max-w-6xl mx-auto space-y-6 pb-20">
                    
                    <button onClick={() => navigate('/pacientes')} className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-colors font-bold text-sm mb-2">
                        <ArrowLeft className="w-4 h-4" /> Volver a Pacientes
                    </button>

                    <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
                        <div className="px-5 md:px-8 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                                <Stethoscope className="w-5 h-5 text-indigo-500" />
                                <h3 className="font-bold text-slate-900 dark:text-white">Ficha Médica</h3>
                            </div>
                            <button onClick={() => navigate(`/pacientes/${id}/editar`)} className="flex items-center gap-2 bg-amber-500 text-white px-3 md:px-4 py-2 rounded-xl text-xs font-bold hover:bg-amber-600 transition-all shadow-sm">
                                <Edit3 className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Editar datos</span><span className="sm:hidden">Editar</span>
                            </button>
                        </div>
                        <div className="p-5 md:p-8 space-y-6">
                            <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-start">
                                <div className="w-24 h-24 shrink-0 rounded-2xl bg-[#517A91] flex items-center justify-center text-white text-4xl font-black shadow-xl overflow-hidden">
                                    {patient.fotoUrl ? (
                                        <img src={patient.fotoUrl} alt={patient.nombre} className="w-full h-full object-cover" />
                                    ) : (
                                        patient.nombre.charAt(0)
                                    )}
                                </div>
                                <div className="flex-1 w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-5">
                                    <div>
                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5"><CreditCard className="w-3 h-3" /> Documento (DNI)</label>
                                        <p className="text-slate-900 dark:text-white font-bold text-lg">{patient.dni}</p>
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5"><Calendar className="w-3 h-3" /> Fecha de Nacimiento</label>
                                        <p className="text-slate-900 dark:text-white font-bold">
                                            {patient.fechaNacimiento ? format(fechaLocal(patient.fechaNacimiento), "dd/MM/yyyy") : '—'}
                                            {calcularEdad(patient.fechaNacimiento) !== null && (
                                                <span className="ml-2 text-xs font-bold text-slate-400">({calcularEdad(patient.fechaNacimiento)} años)</span>
                                            )}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5"><ShieldCheck className="w-3 h-3" /> Obra Social</label>
                                        <p className="text-indigo-600 dark:text-indigo-400 font-bold">{patient.obraSocial || 'Particular'}</p>
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5"><Phone className="w-3 h-3" /> Teléfono / WhatsApp</label>
                                        <p className="text-slate-900 dark:text-white font-bold">{patient.telefono || '—'}</p>
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5"><Mail className="w-3 h-3" /> Email</label>
                                        <p className="text-slate-900 dark:text-white font-bold break-all">{patient.email || '—'}</p>
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5"><MapPin className="w-3 h-3" /> Dirección</label>
                                        <p className="text-slate-900 dark:text-white font-bold">{patient.direccion || '—'}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-indigo-50/50 dark:bg-indigo-900/10 rounded-2xl border border-indigo-100 dark:border-indigo-800 overflow-hidden">
                                <div className="px-4 md:px-5 py-3 border-b border-indigo-100 dark:border-indigo-800 flex items-center gap-2">
                                    <Activity className="w-4 h-4 text-indigo-600" />
                                    <h4 className="font-bold text-indigo-900 dark:text-indigo-300 text-sm">Anamnesis Inicial</h4>
                                </div>
                                <div className="p-4 md:p-5 space-y-4">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                                        {[
                                            { label: '¿Tiene alergias?', value: patient.tieneAlergias },
                                            { label: '¿Tiene problemas cardíacos?', value: patient.tieneProbCardiacos },
                                            { label: '¿Sufre de hipertensión?', value: patient.tieneHipertension },
                                            { label: '¿Tiene diabetes?', value: patient.tieneDiabetes },
                                            { label: '¿Toma alguna medicación?', value: patient.tomaMedicacion },
                                            { label: '¿Está embarazada?', value: patient.estaEmbarazada },
                                            { label: '¿Otros antecedentes?', value: patient.otrosAntecedentes },
                                        ].map((item) => (
                                            <div key={item.label} className="flex items-center justify-between gap-3 bg-white dark:bg-slate-900 rounded-xl px-4 py-2.5 border border-slate-100 dark:border-slate-800">
                                                <span className="text-slate-700 dark:text-slate-300 text-sm font-medium">{item.label}</span>
                                                {item.value ? (
                                                    <span className="shrink-0 text-[11px] font-black uppercase tracking-wider bg-rose-100 dark:bg-rose-900/40 text-rose-600 dark:text-rose-400 px-2.5 py-1 rounded-full">Sí</span>
                                                ) : (
                                                    <span className="shrink-0 text-[11px] font-black uppercase tracking-wider bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 px-2.5 py-1 rounded-full">No</span>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                    <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800">
                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Observaciones / Antecedentes</label>
                                        <p className="text-slate-700 dark:text-slate-200 text-sm italic">
                                            {patient.observacionesAnamnesis || patient.antecedentes || 'Sin registros médicos previos.'}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* FIRMA DIGITAL DEL PACIENTE */}
                            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                                <div className="px-4 md:px-5 py-3 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between gap-2">
                                    <div className="flex items-center gap-2">
                                        <PenLine className="w-4 h-4 text-indigo-600" />
                                        <h4 className="font-bold text-slate-900 dark:text-white text-sm">Firma del Paciente</h4>
                                    </div>
                                    {!mostrarFirmaPaciente && (
                                        <button
                                            onClick={() => { setMostrarFirmaPaciente(true); setFirmaPacienteTemp(null); }}
                                            className="text-xs font-bold text-indigo-600 hover:text-indigo-700 transition-colors"
                                        >
                                            {patient.firmaDigital ? 'Actualizar firma' : 'Agregar firma'}
                                        </button>
                                    )}
                                </div>
                                <div className="p-4 md:p-5">
                                    {mostrarFirmaPaciente ? (
                                        <div className="space-y-3">
                                            <SignatureCanvas onChange={(dataUrl) => setFirmaPacienteTemp(dataUrl)} />
                                            <div className="flex gap-3 justify-end">
                                                <button
                                                    onClick={() => { setMostrarFirmaPaciente(false); setFirmaPacienteTemp(null); }}
                                                    className="px-4 py-2 text-slate-500 font-bold text-sm hover:text-slate-700"
                                                >Cancelar</button>
                                                <button
                                                    onClick={handleSaveFirmaPaciente}
                                                    disabled={savingFirma || !firmaPacienteTemp}
                                                    className="bg-indigo-600 text-white px-5 py-2 rounded-xl text-sm font-black hover:bg-indigo-700 disabled:opacity-50 flex items-center gap-2 transition-all"
                                                >
                                                    {savingFirma ? 'Guardando...' : <><Check className="w-4 h-4" /> Guardar firma</>}
                                                </button>
                                            </div>
                                        </div>
                                    ) : patient.firmaDigital ? (
                                        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-3 inline-block">
                                            <img src={patient.firmaDigital} alt="Firma del paciente" className="max-h-28 w-auto" />
                                        </div>
                                    ) : (
                                        <p className="text-xs text-slate-400 italic">Sin firma registrada.</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                        <div className="p-4 md:p-6 border-b border-slate-100 dark:border-slate-800 flex flex-wrap justify-between items-center gap-3 bg-slate-50/50 dark:bg-slate-800/50">
                            <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                <FileText className="w-5 h-5 text-indigo-500" /> Historial de Consultas
                            </h3>
                            <button onClick={handleOpenCreate} className="bg-indigo-600 text-white px-4 md:px-5 py-2.5 rounded-xl text-sm font-black shadow-lg hover:bg-indigo-700 flex items-center gap-2">
                                <Plus className="w-4 h-4" /> Nueva Entrada
                            </button>
                        </div>
                        
                        <div className="divide-y divide-slate-100 dark:divide-slate-800">
                            {consultas.length === 0 ? (
                                <div className="p-20 text-center text-slate-400">No hay consultas registradas aún.</div>
                            ) : consultas.map((c) => (
                                <div key={c.id} className="p-6 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors cursor-pointer group" onClick={() => handleOpenView(c)}>
                                    <div className="flex justify-between items-start">
                                        <div className="flex items-center gap-3 mb-3">
                                            <div className="p-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg text-indigo-600">
                                                <Clock className="w-4 h-4" />
                                            </div>
                                            <span className="font-black text-slate-900 dark:text-white">
                                                {c.fecha ? format(fechaLocal(c.fecha), "dd 'de' MMMM, yyyy", { locale: es }) : 'Fecha no disponible'}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button onClick={(e) => handleDeleteConsulta(c.id, e)} className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/30 rounded-lg transition-all">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                            <div className="text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 text-xs font-bold uppercase tracking-wider">
                                                <Eye className="w-4 h-4" /> Ver detalle
                                            </div>
                                        </div>
                                    </div>
                                    <p className="text-slate-600 dark:text-slate-300 text-sm line-clamp-2 bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-100 dark:border-slate-700">
                                        {c.observaciones || "Sin observaciones."}
                                    </p>
                                </div>
                            ))}
                        </div>

                        {consultas.length > 0 && (
                            <div className="p-4 md:p-6 border-t border-slate-100 dark:border-slate-800 flex justify-center">
                                <button onClick={handleGeneratePdf} className="flex items-center gap-2 bg-slate-800 dark:bg-slate-700 text-white px-5 py-2.5 rounded-xl text-sm font-black shadow-lg hover:bg-slate-900 dark:hover:bg-slate-600 transition-all">
                                    <FileDown className="w-4 h-4" /> Generar PDF con todas las entradas
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 md:p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-slate-50 dark:bg-slate-950 w-full max-w-6xl h-[96dvh] md:h-[95vh] rounded-2xl md:rounded-3xl shadow-2xl overflow-hidden flex flex-col border border-white/10">
                        <div className="p-4 md:p-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center gap-2 bg-white dark:bg-slate-900 flex-shrink-0">
                            <div className="min-w-0">
                                <h2 className="text-lg md:text-xl font-black text-slate-900 dark:text-white truncate">
                                    {modalMode === 'create' ? 'Nueva Entrada' : modalMode === 'edit' ? 'Editando Consulta' : 'Detalle Histórico'}
                                </h2>
                                <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1 truncate">Paciente: {patient.nombre} {patient.apellido || ''}</p>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                                {modalMode === 'view' && (
                                    <button onClick={() => setModalMode('edit')} className="flex items-center gap-2 bg-amber-500 text-white px-3 md:px-4 py-2 rounded-xl text-xs font-bold hover:bg-amber-600 transition-all">
                                        <Edit3 className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Editar este registro</span><span className="sm:hidden">Editar</span>
                                    </button>
                                )}
                                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full">
                                    <X className="w-6 h-6 text-slate-400" />
                                </button>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 md:space-y-8 custom-scrollbar min-h-0">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="flex flex-col gap-2">
                                    <label className="text-xs font-black text-slate-400 uppercase tracking-tighter">Fecha</label>
                                    <input type="date" disabled={modalMode === 'view'} value={currentEntry.fecha} onChange={(e) => setCurrentEntry({...currentEntry, fecha: e.target.value})} className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-70 dark:text-white font-bold" />
                                </div>

                                <div className="flex flex-col gap-2">
                                    <label className="text-xs font-black text-slate-400 uppercase tracking-tighter">Profesional a cargo</label>
                                    <select 
                                        disabled={modalMode === 'view'}
                                        value={currentEntry.profesionalId}
                                        onChange={(e) => setCurrentEntry({...currentEntry, profesionalId: e.target.value})}
                                        className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-70 dark:text-white font-bold"
                                    >
                                        <option value="">Seleccionar...</option>
                                        {profesionales.map(p => (
                                            <option key={p.id} value={p.id}>{p.nombre} {p.apellido}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="md:col-span-3 flex flex-col gap-2">
                                    <label className="text-xs font-black text-slate-400 uppercase tracking-tighter">Observaciones del Tratamiento</label>
                                    <textarea rows="3" disabled={modalMode === 'view'} placeholder="Describe el tratamiento realizado..." value={currentEntry.observaciones} onChange={(e) => setCurrentEntry({...currentEntry, observaciones: e.target.value})} className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-70 dark:text-white resize-none" />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <label className="text-xs font-black text-slate-400 uppercase tracking-tighter">Estado Odontograma</label>
                                <div className={`bg-white dark:bg-slate-900 p-2 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-x-auto ${modalMode === 'view' ? 'pointer-events-none grayscale-[0.3]' : ''}`}>
                                    <Odontograma data={currentEntry.odontograma} onChange={(nuevaData) => { if (modalMode !== 'view') setCurrentEntry({...currentEntry, odontograma: nuevaData}) }} />
                                </div>
                            </div>

                            {/* SECCIÓN IMÁGENES */}
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <label className="text-xs font-black text-slate-400 uppercase tracking-tighter">Imágenes adjuntas</label>
                                    {modalMode !== 'view' && (
                                        <button
                                            type="button"
                                            onClick={() => fileInputRef.current?.click()}
                                            className="flex items-center gap-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 px-4 py-2 rounded-xl text-xs font-bold hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-all border border-indigo-200 dark:border-indigo-800"
                                        >
                                            <ImagePlus className="w-4 h-4" />
                                            Cargar imagen
                                        </button>
                                    )}
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        className="hidden"
                                        onChange={handleImagenesChange}
                                    />
                                </div>

                                {/* Previews de las imágenes a subir */}
                                {imagenesPreview.length > 0 && (
                                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                                        {imagenesPreview.map((img, i) => (
                                            <div key={i} className="relative group rounded-xl overflow-hidden border-2 border-indigo-300 dark:border-indigo-700 aspect-square">
                                                <img src={img.previewUrl} alt="preview" className="w-full h-full object-cover" />
                                                {/* En táctil el botón de quitar queda siempre visible */}
                                                <button onClick={() => handleRemovePreview(i)} className="absolute -top-0 -right-0 m-1 p-1.5 bg-rose-500 rounded-full text-white shadow-lg lg:opacity-0 lg:group-hover:opacity-100 transition-opacity z-10">
                                                    <X className="w-3.5 h-3.5" />
                                                </button>
                                                <div className="absolute bottom-1 left-1 bg-indigo-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">NUEVA</div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Imágenes ya guardadas en la consulta */}
                                {currentEntry.imagenesUrls?.length > 0 && (
                                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                                        {currentEntry.imagenesUrls.map((url, i) => (
                                            <div key={i} className="relative group aspect-square">
                                                <button
                                                    type="button"
                                                    onClick={() => setLightboxUrl(url)}
                                                    className="w-full h-full rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 hover:border-indigo-400 transition-all"
                                                >
                                                    <img src={url} alt={`imagen-${i}`} className="w-full h-full object-cover" />
                                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                        <ZoomIn className="w-5 h-5 text-white" />
                                                    </div>
                                                </button>
                                                {modalMode !== 'view' && (
                                                    <button 
                                                        onClick={(e) => handleDeleteImagen(url, e)}
                                                        className="absolute -top-2 -right-2 p-1.5 bg-rose-500 text-white rounded-full shadow-lg z-10 hover:bg-rose-600 transition-colors"
                                                    >
                                                        <X className="w-3 h-3" />
                                                    </button>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {imagenesPreview.length === 0 && (!currentEntry.imagenesUrls || currentEntry.imagenesUrls.length === 0) && (
                                    <p className="text-xs text-slate-400 italic">No hay imágenes adjuntas.</p>
                                )}
                            </div>

                            {/* FIRMA DIGITAL */}
                            <div className="space-y-3 pt-2">
                                {modalMode === 'view' ? (
                                    currentEntry.firmaDigital && (
                                        <div className="space-y-2">
                                            <label className="text-xs font-black text-slate-400 uppercase tracking-tighter flex items-center gap-2">
                                                <PenLine className="w-3.5 h-3.5" /> Firma Digital
                                            </label>
                                            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-3 inline-block">
                                                <img src={currentEntry.firmaDigital} alt="Firma digital" className="max-h-28 w-auto" />
                                            </div>
                                        </div>
                                    )
                                ) : (
                                    <>
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
                                    </>
                                )}
                            </div>
                        </div>

                        <div className="p-4 md:p-6 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex justify-end gap-3 md:gap-4 flex-shrink-0">
                            <button onClick={() => setIsModalOpen(false)} className="px-4 md:px-6 py-3 text-slate-500 font-bold hover:text-slate-700">Cerrar</button>
                            {(modalMode === 'create' || modalMode === 'edit') && (
                                <button onClick={handleSave} disabled={saving} className="bg-indigo-600 text-white px-6 md:px-10 py-3 rounded-2xl font-black shadow-xl hover:bg-indigo-700 disabled:opacity-50 flex items-center justify-center gap-2 transition-all active:scale-95">
                                    {saving ? "Guardando..." : <><Check className="w-5 h-5" /> {modalMode === 'create' ? 'Guardar Consulta' : 'Guardar Cambios'}</>}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </MainLayout>

        {/* LIGHTBOX */}
        {lightboxUrl && (
            <div
                className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 backdrop-blur-md p-4"
                onClick={() => setLightboxUrl(null)}
            >
                <button className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-all" onClick={() => setLightboxUrl(null)}>
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

export default PatientHistoryPage;
