// La mascota y el cambio de idioma de las páginas. Sin dependencias.
const INK = '#2B2240', PINK = '#D95D7A';
function fluff(cx, cy, r, n, h) {
  const p = [...Array(n)].map((_, i) => { const a = (i / n) * Math.PI * 2 - Math.PI / 2; return [cx + r * Math.cos(a), cy + r * Math.sin(a), a]; });
  let d = `M ${p[0][0]} ${p[0][1]}`;
  for (let i = 0; i < n; i++) { const [x, y] = p[(i + 1) % n]; const am = p[i][2] + Math.PI / n; d += ` Q ${cx + (r + h) * Math.cos(am)} ${cy + (r + h) * Math.sin(am)} ${x} ${y}`; }
  return d + ' Z';
}
const F = fluff(100, 96, 62, 14, 15);
function huzzy(color) {
  return `<svg viewBox="0 0 200 200" role="img" aria-label="Huzzy"><ellipse cx="100" cy="178" rx="50" ry="7" fill="${INK}" opacity=".12"/>
<ellipse cx="80" cy="166" rx="13" ry="9" fill="${color}" stroke="${INK}" stroke-width="3"/><ellipse cx="120" cy="166" rx="13" ry="9" fill="${color}" stroke="${INK}" stroke-width="3"/>
<ellipse cx="38" cy="118" rx="10" ry="14" fill="${color}" stroke="${INK}" stroke-width="3" transform="rotate(25 38 118)"/><ellipse cx="162" cy="118" rx="10" ry="14" fill="${color}" stroke="${INK}" stroke-width="3" transform="rotate(-25 162 118)"/>
<path d="${F}" fill="${color}" stroke="${INK}" stroke-width="3.5" stroke-linejoin="round"/><path d="M 70 62 q 14 -10 30 -8" stroke="#fff" stroke-width="5" stroke-linecap="round" fill="none" opacity=".55"/>
<g class="eyes"><ellipse cx="78" cy="96" rx="8" ry="10" fill="${INK}"/><circle cx="80.5" cy="91.5" r="3" fill="#fff"/><ellipse cx="122" cy="96" rx="8" ry="10" fill="${INK}"/><circle cx="124.5" cy="91.5" r="3" fill="#fff"/></g>
<ellipse cx="64" cy="112" rx="9" ry="6" fill="${PINK}" opacity=".55"/><ellipse cx="136" cy="112" rx="9" ry="6" fill="${PINK}" opacity=".55"/><path d="M 88 114 q 12 12 24 0" stroke="${INK}" stroke-width="3.5" stroke-linecap="round" fill="none"/></svg>`;
}
document.querySelectorAll('[data-huzzy]').forEach((el) => (el.innerHTML = huzzy(el.dataset.huzzy)));

if (document.querySelector('[data-set]')) {
// Idioma. Se elige por el del navegador y se puede cambiar con los botones.
  const saved = localStorage.getItem('lang');
  const initial = saved || ((navigator.language || 'en').toLowerCase().startsWith('es') ? 'es' : 'en');
  function setLang(l) {
    document.documentElement.lang = l;
    document.querySelectorAll('[data-l]').forEach((el) => (el.hidden = el.dataset.l !== l));
    document.querySelectorAll('[data-set]').forEach((b) => b.classList.toggle('on', b.dataset.set === l));
    localStorage.setItem('lang', l);
  }
  document.querySelectorAll('[data-set]').forEach((b) => b.addEventListener('click', () => setLang(b.dataset.set)));
  setLang(initial);
}

const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const store = { get: (k) => { try { return localStorage.getItem(k); } catch { return null; } }, set: (k, v) => { try { localStorage.setItem(k, v); } catch {} } };

// Rotador de preguntas de la portada. Cambia solo cada pocos segundos (se para al pasar el ratón) y con el botón.
document.querySelectorAll('[data-rot]').forEach((box) => {
  const items = JSON.parse(box.dataset.rot);
  const tag = box.querySelector('.rtag'), q = box.querySelector('.rq');
  const next = box.parentElement.querySelector('[data-next]');
  let i = 0, timer;
  const show = () => {
    const it = items[i++ % items.length];
    box.classList.remove('in');
    setTimeout(() => { box.dataset.tone = it.tone; tag.textContent = it.tag; q.textContent = it.q; box.classList.add('in'); }, 250);
  };
  const auto = () => { clearInterval(timer); if (!reduced) timer = setInterval(show, 5200); };
  show(); auto();
  next?.addEventListener('click', () => { show(); auto(); });
  box.addEventListener('mouseenter', () => clearInterval(timer));
  box.addEventListener('mouseleave', auto);
});

// Idioma: recordar la elección al cambiar de idioma y avisar si la página no está en el idioma del navegador.
const alt = document.querySelector('.nav a[hreflang]');
if (alt) {
  alt.addEventListener('click', () => store.set('lang', alt.hreflang));
  const here = document.documentElement.lang, browserEs = /^es/i.test((navigator.languages || [])[0] || navigator.language || '');
  if (!store.get('lang') && browserEs !== (here === 'es')) {
    const bar = document.createElement('div');
    bar.className = 'langbar';
    bar.innerHTML = browserEs ? `<span>Esta página también está en español.</span><a href="${alt.href}">Ver en español →</a>` : '<span>This page is also available in English.</span><a href="' + alt.href + '">Read in English →</a>';
    const x = document.createElement('button');
    x.type = 'button'; x.setAttribute('aria-label', 'Close'); x.textContent = '×';
    x.onclick = () => { store.set('lang', here); bar.remove(); };
    bar.append(x);
    document.body.prepend(bar);
    bar.querySelector('a').addEventListener('click', () => store.set('lang', alt.hreflang));
  }
}

// Cabecera con sombra al hacer scroll.
const bar = document.querySelector('.topbar');
if (bar) addEventListener('scroll', () => bar.classList.toggle('scrolled', scrollY > 8), { passive: true });

// Corazones al tocar la mascota.
document.querySelectorAll('.pair [data-huzzy]').forEach((el) => el.addEventListener('click', () => {
  if (reduced) return;
  for (let n = 0; n < 5; n++) {
    const h = document.createElement('span');
    h.className = 'heart'; h.textContent = ['💗', '💞', '✨'][n % 3];
    h.style.setProperty('--x', (n - 2) * 22 + 'px'); h.style.animationDelay = n * 60 + 'ms';
    h.addEventListener('animationend', () => h.remove());
    el.append(h);
  }
}));

// Aparición al hacer scroll. Sin JS o con movimiento reducido todo se ve directamente.
if (!reduced && 'IntersectionObserver' in window) {
  const io = new IntersectionObserver((es) => es.forEach((e) => {
    if (!e.isIntersecting) return;
    const el = e.target; io.unobserve(el); el.classList.add('in');
    el.addEventListener('transitionend', () => { el.style.transitionDelay = ''; el.style.transitionProperty = 'transform,box-shadow,background'; el.style.transitionDuration = '.2s'; }, { once: true });
  }), { threshold: 0.12, rootMargin: '0px 0px -30px 0px' });
  document.querySelectorAll('.grass>.wrap>h2,.grass>.wrap>.lead2,.grass .card,.grass .steps li,.grass .rel li,.grass details,.trust>h2,.trust>.lead2,.trust .titem,.trust>.tfoot').forEach((el) => {
    el.classList.add('rv');
    el.style.transitionDelay = Math.min([...el.parentElement.children].indexOf(el), 5) * 80 + 'ms';
    io.observe(el);
  });
}
