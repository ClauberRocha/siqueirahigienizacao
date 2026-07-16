/**
 * SITE CONFIG — edite aqui com os dados reais da empresa.
 * Todos os textos, links, números e imagens do site são controlados por este arquivo.
 */
import baSofaAntes from "@/assets/ba-sofa-antes.jpg";
import baSofaDepois from "@/assets/ba-sofa-depois.jpg";
import baColchaoAntes from "@/assets/ba-colchao-antes.jpg";
import baColchaoDepois from "@/assets/ba-colchao-depois.jpg";
import baBancoAntes from "@/assets/ba-banco-antes.jpg";
import baBancoDepois from "@/assets/ba-banco-depois.jpg";
import serviceBancosAutomotivos from "@/assets/service-bancos-automotivos.jpg";

export const siteConfig = {
  // Marca
  brandName: "Siqueira Higienização",
  logoLetter: "S",

  // Contato
  whatsappNumber: "5598988660241",
  phoneDisplay: "(98) 98866-0241",
  email: "siqueirahigienizacao2@gmail.com",
  instagram: "siqueira_higienizacao",
  instagramUrl: "https://instagram.com/siqueira_higienizacao",
  googleReviewsUrl: "https://g.page/r/siqueira-higienizacao/review",
  facebookUrl: "",

  // Localização / horário
  city: "São Luís",
  state: "MA",
  region: "São Luís e região — MA",
  address: "São Luís/MA — atendimento em domicílio",
  businessHours: "Seg a Sáb, 08h–18h",

  // Analytics — deixe vazio pra desativar
  // GA4: preencha o Measurement ID (ex.: "G-XXXXXXX")
  // Plausible: preencha o domínio (ex.: "siqueirahigienizacao.com.br")
  googleAnalyticsId: "" as string,
  plausibleDomain: "" as string,

  // SEO / Meta
  title: "Siqueira Higienização — Sofás, colchões, tapetes e veículos em São Luís/MA",
  description:
    "Higienização profissional de sofás, colchões, tapetes, cadeiras, poltronas, bancos automotivos e veículos em São Luís/MA. Orçamento grátis, atendimento em domicílio e secagem rápida.",

  // Hero
  hero: {
    kicker: "✨ Elimina 99% dos ácaros e bactérias",
    title: "Seu estofado novo de novo,",
    titleHighlight: "sem sair de casa",
    subtitle:
      "Atendimento em domicílio em São Luís/MA com equipamentos profissionais, secagem rápida e produtos 100% seguros para crianças e pets.",
    ctaPrimary: "QUERO MEU ORÇAMENTO GRÁTIS NO WHATSAPP",
    ctaSecondary: "Agendar atendimento",
  },

  // Estatísticas
  stats: {
    atendimentos: "+200",
    nota: "4,9 ⭐",
    garantia: "Qualidade",
    atendimento: "Em domicílio",
  },

  // Problemas / dor
  painPoints: [
    {
      icon: "🛋️",
      title: "Sofá com manchas e cheiro",
      text: "Suor, comida, pets e poeira acumulam ácaros e bactérias. A gente devolve o conforto e a cor original.",
    },
    {
      icon: "😴",
      title: "Colchão com ácaros",
      text: "Você passa 1/3 da vida em cima dele. Higienização profunda melhora alergia, respiração e o sono.",
    },
    {
      icon: "🚗",
      title: "Carro com bancos sujos",
      text: "Bancos, teto, carpete e porta-malas ficam com aparência de zero KM — inclusive antes de vender.",
    },
  ],

  // Serviços — cards individuais (imagem, descrição, benefícios, agendar)
  services: [
    {
      title: "Sofás",
      icon: "🛋️",
      image:
        "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=800&q=80",
      text: "Extração profunda de manchas, ácaros e odores. Tecido, suede, couro e couro sintético.",
      benefits: ["Remove manchas antigas", "Elimina ácaros e bactérias", "Secagem rápida"],
    },
    {
      title: "Colchões",
      icon: "🛏️",
      image:
        "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80",
      text: "Casal, queen, king ou solteiro. Face única ou dupla, com opção de impermeabilização.",
      benefits: ["Alívio de alergia", "Sem cheiro de suor", "Sono mais saudável"],
    },
    {
      title: "Tapetes",
      icon: "🧶",
      image:
        "https://images.unsplash.com/photo-1600166898405-da9535204843?w=800&q=80",
      text: "Todos os tamanhos e materiais. Lavagem em domicílio ou no nosso espaço.",
      benefits: ["Cores restauradas", "Sem ácaros", "Fibras preservadas"],
    },
    {
      title: "Bancos automotivos",
      icon: "💺",
      image: serviceBancosAutomotivos,
      text: "Higienização completa dos bancos em tecido ou couro, incluindo cintos e apoios.",
      benefits: ["Aparência de novo", "Sem cheiro", "Ideal antes de vender"],
    },
    {
      title: "Veículos completos",
      icon: "🚗",
      image:
        "https://images.unsplash.com/photo-1607860108855-64acf2078ed9?w=800&q=80",
      text: "Higienização interna completa: bancos, teto, portas, painel, carpete e porta-malas.",
      benefits: ["Interior impecável", "Ar mais puro", "Valorização do veículo"],
    },
    {
      title: "Cadeiras",
      icon: "🪑",
      image:
        "https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=800&q=80",
      text: "Cadeiras de escritório, jantar e gamer. Extração profunda em tecido, mesh e couro.",
      benefits: ["Sem manchas", "Sem odores", "Mais durabilidade"],
    },
    {
      title: "Poltronas",
      icon: "🛋️",
      image:
        "https://images.unsplash.com/photo-1567016432779-094069958ea5?w=800&q=80",
      text: "Poltronas comuns, reclináveis e de amamentação — tratadas com cuidado peça a peça.",
      benefits: ["Tecido revitalizado", "Ambiente saudável", "Toque macio"],
    },
    {
      title: "Outros serviços",
      icon: "✨",
      image:
        "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&q=80",
      text: "Puffs, cortinas, cabeceiras, carrinhos de bebê e itens especiais — consulte pelo WhatsApp.",
      benefits: ["Orçamento sob medida", "Atendemos itens especiais", "Produtos certificados"],
    },
  ],

  // Diferenciais
  differentials: [
    "Produtos certificados e biodegradáveis",
    "Atendimento em domicílio, sem transtorno",
    "Equipamentos profissionais de extração",
    "Secagem rápida (algumas horas)",
    "Garantia de qualidade no serviço",
    "Equipe treinada e uniformizada",
  ],
  aboutText:
    "A Siqueira Higienização é especialista em limpeza profissional de estofados em São Luís/MA. Com equipamentos de alta performance e produtos biodegradáveis, devolvemos a cor, o conforto e a saúde ao seu sofá, colchão ou veículo. Atendimento em domicílio, secagem rápida e a garantia de mais de 200 clientes satisfeitos (nota 4,9 ⭐). Proteja sua família de ácaros e alergias com quem entende do assunto.",

  // Passo a passo
  steps: [
    {
      number: "01",
      title: "Chama no WhatsApp",
      text: "Conta o que precisa (sofá, colchão, carro…) e mande uma foto. Já te passamos o orçamento.",
    },
    {
      number: "02",
      title: "Agendamos a visita",
      text: "Escolhe o melhor horário. Vamos até você com todos os equipamentos e produtos.",
    },
    {
      number: "03",
      title: "Peça higienizada",
      text: "Serviço feito na hora, com secagem rápida. Você recebe sua peça pronta pra usar de novo.",
    },
  ],

  // Depoimentos
  testimonials: [
    {
      text: "Fizeram a higienização do meu sofá de tecido cinza que estava horrível de manchas. Ficou como novo, sem cheiro nenhum. Recomendo demais!",
      name: "Camila S.",
      role: "Cliente · São Luís",
      avatar: "https://i.pravatar.cc/80?img=52",
    },
    {
      text: "Higienizaram o colchão do meu filho que tem alergia. A diferença no sono foi imediata. Equipe pontual e super educada.",
      name: "Rogério T.",
      role: "Cliente · São Luís",
      avatar: "https://i.pravatar.cc/80?img=14",
    },
    {
      text: "Meu carro parecia novo depois da higienização interna. Bancos, teto, porta-malas — tudo impecável. Preço justo, faço todo ano.",
      name: "Patrícia L.",
      role: "Cliente · São Luís",
      avatar: "https://i.pravatar.cc/80?img=49",
    },
  ],

  // Galeria antes/depois
  gallery: [
    {
      before: baSofaAntes,
      after: baSofaDepois,
      label: "Sofá 3 lugares",
    },
    {
      before: baColchaoAntes,
      after: baColchaoDepois,
      label: "Colchão queen",
    },
    {
      before: baBancoAntes,
      after: baBancoDepois,
      label: "Bancos automotivos",
    },
  ],

  // FAQ
  faq: [
    {
      question: "O orçamento é gratuito?",
      answer:
        "Sim, o orçamento é 100% gratuito e sem compromisso. Muitas vezes conseguimos passar o valor direto pelo WhatsApp, com base nas fotos que você enviar.",
    },
    {
      question: "Vocês vão até minha casa?",
      answer:
        "Sim! Atendemos em domicílio em São Luís e região. Sofás, colchões, cadeiras e poltronas são higienizados dentro da sua casa, sem precisar levar em lugar nenhum.",
    },
    {
      question: "Quanto tempo leva pra secar?",
      answer:
        "Depende do tecido e da ventilação, mas em geral entre 3 a 6 horas. Trabalhamos com equipamentos de extração que retiram até 95% da umidade.",
    },
    {
      question: "Os produtos são seguros para crianças e pets?",
      answer:
        "Sim. Usamos produtos certificados, biodegradáveis e hipoalergênicos, seguros para crianças, idosos e animais de estimação.",
    },
    {
      question: "De quanto em quanto tempo higienizar?",
      answer:
        "Recomendamos higienização de sofás e colchões pelo menos 1x por ano (ou a cada 6 meses se tiver crianças, pets ou alergia). Veículos: 1x por ano ou antes de vender.",
    },
    {
      question: "Como faço para agendar?",
      answer:
        "É só chamar no WhatsApp com o item e uma foto (se possível). Passamos o orçamento na hora e agendamos a melhor data pra você.",
    },
  ],
};

export const whatsappLink = `https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(
  "Olá! Gostaria de um orçamento de higienização.",
)}`;
