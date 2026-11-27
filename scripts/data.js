/**
 * Base de Conteúdos, Perfil Editável, Acesso do Proprietário e Indicadores Reais — Portal Cleilson TST
 * Sem métricas fictícias: todos os contadores e especialidades são calculados
 * diretamente a partir do acervo real publicado no site.
 */

export const STORAGE_KEYS = {
  posts: "cleilson_tst_custom_posts_v2",
  deletedIds: "cleilson_tst_deleted_posts_v2",
  imageBank: "cleilson_tst_image_bank_v2",
  instagramCfg: "cleilson_tst_instagram_cfg_v2",
  analyticsCfg: "cleilson_tst_analytics_v2",
  profileCfg: "cleilson_tst_profile_v2",
  ownerAuth: "cleilson_tst_owner_auth_v2",
  adsenseCfg: "cleilson_tst_adsense_v2",
  categories: "cleilson_tst_categories_v2",
  theme: "cleilson_tst_theme_v1"
};

export const DEFAULT_CATEGORIES = [
  { id: "offshore", label: "Offshore (NR-37)" },
  { id: "onshore", label: "Onshore & Indústria" },
  { id: "nrs", label: "NRs & Legislação" }
];

export const SITE_CONFIG = {
  brandName: "Cleilson TST",
  tagline: "Segurança do Trabalho • Offshore & Onshore",
  defaultProfile: {
    name: "Cleilson",
    role: "Técnico em Segurança do Trabalho (TST) • Offshore & Onshore",
    aboutHeadline: "Construindo Cultura de Segurança Real — Do Convés Offshore ao Chão de Fábrica",
    bio: "Técnico em Segurança do Trabalho com vivência prática em plataformas marítimas e plantas industriais onshore. Compartilho conteúdos técnicos claros, aplicáveis no campo e fundamentados nas Normas Regulamentadoras vigentes.",
    shortBio: "Conteúdos técnicos fundamentados nas Normas Regulamentadoras e na rotina real de plataformas offshore e indústrias onshore.",
    history: "Atuação em campo acompanhando operações críticas em plataformas offshore (NR-37) e plantas industriais onshore, com foco em permissões de trabalho, análise de risco e cultura preventiva.",
    avatar: "assets/images/author-cleilson.jpg"
  },
  // Credencial padrão inicial (pode ser alterada pelo proprietário na aba Configurações)
  defaultOwner: {
    email: "cleilson@cleilsontst.com.br",
    // Senha inicial padrão: "tst2026" (armazenada apenas como hash SHA-256)
    passcodeHash: "a1c78c8b6f36b19a11e6f4078f84cb7362e75e8a69128816c5509cc1315826f2"
  },
  minReadersToDisplay: 500
};

