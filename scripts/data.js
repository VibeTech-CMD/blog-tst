/**
 * Base de Conteúdos — Portal Cleilson TST (Segurança do Trabalho Offshore & Onshore)
 * Estruturado para suportar Artigos (Texto), Vídeos Curtos (Pílulas) e Imagens/Infográficos.
 */

export const SITE_CONFIG = {
  brandName: "Cleilson TST",
  tagline: "Segurança do Trabalho • Offshore & Onshore",
  author: {
    name: "Cleilson",
    role: "Especialista em Segurança do Trabalho (TST) • Offshore & Onshore",
    bio: "Técnico em Segurança do Trabalho com vivência prática em plataformas marítimas (NR-37) e plantas industriais onshore. Traduzo normas complexas em rotinas simples que salvam vidas, evitam passivos e elevam a cultura de prevenção nas empresas.",
    avatar: "assets/images/author-cleilson.jpg",
    stats: [
      { value: "120+", label: "Guias & DDS Práticos" },
      { value: "45 mil", label: "Leitores Mensais" },
      { value: "NR-37 / 35 / 33", label: "Especialidade Técnica" }
    ],
    email: "contato@cleilsontst.com.br",
    whatsapp: "5521999999999",
    linkedin: "https://linkedin.com",
    instagram: "https://instagram.com"
  },
  sponsor: {
    label: "Patrocinador Oficial",
    name: "PrevGuard EPIs Offshore",
    headline: "Equipamentos certificados com CA atualizado para operações críticas em alto-mar e indústria pesada.",
    ctaText: "Solicitar Catálogo Corporativo",
    ctaUrl: "#anuncie"
  }
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
    readTime: "6 min de leitura",
    audioDuration: "4 min de áudio",
    views: "14,2 mil",
    featured: true,
    image: "assets/images/hero-offshore.jpg",
    imageCaption: "Inspeção pré-operacional em plataforma offshore: validação de PT, análise de risco e conferência de EPIs antichama.",
    summary: [
      "A NR-37 exige integração real entre a Permissão de Trabalho (PT), a Análise Preliminar de Risco (APR) e o bloqueio de energias (LOTO) — nunca aprove PTs genéricas 'copia e cola'.",
      "Atividades simultâneas (SIMOPS) são a causa nº 1 de desvios graves em plataformas: trabalho a quente perto de pintura ou movimentação de carga suspensa exige segregação total.",
      "Antes de assinar qualquer liberação, faça o 'Teste dos 3 Minutos' no local da tarefa conversando direto com o executante, nunca apenas da sala de controle.",
      "O direito de recusa deve ser reforçado no DDS de embarque como ferramenta de proteção, não como punição."
    ],
    practicalTip: "No próximo embarque, crie um checklist rápido de bolso com 5 itens obrigatórios de PT (LOTO, medição de gases calibrada, SIMOPS, fuga desobstruída e ciência da equipe). Reduz desvios de auditoria em até 70%.",
    content: [
      {
        type: "p",
        text: "Quem já embarcou em uma plataforma de petróleo e gás sabe que a rotina offshore não perdoa improvisos. Em um ambiente onde você trabalha, dorme e convive a poucos metros de vasos pressurizados, linhas de hidrocarbonetos e movimentação constante de cargas, a Segurança do Trabalho deixa de ser teoria de apostila e vira sobrevivência diária."
      },
      {
        type: "p",
        text: "A Norma Regulamentadora nº 37 (NR-37) consolidou as exigências específicas para plataformas de petróleo, mas na prática do dia a dia ainda vemos os mesmos 7 erros se repetindo durante a emissão de Permissões de Trabalho (PT). Como TST, o seu papel não é apenas carimbar papéis — é ser a última barreira inteligente antes da execução."
      },
      {
        type: "h2",
        text: "1. Aprovar APR genérica sem ir até a frente de serviço"
      },
      {
        type: "p",
        text: "O erro mais perigoso da rotina offshore é a chamada 'PT de ar-condicionado'. O executante traz o formulário preenchido na sala de PT, tudo parece bonito no papel, mas ao chegar no convés o piso está engordurado, há uma manutenção elétrica acontecendo dois metros acima ou o vento mudou a direção de eventual névoa de gás."
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
        text: "Em paradas programadas ou campanhas de manutenção, várias frentes trabalham ao mesmo tempo. Liberar um serviço a quente (solda ou esmerilhamento) abaixo de uma área com limpeza química ou abertura de linha é receita direta para emergência. O mapa de SIMOPS precisa ser atualizado a cada troca de turno."
      },
      {
        type: "h2",
        text: "3. Calibração e teste de resposta (Bump Test) do detector de gases"
      },
      {
        type: "p",
        text: "Não basta o equipamento estar com o certificado anual em dia. Antes de iniciar medição de H2S, LEL, O2 ou CO, o bump test diário precisa estar validado. Um sensor envenenado que marca zero por cento de explosividade em área classificada cria uma falsa sensação de segurança mortal."
      },
      {
        type: "checklist",
        title: "Checklist Rápido Pré-Liberação NR-37",
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
        text: "Quando o TST domina a NR-37 e atua ao lado da equipe operacional — ouvindo as dificuldades reais e propondo barreiras práticas — ele deixa de ser visto como 'o fiscal chato' e passa a ser respeitado como líder de prevenção. Salve este guia, compartilhe no grupo do seu turno e use no próximo DDS."
      }
    ]
  },
  {
    id: "post-2",
    slug: "dds-onshore-5-minutos-engajamento-real",
    type: "article",
    category: "onshore",
    categoryLabel: "Onshore • Cultura & DDS",
    badge: "Mais Lido",
    title: "Como Conduzir um DDS Onshore de 5 Minutos que a Equipe Realmente Escuta (Sem Cara de Sermão)",
    subtitle: "Esqueça a leitura robótica de folhas impressas. Veja a estrutura de 3 blocos que transforma o Diálogo Diário de Segurança em uma ferramenta real de prevenção industrial.",
    date: "19 Nov 2026",
    readTime: "5 min de leitura",
    audioDuration: "3 min de áudio",
    views: "11,8 mil",
    featured: false,
    image: "assets/images/onshore-industry.jpg",
    imageCaption: "Equipe onshore conduzindo alinhamento de segurança diretamente na planta industrial antes do início das atividades.",
    summary: [
      "DDS que dura mais de 10 minutos vira palestra cansativa e perde 80% da atenção da equipe operacional logo cedo.",
      "Use o método '1 Risco + 1 História Real + 1 Compromisso': conecte o tema diretamente à tarefa que o time vai executar naquela manhã.",
      "Faça perguntas abertas para os operadores mais experientes — quando a equipe fala, ela assume responsabilidade pela segurança."
    ],
    practicalTip: "Amanhã, não leia papel nenhum. Leve um EPI danificado ou uma foto de um desvio real (sem expor nomes) e pergunte: 'O que poderia dar errado aqui hoje?'",
    content: [
      {
        type: "p",
        text: "Em fábricas, refinarias, canteiros de obras e bases logísticas onshore, o Diálogo Diário de Segurança (DDS) muitas vezes virou uma obrigação burocrática: alguém lê um texto pronto de internet durante quinze minutos enquanto metade da equipe olha o celular ou pensa no café."
      },
      {
        type: "p",
        text: "A boa notícia é que você não precisa de slides nem de discursos longos para virar esse jogo. Os melhores profissionais de Segurança do Trabalho do mercado aplicam uma estrutura direta de 5 minutos que gera conexão imediata."
      },
      {
        type: "h2",
        text: "O Método 1-1-1 para DDS de Alta Conversão"
      },
      {
        type: "p",
        text: "Primeiro minuto: apresente UM risco específico da atividade de hoje (ex: prensamento de mãos na troca de válvulas ou queda de ferramentas). Segundo e terceiro minutos: conte UMA história real ou quase-acidente (sem caça às bruxas) mostrando a consequência prática. Últimos dois minutos: feche com UM compromisso coletivo visível no turno."
      },
      {
        type: "callout",
        title: "Dica de Ouro para TSTs em Campo",
        text: "O nome é DIÁLOGO Diário de Segurança, não monólogo. Se só você falou durante os 5 minutos, o DDS falhou."
      },
      {
        type: "p",
        text: "Aplique esse formato por duas semanas consecutivas e observe como os próprios operadores começam a reportar condições inseguras antes mesmo de o incidente acontecer."
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
    subtitle: "Entenda de uma vez por todas o cálculo que pode salvar um trabalhador de colidir com o solo mesmo estando de cinto paraquedista.",
    date: "15 Nov 2026",
    readTime: "7 min de leitura",
    audioDuration: "5 min de áudio",
    views: "9,4 mil",
    featured: false,
    image: "assets/images/nr35-height.jpg",
    imageCaption: "Operação em altura seguindo requisitos da NR-35 com ancoragem acima da linha dos ombros e supervisão técnica.",
    summary: [
      "Estar usando cinto paraquedista e talabarte NÃO garante segurança se a Zona Livre de Queda (ZLQ) for menor que a altura do trabalho.",
      "Sempre priorize Fator de Queda menor que 1 (ponto de ancoragem acima da cabeça). Fator de Queda 2 multiplica brutalmente o impacto no corpo.",
      "Em alturas baixas (entre 2m e 5m), substitua o talabarte comum com absorvedor por trava-quedas retrátil para evitar o impacto no solo."
    ],
    practicalTip: "Some: comprimento do talabarte + abertura do absorvedor de energia + altura do trabalhador até a argola dorsal + 1 metro de margem de segurança. Se o espaço abaixo for menor que isso, mude o sistema!",
    content: [
      {
        type: "p",
        text: "Um dos maiores mitos nas indústrias onshore e em plataformas offshore é achar que basta colocar o cinto tipo paraquedista e prender o gancho em qualquer tubulação para estar seguro segundo a NR-35."
      },
      {
        type: "p",
        text: "Na prática, um talabarte de 1,80m com absorvedor de energia que abre até 1,20m exige uma Zona Livre de Queda (ZLQ) de aproximadamente 5,5 metros. Se o colaborador estiver em um andaime de 3 metros de altura usando esse conjunto, em caso de queda ele vai atingir o chão antes mesmo de o absorvedor frear o corpo."
      },
      {
        type: "h2",
        text: "Fator de Queda 0, 1 e 2 na prática"
      },
      {
        type: "p",
        text: "Fator de Queda menor que 1 ocorre quando o ponto de ancoragem está acima da cabeça do trabalhador — é o cenário ideal. Fator 1 acontece na altura da cintura/dorsal. Já o Fator 2 ocorre quando o gancho é preso na altura dos pés, gerando uma queda livre equivalente ao dobro do comprimento do talabarte."
      },
      {
        type: "checklist",
        title: "Inspeção Obrigatória Pré-Uso NR-35",
        items: [
          "Verificar costuras, fitas desfiadas, queimaduras de solda ou contato com produtos químicos no cinto.",
          "Testar dupla trava dos mosquetões (devem fechar e travar automaticamente).",
          "Confirmar se o ponto de ancoragem possui resistência mínima certificada (15 kN para uma pessoa).",
          "Checar o plano de resgate: quem resgata o trabalhador suspenso em menos de 15 minutos?"
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
    title: "NR-33 em Tanques e Vasos: Por Que Mais de 60% das Fatalidades em Espaço Confinado São de Quem Tenta Resgatar",
    subtitle: "O papel inegociável do Vigia, a atmosfera IPVS e por que entrar sem plano de resgate transforma uma vítima em duas.",
    date: "11 Nov 2026",
    readTime: "5 min de leitura",
    audioDuration: "3 min de áudio",
    views: "8,7 mil",
    featured: false,
    image: "assets/images/onshore-industry.jpg",
    imageCaption: "Monitoramento contínuo e controle de acesso rigoroso em áreas de vasos e tanques industriais.",
    summary: [
      "Atmosferas com deficiência de oxigênio (abaixo de 19,5%) ou presença de H2S derrubam um trabalhador em segundos, sem aviso ou cheiro perceptível.",
      "O Vigia da NR-33 NUNCA pode abandonar a boca de visita e NUNCA deve entrar no espaço confinado para tentar resgate por impulso.",
      "A medição atmosférica precisa ser feita em três níveis (topo, meio e fundo), pois gases diferentes têm densidades diferentes."
    ],
    practicalTip: "Antes de liberar a PET (Permissão de Entrada e Trabalho), simule com o Vigia como ele vai acionar o resgate em 10 segundos sem sair do posto.",
    content: [
      {
        type: "p",
        text: "Espaços confinados estão presentes tanto em tanques de lastro e carga em plataformas offshore quanto em silos, caldeiras e galerias no ambiente onshore. O grande perigo é invisível: você não vê a falta de oxigênio e o gás sulfídrico (H2S) paralisa o olfato rapidamente."
      },
      {
        type: "p",
        text: "Estatísticas internacionais da OSHA e da Fundacentro mostram um dado chocante: mais da metade das mortes em espaços confinados acontece com colegas que, no desespero de ajudar quem desmaiou lá dentro, entram sem proteção respiratória autônoma e acabam sofrendo o mesmo destino."
      },
      {
        type: "callout",
        title: "Regra Inegociável da NR-33",
        text: "Vigia não entra. Vigia monitora, mantém comunicação constante, controla a entrada/saída e aciona a equipe de resgate equipada."
      },
      {
        type: "p",
        text: "Garanta sempre ventilação mecânica contínua (insuflamento de ar limpo, nunca oxigênio puro!), medição estratificada nos três níveis do tanque e comunicação testada antes da entrada."
      }
    ]
  },
  {
    id: "video-1",
    slug: "pilula-video-check-capacete-jugular-offshore",
    type: "video",
    category: "offshore",
    categoryLabel: "Vídeo Curto • Offshore",
    badge: "Reels / 45s",
    title: "Por que a jugular do capacete salva vidas no helideck e convés aberto?",
    subtitle: "Em 45 segundos, Cleilson mostra o risco de FOD (Foreign Object Damage) em pousos de helicóptero e quedas de nível.",
    date: "21 Nov 2026",
    readTime: "45 seg",
    audioDuration: "45 seg",
    views: "26,4 mil",
    featured: false,
    image: "assets/images/hero-offshore.jpg",
    imageCaption: "Pílula rápida em vídeo sobre uso correto de capacete Classe B com jugular de 3 pontos.",
    videoDuration: "0:45",
    summary: [
      "Em plataformas offshore, ventos fortes e o fluxo das pás do helicóptero transformam um capacete solto em projétil.",
      "Na primeira pancada de uma queda, um capacete sem jugular sai da cabeça antes do segundo impacto.",
      "Verifique sempre a validade do casco e da carneira — plástico ressecado pelo sol e maresia perde a absorção."
    ],
    practicalTip: "Ajuste a jugular de 3 pontos antes de cruzar a porta estanque para o convés externo.",
    content: [
      {
        type: "p",
        text: "Roteiro da Pílula em Vídeo (45 segundos): Fala pessoal, Cleilson aqui! Muita gente acha que jugular no capacete é frescura, mas em plataforma offshore o vento no convés facilmente passa dos 40 nós. Um capacete solto que voa perto do helideck ou cai de um nível superior sobre outro colega pode causar uma fatalidade."
      },
      {
        type: "p",
        text: "Regra simples: saiu da área interna, jugular afivelada e ajustada. E olha a dica extra: dê uma leve torcida no casco todo mês — se fizer barulho de plástico seco estalando, peça a troca imediata no almoxarifado."
      }
    ]
  },
  {
    id: "video-2",
    slug: "pilula-video-bloqueio-loto-60-segundos",
    type: "video",
    category: "onshore",
    categoryLabel: "Vídeo Curto • Onshore",
    badge: "Shorts / 60s",
    title: "LOTO em 60 segundos: 1 trabalhador = 1 cadeado individual (sem exceção!)",
    subtitle: "Nunca confie no botão 'Desliga' do painel. Entenda o passo a passo rápido do bloqueio de energias perigosas.",
    date: "18 Nov 2026",
    readTime: "1 min",
    audioDuration: "1 min",
    views: "19,1 mil",
    featured: false,
    image: "assets/images/onshore-industry.jpg",
    imageCaption: "Resumo em vídeo sobre Lockout/Tagout (LOTO) em manutenção industrial.",
    videoDuration: "1:00",
    summary: [
      "Desligar a botoeira de comando NÃO é bloqueio de energia — alguém pode religar à distância.",
      "Cada profissional que entra na manutenção coloca o SEU próprio cadeado e fica com a única chave no bolso.",
      "Sempre execute o passo final: testar a partida para confirmar Energia Zero antes de pôr a mão na máquina."
    ],
    practicalTip: "Se houver 5 mecânicos na linha, deve haver 5 cadeados na garra de bloqueio.",
    content: [
      {
        type: "p",
        text: "Roteiro da Pílula em Vídeo (60 segundos): Você colocaria sua mão dentro de uma engrenagem confiando apenas em um aviso de papel colado no painel? É exatamente isso que acontece quando alguém pula o LOTO."
      },
      {
        type: "p",
        text: "Os 4 passos que salvam dedos e vidas: 1) Identifique todas as energias (elétrica, pneumática, hidráulica, gravitacional); 2) Isole e trave com SEU cadeado individual; 3) Descarregue a energia residual; 4) Tente ligar o equipamento para provar que está em Energia Zero."
      }
    ]
  },
  {
    id: "video-3",
    slug: "pilula-video-direito-recusa-como-aplicar",
    type: "video",
    category: "dds",
    categoryLabel: "Vídeo Curto • Cultura",
    badge: "Reels / 50s",
    title: "Como exercer o Direito de Recusa de forma profissional e técnica (NR-01)",
    subtitle: "O passo a passo para paralisar uma atividade com risco grave e iminente com respaldo legal e respeito da liderança.",
    date: "14 Nov 2026",
    readTime: "50 seg",
    audioDuration: "50 seg",
    views: "31,5 mil",
    featured: false,
    image: "assets/images/nr35-height.jpg",
    imageCaption: "Direito de Recusa garantido pela NR-01: comunicação clara e foco na solução segura.",
    videoDuration: "0:50",
    summary: [
      "O Direito de Recusa é garantido por lei na NR-01 quando há risco grave e iminente para a vida ou saúde.",
      "Não é afronta à liderança: comunique o risco de forma objetiva, isole a área e chame o supervisor e o TST.",
      "A tarefa só retorna quando a medida de controle elimina ou neutraliza o risco identificado."
    ],
    practicalTip: "Use a frase técnica: 'Identifiquei um risco grave sem barreira de controle. Vamos pausar e alinhar a forma segura de executar?'",
    content: [
      {
        type: "p",
        text: "Roteiro da Pílula em Vídeo (50 segundos): Muita gente tem medo de aplicar o Direito de Recusa e ficar marcado na empresa. O segredo está na postura técnica: nunca transforme segurança em briga pessoal."
      },
      {
        type: "p",
        text: "Aponte o fato objetivo — por exemplo, falta de ponto de ancoragem ou vazamento próximo — comunique imediatamente seu líder imediato e registre a condição. Empresa séria premia quem evita acidente."
      }
    ]
  },
  {
    id: "img-1",
    slug: "infografico-comparativo-offshore-vs-onshore",
    type: "image",
    category: "offshore",
    categoryLabel: "Infográfico • Carreira TST",
    badge: "Guia Visual",
    title: "Infográfico: Rotina TST Offshore (14x14) vs. Onshore — O Que Muda nas Normas, Salários e Desafios?",
    subtitle: "Um comparativo visual direto para quem quer migrar para o embarque marítimo ou consolidar carreira em plantas industriais.",
    date: "17 Nov 2026",
    readTime: "2 min (Visual)",
    audioDuration: "2 min de áudio",
    views: "22,9 mil",
    featured: false,
    image: "assets/images/hero-offshore.jpg",
    imageCaption: "Infográfico comparativo preparado por Cleilson para profissionais e estudantes de Segurança do Trabalho.",
    summary: [
      "Offshore exige CBSP, HUET, inglês técnico e domínio profundo da NR-37, com regime típico 14x14 e adicionais de embarque.",
      "Onshore oferece retorno diário para casa, forte atuação em NR-10, NR-12, NR-33, NR-35 e gestão de GRO/PGR.",
      "Ambos os mercados valorizam quem une domínio normativo com comunicação clara junto à operação."
    ],
    practicalTip: "Salve esta imagem e compartilhe no grupo de estudos ou LinkedIn para ajudar outros TSTs a planejarem a carreira.",
    content: [
      {
        type: "p",
        text: "Uma das perguntas que mais recebo de técnicos recém-formados e profissionais experientes é: vale a pena investir nos cursos para embarcar offshore ou crescer em grandes indústrias onshore?"
      },
      {
        type: "checklist",
        title: "Comparativo Rápido — Offshore vs. Onshore",
        items: [
          "Norma Principal: Offshore foca fortemente na NR-37 + normas internacionais (NORMAM/SOLAS); Onshore foca em NR-01 (PGR), NR-12, NR-18, NR-33 e NR-35.",
          "Certificações de Entrada: Offshore exige CBSP e HUET (além de T-HUET dependendo da operadora); Onshore valoriza eSocial SST, higiene ocupacional e gestão de PGR.",
          "Escala de Trabalho: Offshore geralmente 14 dias embarcado x 14 dias de folga; Onshore horário comercial ou turnos industriais.",
          "Habilidade Chave: Em ambos, liderança pelo exemplo e clareza na análise de risco valem mais do que decorar artigos."
        ]
      }
    ]
  },
  {
    id: "img-2",
    slug: "infografico-hierarquia-controles-epi",
    type: "image",
    category: "dds",
    categoryLabel: "Infográfico • DDS Visual",
    badge: "Pronto p/ Imprimir",
    title: "Cartaz Visual para Mural de DDS: Por Que o EPI é Sempre a ÚLTIMA Barreira (Hierarquia de Controles)",
    subtitle: "Imagem pronta para usar no quadro de avisos da empresa ou mandar no WhatsApp da equipe antes do turno.",
    date: "12 Nov 2026",
    readTime: "2 min (Visual)",
    audioDuration: "2 min de áudio",
    views: "16,3 mil",
    featured: false,
    image: "assets/images/nr35-height.jpg",
    imageCaption: "A pirâmide invertida da Hierarquia de Controles: Eliminação, Substituição, Engenharia, Administrativo e EPI.",
    summary: [
      "1º Eliminar o risco e 2º Substituir são as medidas mais eficazes (ex: fazer o trabalho no nível do solo em vez de subir).",
      "3º Controles de Engenharia (guarda-corpo, enclausuramento de máquinas) protegem todos sem depender de memória.",
      "5º O EPI é essencial, mas é a última linha de defesa — protege apenas quando todas as barreiras anteriores não eliminaram o perigo."
    ],
    practicalTip: "Use este roteiro visual no DDS de segunda-feira e peça para a equipe dar um exemplo de proteção coletiva (EPC) no setor.",
    content: [
      {
        type: "p",
        text: "Quando pensamos em segurança, a primeira imagem que vem à cabeça é capacete, luva e óculos. Mas na engenharia de segurança e no PGR (NR-01), o EPI é sempre a última barreira — nunca a primeira."
      },
      {
        type: "checklist",
        title: "Os 5 Degraus da Hierarquia de Controles",
        items: [
          "1. Eliminação: Remover fisicamente o perigo (mais eficaz).",
          "2. Substituição: Trocar um produto químico tóxico ou processo perigoso por outro mais seguro.",
          "3. Controles de Engenharia (EPC): Isolar pessoas do perigo com proteções físicas, exaustão e guarda-corpos.",
          "4. Controles Administrativos: Procedimentos, sinalização, rodízio de tarefas, PT e treinamentos.",
          "5. EPI: Equipamento de Proteção Individual — última barreira no corpo do trabalhador."
        ]
      }
    ]
  }
];
