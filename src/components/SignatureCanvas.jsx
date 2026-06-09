import React, { useRef, useEffect, useState } from 'react';
import { Trash2 } from 'lucide-react';

const SignatureCanvas = ({ onChange }) => {
    const canvasRef = useRef(null);
    const isDrawing = useRef(false);
    const lastPos = useRef(null);
    const [isEmpty, setIsEmpty] = useState(true);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }, []);

    const getPos = (e) => {
        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        const source = e.touches ? e.touches[0] : e;
        return {
            x: (source.clientX - rect.left) * scaleX,
            y: (source.clientY - rect.top) * scaleY,
        };
    };

    const startDrawing = (e) => {
        e.preventDefault();
        isDrawing.current = true;
        lastPos.current = getPos(e);
    };

    const draw = (e) => {
        e.preventDefault();
        if (!isDrawing.current) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const pos = getPos(e);

        ctx.beginPath();
        ctx.moveTo(lastPos.current.x, lastPos.current.y);
        ctx.lineTo(pos.x, pos.y);
        ctx.strokeStyle = '#0f172a';
        ctx.lineWidth = 2.5;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.stroke();

        lastPos.current = pos;
    };

    const stopDrawing = () => {
        if (!isDrawing.current) return;
        isDrawing.current = false;
        lastPos.current = null;
        setIsEmpty(false);
        onChange(canvasRef.current.toDataURL('image/png'));
    };

    const clear = () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        setIsEmpty(true);
        onChange(null);
    };

    return (
        <div className="flex flex-col gap-2">
            <canvas
                ref={canvasRef}
                width={900}
                height={180}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
                className="w-full rounded-xl bg-white border-2 border-dashed border-slate-300 dark:border-slate-600 cursor-crosshair"
                style={{ touchAction: 'none' }}
            />
            <div className="flex items-center justify-between">
                <p className="text-xs text-slate-400 italic">
                    {isEmpty
                        ? 'Firme en el recuadro con el mouse o con el dedo'
                        : '✓ Firma registrada — se guardará al guardar la consulta'}
                </p>
                {!isEmpty && (
                    <button
                        type="button"
                        onClick={clear}
                        className="flex items-center gap-1 text-xs text-rose-500 hover:text-rose-600 font-bold transition-colors"
                    >
                        <Trash2 className="w-3 h-3" /> Limpiar
                    </button>
                )}
            </div>
        </div>
    );
};

export default SignatureCanvas;
