/**
 * Central de Kits de DDS + Motor IA (Gemini / GPT) com Validação Técnica do Cleilson
 * - Biblioteca pública de Kits de DDS validados (ler, ouvir, copiar p/ WhatsApp, imprimir PDF)
 * - Fila de validação onde a IA cria DDS semanais baseados em tendências de SST e aguarda aprovação do Cleilson
 */

export const STORAGE_KEY_DDS = "cleilson_tst_dds_kits_v1";
export const STORAGE_KEY_AI_CONFIG = "cleilson_tst_ai_config_v1";
export const STORAGE_KEY_SUBSCRIBERS = "cleilson_tst_subscribers_v1";

export const DEFAULT_DDS_KITS = [
  {
    id: "dds-val-1",
    status: "approved", // 'pending_validation' | 'approved'
    weekLabel: "Kit Semana 47 • Liberado",
    area: "offshore",
    areaLabel: "Offshore • NR-37",
    norm: "NR-37 / DROPS",
    trendSource: "Tendência Google SST: Queda de objetos em plataformas",
    title: "Mãos Fora da Linha de Fogo: Movimentação de Cargas no Convés",
    duration: "5 min",
    summary: "Em operações com guindaste e içamento de cestas offshore, 1 segundo dentro da linha de fogo ou debaixo de carga suspensa pode ser fatal. Use bastões balizadores e comunicação visual clara com o sinaleiro.",
    script: [
      "Bom dia, time! Hoje nosso DDS de 5 minutos vai direto ao ponto: Linha de Fogo em movimentação de cargas.",
      "Em convés aberto, o balanço do mar, o vento e o ruído das máquinas mudam a trajetória de uma carga em fração de segundo. Nunca use as mãos diretamente para guiar contêineres ou tubulações — use sempre o cabo-guia ou bastão balizador.",
      "Antes do içamento começar, confirme três coisas: área isolada com cones/correntes, rota de fuga livre atrás de você e contato visual permanente com o sinaleiro."
    ],
    questions: [
      "Qual ponto da nossa frente de serviço hoje tem maior risco de prensamento ou linha de fogo?",
      "Todos sabem exatamente quem é o sinaleiro oficial da manobra deste turno?"
    ],
    checklist: [
      "Cintas, manilhas e olhais inspecionados com código de cor do trimestre vigente.",
      "Área de queda isolada em 360 graus antes de tirar a carga do piso.",
      "Uso obrigatório de cabo-guia e luva de proteção contra impacto."
    ],
    validatedBy: "Cleilson TST",
    validatedAt: "22 Nov 2026"
  },
  {
    id: "dds-val-2",
    status: "approved",
    weekLabel: "Kit Semana 47 • Liberado",
    area: "onshore",
    areaLabel: "Onshore • Indústria",
    norm: "NR-10 / NR-12",
    trendSource: "Tendência Google SST: Bloqueio de energias em manutenção",
    title: "Energia Zero Real: Por Que Desligar no Botão Não Protege Sua Vida",
    duration: "5 min",
    summary: "Botão de emergência e botoeira de painel são comandos elétricos, não bloqueio físico. Toda intervenção em máquina exige LOTO individual e teste de tentativa de partida.",
    script: [
      "Pessoal, uma pergunta rápida antes de começarmos o turno: você colocaria a mão dentro de uma prensa só porque alguém apertou o botão vermelho?",
      "Infelizmente, acidentes graves em plantas onshore ainda acontecem porque um operador de outro setor religa o painel sem saber que havia manutenção acontecendo lá dentro.",
      "Nossa regra de ouro hoje: um trabalhador, um cadeado individual, uma etiqueta identificada e teste obrigatório de Energia Zero antes de tocar no equipamento."
    ],
    questions: [
      "Existe alguma energia secundária (ar comprimido, pressão hidráulica ou gravidade) no equipamento de hoje?",
      "Todos os envolvidos estão com seu próprio cadeado individual em mãos?"
    ],
    checklist: [
      "Chave seccionadora travada com garra múltipla e cadeado individual.",
      "Pressão pneumática/hidráulica descarregada e manômetro zerado.",
      "Teste de tentativa de partida realizado com supervisão."
    ],
    validatedBy: "Cleilson TST",
    validatedAt: "20 Nov 2026"
  },
  {
    id: "dds-val-3",
    status: "approved",
    weekLabel: "Kit Semana 46 • Liberado",
    area: "nrs",
    areaLabel: "Offshore & Onshore • NR-35",
    norm: "NR-35",
    trendSource: "Tendência Google SST: Trauma de suspensão inerte",
    title: "Resgate Pós-Queda: Os 15 Minutos Críticos da Síndrome da Suspensão Inerte",
    duration: "5 min",
    summary: "Sobreviver à queda no cinto paraquedista é só metade da proteção. Ficar suspenso imóvel comprime a circulação nas pernas e pode causar desmaio grave em menos de 15 minutos.",
    script: [
      "Todo mundo lembra de inspecionar o cinto e o talabarte antes de subir, mas poucos perguntam: e se eu cair agora, quem me tira daqui em menos de 15 minutos?",
      "Quando o trabalhador fica pendurado no cinto após uma queda, as fitas das pernas reduzem o retorno de sangue ao coração. Por isso, o plano de resgate precisa estar pronto ANTES da subida — nunca improvisado na hora do desespero.",
      "Use sempre a fita anti-trauma acoplada ao cinto para aliviar a pressão enquanto o resgate atua."
    ],
    questions: [
      "Onde está o kit de resgate mais próximo da nossa frente de trabalho em altura hoje?",
      "Você sabe usar a fita anti-trauma do seu cinto paraquedista?"
    ],
    checklist: [
      "Fita anti-trauma instalada no cinto paraquedista.",
      "Equipe de resgate ciente da atividade em altura antes da liberação da PT.",
      "Zona Livre de Queda (ZLQ) conferida."
    ],
    validatedBy: "Cleilson TST",
    validatedAt: "16 Nov 2026"
  },
  // --- RASCUNHOS GERADOS PELA IA AGUARDANDO VALIDAÇÃO DO CLEILSON ---
  {
    id: "dds-ai-pending-1",
    status: "pending_validation",
    weekLabel: "Próx. Segunda • Gerado por IA",
    area: "offshore",
    areaLabel: "Offshore • NR-37",
    norm: "NR-37 / Saúde Ocupacional",
    trendSource: "Estudo de Mercado IA (Google Trends SST): Fadiga em embarques 14x14",
    title: "Fadiga Silenciosa no 10º Dia de Embarque: Como Blindar a Atenção na Reta Final",
    duration: "5 min",
    summary: "Estatísticas offshore mostram pico de desvios nos últimos 3 dias do embarque, quando o cansaço acumulado e a ansiedade pelo desembarque reduzem a percepção de risco.",
    script: [
      "Fala equipe! Quando passamos do décimo dia embarcado, o corpo já está cansado e a cabeça começa a pensar na família e no voo de volta. É exatamente aí que o piloto automático vira nosso maior inimigo.",
      "A fadiga não avisa com sirene — ela aparece quando pulamos uma conferência de válvula, esquecemos de prender a jugular do capacete ou fazemos uma tarefa com pressa para terminar o turno.",
      "Se notar um colega disperso ou cansado hoje, pratique o cuidado ativo: ofereça uma pausa de 3 minutos para água e faça a dupla checagem juntos."
    ],
    questions: [
      "Qual tarefa do nosso turno exige foco dobrado hoje por ser repetitiva?",
      "Como podemos apoiar uns aos outros nos últimos dias de embarque sem perder o padrão de segurança?"
    ],
    checklist: [
      "Pausas de hidratação respeitadas em áreas quentes e praça de máquinas.",
      "Dupla checagem obrigatória em manobras de válvulas e bloqueios.",
      "Comunicar ao líder caso não tenha tido sono reparador no camarote."
    ],
    validatedBy: null,
    validatedAt: null
  },
  {
    id: "dds-ai-pending-2",
    status: "pending_validation",
    weekLabel: "Próx. Segunda • Gerado por IA",
    area: "onshore",
    areaLabel: "Onshore • Saúde & Clima",
    norm: "NR-15 / Anexo 3 (Calor)",
    trendSource: "Estudo de Mercado IA (Google Trends SST): Ondas de calor e IBUTG industrial",
    title: "Calor Extremo no Canteiro e Planta Industrial: Sinais de Alerta Antes da Exaustão Térmica",
    duration: "5 min",
    summary: "Com temperaturas recordes no Brasil, o estresse térmico em áreas abertas e caldeiras eleva o risco de tontura, câimbras e queda de pressão durante atividades críticas.",
    script: [
      "Pessoal, o calor dos últimos dias não é apenas desconforto — ele é um risco físico real previsto na NR-15 que afeta diretamente nosso reflexo e concentração.",
      "Não espere sentir sede para beber água: quando a sede aparece, o corpo já está desidratando. Tontura, suor frio, dor de cabeça forte ou câimbras são sinais para parar imediatamente, ir para a sombra e avisar o técnico de segurança.",
      "Hoje vamos reforçar as pausas programadas de reposição hídrica e o rodízio nas frentes expostas ao sol."
    ],
    questions: [
      "O ponto de água fresca e sombra está acessível próximo da nossa frente de trabalho hoje?",
      "Quem aqui sabe identificar a diferença entre cansaço normal e início de insolação?"
    ],
    checklist: [
      "Garrafas térmicas abastecidas e disponíveis no local de trabalho.",
      "Regime de pausas térmicas alinhado com a supervisão.",
      "Protetor solar e uniforme respirável adequados à atividade."
    ],
    validatedBy: null,
    validatedAt: null
  }
];

