// Données
const DAYS = [
  { id: "2026-10-28", label: "Mer 28/10" },
  { id: "2026-10-29", label: "Jeu 29/10" },
  { id: "2026-10-30", label: "Ven 30/10" },
  { id: "2026-10-31", label: "Sam 31/10" },
];

const SCENES = [
  { id: "roots", name: "Scène Roots" },
  { id: "dub", name: "Dub Yard" },
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

const getImagePath = (id) => `/assets/img/${id}.webp`;

// Utils
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

// Menu burger
(() => {
  const toggle = $(".menu-btn");
  const nav = $(".menu");
  if (!toggle || !nav) return;

  const closeMenu = () => {
    toggle.ariaExpanded = "false";
    nav.hidden = true;
    nav.classList.remove("menu--open");
    $(".header__logo")?.classList.remove("header__logo--extend");
    document.body.classList.remove("u-noscroll");
  };

  toggle.addEventListener("click", () => {
    const isClosed = toggle.ariaExpanded !== "true";
    toggle.ariaExpanded = String(isClosed);
    nav.hidden = !isClosed;
    nav.classList.toggle("menu--open", isClosed);
    $(".header__logo")?.classList.toggle("header__logo--extend", isClosed);
    document.body.classList.toggle("u-noscroll", isClosed);
  });

  $$("a", nav).forEach(link => link.addEventListener("click", closeMenu));
})();

// Partenaires
$$("[data-partners]").forEach(el => {
  const logos = PARTNERS.map(p => `<img src="/assets/icons/${p.id}.svg" alt="${p.name}" class="partners__logo" loading="lazy" width="120" height="60">`).join("");
  el.innerHTML = `<div class="partners__track">${logos}${logos}</div>`;
});

// Lien actif
(() => {
  const currentPage = location.pathname.split("/").pop() || "index.html";
  $$(".menu__link").forEach(link => {
    if (link.getAttribute("href")?.endsWith(currentPage)) {
      link.style.textDecoration = "underline";
    }
  });
})();

// Programme + filtres
(() => {
  const list = $("#programme-list");
  if (!list) return;

  const selDay = $("#f-day");
  const selScene = $("#f-scene");
  const input = $("#f-search");

  if (selDay) {
    selDay.innerHTML = `<option value="">Tous les jours</option>` +
      DAYS.map(d => `<option value="${d.id}">${d.label}</option>`).join("");
  }
  if (selScene) {
    selScene.innerHTML = `<option value="">Toutes les scènes</option>` +
      SCENES.map(s => `<option value="${s.id}">${s.name}</option>`).join("");
  }

  const draw = () => {
    const slots = ARTISTS.flatMap(a => a.slots.map(sl => ({ ...sl, artist: a })))
      .sort((a, b) => (a.day + a.time).localeCompare(b.day + b.time))
      .filter(x =>
        (!selDay?.value || x.day === selDay.value) &&
        (!selScene?.value || x.scene === selScene.value) &&
        (!input?.value.trim() || x.artist.name.toLowerCase().includes(input.value.toLowerCase().trim()))
      );

    list.innerHTML = slots.length ? slots.map(x => `
      <article class="card artist__card" role="listitem">
        <img class="artist__card-thumb" src="${getImagePath(x.artist.id)}" alt="Photo de ${x.artist.name}, artiste ${x.artist.genre}" loading="lazy">
        <div>
          <div class="chips" role="list">
            <span class="chips__item" role="listitem">${DAYS.find(i => i.id === x.day).label}</span>
            <span class="chips__item" role="listitem">${x.time}</span>
            <span class="chips__item" role="listitem">${SCENES.find(i => i.id === x.scene).name}</span>
          </div>
          <h3 class="m-0"><a href="/artiste.html?id=${x.artist.id}">${x.artist.name}</a></h3>
          <p class="text-muted">${x.artist.bio}</p>
        </div>
      </article>`).join("") : `<p class="text-muted">Aucun résultat.</p>`;
  };

  [selDay, selScene, input].forEach(el => el?.addEventListener("input", draw));
  $("#dl-programme")?.addEventListener("click", () => location.href = "/src/assets/pdf/echos-sonore-programme.pdf");
  draw();
})();

// Liste artistes
(() => {
  const grid = $("#artists-grid");
  if (!grid) return;
  grid.innerHTML = [...ARTISTS]
    .sort((a, b) => a.name.localeCompare(b.name))
    .map(a => `
    <a class="card" href="/artiste.html?id=${a.id}" role="listitem">
      <div class="artist__card">
        <img class="artist__card-thumb" src="${getImagePath(a.id)}" alt="Photo de ${a.name}, artiste ${a.genre}" loading="lazy">
        <div>
          <h3 class="m-0">${a.name}</h3>
          <div class="chips"><span class="chips__item">${a.genre}</span></div>
        </div>
      </div>
    </a>`).join("");
})();

// Fiche artiste
(() => {
  const wrap = $("#artist-detail");
  if (!wrap) return;

  const artist = ARTISTS.find(x => x.id === new URLSearchParams(location.search).get("id")) || ARTISTS[0];

  wrap.innerHTML = `
    <div class="grid u-grid-col-2">
      <div class="card"><img class="media__round" src="${getImagePath(artist.id)}" alt="Photo de ${artist.name} en concert" loading="lazy"></div>
      <div class="card">
        <h1 class="m-0">${artist.name}</h1>
        <div class="chips mt-8" role="list">${artist.slots.map(s => 
          `<span class="chips__item">${DAYS.find(x => x.id === s.day).label} · ${s.time} · ${SCENES.find(x => x.id === s.scene).name}</span>`
        ).join("")}</div>
        <p class="mt-8">${artist.bio}</p>
      </div>
    </div>
    <h2 class="mt-8">Galerie</h2>
    <div class="carousel">
      <div class="carousel__track">${[1, 2, 3].map(i => 
        `<div class="carousel__slide"><img class="media__round" src="/assets/img/${artist.id}-${i}.webp" alt="${artist.name} en performance - Photo ${i}" loading="lazy"></div>`
      ).join("")}</div>
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

// Scènes (liste + fiche)
(() => {
  const grid = $("#scenes-grid");
  if (grid) {
    grid.innerHTML = SCENES.map(s => `
      <a class="card" href="/scene.html?id=${s.id}" role="listitem">
        <img class="media__round" src="${getImagePath(s.id)}" alt="Vue de la ${s.name}" loading="lazy">
        <h3>${s.name}</h3>
      </a>`).join("");
  }

  const detail = $("#scene-detail");
  if (detail) {
    const scene = SCENES.find(x => x.id === new URLSearchParams(location.search).get("id")) || SCENES[0];

    detail.innerHTML = `
      <div class="card"><img class="media__round" src="${getImagePath(scene.id)}" alt="Vue panoramique de la ${scene.name}" loading="lazy"></div>
      <h1>${scene.name}</h1>
      <div class="grid grid--3">
        ${ARTISTS
          .filter(a => a.slots.some(sl => sl.scene === scene.id))
          .sort((a, b) => (a.slots[0].day + a.slots[0].time).localeCompare(b.slots[0].day + b.slots[0].time))
          .map(a => `
          <a class="card" href="/artiste.html?id=${a.id}">
            <div class="artist__card">
              <img class="artist__card-thumb" src="${getImagePath(a.id)}" alt="Photo de ${a.name}, artiste ${a.genre}" loading="lazy">
              <div>
                <h3 class="m-0">${a.name}</h3>
                <div class="chips">
                  ${a.slots
                    .filter(sl => sl.scene === scene.id)
                    .map(sl => `<span class="chips__item">${DAYS.find(d => d.id === sl.day).label} · ${sl.time}</span>`)
                    .join("")}
                </div>
              </div>
            </div>
          </a>`).join("")}
      </div>`;
  }
})();

// Carousel — scroll horizontal
function initCarousel(carousel) {
  if (!carousel) return;

  const track = carousel.querySelector(".carousel__track");
  const slides = Array.from(track.children);
  const btnPrev = carousel.querySelector(".carousel__button--prev");
  const btnNext = carousel.querySelector(".carousel__button--next");

  const getSlideWidth = () => slides[0]?.getBoundingClientRect().width || 0;
  const getCurrentIndex = () => Math.round(track.scrollLeft / getSlideWidth());
  
  const scrollToIndex = (index) => {
    const clamped = Math.max(0, Math.min(index, slides.length - 1));
    track.scrollTo({ left: clamped * getSlideWidth(), behavior: "smooth" });
  };

  const updateButtons = () => {
    const i = getCurrentIndex();
    if (btnPrev) btnPrev.disabled = i === 0;
    if (btnNext) btnNext.disabled = i >= slides.length - 1;
  };

  btnPrev?.addEventListener("click", () => scrollToIndex(getCurrentIndex() - 1));
  btnNext?.addEventListener("click", () => scrollToIndex(getCurrentIndex() + 1));

  track.tabIndex = 0;
  track.addEventListener("keydown", e => {
    if (e.key === "ArrowLeft") { e.preventDefault(); btnPrev?.click(); }
    if (e.key === "ArrowRight") { e.preventDefault(); btnNext?.click(); }
  });

  track.addEventListener("scroll", updateButtons, { passive: true });
  window.addEventListener("resize", updateButtons);

  updateButtons();
}

$$(".carousel").forEach(initCarousel);

// Newsletter — validation & feedback
(() => {
  const form = $('[data-newsletter-form]');
  if (!form) return;

  const emailInput = form.querySelector('input[type="email"]');
  const statusEl = $('[data-newsletter-status]');
  const submitBtn = form.querySelector('button[type="submit"]');

  const setStatus = (type, message) => {
    if (!statusEl) return;
    statusEl.hidden = false;
    statusEl.textContent = message;
    statusEl.classList.toggle('is-success', type === 'success');
    statusEl.classList.toggle('is-error', type === 'error');
  };

  form.addEventListener('submit', e => {
    e.preventDefault();
    if (!emailInput) return;

    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(emailInput.value.trim())) {
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
