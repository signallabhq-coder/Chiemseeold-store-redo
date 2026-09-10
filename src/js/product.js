// product.js — data-driven PDP: ?id=<style>&c=<colour-slug>
import { loadCatalog, mountChrome, byId, fmt, esc, swatchColor, productUrl, genderLabel, Bag, Wish, openSheet } from './store.js';
import { tileHTML, bindTiles, alignCaptions } from './tile.js';
import { mountSearch } from './search.js';

const $ = (s) => document.querySelector(s);
let catalog, p, v, size = null;

async function init() {
  mountChrome(); mountSearch(); bindTiles();
  catalog = await loadCatalog();
  const q = new URLSearchParams(location.search);
  p = byId(catalog, q.get('id')) || catalog[0];
  mountChrome({ active: p.gender === 'unisex' ? 'herren' : p.gender });
  v = p.variants.find((x) => x.slug === q.get('c')) || p.variants[0];
  render();
  window.addEventListener('popstate', () => { const s = new URLSearchParams(location.search).get('c'); v = p.variants.find((x) => x.slug === s) || p.variants[0]; size = null; render(); });
  $('[data-swatches]').addEventListener('click', (e) => { const a = e.target.closest('a'); if (!a) return; e.preventDefault(); v = p.variants.find((x) => x.slug === a.dataset.slug); size = null; history.pushState(null, '', productUrl(p, v)); render(); });
  $('[data-sizes]').addEventListener('click', (e) => { const b = e.target.closest('button'); if (!b) return; size = b.dataset.size; $('.pdp-sizes').classList.remove('is-invalid'); $('[data-size-hint]').classList.remove('is-shown'); renderSizes(); });
  $('[data-add]').addEventListener('click', add);
  $('[data-pdp-wish]').addEventListener('click', () => { Wish.toggle(p.id); renderWish(); });
}

function render() {
  const cat = p.gender === 'unisex' ? 'herren' : p.gender;
  document.title = `${p.name} · ${v.color} · Chiemsee`;
  $('[data-crumbs]').innerHTML = `<a class="mid" href="index.html">Chiemsee</a><span class="mid">/</span><a href="shop.html?cat=${cat}">${genderLabel(cat)}</a><span>/</span><a href="shop.html?cat=${cat}&type=${encodeURIComponent(p.type)}">${esc(p.type)}</a><span class="mid">/</span><span class="mid">${esc(p.name)}</span>`;
  $('[data-media]').innerHTML = v.images.map((src, i) => `<figure><img src="${esc(src)}" alt="${esc(p.name)}, ${esc(v.color)}, Ansicht ${i + 1}" width="1200" height="1714" ${i ? 'loading="lazy"' : 'fetchpriority="high"'}></figure>`).join('');
  const counter = $('[data-counter]'); if (counter) { counter.textContent = `1 / ${v.images.length}`; counter.hidden = v.images.length < 2; const m = $('[data-media]'); m.onscroll = () => { counter.textContent = `${Math.round(m.scrollLeft / m.clientWidth) + 1} / ${v.images.length}`; }; }
  $('[data-name]').textContent = p.name;
  $('[data-price]').innerHTML = v.oldPrice ? `<s>${fmt(v.oldPrice)}</s><span class="sale">${fmt(v.price)}</span>` : fmt(v.price);
  $('[data-swatches]').innerHTML = p.variants.map((x) => `<a href="${productUrl(p, x)}" data-slug="${x.slug}" aria-label="${esc(x.color)}" title="${esc(x.color)}" style="--sw:${swatchColor(x)}" ${x.slug === v.slug ? 'aria-current="true"' : ''}></a>`).join('');
  $('[data-color]').innerHTML = `${esc(v.color)}${p.variants.length > 1 ? ` <span class="muted">· ${p.variants.length} Farben</span>` : ''}`;
  renderSizes(); renderWish();
  $('[data-acc]').innerHTML = `
    <details><summary>Beschreibung</summary><div class="acc-body"><p>${esc(p.desc)}</p></div></details>
    <details><summary>Material &amp; Pflege</summary><div class="acc-body"><p>${esc(p.material || 'Siehe Etikett.')}</p><p>Maschinenwäsche bei 30 °C, nicht bleichen, nicht im Trockner trocknen, bei niedriger Temperatur bügeln.</p><p class="muted">Artikelnummer ${esc(p.id)}</p></div></details>
    <details><summary>Versand &amp; Retoure</summary><div class="acc-body"><p>Lieferung innerhalb Deutschlands in 2 bis 4 Werktagen. Kostenloser Versand ab 80 €, darunter 4,95 €.</p><p>Rückgabe innerhalb von 30 Tagen, kostenfrei über das Retourenportal.</p></div></details>`;
  const rel = catalog.filter((x) => x.id !== p.id && (x.gender === p.gender || x.gender === 'unisex') && x.type !== p.type).sort((a, b) => Number(b.isNew) - Number(a.isNew)).slice(0, 4);
  $('[data-related]').innerHTML = rel.map((x) => tileHTML(x, null, { lazy: false })).join('');
  alignCaptions();
}

function renderSizes() {
  const el = $('[data-sizes]');
  $('.size-head').hidden = !v.sizes.length;
  if (!v.sizes.length) { el.innerHTML = '<div class="one t-m">Einheitsgröße</div>'; size = 'Einheitsgröße'; return; }
  el.innerHTML = v.sizes.map((s) => `<button type="button" role="radio" data-size="${esc(s)}" aria-checked="${s === size}">${esc(s)}</button>`).join('');
}
const heart = (on) => `<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M12 20.5 3.9 12.6a4.6 4.6 0 0 1 6.5-6.5L12 7.7l1.6-1.6a4.6 4.6 0 0 1 6.5 6.5Z" fill="${on ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="1.4"/></svg>`;
function renderWish() { const on = Wish.has(p.id); const b = $('[data-pdp-wish]'); b.innerHTML = heart(on); b.classList.toggle('is-on', on); b.setAttribute('aria-pressed', String(on)); b.setAttribute('aria-label', on ? 'Von der Merkliste entfernen' : 'Zur Merkliste'); }

function add() {
  if (!size) { $('.pdp-sizes').classList.add('is-invalid'); $('[data-size-hint]').classList.add('is-shown'); return; }
  Bag.add({ id: p.id, slug: v.slug, name: p.name, color: v.color, size, price: v.price, thumb: v.thumbs[0], qty: 1 });
  $('.pdp-sizes').classList.remove('is-invalid');
  openSheet('bag');
}

init();
