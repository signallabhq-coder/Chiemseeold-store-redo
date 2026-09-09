# builder patch for round 6 (kept for the record)
import pathlib, json, re
ROOT = pathlib.Path(__file__).resolve().parents[1]
def patch(rel, pairs):
    p = ROOT / rel; s = p.read_text(encoding='utf-8')
    for old, new in pairs:
        assert old in s, (rel, old[:70]); s = s.replace(old, new)
    p.write_text(s, encoding='utf-8')

# A. catalogue: kids only from category or title; shot class per variant
patch('tools/build-catalog.py', [
 ('    if "kinder" in cats or re.search(r"mädchen|jungen|kids|kinder", text): return "kinder"', '    if "kinder" in cats or re.search(r"mädchen|jungen|kids|kinder", v["title"].lower()): return "kinder"'),
 ('raw = json.load(open(SRC, encoding="utf-8"))', 'raw = json.load(open(SRC, encoding="utf-8"))\nSHOTS = json.load(open(pathlib.Path(__file__).with_name("shots.json"), encoding="utf-8")) if pathlib.Path(__file__).with_name("shots.json").exists() else {}'),
 ('            "sizes": sizes, "images": [local(u, st) for u in v["images"][:4]],', '            "sizes": sizes, "images": [local(u, st) for u in v["images"][:4]],\n            "shot": SHOTS.get(local(v["images"][0], st), "body") if v["images"] else "body",'),
])
# B. tile default: reduced colourway, else a head-visible shot
patch('src/js/tile.js', [("  const v = variant || p.variants.find((x) => x.oldPrice) || p.variants[0];", "  const v = variant || p.variants.find((x) => x.oldPrice) || p.variants.find((x) => x.shot === 'face') || p.variants[0];")])
# C. shop: sequence by the displayed shot class
patch('src/js/shop.js', [
 ("const cropClass = (p) => (p.gender === 'accessoires' || /Bademode|Taschen|Mützen/.test(p.type) ? 2 : /Hosen/.test(p.type) || /hose|shorts|pants/i.test(p.name) ? 1 : 0);",
  "const shownVariant = (p) => p.variants.find((x) => x.oldPrice) || p.variants.find((x) => x.shot === 'face') || p.variants[0];\nconst cropClass = (p) => ({ face: 0, body: 1, flat: 2 }[shownVariant(p).shot] ?? 1);"),
])
patch('shop.html', [('<div class="muted" data-count aria-live="polite"></div>', '<div data-count aria-live="polite"></div>')])
# D. chrome: ink for breadcrumb/intro, air above the grid, drawer rows, mobile rhythm
patch('src/styles/chrome.css', [
 (".crumbs { display: flex; gap: 8px; padding: 14px var(--pad) 0; color: var(--ink-2); }", ".crumbs { display: flex; gap: 8px; padding: 24px var(--pad) 0; color: var(--ink); }"),
 (".page-head { padding: 36px var(--pad) 8px; max-width: 820px; }", ".page-head { padding: 56px var(--pad) 16px; max-width: 820px; }"),
 (".page-head p { color: var(--ink-2); }", ".page-head p { color: var(--ink); }"),
 ("display: grid; grid-template-rows: auto auto auto; align-content: start;", "display: grid; grid-template-rows: auto 1fr auto;"),
 (".sheet-body { overflow: auto; padding: 8px var(--pad); max-height: calc(100vh - 56px - 240px); }\n.sheet-menu .sheet-body, .sheet-left .sheet-body { max-height: none; }\n.sheet-left { grid-template-rows: auto 1fr auto; }", ".sheet-body { overflow: auto; padding: 8px var(--pad); }"),
 (".row-sec { padding-top: 72px; }", ".row-sec { padding-top: 72px; }\n@media (max-width: 760px) { .row-sec { padding-top: 48px; } }"),
])
patch('src/styles/shop.css', [
 (".subnav { display: flex; flex-wrap: wrap; gap: 4px 24px; padding: 20px var(--pad) 0; }", ".subnav { display: flex; flex-wrap: wrap; gap: 4px 24px; padding: 28px var(--pad) 0; }"),
 (".toolbar { display: flex; justify-content: space-between; align-items: center; gap: 12px; padding: 32px var(--pad) 24px; }", ".toolbar { display: flex; justify-content: space-between; align-items: center; gap: 12px; padding: 40px var(--pad) 32px; }"),
])
# E. PDP: hint lives in the gap, shipping line removed
patch('src/styles/product.css', [
 (".pdp-sizes { display: grid; gap: 10px; }", ".pdp-sizes { display: grid; gap: 10px; position: relative; }"),
 (".hint { color: var(--ink); text-transform: none; letter-spacing: 0; visibility: hidden; min-height: 16px; }", ".hint { color: var(--ink); text-transform: none; letter-spacing: 0; visibility: hidden; position: absolute; left: 0; right: 0; bottom: -22px; text-align: left; }"),
 (".pdp-ship { margin-top: -8px; }\n", ""),
])
patch('product.html', [('          <p class="t-s muted pdp-ship">Kostenloser Versand ab 80 €. 30 Tage Rückgabe.</p>\n', '')])
# F. home: studio triptych with ink captions, sharpened hero plate, phone rhythm
cat = json.load(open(ROOT / 'public/data/catalog.json', encoding='utf-8'))['products']
shots = json.load(open(ROOT / 'tools/shots.json'))
def pick(pid):
    p = next(x for x in cat if x['id'] == pid)
    v = next((x for x in p['variants'] if shots.get(x['images'][0]) == 'face'), p['variants'][0])
    return v['images'][0]
