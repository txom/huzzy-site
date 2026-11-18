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
<ellipse cx="78" cy="96" rx="8" ry="10" fill="${INK}"/><circle cx="80.5" cy="91.5" r="3" fill="#fff"/><ellipse cx="122" cy="96" rx="8" ry="10" fill="${INK}"/><circle cx="124.5" cy="91.5" r="3" fill="#fff"/>
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

// Rotador de preguntas de la portada. Cambia de tipo cada pocos segundos con un fundido.
document.querySelectorAll('[data-rot]').forEach((box) => {
  const items = JSON.parse(box.dataset.rot);
  const tag = box.querySelector('.rtag'), q = box.querySelector('.rq');
  let i = 0;
  const show = () => {
    const it = items[i % items.length];
    box.classList.remove('in');
    setTimeout(() => {
      box.dataset.tone = it.tone; tag.textContent = it.tag; q.textContent = it.q;
      box.classList.add('in');
      i++;
    }, 250);
  };
  show();
  if (!matchMedia('(prefers-reduced-motion: reduce)').matches) setInterval(show, 3800);
});
