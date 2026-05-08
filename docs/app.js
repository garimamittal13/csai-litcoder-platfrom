/* ══════════════════════════════════════════════════════════════
   MI Brain Alignment Dashboard — app.js
   ══════════════════════════════════════════════════════════════ */

// ── FIGURE MAP ────────────────────────────────────────────────
// Maps each data-slot → figure number → images/fig-XX.png
// To add an image: put the file in docs/images/ with the right name.
const FIGURE_MAP = {
  'sae-1':1,'sae-2':2,'sae-3':3,'sae-4':4,'sae-5':5,
  'sae-6':6,'sae-7':7,'sae-8':8,'sae-9':9,
  'norm-1':10,'norm-2':11,'norm-3':12,'norm-4':13,'norm-5':14,
  'attn-1':15,'attn-2':16,'attn-3':17,'attn-4':18,'attn-5':19,
  'attn-6':20,'attn-7':21,'attn-8':22,'attn-9':23,'attn-10':24,
  'attn-11':25,'attn-12':26,
  'act-1':27,'act-2':28,'act-3':29,'act-4':30,'act-5':31,
  'act-6':32,'act-7':33,
  'pe-1':34,'pe-2':35,'pe-3':36,'pe-4':37,'pe-5':38,
  'pe-6':39,'pe-7':40,'pe-8':41,'pe-9':42,'pe-10':43,
  'pe-11':44,'pe-12':45,
};

// ── THEME ─────────────────────────────────────────────────────
const themeBtn = document.getElementById('themeToggle');
const savedTheme = localStorage.getItem('mi-theme') || 'dark';
if (savedTheme === 'light') applyLight();

themeBtn.addEventListener('click', () => {
  if (document.documentElement.getAttribute('data-theme') === 'light') {
    document.documentElement.removeAttribute('data-theme');
    themeBtn.textContent = '☀️';
    localStorage.setItem('mi-theme', 'dark');
  } else {
    applyLight();
  }
});

function applyLight() {
  document.documentElement.setAttribute('data-theme', 'light');
  themeBtn.textContent = '🌙';
  localStorage.setItem('mi-theme', 'light');
}

// ── TABS ──────────────────────────────────────────────────────
const tabs = document.querySelectorAll('.tab');
tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    tabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
    const target = document.getElementById('tab-' + tab.dataset.tab);
    if (target) target.classList.add('active');
  });
});

// ── IMAGE LOADER ──────────────────────────────────────────────
// Images live in docs/images/fig-01.png … fig-45.png (zero-padded).
// If the file exists it is shown; otherwise the placeholder stays visible
// showing the exact filename the author needs to drop in.
document.querySelectorAll('.viz-slot[data-slot]').forEach(slot => {
  const slotId  = slot.dataset.slot;
  const figNum  = FIGURE_MAP[slotId];
  if (!figNum) return;

  const padded  = String(figNum).padStart(2, '0');
  const srcPng  = `images/fig-${padded}.png`;
  const srcJpg  = `images/fig-${padded}.jpg`;

  // Update the hint inside the placeholder with the actual filename
  const hint = slot.querySelector('.viz-hint');
  if (hint) hint.innerHTML = `Add <code>docs/images/fig-${padded}.png</code>`;

  // Try PNG first, then JPG
  tryLoad(slot, srcPng, srcJpg);
});

function tryLoad(slot, src, fallbackSrc) {
  const img = new Image();
  img.src = src;
  img.alt = slot.querySelector('.viz-label')?.textContent || '';
  img.loading = 'lazy';

  img.onload = () => {
    img.className = 'viz-img';
    slot.appendChild(img);
    const ph = slot.querySelector('.viz-placeholder');
    if (ph) ph.style.display = 'none';
  };

  img.onerror = () => {
    if (fallbackSrc) {
      tryLoad(slot, fallbackSrc, null);
    }
    // else: placeholder stays visible — nothing to do
  };
}

// ── ACTIVE NAV LINK ───────────────────────────────────────────
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

const io = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(a => a.classList.remove('nav-active'));
      const active = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
      if (active) active.classList.add('nav-active');
    }
  });
}, { rootMargin: '-40% 0px -55% 0px' });

sections.forEach(s => io.observe(s));