export const DEFAULT_POSTS = [
  {
    id: "post-1",
    slug: "nr-37-offshore-guia-pratico-rotina-embarque",
    type: "article",
    category: "offshore",
    categoryLabel: "Offshore • NR-37",
    badge: "Destaque da Semana",
    title: "NR-37 na Prática: Os 7 Erros Críticos que Todo TST Precisa Bloquear Antes da Liberação de PT em Plataformas Offshore",
    subtitle: "Em ambiente confinado cercado pelo oceano, uma Permissão de Trabalho mal preenchida não é papelada — é o gatilho de um incidente grave. Veja o protocolo de campo.",
    date: "22 Nov 2026",
    featured: true,
    image: "assets/images/hero-offshore.jpg",
    imageCaption: "Inspeção pré-operacional em plataforma offshore: validação de PT, análise de risco e conferência de EPIs antichama.",
    summary: [
      "A NR-37 exige integração real entre a Permissão de Trabalho (PT), a Análise Preliminar de Risco (APR) e o bloqueio de energias (LOTO) — nunca aprove PTs genéricas 'copia e cola'.",
      "Atividades simultâneas (SIMOPS) são uma das principais causas de desvios graves em plataformas: trabalho a quente perto de pintura ou movimentação de carga suspensa exige segregação total.",
      "Antes de assinar qualquer liberação, faça a verificação presencial no local da tarefa conversando direto com o executante, nunca apenas da sala de controle.",
      "O direito de recusa deve ser reforçado no alinhamento de embarque como ferramenta de proteção, não como punição."
    ],
    practicalTip: "Antes do embarque, mantenha um roteiro rápido de verificação de PT no bolso: LOTO, medição de gases calibrada, SIMOPS, rota de fuga desobstruída e ciência de toda a equipe.",
    content: [
      {
        type: "p",
        text: "Quem já embarcou em uma plataforma de petróleo e gás sabe que a rotina offshore não perdoa improvisos. Em um ambiente onde você trabalha, dorme e convive a poucos metros de vasos pressurizados, linhas de hidrocarbonetos e movimentação constante de cargas, a Segurança do Trabalho deixa de ser teoria de apostila e vira prática diária de preservação de vidas."
      },
      {
        type: "p",
        text: "A Norma Regulamentadora nº 37 (NR-37) consolidou as exigências específicas para plataformas de petróleo, mas na rotina operacional ainda vemos erros recorrentes durante a emissão de Permissões de Trabalho (PT). Como TST, o seu papel não é apenas carimbar papéis — é atuar como barreira técnica ativa antes da execução."
      },
      {
        type: "h2",
        text: "1. Aprovar APR genérica sem ir até a frente de serviço"
      },
      {
        type: "p",
        text: "Um dos erros mais perigosos da rotina offshore é a chamada 'PT de ar-condicionado'. O executante traz o formulário preenchido na sala de PT, tudo parece completo no papel, mas ao chegar no convés o piso está engordurado, há uma manutenção elétrica acontecendo dois metros acima ou o vento mudou a direção de eventual névoa de gás."
      },
      {
        type: "callout",
        title: "Regra de Ouro do Cleilson",
        text: "Nunca libere uma atividade crítica sem caminhar até o ponto exato do serviço. Cinco minutos no convés valem mais do que cinquenta assinaturas na sala de controle."
      },
      {
        type: "h2",
        text: "2. Ignorar interferências de Operações Simultâneas (SIMOPS)"
      },
      {
        type: "p",
        text: "Em paradas programadas ou campanhas de manutenção, várias frentes trabalham ao mesmo tempo. Liberar um serviço a quente (solda ou esmerilhamento) abaixo de uma área com limpeza química ou abertura de linha cria cenário imediato de emergência. O mapa de SIMOPS precisa ser atualizado a cada troca de turno."
      },
      {
        type: "h2",
        text: "3. Calibração e teste de resposta (Bump Test) do detector de gases"
      },
      {
        type: "p",
        text: "Não basta o equipamento estar com o certificado anual em dia. Antes de iniciar medição de H2S, LEL, O2 ou CO, o bump test diário precisa estar validado. Um sensor comprometido que marca zero por cento de explosividade em área classificada cria uma falsa sensação de segurança."
      },
      {
        type: "checklist",
        title: "Verificação Obrigatória Pré-Liberação NR-37",
        items: [
          "Bloqueio, etiquetagem e teste de energia zero (LOTO) conferidos fisicamente com o executante.",
          "Análise de SIMOPS cruzada com a sala de controle central (CCR).",
          "Detector multigás com bump test aprovado no turno atual.",
          "Rotas de fuga, chuveiro lava-olhos e extintores próximos desobstruídos.",
          "Todos os executantes compreenderam os riscos e sabem acionar o Direito de Recusa."
        ]
      },
      {
        type: "h2",
        text: "Conclusão: Autoridade técnica gera respeito no convés"
      },
      {
        type: "p",
        text: "Quando o TST domina a NR-37 e atua ao lado da equipe operacional — ouvindo as dificuldades reais e propondo barreiras práticas — ele deixa de ser visto apenas como fiscal e passa a ser respeitado como líder de prevenção."
      }
    ]
  },
  {
    id: "post-2",
    slug: "dds-onshore-5-minutos-engajamento-real",
    type: "article",
    category: "onshore",
    categoryLabel: "Onshore • Cultura & Prevenção",
    badge: "Prática de Campo",
    title: "Como Conduzir um Alinhamento de Segurança Onshore de 5 Minutos que a Equipe Realmente Escuta",
    subtitle: "Esqueça a leitura robótica de folhas impressas. Veja a estrutura de 3 blocos que transforma o diálogo diário em uma ferramenta real de prevenção industrial.",
    date: "19 Nov 2026",
    featured: false,
    image: "assets/images/onshore-industry.jpg",
    imageCaption: "Equipe onshore conduzindo alinhamento de segurança diretamente na planta industrial antes do início das atividades.",
    summary: [
      "Reuniões longas demais logo no início do turno perdem o foco da equipe operacional rapidamente.",
      "Use o método '1 Risco + 1 Situação Real + 1 Compromisso': conecte o tema diretamente à tarefa que o time vai executar naquela manhã.",
      "Faça perguntas abertas para os operadores mais experientes — quando a equipe participa da conversa, ela assume responsabilidade real pela prevenção."
    ],
    practicalTip: "No próximo alinhamento, leve um EPI avariado ou descreva uma condição real da frente de serviço (sem expor nomes) e pergunte à equipe: 'O que poderia dar errado aqui hoje?'",
    content: [
      {
        type: "p",
        text: "Em fábricas, refinarias, canteiros de obras e bases logísticas onshore, o Diálogo Diário de Segurança (DDS) muitas vezes se torna uma rotina mecânica: alguém lê um texto genérico enquanto parte da equipe já pensa nas metas de produção do turno."
      },
      {
        type: "p",
        text: "Você não precisa de slides nem de discursos extensos para mudar isso. Uma estrutura objetiva de 5 minutos, conectada ao risco real da atividade do dia, gera atenção imediata e engajamento verdadeiro."
      },
      {
        type: "h2",
        text: "O Método 1-1-1 na prática industrial"
      },
      {
        type: "p",
        text: "Primeiro minuto: apresente UM risco específico da atividade de hoje (ex: prensamento de mãos na troca de válvulas ou queda de ferramentas). Segundo e terceiro minutos: traga UMA situação prática ou quase-acidente mostrando a consequência real. Últimos dois minutos: feche com UM compromisso coletivo observável no turno."
      },
      {
        type: "callout",
        title: "Dica de Campo",
        text: "O nome é DIÁLOGO Diário de Segurança, não monólogo. Abra espaço para quem executa a tarefa apontar as dificuldades reais do setor."
      },
      {
        type: "p",
        text: "Quando a equipe percebe que o diálogo resolve problemas práticos da rotina onshore, os próprios operadores passam a reportar condições inseguras antes que o incidente aconteça."
      }
    ]
  },
  {
    id: "post-3",
    slug: "nr-35-trabalho-em-altura-fator-queda-ancoragem",
    type: "article",
    category: "nrs",
    categoryLabel: "NRs & Legislação • NR-35",
    badge: "Guia Técnico",
    title: "NR-35 Descomplicada: Fator de Queda, Zona Livre de Queda (ZLQ) e Ancoragem Sem Mistério",
    subtitle: "Entenda o cálculo técnico essencial que evita que um trabalhador colida com o nível inferior mesmo utilizando cinto paraquedista.",
    date: "15 Nov 2026",
    featured: false,
    image: "assets/images/nr35-height.jpg",
    imageCaption: "Operação em altura seguindo requisitos da NR-35 com ancoragem acima da linha dos ombros e supervisão técnica.",
    summary: [
      "Usar cinto paraquedista e talabarte NÃO garante retenção segura se a Zona Livre de Queda (ZLQ) for menor que a altura disponível abaixo do trabalhador.",
      "Priorize sempre Fator de Queda menor que 1 (ponto de ancoragem acima da cabeça). O Fator de Queda 2 eleva drasticamente a força de impacto.",
      "Em baixas alturas (entre 2m e 5m), avalie a substituição do talabarte com absorvedor por trava-quedas retrátil certificado."
    ],
    practicalTip: "Some: comprimento do talabarte + abertura do absorvedor de energia + altura do trabalhador até o ponto dorsal + margem de segurança. Se o vão livre for menor que esse total, reprojete o sistema de retenção.",
    content: [
      {
        type: "p",
        text: "Um equívoco frequente tanto em plantas onshore quanto em plataformas offshore é acreditar que basta vestir o cinto tipo paraquedista e conectar o mosquetão em qualquer estrutura para estar protegido conforme a NR-35."
      },
      {
        type: "p",
        text: "Na prática técnica, um talabarte de 1,80m com absorvedor de energia que abre até 1,20m exige uma Zona Livre de Queda (ZLQ) superior a 5 metros. Se o trabalhador estiver em um nível de 3 metros com esse conjunto, poderá atingir o piso antes da frenagem completa."
      },
      {
        type: "h2",
        text: "Fator de Queda 0, 1 e 2"
      },
      {
        type: "p",
        text: "O Fator de Queda menor que 1 ocorre quando o ponto de ancoragem está posicionado acima da cabeça do trabalhador — cenário mais seguro. O Fator 1 ocorre na linha da cintura/dorsal. Já o Fator 2 acontece quando o gancho é fixado na altura dos pés, multiplicando a distância de queda livre."
      },
      {
        type: "checklist",
        title: "Inspeção Obrigatória Pré-Uso NR-35",
        items: [
          "Verificar costuras, fitas desfiadas, queimaduras de solda ou contato com agentes químicos no cinto.",
          "Testar dupla trava automática dos mosquetões.",
          "Confirmar resistência certificada do ponto de ancoragem conforme projeto da NR-35.",
          "Validar o plano de resgate para retirada rápida em caso de suspensão inerte."
        ]
      }
    ]
  },
  {
    id: "post-4",
    slug: "espaco-confinado-nr33-erro-vigia-fatal",
    type: "article",
    category: "nrs",
    categoryLabel: "NRs & Legislação • NR-33",
    badge: "Alerta Técnico",
    title: "NR-33 em Tanques e Vasos: O Papel Inegociável do Vigia e os Riscos da Atmosfera IPVS",
    subtitle: "Por que a entrada por impulso para tentar resgatar um colega transforma uma emergência em múltiplas vítimas — e como estruturar a PET corretamente.",
    date: "11 Nov 2026",
    featured: false,
    image: "assets/images/onshore-industry.jpg",
    imageCaption: "Monitoramento atmosférico contínuo e controle rigoroso de acesso em vasos e tanques industriais.",
    summary: [
      "Atmosferas com deficiência de oxigênio (abaixo de 19,5%) ou presença de gases tóxicos como H2S podem incapacitar um trabalhador em segundos.",
      "O Vigia da NR-33 nunca deve abandonar a boca de visita e nunca deve entrar no espaço confinado para tentativa de resgate sem equipamento autônomo e equipe preparada.",
      "A medição de gases deve ser estratificada (topo, meio e fundo), respeitando a densidade diferente de cada contaminante."
    ],
    practicalTip: "Antes de liberar a PET (Permissão de Entrada e Trabalho), valide na prática o meio de comunicação do Vigia e o tempo de resposta da equipe de resgate.",
    content: [
      {
        type: "p",
        text: "Espaços confinados fazem parte da rotina de tanques de lastro e carga em plataformas offshore, bem como de silos, caldeiras e galerias no ambiente onshore. O maior risco é invisível: a deficiência de oxigênio não tem cheiro e o gás sulfídrico (H2S) pode paralisar o olfato rapidamente."
      },
      {
        type: "p",
        text: "Estudos técnicos de órgãos como OSHA e Fundacentro alertam consistentemente para o alto índice de fatalidades envolvendo colegas que entram por impulso para resgatar quem desmaiou no interior do espaço confinado, sem proteção respiratória adequada."
      },
      {
        type: "callout",
        title: "Regra Inegociável da NR-33",
        text: "Vigia não entra. O Vigia monitora continuamente, mantém comunicação ativa, controla entradas/saídas e aciona o resgate equipado."
      },
      {
        type: "p",
        text: "Garanta sempre ventilação mecânica contínua com ar limpo (nunca oxigênio puro), medição estratificada nos três níveis do tanque e calibração válida dos detectores antes de qualquer acesso."
      }
    ]
  }
];

