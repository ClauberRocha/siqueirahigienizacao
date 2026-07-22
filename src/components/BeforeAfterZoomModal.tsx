import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, ZoomIn, ZoomOut, Grid3x3, RotateCcw } from "lucide-react";
import { BeforeAfterSlider } from "./BeforeAfterSlider";

type Props = {
  open: boolean;
  onClose: () => void;
  before: string;
  after: string;
  label: string;
  objectPosition?: string;
};

export function BeforeAfterZoomModal({ open, onClose, before, after, label, objectPosition }: Props) {
  const [scale, setScale] = useState(1);
  const [tx, setTx] = useState(0);
  const [ty, setTy] = useState(0);
  const [grid, setGrid] = useState(false);
  const dragRef = useRef<{ x: number; y: number; tx: number; ty: number } | null>(null);

  useEffect(() => {
    if (!open) {
      setScale(1);
      setTx(0);
      setTy(0);
      setGrid(false);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "+" || e.key === "=") setScale((s) => Math.min(5, s + 0.25));
      if (e.key === "-") setScale((s) => Math.max(1, s - 0.25));
      if (e.key === "0") { setScale(1); setTx(0); setTy(0); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const onWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = -e.deltaY / 500;
    setScale((s) => Math.max(1, Math.min(5, s + delta)));
  };

  const onPointerDown = (e: React.PointerEvent) => {
    if (scale <= 1) return;
    (e.target as Element).setPointerCapture?.(e.pointerId);
    dragRef.current = { x: e.clientX, y: e.clientY, tx, ty };
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragRef.current) return;
    const d = dragRef.current;
    setTx(d.tx + (e.clientX - d.x));
    setTy(d.ty + (e.clientY - d.y));
  };
  const onPointerUp = () => (dragRef.current = null);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[80] bg-slate-900/90 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="relative bg-white rounded-2xl overflow-hidden w-full max-w-5xl max-h-[92vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-3 py-2 border-b border-slate-200 bg-white/95">
              <div className="text-sm font-semibold text-[#0B2E59] truncate">{label}</div>
              <div className="flex items-center gap-1">
                <button aria-label="Diminuir zoom" onClick={() => setScale((s) => Math.max(1, s - 0.25))} className="w-9 h-9 rounded-lg hover:bg-slate-100 grid place-items-center"><ZoomOut className="w-4 h-4" /></button>
                <span className="text-xs font-mono tabular-nums w-12 text-center text-slate-600">{scale.toFixed(2)}x</span>
                <button aria-label="Aumentar zoom" onClick={() => setScale((s) => Math.min(5, s + 0.25))} className="w-9 h-9 rounded-lg hover:bg-slate-100 grid place-items-center"><ZoomIn className="w-4 h-4" /></button>
                <button aria-label="Resetar" onClick={() => { setScale(1); setTx(0); setTy(0); }} className="w-9 h-9 rounded-lg hover:bg-slate-100 grid place-items-center"><RotateCcw className="w-4 h-4" /></button>
                <button aria-label="Grade" onClick={() => setGrid((g) => !g)} className={`w-9 h-9 rounded-lg grid place-items-center ${grid ? "bg-[#0B2E59] text-white" : "hover:bg-slate-100"}`}><Grid3x3 className="w-4 h-4" /></button>
                <button aria-label="Fechar" onClick={onClose} className="w-9 h-9 rounded-lg hover:bg-slate-100 grid place-items-center"><X className="w-4 h-4" /></button>
              </div>
            </div>
            <div
              className="flex-1 overflow-hidden bg-slate-100"
              onWheel={onWheel}
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              onPointerCancel={onPointerUp}
              style={{ cursor: scale > 1 ? "grab" : "default", touchAction: "none" }}
            >
              <div
                style={{
                  transform: `translate(${tx}px, ${ty}px) scale(${scale})`,
                  transformOrigin: "center center",
                  transition: dragRef.current ? "none" : "transform .15s ease-out",
                  width: "100%",
                  height: "100%",
                }}
              >
                <BeforeAfterSlider
                  before={before}
                  after={after}
                  label={label}
                  objectPosition={objectPosition}
                  showGrid={grid}
                />
              </div>
            </div>
            <div className="px-3 py-2 border-t border-slate-200 text-[11px] text-slate-500 text-center">
              Scroll = zoom · Arraste para deslocar · <kbd>+</kbd>/<kbd>-</kbd> zoom · <kbd>0</kbd> reset · <kbd>Esc</kbd> fechar
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
