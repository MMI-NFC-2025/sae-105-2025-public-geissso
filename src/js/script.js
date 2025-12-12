/* -----------------------------
   Données (démo / placeholder)
------------------------------*/
const DAYS = [
  { id: "2026-10-28", label: "Mer 28/10" },
  { id: "2026-10-29", label: "Jeu 29/10" },
  { id: "2026-10-30", label: "Ven 30/10" },
  { id: "2026-10-31", label: "Sam 31/10" },
];

const SCENES = [
  { id: "roots",  name: "Scène Roots" },
  { id: "dub",    name: "Dub Yard" },
  { id: "fusion", name: "Fusion Stage" },
];

const ARTISTS = [
  {
    id: "raslion", name: "Ras Lion", genre: "roots",
    bio: "Artiste roots emblématique, énergie solaire et message conscient.",
    slots: [{ day: "2026-10-29", time: "20:30", scene: "roots" }]
  },
  {
    id: "dubwave", name: "Dubwave", genre: "dub",
    bio: "Dub analogique, basses profondes et live mix.",
    slots: [{ day: "2026-10-30", time: "22:00", scene: "dub" }]
  },
  {
    id: "suntribe", name: "SunTribe", genre: "fusion",
    bio: "Reggae fusion & cuivres, ambiance festive. ",
    slots: [{ day: "2026-10-31", time: "19:00", scene: "fusion" }]
  },
];

const PARTNERS = [
  { id: "logo_mmi", name: "MMI" },
  { id: "logo_iut_nfc", name: "IUT NFC" },
  { id: "logo_ville_audincourt", name: "Ville d'Audincourt" },
  { id: "logo_france_bleu", name: "France Bleu" }
];

/* -----------------------------
   Helper: génère le chemin d'image depuis /assets/img/
------------------------------*/
const getImagePath = (id) => `/assets/img/${id}.webp`;

/* -----------------------------
   Menu burger — logique fournie (MAJ)
------------------------------*/
const toggle = document.querySelector(".menu-btn");
const nav = document.querySelector(".menu");
const logo = document.querySelector(".header__logo");
const page = document.body;

if (toggle && nav) {
  toggle.addEventListener("click", () => {
    const isOpen = toggle.ariaExpanded === "true";
    const isClosed = !isOpen;

    // ARIA + visibilité
    toggle.ariaExpanded = isClosed;
    nav.hidden = isOpen;

    // Plein écran mobile + no-scroll
    nav.classList.toggle("menu--open", isClosed);
    logo && logo.classList.toggle("header__logo--extend", isClosed);
    page.classList.toggle("u-noscroll", isClosed);
  });
}


/* -----------------------------
   Utils
------------------------------*/
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

/* -----------------------------
   Partenaires
------------------------------*/
(() => {
  $$("[data-partners]").forEach((el) => {
    const logos = PARTNERS.map((p) => `<img src="/assets/icons/${p.id}.svg" alt="${p.name}" class="partner-logo" loading="lazy" width="120" height="60">`).join("");
    el.innerHTML = `<div class="partners-track">${logos}${logos}</div>`;
  });
})();

/* -----------------------------
   Lien actif
------------------------------*/
(() => {
  const here = (location.pathname.split("/").pop() || "index.html");
  $$(".menu__link").forEach((a) => {
    const href = a.getAttribute("href") || "";
    if (href.endsWith(here)) a.style.textDecoration = "underline";
  });
})();

