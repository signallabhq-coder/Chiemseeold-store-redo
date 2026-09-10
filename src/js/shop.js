// shop.js — category page: URL-driven filters, sort, sub-type strip, editorial breakers
import { loadCatalog, mountChrome, CATS, inCat, genderLabel, openSheet, closeSheets, esc, swatchColor, fmt } from './store.js';
import { tileHTML, bindTiles, alignCaptions } from './tile.js';
import { mountSearch } from './search.js';

const INTRO = {
  damen: ['Damen', 'Sweatshirts, Fleece und Skibekleidung für Wasser, Berg und alles dazwischen.'],
  herren: ['Herren', 'Von der Badehose bis zur Skijacke. Boardsport seit 1982.'],
  kinder: ['Kinder', 'Skibekleidung, Sweats und Bademode für die Kleinen.'],
  accessoires: ['Accessoires', 'Caps, Beanies, Socken, Taschen und Handtücher.'],
  sale: ['Sale', 'Reduzierte Teile aus den letzten Kollektionen.'],
  all: ['Alle Produkte', 'Die aktuelle Chiemsee Kollektion für Damen, Herren und Kinder.'],
};
const EDITORIAL = {
  damen: [{ src: 'assets/campaign/fall-women-hoodie.jpg', pos: '30% 30%', cap: 'Herbst am See' }, { src: 'assets/campaign/cat-women.jpg', pos: '50% 30%', cap: 'Auf der Piste' }],
  herren: [{ src: 'assets/campaign/fall-men-troyer.jpg', pos: '38% 20%', cap: 'Troyer und Fleece' }, { src: 'assets/campaign/fall-men-fleece.jpg', pos: '50% 20%', cap: 'Sherpa Fleece' }],
  kinder: [{ src: 'assets/campaign/cat-kids.webp', pos: '50% 50%', cap: 'Ab ins Wasser' }],
  accessoires: [{ src: 'assets/campaign/fall-women-hoodie.jpg', pos: '30% 30%', cap: 'Beanies und Caps' }],
  sale: [{ src: 'assets/campaign/heritage-windsurfer.jpg', pos: '50% 50%', cap: 'Archiv' }],
  all: [{ src: 'assets/campaign/fall-men-troyer.jpg', pos: '38% 20%', cap: 'Herbst 2026' }, { src: 'assets/campaign/cat-women.jpg', pos: '50% 30%', cap: 'Auf der Piste' }],
};
const PRICE_BANDS = [['0-25', 'bis 25 €'], ['25-50', '25 bis 50 €'], ['50-100', '50 bis 100 €'], ['100-200', '100 bis 200 €'], ['200-9999', 'über 200 €']];
const SIZE_ORDER = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL', '4XL', '5XL', '6XL', 'S/M', 'L/XL', '34', '36', '38', '40', '42', '44', '46', '48', '50', '52', '54', '56', '128', '140', '152', '164', '176', '35-38', '39-42', '43-46'];
// crop class keeps rows reading as one line: 0 = on-model tops/jackets (head visible), 1 = trousers/shorts (headless crops), 2 = flat-lays (accessories, swimwear)
const shownVariant = (p) => p.variants.find((x) => x.oldPrice) || p.variants.find((x) => x.shot === 'face') || p.variants[0];
// bust shots (larger face) sort before full-length shots inside the front-facing group
const cropClass = (p) => { const v = shownVariant(p); const base = { face: 0, back: 2, body: 3, flat: 4 }[v.shot] ?? 3; return base === 0 && (!v.face || v.face < 0.11) ? 1 : base; };
const sizeRank = (s) => { const i = SIZE_ORDER.indexOf(s); return i < 0 ? 100 + s.length : i; };

const $ = (s, r = document) => r.querySelector(s);
const params = () => new URLSearchParams(location.search);
const multi = (p, k) => (p.get(k) || '').split(',').filter(Boolean);

