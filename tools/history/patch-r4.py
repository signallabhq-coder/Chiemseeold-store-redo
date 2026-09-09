# builder patch for round 4 (kept for the record)
import pathlib, re
ROOT = pathlib.Path(__file__).resolve().parents[1]
def patch(rel, pairs):
    p = ROOT / rel; s = p.read_text(encoding='utf-8')
    for old, new in pairs:
        assert old in s, (rel, old[:70]); s = s.replace(old, new)
    p.write_text(s, encoding='utf-8')

# store: broader short names, Merkliste (n) always, drawer note
patch('src/js/store.js', [
 ("export const shortName = (n) => n.replace(/^(Comfort-Fit|Loose-Fit|Slim-Fit|Regular-Fit|Tight-Fit|Einfarbiger|Einfarbige|Einfarbiges|Unifarbende|Unifarbene|Unifarbenes|Unisex)\\s+/i, '');",
  "export const shortName = (n) => n.replace(/\\b(Comfort|Loose|Slim|Regular|Tight)-Fit\\s+/gi, '').replace(/^(Funktionale[rs]?|Einfarbige[rs]?|Unifarbene[rs]?|Unifarbende[rs]?|Unisex)\\s+/i, '').replace(/^(Funktionale[rs]?|Einfarbige[rs]?|Unifarbene[rs]?|Unifarbende[rs]?|Unisex)\\s+/i, '').replace(/^./, (c) => c.toUpperCase());"),
 ("el.textContent = n ? ` (${n})` : ''; el.hidden = !n; });", "el.textContent = ` (${n})`; el.hidden = false; });"),
 ('    <div class="row total"><span>Gesamt</span><span data-bag-total>0,00 €</span></div>\n', '    <div class="row total"><span>Gesamt</span><span data-bag-total>0,00 €</span></div>\n    <p class="t-s muted">inkl. MwSt. · Kostenloser Versand ab 80 €</p>\n'),
])
patch('src/styles/chrome.css', [
 ("display: grid; grid-template-rows: auto auto 1fr; align-content: start;", "display: grid; grid-template-rows: auto auto auto; align-content: start;"),
])
# shop: filter order (Angebot + Preis first), toolbar on phones
s = (ROOT / 'src/js/shop.js').read_text(encoding='utf-8')
typ = re.search(r"    <fieldset><legend>Typ</legend>.*?</fieldset>\n", s, re.S).group(0)
preis = re.search(r"    <fieldset><legend>Preis</legend>.*?</fieldset>\n", s, re.S).group(0)
ang = re.search(r"    <fieldset><legend>Angebot</legend>.*?</fieldset>`;", s, re.S).group(0)
s = s.replace(typ, ang.replace('`;', '\n') + preis + typ).replace(preis + ang, '`;', 1) if False else s
# simpler: rebuild order explicitly
s = s.replace(typ, '').replace(preis, '').replace(ang, '`;')
s = s.replace("  $('[data-filter-form]').innerHTML = `\n", "  $('[data-filter-form]').innerHTML = `\n" + ang.replace('`;', '\n') + preis + typ)
(ROOT / 'src/js/shop.js').write_text(s, encoding='utf-8')
patch('src/styles/shop.css', [
 (".toolbar { display: flex; justify-content: space-between; align-items: center; padding: 24px var(--pad) 16px; }",
  ".toolbar { display: flex; justify-content: space-between; align-items: center; gap: 12px; padding: 24px var(--pad) 16px; }\n.toolbar [data-count] { white-space: nowrap; }\n@media (max-width: 600px) { .toolbar { padding: 16px 16px 12px; } .toolbar-left { gap: 8px; } .tb { padding: 0 12px; } .sort select { max-width: 150px; } }"),
])
# product: hide size head for one-size, related spacing, mobile counter
patch('src/js/product.js', [
 ("  if (!v.sizes.length) { el.innerHTML = '<div class=\"one t-m\">Einheitsgröße</div>'; size = 'Einheitsgröße'; return; }",
  "  $('.size-head').hidden = !v.sizes.length;\n  if (!v.sizes.length) { el.innerHTML = '<div class=\"one t-m\">Einheitsgröße</div>'; size = 'Einheitsgröße'; return; }"),
 ("  $('[data-media]').innerHTML = v.images.map((src, i) => `<figure><img src=\"${esc(src)}\" alt=\"${esc(p.name)}, ${esc(v.color)}, Ansicht ${i + 1}\" width=\"1200\" height=\"1714\" ${i ? 'loading=\"lazy\"' : 'fetchpriority=\"high\"'}></figure>`).join('');",
  "  $('[data-media]').innerHTML = v.images.map((src, i) => `<figure><img src=\"${esc(src)}\" alt=\"${esc(p.name)}, ${esc(v.color)}, Ansicht ${i + 1}\" width=\"1200\" height=\"1714\" ${i ? 'loading=\"lazy\"' : 'fetchpriority=\"high\"'}></figure>`).join('');\n  const counter = $('[data-counter]'); if (counter) { counter.textContent = `1 / ${v.images.length}`; counter.hidden = v.images.length < 2; const m = $('[data-media]'); m.onscroll = () => { counter.textContent = `${Math.round(m.scrollLeft / m.clientWidth) + 1} / ${v.images.length}`; }; }"),
])
patch('product.html', [
 ('<div class="pdp-media" data-media></div>', '<div class="pdp-media" data-media></div>\n      <p class="t-s muted pdp-counter" data-counter hidden>1 / 4</p>'),
])
patch('src/styles/product.css', [
 (".related { padding-top: 0; }", ".related { padding-top: 72px; }\n.pdp-counter { display: none; }"),
 ("  .pdp-info { position: static; margin-top: 8px; padding-bottom: 8px; }", "  .pdp-info { position: static; margin-top: 8px; padding-bottom: 8px; }\n  .pdp-counter { display: block; text-align: center; padding: 10px 0 0; }\n  .related { padding-top: 56px; }"),
])
# home: hero one line on desktop, entry images, kids image, band position on phones, sale picks
patch('src/styles/home.css', [
 (".hero-copy h1 { text-wrap: balance; max-width: 14ch; }", ".hero-copy h1 { text-wrap: balance; }\n@media (max-width: 760px) { .hero-copy h1 { max-width: 14ch; } }"),
 (".band img { width: 100%; height: 100%; object-fit: cover; object-position: 50% 30%; }", ".band img { width: 100%; height: 100%; object-fit: cover; object-position: 50% 30%; }\n@media (max-width: 760px) { .band img { object-position: 62% 30%; } .band-copy { max-width: 60%; } }"),
])
patch('index.html', [
 ('<img src="/assets/campaign/fall-women-hoodie.jpg" alt="" style="object-position:22% 30%" width="1920" height="920">', '<img src="/assets/campaign/entry-damen.jpg" alt="" style="object-position:40% 30%" width="1110" height="920">'),
 ('<img src="/assets/campaign/fall-men-troyer.jpg" alt="" style="object-position:30% 20%" width="1920" height="920">', '<img src="/assets/campaign/entry-herren.jpg" alt="" style="object-position:55% 20%" width="1130" height="920">'),
 ('<img src="/assets/campaign/cat-women.jpg" alt="" style="object-position:50% 35%" width="1920" height="600">', '<img src="/assets/campaign/cat-kids.webp" alt="" style="object-position:50% 50%" width="1280" height="400">'),
])
patch('src/js/home.js', [
 ("byIds(['00017682', '00017354', '1913474', '00017383'])", "byIds(['00017682', '00017354', '1913474', '00011689'])"),
])
# DS: mobile gallery counter, drawer note
patch('design-system.md', [
 ("- **PDP:** two columns 55 / 45.", "- **PDP:** two columns 55 / 45. On phones the image stack becomes a swipeable single frame with a 12px \"n / m\" counter beneath it."),
 ("The bag drawer lists items and shows Zwischensumme, Versand and Gesamt, its totals following the items.", "The bag drawer lists items and shows Zwischensumme, Versand and Gesamt, its totals following the items, plus a 12px note on the free-shipping threshold."),
])
print('r4 patched')