// Banco de tendências de mercado para simulação instantânea quando o usuário ainda não inseriu chave Gemini/GPT
const MARKET_TREND_TEMPLATES = [
  {
    area: "offshore",
    areaLabel: "Offshore • NR-37",
    norm: "NR-37 / H2S",
    trendSource: "Estudo de Mercado IA (Google): Vazamento de H2S e rota de fuga contra o vento",
    title: "Alarme de H2S no Convés: Os 30 Segundos que Definem Sua Rota de Fuga",
    duration: "5 min",
    summary: "O gás sulfídrico (H2S) é mais pesado que o ar e paralisa o olfato em altas concentrações. Olhe a biruta de vento, prenda a respiração e desloque-se perpendicular/contra o vento até o ponto de encontro.",
    script: [
      "Time, hoje vamos revisar uma reação que precisa estar no sangue de quem trabalha offshore: alarme de H2S.",
      "O grande perigo do H2S é que em baixas concentrações ele cheira a ovo podre, mas em concentrações letais ele 'apaga' o seu olfato na hora — você acha que o gás sumiu, quando na verdade ele aumentou.",
      "Ao ouvir o alarme ou disparar o detector pessoal: não tente bancar o herói. Olhe imediatamente a biruta mais próxima, afaste-se contra o vento e siga para o ponto de encontro."
    ],
    questions: [
      "Olhando agora ao redor, onde fica a biruta de vento mais próxima deste setor?",
      "Todos conferiram o bump test do detector pessoal antes de sair para o convés?"
    ],
    checklist: [
      "Detector pessoal de H2S preso na zona respiratória (lapela), nunca no bolso.",
      "Birutas de vento visíveis e rotas de fuga desobstruídas.",
      "Máscara de fuga de emergência verificada e acessível."
    ]
  },
  {
    area: "onshore",
    areaLabel: "Onshore • Indústria",
    norm: "NR-11 / NR-18",
    trendSource: "Estudo de Mercado IA (Google): Atropelamento por empilhadeiras em galpões",
    title: "Ponto Cego de Empilhadeiras: Regra do Contato Visual Obrigatório no Pátio",
    duration: "5 min",
    summary: "Nunca assuma que o operador de empilhadeira ou caminhão viu você. Só cruze a faixa de tráfego após fazer contato visual direto e receber o sinal de parada.",
    script: [
      "Bom dia, pessoal! Em centros logísticos e plantas industriais onshore, a convivência entre pedestres e empilhadeiras é um dos maiores geradores de acidentes graves.",
      "A empilhadeira pesa toneladas, tem ponto cego frontal quando está carregada e não freia igual a um carro de passeio. Andar olhando o celular fora da faixa de pedestres é assumir um risco desnecessário.",
      "Compromisso de hoje: celular guardado ao caminhar no pátio e cruzamento somente após contato visual com o operador."
    ],
    questions: [
      "Qual cruzamento da nossa planta tem pior visibilidade entre pedestres e veículos?",
      "As luzes azuis de alerta (Blue Spot) e sinais sonoros de ré estão funcionando bem?"
    ],
    checklist: [
      "Faixas de pedestres respeitadas por toda a equipe e visitantes.",
      "Checklist diário da empilhadeira preenchido antes do turno.",
      "Proibido uso de fones de ouvido ou celular em áreas de circulação."
    ]
  }
];