export const DEFAULT_IMAGE_BANK = [
  {
    id: "img-bank-1",
    title: "Rotina TST Offshore (NR-37) vs. Onshore",
    caption: "Comparativo visual sobre certificações, escalas e normas principais para profissionais de Segurança do Trabalho.",
    hashtag: "#NR37 #Offshore",
    category: "offshore",
    source: "portal",
    image: "assets/images/hero-offshore.jpg",
    date: "17 Nov 2026"
  },
  {
    id: "img-bank-2",
    title: "Hierarquia de Controles — EPI é a Última Barreira",
    caption: "Cartaz educativo lembrando a ordem correta da NR-01: Eliminação, Substituição, Engenharia, Administrativo e EPI.",
    hashtag: "#NR01 #HierarquiaDeControles",
    category: "nrs",
    source: "portal",
    image: "assets/images/nr35-height.jpg",
    date: "12 Nov 2026"
  },
  {
    id: "img-bank-3",
    title: "Inspeção Pré-Operacional em Planta Onshore",
    caption: "Registro de referência para alinhamentos de segurança e verificação de EPIs em áreas industriais.",
    hashtag: "#Onshore #SegurancaDoTrabalho",
    category: "onshore",
    source: "portal",
    image: "assets/images/onshore-industry.jpg",
    date: "10 Nov 2026"
  }
];

