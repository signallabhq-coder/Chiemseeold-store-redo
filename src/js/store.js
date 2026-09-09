// store.js — catalogue, bag, wishlist, shared chrome (header/footer/drawers). Vanilla, no deps.
// Every page imports this once; it injects the header + footer and wires counts, the bag drawer and search.

export const JTR_URL = 'https://chiemsee-jtr.pages.dev';
const BAG_KEY = 'chiemsee-store-bag';
const WISH_KEY = 'chiemsee-store-wishlist';

export const CATS = [
  { key: 'damen', label: 'Damen' },
  { key: 'herren', label: 'Herren' },
  { key: 'kinder', label: 'Kinder' },
  { key: 'accessoires', label: 'Accessoires' },
  { key: 'sale', label: 'Sale' },
];

// Colour name -> swatch hex (Chiemsee colourway names, plus German main-colour fallbacks)
export const SWATCH = {
  'black': '#111417', 'black beauty': '#15181c', 'total eclipse': '#20242e', 'white': '#f4f4f2', 'bright white': '#f7f7f5',
  'hydro': '#3f7d97', 'sargasso sea': '#1f3550', 'river blue': '#4a7fb5', 'blue jasper': '#3a5f8a', 'wet weather': '#8e949c',
  'high-rise': '#a9adb3', 'grisaille': '#8b8f97', 'neutral gray melange': '#b4b6b9', 'birch': '#d9d2c3', 'sand': '#d8c9ac',
  'tropical breeze': '#8fcfd6', 'turquoise/red': '#3fb3b8', 'marine green': '#3b6b5a', 'kombu green': '#3d4a3a', 'green gecko': '#79b25a',
  'meadow': '#8db36a', 'light green/light pink': '#bfe0b8', 'sugar plum': '#8e5f93', 'lavender': '#b7a4d6', 'orchid': '#c98ac2',
  'beetroot purple': '#6b2d5e', 'grape compote': '#5c3a6b', 'chateau rose': '#d9a7b4', 'pink glo': '#f07aa8', 'knockout pink': '#ef4c8f',
  'raspberry': '#c73b6a', 'melon': '#f0946f', 'shocking orange': '#f26a2e', 'blazing orange': '#ef6c1f', 'black/orange': '#1a1a1a',
  'tibetan red': '#b2332c',
  // German main colours
  'blau': '#3f6f95', 'schwarz': '#111417', 'grau': '#a9adb3', 'pink': '#e88bb4', 'lila': '#8e5f93', 'weiss': '#f4f4f2',
  'orange': '#f07a3a', 'grün': '#5f8f6a', 'beige': '#d9d2c3', 'rot': '#b2332c', 'türkis': '#3fb3b8',
};
export const swatchColor = (v) => v.swatch || SWATCH[(v.color || '').toLowerCase()] || SWATCH[(v.main || '').toLowerCase()] || '#c8cacf';

export const shortName = (n) => n.replace(/\b(Comfort|Loose|Slim|Regular|Tight)-Fit\s+/gi, '').replace(/^(Funktionale[rs]?|Einfarbige[rs]?|Unifarbene[rs]?|Unifarbende[rs]?|Unisex)\s+/i, '').replace(/^(Funktionale[rs]?|Einfarbige[rs]?|Unifarbene[rs]?|Unifarbende[rs]?|Unisex)\s+/i, '').replace(/^./, (c) => c.toUpperCase());
export const fmt = (n) => (n == null ? '' : n.toFixed(2).replace('.', ',') + ' €');
export const slug = (s) => s.toLowerCase().replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/ß/g, 'ss').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
export const productUrl = (p, v) => `/product.html?id=${p.id}${v ? `&c=${v.slug}` : ''}`;
export const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

let _catalog;
export async function loadCatalog() {
  if (_catalog) return _catalog;
  const res = await fetch('/data/catalog.json');
  const data = await res.json();
  _catalog = data.products.map((p) => ({ ...p, variants: p.variants.map((v) => ({ ...v, thumbs: v.images.map((i) => i.replace(/\.jpg$/, '.thumb.jpg')) })) }));
  return _catalog;
}
export const byId = (list, id) => list.find((p) => p.id === id);
export const inCat = (p, cat) => cat === 'sale' ? p.sale : cat === 'accessoires' ? p.gender === 'accessoires' : (p.gender === cat || (p.gender === 'unisex' && (cat === 'damen' || cat === 'herren')));
export const genderLabel = (g) => ({ damen: 'Damen', herren: 'Herren', kinder: 'Kinder', accessoires: 'Accessoires', unisex: 'Unisex' }[g] || g);

// ---- storage ----
const read = (k) => { try { return JSON.parse(localStorage.getItem(k) || '[]'); } catch { return []; } };
const write = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} window.dispatchEvent(new CustomEvent('store:change', { detail: { key: k } })); };

