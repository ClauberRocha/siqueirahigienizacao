import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import heroAirImage from "@/assets/hero-ar-condicionado-instalado.jpg";
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
const BODY = `
<!--
  ╔══════════════════════════════════════════════════════════════╗
  ║  CONFIG — EDITE AQUI. [colchetes], fotos, WhatsApp, cores      ║
  ║  no :root (--blue, --bg). Nicho: AR-CONDICIONADO / CLIMATIZAÇÃO║
  ╚══════════════════════════════════════════════════════════════╝
-->
<div class="cine"><div class="l l1"></div><div class="l l2"></div></div>

<div class="wrap">
  <nav class="navwrap" id="nav"><div class="container flex items-center justify-between h-[64px] px-5">
    <a href="#topo" class="flex items-center gap-3"><span class="mark">A</span><span class="display text-xl">[Sua Empresa]</span></a>
    <div class="hidden md:flex items-center gap-7 text-sm text-[color:var(--muted)]">
      <a href="#servicos" class="hover:text-[color:var(--ink)] transition">Serviços</a>
      <a href="#porque" class="hover:text-[color:var(--ink)] transition">Por que nós</a>
      <a href="#como" class="hover:text-[color:var(--ink)] transition">Como funciona</a>
      <a href="#avaliacoes" class="hover:text-[color:var(--ink)] transition">Avaliações</a>
      <a href="#faq" class="hover:text-[color:var(--ink)] transition">FAQ</a>
    </div>
    <a href="https://wa.me/5511900000000" class="btn btn-wa !py-2.5 !px-5 !text-sm">Orçamento grátis</a>
  </div></nav>

  <header id="topo" class="container pt-36 pb-20 md:pt-44 md:pb-28 grid lg:grid-cols-[1.05fr_.95fr] gap-14 items-center">
    <div>
      <div class="reveal kicker">❄️ Orçamento grátis · atendimento no mesmo dia</div>
      <h1 class="reveal display text-6xl md:text-7xl mt-7">Climatize com<br>quem <span class="grad">entende</span>.</h1>
      <p class="reveal text-lg md:text-xl text-[color:var(--muted)] max-w-xl mt-7 leading-relaxed">[Diga o que sua empresa faz e pra quem.] Instalação, manutenção e conserto de ar-condicionado com técnicos qualificados, peças de qualidade e garantia. Conforto térmico sem dor de cabeça — pra sua casa ou empresa.</p>
      <div class="reveal flex flex-col sm:flex-row gap-4 mt-10"><a href="https://wa.me/5511900000000" class="btn btn-wa">Pedir orçamento grátis →</a><a href="#servicos" class="btn btn-ghost">Ver serviços</a></div>
      <div class="reveal flex items-center gap-4 mt-10">
        <div class="flex -space-x-3">
          <img src="https://i.pravatar.cc/80?img=12" class="w-10 h-10 rounded-full border-2 object-cover" style="border-color:var(--bg)">
          <img src="https://i.pravatar.cc/80?img=33" class="w-10 h-10 rounded-full border-2 object-cover" style="border-color:var(--bg)">
          <img src="https://i.pravatar.cc/80?img=8" class="w-10 h-10 rounded-full border-2 object-cover" style="border-color:var(--bg)">
        </div>
        <div><div class="bluetext text-sm">★★★★★</div><div class="text-xs text-[color:var(--muted)]">+4.000 atendimentos · nota 4,9 no Google</div></div>
      </div>
    </div>
    <div class="reveal frame"><img src="${heroAirImage}" alt="Ar-condicionado split instalado" class="w-full h-[540px] object-cover"></div>
  </header>

  <section class="border-y border-[color:var(--line)]" style="background:#fff"><div class="container py-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center text-sm">
    <div class="reveal"><div class="display bluetext text-4xl">+4 mil</div><div class="text-[color:var(--muted)] mt-1">atendimentos</div></div>
    <div class="reveal"><div class="display bluetext text-4xl">4,9 ⭐</div><div class="text-[color:var(--muted)] mt-1">no Google</div></div>
    <div class="reveal"><div class="display bluetext text-4xl">90 dias</div><div class="text-[color:var(--muted)] mt-1">de garantia no serviço</div></div>
    <div class="reveal"><div class="display bluetext text-4xl">Mesmo dia</div><div class="text-[color:var(--muted)] mt-1">atendimento rápido</div></div>
  </div></section>

  <section class="container py-24">
    <div class="reveal max-w-2xl"><div class="kicker mb-6">Reconhece?</div><h2 class="display text-5xl md:text-6xl">Calor demais, conforto de menos.</h2></div>
    <div class="grid md:grid-cols-3 gap-5 mt-14">
      <div class="reveal card p-8"><div class="text-3xl mb-3">🥵</div><h3 class="text-xl font-bold">Ambiente abafado</h3><p class="text-[color:var(--muted)] mt-3 leading-relaxed">Casa ou empresa quente, noites mal dormidas. A gente resolve com o equipamento certo.</p></div>
      <div class="reveal card p-8"><div class="text-3xl mb-3">💧</div><h3 class="text-xl font-bold">Aparelho pingando / fraco</h3><p class="text-[color:var(--muted)] mt-3 leading-relaxed">Sujeira e falta de manutenção fazem gelar menos e gastar mais. A limpeza muda tudo.</p></div>
      <div class="reveal card p-8"><div class="text-3xl mb-3">🧰</div><h3 class="text-xl font-bold">Técnico que some</h3><p class="text-[color:var(--muted)] mt-3 leading-relaxed">Profissionais que somem e não dão garantia. Aqui é compromisso e pós-serviço de verdade.</p></div>
    </div>
  </section>

  <section id="servicos" class="container py-24">
    <div class="reveal max-w-2xl"><div class="kicker mb-6">O que fazemos</div><h2 class="display text-5xl md:text-6xl">Climatização completa.</h2></div>
    <div class="grid md:grid-cols-3 gap-5 mt-14">
      <div class="reveal card p-8"><h3 class="text-2xl font-bold">Instalação</h3><p class="text-[color:var(--muted)] mt-3 leading-relaxed">Split, multi split e cassete instalados com segurança e acabamento impecável.</p></div>
      <div class="reveal card p-8"><h3 class="text-2xl font-bold">Manutenção & limpeza</h3><p class="text-[color:var(--muted)] mt-3 leading-relaxed">Higienização que faz gelar mais, gastar menos e tirar fungos e mau cheiro.</p></div>
      <div class="reveal card p-8"><h3 class="text-2xl font-bold">Conserto</h3><p class="text-[color:var(--muted)] mt-3 leading-relaxed">Não gela? Faz barulho? Diagnóstico rápido e reparo com peças de qualidade.</p></div>
      <div class="reveal card p-8"><h3 class="text-2xl font-bold">Recarga de gás</h3><p class="text-[color:var(--muted)] mt-3 leading-relaxed">Carga correta pro seu aparelho voltar a gelar como novo.</p></div>
      <div class="reveal card p-8"><h3 class="text-2xl font-bold">PMOC pra empresas</h3><p class="text-[color:var(--muted)] mt-3 leading-relaxed">Plano de manutenção dentro da norma pra empresas e estabelecimentos.</p></div>
      <div class="reveal card p-8"><h3 class="text-2xl font-bold">Projetos</h3><p class="text-[color:var(--muted)] mt-3 leading-relaxed">Dimensionamento e projeto de climatização pro seu espaço, do residencial ao comercial.</p></div>
    </div>
  </section>

  <section id="porque" class="container py-24 grid lg:grid-cols-2 gap-16 items-center">
    <div class="reveal frame"><img src="https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800&q=80" alt="" class="w-full h-[520px] object-cover"></div>
    <div class="reveal">
      <div class="kicker mb-6">Por que com a gente</div>
      <h2 class="display text-5xl md:text-6xl">Serviço sério,<br>com garantia.</h2>
      <p class="text-[color:var(--muted)] text-lg mt-6 leading-relaxed">[Fale da empresa: anos de experiência, equipe, certificações.] Técnicos qualificados, orçamento transparente, peças de qualidade e garantia no serviço. A gente faz certo da primeira vez — e fica disponível depois.</p>
      <div class="space-y-4 mt-8">
        <div class="flex gap-3"><span class="bluetext text-xl">✓</span><div><span class="font-semibold">Orçamento grátis e transparente</span> — sem surpresa no final.</div></div>
        <div class="flex gap-3"><span class="bluetext text-xl">✓</span><div><span class="font-semibold">Garantia no serviço</span> — você fica tranquilo.</div></div>
        <div class="flex gap-3"><span class="bluetext text-xl">✓</span><div><span class="font-semibold">Atendimento rápido</span> — muitas vezes no mesmo dia.</div></div>
      </div>
    </div>
  </section>

  <section id="como" class="container py-24">
    <div class="reveal max-w-2xl mx-auto text-center"><div class="kicker mb-6">Sem complicação</div><h2 class="display text-5xl md:text-6xl">Resolvido em 3 passos.</h2></div>
    <div class="grid md:grid-cols-3 gap-5 mt-14">
      <div class="reveal card p-8"><div class="display grad text-5xl">01</div><h3 class="text-2xl font-bold mt-3">Chama no zap</h3><p class="text-[color:var(--muted)] mt-2 leading-relaxed">Conta o que precisa (instalar, limpar ou consertar) e a gente já te passa o orçamento.</p></div>
      <div class="reveal card p-8"><div class="display grad text-5xl">02</div><h3 class="text-2xl font-bold mt-3">Agendamos a visita</h3><p class="text-[color:var(--muted)] mt-2 leading-relaxed">Marcamos no melhor horário pra você, com pontualidade.</p></div>
      <div class="reveal card p-8"><div class="display grad text-5xl">03</div><h3 class="text-2xl font-bold mt-3">Conforto garantido</h3><p class="text-[color:var(--muted)] mt-2 leading-relaxed">Serviço feito com capricho, ambiente limpo e garantia. É só relaxar no fresco.</p></div>
    </div>
  </section>

  <section id="avaliacoes" class="container py-24">
    <div class="reveal max-w-2xl"><div class="kicker mb-6">Clientes satisfeitos</div><h2 class="display text-5xl md:text-6xl">Quem chama, recomenda.</h2></div>
    <div class="grid md:grid-cols-3 gap-5 mt-14">
      <div class="reveal card p-7"><div class="bluetext text-sm mb-3">★★★★★</div><p class="leading-relaxed">"Instalaram meu split no mesmo dia, super organizados e limparam tudo no final. Gela demais agora!"</p><div class="flex items-center gap-3 mt-6"><img src="https://i.pravatar.cc/80?img=52" class="w-11 h-11 rounded-full object-cover"><div><div class="font-semibold">Camila S.</div><div class="text-xs text-[color:var(--muted)]">Cliente · Google ✓</div></div></div></div>
      <div class="reveal card p-7"><div class="bluetext text-sm mb-3">★★★★★</div><p class="leading-relaxed">"Meu ar não gelava e o técnico achou o problema na hora. Preço justo e com garantia. Recomendo!"</p><div class="flex items-center gap-3 mt-6"><img src="https://i.pravatar.cc/80?img=14" class="w-11 h-11 rounded-full object-cover"><div><div class="font-semibold">Rogério T.</div><div class="text-xs text-[color:var(--muted)]">Cliente · Google ✓</div></div></div></div>
      <div class="reveal card p-7"><div class="bluetext text-sm mb-3">★★★★★</div><p class="leading-relaxed">"Faço a limpeza com eles todo ano. Pontuais, educados e o ar fica novinho. Empresa de confiança."</p><div class="flex items-center gap-3 mt-6"><img src="https://i.pravatar.cc/80?img=49" class="w-11 h-11 rounded-full object-cover"><div><div class="font-semibold">Patrícia L.</div><div class="text-xs text-[color:var(--muted)]">Cliente · Google ✓</div></div></div></div>
    </div>
  </section>

  <section class="container py-24">
    <div class="reveal card p-10 md:p-16 max-w-3xl mx-auto text-center relative overflow-hidden">
      <div class="kicker mb-6 mx-auto">Condição especial</div>
      <h2 class="display text-4xl md:text-5xl">Orçamento <span class="grad">grátis</span> e sem compromisso.</h2>
      <p class="text-[color:var(--muted)] mt-5 max-w-md mx-auto">Manda uma mensagem com o que precisa e a gente já te passa o valor. Atendimento rápido, muitas vezes no mesmo dia.</p>
      <a href="https://wa.me/5511900000000" class="btn btn-wa mt-8 text-lg">Pedir orçamento agora →</a>
    </div>
  </section>

  <section class="container py-12"><div class="reveal card p-8 flex flex-col sm:flex-row items-center gap-6 max-w-3xl mx-auto" style="border:1px dashed var(--blue)">
    <div class="w-16 h-16 rounded-full flex items-center justify-center shrink-0 text-3xl" style="background:rgba(31,143,224,.12)">🛡️</div>
    <div><h3 class="text-2xl font-bold">90 dias de garantia</h3><p class="text-[color:var(--muted)] mt-1 leading-relaxed">Todo serviço tem garantia. Se algo não ficar como combinado, a gente volta e resolve — sem custo extra.</p></div>
  </div></section>

  <section id="faq" class="container py-24 max-w-3xl">
    <h2 class="reveal display text-5xl md:text-6xl mb-10 text-center">Perguntas frequentes</h2>
    <div class="reveal">
      <details class="faq"><summary>O orçamento é gratuito? <span class="pl">+</span></summary><p class="pb-5 text-[color:var(--muted)] leading-relaxed">Sim, o orçamento é gratuito e sem compromisso. Muitas vezes conseguimos passar o valor já pelo WhatsApp.</p></details>
      <details class="faq"><summary>De quanto em quanto tempo limpar o ar? <span class="pl">+</span></summary><p class="pb-5 text-[color:var(--muted)] leading-relaxed">Recomendamos a higienização ao menos 1x por ano (ou semestral em uso intenso) pra gelar bem e evitar fungos.</p></details>
      <details class="faq"><summary>Atendem residência e empresa? <span class="pl">+</span></summary><p class="pb-5 text-[color:var(--muted)] leading-relaxed">Sim, atendemos residências, comércios e empresas, inclusive com PMOC dentro da norma.</p></details>
      <details class="faq"><summary>Vocês vendem o aparelho também? <span class="pl">+</span></summary><p class="pb-5 text-[color:var(--muted)] leading-relaxed">[Informe.] Podemos indicar e fornecer o equipamento ideal pro seu ambiente, ou instalar o seu.</p></details>
      <details class="faq"><summary>Tem garantia? <span class="pl">+</span></summary><p class="pb-5 text-[color:var(--muted)] leading-relaxed">Sim, todo serviço tem garantia. E peças/equipamentos têm a garantia do fabricante.</p></details>
      <details class="faq"><summary>Qual a região de atendimento? <span class="pl">+</span></summary><p class="pb-5 text-[color:var(--muted)] leading-relaxed">[Cidade e região.] Em caso de dúvida sobre o seu bairro, é só perguntar no WhatsApp.</p></details>
    </div>
  </section>

  <section class="container py-20">
    <div class="reveal max-w-xl mx-auto text-center"><div class="kicker mb-6 mx-auto">Orçamento grátis</div><h2 class="display text-5xl md:text-6xl">Peça o seu agora.</h2><p class="text-[color:var(--muted)] mt-5">Deixe seus dados ou chame no WhatsApp com o que você precisa.</p></div>
    <form class="reveal card p-7 md:p-9 max-w-xl mx-auto mt-10 space-y-4" onsubmit="return false">
      <input class="field" placeholder="Seu nome">
      <input class="field" placeholder="WhatsApp (com DDD)">
      <textarea class="field" rows="3" placeholder="O que você precisa? (instalar, limpar, consertar...)"></textarea>
      <a href="https://wa.me/5511900000000" class="btn btn-wa w-full text-lg">Pedir orçamento pelo WhatsApp →</a>
    </form>
  </section>

  <footer class="border-t border-[color:var(--line)]" style="background:#fff">
    <div class="container py-16 grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
      <div class="lg:col-span-2">
        <div class="flex items-center gap-3"><span class="mark">A</span><span class="display text-xl">[Sua Empresa]</span></div>
        <p class="text-sm text-[color:var(--muted)] mt-4 max-w-sm leading-relaxed">Instalação, manutenção e conserto de ar-condicionado em [sua cidade]. Conforto térmico com garantia.</p>
      </div>
      <div>
        <p class="text-xs font-bold uppercase tracking-wider mb-4">Navegação</p>
        <ul class="space-y-2 text-sm text-[color:var(--muted)]">
          <li><a href="#servicos" class="hover:text-[color:var(--ink)]">Serviços</a></li>
          <li><a href="#porque" class="hover:text-[color:var(--ink)]">Por que nós</a></li>
          <li><a href="#avaliacoes" class="hover:text-[color:var(--ink)]">Avaliações</a></li>
          <li><a href="#faq" class="hover:text-[color:var(--ink)]">FAQ</a></li>
        </ul>
      </div>
      <div>
        <p class="text-xs font-bold uppercase tracking-wider mb-4">Contato</p>
        <ul class="space-y-2 text-sm text-[color:var(--muted)]">
          <li>📍 [Cidade / região atendida]</li>
          <li>📱 (11) 90000-0000</li>
          <li>🕒 Seg a Sáb [08h–18h]</li>
        </ul>
      </div>
    </div>
    <div class="container pb-8"><div class="hair mb-6"></div><div class="flex flex-col sm:flex-row justify-between gap-3 text-xs text-[color:var(--muted)]"><span>© 2026 [Sua Empresa]. Todos os direitos reservados.</span><span>Política de Privacidade · Termos</span></div></div>
  </footer>
</div>

<a href="https://wa.me/5511900000000" class="wa" target="_blank" rel="noreferrer"><span class="ic">●</span><span>Falar no WhatsApp</span></a>


`;
export const Route = createFileRoute("/")({ head: () => ({ meta: [ { title: "[Sua Empresa] — Ar-condicionado: instalação e manutenção" } ] }), component: Index });
function Index(){
  useEffect(() => {
    const io=new IntersectionObserver((es)=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add("in");io.unobserve(e.target);}}),{threshold:0.12});
    document.querySelectorAll(".reveal").forEach((el)=>io.observe(el));
    const onScroll=()=>{const n=document.getElementById("nav"); if(n) n.classList.toggle("s", window.scrollY>20);};
    addEventListener("scroll", onScroll, {passive:true});
    return () => { io.disconnect(); removeEventListener("scroll", onScroll); };
  }, []);
  return (<><style dangerouslySetInnerHTML={{ __html: CSS }} /><div dangerouslySetInnerHTML={{ __html: BODY }} /></>);
}
