import {
  STORAGE_KEYS,
  SITE_CONFIG,
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

const state = {
  posts: [],
  imageBank: [],
  category: "all",
  imageFilter: "all",
  search: "",
  pendingBankImageDataUrl: "",
  activeLightboxItem: null
};

const els = {
  readingProgress: document.getElementById("reading-progress"),
  heroFeatured: document.getElementById("hero-featured"),
  postsGrid: document.getElementById("posts-grid"),
  feedStatus: document.getElementById("feed-status"),
  recentList: document.getElementById("recent-list"),
  instagramStatusBar: document.getElementById("instagram-status-bar"),
  imageBankGrid: document.getElementById("image-bank-grid"),
  aboutBioText: document.getElementById("about-bio-text"),
  aboutStats: document.getElementById("about-stats"),
  searchInput: document.getElementById("search-input"),
  themeToggle: document.getElementById("theme-toggle"),
  mobileMenuBtn: document.getElementById("mobile-menu-btn"),
  mainNav: document.getElementById("main-nav"),

  // Editor Intuitivo
  editorModal: document.getElementById("editor-modal"),
  editorForm: document.getElementById("editor-form"),
  edId: document.getElementById("ed-id"),
  edTitle: document.getElementById("ed-title"),
  edCategory: document.getElementById("ed-category"),
  edSubtitle: document.getElementById("ed-subtitle"),
  edSummary: document.getElementById("ed-summary"),
  edTip: document.getElementById("ed-tip"),
  edBody: document.getElementById("ed-body"),
  edImageValue: document.getElementById("ed-image-value"),
  edCoverUpload: document.getElementById("ed-cover-upload"),
  coverThumbnails: document.getElementById("cover-thumbnails"),
  coverPreviewImg: document.getElementById("cover-preview-img"),
  coverPreviewLabel: document.getElementById("cover-preview-label"),
  edCancelEdit: document.getElementById("ed-cancel-edit"),
  edSubmitBtn: document.getElementById("ed-submit-btn"),
  managePostsList: document.getElementById("manage-posts-list"),

  // Banco de Imagens
  imageBankForm: document.getElementById("image-bank-form"),
  bankFileInput: document.getElementById("bank-file-input"),
  bankDropzone: document.getElementById("bank-dropzone"),
  bankFilePreview: document.getElementById("bank-file-preview"),
  bankPreviewImg: document.getElementById("bank-preview-img"),
  manageImagesList: document.getElementById("manage-images-list"),

  // Instagram & Analytics
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

/**
 * Converte imagem enviada pelo usuário em JPEG leve (max 1200px) para salvar rápido e sem travar
 */
function readAndCompressImage(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Não foi possível ler a imagem."));
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const maxW = 1200;
        const scale = img.width > maxW ? maxW / img.width : 1;
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", 0.82));
      };
      img.onerror = () => resolve(reader.result);
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}

// Converte texto do editor fácil em blocos estruturados
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
      return { type: "callout", title: "Destaque do Cleilson", text: chunk.replace(/^DESTAQUE:\s*/i, "").trim() };
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
// RENDERIZAÇÃO PRINCIPAL (SEM NÚMEROS FALSOS)
// =========================================================================
function renderRealIndicators() {
  els.aboutBioText.textContent = SITE_CONFIG.author.bio;
  const m = computeRealMetrics(state.posts, state.imageBank);

  const cards = [
    {
      value: String(m.totalMaterials),
      label: `Conteúdos Publicados (${m.articlesCount} ${m.articlesCount === 1 ? "artigo" : "artigos"} • ${m.visualsCount} ${m.visualsCount === 1 ? "imagem" : "imagens"})`
    }
  ];

  // Regra estrita: Leitores Mensais só aparece após atingir >= 500 leitores reais
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
    els.heroFeatured.innerHTML = `<div style="padding:36px">Nenhuma publicação disponível ainda. Use a Área do Editor para publicar seu primeiro texto.</div>`;
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
        <span>Por <strong>Cleilson</strong></span>
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

// =========================================================================
// BANCO DE IMAGENS & INTEGRAÇÃO INSTAGRAM (@ E #HASHTAG)
// =========================================================================
function renderInstagramBar() {
  const cfg = loadInstagramConfig();
  if (cfg.handle || cfg.feedUrl) {
    els.instagramStatusBar.innerHTML = `
      <div class="ig-status-info">
        <span class="ig-dot connected"></span>
        <span>
          <strong>Instagram conectado:</strong> ${escapeHtml(cfg.handle || "Conta vinculada")}
          ${cfg.hashtag ? ` • Filtro: <strong>${escapeHtml(cfg.hashtag)}</strong>` : ""}
        </span>
      </div>
      <div class="ig-status-actions">
        ${cfg.feedUrl ? `<button type="button" id="quick-sync-ig" class="btn btn-outline-dark btn-sm">↻ Atualizar do Instagram</button>` : ""}
        <button type="button" id="quick-edit-ig" class="card-listen-btn">Configurar</button>
      </div>
    `;
  } else {
    els.instagramStatusBar.innerHTML = `
      <div class="ig-status-info">
        <span class="ig-dot"></span>
        <span><strong>Integração Instagram disponível:</strong> conecte o <strong>@</strong> da conta e uma <strong>#hashtag</strong> para puxar cartazes e infográficos automaticamente.</span>
      </div>
      <button type="button" id="quick-edit-ig" class="btn btn-outline-dark btn-sm">Conectar Agora</button>
    `;
  }

  const qSync = document.getElementById("quick-sync-ig");
  if (qSync) qSync.addEventListener("click", syncInstagramFeed);
  const qEdit = document.getElementById("quick-edit-ig");
  if (qEdit) qEdit.addEventListener("click", () => openEditor("integrations"));
}

function renderImageBank() {
  const visible = state.imageBank.filter((img) => state.imageFilter === "all" || img.source === state.imageFilter);

  if (visible.length === 0) {
    els.imageBankGrid.innerHTML = `
      <div class="sidebar-card" style="grid-column: 1 / -1; text-align:center; padding: 32px;">
        <p style="margin:0; color:var(--text-secondary)">Nenhuma imagem nesta aba ainda. Clique em <strong>+ Adicionar Imagem</strong> ou sincronize seu Instagram.</p>
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
    renderImageBank();
    renderManageLists();
    renderRealIndicators();
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
// ÁREA DO EDITOR INTUITIVA (PARA PESSOA LEIGA)
// =========================================================================
function openEditor(tab = "write") {
  els.editorModal.hidden = false;
  switchStudioTab(tab);
  renderCoverThumbnails();
  renderManageLists();
  syncIntegrationForms();
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

function renderManageLists() {
  els.managePostsList.innerHTML = state.posts
    .map(
      (p) => `
      <div class="manage-row">
        <div>
          <strong>${escapeHtml(p.title)}</strong>
          <small>${escapeHtml(p.categoryLabel)} • ${escapeHtml(p.date)}</small>
        </div>
        <div class="manage-row-actions">
          <button type="button" class="card-listen-btn" data-edit-post="${escapeHtml(p.id)}">Editar</button>
          <button type="button" class="card-listen-btn btn-danger-soft" data-delete-post="${escapeHtml(p.id)}">Excluir</button>
        </div>
      </div>`
    )
    .join("");

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
  els.edCancelEdit.hidden = true;
  els.edSubmitBtn.textContent = "✓ Publicar no Site Agora";
  setSelectedCover("assets/images/hero-offshore.jpg", "Capa padrão selecionada");
}

function loadPostIntoEditor(id) {
  const post = state.posts.find((p) => p.id === id);
  if (!post) return;
  els.edId.value = post.id;
  els.edTitle.value = post.title;
  els.edCategory.value = post.category || "offshore";
  els.edSubtitle.value = post.subtitle || "";
  els.edSummary.value = (post.summary || []).join("\n");
  els.edTip.value = post.practicalTip || "";
  els.edBody.value = serializeBlocksToEasyText(post.content || []);
  setSelectedCover(post.image || "assets/images/hero-offshore.jpg", "Capa atual do artigo");
  els.edCancelEdit.hidden = false;
  els.edSubmitBtn.textContent = "✓ Salvar Alterações";
  els.editorModal.querySelector(".modal-dialog").scrollTo({ top: 0, behavior: "smooth" });
}

function syncIntegrationForms() {
  const ig = loadInstagramConfig();
  document.getElementById("ig-handle").value = ig.handle || "";
  document.getElementById("ig-hashtag").value = ig.hashtag || "#cleilsontst";
  document.getElementById("ig-feed-url").value = ig.feedUrl || "";

  const ga = loadAnalyticsConfig();
  document.getElementById("ga-id").value = ga.gaMeasurementId || "";
  document.getElementById("real-readers").value = ga.monthlyReaders || 0;
}

function refreshAllViews() {
  state.posts = loadAllPosts();
  state.imageBank = loadImageBank();
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
  // Abrir editor em diferentes abas
  ["open-editor-top", "open-editor-header", "open-editor-about", "open-editor-footer"].forEach((id) => {
    const btn = document.getElementById(id);
    if (btn) btn.addEventListener("click", () => openEditor("write"));
  });
  document.getElementById("open-image-bank-btn").addEventListener("click", () => openEditor("images"));
  document.getElementById("open-instagram-cfg-btn").addEventListener("click", () => openEditor("integrations"));
  document.getElementById("open-analytics-about").addEventListener("click", () => openEditor("integrations"));
  document.getElementById("open-privacy-btn").addEventListener("click", () => (els.privacyModal.hidden = false));

  // Abas do editor
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

    // Botões de formatação fácil no texto
    const toolBtn = e.target.closest("[data-insert]");
    if (toolBtn) {
      const kind = toolBtn.dataset.insert;
      const ta = els.edBody;
      const snippets = {
        subtitle: "\n\n## Título da Seção\n\n",
        bold: " **texto em destaque** ",
        callout: "\n\nDESTAQUE: Escreva aqui uma orientação importante de campo.\n\n",
        checklist: "\n\n- Primeiro item para conferir\n- Segundo item para conferir\n- Terceiro item para conferir\n\n"
      };
      const pos = ta.selectionStart || ta.value.length;
      ta.value = ta.value.slice(0, pos) + (snippets[kind] || "") + ta.value.slice(pos);
      ta.focus();
    }
  });

  // Upload de capa direto no editor de artigo
  els.edCoverUpload.addEventListener("change", async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const dataUrl = await readAndCompressImage(file);
      setSelectedCover(dataUrl, `Foto enviada: ${file.name}`);
      showToast("Foto de capa carregada com sucesso!");
    } catch {
      showToast("Não foi possível carregar a imagem.");
    }
  });

  // Salvar / Publicar Artigo
  els.editorForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const title = els.edTitle.value.trim();
    const category = els.edCategory.value;
    const catLabels = {
      offshore: "Offshore • NR-37",
      onshore: "Onshore • Indústria",
      nrs: "NRs & Legislação"
    };

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
      categoryLabel: catLabels[category] || "Segurança do Trabalho",
      badge: existing ? existing.badge : "Nova Publicação",
      title,
      subtitle: els.edSubtitle.value.trim(),
      date: existing
        ? existing.date
        : new Date().toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" }),
      featured: existing ? Boolean(existing.featured) : false,
      image: els.edImageValue.value || "assets/images/hero-offshore.jpg",
      imageCaption: `Publicação técnica de Cleilson TST — ${catLabels[category] || ""}`,
      summary: els.edSummary.value
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean),
      practicalTip: els.edTip.value.trim(),
      content: parseEasyEditorBody(els.edBody.value)
    };

    saveCustomPost(postObj);
    resetEditorForm();
    refreshAllViews();
    els.editorModal.hidden = true;
    showToast("✓ Publicado! Os indicadores reais e especialidades foram atualizados.");
  });

  els.edCancelEdit.addEventListener("click", resetEditorForm);

  // Upload no Banco de Imagens (clique ou arrastar e soltar)
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

  // Salvar Instagram & Sincronizar
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

  // Salvar Analytics / Leitores Mensais Reais
  els.analyticsConfigForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const fd = new FormData(els.analyticsConfigForm);
    const readers = Math.max(0, Number(fd.get("monthlyReaders") || 0));
    saveAnalyticsConfig({
      gaMeasurementId: String(fd.get("gaMeasurementId") || "").trim(),
      monthlyReaders: readers
    });
    renderRealIndicators();
    showToast(
      readers >= SITE_CONFIG.minReadersToDisplay
        ? "✓ Indicador de Leitores Mensais ativado no site!"
        : "✓ Salvo! O indicador aparecerá automaticamente ao atingir 500 leitores reais."
    );
  });

  // Lightbox: WhatsApp e Instagram
  els.lbShareWa.addEventListener("click", () => {
    const item = state.activeLightboxItem;
    if (!item) return;
    const text = `🦺 *${item.title}*\n${item.caption}\n${item.hashtag || ""}\n\nPortal Cleilson TST: ${window.location.href}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank", "noopener");
  });

  els.lbCopyIg.addEventListener("click", async () => {
    const item = state.activeLightboxItem;
    if (!item) return;
    const text = `${item.title}\n\n${item.caption}\n\n${item.hashtag || "#SegurancaDoTrabalho #TST"}`;
    try {
      await navigator.clipboard.writeText(text);
      showToast("Legenda + hashtags copiadas! Pronto para postar no Instagram.");
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

  document.querySelectorAll(".cat-tab").forEach((btn) => {
    btn.addEventListener("click", () => {
      state.category = btn.dataset.category;
      document.querySelectorAll(".cat-tab").forEach((b) => b.classList.toggle("active", b === btn));
      renderFeed();
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
}

init();