let catalog;
async function init() {
  const cat = params().get('cat') || 'all';
  mountChrome({ active: cat });
  mountSearch();
  bindTiles();
  catalog = await loadCatalog();
  render();
  window.addEventListener('popstate', render);
  $('[data-sort]').addEventListener('change', (e) => setParams({ sort: e.target.value === 'new' ? null : e.target.value }));
  $('[data-apply]').addEventListener('click', applyForm);
  document.querySelectorAll('[data-reset]').forEach((b) => b.addEventListener('click', () => { setParams({ type: null, size: null, color: null, price: null, sale: null }); closeSheets(); }));
  $('[data-active-filters]').addEventListener('click', (e) => { const b = e.target.closest('[data-chip]'); if (!b) return; const [k, v] = b.dataset.chip.split('='); const cur = multi(params(), k).filter((x) => x !== v); setParams({ [k]: cur.length ? cur.join(',') : null }); });
  $('[data-subnav]').addEventListener('click', (e) => { const a = e.target.closest('a'); if (!a) return; e.preventDefault(); setParams({ type: a.dataset.type || null }); });
}

function setParams(patch) {
  const p = params();
  for (const [k, v] of Object.entries(patch)) { if (v == null || v === '') p.delete(k); else p.set(k, v); }
  history.pushState(null, '', `${location.pathname}?${p.toString()}`.replace(/\?$/, ''));
  render();
}

function applyForm() {
  const f = $('[data-filter-form]');
  const get = (n) => [...f.querySelectorAll(`[name="${n}"]:checked`)].map((i) => i.value);
  setParams({ type: get('type').join(',') || null, size: get('size').join(',') || null, color: get('color').join(',') || null, price: get('price').join(',') || null, sale: f.querySelector('[name="sale"]')?.checked ? '1' : null });
  closeSheets();
}

function render() {
  const p = params();
  const cat = p.get('cat') || 'all';
  const [title, intro] = INTRO[cat] || INTRO.all;
  const types = multi(p, 'type'), sizes = multi(p, 'size'), colors = multi(p, 'color'), prices = multi(p, 'price'), sale = p.get('sale') === '1', sort = p.get('sort') || 'new';
  document.title = `${title} · Chiemsee Online Shop`;
  $('[data-title]').textContent = title; $('[data-intro]').textContent = intro;
  $('[data-crumbs]').innerHTML = `<a href="index.html">Chiemsee</a><span>/</span>${cat === 'all' ? '<span>Shop</span>' : `<span>${esc(title)}</span>`}`;
  document.querySelectorAll('.hdr-nav a').forEach((a) => a.toggleAttribute('aria-current', a.getAttribute('href').endsWith(`cat=${cat}`)));

  const base = catalog.filter((x) => cat === 'all' || inCat(x, cat));
  // sub-type strip
  const typeCounts = base.reduce((m, x) => (m[x.type] = (m[x.type] || 0) + 1, m), {});
  $('[data-subnav]').innerHTML = [`<a href="#" data-type="" ${!types.length ? 'aria-current="true"' : ''}>Alle</a>`]
    .concat(Object.keys(typeCounts).sort().map((t) => `<a href="#" data-type="${esc(t)}" ${types.length === 1 && types[0] === t ? 'aria-current="true"' : ''}>${esc(t)}</a>`)).join('');

  const inBand = (price) => prices.some((b) => { const [lo, hi] = b.split('-').map(Number); return price >= lo && price < hi; });
  let list = base.filter((x) => (!types.length || types.includes(x.type)) && (!sale || x.sale)
    && (!sizes.length || x.variants.some((v) => v.sizes.some((s) => sizes.includes(s))))
    && (!colors.length || x.variants.some((v) => colors.includes(v.main)))
    && (!prices.length || x.variants.some((v) => inBand(v.price))));
  const sorters = { new: (a, b) => (cropClass(a) - cropClass(b)) || (Number(b.isNew) - Number(a.isNew)) || (b.price - a.price), newest: (a, b) => (Number(b.isNew) - Number(a.isNew)) || (b.price - a.price), 'price-asc': (a, b) => a.price - b.price, 'price-desc': (a, b) => b.price - a.price, name: (a, b) => a.name.localeCompare(b.name, 'de') };
  list = [...list].sort(sorters[sort] || sorters.new);
  $('[data-sort]').value = sort;

  const nActive = types.length + sizes.length + colors.length + prices.length + (sale ? 1 : 0);
  $('[data-filter-count]').textContent = nActive ? ` ${nActive}` : '';
  $('[data-count]').textContent = `${list.length} ${list.length === 1 ? 'Artikel' : 'Artikel'}`;
  $('[data-active-filters]').innerHTML = [...types.map((v) => ['type', v, v]), ...sizes.map((v) => ['size', v, `Größe ${v}`]), ...colors.map((v) => ['color', v, v]), ...prices.map((v) => ['price', v, PRICE_BANDS.find((b) => b[0] === v)?.[1] || v]), ...(sale ? [['sale', '1', 'Nur reduzierte Artikel']] : [])]
    .map(([k, v, label]) => `<button type="button" data-chip="${esc(k)}=${esc(v)}" aria-label="${esc(label)} entfernen">${esc(label)} <span aria-hidden="true">×</span></button>`).join('');

  // grid with editorial breakers: one 2x2 after 6 tiles, another after 20 (never two in one viewport)
  const eds = EDITORIAL[cat] || EDITORIAL.all;
  const html = [];
  list.forEach((x, i) => {
    if (i === 6 && eds[0] && list.length > 8) html.push(editorial(eds[0]));
    if (i === 20 && eds[1] && list.length > 22) html.push(editorial(eds[1]));
    let v = colors.length ? x.variants.find((vv) => colors.includes(vv.main)) : null;
    if (!v && (cat === 'sale' || sale)) v = x.variants.find((vv) => vv.oldPrice) || null;
    html.push(tileHTML(x, v, { lazy: i > 7 }));
  });
  $('[data-grid]').innerHTML = html.join('');
  alignCaptions();
  $('[data-none]').hidden = list.length > 0;
  renderFilterForm(base, { types, sizes, colors, prices, sale });
}

