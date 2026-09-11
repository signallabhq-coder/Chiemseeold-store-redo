import { loadCatalog, mountChrome } from './store.js';
import { tileHTML, bindTiles, alignCaptions } from './tile.js';
import { mountSearch } from './search.js';
import { mountOldShop } from './oldshop.js';

mountOldShop();
mountChrome();
mountSearch();
bindTiles();
const cols = () => (innerWidth > 1200 || innerWidth <= 760 ? 4 : 3);
loadCatalog().then((c) => {
  const pick = (fn, n) => c.filter(fn).slice(0, n);
  // curated for one crop line (front, head to hip); falls back to any new product
  const byIds = (ids) => ids.map((id) => c.find((p) => p.id === id)).filter(Boolean);
  const fresh = [...byIds(['3326251', '3326318', '3326241', '3326220']), ...pick((p) => p.isNew, 8)].filter((p, i, a) => a.indexOf(p) === i).slice(0, cols());
  document.querySelector('[data-row="new"]').innerHTML = fresh.map((p) => tileHTML(p, null, { lazy: false })).join('');
  const sale = [...byIds(['00017682', '00017354', '1913474', '00011689']), ...c.filter((p) => p.sale)].filter((p, i, a) => a.indexOf(p) === i).slice(0, cols());
  document.querySelector('[data-row="sale"]').innerHTML = sale.map((p) => tileHTML(p, p.variants.find((v) => v.oldPrice) || null, { lazy: false })).join('');
  alignCaptions();
});