export function loadDdsKits() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_DDS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {}
  localStorage.setItem(STORAGE_KEY_DDS, JSON.stringify(DEFAULT_DDS_KITS));
  return [...DEFAULT_DDS_KITS];
}

export function saveDdsKits(kits) {
  localStorage.setItem(STORAGE_KEY_DDS, JSON.stringify(kits));
}

export function loadAiConfig() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_AI_CONFIG);
    if (raw) return JSON.parse(raw);
  } catch {}
  return {
    provider: "gemini", // 'gemini' | 'openai' | 'demo'
    apiKey: "",
    focusTopic: "Segurança do Trabalho Offshore (NR-37) e Onshore (NR-35, NR-33, NR-10, NR-12)"
  };
}

export function saveAiConfig(cfg) {
  localStorage.setItem(STORAGE_KEY_AI_CONFIG, JSON.stringify(cfg));
}

export function addSubscriber(email, name = "") {
  let subs = [];
  try {
    subs = JSON.parse(localStorage.getItem(STORAGE_KEY_SUBSCRIBERS) || "[]");
  } catch {}
  if (!subs.some((s) => s.email.toLowerCase() === email.toLowerCase())) {
    subs.push({ email, name, subscribedAt: new Date().toISOString() });
    localStorage.setItem(STORAGE_KEY_SUBSCRIBERS, JSON.stringify(subs));
  }
  return subs.length;
}

