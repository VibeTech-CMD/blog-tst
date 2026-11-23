import { SITE_CONFIG, DEFAULT_POSTS } from "./data.js";
import { AutoReader } from "./tts.js";
import {
  loadDdsKits,
  saveDdsKits,
  loadAiConfig,
  saveAiConfig,
  generateAiDdsDraft,
  formatDdsForWhatsApp,
  printDdsCard,
  addSubscriber,
  getSubscriberCount
} from "./dds-hub.js";

const STORAGE_KEY_POSTS = "cleilson_tst_custom_posts_v1";
const STORAGE_KEY_THEME = "cleilson_tst_theme_v1";

const state = {
  posts: [],
  ddsKits: [],
  ddsArea: "all",
  activeDdsModal: null,
  category: "all",
  format: "all",
  search: "",
  currentPost: null
};

const els = {
  readingProgress: document.getElementById("reading-progress"),
  homeView: document.getElementById("home-view"),
  articleView: document.getElementById("article-view"),
  heroFeatured: document.getElementById("hero-featured"),
  sponsorName: document.getElementById("sponsor-name"),
  sponsorHeadline: document.getElementById("sponsor-headline"),
  sponsorCta: document.getElementById("sponsor-cta"),
  postsGrid: document.getElementById("posts-grid"),
  feedStatus: document.getElementById("feed-status"),
  trendingList: document.getElementById("trending-list"),
  shortsGrid: document.getElementById("shorts-grid"),
  infographicsGrid: document.getElementById("infographics-grid"),
  aboutBioText: document.getElementById("about-bio-text"),
  aboutStats: document.getElementById("about-stats"),
  searchInput: document.getElementById("search-input"),
  themeToggle: document.getElementById("theme-toggle"),
  mobileMenuBtn: document.getElementById("mobile-menu-btn"),
  mainNav: document.getElementById("main-nav"),

  // Central de Kits de DDS
  ddsKitsGrid: document.getElementById("dds-kits-grid"),
  pendingDdsBadge: document.getElementById("pending-dds-badge"),
  studioPendingCount: document.getElementById("studio-pending-count"),
  ddsSubCounter: document.getElementById("dds-sub-counter"),
  pendingDdsList: document.getElementById("pending-dds-list"),
  aiTopicInput: document.getElementById("ai-topic-input"),
  generateAiDdsBtn: document.getElementById("generate-ai-dds-btn"),
  exportDdsJsonBtn: document.getElementById("export-dds-json-btn"),
  ddsReaderModal: document.getElementById("dds-reader-modal"),
  ddsModalBadge: document.getElementById("dds-modal-badge"),
  ddsModalTitle: document.getElementById("dds-modal-title"),
  ddsModalContent: document.getElementById("dds-modal-content"),
  ddsModalListen: document.getElementById("dds-modal-listen"),
  ddsModalWhatsapp: document.getElementById("dds-modal-whatsapp"),
  ddsModalPrint: document.getElementById("dds-modal-print"),

  // Article view
  backToHome: document.getElementById("back-to-home"),
  artCategoryBadge: document.getElementById("art-category-badge"),
  artTitle: document.getElementById("art-title"),
  artSubtitle: document.getElementById("art-subtitle"),
  artMetaDetails: document.getElementById("art-meta-details"),
  artSummaryList: document.getElementById("art-summary-list"),
  artPracticalTip: document.getElementById("art-practical-tip"),
  artImage: document.getElementById("art-image"),
  artImageCaption: document.getElementById("art-image-caption"),
  artBody: document.getElementById("art-body"),
  relatedGrid: document.getElementById("related-grid"),
  shareWhatsapp: document.getElementById("share-whatsapp"),
  shareLinkedin: document.getElementById("share-linkedin"),
  shareCopy: document.getElementById("share-copy"),

  // TTS Player
  ttsWaveBadge: document.getElementById("tts-wave-badge"),
  ttsEnginePill: document.getElementById("tts-engine-pill"),
  ttsStatusText: document.getElementById("tts-status-text"),
  ttsPlaySummary: document.getElementById("tts-play-summary"),
  ttsPlayFull: document.getElementById("tts-play-full"),
  ttsTogglePause: document.getElementById("tts-toggle-pause"),
  ttsStop: document.getElementById("tts-stop"),
  ttsProgressFill: document.getElementById("tts-progress-fill"),
  ttsProgressLabel: document.getElementById("tts-progress-label"),
  ttsRate: document.getElementById("tts-rate"),
  ttsVoice: document.getElementById("tts-voice"),

  // Modais e Formulários
  editorModal: document.getElementById("editor-modal"),
  privacyModal: document.getElementById("privacy-modal"),
  editorForm: document.getElementById("editor-form"),
  voiceAiConfigForm: document.getElementById("voice-ai-config-form"),
  exportJsonBtn: document.getElementById("export-json-btn"),
  toast: document.getElementById("toast")
};

// =========================================================================
// MOTOR DE AUTO-LEITURA HUMANIZADA (TTS)
// =========================================================================
let highlightedEl = null;

