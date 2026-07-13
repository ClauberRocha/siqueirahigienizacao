import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import heroImage from "@/assets/hero-higienizacao-sofa.jpg";
import logoAsset from "@/assets/logo-siqueira.png.asset.json";
import { siteConfig, whatsappLink } from "@/lib/site-config";
import { track } from "@/lib/analytics";
import { ContactForm } from "@/components/ContactForm";

const CSS = `@import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&family=Space+Grotesk:wght@500;600;700&display=swap');

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
  body{margin:0;background:var(--bg);color:var(--ink);font-family:"Sora",sans-serif;overflow-x:hidden}
  .display{font-family:"Space Grotesk",sans-serif;font-weight:700;line-height:1.02;letter-spacing:-.02em}
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
  .btn{display:inline-flex;align-items:center;justify-content:center;gap:10px;font-weight:700;border-radius:13px;padding:16px 28px;text-decoration:none;transition:transform .25s,box-shadow .25s;font-size:15px;cursor:pointer;border:0}
  .btn-wa{background:linear-gradient(135deg,#25D366,#128C7E);color:#fff;box-shadow:0 16px 40px rgba(37,211,102,.3)}
  .btn-wa:hover{transform:translateY(-2px)}
  .btn-cyan{background:linear-gradient(180deg,var(--cyan),var(--cyan2));color:#fff;box-shadow:0 16px 40px rgba(6,182,212,.35)}
  .btn-cyan:hover{transform:translateY(-2px)}
  .btn-ghost{border:1px solid rgba(15,23,42,.18);color:var(--ink);background:transparent}.btn-ghost:hover{background:rgba(15,23,42,.04)}
  .reveal{opacity:1}.reveal.in{animation:rin .7s cubic-bezier(.16,1,.3,1) both}@keyframes rin{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:none}}
  .card{background:var(--white);border:1px solid var(--line);border-radius:18px;box-shadow:0 10px 34px rgba(14,116,144,.06)}
  .service-card{overflow:hidden;transition:transform .3s,box-shadow .3s}
  .service-card:hover{transform:translateY(-4px);box-shadow:0 20px 48px rgba(14,116,144,.14)}
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
  .wa{position:fixed;right:20px;bottom:20px;z-index:45;display:flex;align-items:center;gap:10px;padding:13px 18px 13px 14px;border-radius:999px;background:linear-gradient(135deg,#25D366,#128C7E);color:#fff;font-weight:700;font-size:14px;text-decoration:none;box-shadow:0 16px 40px rgba(37,211,102,.45)}
  .ba{position:relative;border-radius:16px;overflow:hidden;aspect-ratio:4/3;background:#000}
  .ba img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
  .ba .after{clip-path:inset(0 0 0 50%)}
  .ba .divider{position:absolute;top:0;bottom:0;left:50%;width:2px;background:#fff;box-shadow:0 0 12px rgba(0,0,0,.4)}
  .ba .tag{position:absolute;top:12px;padding:4px 10px;border-radius:999px;font-size:11px;font-weight:700;letter-spacing:.1em;color:#fff;background:rgba(0,0,0,.55);backdrop-filter:blur(6px)}
  .ba .tag.tl{left:12px}
  .ba .tag.tr{right:12px}
  .ba .label{position:absolute;left:12px;bottom:12px;padding:6px 12px;border-radius:999px;font-size:12px;font-weight:600;background:rgba(255,255,255,.9);color:var(--ink)}
  @media (prefers-reduced-motion:reduce){.l1,.l2{animation:none}.reveal.in{animation:none}}
`;

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: siteConfig.title },
      { name: "description", content: siteConfig.description },
      { property: "og:title", content: siteConfig.title },
      { property: "og:description", content: siteConfig.description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  useEffect(() => {
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
    };
    addEventListener("scroll", onScroll, { passive: true });
    return () => {
      io.disconnect();
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
              <a href={waAgendar} onClick={() => track("whatsapp_click", { location: "hero", cta: "agendar" })} className="btn btn-cyan" target="_blank" rel="noopener noreferrer">{siteConfig.hero.ctaSecondary}</a>
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
            <img
              src={heroImage}
              alt="Técnico higienizando sofá de tecido cinza com equipamento de extração"
              className="w-full h-[540px] object-cover"
              width={1200}
              height={1408}
            />
          </div>
        </header>

        {/* STATS */}
        <section className="border-y border-[color:var(--line)]" style={{ background: "#fff" }}>
          <div className="container py-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center text-sm">
            <div className="reveal">
              <div className="display cyantext text-4xl">{siteConfig.stats.atendimentos}</div>
              <div className="text-[color:var(--muted)] mt-1">atendimentos realizados</div>
            </div>
            <div className="reveal">
              <div className="display cyantext text-4xl">{siteConfig.stats.nota}</div>
              <div className="text-[color:var(--muted)] mt-1">satisfação dos clientes</div>
            </div>
            <div className="reveal">
              <div className="display cyantext text-4xl">{siteConfig.stats.garantia}</div>
              <div className="text-[color:var(--muted)] mt-1">garantida no serviço</div>
            </div>
            <div className="reveal">
              <div className="display cyantext text-4xl">{siteConfig.stats.atendimento}</div>
              <div className="text-[color:var(--muted)] mt-1">atendimento em domicílio</div>
            </div>
          </div>
        </section>

        {/* DORES */}
        <section className="container py-24">
          <div className="reveal max-w-2xl">
            <div className="kicker mb-6">Reconhece?</div>
            <h2 className="display text-5xl md:text-6xl">Sujeira que você não vê. Ácaros que você respira.</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-5 mt-14">
            {siteConfig.painPoints.map((p, i) => (
              <div className="reveal card p-8" key={i}>
                <div className="text-3xl mb-3">{p.icon}</div>
                <h3 className="text-xl font-bold">{p.title}</h3>
                <p className="text-[color:var(--muted)] mt-3 leading-relaxed">{p.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* PERIGOS */}
        <section id="perigos" className="container py-24">
          <div className="reveal max-w-3xl">
            <div className="kicker mb-6">Alerta de saúde</div>
            <h2 className="display text-5xl md:text-6xl">Os perigos da falta de higienização de sofás e estofados.</h2>
            <p className="text-[color:var(--muted)] text-lg mt-6 leading-relaxed">
              Estofados acumulam suor, células mortas, poeira, restos de alimentos e umidade. Sem higienização periódica, viram o ambiente perfeito para micro-organismos que afetam diretamente a saúde da sua família.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 mt-14">
            {[
              { icon: "🦠", title: "Ácaros e alergias", text: "Um sofá pode abrigar milhões de ácaros, principal causa de rinite, asma, coceira nos olhos e crises alérgicas — sobretudo em crianças." },
              { icon: "🫁", title: "Problemas respiratórios", text: "Poeira, fungos e esporos ficam presos no tecido e voltam ao ar a cada vez que alguém senta, agravando bronquite, sinusite e tosse crônica." },
              { icon: "🍄", title: "Fungos e mofo", text: "Umidade de suor, bebidas e limpezas caseiras mal feitas criam mofo interno no estofado, com cheiro característico e risco de infecções de pele." },
              { icon: "🐛", title: "Bactérias e maus odores", text: "E. coli, salmonela e outras bactérias se multiplicam em restos orgânicos invisíveis, causando aquele odor persistente que perfume nenhum resolve." },
              { icon: "🐜", title: "Pulgas, percevejos e traças", text: "Estofados sem manutenção viram abrigo para insetos que picam, contaminam e se espalham para camas, tapetes e roupas de cama." },
              { icon: "⚠️", title: "Desgaste precoce", text: "Sujeira acumulada corrói fibras e espuma, mancha permanentemente o tecido e reduz pela metade a vida útil do seu estofado." },
            ].map((p, i) => (
              <div className="reveal card p-8" key={i}>
                <div className="text-3xl mb-3">{p.icon}</div>
                <h3 className="text-xl font-bold">{p.title}</h3>
                <p className="text-[color:var(--muted)] mt-3 leading-relaxed text-sm">{p.text}</p>
              </div>
            ))}
          </div>
          <div className="reveal card mt-10 p-8 md:p-10 flex flex-col md:flex-row items-start md:items-center gap-6 justify-between">
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
              <div className="reveal card service-card flex flex-col" key={i}>
                <img src={s.image} alt={s.title} className="thumb" loading="lazy" />
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
              <div className="reveal card p-8" key={i}>
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
              <div className="reveal ba" key={i}>
                <img src={g.before} alt={`Antes — ${g.label}`} loading="lazy" />
                <img className="after" src={g.after} alt={`Depois — ${g.label}`} loading="lazy" />
                <div className="divider" />
                <span className="tag tl">ANTES</span>
                <span className="tag tr">DEPOIS</span>
                <span className="label">{g.label}</span>
              </div>
            ))}
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
              <div className="reveal card p-7" key={i}>
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
          <div className="grid lg:grid-cols-[1.1fr_.9fr] gap-10 items-start">
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
                <a href={waAgendar} onClick={() => track("whatsapp_click", { location: "cta_section", cta: "agendar" })} className="btn btn-cyan" target="_blank" rel="noopener noreferrer">Agendar visita</a>
              </div>
              <ul className="mt-10 space-y-3 text-sm">
                <li className="flex gap-3"><span className="cyantext">📱</span> {siteConfig.phoneDisplay}</li>
                <li className="flex gap-3"><span className="cyantext">✉️</span> {siteConfig.email}</li>
                <li className="flex gap-3"><span className="cyantext">📍</span> {siteConfig.city}/{siteConfig.state} · {siteConfig.businessHours}</li>
              </ul>
            </div>
            <div className="reveal card p-7 md:p-9">
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
                  rel="noreferrer"
                  className="btn btn-ghost !py-2.5 !px-4 !text-sm"
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
                    rel="noreferrer"
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
              <div>Feito com 💧 em {siteConfig.city}/{siteConfig.state}</div>
            </div>
          </div>
        </footer>

        {/* WhatsApp flutuante */}
        <a href={whatsappLink} onClick={() => track("whatsapp_click", { location: "floating" })} className="wa" aria-label="Fale no WhatsApp" target="_blank" rel="noopener noreferrer">
          <span className="ic">💬</span>
          WhatsApp
        </a>
      </div>
    </>
  );
}