export const Bag = {
  items: () => read(BAG_KEY),
  count: () => read(BAG_KEY).reduce((n, i) => n + i.qty, 0),
  subtotal: () => read(BAG_KEY).reduce((n, i) => n + i.price * i.qty, 0),
  shipping: (sub) => (sub >= 80 || sub === 0 ? 0 : 4.95),
  add(item) {
    const items = read(BAG_KEY);
    const k = items.find((i) => i.id === item.id && i.slug === item.slug && i.size === item.size);
    if (k) k.qty += item.qty || 1; else items.push({ ...item, qty: item.qty || 1 });
    write(BAG_KEY, items);
  },
  setQty(id, slug, size, qty) {
    let items = read(BAG_KEY);
    items = items.map((i) => (i.id === id && i.slug === slug && i.size === size ? { ...i, qty } : i)).filter((i) => i.qty > 0);
    write(BAG_KEY, items);
  },
  remove(id, slug, size) { write(BAG_KEY, read(BAG_KEY).filter((i) => !(i.id === id && i.slug === slug && i.size === size))); },
  clear() { write(BAG_KEY, []); },
};

export const Wish = {
  items: () => read(WISH_KEY),
  has: (id) => read(WISH_KEY).includes(id),
  toggle(id) { const w = read(WISH_KEY); const i = w.indexOf(id); if (i >= 0) w.splice(i, 1); else w.push(id); write(WISH_KEY, w); return i < 0; },
  count: () => read(WISH_KEY).length,
};

// ---- chrome ----
const badge = '/assets/badge-ink-160.png';
const HEADER = (active) => `
<a class="skip" href="#main">Zum Inhalt</a>
<div class="strip" role="region" aria-label="Hinweis">
  <a href="${JTR_URL}" rel="noopener">Chiemsee × Join the Ride: <span class="long">die neue Kollektion entdecken</span><span class="short">neue Kollektion</span></a>
</div>
<header class="hdr">
  <nav class="hdr-nav" aria-label="Kategorien">
    ${CATS.map((c) => `<a href="/shop.html?cat=${c.key}" ${active === c.key ? 'aria-current="page"' : ''}>${c.label}</a>`).join('')}
  </nav>
  <a class="wordmark" href="/index.html" aria-label="Chiemsee Startseite">
    <img src="${badge}" alt="" width="26" height="22"><span>Chiemsee</span>
  </a>
  <div class="hdr-utils">
    <button type="button" data-open="search">Suche</button>
    <a href="/wishlist.html">Merkliste<span data-wish-count hidden></span></a>
    <button type="button" data-open="bag">Warenkorb <span data-bag-count>(0)</span></button>
  </div>
  <div class="hdr-mobile"><button type="button" data-open="search">Suche</button><button type="button" data-open="bag">Warenkorb <span data-bag-count>(0)</span></button><button type="button" class="hdr-burger" data-open="menu" aria-label="Menü öffnen">Menü</button></div>
</header>`;

const FOOTER = `
<footer class="ftr">
  <div class="ftr-cols">
    <div><img src="${badge}" alt="Chiemsee Jumper, das Markenzeichen: ein springender Windsurfer" width="52" height="45"></div>
    <div><h2 class="t-s">Hilfe</h2><a href="#versand">Versand &amp; Lieferung</a><a href="#retoure">Rückgabe &amp; Umtausch</a><a href="#groessen">Größentabelle</a><a href="#kontakt">Kontakt</a></div>
    <div><h2 class="t-s">Über Chiemsee</h2><a href="/ueber-chiemsee.html">Seit 1982 am Wasser</a><a href="/ueber-chiemsee.html#team">Team</a><a href="/ueber-chiemsee.html#verantwortung">Verantwortung</a><a href="#stores">Stores</a></div>
    <div><h2 class="t-s">Rechtliches</h2><a href="#impressum">Impressum</a><a href="#datenschutz">Datenschutz</a><a href="#agb">AGB</a><a href="#widerruf">Widerruf</a></div>
    <div><h2 class="t-s">Join the Ride</h2><a href="${JTR_URL}" rel="noopener">Die neue Kollektion</a></div>
  </div>
  <p class="ftr-legal t-s">Chiemsee Online Shop · Prototyp, keine echten Bestellungen · Preise in Euro inkl. MwSt. · Kostenloser Versand ab 80 €</p>
</footer>
<div class="scrim" data-close hidden></div>
<aside class="sheet sheet-bag" id="bag-sheet" aria-label="Warenkorb" tabindex="-1" hidden>
  <div class="sheet-head"><h2 class="t-m upper">Warenkorb</h2><button type="button" data-close>Schließen</button></div>
  <div class="sheet-body" data-bag-list></div>
  <div class="sheet-foot">
    <div class="row"><span>Zwischensumme</span><span data-bag-subtotal>0,00 €</span></div>
    <div class="row"><span>Versand</span><span data-bag-ship>Kostenlos</span></div>
    <div class="row total"><span>Gesamt</span><span data-bag-total>0,00 €</span></div>
    <p class="t-s muted">inkl. MwSt. · Kostenloser Versand ab 80 €</p>
    <a class="btn btn-fill" href="/checkout.html">Zur Kasse</a>
    <a class="btn btn-line" href="/bag.html">Warenkorb ansehen</a>
  </div>
</aside>
<aside class="sheet sheet-menu" id="menu-sheet" aria-label="Menü" tabindex="-1" hidden>
  <div class="sheet-head"><span class="t-m upper">Menü</span><button type="button" data-close>Schließen</button></div>
  <nav class="sheet-body menu-list">${CATS.map((c) => `<a href="/shop.html?cat=${c.key}">${c.label}</a>`).join('')}<a href="/wishlist.html">Merkliste</a><a href="/ueber-chiemsee.html">Über Chiemsee</a></nav>
</aside>`;

