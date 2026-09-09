# one-off builder patch for round 3 (kept for the record; safe to re-run: asserts fail if already applied)
import pathlib
ROOT = pathlib.Path(__file__).resolve().parents[1]

def patch(rel, pairs):
    p = ROOT / rel; s = p.read_text(encoding='utf-8')
    for old, new in pairs:
        assert old in s, (rel, old[:70]); s = s.replace(old, new)
    p.write_text(s, encoding='utf-8')

patch('src/js/store.js', [
 ("export const fmt = (n) =>", "export const shortName = (n) => n.replace(/^(Comfort-Fit|Loose-Fit|Slim-Fit|Regular-Fit|Tight-Fit|Einfarbiger|Einfarbige|Einfarbiges|Unifarbende|Unifarbene|Unifarbenes|Unisex)\\s+/i, '');\nexport const fmt = (n) =>"),
 ("el.textContent = n ? ` ${n}` : ''; el.hidden = !n; });", "el.textContent = n ? ` (${n})` : ''; el.hidden = !n; });"),
 ('<a href="/wishlist.html">Merkliste<span class="count" data-wish-count hidden></span></a>', '<a href="/wishlist.html">Merkliste<span data-wish-count hidden></span></a>'),
 ('  <button type="button" class="hdr-burger" data-open="menu" aria-label="Menü">Menü</button>', '  <div class="hdr-mobile"><button type="button" data-open="search">Suche</button><button type="button" data-open="bag">Warenkorb <span data-bag-count>(0)</span></button><button type="button" class="hdr-burger" data-open="menu" aria-label="Menü öffnen">Menü</button></div>'),
])
patch('src/js/tile.js', [
 ("import { fmt, productUrl, swatchColor, esc, Wish } from './store.js';", "import { fmt, productUrl, swatchColor, esc, Wish, shortName } from './store.js';"),
 ('<a class="tile-name upper" href="${productUrl(p, v)}">${esc(p.name)}</a>', '<a class="tile-name upper" href="${productUrl(p, v)}" title="${esc(p.name)}">${esc(shortName(p.name))}</a>'),
])
patch('src/styles/chrome.css', [
 (".tile-cap { height: 112px; padding: 12px 8px 0; text-align: center; display: grid; grid-template-rows: 44px 22px 18px; align-content: start; gap: 4px; }\n.tile-name { display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: 2; overflow: hidden; justify-self: center; align-self: start; }\n@media (max-width: 760px) { .tile-cap { height: 134px; grid-template-rows: 66px 22px 18px; } .tile-name { -webkit-line-clamp: 3; letter-spacing: 0; } }",
  ".tile-cap { height: 112px; padding: 12px 8px 0; text-align: center; display: grid; align-content: start; gap: 2px; }\n.tile-name { display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: 2; overflow: hidden; justify-self: center; }\n@media (max-width: 760px) { .tile-cap { height: 134px; } .tile-name { -webkit-line-clamp: 3; letter-spacing: 0; } }"),
 (".swatches { display: flex; justify-content: center; align-items: center; gap: 6px; }", ".swatches { display: flex; justify-content: center; align-items: center; gap: 6px; height: 18px; margin-top: 2px; }"),
 (".hdr-burger { display: none; justify-self: end; }\n@media (max-width: 900px) {\n  .hdr { grid-template-columns: auto 1fr auto; }\n  .hdr-nav { display: none; }\n  .hdr-utils { display: none; }\n  .hdr-burger { display: block; }\n  .wordmark { justify-self: start; }\n}",
  ".hdr-mobile { display: none; justify-self: end; gap: 18px; }\n@media (max-width: 900px) {\n  .hdr { grid-template-columns: auto 1fr; padding: 0 16px; }\n  .hdr-nav { display: none; }\n  .hdr-utils { display: none; }\n  .hdr-mobile { display: flex; }\n  .wordmark { justify-self: start; }\n  .wordmark span { display: none; }\n}"),
 ("@media (max-width: 900px) { .ftr-cols { grid-template-columns: 1fr 1fr; } }", "@media (max-width: 900px) { .ftr-cols { grid-template-columns: 1fr 1fr; } .ftr-cols > div:first-child { grid-column: 1 / -1; } }"),
 (".sheet { position: fixed; top: 0; bottom: 0; right: 0; width: min(440px, 100vw); background: var(--paper); z-index: 70; display: grid; grid-template-rows: auto 1fr auto;", ".sheet { position: fixed; top: 0; bottom: 0; right: 0; width: min(440px, 100vw); background: var(--paper); z-index: 70; display: grid; grid-template-rows: auto auto 1fr; align-content: start;"),
 (".sheet-body { overflow: auto; padding: 8px var(--pad); }", ".sheet-body { overflow: auto; padding: 8px var(--pad); max-height: calc(100vh - 56px - 240px); }\n.sheet-menu .sheet-body { max-height: none; }"),
 (".search-quick { display: flex; flex-wrap: wrap; gap: 8px 20px; align-items: center; padding: 8px var(--pad) 24px; }", ".search-quick { display: flex; flex-wrap: wrap; gap: 8px 20px; align-items: center; padding: 8px var(--pad) 8px; }"),
 (".search .row-sec { padding-top: 32px; }", ".search .row-sec { padding-top: 40px; }\n.search-meta:empty { display: none; }"),
])
patch('shop.html', [
 ('<option value="price-asc">Preis aufsteigend</option>\n            <option value="price-desc">Preis absteigend</option>\n            <option value="name">Name A bis Z</option>',
  '<option value="price-asc">Sortieren: Preis aufsteigend</option>\n            <option value="price-desc">Sortieren: Preis absteigend</option>\n            <option value="name">Sortieren: Name A bis Z</option>'),
])
patch('src/js/shop.js', [
 ("    const v = colors.length ? x.variants.find((vv) => colors.includes(vv.main)) : null;",
  "    let v = colors.length ? x.variants.find((vv) => colors.includes(vv.main)) : null;\n    if (!v && (cat === 'sale' || sale)) v = x.variants.find((vv) => vv.oldPrice) || null;"),
])
patch('src/styles/product.css', [
 (".size-grid { display: flex; flex-wrap: wrap; justify-content: center; gap: 6px; }", ".size-grid { display: flex; flex-wrap: wrap; justify-content: flex-start; gap: 6px; }"),
 (".hint { color: var(--ink); text-transform: none; letter-spacing: 0; }", ".hint { color: var(--ink); text-transform: none; letter-spacing: 0; visibility: hidden; min-height: 16px; }\n.hint.is-shown { visibility: visible; }"),
 (".related { padding-top: 80px; }", ".related { padding-top: 0; }"),
 (".pdp-info { position: static; margin-top: 8px; padding-bottom: 32px; }", ".pdp-info { position: static; margin-top: 8px; padding-bottom: 8px; }"),
])
patch('product.html', [('<p class="t-s hint" data-size-hint role="alert" hidden>Bitte Größe wählen.</p>', '<p class="t-s hint" data-size-hint role="alert">Bitte Größe wählen.</p>')])
patch('src/js/product.js', [
 ("$('[data-size-hint]').hidden = true; renderSizes(); });", "$('[data-size-hint]').classList.remove('is-shown'); renderSizes(); });"),
 ("$('[data-size-hint]').hidden = false; return; }", "$('[data-size-hint]').classList.add('is-shown'); return; }"),
])
patch('src/styles/commerce.css', [
 (".mini-lines { display: grid; gap: 12px; }", ".mini-lines { display: grid; gap: 12px; padding-bottom: 14px; border-bottom: 1px solid var(--line); }"),
])
patch('src/styles/home.css', [
 (".hero-scrim { position: absolute; inset: 0; background: linear-gradient(to top, rgba(11,22,32,.5) 0%, rgba(11,22,32,.18) 40%, rgba(11,22,32,0) 65%); }",
  ".hero-scrim { position: absolute; inset: 0; background: linear-gradient(to top, rgba(11,22,32,.62) 0%, rgba(11,22,32,.28) 38%, rgba(11,22,32,0) 62%), radial-gradient(ellipse 60% 70% at 18% 92%, rgba(11,22,32,.45), rgba(11,22,32,0) 70%); }"),
 (".hero-copy .t-s { opacity: .9; }", ".hero-copy .t-s { opacity: .9; }\n.hero-copy h1 { text-wrap: balance; max-width: 14ch; }"),
 (".band img { width: 100%; height: 100%; object-fit: cover; object-position: 0% 25%; }", ".band img { width: 100%; height: 100%; object-fit: cover; object-position: 50% 30%; }"),
])
patch('index.html', [
 ('<img src="/assets/campaign/fall-men-fleece.jpg" alt="" style="object-position:52% 25%" width="1920" height="920"><span class="t-m upper">Herren</span>', '<img src="/assets/campaign/fall-men-troyer.jpg" alt="" style="object-position:30% 20%" width="1920" height="920"><span class="t-m upper">Herren</span>'),
 ('<img src="/assets/campaign/fall-men-troyer.jpg" alt="Mann im cremefarbenen Chiemsee Troyer auf einer Brücke über einem Fluss im Herbstlicht" loading="lazy" width="1920" height="920">', '<img src="/assets/campaign/fall-men-fleece.jpg" alt="Mann in schwarzer Chiemsee Sherpa-Fleecejacke vor einer Holzhütte" loading="lazy" width="1920" height="920">'),
])
patch('src/js/home.js', [
 ("  const fresh = [...pick((p) => p.isNew && p.gender === 'herren' && p.type === 'Sweatshirts & Hoodies', 1), ...pick((p) => p.isNew && p.gender === 'damen' && p.type === 'Sweatshirts & Hoodies', 1), ...pick((p) => p.isNew && p.gender === 'herren' && p.type === 'Fleece', 1), ...pick((p) => p.isNew && p.gender === 'damen' && p.type === 'Ski & Funktion', 1), ...pick((p) => p.isNew && p.gender === 'kinder', 1), ...pick((p) => p.isNew && p.gender === 'accessoires', 1)].slice(0, cols());",
  "  // curated for one crop line (front, head to hip); falls back to any new product\n  const byIds = (ids) => ids.map((id) => c.find((p) => p.id === id)).filter(Boolean);\n  const fresh = [...byIds(['3326251', '3326318', '3326241', '3326220']), ...pick((p) => p.isNew, 8)].filter((p, i, a) => a.indexOf(p) === i).slice(0, cols());"),
 ("  const sale = c.filter((p) => p.sale && p.variants[0].oldPrice).sort((a, b) => (b.oldPrice - b.price) / b.oldPrice - (a.oldPrice - a.price) / a.oldPrice).slice(0, cols());",
  "  const sale = [...byIds(['00017682', '00017354', '1913474', '00017383']), ...c.filter((p) => p.sale)].filter((p, i, a) => a.indexOf(p) === i).slice(0, cols());"),
 ("document.querySelector('[data-row=\"sale\"]').innerHTML = sale.map((p) => tileHTML(p, null, { lazy: false })).join('');",
  "document.querySelector('[data-row=\"sale\"]').innerHTML = sale.map((p) => tileHTML(p, p.variants.find((v) => v.oldPrice) || null, { lazy: false })).join('');"),
])
patch('design-system.md', [
 ("  tile on `--ground`. Caption below the image, centred, on paper: NAME uppercase 15px (a fixed two-line block,\n  names longer than two lines are clipped with an ellipsis; three lines on phones) · price 15px · swatch row\n  (10px squares, max 5, then \"+n\" in 12px). Caption block height 112px (134px on phones), identical on every tile,\n  so price and swatches sit on the same baseline across a row.",
  "  tile on `--ground`. Caption below the image, centred, on paper, set tight: NAME uppercase 15px (the product name\n  without its fit prefix, e.g. \"Sherpa Fleeceweste mit Brusttasche\"; the full name lives on the PDP; at most two\n  lines, three on phones, longer names clip with an ellipsis) · price 15px directly beneath · swatch row (10px squares,\n  max 5, then \"+n\" in 12px). Caption block height 112px (134px on phones), identical on every tile."),
 ("  right (Suche · Merkliste · Warenkorb (n), the count in parentheses) → 1px hairline. Sticky. Paper ground. 24px side\n  padding. Total 89px. The bag drawer shows Zwischensumme, Versand and Gesamt.",
  "  right (Suche · Merkliste (n) · Warenkorb (n), counts in parentheses) → 1px hairline. Sticky. Paper ground. 24px side\n  padding. Total 89px. The bag drawer shows Zwischensumme, Versand and Gesamt, its totals following the items.\n  On phones (< 900px) the header collapses to: jumper badge left (wordmark text hidden), then Suche · Warenkorb (n) · Menü\n  right; the category nav and Merkliste live in the Menü sheet."),
 ("- **Bag / Checkout / Merkliste / Suche:** single centred column max-width 1080px on paper; line items are",
  "- **Merkliste** uses the category-page layout: heading block, then the tile grid (full width, zero margin).\n- **Bag / Checkout / Suche:** single centred column max-width 1080px on paper; line items are"),
 ("  colourways + colour name in 15px) · size boxes 56×42 hairline (selected = 1px ink border), centred and wrapping · ONE filled ink bar",
  "  colourways + colour name in 15px) · size boxes 56×42 hairline (selected = 1px ink border), left-aligned, wrapping;\n  the hint line below them always reserves its height so nothing moves when it appears · ONE filled ink bar"),
])
print('all patched')