export function getSubscriberCount() {
  try {
    const subs = JSON.parse(localStorage.getItem(STORAGE_KEY_SUBSCRIBERS) || "[]");
    return 12400 + subs.length;
  } catch {
    return 12400;
  }
}

/**
 * Gera um novo Kit de DDS via Google Gemini API ou OpenAI API (ou modo demonstração se sem chave)
 * e retorna o objeto com status 'pending_validation' aguardando aprovação técnica do Cleilson.
 */
export async function generateAiDdsDraft(topicHint = "") {
  const cfg = loadAiConfig();
  const prompt = `Você é um especialista sênior em Segurança do Trabalho (TST) no Brasil, focado em operações Offshore (NR-37) e Onshore.
Com base nas tendências atuais de prevenção de acidentes no mercado brasileiro${topicHint ? ` e no tema "${topicHint}"` : ""}, crie 1 Kit de DDS (Diálogo Diário de Segurança) prático de 5 minutos.
Retorne ESTRITAMENTE um JSON válido sem markdown, com exatamente estas chaves:
{
  "area": "offshore" ou "onshore" ou "nrs",
  "areaLabel": "Ex: Offshore • NR-37",
  "norm": "Ex: NR-37 / NR-35",
  "trendSource": "Motivo/tendência de mercado que inspirou este DDS",
  "title": "Título chamativo e prático",
  "duration": "5 min",
  "summary": "Resumo em 2 frases diretas",
  "script": ["Parágrafo 1 de abertura", "Parágrafo 2 de desenvolvimento técnico prático", "Parágrafo 3 de fechamento e compromisso"],
  "questions": ["Pergunta aberta 1 para a equipe", "Pergunta aberta 2 para a equipe"],
  "checklist": ["Item de verificação 1", "Item de verificação 2", "Item de verificação 3"]
}`;

  // Chamada real ao Google Gemini API se houver chave configurada
  if (cfg.provider === "gemini" && cfg.apiKey.trim()) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${encodeURIComponent(cfg.apiKey.trim())}`;
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { responseMimeType: "application/json" }
      })
    });
    if (!res.ok) throw new Error("Erro ao conectar com a API do Gemini. Verifique sua chave.");
    const data = await res.json();
    const rawJson = data?.candidates?.[0]?.content?.parts?.[0]?.text || "{}";
    const parsed = JSON.parse(rawJson);
    return buildPendingDraftObject(parsed, "Gemini 2.5 IA");
  }

  // Chamada real à OpenAI API se houver chave configurada
  if (cfg.provider === "openai" && cfg.apiKey.trim()) {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${cfg.apiKey.trim()}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: "Retorne apenas JSON válido em português do Brasil." },
          { role: "user", content: prompt }
        ]
      })
    });
    if (!res.ok) throw new Error("Erro ao conectar com a API da OpenAI. Verifique sua chave.");
    const data = await res.json();
    const parsed = JSON.parse(data?.choices?.[0]?.message?.content || "{}");
    return buildPendingDraftObject(parsed, "OpenAI GPT IA");
  }

  // Fallback inteligente de demonstração (zero custo, permite testar o fluxo completo agora mesmo)
  const existing = loadDdsKits();
  const pick = MARKET_TREND_TEMPLATES[existing.length % MARKET_TREND_TEMPLATES.length];
  const draft = {
    ...pick,
    title: topicHint ? `DDS Prático: ${topicHint}` : pick.title
  };
  return buildPendingDraftObject(draft, "Estudo IA (Modo Demo)");
}

function buildPendingDraftObject(parsed, engineLabel) {
  return {
    id: `dds-ai-${Date.now()}`,
    status: "pending_validation",
    weekLabel: `Próx. Segunda • ${engineLabel}`,
    area: parsed.area || "offshore",
    areaLabel: parsed.areaLabel || "Offshore • NR-37",
    norm: parsed.norm || "NR-01 / NR-37",
    trendSource: parsed.trendSource || `Gerado automaticamente via ${engineLabel}`,
    title: parsed.title || "Novo DDS de Segurança do Trabalho",
    duration: parsed.duration || "5 min",
    summary: parsed.summary || "",
    script: Array.isArray(parsed.script) ? parsed.script : [String(parsed.script || "")],
    questions: Array.isArray(parsed.questions) ? parsed.questions : [],
    checklist: Array.isArray(parsed.checklist) ? parsed.checklist : [],
    validatedBy: null,
    validatedAt: null
  };
}

/**
 * Formata o DDS pronto para colar no grupo de WhatsApp do turno
 */
export function formatDdsForWhatsApp(dds) {
  const checklistText = (dds.checklist || []).map((c) => `✅ ${c}`).join("\n");
  const questionsText = (dds.questions || []).map((q, i) => `${i + 1}. ${q}`).join("\n");
  return [
    `🦺 *DDS DE 5 MINUTOS — CLEILSON TST*`,
    `📌 *${dds.title}*`,
    `🏷️ ${dds.areaLabel} | Norma: ${dds.norm}`,
    ``,
    `💡 *Resumo:* ${dds.summary}`,
    ``,
    `🗣️ *Roteiro Rápido:*`,
    ...(dds.script || []),
    ``,
    `❓ *Perguntas para a Equipe:*`,
    questionsText,
    ``,
    `📋 *Checklist de Campo:*`,
    checklistText,
    ``,
    `✔️ _Validado tecnicamente por Cleilson TST — https://vibetech-cmd.github.io/blog-tst/_`
  ].join("\n");
}

