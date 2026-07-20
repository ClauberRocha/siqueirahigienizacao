import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import heroImage from "@/assets/hero-higienizacao-sofa.jpg";
import heroImageWebp from "@/assets/hero-higienizacao-sofa.webp";
import logoAsset from "@/assets/logo-siqueira.png.asset.json";
import { siteConfig, whatsappLink } from "@/lib/site-config";
import { track } from "@/lib/analytics";
import { ContactForm } from "@/components/ContactForm";
import { BeforeAfterSlider } from "@/components/BeforeAfterSlider";
import video1 from "@/assets/videos/trabalho-1.mp4.asset.json";
import video2 from "@/assets/videos/trabalho-2.mp4.asset.json";
import video3 from "@/assets/videos/trabalho-3.mp4.asset.json";
import video4 from "@/assets/videos/trabalho-4.mp4.asset.json";
import video5 from "@/assets/videos/trabalho-5.mp4.asset.json";
import video6 from "@/assets/videos/trabalho-6.mp4.asset.json";
import video7 from "@/assets/videos/trabalho-7.mp4.asset.json";

const workVideos = [video1, video2, video3, video4, video5, video6, video7];

const CSS = `

  :root{
    --bg:#ECFEFF;
    --bg2:#CFFAFE;
    --ink:#0F172A;
    --muted:#475569;
    --cyan:#06B6D4;
    --cyan2:#0E7490;
    --cyan-soft:rgba(6,182,212,.1);
    --line:#CFFAFE;
    --white:#FFFFFF;
  }
  *{box-sizing:border-box}html{scroll-behavior:smooth}
  body{margin:0;background:var(--bg);color:var(--ink);font-family:"Inter",system-ui,sans-serif;overflow-x:hidden;line-height:1.6}
  .display{font-family:"Poppins",sans-serif;font-weight:800;line-height:1.05;letter-spacing:-.02em}
  .container{max-width:1180px;margin:0 auto;padding-left:26px;padding-right:26px}
  .cine{position:fixed;inset:0;z-index:0;overflow:hidden;background:var(--bg);transform:translateZ(0)}
  .cine .l{position:absolute;inset:-25%;filter:blur(72px);opacity:.55;will-change:transform}
  .l1{background:radial-gradient(38% 38% at 22% 20%,rgba(6,182,212,.35),transparent 70%);animation:d1 26s ease-in-out infinite}
  .l2{background:radial-gradient(42% 42% at 80% 30%,rgba(14,116,144,.25),transparent 70%);animation:d2 30s ease-in-out infinite}
  @keyframes d1{0%,100%{transform:translate(0,0) scale(1)}50%{transform:translate(6%,5%) scale(1.12)}}
  @keyframes d2{0%,100%{transform:translate(0,0) scale(1.1)}50%{transform:translate(-7%,4%) scale(1)}}
  .wrap{position:relative;z-index:2}
  .cyantext{color:var(--cyan2)}
  .grad{background:linear-gradient(100deg,var(--cyan),var(--cyan2));-webkit-background-clip:text;background-clip:text;color:transparent}
  .kicker{display:inline-flex;align-items:center;gap:9px;font-size:11px;letter-spacing:.2em;text-transform:uppercase;color:var(--cyan2);border:1px solid rgba(14,116,144,.28);background:var(--cyan-soft);padding:8px 15px;border-radius:999px}
  .btn{display:inline-flex;align-items:center;justify-content:center;gap:10px;font-weight:700;border-radius:13px;padding:16px 28px;text-decoration:none;transition:transform .25s,box-shadow .25s;font-size:15px;cursor:pointer;border:0;min-height:48px}
  .btn-wa{background:linear-gradient(135deg,#25D366,#128C7E);color:#fff;box-shadow:0 16px 40px rgba(37,211,102,.3)}
  .btn-wa:hover{transform:translateY(-2px)}
  .btn-cyan{background:linear-gradient(180deg,var(--cyan),var(--cyan2));color:#fff;box-shadow:0 16px 40px rgba(6,182,212,.35)}
  .btn-cyan:hover{transform:translateY(-2px)}
  .btn-ghost{border:1px solid rgba(15,23,42,.18);color:var(--ink);background:transparent}.btn-ghost:hover{background:rgba(15,23,42,.04)}
  @media (max-width:640px){.btn{width:100%;padding:15px 22px;font-size:15px}}
  .reveal{opacity:1}.reveal.in{animation:rin .7s cubic-bezier(.16,1,.3,1) both}@keyframes rin{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:none}}
  .card{background:var(--white);border:1px solid var(--line);border-radius:18px;box-shadow:0 10px 34px rgba(14,116,144,.06)}
  .hover-lift{transition:transform .3s ease-out,box-shadow .3s ease-out;will-change:transform}
  .hover-lift:hover{transform:translateY(-8px);box-shadow:0 22px 50px rgba(14,116,144,.16)}
  @media (max-width:640px){.hover-lift:hover{transform:translateY(-3px);box-shadow:0 14px 30px rgba(14,116,144,.12)}}
  .service-card{overflow:hidden}
  .service-card .thumb{width:100%;height:180px;object-fit:cover;display:block}
  .frame{border-radius:22px;overflow:hidden;position:relative;box-shadow:0 40px 90px rgba(11,60,90,.2)}
  .navwrap{position:fixed;top:14px;left:0;right:0;z-index:40;transition:.3s}
  .navwrap.s{top:9px}
  .navwrap>div{background:color-mix(in srgb,var(--bg) 62%,transparent);-webkit-backdrop-filter:saturate(1.6) blur(18px);backdrop-filter:saturate(1.6) blur(18px);border:1px solid color-mix(in srgb,var(--ink) 11%,transparent);border-radius:18px;box-shadow:0 10px 30px rgba(11,60,90,.08),inset 0 1px 0 rgba(255,255,255,.55);transition:.3s}
  .navwrap.s>div{background:color-mix(in srgb,var(--bg) 88%,transparent)}
  .mark{width:38px;height:38px;display:flex;align-items:center;justify-content:center}
  .mark img{width:100%;height:100%;object-fit:contain;display:block}
  details.faq{border-bottom:1px solid var(--line)}
  details.faq summary{list-style:none;cursor:pointer;padding:20px 4px;display:flex;justify-content:space-between;gap:16px;align-items:center;font-weight:600;font-size:17px}
  details.faq summary::-webkit-details-marker{display:none}
  details.faq[open] .pl{transform:rotate(45deg)} .pl{transition:.3s;color:var(--cyan);font-size:24px;font-weight:700}
  .field{width:100%;background:#fff;border:1px solid var(--line);border-radius:12px;padding:14px 16px;color:var(--ink);outline:none;font-size:15px}.field:focus{border-color:var(--cyan)}
  .wa{position:fixed;right:calc(20px + env(safe-area-inset-right,0px));bottom:calc(20px + env(safe-area-inset-bottom,0px));z-index:45;display:flex;align-items:center;gap:10px;padding:13px 18px 13px 14px;border-radius:999px;background:linear-gradient(135deg,#25D366,#128C7E);color:#fff;font-weight:700;font-size:14px;text-decoration:none;box-shadow:0 16px 40px rgba(37,211,102,.45);min-height:52px}
  .wa-float{position:fixed;right:calc(16px + env(safe-area-inset-right,0px));bottom:calc(16px + env(safe-area-inset-bottom,0px));z-index:45;display:flex;align-items:center;gap:10px}
  .wa-float .wa{position:static}
  .wa-bubble{background:#fff;color:var(--ink);font-size:13px;font-weight:600;padding:10px 14px;border-radius:14px;box-shadow:0 10px 30px rgba(11,60,90,.15);border:1px solid var(--line);position:relative;animation:waBub 3s ease-in-out infinite;max-width:220px}
  .wa-bubble::after{content:"";position:absolute;right:-6px;top:50%;transform:translateY(-50%) rotate(45deg);width:12px;height:12px;background:#fff;border-right:1px solid var(--line);border-top:1px solid var(--line)}
  @keyframes waBub{0%,100%{transform:translateY(0)}50%{transform:translateY(-4px)}}
  @media (max-width:640px){.wa-bubble{display:none}.wa-float{right:calc(14px + env(safe-area-inset-right,0px));bottom:calc(14px + env(safe-area-inset-bottom,0px))}.wa{padding:12px 16px 12px 14px;font-size:13px}}
  .totop{position:fixed;right:calc(20px + env(safe-area-inset-right,0px));bottom:calc(88px + env(safe-area-inset-bottom,0px));z-index:45;width:48px;height:48px;border-radius:999px;border:1px solid var(--line);background:#fff;color:var(--cyan2);display:flex;align-items:center;justify-content:center;font-size:22px;font-weight:700;cursor:pointer;box-shadow:0 10px 30px rgba(11,60,90,.18);opacity:0;transform:translateY(12px);pointer-events:none;transition:opacity .3s,transform .3s,background .2s}
  .totop.show{opacity:1;transform:translateY(0);pointer-events:auto}
  .totop:hover{background:var(--cyan);color:#fff}
  @media (max-width:640px){.totop{right:calc(14px + env(safe-area-inset-right,0px));bottom:calc(78px + env(safe-area-inset-bottom,0px));width:44px;height:44px;font-size:20px}}
  .ba{position:relative;border-radius:16px;overflow:hidden;aspect-ratio:4/3;background:#000}
  .ba img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
  .ba .after{clip-path:inset(0 0 0 50%)}
  .ba .divider{position:absolute;top:0;bottom:0;left:50%;width:2px;background:#fff;box-shadow:0 0 12px rgba(0,0,0,.4)}
  .ba .tag{position:absolute;top:12px;padding:4px 10px;border-radius:999px;font-size:11px;font-weight:700;letter-spacing:.1em;color:#fff;background:rgba(0,0,0,.55);backdrop-filter:blur(6px)}
  .ba .tag.tl{left:12px}
  .ba .tag.tr{right:12px}
  .ba .label{position:absolute;left:12px;bottom:12px;padding:6px 12px;border-radius:999px;font-size:12px;font-weight:600;background:rgba(255,255,255,.9);color:var(--ink)}
  .pain-grid{gap:1.25rem}
  .pain-grid > .reveal{opacity:0}
  .pain-grid > .reveal.in{animation:painIn .7s cubic-bezier(.16,1,.3,1) both}
  @keyframes painIn{from{opacity:0;transform:translateY(28px) scale(.98)}to{opacity:1;transform:none}}
  .pain-grid > .reveal.in:nth-child(1){animation-delay:.05s}
  .pain-grid > .reveal.in:nth-child(2){animation-delay:.15s}
  .pain-grid > .reveal.in:nth-child(3){animation-delay:.25s}
  .pain-grid > .reveal.in:nth-child(4){animation-delay:.35s}
  .pain-grid > .reveal.in:nth-child(5){animation-delay:.45s}
  .pain-grid > .reveal.in:nth-child(6){animation-delay:.55s}
  @media (max-width:640px){.pain-grid{gap:1rem}}
  @media (prefers-reduced-motion:reduce){
    .l1,.l2{animation:none}
    .reveal.in,.pain-grid > .reveal.in{animation:none;opacity:1}
    .hover-lift{transition:none}
    .hover-lift:hover{transform:none;box-shadow:0 10px 34px rgba(14,116,144,.06)}
    .btn-wa:hover,.btn-cyan:hover{transform:none}
  }

`;

