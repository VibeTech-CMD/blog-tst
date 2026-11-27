import {
  STORAGE_KEYS,
  SITE_CONFIG,
  loadProfile,
  saveProfile,
  loadOwnerAuth,
  saveOwnerAuth,
  verifyOwnerCredentials,
  hashSecret,
  loadAdsenseConfig,
  saveAdsenseConfig,
  loadCategories,
  addCategory,
  sanitizeRichHtml,
  blocksToRichHtml,
  loadAllPosts,
  saveCustomPost,
  deletePostById,
  loadImageBank,
  saveImageBank,
  loadInstagramConfig,
  saveInstagramConfig,
  loadAnalyticsConfig,
  saveAnalyticsConfig,
  calculateReadTime,
  computeRealMetrics
} from "./data.js";

const SESSION_OWNER_KEY = "cleilson_tst_owner_session_v2";

const state = {
  posts: [],
  imageBank: [],
  categories: [],
  profile: loadProfile(),
  category: "all",
  imageFilter: "all",
  search: "",
  manageSearch: "",
  pendingBankImageDataUrl: "",
  quickCoverTargetPostId: null,
  activeLightboxItem: null,
  ownerAuthenticated: sessionStorage.getItem(SESSION_OWNER_KEY) === "1"
};

const els = {
  readingProgress: document.getElementById("reading-progress"),
  ownerSessionBar: document.getElementById("owner-session-bar"),
  ownerLoggedEmail: document.getElementById("owner-logged-email"),
  ownerOpenStudioBtn: document.getElementById("owner-open-studio-btn"),
  ownerLogoutBtn: document.getElementById("owner-logout-btn"),
  brandLogo: document.getElementById("brand-logo"),
  footerSecretBrand: document.getElementById("footer-secret-brand"),

  heroFeatured: document.getElementById("hero-featured"),
  homeCategoryTabs: document.getElementById("home-category-tabs"),
  postsGrid: document.getElementById("posts-grid"),
  feedStatus: document.getElementById("feed-status"),
  recentList: document.getElementById("recent-list"),
  instagramStatusBar: document.getElementById("instagram-status-bar"),
  imageBankGrid: document.getElementById("image-bank-grid"),

  // Perfil dinâmico na página
  sidebarAuthorAvatar: document.getElementById("sidebar-author-avatar"),
  sidebarAuthorName: document.getElementById("sidebar-author-name"),
  sidebarAuthorRole: document.getElementById("sidebar-author-role"),
  sidebarAuthorBio: document.getElementById("sidebar-author-bio"),
  aboutAuthorAvatar: document.getElementById("about-author-avatar"),
  aboutAuthorBadgeName: document.getElementById("about-author-badge-name"),
  aboutAuthorBadgeRole: document.getElementById("about-author-badge-role"),
  aboutHeadline: document.getElementById("about-headline"),
  aboutBioText: document.getElementById("about-bio-text"),
  aboutHistoryText: document.getElementById("about-history-text"),
  aboutStats: document.getElementById("about-stats"),

  searchInput: document.getElementById("search-input"),
  themeToggle: document.getElementById("theme-toggle"),
  mobileMenuBtn: document.getElementById("mobile-menu-btn"),
  mainNav: document.getElementById("main-nav"),

  // Login Oculto do Proprietário
  ownerLoginModal: document.getElementById("owner-login-modal"),
  ownerLoginForm: document.getElementById("owner-login-form"),
  ownerLoginError: document.getElementById("owner-login-error"),

  // Editor Intuitivo
  editorModal: document.getElementById("editor-modal"),
  editorForm: document.getElementById("editor-form"),
  edId: document.getElementById("ed-id"),
  edTitle: document.getElementById("ed-title"),
  edCategory: document.getElementById("ed-category"),
  toggleNewCatBtn: document.getElementById("toggle-new-cat-btn"),
  newCategoryRow: document.getElementById("new-category-row"),
  newCategoryInput: document.getElementById("new-category-input"),
  saveNewCatBtn: document.getElementById("save-new-cat-btn"),
  edSubtitle: document.getElementById("ed-subtitle"),
  edSummary: document.getElementById("ed-summary"),
  edTip: document.getElementById("ed-tip"),
  edRichBody: document.getElementById("ed-rich-body"),
  richEditorWrapper: document.getElementById("rich-editor-wrapper"),
  toggleExpandEditor: document.getElementById("toggle-expand-editor"),
  edImageValue: document.getElementById("ed-image-value"),
  edCoverUpload: document.getElementById("ed-cover-upload"),
  quickCoverFile: document.getElementById("quick-cover-file"),
  coverThumbnails: document.getElementById("cover-thumbnails"),
  coverPreviewImg: document.getElementById("cover-preview-img"),
  coverPreviewLabel: document.getElementById("cover-preview-label"),
  edCancelEdit: document.getElementById("ed-cancel-edit"),
  edSubmitBtn: document.getElementById("ed-submit-btn"),
  managePostsList: document.getElementById("manage-posts-list"),
  managePostsSearch: document.getElementById("manage-posts-search"),
  managePostsCount: document.getElementById("manage-posts-count"),

  // Banco de Imagens
  imageBankForm: document.getElementById("image-bank-form"),
  bankFileInput: document.getElementById("bank-file-input"),
  bankDropzone: document.getElementById("bank-dropzone"),
  bankFilePreview: document.getElementById("bank-file-preview"),
  bankPreviewImg: document.getElementById("bank-preview-img"),
  manageImagesList: document.getElementById("manage-images-list"),

  // Perfil & Segurança no Editor
  profileConfigForm: document.getElementById("profile-config-form"),
  profAvatarPreview: document.getElementById("prof-avatar-preview"),
  profAvatarUpload: document.getElementById("prof-avatar-upload"),
  profAvatarValue: document.getElementById("prof-avatar-value"),
  ownerSecurityForm: document.getElementById("owner-security-form"),

  // Instagram & Analytics & AdSense
  instagramConfigForm: document.getElementById("instagram-config-form"),
  syncInstagramBtn: document.getElementById("sync-instagram-btn"),
  analyticsConfigForm: document.getElementById("analytics-config-form"),

  // Lightbox & Privacidade
  lightboxModal: document.getElementById("image-lightbox-modal"),
  lightboxTag: document.getElementById("lightbox-tag"),
  lightboxTitle: document.getElementById("lightbox-title"),
  lightboxImg: document.getElementById("lightbox-img"),
  lightboxCaption: document.getElementById("lightbox-caption"),
  lbShareWa: document.getElementById("lb-share-wa"),
  lbCopyIg: document.getElementById("lb-copy-ig"),
  lbDownload: document.getElementById("lb-download"),
  privacyModal: document.getElementById("privacy-modal"),
  toast: document.getElementById("toast")
};

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
  }, 3600);
}

