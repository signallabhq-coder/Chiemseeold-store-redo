// tile.js — the one product tile component (grid, home rows, PDP "Passt dazu", wishlist, search)
import { fmt, productUrl, swatchColor, esc, Wish, shortName } from './store.js';

const heart = (on) => `<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path d="M12 20.5 3.9 12.6a4.6 4.6 0 0 1 6.5-6.5L12 7.7l1.6-1.6a4.6 4.6 0 0 1 6.5 6.5Z" fill="${on ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="1.4"/></svg>`;

export function tileHTML(p, variant, { lazy = true } = {}) {
  const v = variant || p.variants.find((x) => x.oldPrice) || p.variants.find((x) => x.shot === 'face') || p.variants[0];
  const a = v.images[0], b = v.images[1] || v.images[0];
  const wished = Wish.has(p.id);
  const swatches = p.variants.slice(0, 5).map((x) => `<a class="sw" href="${productUrl(p, x)}" title="${esc(x.color)}" aria-label="${esc(x.color)}" style="--sw:${swatchColor(x)}"${x.slug === v.slug ? ' aria-current="true"' : ''}></a>`).join('')
    + (p.variants.length > 5 ? `<span class="t-s more">+${p.variants.length - 5}</span>` : '');
  const price = v.oldPrice
    ? `<s class="muted">${fmt(v.oldPrice)}</s> <span class="sale">${fmt(v.price)}</span>`
    : `<span>${fmt(v.price)}</span>`;
  return `
<article class="tile" data-id="${esc(p.id)}">
  <a class="tile-media" href="${productUrl(p, v)}" aria-label="${esc(p.name)}, ${esc(v.color)}">
    <img src="${esc(a)}" alt="${esc(p.name)}, ${esc(v.color)}" width="1200" height="1714" ${lazy ? 'loading="lazy"' : 'fetchpriority="high"'}>
    <img class="alt" src="${esc(b)}" alt="" width="1200" height="1714" loading="lazy" aria-hidden="true">
    ${p.isNew && !v.oldPrice ? '<span class="chip t-s">Neu</span>' : ''}
  </a>
  <button type="button" class="wish${wished ? ' is-on' : ''}" data-wish="${esc(p.id)}" aria-pressed="${wished}" aria-label="${wished ? 'Von der Merkliste entfernen' : 'Zur Merkliste'}">${heart(wished)}</button>
  <div class="tile-cap">
    <a class="tile-name upper" href="${productUrl(p, v)}" title="${esc(p.name)}">${esc(shortName(p.name))}</a>
    <div class="tile-price">${price}</div>
    <div class="swatches">${swatches}</div>
  </div>
</article>`;
}

// Captions stay tight, but within one grid row every name block takes the tallest name's height,
// so prices and swatches sit on one baseline across the row (long German names may wrap).
export function alignCaptions(root = document) {
  root.querySelectorAll('.grid').forEach((grid) => {
    const tiles = [...grid.querySelectorAll('.tile')];
    tiles.forEach((t) => { const n = t.querySelector('.tile-name'); if (n) n.style.minHeight = ''; });
    const rows = new Map();
    tiles.forEach((t) => { const k = Math.round(t.getBoundingClientRect().top); (rows.get(k) || rows.set(k, []).get(k)).push(t); });
    rows.forEach((row) => {
      const h = Math.max(...row.map((t) => t.querySelector('.tile-name')?.getBoundingClientRect().height || 0));
      row.forEach((t) => { const n = t.querySelector('.tile-name'); if (n) n.style.minHeight = `${Math.ceil(h)}px`; });
    });
  });
}
let _alignTimer;
window.addEventListener('resize', () => { clearTimeout(_alignTimer); _alignTimer = setTimeout(() => alignCaptions(), 120); });

export function bindTiles(root = document) {
  root.addEventListener('click', (e) => {
    const b = e.target.closest('[data-wish]'); if (!b) return;
    e.preventDefault();
    const on = Wish.toggle(b.dataset.wish);
    b.classList.toggle('is-on', on); b.setAttribute('aria-pressed', String(on));
    b.setAttribute('aria-label', on ? 'Von der Merkliste entfernen' : 'Zur Merkliste');
    b.innerHTML = heart(on);
  });
}