const SITE_URL = "https://siqueirahigienizacao.lovable.app";

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
    ],
    links: [
      { rel: "canonical", href: `${SITE_URL}/` },
      { rel: "preload", as: "image", href: heroImageWebp, type: "image/webp", fetchpriority: "high" },
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
              image: `${SITE_URL}/og-image.jpg`,
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
              aggregateRating: {
                "@type": "AggregateRating",
                ratingValue: "4.9",
                reviewCount: "200",
              },
            },
            {
              "@type": "Service",
              name: "Higienização de estofados",
              serviceType: "Higienização de sofás, colchões, tapetes, cadeiras e bancos automotivos",
              provider: { "@id": `${SITE_URL}/#business` },
              areaServed: {
                "@type": "City",
                name: `${siteConfig.city}, ${siteConfig.state}`,
              },
              description: siteConfig.description,
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
  component: Index,
});

function Index() {
  const [activeVideo, setActiveVideo] = useState<string | null>(null);

  useEffect(() => {
    document.body.style.overflow = activeVideo ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActiveVideo(null);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [activeVideo]);

  useEffect(() => {
    const forceExternalBlank = (event: MouseEvent) => {
      const target = event.target instanceof Element
        ? event.target.closest<HTMLAnchorElement>('a[target="_blank"][href^="http"]')
        : null;

      if (!target) return;

      event.preventDefault();
      window.open(target.href, "_blank", "noopener,noreferrer");
    };

    const io = new IntersectionObserver(
      (es) =>
        es.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        }),
      { threshold: 0.12 },
    );
    document.querySelectorAll(".reveal").forEach((el) => io.observe(el));
    const onScroll = () => {
      const n = document.getElementById("nav");
      if (n) n.classList.toggle("s", window.scrollY > 20);
      const t = document.getElementById("totop");
      if (t) t.classList.toggle("show", window.scrollY > 400);
    };
    document.addEventListener("click", forceExternalBlank);
    addEventListener("scroll", onScroll, { passive: true });
    return () => {
      io.disconnect();
      document.removeEventListener("click", forceExternalBlank);
      removeEventListener("scroll", onScroll);
    };
  }, []);

  const waAgendar = `https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(
    "Olá! Quero agendar um atendimento de higienização.",
  )}`;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className="cine">
        <div className="l l1" />
        <div className="l l2" />
      </div>

      <div className="wrap">
        {/* NAV */}
        <nav className="navwrap" id="nav">
          <div className="container grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 sm:gap-4 h-[64px] px-4 sm:px-5">
            <a href="#topo" className="flex min-w-0 items-center gap-2.5 sm:gap-3">
              <span className="mark shrink-0"><img src={logoAsset.url} alt={`Logo ${siteConfig.brandName}`} /></span>
              <span className="flex min-w-0 flex-col justify-center leading-none gap-1">
                <span className="display text-[15px] sm:text-[17px] tracking-tight truncate">{siteConfig.brandName}</span>
                <span className="text-[9px] sm:text-[10px] tracking-[0.08em] text-[color:var(--cyan2)] font-semibold uppercase truncate">Só não limpamos o nome</span>
              </span>
            </a>
            <div className="hidden md:flex items-center gap-7 text-sm text-[color:var(--muted)]">
              <a href="#servicos" className="hover:text-[color:var(--ink)] transition">Serviços</a>
              <a href="#porque" className="hover:text-[color:var(--ink)] transition">Sobre</a>
              <a href="#galeria" className="hover:text-[color:var(--ink)] transition">Antes / Depois</a>
              <a href="#avaliacoes" className="hover:text-[color:var(--ink)] transition">Avaliações</a>
              <a href="#faq" className="hover:text-[color:var(--ink)] transition">FAQ</a>
              <a href="#contato" className="hover:text-[color:var(--ink)] transition">Contato</a>
            </div>
            <a href={whatsappLink} onClick={() => track("whatsapp_click", { location: "nav" })} target="_blank" rel="noopener noreferrer" className="btn btn-wa shrink-0 !py-2 !px-3.5 !text-xs sm:!py-2.5 sm:!px-5 sm:!text-sm whitespace-nowrap">Orçamento<span className="hidden sm:inline"> grátis</span></a>
          </div>
        </nav>

        {/* HERO */}
        <header id="topo" className="container pt-36 pb-20 md:pt-44 md:pb-28 grid lg:grid-cols-[1.05fr_.95fr] gap-14 items-center">
          <div>
            <div className="reveal kicker">{siteConfig.hero.kicker}</div>
            <h1 className="reveal display text-5xl md:text-7xl mt-7">
              {siteConfig.hero.title}
              <br />
              <span className="grad">{siteConfig.hero.titleHighlight}</span>.
            </h1>
            <p className="reveal text-lg md:text-xl text-[color:var(--muted)] max-w-xl mt-7 leading-relaxed">
              {siteConfig.hero.subtitle}
            </p>
            <div className="reveal flex flex-col sm:flex-row gap-4 mt-10">
              <a href={whatsappLink} onClick={() => track("whatsapp_click", { location: "hero", cta: "orcamento" })} className="btn btn-wa" target="_blank" rel="noopener noreferrer">{siteConfig.hero.ctaPrimary}</a>
              <a href="/agendar" onClick={() => track("agendar_click", { location: "hero" })} className="btn btn-cyan">Agendar online →</a>
            </div>
            <div className="reveal mt-5 flex flex-wrap gap-2 text-xs font-semibold">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-orange-50 text-orange-700 border border-orange-200">⚠️ Agenda da semana com apenas 3 vagas disponíveis</span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">✅ Orçamento grátis válido por 48h</span>
            </div>
            <div className="reveal flex items-center gap-4 mt-10">
              <div className="flex -space-x-3">
                <img src="https://i.pravatar.cc/80?img=12" className="w-10 h-10 rounded-full border-2 object-cover" style={{ borderColor: "var(--bg)" }} alt="" />
                <img src="https://i.pravatar.cc/80?img=33" className="w-10 h-10 rounded-full border-2 object-cover" style={{ borderColor: "var(--bg)" }} alt="" />
                <img src="https://i.pravatar.cc/80?img=8" className="w-10 h-10 rounded-full border-2 object-cover" style={{ borderColor: "var(--bg)" }} alt="" />
              </div>
              <div>
                <div className="cyantext text-sm">★★★★★</div>
                <div className="text-xs text-[color:var(--muted)]">
                  {siteConfig.stats.atendimentos} atendimentos · nota {siteConfig.stats.nota.replace(" ⭐", "")}
                </div>
              </div>
            </div>
          </div>
          <div className="reveal frame">
            <picture>
              <source srcSet={heroImageWebp} type="image/webp" />
              <img
                src={heroImage}
                alt="Técnico higienizando sofá de tecido cinza com equipamento de extração"
                className="w-full h-[540px] object-cover"
                width={900}
                height={1117}
                fetchPriority="high"
                decoding="async"
              />
            </picture>
          </div>
        </header>


        {/* SELO DE GARANTIA */}
        <section className="container pt-10">
          <div className="reveal card p-6 md:p-8 flex flex-col md:flex-row items-center gap-5 md:gap-8"
               style={{ background: "linear-gradient(135deg, #ECFEFF 0%, #FFFFFF 100%)", borderColor: "var(--cyan)" }}>
            <div className="shrink-0 w-20 h-20 rounded-full flex items-center justify-center text-4xl"
                 style={{ background: "linear-gradient(135deg,var(--cyan),var(--cyan2))", color: "#fff", boxShadow: "0 12px 30px rgba(6,182,212,.35)" }}>
              🛡️
            </div>
            <div className="text-center md:text-left flex-1">
              <div className="display text-xl md:text-2xl">Garantia de Satisfação</div>
              <p className="text-[color:var(--muted)] mt-1.5 leading-relaxed">
                Se não ficar impecável, <strong className="text-[color:var(--ink)]">refazemos o serviço sem custo adicional</strong>. Você não corre risco nenhum.
              </p>
            </div>
          </div>
        </section>

        {/* PROVA SOCIAL GIGANTE */}
        <section id="prova-social" className="container pt-16">
          <div className="reveal card p-8 md:p-14 overflow-hidden relative"
               style={{ background: "linear-gradient(135deg,#0E7490 0%,#06B6D4 60%,#22D3EE 100%)", borderColor: "transparent", color: "#fff" }}>
            <div className="absolute inset-0 opacity-20 pointer-events-none"
                 style={{ background: "radial-gradient(60% 60% at 20% 10%, rgba(255,255,255,.5), transparent 60%), radial-gradient(50% 50% at 90% 100%, rgba(255,255,255,.35), transparent 60%)" }} />
            <div className="relative text-center max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold tracking-[.2em] uppercase"
                   style={{ background: "rgba(255,255,255,.18)", border: "1px solid rgba(255,255,255,.35)" }}>
                <span aria-hidden>💎</span> A referência em São Luís
              </div>
              <div className="text-3xl md:text-4xl tracking-widest mt-6" aria-label="5 estrelas">⭐⭐⭐⭐⭐</div>
              <h2 className="display text-4xl md:text-6xl mt-4 leading-[1.05]">
                Milhares de famílias já confiam na Siqueira.
              </h2>
              <p className="text-white/90 text-lg mt-5 leading-relaxed">
                Números reais de quem trabalha há mais de 7 anos com higienização profissional em São Luís e região.
              </p>
            </div>

            <div className="relative grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-5 mt-12">
              {[
                { n: "+1.000", l: "clientes atendidos" },
                { n: "+12.000", l: "estofados higienizados" },
                { n: "98%", l: "de satisfação" },
                { n: "+500", l: "avaliações positivas" },
                { n: "Toda SL", l: "atendemos a Grande São Luís" },
              ].map((s, i) => (
                <div key={i} className="p-4 md:p-5 rounded-2xl text-center backdrop-blur flex flex-col items-center justify-center min-h-[7rem] md:min-h-[8.5rem]"
                     style={{ background: "rgba(255,255,255,.14)", border: "1px solid rgba(255,255,255,.28)" }}>
                  <div className="display text-2xl sm:text-3xl md:text-[2rem] lg:text-4xl leading-none text-white drop-shadow-sm break-words max-w-full">{s.n}</div>
                  <div className="text-white/90 text-[11px] md:text-xs mt-2 leading-snug font-medium">{s.l}</div>
                </div>
              ))}
            </div>

            <div className="relative mt-12 flex flex-col items-center gap-4">
              <p className="text-white/95 text-lg md:text-xl font-semibold text-center">
                Veja o antes e depois de verdade no nosso Instagram 👇
              </p>
              <a
                href={siteConfig.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => track("instagram_click", { location: "prova_social" })}
                className="group inline-flex items-center gap-4 px-8 md:px-12 py-5 md:py-6 rounded-2xl font-extrabold text-lg md:text-2xl text-white shadow-2xl transition-transform hover:-translate-y-1"
                style={{ background: "linear-gradient(135deg,#F58529 0%,#DD2A7B 45%,#8134AF 80%,#515BD4 100%)", boxShadow: "0 20px 50px rgba(221,42,123,.45)" }}
                aria-label="Seguir Siqueira Higienização no Instagram"
              >
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
                <span>Siga nosso Instagram</span>
                <span className="transition-transform group-hover:translate-x-1" aria-hidden>→</span>
              </a>
              <div className="text-white/85 text-sm">@{siteConfig.instagram}</div>
            </div>
          </div>
        </section>


        {/* DORES */}
        <section className="container py-24">
          <div className="reveal max-w-2xl">
            <div className="kicker mb-6">Reconhece?</div>
            <h2 className="display text-5xl md:text-6xl">Sujeira que você não vê. Ácaros que você respira.</h2>
          </div>
          <div className="pain-grid grid md:grid-cols-3 mt-14">
            {siteConfig.painPoints.map((p, i) => (
              <div className="reveal card p-8 hover-lift" key={i}>
                <div className="text-3xl mb-3">{p.icon}</div>
                <h3 className="text-xl font-bold">{p.title}</h3>
                <p className="text-[color:var(--muted)] mt-3 leading-relaxed">{p.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* PERIGOS / ALERTA DE SAÚDE */}
        <section id="perigos" className="container py-24">
          <div className="reveal max-w-3xl">
            <div className="kicker mb-6" style={{ color: "#B45309", background: "rgba(245,158,11,.12)", borderColor: "rgba(180,83,9,.35)" }}>
              <span aria-hidden>⚠️</span> Alerta de saúde
            </div>
            <h2 className="display text-5xl md:text-6xl">O que mora no seu sofá e colchão sem você ver.</h2>
            <p className="text-[color:var(--muted)] text-lg mt-6 leading-relaxed">
              Estofados acumulam suor, células mortas, poeira e umidade — o ambiente perfeito para micro-organismos que afetam a saúde da sua família todos os dias.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 mt-14">
            {[
              { icon: "🦠", title: "Seu colchão pode ter mais ácaros que a poeira do chão", text: "Milhões de ácaros vivem dentro da espuma — principal gatilho de rinite, asma e coceira nos olhos, sobretudo em crianças." },
              { icon: "🤧", title: "Sofá sujo = rinite, asma e alergia sem fim em casa", text: "Poeira, pelos e esporos ficam presos no tecido e voltam ao ar a cada vez que alguém senta, alimentando crises respiratórias." },
              { icon: "😴", title: "1/3 da sua vida em cima de bactérias invisíveis", text: "Suor e células mortas alimentam bactérias como E. coli e fungos que se multiplicam a poucos centímetros do seu rosto durante o sono." },
              { icon: "🍄", title: "Cheiro de mofo no estofado? Fungos já estão no ar que você respira", text: "Umidade de bebidas, suor e limpezas caseiras mal feitas criam mofo interno — risco de infecções de pele e problemas respiratórios." },
              { icon: "🧒", title: "Crianças e pets no sofá: contato direto com germes e resíduos", text: "Restos de comida, saliva e sujeira acumulados viram abrigo de pulgas, percevejos e bactérias que atingem quem tem menos defesa." },
            ].map((p, i) => (
              <div className="reveal card p-8 hover-lift" key={i}>
                <div className="text-3xl mb-3">{p.icon}</div>
                <h3 className="text-lg font-bold leading-snug">{p.title}</h3>
                <p className="text-[color:var(--muted)] mt-3 leading-relaxed text-sm">{p.text}</p>
              </div>
            ))}
          </div>
          <div className="reveal card hover-lift mt-10 p-8 md:p-10 flex flex-col md:flex-row items-start md:items-center gap-6 justify-between"
               style={{ background: "linear-gradient(135deg,#FFFBEB 0%,#FFFFFF 100%)", borderColor: "rgba(245,158,11,.35)" }}>
            <div>
              <h3 className="display text-2xl md:text-3xl">Proteja quem você ama.</h3>
              <p className="text-[color:var(--muted)] mt-2 leading-relaxed">Recomendamos higienização profissional a cada 6 meses — ou a cada 3 meses em casas com crianças, pets ou alérgicos.</p>
            </div>
            <a href={whatsappLink} onClick={() => track("whatsapp_click", { location: "perigos" })} className="btn btn-wa shrink-0" target="_blank" rel="noopener noreferrer">Agendar higienização</a>
          </div>
        </section>


        {/* SERVIÇOS */}
        <section id="servicos" className="container py-24">
          <div className="reveal max-w-2xl">
            <div className="kicker mb-6">O que fazemos</div>
            <h2 className="display text-5xl md:text-6xl">Higienização completa.</h2>
            <p className="text-[color:var(--muted)] text-lg mt-5 leading-relaxed">
              Da sala do seu apartamento ao carro da família — a gente cuida de cada peça com o equipamento e o produto certo.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-14">
            {siteConfig.services.map((s, i) => (
              <div className="reveal card service-card flex flex-col hover-lift" key={i}>
                <img src={s.image} alt={s.alt ?? `Higienização de ${s.title}`} className="thumb" loading="lazy" />
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{s.icon}</span>
                    <h3 className="text-xl font-bold">{s.title}</h3>
                  </div>
                  <p className="text-[color:var(--muted)] mt-3 leading-relaxed text-sm">{s.text}</p>
                  <ul className="mt-4 space-y-1.5 text-sm">
                    {s.benefits.map((b, j) => (
                      <li key={j} className="flex gap-2">
                        <span className="cyantext">✓</span>
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                  <a
                    href={`https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(
                      `Olá! Quero agendar higienização de ${s.title}.`,
                    )}`}
                    onClick={() => track("whatsapp_click", { location: "service_card", service: s.title })}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-cyan mt-6 !py-3 !text-sm w-full"
                  >
                    Agendar →
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SOBRE / DIFERENCIAIS */}
        <section id="porque" className="container py-24 grid lg:grid-cols-2 gap-16 items-center">
          <div className="reveal frame">
            <img
              src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=900&q=80"
              alt="Equipe profissional de higienização"
              className="w-full h-[520px] object-cover"
              loading="lazy"
            />
          </div>
          <div className="reveal">
            <div className="kicker mb-6">Por que a Siqueira</div>
            <h2 className="display text-5xl md:text-6xl">
              Higiene séria,
              <br />
              resultado visível.
            </h2>
            <p className="text-[color:var(--muted)] text-lg mt-6 leading-relaxed">{siteConfig.aboutText}</p>
            <div className="grid sm:grid-cols-2 gap-3 mt-8">
              {siteConfig.differentials.map((d, i) => (
                <div className="flex gap-3" key={i}>
                  <span className="cyantext text-xl">✓</span>
                  <span className="font-medium text-sm leading-snug">{d}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* COMO FUNCIONA */}
        <section id="como" className="container py-24">
          <div className="reveal max-w-2xl mx-auto text-center">
            <div className="kicker mb-6">Sem complicação</div>
            <h2 className="display text-5xl md:text-6xl">Resolvido em 3 passos.</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-5 mt-14">
            {siteConfig.steps.map((s, i) => (
              <div className="reveal card p-8 hover-lift" key={i}>
                <div className="display grad text-5xl">{s.number}</div>
                <h3 className="text-2xl font-bold mt-3">{s.title}</h3>
                <p className="text-[color:var(--muted)] mt-2 leading-relaxed">{s.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* GALERIA ANTES/DEPOIS */}
        <section id="galeria" className="container py-24">
          <div className="reveal max-w-2xl">
            <div className="kicker mb-6">Antes / Depois</div>
            <h2 className="display text-5xl md:text-6xl">A diferença que dá pra ver.</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-5 mt-14">
            {siteConfig.gallery.map((g, i) => (
              <div className="reveal" key={i}>
                <BeforeAfterSlider before={g.before} after={g.after} label={g.label} />
              </div>
            ))}
          </div>
          <p className="text-center text-sm text-[color:var(--muted)] mt-6">
            👆 Arraste a barra para revelar a transformação
          </p>

        </section>

        {/* VÍDEOS DE TRABALHOS REAIS — full width */}
        <section className="py-20" style={{ background: "linear-gradient(180deg,#ECFEFF 0%,#FFFFFF 100%)" }}>
          <div className="container">
            <div className="reveal text-center max-w-2xl mx-auto mb-10">
              <div className="kicker mb-4">Trabalhos reais</div>
              <h3 className="display text-4xl md:text-5xl">Veja a higienização acontecendo.</h3>
              <p className="text-[color:var(--muted)] mt-3 text-sm md:text-base">
                Vídeos gravados em atendimentos reais em São Luís. Clique para ampliar.
              </p>
            </div>
          </div>
          <div className="w-full px-3 md:px-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-3 md:gap-4">
              {workVideos.map((v, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    setActiveVideo(v.url);
                    track("video_open", { location: "trabalhos_reais", index: i });
                  }}
                  className="reveal group relative overflow-hidden rounded-2xl bg-black aspect-[9/16] border border-[color:var(--line)] shadow-sm hover:shadow-2xl transition-all hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-[color:var(--cyan)]"
                  aria-label={`Ampliar vídeo ${i + 1}`}
                >
                  <video
                    src={v.url}
                    className="w-full h-full object-cover"
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="metadata"
                  />
                  <span
                    className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/30 transition-colors"
                    aria-hidden
                  >
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity w-14 h-14 rounded-full bg-white/95 flex items-center justify-center shadow-xl">
                      <svg viewBox="0 0 24 24" className="w-6 h-6 text-[color:var(--cyan2)] ml-0.5" fill="currentColor">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </span>
                  </span>
                </button>
              ))}
            </div>
          </div>
        </section>



        {/* AVALIAÇÕES */}
        <section id="avaliacoes" className="container py-24">
          <div className="reveal max-w-2xl">
            <div className="kicker mb-6">Clientes satisfeitos</div>
            <h2 className="display text-5xl md:text-6xl">Quem contrata, indica.</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-5 mt-14">
            {siteConfig.testimonials.map((t, i) => (
              <div className="reveal card p-7 hover-lift" key={i}>
                <div className="cyantext text-sm mb-3">★★★★★</div>
                <p className="leading-relaxed">“{t.text}”</p>
                <div className="flex items-center gap-3 mt-6">
                  <img src={t.avatar} alt={t.name} className="w-11 h-11 rounded-full object-cover" loading="lazy" />
                  <div>
                    <div className="font-semibold">{t.name}</div>
                    <div className="text-xs text-[color:var(--muted)]">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CONTATO + FORMULÁRIO */}
        <section id="contato" className="container py-24">
          <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_.9fr] gap-10 items-start">
            <div className="reveal">
              <div className="kicker mb-6">Fale com a gente</div>
              <h2 className="display text-5xl md:text-6xl">
                Orçamento <span className="grad">grátis</span> e sem compromisso.
              </h2>
              <p className="text-[color:var(--muted)] mt-5 max-w-lg leading-relaxed text-lg">
                Preencha o formulário ao lado e nós já abrimos o WhatsApp com seus dados prontos.
                Se preferir, chame direto:
              </p>
              <div className="flex flex-col sm:flex-row gap-3 mt-8">
                <a href={whatsappLink} onClick={() => track("whatsapp_click", { location: "cta_section", cta: "orcamento" })} className="btn btn-wa" target="_blank" rel="noopener noreferrer">Pedir orçamento →</a>
                <a href="/agendar" onClick={() => track("agendar_click", { location: "cta_section" })} className="btn btn-cyan">Agendar online</a>
              </div>
              <ul className="mt-10 space-y-3 text-sm">
                <li className="flex gap-3"><span className="cyantext">📱</span> {siteConfig.phoneDisplay}</li>
                <li className="flex gap-3"><span className="cyantext">✉️</span> {siteConfig.email}</li>
                <li className="flex gap-3"><span className="cyantext">📍</span> {siteConfig.city}/{siteConfig.state} · {siteConfig.businessHours}</li>
              </ul>
            </div>
            <div className="reveal card hover-lift p-7 md:p-9">
              <ContactForm />
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="container py-24 max-w-3xl">
          <h2 className="reveal display text-5xl md:text-6xl mb-10 text-center">Perguntas frequentes</h2>
          <div className="reveal">
            {siteConfig.faq.map((f, i) => (
              <details className="faq" key={i}>
                <summary>
                  {f.question} <span className="pl">+</span>
                </summary>
                <p className="pb-5 text-[color:var(--muted)] leading-relaxed">{f.answer}</p>
              </details>
            ))}
          </div>
        </section>

        {/* FOOTER */}
        <footer className="border-t border-[color:var(--line)] mt-10" style={{ background: "#fff" }}>
          <div className="container py-16 grid md:grid-cols-4 gap-10">
            <div className="md:col-span-2">
              <div className="flex items-center gap-3">
                <span className="mark"><img src={logoAsset.url} alt={`Logo ${siteConfig.brandName}`} /></span>
                <span className="display text-xl">{siteConfig.brandName}</span>
              </div>
              <p className="text-[color:var(--muted)] mt-4 max-w-sm leading-relaxed text-sm">
                Higienização profissional de sofás, colchões, tapetes, cadeiras, poltronas e veículos em {siteConfig.city}/{siteConfig.state}.
              </p>
              <div className="flex gap-3 mt-5">
                <a href={whatsappLink} onClick={() => track("whatsapp_click", { location: "footer" })} className="btn btn-wa !py-2.5 !px-4 !text-sm" target="_blank" rel="noopener noreferrer">WhatsApp</a>
                <a
                  href={siteConfig.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center rounded-lg font-semibold text-white !py-2.5 !px-4 !text-sm transition-transform hover:-translate-y-0.5"
                  style={{ background: "linear-gradient(135deg,#F58529 0%,#DD2A7B 45%,#8134AF 80%,#515BD4 100%)", boxShadow: "0 8px 20px rgba(221,42,123,.35)" }}
                >
                  Instagram
                </a>
              </div>
            </div>

            <div>
              <h4 className="font-bold text-sm uppercase tracking-wider text-[color:var(--muted)]">Contato</h4>
              <ul className="mt-4 space-y-2 text-sm">
                <li>
                  <a href={whatsappLink} className="hover:cyantext" target="_blank" rel="noopener noreferrer">📱 {siteConfig.phoneDisplay}</a>
                </li>
                <li>
                  <a href={`mailto:${siteConfig.email}`} className="break-all">✉️ {siteConfig.email}</a>
                </li>
                <li>
                  <a
                    href={siteConfig.instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    📷 @{siteConfig.instagram}
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-sm uppercase tracking-wider text-[color:var(--muted)]">Atendimento</h4>
              <ul className="mt-4 space-y-2 text-sm">
                <li>📍 {siteConfig.city}/{siteConfig.state}</li>
                <li>🏠 Atendimento em domicílio</li>
                <li>🕒 {siteConfig.businessHours}</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-[color:var(--line)]">
            <div className="container py-5 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-[color:var(--muted)]">
              <div>© {new Date().getFullYear()} {siteConfig.brandName}. Todos os direitos reservados.</div>
              
            </div>
          </div>
        </footer>



        {activeVideo && (
          <div
            className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 animate-in fade-in duration-200"
            onClick={() => setActiveVideo(null)}
            role="dialog"
            aria-modal="true"
          >
            <button
              type="button"
              onClick={() => setActiveVideo(null)}
              aria-label="Fechar vídeo"
              className="absolute top-4 right-4 md:top-6 md:right-6 w-11 h-11 rounded-full bg-white/95 hover:bg-white text-slate-900 flex items-center justify-center text-2xl font-bold shadow-xl transition"
            >
              ×
            </button>
            <video
              key={activeVideo}
              src={activeVideo}
              className="max-w-full max-h-[90vh] w-auto h-auto rounded-2xl shadow-2xl"
              controls
              autoPlay
              playsInline
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        )}
      </div>
    </>
  );
}
