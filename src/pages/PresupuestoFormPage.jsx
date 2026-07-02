import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import MainLayout from '../components/MainLayout';
import { Save, Trash2, Plus, Receipt, FileDown } from 'lucide-react';
import jsPDF from 'jspdf';
import { crearHelpersPdf, coloresPdf, MARGIN_X, MARGIN_TOP, MARGIN_BOTTOM } from '../utils/pdfEstilos';

const itemVacio = () => ({ concepto: '', costo: '' });

const formatearMonto = (valor) => `$${new Intl.NumberFormat('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(valor || 0)}`;

const PresupuestoFormPage = () => {
  const { id } = useParams();
  const esEdicion = !!id;
  const navigate = useNavigate();
  const [nombreCliente, setNombreCliente] = useState('');
  const [items, setItems] = useState([itemVacio()]);
  const [loading, setLoading] = useState(esEdicion);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!esEdicion) return;
    const cargar = async () => {
      try {
        const res = await fetch(`/api/presupuestos/${id}`);
        if (res.ok) {
          const data = await res.json();
          setNombreCliente(data.nombreCliente || '');
          setItems(Array.isArray(data.items) && data.items.length > 0 ? data.items : [itemVacio()]);
        }
      } catch (error) {
        console.error('Error cargando presupuesto:', error);
      } finally {
        setLoading(false);
      }
    };
    cargar();
  }, [id, esEdicion]);

  const total = items.reduce((acc, it) => acc + (parseFloat(it.costo) || 0), 0);

  const handleItemChange = (index, campo, valor) => {
    setItems(prev => prev.map((it, i) => i === index ? { ...it, [campo]: valor } : it));
  };

  const handleAddItem = () => setItems(prev => [...prev, itemVacio()]);

  const handleRemoveItem = (index) => {
    setItems(prev => prev.length > 1 ? prev.filter((_, i) => i !== index) : prev);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const itemsValidos = items.filter(it => it.concepto.trim() || parseFloat(it.costo) > 0);
      const url = esEdicion ? `/api/presupuestos/${id}` : '/api/presupuestos';
      const method = esEdicion ? 'PATCH' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombreCliente, items: itemsValidos })
      });
      if (res.ok) {
        navigate('/presupuestos');
      } else {
        alert('Error al guardar el presupuesto.');
      }
    } catch (error) {
      alert('Error de conexión.');
    } finally {
      setSaving(false);
    }
  };

  const handleGeneratePdf = () => {
    const doc = new jsPDF({ unit: 'pt', format: 'a4' });
    const { pageWidth, pageHeight, centrarTexto, lineaPunteada, dibujarEncabezado, dibujarPie } = crearHelpersPdf(doc);
    const maxWidth = pageWidth - MARGIN_X * 2 - 90;

    let y = dibujarEncabezado('Presupuesto');

    centrarTexto(nombreCliente.trim() || 'Cliente sin nombre', y, 12, 'bold');
    y += 16;
    y += 10;
    lineaPunteada(y, coloresPdf.indigo);
    y += 26;

    const asegurarEspacio = (alturaNecesaria) => {
      if (y + alturaNecesaria > pageHeight - MARGIN_BOTTOM) {
        doc.addPage();
        y = MARGIN_TOP;
      }
    };

    const itemsValidos = items.filter(it => it.concepto.trim() || parseFloat(it.costo) > 0);

    if (itemsValidos.length === 0) {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.setTextColor(...coloresPdf.grisTexto);
      doc.text('No hay ítems cargados.', MARGIN_X, y);
    }

    itemsValidos.forEach((it, index) => {
      const lineasConcepto = doc.splitTextToSize(it.concepto || 'Sin descripción', maxWidth);
      const alturaBloque = lineasConcepto.length * 13 + 22;

      asegurarEspacio(alturaBloque);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.setTextColor(...coloresPdf.textoCuerpo);
      doc.text(lineasConcepto, MARGIN_X, y);

      const montoTexto = formatearMonto(parseFloat(it.costo) || 0);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...coloresPdf.indigo);
      const anchoMonto = doc.getTextWidth(montoTexto);
      doc.text(montoTexto, pageWidth - MARGIN_X - anchoMonto, y);

      y += lineasConcepto.length * 13 + 12;

      if (index < itemsValidos.length - 1) {
        lineaPunteada(y);
        y += 18;
      }
    });

    y += 16;
    asegurarEspacio(30);
    doc.setDrawColor(...coloresPdf.indigo);
    doc.setLineWidth(1);
    doc.line(MARGIN_X, y, pageWidth - MARGIN_X, y);
    y += 22;

    const totalTexto = `TOTAL: ${formatearMonto(total)}`;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.setTextColor(...coloresPdf.textoOscuro);
    const anchoTotal = doc.getTextWidth(totalTexto);
    doc.text(totalTexto, pageWidth - MARGIN_X - anchoTotal, y);

    dibujarPie();

    doc.save(`presupuesto-${(nombreCliente || 'cliente').replace(/\s+/g, '_') || 'cliente'}.pdf`);
  };

  if (loading) return <MainLayout title="Cargando..."> <div className="p-10 text-center text-slate-400">Cargando presupuesto...</div> </MainLayout>;

  return (
    <MainLayout title={esEdicion ? 'Editar Presupuesto' : 'Nuevo Presupuesto'} activePage="presupuestos">
      <div className="max-w-3xl mx-auto h-full overflow-y-auto pr-2 custom-scrollbar pb-10">
        <div className="bg-white dark:bg-slate-900 shadow-sm rounded-3xl border border-slate-200 dark:border-slate-800 p-5 md:p-8 space-y-6">
          <h2 className="text-lg font-bold flex items-center gap-2 text-indigo-600"><Receipt className="w-5 h-5" /> Datos del Presupuesto</h2>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Nombre del Cliente</label>
            <input
              value={nombreCliente}
              onChange={(e) => setNombreCliente(e.target.value)}
              placeholder="Nombre y apellido del cliente"
              className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-500 uppercase">Ítems del Presupuesto</label>
              <button type="button" onClick={handleAddItem} className="flex items-center gap-1.5 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-all border border-indigo-200 dark:border-indigo-800">
                <Plus className="w-3.5 h-3.5" /> Agregar ítem
              </button>
            </div>

            <div className="space-y-2">
              {items.map((it, index) => (
                <div key={index} className="flex gap-2 items-start">
                  <input
                    value={it.concepto}
                    onChange={(e) => handleItemChange(index, 'concepto', e.target.value)}
                    placeholder="Descripción del tratamiento..."
                    className="flex-1 p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white text-sm"
                  />
                  <input
                    type="number"
                    step="0.01"
                    value={it.costo}
                    onChange={(e) => handleItemChange(index, 'costo', e.target.value)}
                    placeholder="Costo"
                    className="w-32 p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveItem(index)}
                    disabled={items.length === 1}
                    className="p-3 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/30 rounded-xl disabled:opacity-30 disabled:cursor-not-allowed shrink-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end items-center gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <span className="text-sm font-bold text-slate-500 uppercase tracking-wider">Costo Total</span>
            <span className="text-2xl font-black text-indigo-600 dark:text-indigo-400">{formatearMonto(total)}</span>
          </div>
        </div>

        <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 sm:gap-4 mt-6">
          <button type="button" onClick={() => navigate('/presupuestos')} className="px-6 py-3 font-bold text-slate-500">Cancelar</button>
          <button type="button" onClick={handleGeneratePdf} className="flex items-center justify-center gap-2 px-6 py-3 bg-slate-800 dark:bg-slate-700 text-white rounded-2xl font-black shadow-xl hover:bg-slate-900 dark:hover:bg-slate-600 transition-all">
            <FileDown className="w-5 h-5" /> Generar PDF
          </button>
          <button type="button" onClick={handleSave} disabled={saving} className="px-6 sm:px-10 py-3 bg-indigo-600 text-white rounded-2xl font-black shadow-xl hover:bg-indigo-700 disabled:opacity-50 flex items-center justify-center gap-2">
            {saving ? 'Guardando...' : <><Save className="w-5 h-5" /> Guardar Presupuesto</>}
          </button>
        </div>
      </div>
    </MainLayout>
  );
};

export default PresupuestoFormPage;