// =========================================================================
// PERFIL EDITÁVEL DO CLEILSON
// =========================================================================
export function loadProfile() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.profileCfg);
    if (raw) return { ...SITE_CONFIG.defaultProfile, ...JSON.parse(raw) };
  } catch {}
  return { ...SITE_CONFIG.defaultProfile };
}

export function saveProfile(profile) {
  localStorage.setItem(STORAGE_KEYS.profileCfg, JSON.stringify({ ...SITE_CONFIG.defaultProfile, ...profile }));
}

// =========================================================================
// AUTENTICAÇÃO EXCLUSIVA DO PROPRIETÁRIO (POR E-MAIL + SENHA SHA-256)
// =========================================================================
export async function hashSecret(text) {
  const clean = String(text || "").trim();
  if (window.crypto && window.crypto.subtle) {
    const buf = new TextEncoder().encode(clean);
    const hashBuf = await window.crypto.subtle.digest("SHA-256", buf);
    return Array.from(new Uint8Array(hashBuf))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  }
  return btoa(clean);
}

export function loadOwnerAuth() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ownerAuth);
    if (raw) return { ...SITE_CONFIG.defaultOwner, ...JSON.parse(raw) };
  } catch {}
  return { ...SITE_CONFIG.defaultOwner };
}

export function saveOwnerAuth(auth) {
  localStorage.setItem(STORAGE_KEYS.ownerAuth, JSON.stringify(auth));
}