/* -----------------------------
   Programme + filtres
------------------------------*/
(() => {
  const list = $("#programme-list");
  if (!list) return;

  const selDay = $("#f-day");
  const selScene = $("#f-scene");
  const input = $("#f-search");

  if (selDay) {
    selDay.innerHTML = `<option value="">Tous les jours</option>` +
      DAYS.map((d) => `<option value="${d.id}">${d.label}</option>`).join("");
  }
  if (selScene) {
    selScene.innerHTML = `<option value="">Toutes les scènes</option>` +
      SCENES.map((s) => `<option value="${s.id}">${s.name}</option>`).join("");
  }

  const draw = () => {
    const d = selDay ? selDay.value : "";
    const s = selScene ? selScene.value : "";
    const t = (input?.value || "").toLowerCase().trim();

    const slots = [];
    ARTISTS.forEach((a) => a.slots.forEach((sl) => slots.push({ ...sl, artist: a })));
    slots.sort((a, b) => (a.day + a.time).localeCompare(b.day + b.time));

    const out = slots.filter((x) =>
      (!d || x.day === d) &&
      (!s || x.scene === s) &&
      (!t || x.artist.name.toLowerCase().includes(t))
    );

    list.innerHTML =
      out.map((x) => `
      <article class="card artist-card" role="listitem">
        <img class="artist-card__thumb" src="${getImagePath(x.artist.id)}" alt="Photo de ${x.artist.name}, artiste ${x.artist.genre}" loading="lazy">
        <div>
          <div class="chips" role="list">
            <span class="chips__item" role="listitem">${DAYS.find((i) => i.id === x.day).label}</span>
            <span class="chips__item" role="listitem">${x.time}</span>
            <span class="chips__item" role="listitem">${SCENES.find((i) => i.id === x.scene).name}</span>
          </div>
          <h3 class="m-0"><a href="/artiste.html?id=${x.artist.id}">${x.artist.name}</a></h3>
          <p class="text-muted">${x.artist.bio}</p>
        </div>
      </article>`).join("") || `<p class="text-muted">Aucun résultat.</p>`;
  };

  [selDay, selScene, input].forEach((el) => el && el.addEventListener("input", draw));
  $("#dl-programme")?.addEventListener("click", () => {
    location.href = "/src/assets/pdf/echos-sonore-programme.pdf";
  });
  draw();
})();

/* -----------------------------
   Liste artistes
------------------------------*/
(() => {
  const grid = $("#artists-grid");
  if (!grid) return;
  grid.innerHTML = [...ARTISTS]
    .sort((a, b) => a.name.localeCompare(b.name))
    .map(
      (a) => `
    <a class="card" href="/artiste.html?id=${a.id}" role="listitem">
      <div class="artist-card">
        <img class="artist-card__thumb" src="${getImagePath(a.id)}" alt="Photo de ${a.name}, artiste ${a.genre}" loading="lazy">
        <div>
          <h3 class="m-0">${a.name}</h3>
          <div class="chips"><span class="chips__item">${a.genre}</span></div>
        </div>
      </div>
    </a>`
    )
    .join("");
})();

/* -----------------------------
   Fiche artiste
------------------------------*/
(() => {
  const wrap = $("#artist-detail");
  if (!wrap) return;

  const id = new URLSearchParams(location.search).get("id");
  const a = ARTISTS.find((x) => x.id === id) || ARTISTS[0];

  const slots = a.slots
    .map((s) => {
      const d = DAYS.find((x) => x.id === s.day).label;
      const sc = SCENES.find((x) => x.id === s.scene).name;
      return `<span class="chips__item">${d} · ${s.time} · ${sc}</span>`;
    })
    .join("");

  // Générer 3 images de galerie (artiste-1.webp, artiste-2.webp, artiste-3.webp)
  const gal = [1, 2, 3]
    .map(i => `<div class="carousel__slide"><img class="media-round" src="/assets/img/${a.id}-${i}.webp" alt="${a.name} en performance - Photo ${i}" loading="lazy"></div>`)
    .join("");

  wrap.innerHTML = `
    <div class="grid u-grid-col-2">
      <div class="card"><img class="media-round" src="${getImagePath(a.id)}" alt="Photo de ${a.name} en concert" loading="lazy"></div>
      <div class="card">
        <h1 class="m-0">${a.name}</h1>
        <div class="chips mt-8" role="list">${slots}</div>
        <p class="mt-8">${a.bio}</p>
      </div>
    </div>
    <h2 class="mt-8">Galerie</h2>
    <div class="carousel">
      <div class="carousel__track">${gal}</div>
      <div class="carousel__controls">
        <button class="btn btn--light carousel__button--prev" aria-label="Image précédente">←</button>
        <button class="btn btn--light carousel__button--next" aria-label="Image suivante">→</button>
      </div>
    </div>
  `;

  setTimeout(() => {
    const carousel = wrap.querySelector('.carousel');
    if (carousel) initCarousel(carousel);
  }, 50);
})();