const reader = new AutoReader({
  onVoicesLoaded: (voices, selectedURI, isHighQuality) => {
    if (!els.ttsVoice) return;
    if (voices.length === 0) {
      els.ttsVoice.innerHTML = `<option value="">Voz PT-BR padrão</option>`;
      return;
    }
    els.ttsVoice.innerHTML = voices
      .map((v) => {
        const tag = /natural|neural|online|google/i.test(v.name) ? "★ " : "";
        return `<option value="${escapeHtml(v.voiceURI)}" ${v.voiceURI === selectedURI ? "selected" : ""}>${tag}${escapeHtml(v.name)}</option>`;
      })
      .join("");

    if (!reader.getNeuralConfig().apiKey && els.ttsEnginePill) {
      els.ttsEnginePill.textContent = isHighQuality ? "★ Voz Natural HD" : "Prosódia SST • Dica: Voz HD";
    }
  },
  onStateChange: ({ supported, isPlaying, isPaused, mode, engine, hasNeuralConfigured }) => {
    if (!supported) {
      els.ttsStatusText.textContent = "Seu navegador não suporta áudio nativo. Configure Voz Neural HD em ⚙ Voz HD.";
      return;
    }

    if (els.ttsEnginePill) {
      if (hasNeuralConfigured || engine === "openai" || engine === "elevenlabs") {
        els.ttsEnginePill.textContent = "✨ Voz Neural HD (IA)";
      }
    }

    els.ttsTogglePause.disabled = !isPlaying;
    els.ttsStop.disabled = !isPlaying;
    els.ttsTogglePause.textContent = isPaused ? "Retomar" : "Pausar";

    if (isPlaying && !isPaused) {
      els.ttsWaveBadge.classList.add("playing");
      els.ttsStatusText.textContent =
        mode === "summary"
          ? "Narrando o Resumo Executivo com ritmo fluido..."
          : mode === "dds"
          ? "Narrando Kit de DDS em voz humanizada..."
          : "Narrando o conteúdo completo com pausas naturais...";
    } else if (isPlaying && isPaused) {
      els.ttsWaveBadge.classList.remove("playing");
      els.ttsStatusText.textContent = "Auto-leitura pausada.";
    } else {
      els.ttsWaveBadge.classList.remove("playing");
      els.ttsStatusText.textContent = "Com pronúncia técnica de SST e pausas naturais. Aperte o play para ouvir!";
      els.ttsProgressFill.style.width = "0%";
      els.ttsProgressLabel.textContent = "Pronto";
    }
  },
  onProgress: (current, total) => {
    if (!total) {
      els.ttsProgressFill.style.width = "0%";
      els.ttsProgressLabel.textContent = "Pronto";
      return;
    }
    const pct = Math.min(100, Math.round((current / total) * 100));
    els.ttsProgressFill.style.width = `${pct}%`;
    els.ttsProgressLabel.textContent = `${pct}%`;
  },
  onHighlight: (elementId) => {
    if (highlightedEl) {
      highlightedEl.classList.remove("tts-reading-active");
      highlightedEl = null;
    }
    if (!elementId) return;
    const target = document.getElementById(elementId);
    if (target) {
      target.classList.add("tts-reading-active");
      highlightedEl = target;
      const rect = target.getBoundingClientRect();
      if (rect.top < 110 || rect.bottom > window.innerHeight - 80) {
        target.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  }
});

// =========================================================================
// UTILITÁRIOS
// =========================================================================
function escapeHtml(str = "") {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function showToast(message) {
  els.toast.textContent = message;
  els.toast.hidden = false;
  clearTimeout(showToast._timer);
  showToast._timer = setTimeout(() => {
    els.toast.hidden = true;
  }, 3800);
}

function formatTypeBadge(type) {
  if (type === "video") return "▶ Vídeo Curto";
  if (type === "image") return "🖼 Infográfico";
  return "📄 Artigo";
}

function loadPosts() {
  let custom = [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY_POSTS);
    if (raw) custom = JSON.parse(raw);
  } catch {
    custom = [];
  }
  state.posts = [...custom, ...DEFAULT_POSTS];
}

function saveCustomPost(newPost) {
  let custom = [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY_POSTS);
    if (raw) custom = JSON.parse(raw);
  } catch {
    custom = [];
  }
  custom.unshift(newPost);
  localStorage.setItem(STORAGE_KEY_POSTS, JSON.stringify(custom));
  loadPosts();
}

// =========================================================================
// RENDERIZAÇÃO DA HOME & CENTRAL DE KITS DE DDS
// =========================================================================
function renderStaticBranding() {
  els.sponsorName.textContent = SITE_CONFIG.sponsor.name;
  els.sponsorHeadline.textContent = SITE_CONFIG.sponsor.headline;
  els.sponsorCta.textContent = SITE_CONFIG.sponsor.ctaText;
  els.aboutBioText.textContent = SITE_CONFIG.author.bio;
  els.aboutStats.innerHTML = SITE_CONFIG.author.stats
    .map(
      (s) => `
      <div class="stat-card">
        <strong>${escapeHtml(s.value)}</strong>
        <span>${escapeHtml(s.label)}</span>
      </div>`
    )
    .join("");
  if (els.ddsSubCounter) {
    els.ddsSubCounter.textContent = getSubscriberCount().toLocaleString("pt-BR");
  }
}

function renderHero() {
  const featured = state.posts.find((p) => p.featured) || state.posts[0];
  if (!featured) return;

  els.heroFeatured.innerHTML = `
    <div class="hero-media" data-open-slug="${escapeHtml(featured.slug)}">
      <img src="${escapeHtml(featured.image)}" alt="${escapeHtml(featured.title)}" />
      <div class="hero-media-badges">
        <span class="badge-amber">${escapeHtml(featured.badge || "Destaque")}</span>
        <span class="badge-dark">${escapeHtml(featured.categoryLabel)}</span>
      </div>
    </div>
    <div class="hero-content">
      <div class="hero-meta">
        <span>Por <strong>Cleilson</strong></span>
        <span>•</span>
        <span>${escapeHtml(featured.date)}</span>
        <span>•</span>
        <span>${escapeHtml(featured.readTime)}</span>
        <span>•</span>
        <span>🔊 ${escapeHtml(featured.audioDuration || "Com Auto-Leitura")}</span>
      </div>
      <h1 data-open-slug="${escapeHtml(featured.slug)}">${escapeHtml(featured.title)}</h1>
      <p>${escapeHtml(featured.subtitle)}</p>
      <div class="hero-actions">
        <button type="button" class="btn btn-primary" data-open-slug="${escapeHtml(featured.slug)}">Ler Artigo + Resumo</button>
        <button type="button" class="btn btn-dark" data-listen-slug="${escapeHtml(featured.slug)}">🔊 Ouvir Agora (Áudio)</button>
      </div>
    </div>
  `;
}

function renderFeed() {
  const q = state.search.trim().toLowerCase();
  const filtered = state.posts.filter((post) => {
    const matchCat = state.category === "all" || post.category === state.category;
    const matchFmt = state.format === "all" || post.type === state.format;
    const matchSearch =
      !q ||
      post.title.toLowerCase().includes(q) ||
      post.subtitle.toLowerCase().includes(q) ||
      post.categoryLabel.toLowerCase().includes(q);
    return matchCat && matchFmt && matchSearch;
  });

  if (q || state.category !== "all" || state.format !== "all") {
    els.feedStatus.hidden = false;
    els.feedStatus.textContent = `Exibindo ${filtered.length} publicação(ões) encontrada(s).`;
  } else {
    els.feedStatus.hidden = true;
  }

  if (filtered.length === 0) {
    els.postsGrid.innerHTML = `
      <div class="sidebar-card" style="grid-column: 1 / -1; text-align:center; padding: 36px;">
        <h3>Nenhuma publicação encontrada</h3>
        <p style="color:var(--text-muted)">Tente limpar o filtro ou buscar por termos como "NR-37", "Offshore", "LOTO" ou "DDS".</p>
      </div>`;
    return;
  }

  const cardsHtml = [];
  filtered.forEach((post, idx) => {
    cardsHtml.push(`
      <article class="post-card">
        <div class="post-card-media" data-open-slug="${escapeHtml(post.slug)}">
          <img src="${escapeHtml(post.image)}" alt="${escapeHtml(post.title)}" loading="lazy" />
          <span class="card-type-pill">${formatTypeBadge(post.type)}</span>
          <span class="card-audio-pill">🔊 Auto-Leitura</span>
        </div>
        <div class="post-card-body">
          <div class="post-card-meta">
            <span class="post-card-cat">${escapeHtml(post.categoryLabel)}</span>
            <span>${escapeHtml(post.readTime)}</span>
          </div>
          <h3 class="post-card-title" data-open-slug="${escapeHtml(post.slug)}">${escapeHtml(post.title)}</h3>
          <p class="post-card-excerpt">${escapeHtml(post.subtitle)}</p>
          <div class="post-card-footer">
            <button type="button" class="card-action-link" data-open-slug="${escapeHtml(post.slug)}">Ler + Resumo 30s →</button>
            <button type="button" class="card-listen-btn" data-listen-slug="${escapeHtml(post.slug)}">▶ Ouvir</button>
          </div>
        </div>
      </article>
    `);

    if (idx === 1) {
      cardsHtml.push(`
        <aside class="ad-infeed" aria-label="Publicidade no feed">
          <div>
            <div class="ad-badge">PUBLICIDADE IN-FEED • ADSENSE / PATROCINADOR</div>
            <h4>Precisa equipar sua equipe com EPIs certificados ou treinar NRs?</h4>
            <p>Espaço nativo de altíssimo CTR posicionado entre os artigos mais acessados do portal.</p>
          </div>
          <a href="#anuncie" class="btn btn-primary btn-sm">Anunciar Aqui</a>
        </aside>
      `);
    }
  });

  els.postsGrid.innerHTML = cardsHtml.join("");
}

function renderDdsHub() {
  const approved = state.ddsKits.filter((k) => k.status === "approved");
  const pending = state.ddsKits.filter((k) => k.status === "pending_validation");

  if (els.pendingDdsBadge) els.pendingDdsBadge.textContent = pending.length;
  if (els.studioPendingCount) els.studioPendingCount.textContent = pending.length;

  const visible = approved.filter((k) => state.ddsArea === "all" || k.area === state.ddsArea);

  els.ddsKitsGrid.innerHTML = visible
    .map(
      (dds) => `
      <article class="dds-kit-card">
        <div class="dds-kit-top">
          <span class="badge-cat">${escapeHtml(dds.areaLabel)}</span>
          <span class="dds-verified-pill">✓ Validado por ${escapeHtml(dds.validatedBy || "Cleilson TST")}</span>
        </div>
        <h3>${escapeHtml(dds.title)}</h3>
        <p class="dds-kit-summary">${escapeHtml(dds.summary)}</p>
        <div class="dds-kit-meta">
          <span>📋 Norma: <strong>${escapeHtml(dds.norm)}</strong></span>
          <span>⏱ ${escapeHtml(dds.duration)}</span>
        </div>
        <div class="dds-kit-actions">
          <button type="button" class="btn btn-primary btn-sm" data-open-dds="${escapeHtml(dds.id)}">Abrir Roteiro + Checklist</button>
          <button type="button" class="btn btn-dark btn-sm" data-listen-dds="${escapeHtml(dds.id)}">🔊 Ouvir</button>
          <button type="button" class="card-listen-btn" data-wa-dds="${escapeHtml(dds.id)}" title="Copiar para WhatsApp">WhatsApp</button>
          <button type="button" class="card-listen-btn" data-pdf-dds="${escapeHtml(dds.id)}" title="Imprimir ou Salvar PDF">PDF</button>
        </div>
      </article>`
    )
    .join("");
}

function renderPendingDdsQueue() {
  const pending = state.ddsKits.filter((k) => k.status === "pending_validation");
  if (els.pendingDdsBadge) els.pendingDdsBadge.textContent = pending.length;
  if (els.studioPendingCount) els.studioPendingCount.textContent = pending.length;

  if (pending.length === 0) {
    els.pendingDdsList.innerHTML = `
      <div class="pending-empty">
        <strong>Tudo validado! 🎉</strong>
        <p>Nenhum DDS aguardando revisão. Clique em <strong>"Pesquisar &amp; Gerar DDS com IA"</strong> acima para criar novos rascunhos para a próxima segunda-feira.</p>
      </div>`;
    return;
  }

  els.pendingDdsList.innerHTML = pending
    .map(
      (dds) => `
      <div class="pending-dds-card" data-pending-id="${escapeHtml(dds.id)}">
        <div class="pending-card-head">
          <span class="pill-pending">AGUARDANDO VALIDAÇÃO DO CLEILSON</span>
          <span class="pending-source">${escapeHtml(dds.trendSource)}</span>
        </div>
        <div class="form-row-2" style="margin-top:10px">
          <div class="form-group">
            <label>Título do DDS (editável)</label>
            <input type="text" class="pend-title" value="${escapeHtml(dds.title)}" />
          </div>
          <div class="form-group">
            <label>Norma / Referência</label>
            <input type="text" class="pend-norm" value="${escapeHtml(dds.norm)}" />
          </div>
        </div>
        <div class="form-group" style="margin-top:8px">
          <label>Resumo Executivo</label>
          <textarea class="pend-summary" rows="2">${escapeHtml(dds.summary)}</textarea>
        </div>
        <div class="form-group" style="margin-top:8px">
          <label>Roteiro de 5 Minutos (separe parágrafos com linha em branco)</label>
          <textarea class="pend-script" rows="4">${escapeHtml((dds.script || []).join("\n\n"))}</textarea>
        </div>
        <div class="form-group" style="margin-top:8px">
          <label>Checklist de Campo (um item por linha)</label>
          <textarea class="pend-checklist" rows="3">${escapeHtml((dds.checklist || []).join("\n"))}</textarea>
        </div>
        <div class="pending-card-actions">
          <button type="button" class="btn btn-outline-dark btn-sm" data-reject-dds="${escapeHtml(dds.id)}">Descartar</button>
          <button type="button" class="btn btn-primary btn-sm" data-approve-dds="${escapeHtml(dds.id)}">✓ Validar Tecnicamente e Liberar p/ Segunda-feira</button>
        </div>
      </div>`
    )
    .join("");
}

function openDdsModal(ddsId) {
  const dds = state.ddsKits.find((k) => k.id === ddsId);
  if (!dds) return;
  state.activeDdsModal = dds;

  els.ddsModalBadge.textContent = `${dds.areaLabel} • ${dds.norm} • Validado por ${dds.validatedBy || "Cleilson TST"}`;
  els.ddsModalTitle.textContent = dds.title;
  els.ddsModalContent.innerHTML = `
    <div class="summary-box" style="margin-bottom:16px">
      <span class="summary-pill">RESUMO RÁPIDO (30s)</span>
      <p style="margin:6px 0 0">${escapeHtml(dds.summary)}</p>
    </div>
    <h4>Roteiro de 5 Minutos para o Turno</h4>
    ${(dds.script || []).map((p, i) => `<p id="dds-line-${i}">${escapeHtml(p)}</p>`).join("")}
    <h4>Perguntas de Engajamento para a Equipe</h4>
    <ol>${(dds.questions || []).map((q) => `<li>${escapeHtml(q)}</li>`).join("")}</ol>
    <div class="article-checklist" style="margin:14px 0 0">
      <h3>Checklist Rápido de Campo</h3>
      <ul>${(dds.checklist || []).map((c) => `<li>${escapeHtml(c)}</li>`).join("")}</ul>
    </div>
  `;
  els.ddsReaderModal.hidden = false;
}

function listenToDds(ddsId) {
  const dds = state.ddsKits.find((k) => k.id === ddsId);
  if (!dds) return;
  const segments = [
    { text: `Kit Dê Dê Ésse validado por Cleilson. ${dds.title}`, kind: "title" },
    { text: dds.summary, kind: "body" },
    ...(dds.script || []).map((p, i) => ({ text: p, elementId: `dds-line-${i}`, kind: "body" })),
    { text: `Checklist de campo: ${(dds.checklist || []).join(". ")}`, kind: "tip" }
  ];
  reader.start(segments, "dds");
  showToast("🔊 Reproduzindo Kit de DDS em voz humanizada...");
}

function renderTrending() {
  const top = state.posts.slice(0, 5);
  els.trendingList.innerHTML = top
    .map(
      (p, i) => `
      <li class="trending-item" data-open-slug="${escapeHtml(p.slug)}">
        <span class="trending-num">0${i + 1}</span>
        <div>
          <h4>${escapeHtml(p.title)}</h4>
          <small>${escapeHtml(p.categoryLabel)} • ${escapeHtml(p.views || "5,2 mil")} leituras</small>
        </div>
      </li>`
    )
    .join("");
}

function renderShorts() {
  const videos = state.posts.filter((p) => p.type === "video");
  els.shortsGrid.innerHTML = videos
    .map(
      (v) => `
      <article class="short-card" data-open-slug="${escapeHtml(v.slug)}">
        <img src="${escapeHtml(v.image)}" alt="${escapeHtml(v.title)}" loading="lazy" />
        <div class="short-overlay">
          <div class="short-play-icon" aria-hidden="true">▶</div>
          <span class="short-duration">${escapeHtml(v.videoDuration || v.readTime)} • Com Áudio</span>
          <h3>${escapeHtml(v.title)}</h3>
          <p>${escapeHtml(v.subtitle)}</p>
        </div>
      </article>`
    )
    .join("");
}

function renderInfographics() {
  const imgs = state.posts.filter((p) => p.type === "image");
  els.infographicsGrid.innerHTML = imgs
    .map(
      (item) => `
      <article class="info-card" data-open-slug="${escapeHtml(item.slug)}">
        <img src="${escapeHtml(item.image)}" alt="${escapeHtml(item.title)}" loading="lazy" />
        <div class="info-card-body">
          <span class="badge-cat">${escapeHtml(item.badge || "Guia Visual")}</span>
          <h3>${escapeHtml(item.title)}</h3>
          <p>${escapeHtml(item.subtitle)}</p>
          <span class="card-action-link">Abrir Infográfico &amp; Checklist →</span>
        </div>
      </article>`
    )
    .join("");
}

// =========================================================================
// LEITOR DE ARTIGO + AUTO-LEITURA + RESUMO 30s
// =========================================================================
function openArticle(slug, { autoPlayMode = null, updateHash = true } = {}) {
  const post = state.posts.find((p) => p.slug === slug);
  if (!post) return;

  reader.stop();
  state.currentPost = post;

  els.homeView.hidden = true;
  els.articleView.hidden = false;

  els.artCategoryBadge.textContent = `${formatTypeBadge(post.type)} • ${post.categoryLabel}`;
  els.artTitle.textContent = post.title;
  els.artSubtitle.textContent = post.subtitle;
  els.artMetaDetails.textContent = `${post.date} • ${post.readTime} • ${post.views || "Novo"} visualizações`;

  els.artSummaryList.innerHTML = (post.summary || [])
    .map((item, i) => `<li id="summary-item-${i}">${escapeHtml(item)}</li>`)
    .join("");

  els.artPracticalTip.innerHTML = `<strong>Aplicação Prática no Campo (Dica do Cleilson):</strong> <span id="summary-tip">${escapeHtml(post.practicalTip || "")}</span>`;

  els.artImage.src = post.image;
  els.artImage.alt = post.title;
  els.artImageCaption.textContent = post.imageCaption || "";

  const bodyHtml = [];
  (post.content || []).forEach((block, i) => {
    const elId = `art-block-${i}`;
    if (block.type === "h2") {
      bodyHtml.push(`<h2 id="${elId}">${escapeHtml(block.text)}</h2>`);
    } else if (block.type === "callout") {
      bodyHtml.push(`
        <div id="${elId}" class="article-callout">
          <strong>${escapeHtml(block.title)}</strong>
          <span>${escapeHtml(block.text)}</span>
        </div>`);
    } else if (block.type === "checklist") {
      const items = (block.items || []).map((it) => `<li>${escapeHtml(it)}</li>`).join("");
      bodyHtml.push(`
        <div id="${elId}" class="article-checklist">
          <h3>${escapeHtml(block.title)}</h3>
          <ul>${items}</ul>
        </div>`);
    } else {
      bodyHtml.push(`<p id="${elId}">${escapeHtml(block.text)}</p>`);
    }

    if (i === 1) {
      bodyHtml.push(`
        <aside class="ad-in-article" aria-label="Publicidade no meio do artigo">
          <div class="ad-badge">PUBLICIDADE IN-ARTICLE • MAIOR RPM GOOGLE ADSENSE</div>
          <div class="ad-slot-content">
            <div class="ad-promo-text">
              <strong>Espaço Premium no Meio da Leitura</strong>
              <span>Posição estratégica onde a atenção do leitor é máxima. Pronto para bloco responsivo do AdSense.</span>
            </div>
            <a href="#anuncie" class="btn btn-outline-amber btn-sm" id="in-article-ad-cta">Anunciar Aqui</a>
          </div>
        </aside>
      `);
    }
  });

  els.artBody.innerHTML = bodyHtml.join("");

  const related = state.posts.filter((p) => p.slug !== post.slug).slice(0, 2);
  els.relatedGrid.innerHTML = related
    .map(
      (r) => `
      <article class="post-card" style="cursor:pointer" data-open-slug="${escapeHtml(r.slug)}">
        <div class="post-card-body">
          <span class="post-card-cat" style="font-size:0.76rem">${escapeHtml(r.categoryLabel)}</span>
          <h4 class="post-card-title" style="margin-top:4px">${escapeHtml(r.title)}</h4>
          <span class="card-action-link">Ler agora →</span>
        </div>
      </article>`
    )
    .join("");

  if (updateHash) {
    history.pushState(null, "", `#artigo/${post.slug}`);
  }
  window.scrollTo({ top: 0, behavior: "smooth" });

  if (autoPlayMode) {
    setTimeout(() => startPostAudio(autoPlayMode), 350);
  }
}

function buildAudioSegments(post, mode) {
  const segments = [{ text: post.title, elementId: "art-title", kind: "title" }];

  if (mode === "summary") {
    segments.push({ text: "Resumo em 30 segundos:", elementId: "article-summary-box", kind: "heading" });
    (post.summary || []).forEach((s, i) => {
      segments.push({ text: s, elementId: `summary-item-${i}`, kind: "body" });
    });
    if (post.practicalTip) {
      segments.push({ text: `Aplicação prática no campo: ${post.practicalTip}`, elementId: "summary-tip", kind: "tip" });
    }
    return segments;
  }

  segments.push({ text: post.subtitle, elementId: "art-subtitle", kind: "body" });
  (post.content || []).forEach((block, i) => {
    const elId = `art-block-${i}`;
    if (block.type === "h2") {
      segments.push({ text: block.text, elementId: elId, kind: "heading" });
    } else if (block.type === "checklist") {
      segments.push({ text: `${block.title}. ${(block.items || []).join(". ")}`, elementId: elId, kind: "tip" });
    } else if (block.type === "callout") {
      segments.push({ text: `${block.title}. ${block.text}`, elementId: elId, kind: "tip" });
    } else {
      segments.push({ text: block.text, elementId: elId, kind: "body" });
    }
  });
  return segments;
}

function startPostAudio(mode) {
  if (!state.currentPost) return;
  const segments = buildAudioSegments(state.currentPost, mode);
  reader.start(segments, mode);
}

function closeArticle({ scrollToId = null } = {}) {
  reader.stop();
  state.currentPost = null;
  els.articleView.hidden = true;
  els.homeView.hidden = false;
  if (location.hash.startsWith("#artigo/")) {
    history.pushState(null, "", "#inicio");
  }
  if (scrollToId) {
    const target = document.getElementById(scrollToId);
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
      return;
    }
  }
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// =========================================================================
// ESTÚDIO DO CLEILSON (ABAS + CONFIGURAÇÕES)
// =========================================================================
function openStudio(tabName = "validation") {
  els.editorModal.hidden = false;
  switchStudioTab(tabName);
  syncConfigForm();
  renderPendingDdsQueue();
}

function switchStudioTab(tabName) {
  document.querySelectorAll(".studio-tab").forEach((t) => {
    t.classList.toggle("active", t.dataset.studioTab === tabName);
  });
  document.querySelectorAll(".studio-panel").forEach((p) => {
    p.hidden = p.id !== `studio-panel-${tabName}`;
  });
}

function syncConfigForm() {
  const voiceCfg = reader.getNeuralConfig();
  const aiCfg = loadAiConfig();
  const vp = document.getElementById("cfg-voice-provider");
  const vk = document.getElementById("cfg-voice-key");
  const ap = document.getElementById("cfg-ai-provider");
  const ak = document.getElementById("cfg-ai-key");
  if (vp) vp.value = voiceCfg.provider || "browser";
  if (vk) vk.value = voiceCfg.apiKey || "";
  if (ap) ap.value = aiCfg.provider || "gemini";
  if (ak) ak.value = aiCfg.apiKey || "";
}

// =========================================================================
// EVENTOS & INTERAÇÕES
// =========================================================================
function initTheme() {
  const saved = localStorage.getItem(STORAGE_KEY_THEME) || "light";
  document.documentElement.setAttribute("data-theme", saved);

  els.themeToggle.addEventListener("click", () => {
    const current = document.documentElement.getAttribute("data-theme");
    const next = current === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem(STORAGE_KEY_THEME, next);
  });
}

function bindEvents() {
  document.addEventListener("click", async (e) => {
    // Ações de Artigos
    const listenBtn = e.target.closest("[data-listen-slug]");
    if (listenBtn) {
      e.stopPropagation();
      openArticle(listenBtn.dataset.listenSlug, { autoPlayMode: "full" });
      return;
    }

    const openEl = e.target.closest("[data-open-slug]");
    if (openEl) {
      openArticle(openEl.dataset.openSlug);
      return;
    }

    // Ações dos Kits de DDS (Biblioteca Pública)
    const openDdsBtn = e.target.closest("[data-open-dds]");
    if (openDdsBtn) {
      openDdsModal(openDdsBtn.dataset.openDds);
      return;
    }

    const listenDdsBtn = e.target.closest("[data-listen-dds]");
    if (listenDdsBtn) {
      listenToDds(listenDdsBtn.dataset.listenDds);
      return;
    }

    const waDdsBtn = e.target.closest("[data-wa-dds]");
    if (waDdsBtn) {
      const dds = state.ddsKits.find((k) => k.id === waDdsBtn.dataset.waDds);
      if (dds) {
        try {
          await navigator.clipboard.writeText(formatDdsForWhatsApp(dds));
          showToast("Kit de DDS copiado! Cole direto no grupo de WhatsApp do turno.");
        } catch {
          showToast("Não foi possível copiar automaticamente.");
        }
      }
      return;
    }

    const pdfDdsBtn = e.target.closest("[data-pdf-dds]");
    if (pdfDdsBtn) {
      const dds = state.ddsKits.find((k) => k.id === pdfDdsBtn.dataset.pdfDds);
      if (dds) printDdsCard(dds);
      return;
    }

    // Validação Técnica do Cleilson (Aprovar ou Descartar DDS gerado por IA)
    const approveBtn = e.target.closest("[data-approve-dds]");
    if (approveBtn) {
      const id = approveBtn.dataset.approveDds;
      const card = approveBtn.closest(".pending-dds-card");
      const target = state.ddsKits.find((k) => k.id === id);
      if (target && card) {
        target.title = card.querySelector(".pend-title").value.trim() || target.title;
        target.norm = card.querySelector(".pend-norm").value.trim() || target.norm;
        target.summary = card.querySelector(".pend-summary").value.trim() || target.summary;
        target.script = card
          .querySelector(".pend-script")
          .value.split(/\n\s*\n/)
          .map((s) => s.trim())
          .filter(Boolean);
        target.checklist = card
          .querySelector(".pend-checklist")
          .value.split("\n")
          .map((s) => s.trim())
          .filter(Boolean);
        target.status = "approved";
        target.validatedBy = "Cleilson TST";
        target.validatedAt = new Date().toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" });
        target.weekLabel = "Liberado p/ Segunda-Feira";
        saveDdsKits(state.ddsKits);
        renderDdsHub();
        renderPendingDdsQueue();
        showToast("✓ DDS validado pelo Cleilson! Publicado no site e agendado para segunda-feira.");
      }
      return;
    }

    const rejectBtn = e.target.closest("[data-reject-dds]");
    if (rejectBtn) {
      const id = rejectBtn.dataset.rejectDds;
      state.ddsKits = state.ddsKits.filter((k) => k.id !== id);
      saveDdsKits(state.ddsKits);
      renderPendingDdsQueue();
      showToast("Rascunho descartado da fila.");
      return;
    }

    if (e.target.id === "in-article-ad-cta") {
      e.preventDefault();
      closeArticle({ scrollToId: "anuncie" });
      return;
    }

    const closeModalBtn = e.target.closest("[data-close-modal]");
    if (closeModalBtn) {
      const mId = closeModalBtn.dataset.closeModal;
      document.getElementById(mId).hidden = true;
      if (mId === "dds-reader-modal") reader.stop();
    }
  });

  // Abas do Estúdio
  document.querySelectorAll(".studio-tab").forEach((tab) => {
    tab.addEventListener("click", () => switchStudioTab(tab.dataset.studioTab));
  });

  // Filtros de Kits DDS
  document.querySelectorAll(".dds-tab").forEach((btn) => {
    btn.addEventListener("click", () => {
      state.ddsArea = btn.dataset.ddsArea;
      document.querySelectorAll(".dds-tab").forEach((b) => b.classList.toggle("active", b === btn));
      renderDdsHub();
    });
  });

  // Botões do Modal Leitor de DDS
  els.ddsModalListen.addEventListener("click", () => {
    if (state.activeDdsModal) listenToDds(state.activeDdsModal.id);
  });
  els.ddsModalWhatsapp.addEventListener("click", async () => {
    if (!state.activeDdsModal) return;
    await navigator.clipboard.writeText(formatDdsForWhatsApp(state.activeDdsModal));
    showToast("Roteiro copiado para o WhatsApp!");
  });
  els.ddsModalPrint.addEventListener("click", () => {
    if (state.activeDdsModal) printDdsCard(state.activeDdsModal);
  });

  // Gerar Novo DDS com IA (Gemini / GPT / Demo)
  els.generateAiDdsBtn.addEventListener("click", async () => {
    const btn = els.generateAiDdsBtn;
    const oldText = btn.textContent;
    btn.disabled = true;
    btn.textContent = "⏳ Pesquisando tendências SST...";
    try {
      const draft = await generateAiDdsDraft(els.aiTopicInput.value.trim());
      state.ddsKits.unshift(draft);
      saveDdsKits(state.ddsKits);
      els.aiTopicInput.value = "";
      renderPendingDdsQueue();
      showToast("✨ Novo DDS gerado pela IA! Revise os pontos e clique em Validar.");
    } catch (err) {
      showToast(err.message || "Erro ao gerar DDS com IA.");
    } finally {
      btn.disabled = false;
      btn.textContent = oldText;
    }
  });

  // Exportar JSON dos Kits de DDS (para sincronizar com GitHub Actions)
  els.exportDdsJsonBtn.addEventListener("click", () => {
    const blob = new Blob([JSON.stringify(state.ddsKits, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "dds-kits-validados.json";
    a.click();
    URL.revokeObjectURL(url);
    showToast("JSON de Kits DDS exportado!");
  });

  // Salvar configurações de Voz Neural HD e IA
  els.voiceAiConfigForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const fd = new FormData(els.voiceAiConfigForm);
    reader.saveNeuralConfig({
      provider: String(fd.get("voiceProvider")),
      apiKey: String(fd.get("voiceApiKey") || "").trim()
    });
    saveAiConfig({
      provider: String(fd.get("aiProvider")),
      apiKey: String(fd.get("aiApiKey") || "").trim()
    });
    showToast("✓ Configurações de Voz Neural HD e IA salvas com sucesso!");
  });

  // Atalhos para abrir o Estúdio na aba certa
  ["open-editor-top", "open-editor-about", "open-editor-footer"].forEach((id) => {
    const btn = document.getElementById(id);
    if (btn) btn.addEventListener("click", () => openStudio("publish"));
  });

  const openValBtn = document.getElementById("open-validation-queue-btn");
  if (openValBtn) openValBtn.addEventListener("click", () => openStudio("validation"));

  const openVoiceCfgBtn = document.getElementById("open-voice-config");
  if (openVoiceCfgBtn) openVoiceCfgBtn.addEventListener("click", () => openStudio("ai-voice"));

  // Navegação por categoria no header/footer
  document.querySelectorAll("[data-nav-cat]").forEach((link) => {
    link.addEventListener("click", () => {
      const cat = link.dataset.navCat;
      if (state.currentPost) closeArticle({ scrollToId: cat === "all" ? "inicio" : "feed" });
      state.category = cat;
      document.querySelectorAll(".cat-tab").forEach((t) => t.classList.toggle("active", t.dataset.category === cat));
      document.querySelectorAll(".nav-link").forEach((n) => n.classList.toggle("active", n === link));
      renderFeed();
      els.mainNav.classList.remove("open");
    });
  });

  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", () => {
      const targetId = a.getAttribute("href").slice(1);
      if (state.currentPost && targetId && !targetId.startsWith("artigo/")) {
        closeArticle({ scrollToId: targetId });
      }
      els.mainNav.classList.remove("open");
    });
  });

  document.querySelectorAll(".format-pill").forEach((btn) => {
    btn.addEventListener("click", () => {
      state.format = btn.dataset.format;
      document.querySelectorAll(".format-pill").forEach((b) => b.classList.toggle("active", b === btn));
      renderFeed();
    });
  });

  document.querySelectorAll(".cat-tab").forEach((btn) => {
    btn.addEventListener("click", () => {
      state.category = btn.dataset.category;
      document.querySelectorAll(".cat-tab").forEach((b) => b.classList.toggle("active", b === btn));
      renderFeed();
    });
  });

  els.searchInput.addEventListener("input", (e) => {
    state.search = e.target.value;
    if (state.currentPost) closeArticle({ scrollToId: "feed" });
    renderFeed();
  });

  els.backToHome.addEventListener("click", () => closeArticle());
  els.mobileMenuBtn.addEventListener("click", () => els.mainNav.classList.toggle("open"));

  // Controles de Auto-Leitura (TTS)
  els.ttsPlaySummary.addEventListener("click", () => startPostAudio("summary"));
  els.ttsPlayFull.addEventListener("click", () => startPostAudio("full"));
  els.ttsTogglePause.addEventListener("click", () => reader.togglePlayPause());
  els.ttsStop.addEventListener("click", () => reader.stop());
  els.ttsRate.addEventListener("change", (e) => reader.setRate(e.target.value));
  els.ttsVoice.addEventListener("change", (e) => reader.setVoice(e.target.value));

  // Compartilhamento
  els.shareWhatsapp.addEventListener("click", () => {
    if (!state.currentPost) return;
    const text = `Confira este guia de Segurança do Trabalho do Cleilson TST: "${state.currentPost.title}" ${location.href}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank", "noopener");
  });

  els.shareLinkedin.addEventListener("click", () => {
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(location.href)}`, "_blank", "noopener");
  });

  els.shareCopy.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(location.href);
      showToast("Link copiado! Pronto para colar no WhatsApp ou LinkedIn.");
    } catch {
      showToast("Copie o endereço da barra do navegador.");
    }
  });

  document.getElementById("open-privacy-btn").addEventListener("click", () => {
    els.privacyModal.hidden = false;
  });

  // Publicar Novo Conteúdo na Área do Editor
  els.editorForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const fd = new FormData(els.editorForm);
    const title = String(fd.get("title")).trim();
    const category = String(fd.get("category"));
    const type = String(fd.get("type"));

    const catLabels = {
      offshore: "Offshore • NR-37",
      onshore: "Onshore • Indústria",
      nrs: "NRs & Legislação",
      dds: "DDS & Cultura"
    };

    const slug =
      title
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "") +
      "-" +
      Date.now().toString().slice(-4);

    const summaryLines = String(fd.get("summary"))
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);

    const bodyParagraphs = String(fd.get("body"))
      .split(/\n\s*\n/)
      .map((p) => p.trim())
      .filter(Boolean)
      .map((text) => ({ type: "p", text }));

    const newPost = {
      id: `custom-${Date.now()}`,
      slug,
      type,
      category,
      categoryLabel: catLabels[category] || "Segurança do Trabalho",
      badge: "Recém-Publicado",
      title,
      subtitle: String(fd.get("subtitle")).trim(),
      date: new Date().toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" }),
      readTime: String(fd.get("readTime")).trim(),
      audioDuration: "Auto-leitura pronta",
      views: "Novo",
      featured: false,
      image: String(fd.get("image")),
      imageCaption: `Publicação oficial de Cleilson TST — ${catLabels[category] || ""}`,
      summary: summaryLines,
      practicalTip: String(fd.get("practicalTip")).trim(),
      content: bodyParagraphs
    };

    saveCustomPost(newPost);
    renderHero();
    renderFeed();
    renderTrending();
    renderShorts();
    renderInfographics();

    els.editorForm.reset();
    els.editorModal.hidden = true;
    showToast("Publicação criada com sucesso! Abrindo agora...");
    openArticle(newPost.slug);
  });

  els.exportJsonBtn.addEventListener("click", () => {
    const blob = new Blob([JSON.stringify(state.posts, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "posts-cleilson-tst.json";
    a.click();
    URL.revokeObjectURL(url);
    showToast("Arquivo JSON exportado! Ideal para salvar no repositório GitHub.");
  });

  // Formulários de Newsletter (Inscrição para Kits Automáticos de Segunda-Feira)
  ["sidebar-newsletter-form", "article-newsletter-form"].forEach((id) => {
    const form = document.getElementById(id);
    if (!form) return;
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const fd = new FormData(form);
      addSubscriber(String(fd.get("email") || ""), String(fd.get("name") || ""));
      if (els.ddsSubCounter) {
        els.ddsSubCounter.textContent = getSubscriberCount().toLocaleString("pt-BR");
      }
      form.reset();
      showToast("✓ Inscrição confirmada! Você receberá os Kits de DDS validados toda segunda-feira às 06h.");
    });
  });

  document.getElementById("advertiser-form").addEventListener("submit", (e) => {
    e.preventDefault();
    e.target.reset();
    showToast("Proposta solicitada! A equipe comercial do Cleilson TST retornará em breve.");
  });

  window.addEventListener("scroll", () => {
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? Math.min(100, Math.max(0, (window.scrollY / docHeight) * 100)) : 0;
    els.readingProgress.style.width = `${pct}%`;
  });

  window.addEventListener("hashchange", handleRouteFromHash);
}

function handleRouteFromHash() {
  if (location.hash.startsWith("#artigo/")) {
    const slug = location.hash.replace("#artigo/", "").trim();
    if (slug && (!state.currentPost || state.currentPost.slug !== slug)) {
      openArticle(slug, { updateHash: false });
    }
  } else if (state.currentPost) {
    closeArticle();
  }
}

// =========================================================================
// INICIALIZAÇÃO
// =========================================================================
function init() {
  initTheme();
  loadPosts();
  state.ddsKits = loadDdsKits();
  renderStaticBranding();
  renderHero();
  renderFeed();
  renderDdsHub();
  renderPendingDdsQueue();
  renderTrending();
  renderShorts();
  renderInfographics();
  bindEvents();
  handleRouteFromHash();
}

init();
