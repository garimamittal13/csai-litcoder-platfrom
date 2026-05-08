/* ══════════════════════════════════════════════════════════════
   MI Brain Alignment Dashboard — app.js
   ══════════════════════════════════════════════════════════════ */

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
    const targetId = 'tab-' + tab.dataset.tab;
    const target = document.getElementById(targetId);
    if (target) target.classList.add('active');
  });
});

// ── VIZ UPLOAD ────────────────────────────────────────────────
// Allow clicking a viz-slot to open file picker, or drag-and-drop an image.
document.querySelectorAll('.viz-slot').forEach(slot => {
  const input = slot.querySelector('.viz-upload');

  // File input change
  if (input) {
    input.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) loadImage(slot, file);
    });
  }

  // Drag & drop
  slot.addEventListener('dragover', (e) => {
    e.preventDefault();
    slot.style.borderColor = 'var(--accent)';
  });
  slot.addEventListener('dragleave', () => {
    slot.style.borderColor = '';
  });
  slot.addEventListener('drop', (e) => {
    e.preventDefault();
    slot.style.borderColor = '';
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) loadImage(slot, file);
  });
});

function loadImage(slot, file) {
  const reader = new FileReader();
  reader.onload = (ev) => {
    // Remove placeholder, insert real img
    const placeholder = slot.querySelector('.viz-placeholder');
    if (placeholder) placeholder.remove();

    let img = slot.querySelector('img');
    if (!img) {
      img = document.createElement('img');
      slot.appendChild(img);
    }
    img.src = ev.target.result;
    img.alt = file.name;

    // Add replace button
    if (!slot.querySelector('.replace-btn')) {
      const btn = document.createElement('button');
      btn.className = 'replace-btn';
      btn.textContent = '↩ Replace';
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        resetSlot(slot);
      });
      slot.appendChild(btn);
    }
  };
  reader.readAsDataURL(file);
}

function resetSlot(slot) {
  const img = slot.querySelector('img');
  const btn = slot.querySelector('.replace-btn');
  if (img) img.remove();
  if (btn) btn.remove();

  // Restore placeholder
  const ph = document.createElement('div');
  ph.className = 'viz-placeholder';
  ph.innerHTML = `
    <div class="viz-icon">🖼️</div>
    <div class="viz-label">Drop image here</div>
    <div class="viz-hint">or click to upload</div>
    <input type="file" class="viz-upload" accept="image/*" />
  `;
  slot.appendChild(ph);

  // Re-bind
  const newInput = ph.querySelector('.viz-upload');
  newInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) loadImage(slot, file);
  });
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
