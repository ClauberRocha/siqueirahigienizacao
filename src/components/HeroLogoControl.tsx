import { useEffect, useState, useCallback } from "react";

export type LogoCorner = "top-left" | "top-right" | "bottom-left" | "bottom-right";
export type LogoBreakpointConfig = { corner: LogoCorner; offsetX: number; offsetY: number };
export type LogoConfig = { mobile: LogoBreakpointConfig; desktop: LogoBreakpointConfig };

const STORAGE_KEY = "hero-logo-position-v1";
const DEFAULTS: LogoConfig = {
  mobile: { corner: "top-right", offsetX: 12, offsetY: 12 },
  desktop: { corner: "top-right", offsetX: 16, offsetY: 16 },
};

export function loadLogoConfig(): LogoConfig {
  if (typeof window === "undefined") return DEFAULTS;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULTS;
    const parsed = JSON.parse(raw) as Partial<LogoConfig>;
    return {
      mobile: { ...DEFAULTS.mobile, ...(parsed.mobile ?? {}) },
      desktop: { ...DEFAULTS.desktop, ...(parsed.desktop ?? {}) },
    };
  } catch {
    return DEFAULTS;
  }
}

export function saveLogoConfig(cfg: LogoConfig) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cfg));
    window.dispatchEvent(new CustomEvent("hero-logo-config-changed", { detail: cfg }));
  } catch {}
}

export function useLogoConfig(): [LogoConfig, (c: LogoConfig) => void] {
  const [cfg, setCfg] = useState<LogoConfig>(DEFAULTS);
  useEffect(() => {
    setCfg(loadLogoConfig());
    const onChange = (e: Event) => {
      const d = (e as CustomEvent<LogoConfig>).detail;
      if (d) setCfg(d);
    };
    window.addEventListener("hero-logo-config-changed", onChange);
    return () => window.removeEventListener("hero-logo-config-changed", onChange);
  }, []);
  const update = useCallback((c: LogoConfig) => {
    setCfg(c);
    saveLogoConfig(c);
  }, []);
  return [cfg, update];
}

export function cornerStyle(bp: LogoBreakpointConfig): React.CSSProperties {
  const s: React.CSSProperties = {};
  if (bp.corner.startsWith("top")) s.top = bp.offsetY;
  else s.bottom = bp.offsetY;
  if (bp.corner.endsWith("left")) s.left = bp.offsetX;
  else s.right = bp.offsetX;
  return s;
}

/* ------- Inspector panel ------- */
export function HeroLogoInspector() {
  const [cfg, setCfg] = useLogoConfig();
  const [open, setOpen] = useState(false);
  const [collide, setCollide] = useState(false);
  const [isColliding, setIsColliding] = useState(false);

  useEffect(() => {
    if (!collide) {
      setIsColliding(false);
      document.querySelectorAll<HTMLElement>("[data-hero-logo],[data-google-card]").forEach(
        (el) => (el.style.outline = "")
      );
      return;
    }
    const check = () => {
      const logo = document.querySelector<HTMLElement>("[data-hero-logo]");
      const card = document.querySelector<HTMLElement>("[data-google-card]");
      if (!logo || !card) return setIsColliding(false);
      const a = logo.getBoundingClientRect();
      const b = card.getBoundingClientRect();
      const hit = !(a.right < b.left || a.left > b.right || a.bottom < b.top || a.top > b.bottom);
      setIsColliding(hit);
      logo.style.outline = hit ? "3px solid #ef4444" : "2px dashed #22c55e";
      card.style.outline = hit ? "3px solid #ef4444" : "2px dashed #22c55e";
    };
    check();
    const id = window.setInterval(check, 250);
    window.addEventListener("resize", check);
    window.addEventListener("scroll", check, true);
    return () => {
      window.clearInterval(id);
      window.removeEventListener("resize", check);
      window.removeEventListener("scroll", check, true);
    };
  }, [collide, cfg]);

  const setBp = (which: "mobile" | "desktop", patch: Partial<LogoBreakpointConfig>) =>
    setCfg({ ...cfg, [which]: { ...cfg[which], ...patch } });

  const corners: LogoCorner[] = ["top-left", "top-right", "bottom-left", "bottom-right"];

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-4 right-4 z-[9999] rounded-full bg-slate-900 text-white text-xs px-3 py-2 shadow-lg opacity-70 hover:opacity-100"
        aria-label="Inspecionar logo do hero"
      >
        🎯 Logo
      </button>
      {open && (
        <div className="fixed bottom-16 right-4 z-[9999] w-[300px] rounded-xl bg-white shadow-2xl ring-1 ring-slate-200 p-4 text-xs text-slate-700 space-y-3">
          <div className="flex items-center justify-between">
            <strong className="text-sm text-slate-900">Logo do carrossel</strong>
            <button onClick={() => setOpen(false)} className="text-slate-400 hover:text-slate-700">✕</button>
          </div>

          {(["desktop", "mobile"] as const).map((bp) => (
            <div key={bp} className="border-t pt-3 first:border-t-0 first:pt-0">
              <div className="font-semibold capitalize mb-2">{bp}</div>
              <div className="grid grid-cols-2 gap-1 mb-2">
                {corners.map((c) => (
                  <button
                    key={c}
                    onClick={() => setBp(bp, { corner: c })}
                    className={`px-2 py-1 rounded border text-[11px] ${
                      cfg[bp].corner === c
                        ? "bg-slate-900 text-white border-slate-900"
                        : "bg-white border-slate-200 hover:border-slate-400"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
              <label className="block mb-1">
                X: {cfg[bp].offsetX}px
                <input
                  type="range" min={0} max={80} value={cfg[bp].offsetX}
                  onChange={(e) => setBp(bp, { offsetX: Number(e.target.value) })}
                  className="w-full"
                />
              </label>
              <label className="block">
                Y: {cfg[bp].offsetY}px
                <input
                  type="range" min={0} max={80} value={cfg[bp].offsetY}
                  onChange={(e) => setBp(bp, { offsetY: Number(e.target.value) })}
                  className="w-full"
                />
              </label>
            </div>
          ))}

          <div className="border-t pt-3 space-y-2">
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={collide} onChange={(e) => setCollide(e.target.checked)} />
              Detectar colisão com Avaliação Google
            </label>
            {collide && (
              <div className={`rounded px-2 py-1 text-[11px] font-semibold ${
                isColliding ? "bg-red-100 text-red-700" : "bg-emerald-100 text-emerald-700"
              }`}>
                {isColliding ? "⚠ Sobreposição detectada" : "✓ Sem sobreposição"}
              </div>
            )}
            <button
              onClick={() => setCfg({ ...DEFAULTS })}
              className="w-full text-[11px] px-2 py-1 rounded border border-slate-200 hover:border-slate-400"
            >
              Restaurar padrão
            </button>
          </div>
        </div>
      )}
    </>
  );
}
