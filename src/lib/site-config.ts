/**
 * SITE CONFIG — edite aqui com os dados reais da empresa.
 * Todos os textos, links, números e imagens do site são controlados por este arquivo.
 */

export const siteConfig = {
  // Marca
  brandName: "[Sua Empresa]",
  logoLetter: "A",

  // Contato
  whatsappNumber: "5511900000000", // número completo com DDD e código do país, sem espaços
  phoneDisplay: "(11) 90000-0000",
  email: "contato@suaempresa.com",

  // Localização / horário
  city: "[Sua cidade]",
  region: "[Região atendida]",
  businessHours: "Seg a Sáb [08h–18h]",

  // SEO / Meta
  title: "[Sua Empresa] — Ar-condicionado: instalação e manutenção",
  description:
    "Instalação, manutenção e conserto de ar-condicionado em [sua cidade]. Técnicos qualificados, orçamento grátis e atendimento rápido.",

  // Hero
  hero: {
    kicker: "❄️ Orçamento grátis · atendimento no mesmo dia",
    title: "Climatize com",
    titleHighlight: "quem entende",
    subtitle:
      "[Diga o que sua empresa faz e pra quem.] Instalação, manutenção e conserto de ar-condicionado com técnicos qualificados, peças de qualidade e garantia. Conforto térmico sem dor de cabeça — pra sua casa ou empresa.",
    ctaPrimary: "Pedir orçamento grátis →",
    ctaSecondary: "Ver serviços",
  },

  // Estatísticas
  stats: {
    atendimentos: "+4 mil",
    nota: "4,9 ⭐",
    garantia: "90 dias",
    atendimento: "Mesmo dia",
  },

  // Problemas / dor
  painPoints: [
    {
      icon: "🥵",
      title: "Ambiente abafado",
      text: "Casa ou empresa quente, noites mal dormidas. A gente resolve com o equipamento certo.",
    },
    {
      icon: "💧",
      title: "Aparelho pingando / fraco",
      text: "Sujeira e falta de manutenção fazem gelar menos e gastar mais. A limpeza muda tudo.",
    },
    {
      icon: "🧰",
      title: "Técnico que some",
      text: "Profissionais que somem e não dão garantia. Aqui é compromisso e pós-serviço de verdade.",
    },
  ],

  // Serviços
  services: [
    {
      title: "Instalação",
      text: "Split, multi split e cassete instalados com segurança e acabamento impecável.",
    },
    {
      title: "Manutenção & limpeza",
      text: "Higienização que faz gelar mais, gastar menos e tirar fungos e mau cheiro.",
    },
    {
      title: "Conserto",
      text: "Não gela? Faz barulho? Diagnóstico rápido e reparo com peças de qualidade.",
    },
    {
      title: "Recarga de gás",
      text: "Carga correta pro seu aparelho voltar a gelar como novo.",
    },
    {
      title: "PMOC pra empresas",
      text: "Plano de manutenção dentro da norma pra empresas e estabelecimentos.",
    },
    {
      title: "Projetos",
      text: "Dimensionamento e projeto de climatização pro seu espaço, do residencial ao comercial.",
    },
  ],

  // Diferenciais
  differentials: [
    "Orçamento grátis e transparente",
    "Garantia no serviço",
    "Atendimento rápido",
  ],
  aboutText:
    "[Fale da empresa: anos de experiência, equipe, certificações.] Técnicos qualificados, orçamento transparente, peças de qualidade e garantia no serviço. A gente faz certo da primeira vez — e fica disponível depois.",

  // Passo a passo
  steps: [
    {
      number: "01",
      title: "Chama no zap",
      text: "Conta o que precisa (instalar, limpar ou consertar) e a gente já te passa o orçamento.",
    },
    {
      number: "02",
      title: "Agendamos a visita",
      text: "Marcamos no melhor horário pra você, com pontualidade.",
    },
    {
      number: "03",
      title: "Conforto garantido",
      text: "Serviço feito com capricho, ambiente limpo e garantia. É só relaxar no fresco.",
    },
  ],

  // Depoimentos
  testimonials: [
    {
      text: "Instalaram meu split no mesmo dia, super organizados e limparam tudo no final. Gela demais agora!",
      name: "Camila S.",
      avatar: "https://i.pravatar.cc/80?img=52",
    },
    {
      text: "Meu ar não gelava e o técnico achou o problema na hora. Preço justo e com garantia. Recomendo!",
      name: "Rogério T.",
      avatar: "https://i.pravatar.cc/80?img=14",
    },
    {
      text: "Faço a limpeza com eles todo ano. Pontuais, educados e o ar fica novinho. Empresa de confiança.",
      name: "Patrícia L.",
      avatar: "https://i.pravatar.cc/80?img=49",
    },
  ],

  // FAQ
  faq: [
    {
      question: "O orçamento é gratuito?",
      answer:
        "Sim, o orçamento é gratuito e sem compromisso. Muitas vezes conseguimos passar o valor já pelo WhatsApp.",
    },
    {
      question: "De quanto em quanto tempo limpar o ar?",
      answer:
        "Recomendamos a higienização ao menos 1x por ano (ou semestral em uso intenso) pra gelar bem e evitar fungos.",
    },
    {
      question: "Atendem residência e empresa?",
      answer:
        "Sim, atendemos residências, comércios e empresas, inclusive com PMOC dentro da norma.",
    },
    {
      question: "Vocês vendem o aparelho também?",
      answer:
        "[Informe.] Podemos indicar e fornecer o equipamento ideal pro seu ambiente, ou instalar o seu.",
    },
    {
      question: "Tem garantia?",
      answer:
        "Sim, todo serviço tem garantia. E peças/equipamentos têm a garantia do fabricante.",
    },
    {
      question: "Qual a região de atendimento?",
      answer:
        "[Cidade e região.] Em caso de dúvida sobre o seu bairro, é só perguntar no WhatsApp.",
    },
  ],
};

export const whatsappLink = `https://wa.me/${siteConfig.whatsappNumber}`;
