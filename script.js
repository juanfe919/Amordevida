/* =============================================================
   script.js — Nuestra Historia (v2)
   ============================================================= */

/* ─────────────────────────────────────────────────────────────
   LUGARES DEL MAPA
   ✏️ Agrega, quita o cambia lugares aquí.
   Formato: { name, lat, lng, special (opcional), note }
   ───────────────────────────────────────────────────────────── */
const PLACES = [
  { name: "Filandia",              lat: 4.6736,  lng: -75.6580 },
  { name: "Quimbaya",              lat: 4.6236,  lng: -75.7643 },
  { name: "Circasia",              lat: 4.6174,  lng: -75.6397 },
  { name: "Salento",               lat: 4.6385,  lng: -75.5711 },
  { name: "Pereira",               lat: 4.8133,  lng: -75.6961 },
  { name: "Cartago",               lat: 4.7464,  lng: -75.9117 },
  { name: "Dosquebradas",          lat: 4.8390,  lng: -75.6672 },
  { name: "Boquía",                lat: 4.6508,  lng: -75.5347 },
  { name: "Versalles",             lat: 4.5750,  lng: -76.1667 },
  { name: "La Unión Valle",        lat: 4.5342,  lng: -76.1008 },
  { name: "Parque Las Bailarinas", lat: 4.6667,  lng: -75.6167 },
  /* ── MARCADOR ESPECIAL ──────────────────────────────────────
     ✏️ Cambia el nombre, coordenadas y nota de este lugar especial */
  {
    name: "Gaia Café con Vista",
    lat: 4.6750, lng: -75.7820,
    special: true,
    note: "Aquí nos hicimos novios 💕"
  }
];

/* ─────────────────────────────────────────────────────────────
   RAZONES POR LAS QUE TE AMO
   ✏️ Agrega, quita o cambia las razones aquí.
      Aparecen de forma aleatoria en la tarjeta de amor.
   ───────────────────────────────────────────────────────────── */
const LOVE_MESSAGES = [
  "Porque tu risa hace que todo lo demás deje de importar.",
  "Porque eres más valiente de lo que crees, incluso cuando sientes que no puedes.",
  "Porque me enseñaste que el amor también se parece a caminar en silencio y estar bien.",
  "Porque cuando te miro me pregunto cómo fui tan afortunado.",
  "Porque tu manera de ver el mundo lo hace más bonito.",
  "Porque incluso en tus días difíciles, sigues siendo luz.",
  "Porque me haces querer ser mejor persona, sin pedirlo.",
  "Porque eres exactamente quien necesito tener al lado.",
  "Porque tu corazón es de los más grandes que he conocido.",
  "Porque cada momento contigo se convierte en mi recuerdo favorito.",
  "Porque me gustas con todo y tus tormentas.",
  "Porque desde que llegaste, el mundo tiene más sentido.",
];

/* ═════════════════════════════════════════════════════════════
   PARTÍCULAS ANIMADAS EN EL HERO
   ═════════════════════════════════════════════════════════════ */
const canvas = document.getElementById("particle-canvas");
const ctx    = canvas.getContext("2d");
let particles = [];

function resizeCanvas() {
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
}

function createParticles() {
  particles = [];
  const count = Math.floor((canvas.width * canvas.height) / 12000);
  for (let i = 0; i < count; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.5 + 0.3,
      alpha: Math.random() * 0.5 + 0.1,
      vx: (Math.random() - 0.5) * 0.2,
      vy: -(Math.random() * 0.4 + 0.1),
      life: Math.random()
    });
  }
}

function drawParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => {
    p.x += p.vx; p.y += p.vy; p.life += 0.003;
    if (p.life > 1) { p.life = 0; p.x = Math.random() * canvas.width; p.y = canvas.height + 10; }
    const alpha = Math.sin(p.life * Math.PI) * p.alpha;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(201,169,110,${alpha})`;
    ctx.fill();
  });
  requestAnimationFrame(drawParticles);
}

resizeCanvas(); createParticles(); drawParticles();
window.addEventListener("resize", () => { resizeCanvas(); createParticles(); });

/* ═════════════════════════════════════════════════════════════
   BOTÓN DE ENTRADA
   ═════════════════════════════════════════════════════════════ */
function enterSite() {
  document.getElementById("floating-nav").classList.remove("hidden");
  setupObserver();
  document.getElementById("recuerdos").scrollIntoView({ behavior: "smooth" });
  if (!window._mapInitialized) {
    window._mapInitialized = true;
    setTimeout(initMap, 800);
  }
  newMessage();
}

function scrollTo(id) {
  document.getElementById(id).scrollIntoView({ behavior: "smooth" });
}

/* ═════════════════════════════════════════════════════════════
   INTERSECTION OBSERVER — animaciones al hacer scroll
   ═════════════════════════════════════════════════════════════ */
function setupObserver() {
  const sections = document.querySelectorAll(".hidden-section");
  const photos   = document.querySelectorAll(".photo-item");

  const sObs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add("visible"); });
  }, { threshold: 0.08 });

  sections.forEach(s => sObs.observe(s));

  const pObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const delay = parseInt(e.target.dataset.delay) || 0;
        setTimeout(() => e.target.classList.add("photo-visible"), delay);
        pObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });

  photos.forEach(p => pObs.observe(p));
}

/* ═════════════════════════════════════════════════════════════
   LIGHTBOX — clic en foto para ampliar
   ═════════════════════════════════════════════════════════════ */
document.querySelectorAll(".photo-item").forEach(item => {
  item.addEventListener("click", () => {
    const img = item.querySelector("img");
    if (!img || img.style.display === "none") return;
    document.getElementById("lb-img").src = img.src;
    document.getElementById("lightbox").classList.add("open");
    document.body.style.overflow = "hidden";
  });
});

function closeLightbox() {
  document.getElementById("lightbox").classList.remove("open");
  document.body.style.overflow = "";
}

document.addEventListener("keydown", e => { if (e.key === "Escape") closeLightbox(); });

/* ═════════════════════════════════════════════════════════════
   MAPA LEAFLET
   ✏️ Cambia el tileLayer URL para cambiar el estilo del mapa
   ═════════════════════════════════════════════════════════════ */
function initMap() {
  /* ✏️ Centro del mapa — ajusta si cambias la región */
  const map = L.map("map", {
    center: [4.65, -75.75],
    zoom: 10,
    zoomControl: true,
    scrollWheelZoom: false
  });

  /* ✏️ Estilo del mapa base */
  L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
    attribution: '&copy; <a href="https://carto.com/">CartoDB</a>',
    maxZoom: 18
  }).addTo(map);

  const normalIcon = L.divIcon({
    className: "",
    html: `<div style="width:10px;height:10px;border-radius:50%;background:#c9a96e;border:2px solid #f5f0e8;box-shadow:0 0 8px rgba(201,169,110,0.6);"></div>`,
    iconAnchor: [5, 5]
  });

  const specialIcon = L.divIcon({
    className: "",
    html: `<div style="width:20px;height:20px;border-radius:50%;background:#c9847a;border:3px solid #f5f0e8;box-shadow:0 0 18px rgba(201,132,122,0.9);display:flex;align-items:center;justify-content:center;font-size:11px;">💕</div>`,
    iconAnchor: [10, 10]
  });

  PLACES.forEach(place => {
    const icon   = place.special ? specialIcon : normalIcon;
    const marker = L.marker([place.lat, place.lng], { icon }).addTo(map);
    if (place.special) {
      marker.bindPopup(`
        <strong style="font-family:'Cormorant Garamond',serif;font-size:1.05rem;color:#c9a96e;">${place.name}</strong><br/>
        <span class="popup-special">${place.note}</span>
      `, { maxWidth: 220 }).openPopup();
    } else {
      marker.bindPopup(`<strong style="font-family:'Cormorant Garamond',serif;color:#c9a96e;">${place.name}</strong>`, { maxWidth: 180 });
    }
  });
}

/* ═════════════════════════════════════════════════════════════
   RESPIRACIÓN GUIADA
   ✏️ Cambia los tiempos en ms:
      INHALE_MS = tiempo de inhalación
      HOLD_MS   = tiempo de retención
      EXHALE_MS = tiempo de exhalación
   ═════════════════════════════════════════════════════════════ */
const INHALE_MS = 4000;
const HOLD_MS   = 2000;
const EXHALE_MS = 6000;

let breathRunning = false;
let breathTimeout = null;
let timerInterval = null;

function toggleBreath() {
  breathRunning ? stopBreath() : startBreath();
}

function startBreath() {
  breathRunning = true;
  document.getElementById("btn-breath").textContent = "Detener";
  runCycle();
}

function stopBreath() {
  breathRunning = false;
  document.getElementById("btn-breath").textContent = "Comenzar";
  clearTimeout(breathTimeout);
  clearInterval(timerInterval);
  const circle = document.getElementById("breath-circle");
  circle.className = "";
  document.getElementById("breath-label").textContent = "·";
  setTimerBar(0, 0, "var(--sage)");
}

function setTimerBar(durationMs, color) {
  clearInterval(timerInterval);
  const fill = document.getElementById("breath-timer-fill");
  fill.style.transition = "none";
  fill.style.width = "0%";
  fill.style.background = color;
  setTimeout(() => {
    fill.style.transition = `width ${durationMs}ms linear`;
    fill.style.width = "100%";
  }, 30);
}

function runCycle() {
  if (!breathRunning) return;
  const circle = document.getElementById("breath-circle");
  const label  = document.getElementById("breath-label");

  // Inhala
  circle.className = "inhale";
  label.textContent = "Inhala";
  setTimerBar(INHALE_MS, "var(--sage)");

  breathTimeout = setTimeout(() => {
    if (!breathRunning) return;
    // Retén
    circle.className = "hold";
    label.textContent = "Retén";
    setTimerBar(HOLD_MS, "var(--gold)");

    breathTimeout = setTimeout(() => {
      if (!breathRunning) return;
      // Exhala
      circle.className = "exhale";
      label.textContent = "Exhala";
      setTimerBar(EXHALE_MS, "#c9847a");

      breathTimeout = setTimeout(() => {
        if (breathRunning) runCycle();
      }, EXHALE_MS);
    }, HOLD_MS);
  }, INHALE_MS);
}

/* ═════════════════════════════════════════════════════════════
   RAZONES POR LAS QUE TE AMO
   ═════════════════════════════════════════════════════════════ */
let msgIndex   = -1;
let msgCount   = 0;
let usedIndexes = [];

function newMessage() {
  // Recorremos todos antes de repetir
  if (usedIndexes.length >= LOVE_MESSAGES.length) usedIndexes = [];

  let idx;
  do { idx = Math.floor(Math.random() * LOVE_MESSAGES.length); }
  while (usedIndexes.includes(idx));
  usedIndexes.push(idx);
  msgCount++;

  const el      = document.getElementById("positive-msg");
  const counter = document.getElementById("love-counter");
  if (!el) return;

  el.style.opacity = "0";
  setTimeout(() => {
    el.textContent      = LOVE_MESSAGES[idx];
    counter.textContent = `— ${msgCount} —`;
    el.style.opacity    = "1";
  }, 350);
}

/* ═════════════════════════════════════════════════════════════
   INICIALIZACIÓN
   ═════════════════════════════════════════════════════════════ */
document.addEventListener("DOMContentLoaded", () => {
  newMessage();
});
