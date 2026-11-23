import { SITE_CONFIG, DEFAULT_POSTS } from "./data.js";
import { AutoReader } from "./tts.js";

const STORAGE_KEY_POSTS = "cleilson_tst_custom_posts_v1";
const STORAGE_KEY_THEME = "cleilson_tst_theme_v1";

const state = {
  posts: [],
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
  exportJsonBtn: document.getElementById("export-json-btn"),
  toast: document.getElementById("toast")
};

// =========================================================================
// MOTOR DE AUTO-LEITURA (TTS)
// =========================================================================
let highlightedEl = null;

const reader = new AutoReader({
  onVoicesLoaded: (voices, selectedURI) => {
    if (!els.ttsVoice) return;
    if (voices.length === 0) {
      els.ttsVoice.innerHTML = `<option value="">Voz PT-BR padrão</option>`;
      return;
    }
    els.ttsVoice.innerHTML = voices
      .map((v) => `<option value="${escapeHtml(v.voiceURI)}" ${v.voiceURI === selectedURI ? "selected" : ""}>${escapeHtml(v.name)} (${v.lang})</option>`)
      .join("");
  },
  onStateChange: ({ supported, isPlaying, isPaused, mode }) => {
    if (!supported) {
      els.ttsStatusText.textContent = "Seu navegador não suporta síntese de voz nativa.";
      els.ttsPlaySummary.disabled = true;
      els.ttsPlayFull.disabled = true;
      return;
    }

    els.ttsTogglePause.disabled = !isPlaying;
    els.ttsStop.disabled = !isPlaying;
    els.ttsTogglePause.textContent = isPaused ? "Retomar" : "Pausar";

    if (isPlaying && !isPaused) {
      els.ttsWaveBadge.classList.add("playing");
      els.ttsStatusText.textContent =
        mode === "summary"
          ? "Lendo o Resumo Executivo em voz alta..."
          : "Lendo o conteúdo completo em voz alta...";
    } else if (isPlaying && isPaused) {
      els.ttsWaveBadge.classList.remove("playing");
      els.ttsStatusText.textContent = "Auto-leitura pausada.";
    } else {
      els.ttsWaveBadge.classList.remove("playing");
      els.ttsStatusText.textContent = "Prefere ouvir? Aperte o play para escutar o resumo ou o artigo completo.";
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
    const pct = Math.round((current / total) * 100);
    els.ttsProgressFill.style.width = `${pct}%`;
    els.ttsProgressLabel.textContent = `${pct}% (${current}/${total})`;
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
  }, 3400);
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
// RENDERIZAÇÃO DA HOME
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

    // Insere Anúncio In-Feed Nativo de alta conversão após o 2º card
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

  // Resumo Executivo (30s)
  els.artSummaryList.innerHTML = (post.summary || [])
    .map((item, i) => `<li id="summary-item-${i}">${escapeHtml(item)}</li>`)
    .join("");

  els.artPracticalTip.innerHTML = `<strong>Aplicação Prática no Campo (Dica do Cleilson):</strong> <span id="summary-tip">${escapeHtml(post.practicalTip || "")}</span>`;

  els.artImage.src = post.image;
  els.artImage.alt = post.title;
  els.artImageCaption.textContent = post.imageCaption || "";

  // Corpo do artigo + Anúncio In-Article após o 2º bloco
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

  // Relacionados
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
  const segments = [{ text: post.title, elementId: "art-title" }];

  if (mode === "summary") {
    segments.push({ text: "Resumo em 30 segundos:", elementId: "article-summary-box" });
    (post.summary || []).forEach((s, i) => {
      segments.push({ text: s, elementId: `summary-item-${i}` });
    });
    if (post.practicalTip) {
      segments.push({ text: `Aplicação prática no campo: ${post.practicalTip}`, elementId: "summary-tip" });
    }
    return segments;
  }

  // Modo completo
  segments.push({ text: post.subtitle, elementId: "art-subtitle" });
  (post.content || []).forEach((block, i) => {
    const elId = `art-block-${i}`;
    if (block.type === "checklist") {
      segments.push({ text: `${block.title}. ${(block.items || []).join(". ")}`, elementId: elId });
    } else if (block.type === "callout") {
      segments.push({ text: `${block.title}. ${block.text}`, elementId: elId });
    } else {
      segments.push({ text: block.text, elementId: elId });
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
  // Delegação de cliques para abrir artigos ou iniciar áudio direto da capa/cards
  document.addEventListener("click", (e) => {
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

    if (e.target.id === "in-article-ad-cta") {
      e.preventDefault();
      closeArticle({ scrollToId: "anuncie" });
      return;
    }

    const closeModalBtn = e.target.closest("[data-close-modal]");
    if (closeModalBtn) {
      document.getElementById(closeModalBtn.dataset.closeModal).hidden = true;
    }
  });

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

  // Links de âncora normais enquanto no leitor
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", () => {
      const targetId = a.getAttribute("href").slice(1);
      if (state.currentPost && targetId && !targetId.startsWith("artigo/")) {
        closeArticle({ scrollToId: targetId });
      }
      els.mainNav.classList.remove("open");
    });
  });

  // Filtros de formato e categoria
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

  // Busca instantânea
  els.searchInput.addEventListener("input", (e) => {
    state.search = e.target.value;
    if (state.currentPost) closeArticle({ scrollToId: "feed" });
    renderFeed();
  });

  // Voltar ao portal
  els.backToHome.addEventListener("click", () => closeArticle());

  // Menu mobile
  els.mobileMenuBtn.addEventListener("click", () => {
    els.mainNav.classList.toggle("open");
  });

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

  // Modais: Área do Editor & Privacidade
  ["open-editor-top", "open-editor-about", "open-editor-footer"].forEach((id) => {
    const btn = document.getElementById(id);
    if (btn) btn.addEventListener("click", () => (els.editorModal.hidden = false));
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

  // Exportar JSON dos posts para versionar no GitHub
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

  // Formulários de Newsletter & Anunciante
  ["sidebar-newsletter-form", "article-newsletter-form"].forEach((id) => {
    const form = document.getElementById(id);
    if (!form) return;
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      form.reset();
      showToast("Inscrição confirmada! Seu Kit de Checklists de DDS foi enviado.");
    });
  });

  document.getElementById("advertiser-form").addEventListener("submit", (e) => {
    e.preventDefault();
    e.target.reset();
    showToast("Proposta solicitada! A equipe comercial do Cleilson TST retornará em breve.");
  });

  // Barra de progresso no scroll
  window.addEventListener("scroll", () => {
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? Math.min(100, Math.max(0, (window.scrollY / docHeight) * 100)) : 0;
    els.readingProgress.style.width = `${pct}%`;
  });

  // Navegação por hash (compartilhamento de link direto do artigo)
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
  renderStaticBranding();
  renderHero();
  renderFeed();
  renderTrending();
  renderShorts();
  renderInfographics();
  bindEvents();
  handleRouteFromHash();
}

init();
