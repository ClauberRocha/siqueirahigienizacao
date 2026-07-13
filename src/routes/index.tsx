import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import heroAirImage from "@/assets/hero-ar-condicionado-instalado.jpg";
import { siteConfig, whatsappLink } from "@/lib/site-config";

const CSS = `@import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&family=Space+Grotesk:wght@500;600;700&display=swap');

  :root{--bg:#f1f7fb;--bg2:#e3eff7;--ink:#0e2433;--muted:#577488;--blue:#1f8fe0;--blue2:#1166ad;--cyan:#22c3e6;--line:#d6e6f0}
  *{box-sizing:border-box}html{scroll-behavior:smooth}
  body{margin:0;background:var(--bg);color:var(--ink);font-family:"Sora",sans-serif;overflow-x:hidden}
  .display{font-family:"Space Grotesk",sans-serif;font-weight:700;line-height:1;letter-spacing:-.02em}
  .container{max-width:1180px;margin:0 auto;padding-left:26px;padding-right:26px}
  .cine{position:fixed;inset:0;z-index:0;overflow:hidden;background:var(--bg);transform:translateZ(0)}
  .cine .l{position:absolute;inset:-25%;filter:blur(72px);opacity:.5;will-change:transform}
  .l1{background:radial-gradient(38% 38% at 22% 20%,rgba(34,195,230,.22),transparent 70%);animation:d1 26s ease-in-out infinite}
  .l2{background:radial-gradient(42% 42% at 80% 30%,rgba(31,143,224,.2),transparent 70%);animation:d2 30s ease-in-out infinite}
  @keyframes d1{0%,100%{transform:translate(0,0) scale(1)}50%{transform:translate(6%,5%) scale(1.12)}}
  @keyframes d2{0%,100%{transform:translate(0,0) scale(1.1)}50%{transform:translate(-7%,4%) scale(1)}}
  .wrap{position:relative;z-index:2}
  .bluetext{color:var(--blue)}
  .grad{background:linear-gradient(100deg,var(--cyan),var(--blue));-webkit-background-clip:text;background-clip:text;color:transparent}
  .kicker{display:inline-flex;align-items:center;gap:9px;font-size:11px;letter-spacing:.2em;text-transform:uppercase;color:var(--blue2);border:1px solid rgba(31,143,224,.3);background:rgba(31,143,224,.07);padding:8px 15px;border-radius:999px}
  .btn{display:inline-flex;align-items:center;justify-content:center;gap:10px;font-weight:700;border-radius:13px;padding:16px 28px;text-decoration:none;transition:transform .25s,box-shadow .25s;font-size:15px}
  .btn-wa{background:linear-gradient(135deg,#25D366,#128C7E);color:#fff;box-shadow:0 16px 40px rgba(37,211,102,.3)}
  .btn-wa:hover{transform:translateY(-2px)}
  .btn-blue{background:linear-gradient(180deg,var(--blue),var(--blue2));color:#fff;box-shadow:0 16px 40px rgba(31,143,224,.3)}
  .btn-blue:hover{transform:translateY(-2px)}
  .btn-ghost{border:1px solid rgba(14,36,51,.18);color:var(--ink)}.btn-ghost:hover{background:rgba(14,36,51,.04)}
  .reveal{opacity:1}.reveal.in{animation:rin .7s cubic-bezier(.16,1,.3,1) both}@keyframes rin{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:none}}
  .card{background:#fff;border:1px solid var(--line);border-radius:18px;box-shadow:0 10px 34px rgba(14,36,51,.05)}
  .hair{height:1px;background:linear-gradient(90deg,transparent,rgba(31,143,224,.4),transparent)}
  .frame{border-radius:22px;overflow:hidden;position:relative;box-shadow:0 40px 90px rgba(11,60,90,.2)}
  .navwrap{position:fixed;top:14px;left:0;right:0;z-index:40;transition:.3s}
  .navwrap.s{top:9px}
  .navwrap>div{background:color-mix(in srgb,var(--bg) 62%,transparent);-webkit-backdrop-filter:saturate(1.6) blur(18px);backdrop-filter:saturate(1.6) blur(18px);border:1px solid color-mix(in srgb,var(--ink) 11%,transparent);border-radius:18px;box-shadow:0 10px 30px rgba(11,60,90,.08),inset 0 1px 0 rgba(255,255,255,.55);transition:.3s}
  .navwrap.s>div{background:color-mix(in srgb,var(--bg) 84%,transparent)}
  .mark{width:34px;height:34px;border-radius:10px;background:linear-gradient(135deg,var(--cyan),var(--blue2));display:flex;align-items:center;justify-content:center;color:#fff;font-weight:700;font-family:"Space Grotesk",sans-serif}
  details.faq{border-bottom:1px solid var(--line)}
  details.faq summary{list-style:none;cursor:pointer;padding:20px 4px;display:flex;justify-content:space-between;gap:16px;align-items:center;font-weight:600;font-size:17px}
  details.faq summary::-webkit-details-marker{display:none}
  details.faq[open] .pl{transform:rotate(45deg)} .pl{transition:.3s;color:var(--blue);font-size:24px;font-weight:700}
  .field{width:100%;background:#fff;border:1px solid var(--line);border-radius:12px;padding:14px 16px;color:var(--ink);outline:none;font-size:15px}.field:focus{border-color:var(--blue)}
  .wa{position:fixed;right:20px;bottom:20px;z-index:45;display:flex;align-items:center;gap:10px;padding:13px 18px 13px 14px;border-radius:999px;background:linear-gradient(135deg,#25D366,#128C7E);color:#fff;font-weight:700;font-size:14px;text-decoration:none;box-shadow:0 16px 40px rgba(37,211,102,.45)}
  .wa .ic{width:24px;height:24px;display:flex;align-items:center;justify-content:center}
  .wa::before{content:"";position:absolute;left:14px;top:50%;transform:translateY(-50%);width:24px;height:24px;border-radius:50%;background:rgba(255,255,255,.5);animation:pr 2s infinite}
  @keyframes pr{0%{transform:translateY(-50%) scale(.6);opacity:.7}70%,100%{transform:translateY(-50%) scale(1.8);opacity:0}}
  @media (prefers-reduced-motion:reduce){.l1,.l2,.wa::before{animation:none}.reveal.in{animation:none}}
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
      { threshold: 0.12 }
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

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className="cine">
        <div className="l l1" />
        <div className="l l2" />
      </div>

      <div className="wrap">
        <nav className="navwrap" id="nav">
          <div className="container flex items-center justify-between h-[64px] px-5">
            <a href="#topo" className="flex items-center gap-3">
              <span className="mark">{siteConfig.logoLetter}</span>
              <span className="display text-xl">{siteConfig.brandName}</span>
            </a>
            <div className="hidden md:flex items-center gap-7 text-sm text-[color:var(--muted)]">
              <a href="#servicos" className="hover:text-[color:var(--ink)] transition">Serviços</a>
              <a href="#porque" className="hover:text-[color:var(--ink)] transition">Por que nós</a>
              <a href="#como" className="hover:text-[color:var(--ink)] transition">Como funciona</a>
              <a href="#avaliacoes" className="hover:text-[color:var(--ink)] transition">Avaliações</a>
              <a href="#faq" className="hover:text-[color:var(--ink)] transition">FAQ</a>
            </div>
            <a href={whatsappLink} className="btn btn-wa !py-2.5 !px-5 !text-sm">Orçamento grátis</a>
          </div>
        </nav>

        <header id="topo" className="container pt-36 pb-20 md:pt-44 md:pb-28 grid lg:grid-cols-[1.05fr_.95fr] gap-14 items-center">
          <div>
            <div className="reveal kicker">{siteConfig.hero.kicker}</div>
            <h1 className="reveal display text-6xl md:text-7xl mt-7">
              {siteConfig.hero.title}
              <br />
              <span className="grad">{siteConfig.hero.titleHighlight}</span>.
            </h1>
            <p className="reveal text-lg md:text-xl text-[color:var(--muted)] max-w-xl mt-7 leading-relaxed">
              {siteConfig.hero.subtitle}
            </p>
            <div className="reveal flex flex-col sm:flex-row gap-4 mt-10">
              <a href={whatsappLink} className="btn btn-wa">{siteConfig.hero.ctaPrimary}</a>
              <a href="#servicos" className="btn btn-ghost">{siteConfig.hero.ctaSecondary}</a>
            </div>
            <div className="reveal flex items-center gap-4 mt-10">
              <div className="flex -space-x-3">
                <img src="https://i.pravatar.cc/80?img=12" className="w-10 h-10 rounded-full border-2 object-cover" style={{ borderColor: "var(--bg)" }} alt="" />
                <img src="https://i.pravatar.cc/80?img=33" className="w-10 h-10 rounded-full border-2 object-cover" style={{ borderColor: "var(--bg)" }} alt="" />
                <img src="https://i.pravatar.cc/80?img=8" className="w-10 h-10 rounded-full border-2 object-cover" style={{ borderColor: "var(--bg)" }} alt="" />
              </div>
              <div>
                <div className="bluetext text-sm">★★★★★</div>
                <div className="text-xs text-[color:var(--muted)]">+4.000 atendimentos · nota {siteConfig.stats.nota.replace(" ⭐", "")} no Google</div>
              </div>
            </div>
          </div>
          <div className="reveal frame">
            <img src={heroAirImage} alt="Ar-condicionado split instalado" className="w-full h-[540px] object-cover" />
          </div>
        </header>

        <section className="border-y border-[color:var(--line)]" style={{ background: "#fff" }}>
          <div className="container py-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center text-sm">
            <div className="reveal">
              <div className="display bluetext text-4xl">{siteConfig.stats.atendimentos}</div>
              <div className="text-[color:var(--muted)] mt-1">atendimentos</div>
            </div>
            <div className="reveal">
              <div className="display bluetext text-4xl">{siteConfig.stats.nota}</div>
              <div className="text-[color:var(--muted)] mt-1">no Google</div>
            </div>
            <div className="reveal">
              <div className="display bluetext text-4xl">{siteConfig.stats.garantia}</div>
              <div className="text-[color:var(--muted)] mt-1">de garantia no serviço</div>
            </div>
            <div className="reveal">
              <div className="display bluetext text-4xl">{siteConfig.stats.atendimento}</div>
              <div className="text-[color:var(--muted)] mt-1">atendimento rápido</div>
            </div>
          </div>
        </section>

        <section className="container py-24">
          <div className="reveal max-w-2xl">
            <div className="kicker mb-6">Reconhece?</div>
            <h2 className="display text-5xl md:text-6xl">Calor demais, conforto de menos.</h2>
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

        <section id="servicos" className="container py-24">
          <div className="reveal max-w-2xl">
            <div className="kicker mb-6">O que fazemos</div>
            <h2 className="display text-5xl md:text-6xl">Climatização completa.</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-5 mt-14">
            {siteConfig.services.map((s, i) => (
              <div className="reveal card p-8" key={i}>
                <h3 className="text-2xl font-bold">{s.title}</h3>
                <p className="text-[color:var(--muted)] mt-3 leading-relaxed">{s.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="porque" className="container py-24 grid lg:grid-cols-2 gap-16 items-center">
          <div className="reveal frame">
            <img src="https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800&q=80" alt="Técnico trabalhando em ar-condicionado" className="w-full h-[520px] object-cover" />
          </div>
          <div className="reveal">
            <div className="kicker mb-6">Por que com a gente</div>
            <h2 className="display text-5xl md:text-6xl">
              Serviço sério,
              <br />
              com garantia.
            </h2>
            <p className="text-[color:var(--muted)] text-lg mt-6 leading-relaxed">{siteConfig.aboutText}</p>
            <div className="space-y-4 mt-8">
              {siteConfig.differentials.map((d, i) => (
                <div className="flex gap-3" key={i}>
                  <span className="bluetext text-xl">✓</span>
                  <div>
                    <span className="font-semibold">{d}</span>{" "}
                    {i === 0 && "— sem surpresa no final."}
                    {i === 1 && "— você fica tranquilo."}
                    {i === 2 && "— muitas vezes no mesmo dia."}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

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

        <section id="avaliacoes" className="container py-24">
          <div className="reveal max-w-2xl">
            <div className="kicker mb-6">Clientes satisfeitos</div>
            <h2 className="display text-5xl md:text-6xl">Quem chama, recomenda.</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-5 mt-14">
            {siteConfig.testimonials.map((t, i) => (
              <div className="reveal card p-7" key={i}>
                <div className="bluetext text-sm mb-3">★★★★★</div>
                <p className="leading-relaxed">“{t.text}”</p>
                <div className="flex items-center gap-3 mt-6">
                  <img src={t.avatar} alt={t.name} className="w-11 h-11 rounded-full object-cover" />
                  <div>
                    <div className="font-semibold">{t.name}</div>
                    <div className="text-xs text-[color:var(--muted)]">Cliente · Google ✓</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="container py-24">
          <div className="reveal card p-10 md:p-16 max-w-3xl mx-auto text-center relative overflow-hidden">
            <div className="kicker mb-6 mx-auto">Condição especial</div>
            <h2 className="display text-4xl md:text-5xl">
              Orçamento <span className="grad">grátis</span> e sem compromisso.
            </h2>
            <p className="text-[color:var(--muted)] mt-5 max-w-md mx-auto">
              Manda uma mensagem com o que precisa e a gente já te passa o valor. Atendimento rápido, muitas vezes no mesmo dia.
            </p>
            <a href={whatsappLink} className="btn btn-wa mt-8 text-lg">Pedir orçamento agora →</a>
          </div>
        </section>

        <section className="container py-12">
          <div className="reveal card p-8 flex flex-col sm:flex-row items-center gap-6 max-w-3xl mx-auto" style={{ border: "1px dashed var(--blue)" }}>
            <div className="w-16 h-16 rounded-full flex items-center justify-center shrink-0 text-3xl" style={{ background: "rgba(31,143,224,.12)" }}>
              🛡️
            </div>
            <div>
              <h3 className="text-2xl font-bold">{siteConfig.stats.garantia} de garantia</h3>
              <p className="text-[color:var(--muted)] mt-1 leading-relaxed">
                Todo serviço tem garantia. Se algo não ficar como combinado, a gente volta e resolve — sem custo extra.
              </p>
            </div>
          </div>
        </section>

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

        <section className="container py-20">
          <div className="reveal max-w-xl mx-auto text-center">
            <div className="kicker mb-6 mx-auto">Orçamento grátis</div>
            <h2 className="display text-5xl md:text-6xl">Peça o seu agora.</h2>
            <p className="text-[color:var(--muted)] mt-5">Deixe seus dados ou chame no WhatsApp com o que você precisa.</p>
          </div>
          <form className="reveal card p-7 md:p-9 max-w-xl mx-auto mt-10 space-y-4" onSubmit={(e) => e.preventDefault()}>
            <input className="field" placeholder="Seu nome" />
            <input className="field" placeholder="WhatsApp (com DDD)" />
            <textarea className="field" rows={3} placeholder="O que você precisa? (instalar, limpar, consertar...)"></textarea>
            <a href={whatsappLink} className="btn btn-wa w-full text-lg">Pedir orçamento pelo WhatsApp →</a>
          </form>
        </section>

        <footer className="border-t border-[color:var(--line)]" style={{ background: "#fff" }}>
          <div className="container py-16 grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
            <div className="lg:col-span-2">
              <div className="flex items-center gap-3">
                <span className="mark">{siteConfig.logoLetter}</span>
                <span className="display text-xl">{siteConfig.brandName}</span>
              </div>
              <p className="text-sm text-[color:var(--muted)] mt-4 max-w-sm leading-relaxed">
                Instalação, manutenção e conserto de ar-condicionado em {siteConfig.city}. Conforto térmico com garantia.
              </p>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider mb-4">Navegação</p>
              <ul className="space-y-2 text-sm text-[color:var(--muted)]">
                <li><a href="#servicos" className="hover:text-[color:var(--ink)]">Serviços</a></li>
                <li><a href="#porque" className="hover:text-[color:var(--ink)]">Por que nós</a></li>
                <li><a href="#avaliacoes" className="hover:text-[color:var(--ink)]">Avaliações</a></li>
                <li><a href="#faq" className="hover:text-[color:var(--ink)]">FAQ</a></li>
              </ul>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider mb-4">Contato</p>
              <ul className="space-y-2 text-sm text-[color:var(--muted)]">
                <li>📍 {siteConfig.city} / {siteConfig.region}</li>
                <li>📱 {siteConfig.phoneDisplay}</li>
                <li>🕒 {siteConfig.businessHours}</li>
              </ul>
            </div>
          </div>
          <div className="container pb-8">
            <div className="hair mb-6"></div>
            <div className="flex flex-col sm:flex-row justify-between gap-3 text-xs text-[color:var(--muted)]">
              <span>© 2026 {siteConfig.brandName}. Todos os direitos reservados.</span>
              <span>Política de Privacidade · Termos</span>
            </div>
          </div>
        </footer>
      </div>

      <a href={whatsappLink} className="wa" target="_blank" rel="noreferrer">
        <span className="ic">●</span>
        <span>Falar no WhatsApp</span>
      </a>
    </>
  );
}
