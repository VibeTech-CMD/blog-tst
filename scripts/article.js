import { STORAGE_KEYS, loadAllPosts, loadProfile, calculateReadTime } from "./data.js";

function escapeHtml(str = "") {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function showToast(msg) {
  const toast = document.getElementById("toast");
  toast.textContent = msg;
  toast.hidden = false;
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => (toast.hidden = true), 3200);
}

function initThemeAndFont() {
  const saved = localStorage.getItem(STORAGE_KEYS.theme) || "light";
  document.documentElement.setAttribute("data-theme", saved);

  document.getElementById("theme-toggle").addEventListener("click", () => {
    const next = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem(STORAGE_KEYS.theme, next);
  });

  let fontScale = 1.08;
  const bodyEl = document.getElementById("art-body");
  document.getElementById("font-inc").addEventListener("click", () => {
    fontScale = Math.min(1.4, Number((fontScale + 0.08).toFixed(2)));
    bodyEl.style.fontSize = `${fontScale}rem`;
  });
  document.getElementById("font-dec").addEventListener("click", () => {
    fontScale = Math.max(0.92, Number((fontScale - 0.08).toFixed(2)));
    bodyEl.style.fontSize = `${fontScale}rem`;
  });

  const progress = document.getElementById("reading-progress");
  window.addEventListener("scroll", () => {
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? Math.min(100, Math.max(0, (window.scrollY / docHeight) * 100)) : 0;
    progress.style.width = `${pct}%`;
  });
}

function renderStandaloneArticle() {
  const params = new URLSearchParams(window.location.search);
  const slug = params.get("post");
  const posts = loadAllPosts();
  const post = posts.find((p) => p.slug === slug) || (!slug ? posts[0] : null);

  if (!post) {
    document.getElementById("standalone-article").hidden = true;
    document.getElementById("article-not-found").hidden = false;
    return;
  }

  const profile = loadProfile();
  document.title = `${post.title} | ${profile.name} TST`;
  document.getElementById("art-author-avatar-top").src = profile.avatar;
  document.getElementById("art-author-name-top").textContent = `Por ${profile.name}`;
  document.getElementById("art-author-role-top").textContent = profile.role;
  document.getElementById("art-author-avatar-bottom").src = profile.avatar;
  document.getElementById("art-author-name-bottom").textContent = `${profile.name} — ${profile.role}`;
  document.getElementById("art-author-bio-bottom").textContent = profile.shortBio || profile.bio;

  document.getElementById("art-category-badge").textContent = post.categoryLabel;
  document.getElementById("art-date-read").textContent = `${post.date} • ${calculateReadTime(post)}`;
  document.getElementById("art-title").textContent = post.title;
  document.getElementById("art-subtitle").textContent = post.subtitle;

  const summaryList = document.getElementById("art-summary-list");
  const summaryBox = document.getElementById("article-summary-box");
  if (post.summary && post.summary.length > 0) {
    summaryList.innerHTML = post.summary.map((s) => `<li>${escapeHtml(s)}</li>`).join("");
  } else {
    summaryBox.hidden = true;
  }

  const tipEl = document.getElementById("art-practical-tip");
  if (post.practicalTip) {
    tipEl.innerHTML = `<strong>Aplicação Prática no Campo (Dica do Cleilson):</strong> ${escapeHtml(post.practicalTip)}`;
  } else {
    tipEl.hidden = true;
  }

  const img = document.getElementById("art-image");
  img.src = post.image || "assets/images/hero-offshore.jpg";
  img.alt = post.title;
  document.getElementById("art-image-caption").textContent = post.imageCaption || "";

  const bodyChunks = [];
  (post.content || []).forEach((block, idx) => {
    if (block.type === "h2") {
      bodyChunks.push(`<h2>${escapeHtml(block.text)}</h2>`);
    } else if (block.type === "callout") {
      bodyChunks.push(`<div class="article-callout"><strong>${escapeHtml(block.title || "Destaque")}</strong><span>${escapeHtml(block.text)}</span></div>`);
    } else if (block.type === "checklist") {
      const items = (block.items || []).map((i) => `<li>${escapeHtml(i)}</li>`).join("");
      bodyChunks.push(`<div class="article-checklist"><h3>${escapeHtml(block.title || "Lista de Verificação")}</h3><ul>${items}</ul></div>`);
    } else {
      const formatted = escapeHtml(block.text || "").replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
      bodyChunks.push(`<p>${formatted}</p>`);
    }

    // Espaço pré-definido Google Ads In-Article (após o 2º bloco)
    if (idx === 1) {
      bodyChunks.push(`
        <aside class="ad-slot ad-google-clean ad-in-article" data-ad-slot="in-article" aria-label="Publicidade Google Ads">
          <div class="ad-badge">GOOGLE ADS • ESPAÇO IN-ARTICLE (TEMAS SST &amp; INDÚSTRIA)</div>
          <div class="ad-placeholder-clean">Espaço reservado para anúncio contextual do Google Ads relacionado ao tema deste artigo.</div>
        </aside>
      `);
    }
  });
  document.getElementById("art-body").innerHTML = bodyChunks.join("");

  // Relacionados (abrem na própria página independente)
  const related = posts.filter((p) => p.slug !== post.slug).slice(0, 2);
  document.getElementById("related-grid").innerHTML = related
    .map(
      (r) => `
      <a href="artigo.html?post=${encodeURIComponent(r.slug)}" class="post-card related-link-card">
        <div class="post-card-body">
          <span class="post-card-cat" style="font-size:0.76rem">${escapeHtml(r.categoryLabel)}</span>
          <h4 class="post-card-title" style="margin-top:4px">${escapeHtml(r.title)}</h4>
          <span class="card-action-link">Abrir leitura →</span>
        </div>
      </a>`
    )
    .join("");

  // Compartilhamento
  document.getElementById("share-whatsapp").addEventListener("click", () => {
    const text = `Confira este artigo de Segurança do Trabalho do Cleilson TST: "${post.title}" ${window.location.href}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank", "noopener");
  });

  document.getElementById("share-linkedin").addEventListener("click", () => {
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`, "_blank", "noopener");
  });

  document.getElementById("share-copy").addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      showToast("Link copiado! Pronto para compartilhar.");
    } catch {
      showToast("Copie o link direto da barra do navegador.");
    }
  });
}

initThemeAndFont();
renderStandaloneArticle();
