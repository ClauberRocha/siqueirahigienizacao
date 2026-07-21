/**
 * Blog articles — SEO-optimized content for Siqueira Higienização.
 * Add / edit posts here; routes and the index page read from this list.
 */

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  h1: string;
  readingTime: string;
  publishedAt: string; // ISO date
  category: string;
  cover: string;
  excerpt: string;
  tags?: string[];
  /** Content blocks rendered in order. */
  blocks: Array<
    | { type: "p"; text: string }
    | { type: "h2"; text: string }
    | { type: "h3"; text: string }
    | { type: "ul"; items: string[] }
    | { type: "ol"; items: string[] }
    | { type: "quote"; text: string }
  >;
  faq?: Array<{ q: string; a: string }>;
}

export const blogPosts: BlogPost[] = [
  {
    slug: "como-limpar-sofa-em-casa",
    title: "Como limpar sofá em casa: guia passo a passo | Siqueira",
    description:
      "Aprenda como limpar sofá em casa de forma segura: materiais, passo a passo por tipo de tecido e quando chamar um profissional em São Luís/MA.",
    h1: "Como limpar sofá em casa (passo a passo por tipo de tecido)",
    readingTime: "6 min",
    publishedAt: "2026-07-10",
    category: "Sofá",
    cover:
      "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=1200&q=75&fm=webp",
    excerpt:
      "Passo a passo prático para tirar manchas, cheiro e ácaros do sofá em casa — e quando vale a pena chamar um profissional.",
    tags: ["sofá", "limpeza", "diy", "manchas", "ácaros"],
    blocks: [
      {
        type: "p",
        text: "Limpar o sofá em casa ajuda a manter o estofado bonito entre uma higienização profissional e outra. Mas é importante saber o tipo de tecido antes de aplicar qualquer produto — usar o item errado mancha, desbota ou danifica a fibra de vez.",
      },
      { type: "h2", text: "Materiais que você vai precisar" },
      {
        type: "ul",
        items: [
          "Aspirador de pó com bico fino",
          "2 panos de microfibra brancos",
          "Balde com água morna",
          "Sabão neutro (ou shampoo infantil)",
          "Bicarbonato de sódio",
          "Escova de cerdas macias",
        ],
      },
      { type: "h2", text: "Passo a passo para limpar o sofá em casa" },
      {
        type: "ol",
        items: [
          "Retire almofadas e aspire todo o sofá — inclusive frestas, encostos e a parte de baixo.",
          "Polvilhe bicarbonato sobre o tecido, deixe agir por 20 minutos e aspire de novo. Isso ajuda a neutralizar odores.",
          "Faça um teste em uma área escondida com água morna + sabão neutro antes de aplicar em todo o sofá.",
          "Umedeça (não encharque) o pano na solução e passe em movimentos circulares.",
          "Retire a espuma com um pano limpo só com água morna.",
          "Deixe secar em local ventilado por 4 a 8 horas antes de usar.",
        ],
      },
      { type: "h2", text: "Cuidados por tipo de tecido" },
      { type: "h3", text: "Tecido, suede e chenille" },
      {
        type: "p",
        text: "Aceitam limpeza úmida leve, mas água em excesso deixa marca. Nunca esfregue com força — vai desbotar.",
      },
      { type: "h3", text: "Couro e couro sintético (corino)" },
      {
        type: "p",
        text: "Use apenas pano macio úmido com água morna. Depois passe hidratante próprio para couro. Evite álcool, amoníaco e produtos abrasivos.",
      },
      { type: "h3", text: "Veludo" },
      {
        type: "p",
        text: "É o mais delicado: aspire com bocal macio e limpe manchas só pontualmente. Em geral, veludo pede higienização profissional.",
      },
      { type: "h2", text: "Quando NÃO limpar em casa" },
      {
        type: "ul",
        items: [
          "Manchas antigas de gordura, sangue, urina ou vômito",
          "Sofá com mofo, ácaros ou cheiro persistente",
          "Tecidos delicados (veludo, seda, linho)",
          "Se você ou alguém da casa tem alergia respiratória",
        ],
      },
      {
        type: "quote",
        text: "Limpeza doméstica remove sujeira de superfície. Higienização profissional extrai ácaros, fungos e resíduos do fundo da espuma.",
      },
      { type: "h2", text: "Conclusão" },
      {
        type: "p",
        text: "Limpar o sofá em casa uma vez por mês prolonga a vida do estofado. Mas para tirar manchas antigas, ácaros e cheiro, o ideal é uma higienização profissional pelo menos 1x por ano. Em São Luís/MA, a Siqueira Higienização faz o serviço em domicílio, com secagem rápida e produtos seguros para crianças e pets.",
      },
    ],
    faq: [
      {
        q: "Posso usar água sanitária no sofá?",
        a: "Não. Água sanitária desbota o tecido e resseca o couro. Use sempre sabão neutro diluído em água morna.",
      },
      {
        q: "De quanto em quanto tempo limpar o sofá?",
        a: "Aspirar 1x por semana e higienizar profissionalmente pelo menos 1x por ano — a cada 6 meses se tiver pets, crianças ou alergia.",
      },
      {
        q: "O sofá pode molhar?",
        a: "Só o suficiente para umedecer o tecido. Água em excesso encharca a espuma, gera mofo e cheiro azedo.",
      },
    ],
  },
  {
    slug: "como-limpar-sofa-de-tecido-em-casa",
    title: "Como limpar sofá de tecido em casa: passo a passo seguro | Siqueira",
    description:
      "Guia completo para limpar sofá de tecido em casa sem danificar a fibra: materiais, receita caseira, passo a passo e quando chamar um profissional.",
    h1: "Como limpar sofá de tecido em casa (sem estragar o estofado)",
    readingTime: "7 min",
    publishedAt: "2026-07-21",
    category: "Sofá",
    cover:
      "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=1200&q=75&fm=webp",
    excerpt:
      "Tudo o que você precisa para limpar seu sofá de tecido em casa com segurança — receita caseira, técnica correta e os erros que danificam a fibra.",
    tags: ["sofá de tecido", "limpeza de sofá", "diy", "manchas", "ácaros"],
    blocks: [
      {
        type: "p",
        text: "Sofá de tecido é um dos estofados mais comuns nas casas brasileiras — e também um dos que mais acumulam poeira, ácaros e manchas. A boa notícia é que dá para fazer uma limpeza caseira segura entre uma higienização profissional e outra. A má é que qualquer produto errado desbota, mancha ou compromete a espuma de vez.",
      },
      { type: "h2", text: "Antes de começar: identifique o tecido" },
      {
        type: "p",
        text: "Vire uma almofada e procure a etiqueta com o código de limpeza. W = pode usar água; S = só produto seco; WS = ambos; X = só aspirar. Se não houver etiqueta, faça teste em área escondida antes de qualquer produto.",
      },
      { type: "h2", text: "Materiais para a limpeza caseira" },
      {
        type: "ul",
        items: [
          "Aspirador com bico fino e escova macia",
          "2 panos brancos de microfibra",
          "Balde com 1 L de água morna",
          "1 colher de sopa de sabão neutro (ou shampoo infantil)",
          "1 colher de sopa de vinagre branco",
          "Bicarbonato de sódio",
          "Escova de cerdas macias",
        ],
      },
      { type: "h2", text: "Receita caseira que funciona (sem estragar)" },
      {
        type: "p",
        text: "Misture 1 L de água morna + 1 colher de sabão neutro + 1 colher de vinagre branco. Bata levemente até formar espuma. Use só a espuma na limpeza — nunca a solução líquida direto no tecido.",
      },
      { type: "h2", text: "Passo a passo para limpar sofá de tecido em casa" },
      {
        type: "ol",
        items: [
          "Retire almofadas soltas e aspire todo o sofá, incluindo frestas, encostos, laterais e a parte de baixo.",
          "Polvilhe bicarbonato por todo o tecido e deixe agir por 30 minutos para neutralizar odores. Aspire novamente.",
          "Faça teste da receita em um canto escondido. Aguarde 10 minutos e veja se desbotou.",
          "Com o pano de microfibra, aplique só a espuma em movimentos circulares suaves — sempre da borda para o centro da mancha.",
          "Passe o segundo pano levemente úmido (só água) para retirar o sabão.",
          "Deixe secar em local arejado, com ventilador ligado, por 4 a 8 horas antes de recolocar almofadas.",
        ],
      },
      { type: "h2", text: "Erros comuns que danificam o sofá de tecido" },
      {
        type: "ul",
        items: [
          "Encharcar a espuma — gera mofo e cheiro azedo permanente",
          "Esfregar com força — desfia a fibra e desbota a cor",
          "Usar água sanitária, amoníaco ou multiuso — mancha na hora",
          "Secar no sol direto — desbota o tecido em minutos",
          "Passar ferro ou secador quente para acelerar a secagem",
        ],
      },
      { type: "h2", text: "Quando a limpeza caseira NÃO resolve" },
      {
        type: "p",
        text: "A limpeza doméstica é ótima para manutenção, mas não substitui a higienização profissional. Chame um especialista quando:",
      },
      {
        type: "ul",
        items: [
          "As manchas são antigas, de gordura, sangue, urina ou vômito",
          "Sente cheiro persistente mesmo após limpar",
          "Alguém da casa tem rinite, asma ou alergia respiratória",
          "O sofá tem pets deitando diariamente",
          "Faz mais de 1 ano desde a última higienização profissional",
        ],
      },
      {
        type: "quote",
        text: "A limpeza caseira remove a sujeira de superfície. A extração profissional retira ácaros, fungos e resíduos do fundo da espuma — onde o pano de casa nunca chega.",
      },
      { type: "h2", text: "Conclusão" },
      {
        type: "p",
        text: "Limpar o sofá de tecido em casa uma vez por mês mantém o estofado bonito e prolonga a durabilidade. Para tirar ácaros, cheiro e manchas antigas, a higienização profissional é o caminho — e em São Luís/MA a Siqueira Higienização faz o serviço em domicílio, com equipamento de extração e produtos seguros para crianças e pets.",
      },
    ],
    faq: [
      {
        q: "Posso limpar o sofá de tecido só com água e sabão?",
        a: "Pode, desde que seja sabão neutro bem diluído e você use apenas a espuma. Água pura em excesso encharca a espuma e gera mofo.",
      },
      {
        q: "Vinagre estraga o tecido do sofá?",
        a: "Vinagre branco diluído é seguro para a maioria dos tecidos e ajuda a neutralizar odores. Evite em veludo, seda e couro.",
      },
      {
        q: "Quanto tempo leva para o sofá secar depois da limpeza caseira?",
        a: "Entre 4 e 8 horas com ventilação. Nunca use sol direto ou ar quente — desbota e resseca a fibra.",
      },
      {
        q: "Vale mais a pena limpar em casa ou chamar um profissional?",
        a: "A limpeza caseira serve para manutenção mensal. Para remover ácaros, manchas antigas e cheiro, o serviço profissional se paga em conforto e durabilidade do estofado.",
      },
    ],
  },
  {

    slug: "vale-a-pena-higienizar-colchao",
    title: "Vale a pena higienizar o colchão? Veja quando e por quê",
    description:
      "Vale a pena higienizar o colchão? Descubra os benefícios para o sono, alergias e saúde da família — e quando o serviço se paga sozinho.",
    h1: "Vale a pena higienizar o colchão? (a resposta é sim — veja por quê)",
    readingTime: "5 min",
    publishedAt: "2026-07-10",
    category: "Colchão",
    cover:
      "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=1200&q=75&fm=webp",
    excerpt:
      "Você passa 1/3 da vida em cima do colchão. Higienizar profissionalmente melhora sono, alergia e prolonga o produto.",
    tags: ["colchão", "ácaros", "alergia", "saúde", "sono"],
    blocks: [
      {
        type: "p",
        text: "A resposta curta é: sim, vale muito a pena. Um colchão acumula em média 500 mil ácaros, células de pele morta, suor e bactérias — mesmo com troca frequente de lençol. Higienizar profissionalmente melhora o sono, reduz crises alérgicas e prolonga o tempo de vida do produto.",
      },
      { type: "h2", text: "O que se acumula no colchão" },
      {
        type: "ul",
        items: [
          "Ácaros e seus resíduos (principal causa de rinite e asma)",
          "Fungos, bactérias e mofo",
          "Células de pele morta (alimento dos ácaros)",
          "Suor, oleosidade e resíduos de cosméticos",
          "Cheiros e manchas de líquidos derramados",
        ],
      },
      { type: "h2", text: "Benefícios reais de higienizar o colchão" },
      { type: "h3", text: "1. Sono melhor e mais profundo" },
      {
        type: "p",
        text: "Sem ácaros e sem cheiro, o corpo relaxa mais. Muitos clientes relatam dormir melhor já na primeira noite.",
      },
      { type: "h3", text: "2. Alívio de alergia e problemas respiratórios" },
      {
        type: "p",
        text: "Rinite, asma, coriza e coceira no nariz ao deitar geralmente têm relação direta com ácaros no colchão.",
      },
      { type: "h3", text: "3. Colchão dura mais" },
      {
        type: "p",
        text: "Sujeira e umidade acumuladas degradam a espuma. Higienizar mantém firmeza e conforto por mais tempo.",
      },
      { type: "h3", text: "4. Ambiente mais saudável" },
      {
        type: "p",
        text: "Especialmente importante para crianças, idosos, gestantes e quem tem pet dormindo por perto.",
      },
      { type: "h2", text: "Quando higienizar?" },
      {
        type: "ul",
        items: [
          "A cada 6 meses se você tem alergia, crianças ou pets",
          "1x por ano em uso normal",
          "Sempre que houver derramamento de líquidos",
          "Depois de gripe, virose ou dengue na família",
        ],
      },
      { type: "h2", text: "Higienização caseira x profissional" },
      {
        type: "p",
        text: "Aspirar e passar bicarbonato ajuda na superfície, mas não remove ácaros do fundo da espuma. A higienização profissional usa equipamento de extração que retira até 95% da umidade e dos resíduos internos, sem molhar o colchão a ponto de gerar mofo.",
      },
      {
        type: "quote",
        text: "Higienizar um colchão custa muito menos do que trocar — e o benefício para a saúde aparece na primeira semana.",
      },
    ],
    faq: [
      {
        q: "O colchão pode ser higienizado em casa?",
        a: "Sim, o serviço é feito no local, dentro do seu quarto, sem precisar levar a lugar nenhum.",
      },
      {
        q: "Quanto tempo leva para secar?",
        a: "Entre 3 e 6 horas, dependendo da ventilação. Pela manhã, você já pode dormir nele à noite.",
      },
      {
        q: "É seguro para bebês e pets?",
        a: "Sim. Usamos produtos biodegradáveis, hipoalergênicos e certificados, seguros para crianças, idosos e animais.",
      },
    ],
  },
  {
    slug: "quanto-custa-higienizacao",
    title: "Quanto custa higienização de sofá, colchão e carro em São Luís",
    description:
      "Quanto custa higienização de sofá, colchão, tapete e carro em São Luís/MA? Veja o que influencia o preço e como pedir orçamento grátis.",
    h1: "Quanto custa higienização em São Luís/MA?",
    readingTime: "5 min",
    publishedAt: "2026-07-10",
    category: "Preço",
    cover:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=75&fm=webp",
    excerpt:
      "Entenda o que influencia o preço de higienização e por que orçamento por foto no WhatsApp é sempre o mais justo.",
    tags: ["preço", "orçamento", "sofá", "colchão", "carro"],
    blocks: [
      {
        type: "p",
        text: "Uma das perguntas que mais recebemos é: quanto custa higienizar um sofá, um colchão ou o carro? A resposta honesta é que o preço varia caso a caso — mas dá para entender a lógica antes de pedir orçamento.",
      },
      { type: "h2", text: "O que influencia o preço da higienização" },
      {
        type: "ul",
        items: [
          "Tamanho da peça (sofá 2, 3, 4 ou 5 lugares, colchão solteiro/casal/queen/king)",
          "Tipo de tecido (tecido comum, suede, veludo, couro, corino)",
          "Nível de sujeira e manchas (leve, médio, pesado)",
          "Presença de mofo, urina de pet ou cheiro forte",
          "Distância de deslocamento em São Luís e região",
          "Serviços adicionais (impermeabilização, higienização de almofadas extras)",
        ],
      },
      { type: "h2", text: "Faixas de referência (apenas orientativas)" },
      {
        type: "p",
        text: "Os valores abaixo servem só para você ter uma ideia. O orçamento real depende da peça e do estado — e é gratuito pelo WhatsApp.",
      },
      {
        type: "ul",
        items: [
          "Sofá 2 e 3 lugares: valor médio da região metropolitana",
          "Colchão solteiro, casal, queen ou king: preço por tamanho",
          "Tapete: cobrado por metro quadrado",
          "Bancos automotivos ou veículo completo: pacote por tipo de carro",
          "Cadeiras, poltronas e puffs: preço por unidade",
        ],
      },
      { type: "h2", text: "Por que não temos tabela fixa no site?" },
      {
        type: "p",
        text: "Cada peça chega em um estado. Um sofá de 3 lugares com mancha leve custa muito menos do que outro do mesmo tamanho com urina de pet e mofo. Fixar tabela obrigaria a cobrar todo mundo pelo pior caso — o que seria injusto.",
      },
      {
        type: "quote",
        text: "Orçamento por foto no WhatsApp é sempre o mais justo: você paga o que a sua peça realmente precisa.",
      },
      { type: "h2", text: "Como pedir orçamento em menos de 2 minutos" },
      {
        type: "ol",
        items: [
          "Tire 2 ou 3 fotos da peça em boa iluminação (mostrando as manchas, se houver).",
          "Chame no WhatsApp e informe o tipo (sofá, colchão, carro etc.) e o tamanho.",
          "Receba o valor na hora e agende o melhor horário.",
        ],
      },
      { type: "h2", text: "Vale o investimento?" },
      {
        type: "p",
        text: "Higienizar custa uma fração do preço de trocar o móvel — e o benefício para saúde, sono e aparência aparece imediatamente. Para veículos, valoriza o carro na hora de vender.",
      },
    ],
    faq: [
      {
        q: "Vocês cobram taxa de visita para orçamento?",
        a: "Não. Orçamento é 100% gratuito e a maioria é passada direto pelo WhatsApp com fotos.",
      },
      {
        q: "Aceitam parcelamento?",
        a: "Combinamos a forma de pagamento junto com o orçamento — chama no WhatsApp que a gente te explica as opções.",
      },
      {
        q: "O preço é fechado antes do serviço?",
        a: "Sim. O valor é confirmado antes de começar. Não cobramos nada além do combinado sem sua autorização.",
      },
    ],
  },
  {
    slug: "diferenca-lavagem-higienizacao",
    title: "Diferença entre lavagem e higienização de estofados",
    description:
      "Qual a diferença entre lavagem e higienização de sofá, colchão ou carro? Entenda técnica, produtos, resultado e o que é melhor para o seu caso.",
    h1: "Diferença entre lavagem e higienização de estofados",
    readingTime: "4 min",
    publishedAt: "2026-07-10",
    category: "Educativo",
    cover:
      "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=1200&q=75&fm=webp",
    excerpt:
      "Lavagem molha e ensaboa. Higienização extrai ácaros, fungos e resíduos. Entenda quando cada técnica se aplica.",
    tags: ["higienização", "lavagem", "sofá", "colchão", "educativo"],
    blocks: [
      {
        type: "p",
        text: "Os dois termos são usados como sinônimos no dia a dia, mas tecnicamente são serviços diferentes. Entender a diferença ajuda a escolher o serviço certo — e a não pagar por menos do que a sua peça precisa.",
      },
      { type: "h2", text: "O que é lavagem de estofado" },
      {
        type: "p",
        text: "Lavagem tradicional aplica água e sabão na superfície, esfrega e enxágua. Resolve sujeira aparente, mas costuma encharcar a espuma. Isso gera dois problemas: secagem lenta (às vezes mais de 24h) e risco de mofo dentro do estofado.",
      },
      { type: "h2", text: "O que é higienização profissional" },
      {
        type: "p",
        text: "Higienização usa equipamentos de extração (tipo aspirador industrial de água) que injetam solução biodegradável e sugam de volta na mesma passada. Retira até 95% da umidade e leva junto ácaros, fungos, bactérias, células de pele e resíduos do fundo da espuma.",
      },
      { type: "h2", text: "Comparativo rápido" },
      {
        type: "ul",
        items: [
          "Lavagem: molha bastante · seca em 24h+ · risco de mofo · limpa a superfície",
          "Higienização: umidade controlada · seca em 3–6h · elimina ácaros e fungos · limpa fundo da espuma",
        ],
      },
      { type: "h2", text: "Quando escolher lavagem?" },
      {
        type: "p",
        text: "Praticamente nunca em sofás e colchões. A lavagem tradicional só faz sentido para itens que podem ir na máquina (capas removíveis, tapetes pequenos) ou em espaços apropriados de imersão.",
      },
      { type: "h2", text: "Quando escolher higienização?" },
      {
        type: "ul",
        items: [
          "Sofá, colchão, cadeira, poltrona ou banco automotivo",
          "Manchas antigas, cheiro persistente ou suspeita de ácaros",
          "Alergia, asma ou rinite na família",
          "Casa com crianças pequenas, idosos ou pets",
        ],
      },
      {
        type: "quote",
        text: "Se você quer que o estofado fique limpo por dentro e não só por cima, o serviço certo é higienização — não lavagem.",
      },
      { type: "h2", text: "Conclusão" },
      {
        type: "p",
        text: "Higienização é o padrão profissional atual. Custa parecido, entrega muito mais e não deixa o móvel encharcado. Na Siqueira Higienização, fazemos o serviço em domicílio em São Luís/MA com secagem rápida e produtos seguros.",
      },
    ],
    faq: [
      {
        q: "Higienização remove todas as manchas?",
        a: "A maioria sim. Manchas muito antigas de tinta, esmalte ou produtos químicos podem não sair completamente — isso é avaliado no orçamento.",
      },
      {
        q: "O tecido pode desbotar?",
        a: "Não. Trabalhamos com produtos neutros e pH controlado, seguros para tecido, suede, veludo, couro e corino.",
      },
    ],
  },
];

