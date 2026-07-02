import { format } from 'date-fns';

export const coloresPdf = {
    indigo: [79, 70, 229],
    textoOscuro: [15, 23, 42],
    textoCuerpo: [30, 41, 59],
    grisTexto: [71, 85, 105],
    grisClaro: [203, 213, 225],
};

export const MARGIN_X = 48;
export const MARGIN_TOP = 56;
export const MARGIN_BOTTOM = 56;

// Helpers comunes para que todos los PDFs de la app (historia clínica, presupuestos, etc.)
// compartan el mismo formato: título centrado, líneas punteadas entre bloques y pie de página.
export function crearHelpersPdf(doc) {
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    const centrarTexto = (texto, y, fontSize, style = 'normal', color = coloresPdf.textoOscuro) => {
        doc.setFont('helvetica', style);
        doc.setFontSize(fontSize);
        doc.setTextColor(...color);
        const ancho = doc.getTextWidth(texto);
        doc.text(texto, (pageWidth - ancho) / 2, y);
    };

    const lineaPunteada = (y, color = coloresPdf.grisClaro) => {
        doc.setDrawColor(...color);
        doc.setLineDashPattern([2, 2], 0);
        doc.line(MARGIN_X, y, pageWidth - MARGIN_X, y);
        doc.setLineDashPattern([], 0);
    };

    const dibujarEncabezado = (titulo) => {
        let y = MARGIN_TOP;
        centrarTexto('integra', y, 12, 'bold', coloresPdf.indigo);
        y += 20;
        centrarTexto(titulo, y, 18, 'bold');
        y += 12;
        doc.setDrawColor(...coloresPdf.indigo);
        doc.setLineWidth(1.2);
        doc.line(MARGIN_X, y, pageWidth - MARGIN_X, y);
        y += 24;
        return y;
    };

    const dibujarPie = () => {
        const totalPaginas = doc.internal.getNumberOfPages();
        for (let i = 1; i <= totalPaginas; i++) {
            doc.setPage(i);
            lineaPunteada(pageHeight - 36);
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(8);
            doc.setTextColor(...coloresPdf.grisTexto);
            const textoPie = `Página ${i} de ${totalPaginas}`;
            const anchoPie = doc.getTextWidth(textoPie);
            doc.text(textoPie, (pageWidth - anchoPie) / 2, pageHeight - 22);
            const fechaGeneracion = `Generado el ${format(new Date(), "dd/MM/yyyy HH:mm")}`;
            doc.text(fechaGeneracion, MARGIN_X, pageHeight - 22);
        }
    };

    return { pageWidth, pageHeight, centrarTexto, lineaPunteada, dibujarEncabezado, dibujarPie };
}