/* -----------------------------
   Scènes (liste + fiche)
------------------------------*/
(() => {
  const grid = $("#scenes-grid");
  if (grid) {
    grid.innerHTML = SCENES.map(
      (s) => `
      <a class="card" href="/scene.html?id=${s.id}" role="listitem">
        <img class="media-round" src="${getImagePath(s.id)}" alt="Vue de la ${s.name}" loading="lazy">
        <h3>${s.name}</h3>
      </a>`
    ).join("");
  }

  const detail = $("#scene-detail");
  if (detail) {
    const id = new URLSearchParams(location.search).get("id");
    const s = SCENES.find((x) => x.id === id) || SCENES[0];

    const playing = ARTISTS
      .filter((a) => a.slots.some((sl) => sl.scene === s.id))
      .sort((a, b) => (a.slots[0].day + a.slots[0].time).localeCompare(b.slots[0].day + b.slots[0].time));

    detail.innerHTML = `
      <div class="card"><img class="media-round" src="${getImagePath(s.id)}" alt="Vue panoramique de la ${s.name}" loading="lazy"></div>
      <h1>${s.name}</h1>
      <div class="grid grid--3">
        ${playing
          .map(
            (a) => `
          <a class="card" href="/artiste.html?id=${a.id}">
            <div class="artist-card">
              <img class="artist-card__thumb" src="${getImagePath(a.id)}" alt="Photo de ${a.name}, artiste ${a.genre}" loading="lazy">
              <div>
                <h3 class="m-0">${a.name}</h3>
                <div class="chips">
                  ${a.slots
                    .filter((sl) => sl.scene === s.id)
                    .map(
                      (sl) =>
                        `<span class="chips__item">${DAYS.find((d) => d.id === sl.day).label} · ${sl.time}</span>`
                    )
                    .join("")}
                </div>
              </div>
            </div>
          </a>`
          )
          .join("")}
      </div>`;
  }
})();

/* ----------------------------------------------------
   Carousel — scroll horizontal
-----------------------------------------------------*/
function initCarousel(carousel) {
  if (!carousel) return;

  const track = carousel.querySelector(".carousel__track");
  const slides = Array.from(track.children);
  const btnPrev = carousel.querySelector(".carousel__button--prev");
  const btnNext = carousel.querySelector(".carousel__button--next");

  function getSlideWidth() {
    return slides[0]?.getBoundingClientRect().width || 0;
  }

  function getCurrentIndex() {
    const w = getSlideWidth();
    return Math.round(track.scrollLeft / w);
  }

  function scrollToIndex(index) {
    const w = getSlideWidth();
    if (index < 0) index = 0;
    if (index > slides.length - 1) index = slides.length - 1;
    track.scrollTo({ left: index * w, behavior: "smooth" });
  }

  function updateButtons() {
    const i = getCurrentIndex();
    if (btnPrev) btnPrev.disabled = i === 0;
    if (btnNext) btnNext.disabled = i >= slides.length - 1;
  }

  btnPrev?.addEventListener("click", () => scrollToIndex(getCurrentIndex() - 1));
  btnNext?.addEventListener("click", () => scrollToIndex(getCurrentIndex() + 1));

  track.tabIndex = 0;
  track.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") { e.preventDefault(); btnPrev?.click(); }
    if (e.key === "ArrowRight") { e.preventDefault(); btnNext?.click(); }
  });

  track.addEventListener("scroll", updateButtons, { passive: true });
  window.addEventListener("resize", updateButtons);

  updateButtons();
}

// Initialiser tous les carousels au chargement
(() => {
  document.querySelectorAll(".carousel").forEach(initCarousel);
})();

/* ----------------------------------------------------
   Newsletter — validation & feedback
-----------------------------------------------------*/
(() => {
  const form = document.querySelector('[data-newsletter-form]');
  if (!form) return;

  const emailInput = form.querySelector('input[type="email"]');
  const statusEl = form.querySelector('[data-newsletter-status]');
  const submitBtn = form.querySelector('button[type="submit"]');

  const setStatus = (type, message) => {
    if (!statusEl) return;
    statusEl.hidden = false;
    statusEl.textContent = message;
    statusEl.classList.toggle('is-success', type === 'success');
    statusEl.classList.toggle('is-error', type === 'error');
  };

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!emailInput) return;
    const email = emailInput.value.trim();
    const isValid = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email);

    if (!isValid) {
      setStatus('error', "Merci d'entrer un email valide.");
      emailInput.focus();
      return;
    }

    if (submitBtn) submitBtn.disabled = true;
    setStatus('success', "Merci ! On t'envoie les actus très vite.");

    setTimeout(() => {
      form.reset();
      if (submitBtn) submitBtn.disabled = false;
    }, 700);
  });
})();

/* -----------------------------
   Carte interactive (remplacée par lien Google Maps)
------------------------------*/
// Code supprimé pour optimiser l'écoindex