export function getPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find((p) => p.slug === slug);
}

/** Posts ordered chronologically (oldest → newest) for prev/next nav. */
export function getOrderedPosts(): BlogPost[] {
  return [...blogPosts].sort((a, b) => a.publishedAt.localeCompare(b.publishedAt));
}

export function getAdjacentPosts(slug: string): {
  prev?: BlogPost;
  next?: BlogPost;
} {
  const ordered = getOrderedPosts();
  const i = ordered.findIndex((p) => p.slug === slug);
  if (i === -1) return {};
  return {
    prev: i > 0 ? ordered[i - 1] : undefined,
    next: i < ordered.length - 1 ? ordered[i + 1] : undefined,
  };
}

/**
 * Recomenda até `limit` posts por afinidade (categoria + tags em comum),
 * evitando o artigo atual e reduzindo redundância entre as recomendações.
 */
export function getRelatedPosts(slug: string, limit = 3): BlogPost[] {
  const current = getPostBySlug(slug);
  if (!current) return [];
  const currentTags = new Set((current.tags ?? []).map((t) => t.toLowerCase()));

  const scored = blogPosts
    .filter((p) => p.slug !== slug)
    .map((p) => {
      const tags = (p.tags ?? []).map((t) => t.toLowerCase());
      const tagOverlap = tags.filter((t) => currentTags.has(t)).length;
      const sameCategory = p.category === current.category ? 1 : 0;
      // categoria pesa mais que tags individuais
      const score = sameCategory * 3 + tagOverlap;
      return { post: p, score, tags };
    })
    .sort((a, b) => b.score - a.score);

  // Reduz redundância: evita recomendar dois posts que compartilhem exatamente
  // a mesma categoria + conjunto de tags dominante.
  const picked: typeof scored = [];
  const usedCategories = new Map<string, number>();
  for (const item of scored) {
    const count = usedCategories.get(item.post.category) ?? 0;
    // no máx. 1 post por categoria enquanto houver diversidade disponível
    if (count >= 1 && picked.length < scored.length && picked.length < limit) {
      continue;
    }
    picked.push(item);
    usedCategories.set(item.post.category, count + 1);
    if (picked.length >= limit) break;
  }
  // fallback: completa com os melhores restantes se não atingimos o limite
  if (picked.length < limit) {
    for (const item of scored) {
      if (picked.length >= limit) break;
      if (!picked.includes(item)) picked.push(item);
    }
  }
  return picked.map((p) => p.post);
}