function articleUrl(slug) {
  return `artigo.html?post=${encodeURIComponent(slug)}`;
}

function readAndCompressImage(file, maxW = 1200) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Não foi possível ler a imagem."));
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const scale = img.width > maxW ? maxW / img.width : 1;
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", 0.84));
      };
      img.onerror = () => resolve(reader.result);
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}

function parseEasyEditorBody(rawText) {
  const chunks = String(rawText)
    .split(/\n\s*\n/)
    .map((c) => c.trim())
    .filter(Boolean);

  return chunks.map((chunk) => {
    if (chunk.startsWith("## ")) {
      return { type: "h2", text: chunk.replace(/^##\s+/, "").trim() };
    }
    if (chunk.startsWith("DESTAQUE:")) {
      return { type: "callout", title: `Destaque de ${state.profile.name}`, text: chunk.replace(/^DESTAQUE:\s*/i, "").trim() };
    }
    if (chunk.split("\n").every((line) => /^[-•*]\s+/.test(line.trim()))) {
      return {
        type: "checklist",
        title: "Pontos de Verificação",
        items: chunk.split("\n").map((line) => line.replace(/^[-•*]\s+/, "").trim())
      };
    }
    return { type: "p", text: chunk };
  });
}

function serializeBlocksToEasyText(blocks = []) {
  return blocks
    .map((b) => {
      if (b.type === "h2") return `## ${b.text}`;
      if (b.type === "callout") return `DESTAQUE: ${b.text}`;
      if (b.type === "checklist") return (b.items || []).map((i) => `- ${i}`).join("\n");
      return b.text || "";
    })
    .join("\n\n");
}

// =========================================================================
// ACESSO RESTRITO AO PROPRIETÁRIO (GATILHO OCULTO + E-MAIL AUTORIZADO)
// =========================================================================
function updateOwnerBar() {
  const auth = loadOwnerAuth();
  if (state.ownerAuthenticated) {
    els.ownerSessionBar.hidden = false;
    els.ownerLoggedEmail.textContent = auth.email;
  } else {
    els.ownerSessionBar.hidden = true;
  }
}

function requestOwnerAccess(defaultTab = "write") {
  if (state.ownerAuthenticated) {
    openEditor(defaultTab);
    return;
  }
  els.ownerLoginError.hidden = true;
  els.ownerLoginForm.reset();
  els.ownerLoginModal.hidden = false;
  setTimeout(() => document.getElementById("login-owner-email")?.focus(), 80);
}

function setupSecretTrigger(element) {
  if (!element) return;
  let clicks = 0;
  let timer = null;
  element.addEventListener("click", (e) => {
    clicks += 1;
    clearTimeout(timer);
    if (clicks >= 5) {
      e.preventDefault();
      clicks = 0;
      requestOwnerAccess("write");
      return;
    }
    timer = setTimeout(() => {
      clicks = 0;
    }, 2200);
  });
}

// =========================================================================
// RENDERIZAÇÃO DE PERFIL DINÂMICO, INDICADORES REAIS E PORTAL
// =========================================================================
function renderProfile() {
  const p = state.profile;
  els.sidebarAuthorAvatar.src = p.avatar;
  els.sidebarAuthorName.textContent = p.name;
  els.sidebarAuthorRole.textContent = p.role;
  els.sidebarAuthorBio.textContent = p.shortBio;

  els.aboutAuthorAvatar.src = p.avatar;
  els.aboutAuthorBadgeName.textContent = `${p.name} TST`;
  els.aboutAuthorBadgeRole.textContent = p.role;
  els.aboutHeadline.textContent = p.aboutHeadline;
  els.aboutBioText.textContent = p.bio;
  els.aboutHistoryText.textContent = p.history || "";
  els.aboutHistoryText.hidden = !p.history;
}

function renderRealIndicators() {
  const m = computeRealMetrics(state.posts, state.imageBank);

  const cards = [
    {
      value: String(m.totalMaterials),
      label: `Conteúdos Publicados (${m.articlesCount} ${m.articlesCount === 1 ? "artigo" : "artigos"} • ${m.visualsCount} ${m.visualsCount === 1 ? "imagem" : "imagens"})`
    }
  ];

  if (m.showMonthlyReaders) {
    cards.push({
      value: m.monthlyReaders.toLocaleString("pt-BR"),
      label: "Leitores Mensais Verificados"
    });
  }

  cards.push({
    value: m.specialties.length > 0 ? m.specialties.join(" • ") : "Em construção",
    label: "Especialidades (baseadas nos textos publicados)"
  });

  els.aboutStats.style.gridTemplateColumns = `repeat(${cards.length}, minmax(0, 1fr))`;
  els.aboutStats.innerHTML = cards
    .map(
      (c) => `
      <div class="stat-card">
        <strong>${escapeHtml(c.value)}</strong>
        <span>${escapeHtml(c.label)}</span>
      </div>`
    )
    .join("");
}

function renderHero() {
  const featured = state.posts.find((p) => p.featured) || state.posts[0];
  if (!featured) {
    els.heroFeatured.innerHTML = `<div style="padding:36px">Nenhuma publicação disponível ainda.</div>`;
    return;
  }

  const href = articleUrl(featured.slug);
  const readTime = calculateReadTime(featured);

  els.heroFeatured.innerHTML = `
    <a href="${href}" target="_blank" rel="noopener" class="hero-media">
      <img src="${escapeHtml(featured.image)}" alt="${escapeHtml(featured.title)}" />
      <div class="hero-media-badges">
        <span class="badge-amber">${escapeHtml(featured.badge || "Destaque")}</span>
        <span class="badge-dark">${escapeHtml(featured.categoryLabel)}</span>
      </div>
    </a>
    <div class="hero-content">
      <div class="hero-meta">
        <span>Por <strong>${escapeHtml(state.profile.name)}</strong></span>
        <span>•</span>
        <span>${escapeHtml(featured.date)}</span>
        <span>•</span>
        <span>${escapeHtml(readTime)}</span>
      </div>
      <h1><a href="${href}" target="_blank" rel="noopener">${escapeHtml(featured.title)}</a></h1>
      <p>${escapeHtml(featured.subtitle)}</p>
      <div class="hero-actions">
        <a href="${href}" target="_blank" rel="noopener" class="btn btn-primary">Abrir Leitura Completa ↗</a>
      </div>
    </div>
  `;
}

function renderFeed() {
  const q = state.search.trim().toLowerCase();
  const filtered = state.posts.filter((post) => {
    const matchCat = state.category === "all" || post.category === state.category;
    const matchSearch =
      !q ||
      post.title.toLowerCase().includes(q) ||
      post.subtitle.toLowerCase().includes(q) ||
      post.categoryLabel.toLowerCase().includes(q);
    return matchCat && matchSearch;
  });

  if (q || state.category !== "all") {
    els.feedStatus.hidden = false;
    els.feedStatus.textContent = `Exibindo ${filtered.length} publicação(ões) encontrada(s).`;
  } else {
    els.feedStatus.hidden = true;
  }

  if (filtered.length === 0) {
    els.postsGrid.innerHTML = `
      <div class="sidebar-card" style="grid-column: 1 / -1; text-align:center; padding: 36px;">
        <h3>Nenhuma publicação encontrada</h3>
        <p style="color:var(--text-muted)">Limpe o filtro ou busque por termos como "NR-37", "Offshore", "NR-35" ou "NR-33".</p>
      </div>`;
    return;
  }

  els.postsGrid.innerHTML = filtered
    .map((post) => {
      const href = articleUrl(post.slug);
      const readTime = calculateReadTime(post);
      return `
      <article class="post-card">
        <a href="${href}" target="_blank" rel="noopener" class="post-card-media">
          <img src="${escapeHtml(post.image)}" alt="${escapeHtml(post.title)}" loading="lazy" />
          <span class="card-type-pill">📄 Artigo Técnico</span>
        </a>
        <div class="post-card-body">
          <div class="post-card-meta">
            <span class="post-card-cat">${escapeHtml(post.categoryLabel)}</span>
            <span>${escapeHtml(readTime)}</span>
          </div>
          <h3 class="post-card-title"><a href="${href}" target="_blank" rel="noopener">${escapeHtml(post.title)}</a></h3>
          <p class="post-card-excerpt">${escapeHtml(post.subtitle)}</p>
          <div class="post-card-footer">
            <a href="${href}" target="_blank" rel="noopener" class="card-action-link">Ler em nova aba (Resumo + Texto) ↗</a>
          </div>
        </div>
      </article>`;
    })
    .join("");
}

function renderRecentList() {
  const recent = state.posts.slice(0, 5);
  els.recentList.innerHTML = recent
    .map(
      (p, i) => `
      <li class="trending-item">
        <span class="trending-num">0${i + 1}</span>
        <a href="${articleUrl(p.slug)}" target="_blank" rel="noopener">
          <h4>${escapeHtml(p.title)}</h4>
          <small>${escapeHtml(p.categoryLabel)} • ${escapeHtml(p.date)}</small>
        </a>
      </li>`
    )
    .join("");
}

function renderInstagramBar() {
  const cfg = loadInstagramConfig();
  if (!cfg.handle && !cfg.feedUrl) {
    els.instagramStatusBar.hidden = true;
    return;
  }
  els.instagramStatusBar.hidden = false;
  els.instagramStatusBar.innerHTML = `
    <div class="ig-status-info">
      <span class="ig-dot connected"></span>
      <span>
        <strong>Instagram oficial:</strong> ${escapeHtml(cfg.handle || "Conectado")}
        ${cfg.hashtag ? ` • Tag: <strong>${escapeHtml(cfg.hashtag)}</strong>` : ""}
      </span>
    </div>
    ${cfg.feedUrl ? `<button type="button" id="quick-sync-ig" class="btn btn-outline-dark btn-sm">↻ Atualizar Galeria</button>` : ""}
  `;
  const qSync = document.getElementById("quick-sync-ig");
  if (qSync) qSync.addEventListener("click", syncInstagramFeed);
}

function renderImageBank() {
  const visible = state.imageBank.filter((img) => state.imageFilter === "all" || img.source === state.imageFilter);

  if (visible.length === 0) {
    els.imageBankGrid.innerHTML = `
      <div class="sidebar-card" style="grid-column: 1 / -1; text-align:center; padding: 32px;">
        <p style="margin:0; color:var(--text-secondary)">Nenhuma imagem disponível nesta categoria.</p>
      </div>`;
    return;
  }

  els.imageBankGrid.innerHTML = visible
    .map(
      (item) => `
      <article class="bank-card" data-open-lightbox="${escapeHtml(item.id)}">
        <div class="bank-card-media">
          <img src="${escapeHtml(item.image)}" alt="${escapeHtml(item.title)}" loading="lazy" />
          <span class="card-type-pill">${item.source === "instagram" ? "📸 Instagram" : "🖼️ Banco de Imagens"}</span>
        </div>
        <div class="bank-card-body">
          <span class="bank-hashtag">${escapeHtml(item.hashtag || "#SegurancaDoTrabalho")}</span>
          <h3>${escapeHtml(item.title)}</h3>
          <p>${escapeHtml(item.caption)}</p>
          <div class="bank-card-footer">
            <span class="card-action-link">Ampliar &amp; Compartilhar →</span>
          </div>
        </div>
      </article>`
    )
    .join("");
}

async function syncInstagramFeed() {
  const cfg = loadInstagramConfig();
  if (!cfg.feedUrl) {
    showToast("Informe o link do Feed JSON do Instagram (ex: Behold.so) na aba Instagram.");
    return;
  }

  try {
    showToast("Buscando imagens do Instagram...");
    const res = await fetch(cfg.feedUrl);
    if (!res.ok) throw new Error("Não foi possível acessar o feed do Instagram.");
    const data = await res.json();
    const list = Array.isArray(data) ? data : data.posts || data.data || [];
    const tagFilter = (cfg.hashtag || "").trim().toLowerCase();

    const imported = [];
    for (const item of list) {
      const caption = item.caption || item.prunedCaption || "";
      const imgUrl = item.mediaUrl || item.media_url || item.thumbnailUrl || "";
      if (!imgUrl) continue;
      if (tagFilter && !caption.toLowerCase().includes(tagFilter)) continue;

      imported.push({
        id: `ig-${item.id || Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        title: caption.split("\n")[0].slice(0, 70) || `Publicação ${cfg.handle || "Instagram"}`,
        caption: caption.slice(0, 220),
        hashtag: cfg.hashtag || "#Instagram",
        category: "offshore",
        source: "instagram",
        image: imgUrl,
        date: new Date(item.timestamp || Date.now()).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" })
      });
    }

    if (imported.length === 0) {
      showToast(`Nenhuma imagem encontrada com a hashtag ${cfg.hashtag || "informada"}.`);
      return;
    }

    const existingPortal = state.imageBank.filter((i) => i.source !== "instagram");
    state.imageBank = [...imported, ...existingPortal];
    saveImageBank(state.imageBank);
    refreshAllViews();
    showToast(`✓ ${imported.length} imagem(ns) importada(s) do Instagram!`);
  } catch (err) {
    showToast(err.message || "Erro ao sincronizar Instagram.");
  }
}

function openLightbox(id) {
  const item = state.imageBank.find((i) => i.id === id);
  if (!item) return;
  state.activeLightboxItem = item;
  els.lightboxTag.textContent = `${item.source === "instagram" ? "Instagram" : "Banco de Imagens"} • ${item.hashtag || ""}`;
  els.lightboxTitle.textContent = item.title;
  els.lightboxImg.src = item.image;
  els.lightboxImg.alt = item.title;
  els.lightboxCaption.textContent = item.caption;
  els.lbDownload.href = item.image;
  els.lbDownload.download = `${item.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.jpg`;
  els.lightboxModal.hidden = false;
}

// =========================================================================
// ÁREA DO EDITOR (EXCLUSIVA DO PROPRIETÁRIO)
// =========================================================================
function openEditor(tab = "write") {
  if (!state.ownerAuthenticated) {
    requestOwnerAccess(tab);
    return;
  }
  els.editorModal.hidden = false;
  switchStudioTab(tab);
  renderCoverThumbnails();
  renderManageLists();
  syncProfileAndIntegrationForms();
}

function switchStudioTab(tabName) {
  document.querySelectorAll(".studio-tab").forEach((t) => {
    t.classList.toggle("active", t.dataset.studioTab === tabName);
  });
  document.querySelectorAll(".studio-panel").forEach((p) => {
    p.hidden = p.id !== `studio-panel-${tabName}`;
  });
}

function setSelectedCover(imgSrc, label = "Capa selecionada") {
  els.edImageValue.value = imgSrc;
  els.coverPreviewImg.src = imgSrc;
  els.coverPreviewLabel.textContent = label;
  document.querySelectorAll(".cover-thumb").forEach((btn) => {
    btn.classList.toggle("selected", btn.dataset.coverSrc === imgSrc);
  });
}

function renderCoverThumbnails() {
  const uniqueImgs = state.imageBank.slice(0, 6);
  els.coverThumbnails.innerHTML = uniqueImgs
    .map(
      (item) => `
      <button type="button" class="cover-thumb ${els.edImageValue.value === item.image ? "selected" : ""}" data-cover-src="${escapeHtml(item.image)}" title="${escapeHtml(item.title)}">
        <img src="${escapeHtml(item.image)}" alt="${escapeHtml(item.title)}" />
      </button>`
    )
    .join("");
}

function renderCategories() {
  state.categories = loadCategories();

  // Abas na Home
  const tabsHtml = [
    `<button type="button" class="cat-tab ${state.category === "all" ? "active" : ""}" data-category="all">Todas as Áreas</button>`,
    ...state.categories.map(
      (c) => `<button type="button" class="cat-tab ${state.category === c.id ? "active" : ""}" data-category="${escapeHtml(c.id)}">${escapeHtml(c.label)}</button>`
    )
  ].join("");
  if (els.homeCategoryTabs) els.homeCategoryTabs.innerHTML = tabsHtml;

  // Menu suspenso no Editor
  const currentVal = els.edCategory.value;
  els.edCategory.innerHTML = state.categories
    .map((c) => `<option value="${escapeHtml(c.id)}">${escapeHtml(c.label)}</option>`)
    .join("");
  if (currentVal && state.categories.some((c) => c.id === currentVal)) {
    els.edCategory.value = currentVal;
  }
}

function renderManageLists() {
  const q = state.manageSearch.trim().toLowerCase();
  const filteredPosts = state.posts.filter((p) => {
    if (!q) return true;
    return (
      (p.title || "").toLowerCase().includes(q) ||
      (p.date || "").toLowerCase().includes(q) ||
      (p.categoryLabel || "").toLowerCase().includes(q)
    );
  });

  if (els.managePostsCount) {
    els.managePostsCount.textContent = q
      ? `${filteredPosts.length} de ${state.posts.length}`
      : String(state.posts.length);
  }

  if (filteredPosts.length === 0) {
    els.managePostsList.innerHTML = `<div style="padding:18px; text-align:center; color:var(--text-muted); font-size:0.88rem">Nenhuma publicação encontrada para "${escapeHtml(state.manageSearch)}".</div>`;
  } else {
    els.managePostsList.innerHTML = filteredPosts
      .map(
        (p) => `
        <div class="manage-row">
          <div class="manage-img-info">
            <img src="${escapeHtml(p.image)}" alt="" />
            <div>
              <strong>${escapeHtml(p.title)}</strong>
              <small>${escapeHtml(p.categoryLabel)} • ${escapeHtml(p.date)}</small>
            </div>
          </div>
          <div class="manage-row-actions">
            <button type="button" class="card-listen-btn" data-quick-cover="${escapeHtml(p.id)}" title="Substituir apenas a imagem de capa">🖼️ Trocar Capa</button>
            <button type="button" class="card-listen-btn" data-edit-post="${escapeHtml(p.id)}">Editar</button>
            <button type="button" class="card-listen-btn btn-danger-soft" data-delete-post="${escapeHtml(p.id)}">Excluir</button>
          </div>
        </div>`
      )
      .join("");
  }

  els.manageImagesList.innerHTML = state.imageBank
    .map(
      (img) => `
      <div class="manage-row">
        <div class="manage-img-info">
          <img src="${escapeHtml(img.image)}" alt="" />
          <div>
            <strong>${escapeHtml(img.title)}</strong>
            <small>${escapeHtml(img.hashtag || "")} • ${img.source === "instagram" ? "Instagram" : "Portal"}</small>
          </div>
        </div>
        <button type="button" class="card-listen-btn btn-danger-soft" data-delete-img="${escapeHtml(img.id)}">Remover</button>
      </div>`
    )
    .join("");
}

function resetEditorForm() {
  els.editorForm.reset();
  els.edId.value = "";
  els.edRichBody.innerHTML = "";
  els.edCancelEdit.hidden = true;
  els.edSubmitBtn.textContent = "✓ Publicar no Site Agora";
  setSelectedCover("assets/images/hero-offshore.jpg", "Capa padrão selecionada");
}

function loadPostIntoEditor(id) {
  const post = state.posts.find((p) => p.id === id);
  if (!post) return;
  els.edId.value = post.id;
  els.edTitle.value = post.title;
  if (!state.categories.some((c) => c.id === post.category) && post.categoryLabel) {
    addCategory(post.categoryLabel);
    renderCategories();
  }
  els.edCategory.value = post.category || state.categories[0]?.id || "offshore";
  els.edSubtitle.value = post.subtitle || "";
  els.edSummary.value = (post.summary || []).join("\n");
  els.edTip.value = post.practicalTip || "";
  els.edRichBody.innerHTML = post.contentHtml ? sanitizeRichHtml(post.contentHtml) : blocksToRichHtml(post.content || []);
  setSelectedCover(post.image || "assets/images/hero-offshore.jpg", "Capa atual do artigo");
  els.edCancelEdit.hidden = false;
  els.edSubmitBtn.textContent = "✓ Salvar Alterações";
  els.editorModal.querySelector(".modal-dialog").scrollTo({ top: 0, behavior: "smooth" });
}

function syncProfileAndIntegrationForms() {
  const p = loadProfile();
  els.profAvatarPreview.src = p.avatar;
  els.profAvatarValue.value = p.avatar;
  document.getElementById("prof-name").value = p.name;
  document.getElementById("prof-role").value = p.role;
  document.getElementById("prof-headline").value = p.aboutHeadline;
  document.getElementById("prof-bio").value = p.bio;
  document.getElementById("prof-history").value = p.history || "";
  document.getElementById("prof-short-bio").value = p.shortBio;

  const auth = loadOwnerAuth();
  document.getElementById("sec-email").value = auth.email;
  document.getElementById("sec-pass").value = "";

  const ig = loadInstagramConfig();
  document.getElementById("ig-handle").value = ig.handle || "";
  document.getElementById("ig-hashtag").value = ig.hashtag || "#cleilsontst";
  document.getElementById("ig-feed-url").value = ig.feedUrl || "";

  const ga = loadAnalyticsConfig();
  document.getElementById("ga-id").value = ga.gaMeasurementId || "";
  document.getElementById("real-readers").value = ga.monthlyReaders || 0;

  const ads = loadAdsenseConfig();
  document.getElementById("ads-pub-id").value = ads.publisherId || "";
}

function refreshAllViews() {
  state.posts = loadAllPosts();
  state.imageBank = loadImageBank();
  state.profile = loadProfile();
  updateOwnerBar();
  renderCategories();
  renderProfile();
  renderHero();
  renderFeed();
  renderRecentList();
  renderInstagramBar();
  renderImageBank();
  renderRealIndicators();
  renderManageLists();
  renderCoverThumbnails();
}

// =========================================================================
// EVENTOS
// =========================================================================
function initTheme() {
  const saved = localStorage.getItem(STORAGE_KEYS.theme) || "light";
  document.documentElement.setAttribute("data-theme", saved);
  els.themeToggle.addEventListener("click", () => {
    const next = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem(STORAGE_KEYS.theme, next);
  });
}

function bindEvents() {
  // Gatilhos ocultos do proprietário (5 cliques no logo do topo ou rodapé + Ctrl+Shift+E)
  setupSecretTrigger(els.brandLogo);
  setupSecretTrigger(els.footerSecretBrand);

  document.addEventListener("keydown", (e) => {
    if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "e") {
      e.preventDefault();
      requestOwnerAccess("write");
    }
  });

  // Login por e-mail exclusivo do proprietário
  els.ownerLoginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const fd = new FormData(els.ownerLoginForm);
    const ok = await verifyOwnerCredentials(fd.get("email"), fd.get("passcode"));
    if (!ok) {
      els.ownerLoginError.hidden = false;
      return;
    }
    state.ownerAuthenticated = true;
    sessionStorage.setItem(SESSION_OWNER_KEY, "1");
    els.ownerLoginModal.hidden = true;
    updateOwnerBar();
    openEditor("write");
    showToast("✓ Acesso autorizado! Bem-vindo à Área do Editor.");
  });

  els.ownerOpenStudioBtn.addEventListener("click", () => openEditor("write"));
  els.ownerLogoutBtn.addEventListener("click", () => {
    state.ownerAuthenticated = false;
    sessionStorage.removeItem(SESSION_OWNER_KEY);
    els.editorModal.hidden = true;
    updateOwnerBar();
    showToast("Você saiu do Modo Proprietário.");
  });

  document.getElementById("open-privacy-btn").addEventListener("click", () => (els.privacyModal.hidden = false));

  document.querySelectorAll(".studio-tab").forEach((tab) => {
    tab.addEventListener("click", () => switchStudioTab(tab.dataset.studioTab));
  });

  // Delegação de cliques
  document.addEventListener("click", (e) => {
    const closeBtn = e.target.closest("[data-close-modal]");
    if (closeBtn) {
      document.getElementById(closeBtn.dataset.closeModal).hidden = true;
      return;
    }

    const coverBtn = e.target.closest("[data-cover-src]");
    if (coverBtn) {
      setSelectedCover(coverBtn.dataset.coverSrc, "Imagem escolhida do banco");
      return;
    }

    const lbCard = e.target.closest("[data-open-lightbox]");
    if (lbCard) {
      openLightbox(lbCard.dataset.openLightbox);
      return;
    }

    // Troca rápida de capa de publicação anterior
    const quickCoverBtn = e.target.closest("[data-quick-cover]");
    if (quickCoverBtn) {
      state.quickCoverTargetPostId = quickCoverBtn.dataset.quickCover;
      els.quickCoverFile.value = "";
      els.quickCoverFile.click();
      return;
    }

    const editPostBtn = e.target.closest("[data-edit-post]");
    if (editPostBtn) {
      loadPostIntoEditor(editPostBtn.dataset.editPost);
      return;
    }

    const delPostBtn = e.target.closest("[data-delete-post]");
    if (delPostBtn) {
      if (confirm("Deseja remover esta publicação do site?")) {
        deletePostById(delPostBtn.dataset.deletePost);
        refreshAllViews();
        showToast("Publicação removida. Indicadores atualizados.");
      }
      return;
    }

    const delImgBtn = e.target.closest("[data-delete-img]");
    if (delImgBtn) {
      state.imageBank = state.imageBank.filter((i) => i.id !== delImgBtn.dataset.deleteImg);
      saveImageBank(state.imageBank);
      refreshAllViews();
      showToast("Imagem removida do banco.");
      return;
    }

    // Categorias dinâmicas da Home (delegado para suportar áreas recém-adicionadas)
    const catTab = e.target.closest(".cat-tab");
    if (catTab && catTab.dataset.category) {
      state.category = catTab.dataset.category;
      document.querySelectorAll(".cat-tab").forEach((b) => b.classList.toggle("active", b === catTab));
      renderFeed();
      return;
    }
  });

  // Atualiza destaque visual dos botões B / I / U conforme o texto selecionado (como no Word)
  const syncWordToolbarState = () => {
    if (document.activeElement !== els.edRichBody) return;
    document.querySelectorAll(".word-btn[data-cmd]").forEach((btn) => {
      const cmd = btn.dataset.cmd;
      if (["bold", "italic", "underline", "insertUnorderedList", "insertOrderedList"].includes(cmd)) {
        try {
          btn.classList.toggle("active", document.queryCommandState(cmd));
        } catch {}
      }
    });
  };
  document.addEventListener("selectionchange", syncWordToolbarState);
  els.edRichBody.addEventListener("keyup", syncWordToolbarState);
  els.edRichBody.addEventListener("mouseup", syncWordToolbarState);

  // Botões da barra estilo Word (usa mousedown + preventDefault para manter o texto selecionado!)
  document.querySelectorAll(".word-btn").forEach((btn) => {
    btn.addEventListener("mousedown", (e) => {
      e.preventDefault();
      els.edRichBody.focus();

      if (btn.dataset.cmd) {
        document.execCommand(btn.dataset.cmd, false, null);
        syncWordToolbarState();
        return;
      }
      if (btn.dataset.formatBlock) {
        document.execCommand("formatBlock", false, btn.dataset.formatBlock);
        return;
      }
      if (btn.dataset.insertCallout) {
        const sel = window.getSelection();
        const selectedText = sel && sel.toString().trim() ? sel.toString().trim() : "Escreva aqui uma orientação de destaque...";
        document.execCommand(
          "insertHTML",
          false,
          `<blockquote class="article-callout"><strong>Destaque:</strong> ${escapeHtml(selectedText)}</blockquote><p><br></p>`
        );
      }
    });
  });

  // Colagem inteligente no editor: aceita Word, Google Docs, WhatsApp, PDF e adapta sem quebrar layout
  els.edRichBody.addEventListener("paste", (e) => {
    e.preventDefault();
    const htmlData = e.clipboardData?.getData("text/html");
    const plainData = e.clipboardData?.getData("text/plain") || "";

    let cleanHtml = "";
    if (htmlData && htmlData.trim()) {
      cleanHtml = sanitizeRichHtml(htmlData);
    } else {
      cleanHtml = plainData
        .split(/\r?\n\s*\r?\n/)
        .map((p) => p.trim())
        .filter(Boolean)
        .map((p) => `<p>${escapeHtml(p).replace(/\r?\n/g, "<br>")}</p>`)
        .join("");
    }

    if (cleanHtml) {
      document.execCommand("insertHTML", false, cleanHtml);
    }
  });

  // Expandir / reduzir área de escrita
  els.toggleExpandEditor.addEventListener("click", () => {
    const expanded = els.richEditorWrapper.classList.toggle("expanded");
    els.toggleExpandEditor.textContent = expanded ? "⤡ Reduzir Tela" : "⤢ Ampliar Tela";
  });

  // Adicionar nova Área Principal dinamicamente
  els.toggleNewCatBtn.addEventListener("click", () => {
    els.newCategoryRow.hidden = !els.newCategoryRow.hidden;
    if (!els.newCategoryRow.hidden) els.newCategoryInput.focus();
  });

  const handleSaveNewCategory = () => {
    const created = addCategory(els.newCategoryInput.value);
    if (!created) {
      showToast("Digite o nome da nova área.");
      return;
    }
    renderCategories();
    els.edCategory.value = created.id;
    els.newCategoryInput.value = "";
    els.newCategoryRow.hidden = true;
    showToast(`✓ Área "${created.label}" adicionada e disponível para futuras publicações!`);
  };

  els.saveNewCatBtn.addEventListener("click", handleSaveNewCategory);
  els.newCategoryInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSaveNewCategory();
    }
  });

  // Pesquisa em Publicações Anteriores (título, data ou área)
  els.managePostsSearch.addEventListener("input", (e) => {
    state.manageSearch = e.target.value;
    renderManageLists();
  });

  // Substituição imediata da imagem de capa de uma publicação existente
  els.quickCoverFile.addEventListener("change", async (e) => {
    const file = e.target.files?.[0];
    if (!file || !state.quickCoverTargetPostId) return;
    const post = state.posts.find((p) => p.id === state.quickCoverTargetPostId);
    if (!post) return;
    try {
      const dataUrl = await readAndCompressImage(file);
      saveCustomPost({ ...post, image: dataUrl });
      refreshAllViews();
      showToast("✓ Imagem de capa substituída com sucesso!");
    } catch {
      showToast("Não foi possível trocar a imagem.");
    }
    state.quickCoverTargetPostId = null;
  });

  // Upload de capa no formulário do artigo
  els.edCoverUpload.addEventListener("change", async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const dataUrl = await readAndCompressImage(file);
      setSelectedCover(dataUrl, `Foto enviada: ${file.name}`);
      showToast("Foto de capa carregada!");
    } catch {
      showToast("Não foi possível carregar a imagem.");
    }
  });

  // Salvar / Publicar Artigo
  els.editorForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const title = els.edTitle.value.trim();
    const richHtml = sanitizeRichHtml(els.edRichBody.innerHTML);
    if (!richHtml.replace(/<[^>]+>/g, "").trim()) {
      showToast("Escreva ou cole o texto completo do artigo antes de publicar.");
      els.edRichBody.focus();
      return;
    }

    const category = els.edCategory.value;
    const catObj = state.categories.find((c) => c.id === category);
    const catLabel = catObj ? catObj.label : "Segurança do Trabalho";

    const existingId = els.edId.value;
    const existing = existingId ? state.posts.find((p) => p.id === existingId) : null;

    const slug = existing
      ? existing.slug
      : title
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "") +
        "-" +
        Date.now().toString().slice(-4);

    const postObj = {
      id: existing ? existing.id : `post-${Date.now()}`,
      slug,
      type: "article",
      category,
      categoryLabel: catLabel,
      badge: existing ? existing.badge : "Nova Publicação",
      title,
      subtitle: els.edSubtitle.value.trim(),
      date: existing
        ? existing.date
        : new Date().toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" }),
      featured: existing ? Boolean(existing.featured) : false,
      image: els.edImageValue.value || "assets/images/hero-offshore.jpg",
      imageCaption: `Publicação técnica de ${state.profile.name} TST — ${catLabel}`,
      summary: els.edSummary.value
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean),
      practicalTip: els.edTip.value.trim(),
      contentHtml: richHtml,
      content: []
    };

    saveCustomPost(postObj);
    resetEditorForm();
    els.richEditorWrapper.classList.remove("expanded");
    els.toggleExpandEditor.textContent = "⤢ Ampliar Tela";
    refreshAllViews();
    els.editorModal.hidden = true;
    showToast("✓ Publicado! Os indicadores reais e especialidades foram atualizados.");
  });

  els.edCancelEdit.addEventListener("click", resetEditorForm);

  // Upload Foto de Perfil do Cleilson
  els.profAvatarUpload.addEventListener("change", async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const dataUrl = await readAndCompressImage(file, 600);
      els.profAvatarPreview.src = dataUrl;
      els.profAvatarValue.value = dataUrl;
      showToast("Foto de perfil pronta! Clique em Salvar Perfil do Cleilson.");
    } catch {
      showToast("Não foi possível carregar a foto.");
    }
  });

  // Salvar Perfil do Cleilson ("Sobre o Cleilson")
  els.profileConfigForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const fd = new FormData(els.profileConfigForm);
    saveProfile({
      avatar: String(fd.get("avatar") || state.profile.avatar),
      name: String(fd.get("name") || "Cleilson").trim(),
      role: String(fd.get("role") || "").trim(),
      aboutHeadline: String(fd.get("aboutHeadline") || "").trim(),
      bio: String(fd.get("bio") || "").trim(),
      history: String(fd.get("history") || "").trim(),
      shortBio: String(fd.get("shortBio") || "").trim()
    });
    refreshAllViews();
    showToast("✓ Dados, foto e histórico do Cleilson atualizados em todo o site!");
  });

  // Salvar E-mail Exclusivo e Senha do Proprietário
  els.ownerSecurityForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const fd = new FormData(els.ownerSecurityForm);
    const current = loadOwnerAuth();
    const newEmail = String(fd.get("ownerEmail") || "").trim().toLowerCase();
    const newPass = String(fd.get("newPasscode") || "").trim();
    const passcodeHash = newPass ? await hashSecret(newPass) : current.passcodeHash;
    saveOwnerAuth({ email: newEmail, passcodeHash });
    document.getElementById("sec-pass").value = "";
    updateOwnerBar();
    showToast("✓ E-mail autorizado e chave de acesso atualizados!");
  });

  // Banco de Imagens
  const handleBankFile = async (file) => {
    if (!file || !file.type.startsWith("image/")) return;
    state.pendingBankImageDataUrl = await readAndCompressImage(file);
    els.bankPreviewImg.src = state.pendingBankImageDataUrl;
    els.bankFilePreview.hidden = false;
  };

  els.bankFileInput.addEventListener("change", (e) => handleBankFile(e.target.files?.[0]));
  els.bankDropzone.addEventListener("dragover", (e) => {
    e.preventDefault();
    els.bankDropzone.classList.add("drag-over");
  });
  els.bankDropzone.addEventListener("dragleave", () => els.bankDropzone.classList.remove("drag-over"));
  els.bankDropzone.addEventListener("drop", (e) => {
    e.preventDefault();
    els.bankDropzone.classList.remove("drag-over");
    handleBankFile(e.dataTransfer.files?.[0]);
  });

  els.imageBankForm.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!state.pendingBankImageDataUrl) {
      showToast("Selecione ou arraste uma imagem primeiro.");
      return;
    }
    const fd = new FormData(els.imageBankForm);
    const newImg = {
      id: `img-${Date.now()}`,
      title: String(fd.get("title") || "").trim(),
      caption: String(fd.get("caption") || "").trim(),
      hashtag: String(fd.get("hashtag") || "#SegurancaDoTrabalho").trim(),
      category: "offshore",
      source: "portal",
      image: state.pendingBankImageDataUrl,
      date: new Date().toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" })
    };
    state.imageBank.unshift(newImg);
    saveImageBank(state.imageBank);
    state.pendingBankImageDataUrl = "";
    els.bankFilePreview.hidden = true;
    els.imageBankForm.reset();
    refreshAllViews();
    showToast("✓ Imagem adicionada ao Banco de Imagens!");
  });

  // Instagram & Google Analytics & AdSense
  els.instagramConfigForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const fd = new FormData(els.instagramConfigForm);
    saveInstagramConfig({
      handle: String(fd.get("handle") || "").trim(),
      hashtag: String(fd.get("hashtag") || "").trim(),
      feedUrl: String(fd.get("feedUrl") || "").trim()
    });
    renderInstagramBar();
    showToast("✓ Configurações do Instagram salvas!");
  });

  els.syncInstagramBtn.addEventListener("click", syncInstagramFeed);

  els.analyticsConfigForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const fd = new FormData(els.analyticsConfigForm);
    const readers = Math.max(0, Number(fd.get("monthlyReaders") || 0));
    saveAnalyticsConfig({
      gaMeasurementId: String(fd.get("gaMeasurementId") || "").trim(),
      monthlyReaders: readers
    });
    saveAdsenseConfig({
      publisherId: String(fd.get("publisherId") || "").trim(),
      enabled: true
    });
    renderRealIndicators();
    showToast(
      readers >= SITE_CONFIG.minReadersToDisplay
        ? "✓ Configurações Google e Leitores Mensais salvos!"
        : "✓ Salvo! Leitores Mensais só aparecem ao atingir 500+ leitores reais."
    );
  });

  // Lightbox
  els.lbShareWa.addEventListener("click", () => {
    const item = state.activeLightboxItem;
    if (!item) return;
    const text = `🦺 *${item.title}*\n${item.caption}\n${item.hashtag || ""}\n\nPortal ${state.profile.name} TST: ${window.location.href}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank", "noopener");
  });

  els.lbCopyIg.addEventListener("click", async () => {
    const item = state.activeLightboxItem;
    if (!item) return;
    const text = `${item.title}\n\n${item.caption}\n\n${item.hashtag || "#SegurancaDoTrabalho #TST"}`;
    try {
      await navigator.clipboard.writeText(text);
      showToast("Legenda + hashtags copiadas!");
    } catch {
      showToast("Não foi possível copiar automaticamente.");
    }
  });

  // Filtros e Busca
  document.querySelectorAll("[data-nav-cat]").forEach((link) => {
    link.addEventListener("click", () => {
      state.category = link.dataset.navCat;
      document.querySelectorAll(".cat-tab").forEach((t) => t.classList.toggle("active", t.dataset.category === state.category));
      document.querySelectorAll(".nav-link").forEach((n) => n.classList.toggle("active", n === link));
      renderFeed();
      els.mainNav.classList.remove("open");
    });
  });

  document.querySelectorAll(".img-tab").forEach((btn) => {
    btn.addEventListener("click", () => {
      state.imageFilter = btn.dataset.imgFilter;
      document.querySelectorAll(".img-tab").forEach((b) => b.classList.toggle("active", b === btn));
      renderImageBank();
    });
  });

  els.searchInput.addEventListener("input", (e) => {
    state.search = e.target.value;
    renderFeed();
  });

  els.mobileMenuBtn.addEventListener("click", () => els.mainNav.classList.toggle("open"));

  document.getElementById("sidebar-newsletter-form").addEventListener("submit", (e) => {
    e.preventDefault();
    e.target.reset();
    showToast("✓ E-mail cadastrado! Você será avisado sobre novas publicações.");
  });

  window.addEventListener("scroll", () => {
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? Math.min(100, Math.max(0, (window.scrollY / docHeight) * 100)) : 0;
    els.readingProgress.style.width = `${pct}%`;
  });
}

function init() {
  initTheme();
  refreshAllViews();
  bindEvents();

  // Permite abrir o login do proprietário via link secreto ?acesso=editor
  const params = new URLSearchParams(window.location.search);
  if (params.get("acesso") === "editor") {
    requestOwnerAccess("write");
  }
}

init();