export async function verifyOwnerCredentials(email, passcode) {
  const auth = loadOwnerAuth();
  const normalizedEmail = String(email || "").trim().toLowerCase();
  const expectedEmail = String(auth.email || "").trim().toLowerCase();
  if (!normalizedEmail || normalizedEmail !== expectedEmail) return false;

  // Aceita a senha padrão "tst2026" se ainda não alterada ou o hash salvo
  const inputHash = await hashSecret(passcode);
  const defaultHash = await hashSecret("tst2026");
  if (auth.passcodeHash === SITE_CONFIG.defaultOwner.passcodeHash && inputHash === defaultHash) {
    return true;
  }
  return inputHash === auth.passcodeHash;
}

// =========================================================================
// GOOGLE ADSENSE CONFIG
// =========================================================================
export function loadAdsenseConfig() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.adsenseCfg);
    if (raw) return JSON.parse(raw);
  } catch {}
  return { publisherId: "", enabled: true };
}

export function saveAdsenseConfig(cfg) {
  localStorage.setItem(STORAGE_KEYS.adsenseCfg, JSON.stringify(cfg));
}

// =========================================================================
// ÁREAS / CATEGORIAS DINÂMICAS (MENU SUSPENSO + ADICIONAR NOVA)
// =========================================================================
export function loadCategories() {
  let custom = [];
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.categories);
    if (raw) custom = JSON.parse(raw);
  } catch {
    custom = [];
  }
  const map = new Map();
  [...DEFAULT_CATEGORIES, ...custom].forEach((c) => {
    if (c && c.id && c.label) map.set(c.id, c);
  });
  return [...map.values()];
}

export function addCategory(label) {
  const cleanLabel = String(label || "").trim();
  if (!cleanLabel) return null;
  const id = cleanLabel
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  if (!id) return null;

  const existing = loadCategories();
  const found = existing.find((c) => c.id === id || c.label.toLowerCase() === cleanLabel.toLowerCase());
  if (found) return found;

  const next = { id, label: cleanLabel };
  const customOnly = existing.filter((c) => !DEFAULT_CATEGORIES.some((d) => d.id === c.id));
  customOnly.push(next);
  localStorage.setItem(STORAGE_KEYS.categories, JSON.stringify(customOnly));
  return next;
}

/**
 * Sanitiza HTML colado (Word, Google Docs, WhatsApp, web) preservando formatação útil
 * (parágrafos, negrito, itálico, sublinhado, subtítulos, listas, citações) e removendo lixo visual.
 */
