import { useEffect, useState } from "react";
import { siteConfig, whatsappLink } from "@/lib/site-config";
import { track } from "@/lib/analytics";

const MESSAGES = [
  "👋 Olá! Quer um orçamento em menos de 2 minutos?",
  "🛋️ Seu sofá pode estar cheio de ácaros. Vamos higienizar?",
  "⚡ Agenda da semana com apenas 3 vagas. Garanta a sua!",
  "✅ Orçamento grátis pelo WhatsApp. Clique aqui.",
  "🚿 Higienização profissional em domicílio. Fale conosco!",
];

export function WhatsAppFloat() {
  const [msgIndex, setMsgIndex] = useState(0);
  const [open, setOpen] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const showTimer = setTimeout(() => setOpen(true), 2500);
    return () => clearTimeout(showTimer);
  }, []);

  useEffect(() => {
    if (dismissed) return;
    const rotate = setInterval(() => {
      setMsgIndex((i) => (i + 1) % MESSAGES.length);
    }, 6000);
    return () => clearInterval(rotate);
  }, [dismissed]);

  return (
    <div className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-[9999] flex flex-col items-end gap-2 pointer-events-none">
      {open && !dismissed && (
        <div
          className="pointer-events-auto relative max-w-[260px] md:max-w-[300px] rounded-2xl bg-white shadow-2xl border border-black/5 p-4 pr-8 animate-in fade-in slide-in-from-bottom-2 duration-300"
          style={{ boxShadow: "0 20px 45px rgba(0,0,0,.18)" }}
        >
          <button
            onClick={() => setDismissed(true)}
            aria-label="Fechar mensagem"
            className="absolute top-1.5 right-2 text-slate-400 hover:text-slate-700 text-lg leading-none"
          >
            ×
          </button>
          <div className="text-xs font-bold text-emerald-700 mb-1">
            {siteConfig.brandName}
          </div>
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => track("whatsapp_click", { location: "float_bubble" })}
            className="block text-sm text-slate-800 leading-snug hover:text-emerald-700 transition"
          >
            {MESSAGES[msgIndex]}
            <div className="mt-2 text-xs font-semibold text-emerald-600">
              Clique aqui →
            </div>
          </a>
          <span
            className="absolute -bottom-1.5 right-6 w-3 h-3 rotate-45 bg-white border-r border-b border-black/5"
            aria-hidden
          />
        </div>
      )}

      <a
        href={whatsappLink}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => track("whatsapp_click", { location: "float_button" })}
        aria-label="Falar no WhatsApp"
        className="pointer-events-auto relative flex items-center justify-center w-14 h-14 md:w-16 md:h-16 rounded-full text-white transition-transform hover:scale-110 active:scale-95"
        style={{
          background: "linear-gradient(135deg,#25D366 0%,#128C7E 100%)",
          boxShadow: "0 10px 30px rgba(37,211,102,.5)",
        }}
      >
        <span
          className="absolute inset-0 rounded-full animate-ping opacity-40"
          style={{ background: "#25D366", animationDuration: "2s" }}
          aria-hidden
        />
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          className="relative w-7 h-7 md:w-8 md:h-8"
          fill="currentColor"
          aria-hidden
        >
          <path d="M20.52 3.48A11.86 11.86 0 0 0 12.05 0C5.5 0 .18 5.32.18 11.86c0 2.09.55 4.13 1.6 5.93L0 24l6.35-1.66a11.85 11.85 0 0 0 5.7 1.45h.01c6.55 0 11.87-5.32 11.87-11.86 0-3.17-1.24-6.15-3.41-8.45zM12.06 21.8h-.01a9.9 9.9 0 0 1-5.04-1.38l-.36-.22-3.77.99 1-3.67-.23-.38a9.86 9.86 0 0 1-1.52-5.27c0-5.44 4.43-9.86 9.87-9.86 2.64 0 5.12 1.03 6.99 2.9a9.82 9.82 0 0 1 2.89 6.98c0 5.44-4.43 9.87-9.82 9.87zm5.4-7.4c-.3-.15-1.75-.86-2.02-.96-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.65.07-.3-.15-1.25-.46-2.38-1.47-.88-.78-1.47-1.75-1.64-2.05-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.6-.92-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.06 2.87 1.21 3.07c.15.2 2.1 3.2 5.09 4.49.71.31 1.26.49 1.7.63.71.23 1.36.2 1.87.12.57-.08 1.75-.71 2-1.4.25-.7.25-1.28.17-1.4-.07-.13-.27-.2-.57-.35z" />
        </svg>
      </a>
    </div>
  );
}
