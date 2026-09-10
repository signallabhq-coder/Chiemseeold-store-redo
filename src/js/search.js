// search.js — full-page search overlay, fuzzy + typo tolerant, keyboard navigable
import { loadCatalog, esc } from './store.js';
import { tileHTML, bindTiles, alignCaptions } from './tile.js';

const norm = (s) => s.toLowerCase().replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/ß/g, 'ss');
function lev(a, b) {
  const m = a.length, n = b.length; if (!m) return n; if (!n) return m;
  let prev = Array.from({ length: n + 1 }, (_, i) => i);
  for (let i = 1; i <= m; i++) { const cur = [i]; for (let j = 1; j <= n; j++) cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)); prev = cur; }
  return prev[n];
}
function score(p, q) {
  const hay = norm(`${p.name} ${p.type} ${p.gender} ${p.id} ${p.variants.map((v) => v.color + ' ' + v.main).join(' ')}`);
  const words = hay.split(/[^a-z0-9]+/).filter(Boolean);
  let s = 0;
  for (const t of norm(q).split(/\s+/).filter(Boolean)) {
    if (p.id.toLowerCase() === t) return 1000;
    if (hay.includes(t)) { s += 10 + (norm(p.name).startsWith(t) ? 5 : 0); continue; }
    const best = Math.min(...words.map((w) => (Math.abs(w.length - t.length) > 2 ? 9 : lev(w, t))));
    if (best <= (t.length > 5 ? 2 : 1)) s += 6 - best; else return 0;
  }
  return s;
}

const POPULAR = ['Hoodie', 'Skijacke', 'Fleece', 'T-Shirt', 'Beanie', 'Badehose'];

export function mountSearch() {
  const el = document.createElement('section');
  el.className = 'search'; el.id = 'search'; el.hidden = true; el.setAttribute('aria-label', 'Suche'); el.setAttribute('role', 'dialog'); el.setAttribute('aria-modal', 'true');
  el.innerHTML = `
    <div class="search-head">
      <label class="sr-only" for="search-input">Suche</label>
      <input id="search-input" type="search" class="t-l" placeholder="Wonach suchst du?" autocomplete="off" spellcheck="false">
      <button type="button" class="t-m" data-search-close>Schließen</button>
    </div>
    <div class="search-meta t-s muted" aria-live="polite"></div>
    <div class="search-quick"><span class="t-s muted">Beliebt</span>${POPULAR.map((w) => `<button type="button" class="t-m" data-q="${w}">${w}</button>`).join('')}</div>
    <div class="grid search-grid" data-results></div>
    <section class="row-sec" data-fresh><div class="row-head"><h2 class="t-l">Neu eingetroffen</h2><a class="t-m" href="shop.html">Alle ansehen</a></div><div class="grid" data-fresh-grid></div></section>`;
  document.body.appendChild(el);
  const input = el.querySelector('input'), results = el.querySelector('[data-results]'), meta = el.querySelector('.search-meta'), quick = el.querySelector('.search-quick'), fresh = el.querySelector('[data-fresh]');
  let catalog, lastFocus, active = -1;

  const open = async () => { lastFocus = document.activeElement; el.hidden = false; requestAnimationFrame(() => el.classList.add('is-on')); document.body.style.overflow = 'hidden'; input.focus(); catalog = await loadCatalog(); if (!fresh.dataset.done) { fresh.querySelector('[data-fresh-grid]').innerHTML = catalog.filter((p) => p.isNew).slice(0, 4).map((p) => tileHTML(p)).join(''); fresh.dataset.done = '1'; alignCaptions(el); } run(input.value); };
  const close = () => { el.classList.remove('is-on'); setTimeout(() => (el.hidden = true), 240); document.body.style.overflow = ''; lastFocus?.focus(); };
  const run = (q) => {
    active = -1;
    if (!q.trim()) { results.innerHTML = ''; meta.textContent = ''; quick.hidden = false; fresh.hidden = false; return; }
    quick.hidden = true; fresh.hidden = true;
    const hits = catalog.map((p) => [score(p, q), p]).filter(([s]) => s > 0).sort((a, b) => b[0] - a[0]).slice(0, 24).map(([, p]) => p);
    meta.textContent = hits.length ? `${hits.length} Treffer für „${q}“` : `Keine Treffer für „${q}“. Versuch es mit einer Kategorie: Hoodie, Skijacke, Cap.`;
    results.innerHTML = hits.map((p) => tileHTML(p)).join('');
    alignCaptions(el);
  };
  input.addEventListener('input', () => run(input.value));
  quick.addEventListener('click', (e) => { const b = e.target.closest('[data-q]'); if (b) { input.value = b.dataset.q; run(input.value); input.focus(); } });
  el.querySelector('[data-search-close]').addEventListener('click', close);
  el.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') { e.stopPropagation(); close(); return; }
    const tiles = [...results.querySelectorAll('.tile-name')]; if (!tiles.length) return;
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') { e.preventDefault(); active = Math.min(tiles.length - 1, active + 1); tiles[active].focus(); }
    if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') { e.preventDefault(); active = Math.max(0, active - 1); tiles[active].focus(); }
    if (e.key === 'Enter' && document.activeElement === input && tiles[0]) { e.preventDefault(); tiles[0].click(); }
  });
  bindTiles(el);
  window.addEventListener('search:open', open);
  document.addEventListener('keydown', (e) => { if (e.key === '/' && !/input|textarea/i.test(document.activeElement.tagName)) { e.preventDefault(); open(); } });
}
