import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useInView,
  useMotionValue,
  animate as motionAnimate,
  useReducedMotion,
} from "framer-motion";
import {
  Sparkles,
  ShieldCheck,
  Droplets,
  Wind,
  Leaf,
  Award,
  Star,
  Check,
  ArrowRight,
  Phone,
  MapPin,
  Clock,
  Instagram,
  Menu,
  X,
  Calculator,
  Sofa,
  Bed,
  Car,
  Armchair,
  Layers,
  Users,
  Timer,
  Sprout,
  Plus,
  Minus,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import heroImage from "@/assets/hero-tecnico-premium.jpg";
import logoAsset from "@/assets/logo-siqueira.png";
import { siteConfig, whatsappLink } from "@/lib/site-config";
import { track } from "@/lib/analytics";
import { BeforeAfterSlider } from "@/components/BeforeAfterSlider";
import { blogPosts } from "@/lib/blog-data";

const SITE_URL = "https://siqueirahigienizacao.lovable.app";

/* --------------------------------- HEAD --------------------------------- */
export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: siteConfig.title },
      { name: "description", content: siteConfig.description },
      { property: "og:title", content: siteConfig.title },
      { property: "og:description", content: siteConfig.description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: `${SITE_URL}/` },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "theme-color", content: "#0B2E59" },
    ],
    links: [
      { rel: "canonical", href: `${SITE_URL}/` },
      { rel: "preload", as: "image", href: heroImage, fetchpriority: "high" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "LocalBusiness",
              "@id": `${SITE_URL}/#business`,
              name: siteConfig.brandName,
              url: SITE_URL,
              telephone: `+${siteConfig.whatsappNumber}`,
              email: siteConfig.email,
              address: {
                "@type": "PostalAddress",
                addressLocality: siteConfig.city,
                addressRegion: siteConfig.state,
                addressCountry: "BR",
              },
              areaServed: siteConfig.region,
              openingHours: "Mo-Sa 08:00-18:00",
              sameAs: [siteConfig.instagramUrl].filter(Boolean),
              aggregateRating: { "@type": "AggregateRating", ratingValue: "4.9", reviewCount: "200" },
            },
            {
              "@type": "FAQPage",
              mainEntity: siteConfig.faq.map((f) => ({
                "@type": "Question",
                name: f.question,
                acceptedAnswer: { "@type": "Answer", text: f.answer },
              })),
            },
          ],
        }),
      },
    ],
  }),
  component: LandingPage,
});

/* ------------------------------- HELPERS ------------------------------- */
const easeSmooth = [0.16, 1, 0.3, 1] as const;

function useAnim() {
  const reduce = useReducedMotion();
  return {
    fadeUp: {
      initial: { opacity: 0, y: reduce ? 0 : 32 },
      whileInView: { opacity: 1, y: 0 },
      viewport: { once: true, margin: "-80px" },
      transition: { duration: 0.7, ease: easeSmooth },
    },
    stagger: (i: number) => ({
      initial: { opacity: 0, y: reduce ? 0 : 24 },
      whileInView: { opacity: 1, y: 0 },
      viewport: { once: true, margin: "-60px" },
      transition: { duration: 0.55, delay: reduce ? 0 : i * 0.08, ease: easeSmooth },
    }),
    reduce,
  };
}