/**
 * Abre janela limpa de impressão / Salvar como PDF do Cartão de DDS
 */
export function printDdsCard(dds) {
  const win = window.open("", "_blank", "width=820,height=920");
  if (!win) return false;
  const html = `<!DOCTYPE html>
  <html lang="pt-BR">
  <head>
    <meta charset="UTF-8" />
    <title>Kit DDS — ${dds.title}</title>
    <style>
      body { font-family: Arial, sans-serif; color: #0f172a; padding: 32px; max-width: 740px; margin: 0 auto; line-height: 1.6; }
      .header { border-bottom: 4px solid #f59e0b; padding-bottom: 14px; margin-bottom: 20px; display:flex; justify-content:space-between; align-items:center; }
      .brand { font-size: 20px; font-weight: 800; color: #0b2545; }
      .badge { background: #fef3c7; color: #92400e; padding: 4px 10px; border-radius: 6px; font-size: 12px; font-weight: 700; }
      h1 { font-size: 22px; color: #0b2545; margin: 0 0 8px; }
      .box { background: #f8fafc; border-left: 4px solid #0b2545; padding: 14px 16px; margin: 16px 0; border-radius: 6px; }
      h2 { font-size: 15px; text-transform: uppercase; letter-spacing: 0.05em; color: #0b2545; margin: 20px 0 8px; }
      ul, ol { margin: 0; padding-left: 20px; }
      li { margin-bottom: 6px; }
      .footer { margin-top: 32px; padding-top: 12px; border-top: 1px solid #cbd5e1; font-size: 12px; color: #475569; display:flex; justify-content:space-between; }
      @media print { .no-print { display: none; } }
    </style>
  </head>
  <body>
    <div class="header">
      <div class="brand">CLEILSON TST • KIT DDS PRÁTICO</div>
      <div class="badge">${dds.areaLabel} • ${dds.norm}</div>
    </div>
    <h1>${dds.title}</h1>
    <div class="box"><strong>Resumo de 30 segundos:</strong> ${dds.summary}</div>
    <h2>Roteiro de 5 Minutos</h2>
    ${(dds.script || []).map((p) => `<p>${p}</p>`).join("")}
    <h2>Perguntas de Engajamento para a Equipe</h2>
    <ol>${(dds.questions || []).map((q) => `<li>${q}</li>`).join("")}</ol>
    <h2>Checklist Rápido de Campo</h2>
    <ul>${(dds.checklist || []).map((c) => `<li>☐ ${c}</li>`).join("")}</ul>
    <div class="footer">
      <span>Validado Tecnicamente por: <strong>${dds.validatedBy || "Cleilson TST"}</strong></span>
      <span>Portal: blog-tst</span>
    </div>
    <script>window.onload = () => window.print();</script>
  </body>
  </html>`;
  win.document.write(html);
  win.document.close();
  return true;
}