const editorial = (e) => `<a class="tile-edit" href="ueber-chiemsee.html" aria-label="${esc(e.cap)}"><img src="${e.src}" alt="" style="object-position:${e.pos}" loading="lazy"><span class="edit-cap t-s">${esc(e.cap)}</span></a>`;

function renderFilterForm(base, st) {
  const f = $('[data-filter-form]');
  const count = (fn) => base.filter(fn).length;
  const types = [...new Set(base.map((x) => x.type))].sort();
  const sizes = [...new Set(base.flatMap((x) => x.variants.flatMap((v) => v.sizes)))].sort((a, b) => sizeRank(a) - sizeRank(b));
  const colors = [...new Set(base.flatMap((x) => x.variants.map((v) => v.main)))].filter(Boolean).sort();
  f.innerHTML = `
    <fieldset><legend>Angebot</legend><label><input type="checkbox" name="sale" value="1" ${st.sale ? 'checked' : ''}><span>Nur reduzierte Artikel</span><span class="n">${count((x) => x.sale)}</span></label></fieldset>
    <fieldset><legend>Preis</legend>${PRICE_BANDS.map(([v, l]) => `<label><input type="checkbox" name="price" value="${v}" ${st.prices.includes(v) ? 'checked' : ''}><span>${l}</span></label>`).join('')}</fieldset>
    <fieldset><legend>Typ</legend>${types.map((t) => `<label><input type="checkbox" name="type" value="${esc(t)}" ${st.types.includes(t) ? 'checked' : ''}><span>${esc(t)}</span><span class="n">${count((x) => x.type === t)}</span></label>`).join('')}</fieldset>
    ${sizes.length ? `<fieldset><legend>Größe</legend><div class="sizes">${sizes.map((s) => `<label><input type="checkbox" name="size" value="${esc(s)}" ${st.sizes.includes(s) ? 'checked' : ''}><span>${esc(s)}</span></label>`).join('')}</div></fieldset>` : ''}
    <fieldset class="colors"><legend>Farbe</legend>${colors.map((c) => `<label><input type="checkbox" name="color" value="${esc(c)}" ${st.colors.includes(c) ? 'checked' : ''}><span class="dot" style="--sw:${swatchColor({ main: c })}"></span><span>${esc(c)}</span><span class="n">${count((x) => x.variants.some((v) => v.main === c))}</span></label>`).join('')}</fieldset>
`;
}

init();