/* --------------------------------- NAV --------------------------------- */
function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 24);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  const items = [
    { href: "#inicio", label: "Início" },
    { href: "#servicos", label: "Serviços" },
    { href: "#antes-depois", label: "Antes e Depois" },
    { href: "#depoimentos", label: "Depoimentos" },
    { href: "#faq", label: "FAQ" },
    { href: "#contato", label: "Contato" },
  ];

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: easeSmooth }}
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/85 backdrop-blur-xl border-b border-slate-200/70 shadow-[0_8px_28px_rgba(11,46,89,.08)]"
            : "bg-transparent"
        }`}
      >
        <div className="container-page flex items-center justify-between h-16 md:h-20">
          <a href="#inicio" className="flex items-center gap-3 min-w-0">
            <img src={logoAsset} alt={siteConfig.brandName} className="w-10 h-10 md:w-11 md:h-11 object-contain" />
            <div className="flex flex-col leading-none min-w-0">
              <span
                className={`font-display font-extrabold text-[15px] md:text-[17px] truncate transition-colors ${
                  scrolled ? "text-[#0B2E59]" : "text-[#0B2E59]"
                }`}
              >
                {siteConfig.brandName}
              </span>
              <span className="text-[10px] tracking-[0.15em] text-[#1D74D6] font-semibold uppercase truncate">
                Premium Cleaning
              </span>
            </div>
          </a>

          <nav className="hidden lg:flex items-center gap-8 text-sm font-medium text-slate-700">
            {items.map((i) => (
              <a key={i.href} href={i.href} className="hover:text-[#1D74D6] transition-colors relative group">
                {i.label}
                <span className="absolute left-0 -bottom-1 h-[2px] w-0 bg-[#35A8FF] transition-all group-hover:w-full" />
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Link
              to="/agendar"
              onClick={() => track("agendar_click", { location: "nav" })}
              className="hidden md:inline-flex items-center gap-2 px-5 h-11 rounded-xl font-semibold text-sm text-white transition-all shadow-lg shadow-[#0B2E59]/25 hover:shadow-xl hover:-translate-y-0.5"
              style={{ background: "linear-gradient(135deg,#0B2E59,#1D74D6)" }}
            >
              Agendar Higienização <ArrowRight className="w-4 h-4" />
            </Link>
            <button
              onClick={() => setOpenMenu(true)}
              className="lg:hidden w-11 h-11 rounded-xl border border-slate-200 bg-white/80 backdrop-blur flex items-center justify-center text-slate-700"
              aria-label="Abrir menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile menu */}
      <AnimatePresence>
        {openMenu && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] lg:hidden"
          >
            <div className="absolute inset-0 bg-slate-900/60" onClick={() => setOpenMenu(false)} />
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.35, ease: easeSmooth }}
              className="absolute right-0 top-0 bottom-0 w-[85%] max-w-sm bg-white p-6 flex flex-col"
            >
              <div className="flex items-center justify-between mb-8">
                <img src={logoAsset} alt="" className="w-10 h-10" />
                <button
                  onClick={() => setOpenMenu(false)}
                  className="w-10 h-10 rounded-xl border border-slate-200 flex items-center justify-center"
                  aria-label="Fechar"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <nav className="flex flex-col gap-1">
                {items.map((i) => (
                  <a
                    key={i.href}
                    href={i.href}
                    onClick={() => setOpenMenu(false)}
                    className="py-3 text-lg font-medium text-slate-800 border-b border-slate-100 hover:text-[#1D74D6]"
                  >
                    {i.label}
                  </a>
                ))}
              </nav>
              <Link
                to="/agendar"
                onClick={() => setOpenMenu(false)}
                className="mt-6 inline-flex items-center justify-center gap-2 h-12 rounded-xl font-semibold text-white shadow-lg"
                style={{ background: "linear-gradient(135deg,#0B2E59,#1D74D6)" }}
              >
                Agendar Higienização <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/* --------------------------------- HERO --------------------------------- */
function Hero() {
  const reduce = useReducedMotion();

  return (
    <section
      id="inicio"
      className="relative min-h-[100vh] flex items-center overflow-hidden pt-24 md:pt-28 pb-16"
    >
      {/* Background gradient + blobs */}
      <div className="absolute inset-0 -z-10">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(1200px 600px at 85% -10%, rgba(53,168,255,.22), transparent 60%), radial-gradient(900px 500px at -10% 110%, rgba(29,116,214,.18), transparent 60%), linear-gradient(180deg,#F8FAFC 0%,#EEF4FB 100%)",
          }}
        />
        {!reduce && (
          <>
            <motion.div
              animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
              transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-20 -left-24 w-[420px] h-[420px] rounded-full blur-3xl opacity-30"
              style={{ background: "radial-gradient(circle,#35A8FF 0%,transparent 70%)" }}
            />
            <motion.div
              animate={{ x: [0, -25, 0], y: [0, 30, 0] }}
              transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
              className="absolute bottom-10 right-0 w-[520px] h-[520px] rounded-full blur-3xl opacity-25"
              style={{ background: "radial-gradient(circle,#0B2E59 0%,transparent 70%)" }}
            />
          </>
        )}
      </div>

      <div className="container-page grid lg:grid-cols-[1.05fr_.95fr] gap-12 lg:gap-16 items-center relative">
        {/* Left column */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: easeSmooth }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/70 backdrop-blur border border-[#35A8FF]/25 text-[12px] font-semibold tracking-wider uppercase text-[#0B2E59]"
          >
            <Sparkles className="w-4 h-4 text-[#1D74D6]" /> Higienização premium em São Luís
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.1, ease: easeSmooth }}
            className="font-display font-extrabold text-[2.7rem] leading-[1.05] sm:text-6xl lg:text-[4.25rem] mt-6 text-[#0B2E59]"
          >
            Higienização profissional que{" "}
            <span className="text-gradient-brand">devolve vida</span> ao seu sofá.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: easeSmooth }}
            className="mt-6 text-lg lg:text-xl text-slate-600 max-w-xl leading-relaxed"
          >
            Atendimento em domicílio em <strong className="text-[#0B2E59]">São Luís e região</strong>, com
            equipamentos profissionais, produtos certificados e secagem rápida em poucas horas.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3, ease: easeSmooth }}
            className="mt-8 flex flex-col sm:flex-row gap-3"
          >
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => track("whatsapp_click", { location: "hero_orcamento" })}
              className="group inline-flex items-center justify-center gap-2 h-14 px-7 rounded-2xl font-bold text-white shadow-xl shadow-[#0B2E59]/25 hover:shadow-2xl hover:-translate-y-0.5 transition-all"
              style={{ background: "linear-gradient(135deg,#0B2E59 0%,#1D74D6 100%)" }}
            >
              Solicitar Orçamento
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition" />
            </a>
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => track("whatsapp_click", { location: "hero" })}
              className="inline-flex items-center justify-center gap-2 h-14 px-7 rounded-2xl font-bold text-white shadow-xl shadow-emerald-500/30 hover:shadow-2xl hover:-translate-y-0.5 transition-all"
              style={{ background: "linear-gradient(135deg,#25D366,#128C7E)" }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d="M20.52 3.48A11.86 11.86 0 0 0 12.05 0C5.5 0 .18 5.32.18 11.86c0 2.09.55 4.13 1.6 5.93L0 24l6.35-1.66a11.85 11.85 0 0 0 5.7 1.45h.01c6.55 0 11.87-5.32 11.87-11.86 0-3.17-1.24-6.15-3.41-8.45zM12.06 21.8h-.01a9.9 9.9 0 0 1-5.04-1.38l-.36-.22-3.77.99 1-3.67-.23-.38a9.86 9.86 0 0 1-1.52-5.27c0-5.44 4.43-9.86 9.87-9.86 2.64 0 5.12 1.03 6.99 2.9a9.82 9.82 0 0 1 2.89 6.98c0 5.44-4.43 9.87-9.82 9.87z" />
              </svg>
              Falar no WhatsApp
            </a>
          </motion.div>

          {/* Social proof */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3"
          >
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2">
                {[12, 33, 8, 49].map((n) => (
                  <img
                    key={n}
                    src={`https://i.pravatar.cc/60?img=${n}`}
                    className="w-9 h-9 rounded-full border-2 border-white object-cover"
                    alt=""
                  />
                ))}
              </div>
              <div>
                <div className="flex items-center gap-1 text-amber-500">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <div className="text-xs text-slate-600 font-medium">
                  <strong className="text-[#0B2E59]">500+</strong> clientes atendidos
                </div>
              </div>
            </div>
          </motion.div>

          {/* Selos */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.6 }}
            className="mt-7 grid grid-cols-2 sm:grid-cols-4 gap-2 max-w-xl"
          >
            {[
              { icon: MapPin, label: "Em domicílio" },
              { icon: Leaf, label: "Biodegradável" },
              { icon: ShieldCheck, label: "Garantia" },
              { icon: Timer, label: "Secagem rápida" },
            ].map((s, i) => (
              <div
                key={i}
                className="flex items-center gap-2 text-[13px] font-semibold text-[#0B2E59] bg-white/70 backdrop-blur border border-slate-200/70 rounded-xl px-3 py-2"
              >
                <s.icon className="w-4 h-4 text-[#1D74D6] shrink-0" />
                <span className="leading-tight">{s.label}</span>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Right column — image + floating cards */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, ease: easeSmooth }}
          className="relative"
        >
          <div
            className="relative rounded-[28px] overflow-hidden shadow-2xl"
            style={{ boxShadow: "0 40px 90px -20px rgba(11,46,89,.35)" }}
          >
            <img
              src={heroImage}
              alt="Técnico Siqueira Higienização higienizando sofá com equipamento profissional"
              className="w-full h-[520px] lg:h-[620px] object-cover"
              fetchPriority="high"
              decoding="async"
            />
            <div
              className="absolute inset-0 pointer-events-none"
              style={{ background: "linear-gradient(180deg,transparent 55%,rgba(11,46,89,.35))" }}
            />
          </div>

          {/* Floating cards */}
          <motion.div
            initial={{ opacity: 0, x: -20, y: 10 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ duration: 0.7, delay: 0.7, ease: easeSmooth }}
            className="hidden sm:flex absolute -left-4 top-8 items-center gap-3 bg-white rounded-2xl p-4 shadow-xl border border-slate-100"
          >
            <div className="w-11 h-11 rounded-xl bg-amber-100 grid place-items-center">
              <Star className="w-6 h-6 text-amber-500 fill-current" />
            </div>
            <div>
              <div className="font-display font-bold text-[#0B2E59] leading-none">5.0</div>
              <div className="text-[11px] text-slate-500 mt-1">Avaliação Google</div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20, y: -10 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ duration: 0.7, delay: 0.85, ease: easeSmooth }}
            className="absolute right-2 sm:-right-4 bottom-20 flex items-center gap-3 bg-white rounded-2xl p-4 shadow-xl border border-slate-100"
          >
            <div className="w-11 h-11 rounded-xl bg-emerald-100 grid place-items-center">
              <ShieldCheck className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <div className="font-display font-bold text-[#0B2E59] leading-none">99%</div>
              <div className="text-[11px] text-slate-500 mt-1">Remoção de ácaros</div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 1, ease: easeSmooth }}
            className="hidden md:flex absolute left-6 -bottom-6 items-center gap-3 bg-white rounded-2xl p-4 shadow-xl border border-slate-100"
          >
            <div className="w-11 h-11 rounded-xl bg-sky-100 grid place-items-center">
              <MapPin className="w-6 h-6 text-[#1D74D6]" />
            </div>
            <div>
              <div className="font-display font-bold text-[#0B2E59] leading-none text-sm">Em domicílio</div>
              <div className="text-[11px] text-slate-500 mt-1">São Luís e região</div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