export function sanitizeRichHtml(dirtyHtml = "") {
  const tpl = document.createElement("template");
  tpl.innerHTML = String(dirtyHtml || "");
  const allowedTags = new Set(["P", "BR", "STRONG", "B", "EM", "I", "U", "H2", "H3", "UL", "OL", "LI", "BLOCKQUOTE", "DIV"]);

  function cleanNode(node) {
    if (node.nodeType === Node.TEXT_NODE) {
      return document.createTextNode(node.textContent);
    }
    if (node.nodeType !== Node.ELEMENT_NODE) {
      return document.createTextNode("");
    }

    const tag = node.tagName.toUpperCase();
    if (["SCRIPT", "STYLE", "META", "LINK", "OBJECT", "IFRAME", "XML"].includes(tag)) {
      return document.createTextNode("");
    }

    // Mapeia H1/H4 para H2/H3 para manter hierarquia editorial limpa
    let outTag = tag;
    if (tag === "H1") outTag = "H2";
    else if (tag === "H4" || tag === "H5" || tag === "H6") outTag = "H3";
    else if (tag === "B") outTag = "STRONG";
    else if (tag === "I") outTag = "EM";

    if (!allowedTags.has(outTag)) {
      const frag = document.createDocumentFragment();
      Array.from(node.childNodes).forEach((child) => frag.appendChild(cleanNode(child)));
      // Preserva negrito/itálico/sublinhado vindo de <span> do Google Docs ou Word
      const style = (node.getAttribute("style") || "").toLowerCase();
      let wrapped = frag;
      if (/font-weight\s*:\s*(bold|[6-9]00)/.test(style)) {
        const strong = document.createElement("strong");
        strong.appendChild(wrapped);
        wrapped = strong;
      }
      if (/font-style\s*:\s*italic/.test(style)) {
        const em = document.createElement("em");
        em.appendChild(wrapped);
        wrapped = em;
      }
      if (/text-decoration[^;]*underline/.test(style)) {
        const u = document.createElement("u");
        u.appendChild(wrapped);
        wrapped = u;
      }
      return wrapped;
    }

    const el = document.createElement(outTag.toLowerCase());
    if (outTag === "BLOCKQUOTE" || (outTag === "DIV" && node.classList.contains("article-callout"))) {
      el.className = "article-callout";
    }
    Array.from(node.childNodes).forEach((child) => el.appendChild(cleanNode(child)));
    return el;
  }

  const wrapper = document.createElement("div");
  Array.from(tpl.content.childNodes).forEach((child) => wrapper.appendChild(cleanNode(child)));
  return wrapper.innerHTML.trim();
}

export function blocksToRichHtml(blocks = []) {
  const esc = (s = "") =>
    String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  return blocks
    .map((b) => {
      if (b.type === "h2") return `<h2>${esc(b.text)}</h2>`;
      if (b.type === "callout") return `<blockquote class="article-callout"><strong>${esc(b.title || "Destaque")}:</strong> ${esc(b.text)}</blockquote>`;
      if (b.type === "checklist") {
        const items = (b.items || []).map((i) => `<li>${esc(i)}</li>`).join("");
        return `<h3>${esc(b.title || "Pontos de Verificação")}</h3><ul>${items}</ul>`;
      }
      const p = esc(b.text || "").replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
      return `<p>${p}</p>`;
    })
    .join("");
}

// =========================================================================
// ACESSO UNIFICADO AO ACERVO REAL (INDEX + ARTIGO.HTML)
// =========================================================================
export function loadAllPosts() {
  let custom = [];
  let deleted = [];
  try {
    custom = JSON.parse(localStorage.getItem(STORAGE_KEYS.posts) || "[]");
    deleted = JSON.parse(localStorage.getItem(STORAGE_KEYS.deletedIds) || "[]");
  } catch {
    custom = [];
    deleted = [];
  }

  const customIds = new Set(custom.map((p) => p.id));
  const defaults = DEFAULT_POSTS.filter((p) => !deleted.includes(p.id) && !customIds.has(p.id));
  return [...custom, ...defaults];
}

export function saveCustomPost(post) {
  let custom = [];
  try {
    custom = JSON.parse(localStorage.getItem(STORAGE_KEYS.posts) || "[]");
  } catch {
    custom = [];
  }
  const idx = custom.findIndex((p) => p.id === post.id);
  if (idx >= 0) {
    custom[idx] = post;
  } else {
    custom.unshift(post);
  }
  localStorage.setItem(STORAGE_KEYS.posts, JSON.stringify(custom));
}

