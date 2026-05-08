/* ══════════════════════════════════════════════════════════════
   MI Brain Alignment Dashboard — app.js
   ══════════════════════════════════════════════════════════════ */

// ── FIGURE MAP ────────────────────────────────────────────────
// Maps each data-slot → figure number → images/fig-XX.png
// To add an image: put the file in docs/images/ with the right name.
const FIGURE_MAP = {
  'sae-1':1,'sae-2':2,'sae-3':3,'sae-4':4,'sae-5':5,
  'sae-6':6,'sae-7':7,'sae-8':8,'sae-9':9, 'sae-10':10, 'sae-11':11,
  'norm-1':12,'norm-2':13,'norm-3':14,'norm-4':15,'norm-5':16, 'norm-6':17,'norm-7':18,'norm-8':19,'norm-9':20,'norm-10':21, 'norm-11':22,'norm-12':23,
  'attn-1':24,'attn-2':25,'attn-3':26,'attn-4':27,'attn-5':28,
  'attn-6':29,'attn-7':30,
  'act-1':31,'act-2':32,'act-3':33,'act-4':34,'act-5':35,
  'act-6':36,'act-7':37,'act-8':38,'act-9':39,'act-10':40,
  'act-11':41,'act-12':42, 'act-13':43, 'act-14':44, 'act-15':45, 'act-16':46, 
  'pe-1':47,'pe-2':48,'pe-3':49,'pe-4':50,'pe-5':51,
  'pe-6':52,'pe-7':53,'pe-8':54,'pe-9':55,'pe-10':56,
  'pe-11':57,'pe-12':58, 'pe-13':59, 'pe-14':60, 'pe-15':61, 
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
