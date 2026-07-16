import { useCallback, useEffect, useRef, useState } from "react";

type Props = {
  before: string;
  after: string;
  label?: string;
  initial?: number;
};

export function BeforeAfterSlider({ before, after, label, initial = 50 }: Props) {
  const [pos, setPos] = useState(initial);
  const [dragging, setDragging] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  const updateFromClientX = useCallback((clientX: number) => {
    const el = wrapRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const p = ((clientX - rect.left) / rect.width) * 100;
    setPos(Math.max(0, Math.min(100, p)));
  }, []);

  useEffect(() => {
    if (!dragging) return;
    const onMove = (e: PointerEvent) => updateFromClientX(e.clientX);
    const onUp = () => setDragging(false);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
    };
  }, [dragging, updateFromClientX]);

  const onPointerDown = (e: React.PointerEvent) => {
    setDragging(true);
    updateFromClientX(e.clientX);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") setPos((p) => Math.max(0, p - 4));
    if (e.key === "ArrowRight") setPos((p) => Math.min(100, p + 4));
  };

  return (
    <div
      ref={wrapRef}
      className="ba hover-lift"
      onPointerDown={onPointerDown}
      style={{ cursor: dragging ? "grabbing" : "grab", userSelect: "none", touchAction: "none" }}
    >
      <img src={before} alt={label ? `Antes — ${label}` : "Antes"} loading="lazy" draggable={false} />
      <img
        src={after}
        alt={label ? `Depois — ${label}` : "Depois"}
        loading="lazy"
        draggable={false}
        style={{ clipPath: `inset(0 0 0 ${pos}%)`, position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
      />
      <span className="tag tl">ANTES</span>
      <span className="tag tr">DEPOIS</span>
      {label && <span className="label">{label}</span>}

      <div
        role="slider"
        aria-label={`Comparar antes e depois${label ? ` — ${label}` : ""}`}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(pos)}
        tabIndex={0}
        onKeyDown={onKeyDown}
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          left: `${pos}%`,
          width: 2,
          background: "#fff",
          boxShadow: "0 0 12px rgba(0,0,0,.5)",
          transform: "translateX(-1px)",
          outline: "none",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 44,
            height: 44,
            borderRadius: "999px",
            background: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 8px 24px rgba(0,0,0,.35)",
            color: "#0F172A",
            fontWeight: 800,
            fontSize: 14,
            letterSpacing: "-.02em",
          }}
        >
          ⇆
        </div>
      </div>
    </div>
  );
}