export function mountChrome({ active } = {}) {
  const top = document.getElementById('chrome-top'); if (top) top.outerHTML = HEADER(active);
  const bottom = document.getElementById('chrome-bottom'); if (bottom) bottom.outerHTML = FOOTER;
  syncCounts();
  window.addEventListener('store:change', () => { syncCounts(); renderBagSheet(); });
  document.addEventListener('click', (e) => {
    const open = e.target.closest('[data-open]');
    if (open) { e.preventDefault(); openSheet(open.dataset.open); }
    if (e.target.closest('[data-close]')) closeSheets();
  });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeSheets(); });
}

function syncCounts() {
  document.querySelectorAll('[data-bag-count]').forEach((el) => (el.textContent = `(${Bag.count()})`));
  document.querySelectorAll('[data-wish-count]').forEach((el) => { const n = Wish.count(); el.textContent = ` (${n})`; el.hidden = false; });
}

let lastFocus; const pending = [];
export function openSheet(name) {
  if (name === 'search') { window.dispatchEvent(new CustomEvent('search:open')); return; }
  closeSheets(true);
  while (pending.length) clearTimeout(pending.pop());
  const el = document.getElementById(`${name}-sheet`); if (!el) return;
  lastFocus = document.activeElement;
  if (name === 'bag') renderBagSheet();
  document.querySelector('.scrim').hidden = false; el.hidden = false;
  requestAnimationFrame(() => { document.querySelector('.scrim').classList.add('is-on'); el.classList.add('is-on'); });
  document.body.style.overflow = 'hidden';
  el.focus();
}
export function closeSheets(silent) {
  document.querySelectorAll('.sheet.is-on').forEach((el) => { el.classList.remove('is-on'); pending.push(setTimeout(() => (el.hidden = true), 260)); });
  const scrim = document.querySelector('.scrim'); if (scrim) { scrim.classList.remove('is-on'); pending.push(setTimeout(() => (scrim.hidden = true), 260)); }
  document.body.style.overflow = '';
  window.dispatchEvent(new CustomEvent('sheets:closed'));
  if (!silent && lastFocus) lastFocus.focus();
}

function renderBagSheet() {
  const list = document.querySelector('[data-bag-list]'); if (!list) return;
  const items = Bag.items();
  list.innerHTML = items.length ? items.map((i) => `
    <div class="line" data-line="${esc(i.id)}|${esc(i.slug)}|${esc(i.size)}">
      <a href="${productUrl({ id: i.id }, { slug: i.slug })}"><img src="${esc(i.thumb)}" alt="${esc(i.name)}" width="120" height="171" loading="lazy"></a>
      <div class="line-info">
        <a class="upper" href="${productUrl({ id: i.id }, { slug: i.slug })}">${esc(i.name)}</a>
        <div>${esc(i.color)}${i.size && i.size !== 'Einheitsgröße' ? ` · Größe ${esc(i.size)}` : ''}</div>
        <div class="line-ctrl">
          <div class="qty"><button type="button" data-qty="-1" aria-label="Weniger">−</button><span>${i.qty}</span><button type="button" data-qty="1" aria-label="Mehr">+</button></div>
          <span>${fmt(i.price * i.qty)}</span>
        </div>
        <button type="button" class="t-s link" data-remove>Entfernen</button>
      </div>
    </div>`).join('') : '<p class="muted empty">Dein Warenkorb ist leer.</p>';
  const st = Bag.subtotal(), sh = Bag.shipping(st);
  const sub = document.querySelector('[data-bag-subtotal]'); if (sub) sub.textContent = fmt(st);
  const ship = document.querySelector('[data-bag-ship]'); if (ship) ship.textContent = sh ? fmt(sh) : 'Kostenlos';
  const tot = document.querySelector('[data-bag-total]'); if (tot) tot.textContent = fmt(st + sh);
  list.querySelectorAll('.line').forEach((row) => {
    const [id, s, size] = row.dataset.line.split('|');
    const item = items.find((i) => i.id === id && i.slug === s && i.size === size);
    row.querySelectorAll('[data-qty]').forEach((b) => b.addEventListener('click', () => Bag.setQty(id, s, size, item.qty + Number(b.dataset.qty))));
    row.querySelector('[data-remove]').addEventListener('click', () => Bag.remove(id, s, size));
  });
  document.querySelector('.sheet-foot .btn-fill')?.toggleAttribute('aria-disabled', !items.length);
}
