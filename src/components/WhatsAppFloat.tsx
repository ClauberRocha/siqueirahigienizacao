import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X } from "lucide-react";
import { siteConfig, whatsappLink } from "@/lib/site-config";
import { track } from "@/lib/analytics";

const MESSAGES = [
  "👋 Olá! Quer um orçamento em menos de 2 minutos?",
  "🛋️ Seu sofá pode estar cheio de ácaros. Vamos higienizar?",
  "⚡ Agenda da semana com apenas 3 vagas. Garanta a sua!",
  "✅ Orçamento grátis pelo WhatsApp. Clique aqui.",
];

export function WhatsAppFloat() {
  const [msgIndex, setMsgIndex] = useState(0);
  const [open, setOpen] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setOpen(true), 2500);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (dismissed) return;
    const r = setInterval(() => setMsgIndex((i) => (i + 1) % MESSAGES.length), 6000);
    return () => clearInterval(r);
  }, [dismissed]);

  return (
    <div className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-[9999] flex flex-col items-end gap-3 pointer-events-none">
      <AnimatePresence>
        {open && !dismissed && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="pointer-events-auto relative max-w-[280px] rounded-2xl bg-white shadow-2xl border border-slate-200/70 p-4 pr-8"
            style={{ boxShadow: "0 20px 45px rgba(11,46,89,.18)" }}
          >
            <button
              onClick={() => setDismissed(true)}
              aria-label="Fechar mensagem"
              className="absolute top-2 right-2 text-slate-400 hover:text-slate-700"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="text-[11px] font-bold text-emerald-700 mb-1 uppercase tracking-wider">
              {siteConfig.brandName}
            </div>
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => track("whatsapp_click", { location: "float_bubble" })}
              className="block text-sm text-slate-800 leading-snug hover:text-emerald-700 transition"
            >
              <motion.span key={msgIndex} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
                {MESSAGES[msgIndex]}
              </motion.span>
              <div className="mt-2 text-xs font-semibold text-emerald-600">Clique aqui →</div>
            </a>
            <span
              className="absolute -bottom-1.5 right-6 w-3 h-3 rotate-45 bg-white border-r border-b border-slate-200/70"
              aria-hidden
            />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.a
        href={whatsappLink}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => track("whatsapp_click", { location: "float_button" })}
        aria-label="Falar no WhatsApp"
        initial={{ scale: 0, rotate: -60 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 220, damping: 18, delay: 0.4 }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
        className="pointer-events-auto relative flex items-center justify-center w-14 h-14 md:w-16 md:h-16 rounded-full text-white"
        style={{
          background: "linear-gradient(135deg,#25D366 0%,#128C7E 100%)",
          boxShadow: "0 12px 34px rgba(37,211,102,.55)",
        }}
      >
        <span
          className="absolute inset-0 rounded-full animate-ping opacity-40"
          style={{ background: "#25D366", animationDuration: "2s" }}
          aria-hidden
        />
        <MessageCircle className="relative w-7 h-7 md:w-8 md:h-8" strokeWidth={2.2} />
      </motion.a>
    </div>
  );
}