/* -------------------------------- SERVICES -------------------------------- */
function serviceIconFor(title: string) {
  const t = title.toLowerCase();
  if (t.includes("sof")) return Sofa;
  if (t.includes("colc")) return Bed;
  if (t.includes("tape")) return Layers;
  if (t.includes("banco") || t.includes("carro") || t.includes("ve")) return Car;
  if (t.includes("cadeir") || t.includes("poltrona")) return Armchair;
  return Droplets;
}

function Services() {
  const anim = useAnim();
  return (
    <section id="servicos" className="py-24 md:py-32 relative">
      <div className="container-page">
        <motion.div {...anim.fadeUp} className="max-w-2xl">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0B2E59]/5 border border-[#0B2E59]/10 text-[12px] font-semibold tracking-wider uppercase text-[#0B2E59]">
            Nossos Serviços
          </span>
          <h2 className="font-display font-extrabold text-4xl md:text-5xl lg:text-6xl mt-5 text-[#0B2E59] leading-tight">
            Higienização premium para cada peça da sua casa.
          </h2>
          <p className="mt-5 text-lg text-slate-600 leading-relaxed">
            Do sofá da sala aos bancos automotivos — cada serviço é feito com o equipamento certo e produtos
            biodegradáveis, seguros para crianças e pets.
          </p>
        </motion.div>

        <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {siteConfig.services.slice(0, 6).map((s, i) => {
            const Icon = serviceIconFor(s.title);
            return (
              <motion.article
                key={s.title}
                {...anim.stagger(i)}
                whileHover={{ y: -6 }}
                transition={{ ...anim.stagger(i).transition, y: { duration: 0.3 } }}
                className="group relative bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-[0_10px_40px_rgba(11,46,89,.06)] hover:shadow-[0_28px_60px_rgba(11,46,89,.14)] transition-shadow"
              >
                <div className="relative h-52 overflow-hidden">
                  <img
                    src={s.image}
                    alt={s.alt ?? s.title}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div
                    className="absolute inset-0"
                    style={{ background: "linear-gradient(180deg,transparent 45%,rgba(11,46,89,.55))" }}
                  />
                  <div className="absolute top-4 left-4 w-11 h-11 rounded-xl bg-white/95 backdrop-blur grid place-items-center shadow-lg">
                    <Icon className="w-5 h-5 text-[#1D74D6]" />
                  </div>
                  <h3 className="absolute bottom-4 left-4 right-4 font-display font-bold text-white text-2xl">
                    {s.title}
                  </h3>
                </div>
                <div className="p-6 flex flex-col">
                  <p className="text-slate-600 text-sm leading-relaxed">{s.text}</p>
                  <ul className="mt-4 space-y-2">
                    {s.benefits.map((b) => (
                      <li key={b} className="flex items-center gap-2 text-sm text-slate-700">
                        <Check className="w-4 h-4 text-[#22C55E] shrink-0" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                  <a
                    href={whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => track("whatsapp_click", { location: "service_card", service: s.title })}
                    className="mt-5 inline-flex items-center justify-between gap-2 h-11 px-4 rounded-xl font-semibold text-sm text-[#0B2E59] bg-slate-50 hover:bg-[#0B2E59] hover:text-white border border-slate-200 hover:border-[#0B2E59] transition-all"
                  >
                    Solicitar orçamento
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------- CALCULATOR ------------------------------ */
const CALC_STEPS = [
  { id: "servico", label: "Qual serviço?", options: ["Sofá", "Colchão", "Tapete", "Poltrona", "Bancos Automotivos", "Impermeabilização"] },
  { id: "qtd", label: "Quantidade / tamanho", options: ["1 peça", "2 peças", "3 peças", "4+ peças"] },
  { id: "cidade", label: "Cidade / bairro", options: ["São Luís", "São José de Ribamar", "Paço do Lumiar", "Raposa", "Outro"] },
  { id: "tecido", label: "Tipo de tecido", options: ["Tecido comum", "Suede", "Couro", "Couro sintético", "Não sei"] },
];

function CalculatorSection() {
  const anim = useAnim();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const done = step === CALC_STEPS.length;
  const current = CALC_STEPS[step];

  const submit = () => {
    const summary = CALC_STEPS.map((s) => `• ${s.label}: ${answers[s.id] ?? "-"}`).join("\n");
    const text = `Olá! Fiz uma simulação no site e quero orçamento:\n\n${summary}`;
    const url = `https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(text)}`;
    track("calculator_submit", answers);
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <section id="calculadora" className="py-24 md:py-28 relative">
      <div className="container-page">
        <div
          className="rounded-[32px] overflow-hidden relative"
          style={{
            background:
              "linear-gradient(135deg,#0B2E59 0%,#0F3F73 45%,#1D74D6 100%)",
          }}
        >
          <div className="absolute inset-0 opacity-30 pointer-events-none">
            <div className="absolute -top-20 -left-20 w-96 h-96 rounded-full blur-3xl" style={{ background: "#35A8FF" }} />
            <div className="absolute -bottom-24 right-0 w-[500px] h-[500px] rounded-full blur-3xl" style={{ background: "#0B2E59" }} />
          </div>

          <div className="relative grid lg:grid-cols-[.9fr_1.1fr] gap-10 lg:gap-14 p-8 md:p-14">
            <motion.div {...anim.fadeUp} className="text-white">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/15 border border-white/25 text-[12px] font-semibold tracking-wider uppercase">
                <Calculator className="w-3.5 h-3.5" /> Calculadora de orçamento
              </span>
              <h2 className="font-display font-extrabold text-4xl md:text-5xl mt-5 leading-tight">
                Simule seu orçamento em <span className="text-[#35A8FF]">30 segundos</span>.
              </h2>
              <p className="mt-5 text-white/80 text-lg leading-relaxed">
                4 perguntas simples e enviamos o valor estimado direto no seu WhatsApp — sem compromisso.
              </p>
              <ul className="mt-6 space-y-2 text-sm text-white/90">
                {["100% grátis", "Sem cadastro", "Resposta em minutos"].map((t) => (
                  <li key={t} className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#35A8FF]" /> {t}
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              {...anim.fadeUp}
              className="bg-white rounded-3xl p-6 md:p-8 shadow-2xl"
            >
              {/* progress */}
              <div className="flex items-center gap-2 mb-6">
                {CALC_STEPS.map((_, i) => (
                  <div
                    key={i}
                    className={`h-1.5 flex-1 rounded-full transition-all ${
                      i <= step ? "bg-[#1D74D6]" : "bg-slate-200"
                    }`}
                  />
                ))}
                <span className="text-xs font-semibold text-slate-500 ml-2 whitespace-nowrap">
                  {Math.min(step + 1, CALC_STEPS.length)}/{CALC_STEPS.length}
                </span>
              </div>

              <AnimatePresence mode="wait">
                {!done ? (
                  <motion.div
                    key={current.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h3 className="font-display font-bold text-2xl text-[#0B2E59]">{current.label}</h3>
                    <div className="mt-5 grid grid-cols-2 gap-2.5">
                      {current.options.map((opt) => {
                        const active = answers[current.id] === opt;
                        return (
                          <button
                            key={opt}
                            onClick={() => setAnswers((a) => ({ ...a, [current.id]: opt }))}
                            className={`px-4 h-14 rounded-xl border text-sm font-semibold transition-all text-left ${
                              active
                                ? "border-[#1D74D6] bg-[#1D74D6]/10 text-[#0B2E59] shadow-inner"
                                : "border-slate-200 hover:border-[#1D74D6]/40 text-slate-700"
                            }`}
                          >
                            {opt}
                          </button>
                        );
                      })}
                    </div>
                    <div className="mt-6 flex items-center justify-between gap-3">
                      <button
                        onClick={() => setStep((s) => Math.max(0, s - 1))}
                        disabled={step === 0}
                        className="h-11 px-4 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 disabled:opacity-40"
                      >
                        Voltar
                      </button>
                      <button
                        onClick={() => setStep((s) => s + 1)}
                        disabled={!answers[current.id]}
                        className="h-11 px-6 rounded-xl font-semibold text-white shadow-lg shadow-[#0B2E59]/25 disabled:opacity-40 disabled:shadow-none inline-flex items-center gap-2"
                        style={{ background: "linear-gradient(135deg,#0B2E59,#1D74D6)" }}
                      >
                        Próximo <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="done"
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.35 }}
                  >
                    <h3 className="font-display font-bold text-2xl text-[#0B2E59]">Sua estimativa está pronta ✨</h3>
                    <p className="text-slate-600 mt-2 text-sm">
                      Confirmamos o valor exato no WhatsApp após uma foto rápida do estofado.
                    </p>
                    <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4 space-y-1.5 text-sm">
                      {CALC_STEPS.map((s) => (
                        <div key={s.id} className="flex justify-between gap-4">
                          <span className="text-slate-500">{s.label}</span>
                          <span className="font-semibold text-[#0B2E59] text-right">{answers[s.id]}</span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-6 flex flex-col sm:flex-row gap-3">
                      <button
                        onClick={() => {
                          setStep(0);
                          setAnswers({});
                        }}
                        className="h-12 px-5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-700"
                      >
                        Refazer
                      </button>
                      <button
                        onClick={submit}
                        className="flex-1 h-12 rounded-xl font-bold text-white shadow-xl inline-flex items-center justify-center gap-2"
                        style={{ background: "linear-gradient(135deg,#25D366,#128C7E)" }}
                      >
                        Receber orçamento no WhatsApp <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------ BEFORE / AFTER ------------------------------ */
function categoryOf(label: string): string {
  const l = label.toLowerCase();
  if (l.includes("sof")) return "Sofás";
  if (l.includes("colch")) return "Colchões";
  if (l.includes("tape")) return "Tapetes";
  if (l.includes("banco") || l.includes("carr") || l.includes("auto")) return "Automóveis";
  return "Outros";
}

function BeforeAfter() {
  const anim = useAnim();
  const cats = ["Todos", "Sofás", "Colchões", "Tapetes", "Automóveis"];
  const [filter, setFilter] = useState("Todos");
  const [lightbox, setLightbox] = useState<{ before: string; after: string; label: string } | null>(null);

  const items = useMemo(
    () =>
      siteConfig.gallery.filter((g) => filter === "Todos" || categoryOf(g.label) === filter),
    [filter],
  );

  return (
    <section id="antes-depois" className="py-24 md:py-32 bg-[#F0F5FB]/50">
      <div className="container-page">
        <motion.div {...anim.fadeUp} className="max-w-2xl">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0B2E59]/5 border border-[#0B2E59]/10 text-[12px] font-semibold tracking-wider uppercase text-[#0B2E59]">
            Antes e Depois
          </span>
          <h2 className="font-display font-extrabold text-4xl md:text-5xl lg:text-6xl mt-5 text-[#0B2E59] leading-tight">
            Resultados reais que falam por si.
          </h2>
          <p className="mt-5 text-lg text-slate-600 leading-relaxed">
            Deslize as fotos abaixo e veja a diferença. Cada peça é registrada antes e depois do atendimento.
          </p>
        </motion.div>

        <motion.div {...anim.fadeUp} className="mt-8 flex flex-wrap gap-2">
          {cats.map((c) => (
            <button
              key={c}
              onClick={() => setFilter(c)}
              className={`px-4 h-10 rounded-full text-sm font-semibold border transition-all ${
                filter === c
                  ? "bg-[#0B2E59] text-white border-[#0B2E59] shadow-lg shadow-[#0B2E59]/20"
                  : "bg-white text-slate-700 border-slate-200 hover:border-[#1D74D6]"
              }`}
            >
              {c}
            </button>
          ))}
        </motion.div>

        <div className="mt-10 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((g, i) => (
            <motion.div
              key={g.label + i}
              {...anim.stagger(i)}
              whileHover={{ y: -4 }}
              className="rounded-3xl overflow-hidden bg-white border border-slate-100 shadow-[0_10px_40px_rgba(11,46,89,.08)]"
            >
              <BeforeAfterSlider before={g.before} after={g.after} label={g.label} />
              <div className="p-4 flex items-center justify-between">
                <span className="text-sm font-semibold text-[#0B2E59]">{g.label}</span>
                <button
                  onClick={() => setLightbox(g)}
                  className="text-xs font-semibold text-[#1D74D6] hover:underline"
                >
                  Ver ampliado →
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] bg-slate-900/85 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setLightbox(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative bg-white rounded-3xl overflow-hidden max-w-4xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setLightbox(null)}
                className="absolute top-3 right-3 z-10 w-10 h-10 rounded-full bg-white/90 grid place-items-center shadow-lg"
              >
                <X className="w-5 h-5" />
              </button>
              <BeforeAfterSlider before={lightbox.before} after={lightbox.after} label={lightbox.label} />
              <div className="p-4 text-center font-semibold text-[#0B2E59]">{lightbox.label}</div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

/* --------------------------------- PROCESS --------------------------------- */
function Process() {
  const anim = useAnim();
  const steps = [
    { icon: Phone, title: "Agendamento", text: "Chama no WhatsApp e escolhe o melhor dia." },
    { icon: Calculator, title: "Avaliação", text: "Analisamos tecido, estado e passamos o orçamento." },
    { icon: Droplets, title: "Higienização", text: "Extração profunda com equipamento profissional." },
    { icon: Wind, title: "Secagem", text: "Secagem rápida em algumas horas — pronto pra usar." },
    { icon: Sprout, title: "Entrega", text: "Peça revitalizada, saudável e sem odor." },
  ];
  return (
    <section id="processo" className="py-24 md:py-32">
      <div className="container-page">
        <motion.div {...anim.fadeUp} className="max-w-2xl text-center mx-auto">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0B2E59]/5 border border-[#0B2E59]/10 text-[12px] font-semibold tracking-wider uppercase text-[#0B2E59]">
            Como funciona
          </span>
          <h2 className="font-display font-extrabold text-4xl md:text-5xl lg:text-6xl mt-5 text-[#0B2E59] leading-tight">
            5 passos simples para o seu estofado novo.
          </h2>
        </motion.div>

        <div className="mt-16 relative">
          <div className="hidden lg:block absolute top-8 left-[10%] right-[10%] h-[2px]"
               style={{ background: "linear-gradient(90deg,#35A8FF,#1D74D6,#0B2E59)" }} />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 lg:gap-4">
            {steps.map((s, i) => (
              <motion.div
                key={s.title}
                {...anim.stagger(i)}
                className="relative flex flex-col items-center text-center"
              >
                <motion.div
                  whileHover={{ scale: 1.08, rotate: -3 }}
                  transition={{ type: "spring", stiffness: 260 }}
                  className="w-16 h-16 rounded-2xl grid place-items-center text-white shadow-xl shadow-[#0B2E59]/25 relative z-10"
                  style={{ background: "linear-gradient(135deg,#0B2E59,#1D74D6)" }}
                >
                  <s.icon className="w-7 h-7" />
                  <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-[#35A8FF] text-white text-xs font-bold grid place-items-center border-2 border-white">
                    {i + 1}
                  </span>
                </motion.div>
                <h3 className="mt-5 font-display font-bold text-lg text-[#0B2E59]">{s.title}</h3>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed max-w-[16rem]">{s.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------- FEATURES -------------------------------- */
function Features() {
  const anim = useAnim();
  const items = [
    { icon: MapPin, title: "Atendimento Domiciliar", text: "Vamos até sua casa em São Luís e região. Sem transtorno." },
    { icon: Leaf, title: "Produtos Certificados", text: "Biodegradáveis, hipoalergênicos, seguros para crianças e pets." },
    { icon: Droplets, title: "Equipamentos Profissionais", text: "Extração de alta performance que remove sujeira profunda." },
    { icon: Users, title: "Equipe Especializada", text: "Técnicos treinados, uniformizados e educados." },
    { icon: ShieldCheck, title: "Eliminação de Ácaros", text: "Até 99% dos ácaros e bactérias removidos por peça." },
    { icon: Award, title: "Garantia de Qualidade", text: "Se não ficar impecável, refazemos sem custo adicional." },
  ];
  return (
    <section id="diferenciais" className="py-24 md:py-32 bg-[#F0F5FB]/50">
      <div className="container-page">
        <motion.div {...anim.fadeUp} className="max-w-2xl">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0B2E59]/5 border border-[#0B2E59]/10 text-[12px] font-semibold tracking-wider uppercase text-[#0B2E59]">
            Por que a Siqueira
          </span>
          <h2 className="font-display font-extrabold text-4xl md:text-5xl lg:text-6xl mt-5 text-[#0B2E59] leading-tight">
            Diferenciais que fazem a diferença.
          </h2>
        </motion.div>
        <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((f, i) => (
            <motion.div
              key={f.title}
              {...anim.stagger(i)}
              whileHover={{ y: -6 }}
              className="group bg-white rounded-2xl p-7 border border-slate-100 shadow-[0_6px_24px_rgba(11,46,89,.05)] hover:shadow-[0_20px_50px_rgba(11,46,89,.12)] transition-shadow"
            >
              <div
                className="w-14 h-14 rounded-2xl grid place-items-center text-white shadow-lg shadow-[#0B2E59]/20 group-hover:scale-110 transition-transform"
                style={{ background: "linear-gradient(135deg,#1D74D6,#35A8FF)" }}
              >
                <f.icon className="w-6 h-6" />
              </div>
              <h3 className="mt-5 font-display font-bold text-xl text-[#0B2E59]">{f.title}</h3>
              <p className="mt-2 text-slate-600 leading-relaxed">{f.text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------- STATS ---------------------------------- */
function Counter({ to, prefix = "", suffix = "" }: { to: number; prefix?: string; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const mv = useMotionValue(0);
  const [display, setDisplay] = useState("0");
  useEffect(() => {
    if (!inView) return;
    const controls = motionAnimate(mv, to, {
      duration: 2,
      ease: easeSmooth,
      onUpdate: (v) => setDisplay(Math.round(v).toLocaleString("pt-BR")),
    });
    return () => controls.stop();
  }, [inView, to, mv]);
  return (
    <span ref={ref}>
      {prefix}
      {display}
      {suffix}
    </span>
  );
}

function Stats() {
  const anim = useAnim();
  const items = [
    { value: 750, prefix: "+", suffix: "", label: "Clientes atendidos" },
    { value: 1200, prefix: "+", suffix: "", label: "Estofados higienizados" },
    { value: 49, prefix: "", suffix: "★", label: "Nota média 4.9" },
    { value: 99, prefix: "", suffix: "%", label: "Eliminação de ácaros" },
  ];
  return (
    <section
      className="py-20 md:py-24 text-white relative overflow-hidden"
      style={{ background: "linear-gradient(135deg,#0B2E59 0%,#0F3F73 50%,#1D74D6 100%)" }}
    >
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full blur-3xl" style={{ background: "#35A8FF" }} />
      </div>
      <div className="container-page relative">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {items.map((s, i) => (
            <motion.div key={i} {...anim.stagger(i)} className="text-center">
              <div className="font-display font-extrabold text-4xl md:text-6xl leading-none">
                {s.label.includes("Nota") ? (
                  <>4,9<span className="text-[#35A8FF] ml-1">★</span></>
                ) : (
                  <Counter to={s.value} prefix={s.prefix} suffix={s.suffix} />
                )}
              </div>
              <div className="mt-3 text-white/80 text-sm md:text-base font-medium">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------- TESTIMONIALS ------------------------------ */
function Testimonials() {
  const anim = useAnim();
  const items = siteConfig.testimonials;
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % items.length), 6500);
    return () => clearInterval(t);
  }, [items.length]);

  return (
    <section id="depoimentos" className="py-24 md:py-32">
      <div className="container-page">
        <motion.div {...anim.fadeUp} className="max-w-2xl text-center mx-auto">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0B2E59]/5 border border-[#0B2E59]/10 text-[12px] font-semibold tracking-wider uppercase text-[#0B2E59]">
            Depoimentos
          </span>
          <h2 className="font-display font-extrabold text-4xl md:text-5xl lg:text-6xl mt-5 text-[#0B2E59] leading-tight">
            Histórias de clientes felizes.
          </h2>
        </motion.div>

        <div className="mt-14 max-w-3xl mx-auto relative">
          <AnimatePresence mode="wait">
            <motion.blockquote
              key={idx}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.4 }}
              className="bg-white rounded-3xl p-8 md:p-12 border border-slate-100 shadow-[0_20px_50px_rgba(11,46,89,.08)] text-center"
            >
              <div className="flex justify-center gap-1 text-amber-500 mb-5">
                {[0, 1, 2, 3, 4].map((i) => (
                  <Star key={i} className="w-5 h-5 fill-current" />
                ))}
              </div>
              <p className="text-lg md:text-xl text-slate-700 leading-relaxed italic">
                "{items[idx].text}"
              </p>
              <footer className="mt-8 flex items-center justify-center gap-4">
                <img src={items[idx].avatar} alt="" className="w-14 h-14 rounded-full object-cover" />
                <div className="text-left">
                  <div className="font-display font-bold text-[#0B2E59]">{items[idx].name}</div>
                  <div className="text-sm text-slate-500">{items[idx].role}</div>
                </div>
              </footer>
            </motion.blockquote>
          </AnimatePresence>

          <div className="mt-6 flex items-center justify-center gap-4">
            <button
              onClick={() => setIdx((i) => (i - 1 + items.length) % items.length)}
              className="w-11 h-11 rounded-full border border-slate-200 grid place-items-center hover:border-[#1D74D6] hover:text-[#1D74D6] transition-colors"
              aria-label="Anterior"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="flex gap-2">
              {items.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setIdx(i)}
                  aria-label={`Depoimento ${i + 1}`}
                  className={`h-2 rounded-full transition-all ${
                    i === idx ? "w-8 bg-[#1D74D6]" : "w-2 bg-slate-300"
                  }`}
                />
              ))}
            </div>
            <button
              onClick={() => setIdx((i) => (i + 1) % items.length)}
              className="w-11 h-11 rounded-full border border-slate-200 grid place-items-center hover:border-[#1D74D6] hover:text-[#1D74D6] transition-colors"
              aria-label="Próximo"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ----------------------------------- FAQ ----------------------------------- */
function FAQ() {
  const anim = useAnim();
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" className="py-24 md:py-32 bg-[#F0F5FB]/50">
      <div className="container-page grid lg:grid-cols-[.9fr_1.1fr] gap-14">
        <motion.div {...anim.fadeUp}>
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0B2E59]/5 border border-[#0B2E59]/10 text-[12px] font-semibold tracking-wider uppercase text-[#0B2E59]">
            FAQ
          </span>
          <h2 className="font-display font-extrabold text-4xl md:text-5xl lg:text-6xl mt-5 text-[#0B2E59] leading-tight">
            Perguntas frequentes.
          </h2>
          <p className="mt-5 text-slate-600 leading-relaxed">
            Não encontrou sua dúvida? Chama a gente no WhatsApp — respondemos rapidinho.
          </p>
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center gap-2 h-12 px-5 rounded-xl font-semibold text-white shadow-lg"
            style={{ background: "linear-gradient(135deg,#25D366,#128C7E)" }}
          >
            Tirar dúvidas no WhatsApp <ArrowRight className="w-4 h-4" />
          </a>
        </motion.div>

        <div className="space-y-3">
          {siteConfig.faq.map((f, i) => {
            const active = open === i;
            return (
              <motion.div
                key={i}
                {...anim.stagger(i)}
                className={`bg-white rounded-2xl border transition-all ${
                  active ? "border-[#1D74D6]/40 shadow-[0_18px_40px_rgba(11,46,89,.10)]" : "border-slate-100"
                }`}
              >
                <button
                  onClick={() => setOpen(active ? null : i)}
                  className="w-full flex items-center justify-between gap-4 p-5 md:p-6 text-left"
                >
                  <span className="font-display font-bold text-[#0B2E59] text-base md:text-lg">
                    {f.question}
                  </span>
                  <span
                    className={`w-8 h-8 rounded-full grid place-items-center shrink-0 transition-colors ${
                      active ? "bg-[#1D74D6] text-white" : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {active ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  </span>
                </button>
                <AnimatePresence initial={false}>
                  {active && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: easeSmooth }}
                      className="overflow-hidden"
                    >
                      <p className="px-5 md:px-6 pb-6 text-slate-600 leading-relaxed">{f.answer}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------- BLOG ---------------------------------- */
function BlogSection() {
  const anim = useAnim();
  const posts = blogPosts.slice(0, 3);
  return (
    <section id="blog" className="py-24 md:py-32">
      <div className="container-page">
        <motion.div {...anim.fadeUp} className="flex items-end justify-between flex-wrap gap-6">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0B2E59]/5 border border-[#0B2E59]/10 text-[12px] font-semibold tracking-wider uppercase text-[#0B2E59]">
              Blog
            </span>
            <h2 className="font-display font-extrabold text-4xl md:text-5xl lg:text-6xl mt-5 text-[#0B2E59] leading-tight">
              Dicas e conteúdo do especialista.
            </h2>
          </div>
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 font-semibold text-[#1D74D6] hover:gap-3 transition-all"
          >
            Ver todos <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>

        <div className="mt-12 grid md:grid-cols-3 gap-6">
          {posts.map((p, i) => (
            <motion.article
              key={p.slug}
              {...anim.stagger(i)}
              whileHover={{ y: -6 }}
              className="group bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-[0_10px_40px_rgba(11,46,89,.06)] hover:shadow-[0_24px_60px_rgba(11,46,89,.12)] transition-shadow"
            >
              <Link to="/blog/$slug" params={{ slug: p.slug }} className="block">
                <div className="h-48 overflow-hidden">
                  <img
                    src={p.cover}
                    alt=""
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <span className="px-2.5 py-1 rounded-full bg-[#1D74D6]/10 text-[#1D74D6] font-semibold">
                      {p.category}
                    </span>
                    <span>•</span>
                    <span>{p.readingTime}</span>
                  </div>
                  <h3 className="mt-3 font-display font-bold text-lg text-[#0B2E59] leading-snug group-hover:text-[#1D74D6] transition-colors">
                    {p.title.split("|")[0].trim()}
                  </h3>
                  <p className="mt-2 text-sm text-slate-600 leading-relaxed line-clamp-3">{p.excerpt}</p>
                </div>
              </Link>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------- CTA ---------------------------------- */
function FinalCTA() {
  const anim = useAnim();
  return (
    <section id="contato" className="py-24 md:py-32">
      <div className="container-page">
        <motion.div
          {...anim.fadeUp}
          className="relative overflow-hidden rounded-[36px] px-8 py-16 md:p-20 text-center text-white"
          style={{
            background:
              "linear-gradient(135deg,#0B2E59 0%,#0F3F73 40%,#1D74D6 80%,#35A8FF 130%)",
          }}
        >
          <div className="absolute inset-0 opacity-25 pointer-events-none">
            <div className="absolute -top-32 left-0 w-[500px] h-[500px] rounded-full blur-3xl" style={{ background: "#35A8FF" }} />
            <div className="absolute -bottom-40 right-0 w-[500px] h-[500px] rounded-full blur-3xl" style={{ background: "#0B2E59" }} />
          </div>
          <div className="relative max-w-3xl mx-auto">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/15 border border-white/25 text-[12px] font-semibold tracking-wider uppercase">
              <Sparkles className="w-3.5 h-3.5" /> Sua casa merece
            </span>
            <h2 className="font-display font-extrabold text-4xl md:text-6xl mt-6 leading-[1.05]">
              Seu sofá merece um cuidado profissional.
            </h2>
            <p className="mt-6 text-lg md:text-xl text-white/85 leading-relaxed">
              Chame a Siqueira e devolva vida, cor e saúde ao seu estofado. Atendimento em São Luís e região.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => track("whatsapp_click", { location: "final_cta_orcamento" })}
                className="inline-flex items-center justify-center gap-2 h-16 px-10 rounded-2xl font-bold text-lg text-[#0B2E59] bg-white shadow-2xl hover:-translate-y-0.5 transition-all"
              >
                Solicitar orçamento <ArrowRight className="w-5 h-5" />
              </a>
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 h-16 px-10 rounded-2xl font-bold text-lg text-white shadow-2xl hover:-translate-y-0.5 transition-all"
                style={{ background: "linear-gradient(135deg,#25D366,#128C7E)" }}
              >
                Falar no WhatsApp
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* --------------------------------- FOOTER --------------------------------- */
function Footer() {
  return (
    <footer className="bg-[#0B2E59] text-slate-300">
      <div className="container-page py-16 grid md:grid-cols-4 gap-10">
        <div>
          <div className="flex items-center gap-3">
            <img src={logoAsset} alt="" className="w-10 h-10" />
            <span className="font-display font-extrabold text-white text-lg">{siteConfig.brandName}</span>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-slate-400">
            Higienização profissional de estofados, colchões, tapetes e veículos em São Luís/MA e região.
          </p>
          <div className="mt-5 flex items-center gap-3">
            <a
              href={siteConfig.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="w-10 h-10 rounded-full border border-white/15 grid place-items-center hover:bg-white/10 transition-colors"
            >
              <Instagram className="w-4 h-4" />
            </a>
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
              className="w-10 h-10 rounded-full border border-white/15 grid place-items-center hover:bg-white/10 transition-colors"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d="M20.52 3.48A11.86 11.86 0 0 0 12.05 0C5.5 0 .18 5.32.18 11.86c0 2.09.55 4.13 1.6 5.93L0 24l6.35-1.66a11.85 11.85 0 0 0 5.7 1.45c6.55 0 11.87-5.32 11.87-11.86 0-3.17-1.24-6.15-3.41-8.45z" />
              </svg>
            </a>
          </div>
        </div>

        <div>
          <h4 className="font-display font-bold text-white text-sm uppercase tracking-wider">Contato</h4>
          <ul className="mt-4 space-y-3 text-sm">
            <li className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-[#35A8FF]" /> {siteConfig.phoneDisplay}
            </li>
            <li className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#35A8FF]" /> {siteConfig.address}
            </li>
            <li className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#35A8FF]" /> {siteConfig.businessHours}
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-display font-bold text-white text-sm uppercase tracking-wider">Links úteis</h4>
          <ul className="mt-4 space-y-2 text-sm">
            <li><a href="#servicos" className="hover:text-white">Serviços</a></li>
            <li><a href="#antes-depois" className="hover:text-white">Antes e Depois</a></li>
            <li><a href="#depoimentos" className="hover:text-white">Depoimentos</a></li>
            <li><a href="#faq" className="hover:text-white">FAQ</a></li>
            <li><Link to="/blog" className="hover:text-white">Blog</Link></li>
            <li><Link to="/agendar" className="hover:text-white">Agendar Higienização</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-display font-bold text-white text-sm uppercase tracking-wider">Área de atendimento</h4>
          <div className="mt-4 rounded-2xl overflow-hidden border border-white/10">
            <iframe
              title="Mapa São Luís/MA"
              src="https://www.google.com/maps?q=São+Luís+MA&output=embed"
              loading="lazy"
              className="w-full h-40 grayscale contrast-125"
            />
          </div>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container-page py-6 text-xs text-slate-400 flex flex-wrap gap-3 items-center justify-between">
          <span>© {new Date().getFullYear()} {siteConfig.brandName}. Todos os direitos reservados.</span>
          <span>CNPJ · Higienização profissional em São Luís/MA</span>
        </div>
      </div>
    </footer>
  );
}

/* ---------------------------------- PAGE ---------------------------------- */
function LandingPage() {
  return (
    <main className="min-h-screen bg-background text-foreground overflow-x-clip">
      <Nav />
      <Hero />
      <Services />
      <CalculatorSection />
      <BeforeAfter />
      <Process />
      <Features />
      <Stats />
      <Testimonials />
      <FAQ />
      <BlogSection />
      <FinalCTA />
      <Footer />
    </main>
  );
}