export function deletePostById(id) {
  let custom = [];
  let deleted = [];
  try {
    custom = JSON.parse(localStorage.getItem(STORAGE_KEYS.posts) || "[]");
    deleted = JSON.parse(localStorage.getItem(STORAGE_KEYS.deletedIds) || "[]");
  } catch {}
  custom = custom.filter((p) => p.id !== id);
  if (!deleted.includes(id)) deleted.push(id);
  localStorage.setItem(STORAGE_KEYS.posts, JSON.stringify(custom));
  localStorage.setItem(STORAGE_KEYS.deletedIds, JSON.stringify(deleted));
}

export function loadImageBank() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.imageBank);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {}
  return [...DEFAULT_IMAGE_BANK];
}

export function saveImageBank(items) {
  localStorage.setItem(STORAGE_KEYS.imageBank, JSON.stringify(items));
}

export function loadInstagramConfig() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.instagramCfg);
    if (raw) return JSON.parse(raw);
  } catch {}
  return {
    handle: "",
    hashtag: "#cleilsontst",
    feedUrl: ""
  };
}

export function saveInstagramConfig(cfg) {
  localStorage.setItem(STORAGE_KEYS.instagramCfg, JSON.stringify(cfg));
}

export function loadAnalyticsConfig() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.analyticsCfg);
    if (raw) return JSON.parse(raw);
  } catch {}
  return {
    monthlyReaders: 0,
    gaMeasurementId: ""
  };
}

export function saveAnalyticsConfig(cfg) {
  localStorage.setItem(STORAGE_KEYS.analyticsCfg, JSON.stringify(cfg));
}

// =========================================================================
// CÁLCULOS REAIS: TEMPO DE LEITURA, CONTADOR CONTÍNUO E ESPECIALIDADES
// =========================================================================
export function calculateReadTime(post) {
  const parts = [post.title || "", post.subtitle || "", ...(post.summary || [])];
  if (post.contentHtml) {
    parts.push(post.contentHtml.replace(/<[^>]+>/g, " "));
  } else {
    (post.content || []).forEach((b) => {
      if (b.text) parts.push(b.text);
      if (Array.isArray(b.items)) parts.push(b.items.join(" "));
    });
  }
  const words = parts.join(" ").trim().split(/\s+/).filter(Boolean).length;
  const mins = Math.max(1, Math.ceil(words / 200));
  return `${mins} min de leitura`;
}

export function extractDynamicSpecialties(posts) {
  const counts = new Map();

  for (const post of posts) {
    const bodyText = post.contentHtml
      ? post.contentHtml.replace(/<[^>]+>/g, " ")
      : (post.content || []).map((b) => (b.text || "") + " " + (b.items || []).join(" ")).join(" ");

    const fullText = [
      post.title,
      post.subtitle,
      post.categoryLabel,
      ...(post.summary || []),
      bodyText
    ].join(" ");

    const nrMatches = fullText.match(/\bNR[-\s]?\d{1,2}\b/gi) || [];
    const seenInPost = new Set();
    for (const m of nrMatches) {
      const normalized = m.toUpperCase().replace(/\s+/, "-").replace(/^NR(\d)/, "NR-$1");
      if (!seenInPost.has(normalized)) {
        seenInPost.add(normalized);
        counts.set(normalized, (counts.get(normalized) || 0) + 2);
      }
    }

    const topicChecks = [
      ["Offshore", /\boffshore\b/i],
      ["Onshore", /\bonshore\b/i],
      ["LOTO", /\bloto\b|bloqueio de energias/i],
      ["DDS", /\bdds\b|diálogo diário/i]
    ];
    for (const [label, regex] of topicChecks) {
      if (regex.test(fullText)) {
        counts.set(label, (counts.get(label) || 0) + 1);
      }
    }
  }

  const sorted = [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([key]) => key);

  const nrs = sorted.filter((k) => k.startsWith("NR-")).slice(0, 4);
  if (nrs.length > 0) return nrs;
  return sorted.slice(0, 3);
}

export function computeRealMetrics(posts, imageBank) {
  const analytics = loadAnalyticsConfig();
  const articlesCount = posts.length;
  const visualsCount = imageBank.length;
  const totalMaterials = articlesCount + visualsCount;
  const specialties = extractDynamicSpecialties(posts);
  const monthlyReaders = Number(analytics.monthlyReaders) || 0;

  return {
    articlesCount,
    visualsCount,
    totalMaterials,
    specialties,
    monthlyReaders,
    showMonthlyReaders: monthlyReaders >= SITE_CONFIG.minReadersToDisplay
  };
}