damen, herren, kinder = pick('3326318'), pick('3326251'), pick('00014307')
patch('index.html', [
 ('<link rel="preload" href="/assets/campaign/heritage-windsurfer.jpg" as="image">', '<link rel="preload" href="/assets/campaign/hero-windsurfer-2880.jpg" as="image">'),
 ('<img class="hero-img" src="/assets/campaign/heritage-windsurfer.jpg" alt="Windsurfer springt mit pinkem Segel durch die Gischt einer Welle" width="1920" height="1300" fetchpriority="high">', '<img class="hero-img" src="/assets/campaign/hero-windsurfer-2880.jpg" alt="Windsurfer springt mit pinkem Segel durch die Gischt einer Welle" width="2880" height="1950" fetchpriority="high">'),
 ('<a class="entry" href="/shop.html?cat=damen"><img src="/assets/campaign/entry-damen.jpg" alt="" style="object-position:40% 0%" width="1110" height="920"><span class="t-m upper">Damen</span></a>', f'<a class="entry" href="/shop.html?cat=damen"><span class="entry-media"><img src="{damen}" alt="" width="1200" height="1714"></span><span class="t-m upper">Damen</span></a>'),
 ('<a class="entry" href="/shop.html?cat=herren"><img src="/assets/campaign/entry-herren.jpg" alt="" style="object-position:55% 20%" width="1130" height="920"><span class="t-m upper">Herren</span></a>', f'<a class="entry" href="/shop.html?cat=herren"><span class="entry-media"><img src="{herren}" alt="" width="1200" height="1714"></span><span class="t-m upper">Herren</span></a>'),
 ('<a class="entry" href="/shop.html?cat=kinder"><img src="/assets/products/3326237/chiemsee-3326237-18-4718-c.jpg" alt="" style="object-position:50% 15%" width="1200" height="1714"><span class="t-m upper">Kinder</span></a>', f'<a class="entry" href="/shop.html?cat=kinder"><span class="entry-media"><img src="{kinder}" alt="" width="1200" height="1714"></span><span class="t-m upper">Kinder</span></a>'),
])
patch('src/styles/home.css', [
 (".entry { position: relative; aspect-ratio: 4 / 5; overflow: hidden; background: var(--ground); display: block; }\n.entry img { width: 100%; height: 100%; object-fit: cover; transition: opacity var(--slow) var(--ease); }\n.entry span { position: absolute; left: 0; right: 0; bottom: 24px; text-align: center; color: var(--paper); z-index: 1; }\n.entry::after { content: \"\"; position: absolute; inset: auto 0 0 0; height: 40%; background: linear-gradient(to top, rgba(11,22,32,.45), rgba(11,22,32,0)); pointer-events: none; }\n.entry:hover img { opacity: .92; }\n@media (max-width: 760px) { .entries { grid-template-columns: 1fr; } .entry { aspect-ratio: 4 / 3; } }",
  ".entry { display: block; background: var(--paper); }\n.entry-media { display: block; aspect-ratio: 3 / 4; overflow: hidden; background: var(--ground); }\n.entry-media img { width: 100%; height: 100%; object-fit: cover; object-position: 50% 12%; transition: opacity var(--slow) var(--ease); }\n.entry > span.upper { display: block; height: 56px; line-height: 56px; text-align: center; color: var(--ink); }\n.entry:hover .entry-media img { opacity: .92; }\n.entry:hover > span.upper { text-decoration: underline; text-underline-offset: 3px; }\n@media (max-width: 760px) { .entries { grid-template-columns: repeat(3, 1fr); } .entry > span.upper { height: 44px; line-height: 44px; } }"),
 ("@media (max-width: 760px) { .band img { object-position: 68% 30%; } .band-copy { max-width: 70%; } .band-copy h2 { text-wrap: balance; max-width: 10ch; } }", "@media (max-width: 760px) { .band { margin-top: 48px; } .band img { object-position: 0% 30%; } .band-copy { max-width: 70%; } .band-copy h2 { text-wrap: balance; max-width: 10ch; } }"),
])
# G. confirmation: the one filled bar
patch('confirmation.html', [('<a class="btn btn-line" href="/shop.html">Weiter einkaufen</a>', '<a class="btn btn-fill" href="/shop.html">Weiter einkaufen</a>')])
# H. design system
patch('design-system.md', [
 ("| `--ink-2` | rgba(11,22,32,.65) | secondary text (item count, breadcrumb, footer legal, strike-through old price). 65% is the AA floor; never lighter |",
  "| `--ink-2` | rgba(11,22,32,.65) | secondary text only where the bar uses grey: struck old price, footer legal, form helpers, swatch and filter counts, close buttons. Breadcrumb, intro lines and the item count are ink. 65% is the AA floor; never lighter |"),
 ("  starts between 40% and 50% down a 900px viewport (y 360 to 450px): generous air above the grid, as the bar (bar 5).\n  Default order groups tiles by crop class (on-model tops, then trousers, then flat-lays) so each row reads as one line.",
  "  starts between 40% and 55% down a 900px viewport (y 360 to 495px): generous air above the grid, as the bar (bar 5).\n  Default order groups tiles by the shot class of the displayed photo (head visible, then headless on-model, then\n  flat-lays) so each row reads as one line; a product's displayed colourway is the reduced one, else one shot with the head visible."),
 ("  the hint line below them always reserves its height so nothing moves when it appears · ONE filled ink bar",
  "  the 12px hint sits inside the gap beneath the boxes so nothing moves when it appears · ONE filled ink bar"),
 ("  \"Versand & Retoure\" · a 12px ink-2 line \"Kostenloser Versand ab 80 €. 30 Tage Rückgabe.\" Below both columns: one",
  "  \"Versand & Retoure\" (shipping and returns live in that row, no extra reassurance line). Below both columns: one"),
 ("  the hero statement, one outline button. Nothing else over the hero → three entry tiles Damen / Herren / Kinder\n  (photo + 15px label, zero gutters, a bottom scrim under the label) → \"Neu\" product row (ONE grid row, tile",
  "  the hero statement, one outline button. Nothing else over the hero → three entry tiles Damen / Herren / Kinder\n  (studio product shots on `--ground`, 3:4, zero gutters, a 15px uppercase ink caption below the image, the same idiom\n  as the product tiles) → \"Neu\" product row (ONE grid row, tile"),
 ("- Product tiles and PDP: Chiemsee's own product photography (scraped, `chiemsee-<style>-<colour>-a..f.jpg`). \"a\" is the\n  tile image, \"b\" the hover image, all on the PDP stack. All grounds are the studio grey; the tile frame is `--ground`\n  so the seam between photo and frame is invisible.",
  "- Product tiles and PDP: Chiemsee's own product photography (scraped, `chiemsee-<style>-<colour>-a..f.jpg`). \"a\" is the\n  tile image, \"b\" the hover image, all on the PDP stack. All grounds are the studio grey: flat-lay shots that Chiemsee\n  photographed on white are re-grounded to `--ground` in the build (tools/normalize-grounds.py), so the seam between\n  photo and frame is invisible on every tile."),
])
print('r6 patched', damen, herren, kinder)
