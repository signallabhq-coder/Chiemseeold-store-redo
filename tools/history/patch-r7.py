# builder patch for round 7 (kept for the record)
import pathlib, json
ROOT = pathlib.Path(__file__).resolve().parents[1]
def patch(rel, pairs):
    p = ROOT / rel; s = p.read_text(encoding='utf-8')
    for old, new in pairs:
        assert old in s, (rel, old[:70]); s = s.replace(old, new)
    p.write_text(s, encoding='utf-8')

# 1. shot classes: four classes with hand overrides for the displayed variants (from the contact sheets)
cat = json.load(open(ROOT / 'public/data/catalog.json', encoding='utf-8'))['products']
shots = json.load(open(ROOT / 'tools/shots.json'))
def shown(p): return next((v for v in p['variants'] if v['oldPrice']), None) or next((v for v in p['variants'] if v['shot'] == 'face'), None) or p['variants'][0]
OVER = {'back': ['3326268', '3326307', '3326253', '3326222', '3326308', '3326221', '3326227', '00011329', '2061107', '00015809', '00017381', '00017352'],
        'body': ['3326237', '3326271', '3326277', '3326118', '3326281', '3326140', '00017360', '00017384', '00014224'],
        'face': ['3326233']}
for cls, ids in OVER.items():
    for pid in ids:
        p = next(x for x in cat if x['id'] == pid); shots[shown(p)['images'][0]] = cls
json.dump(shots, open(ROOT / 'tools/shots.json', 'w'), indent=0)
patch('src/js/shop.js', [("const cropClass = (p) => ({ face: 0, body: 1, flat: 2 }[shownVariant(p).shot] ?? 1);", "const cropClass = (p) => ({ face: 0, back: 1, body: 2, flat: 3 }[shownVariant(p).shot] ?? 2);"),
 ("  const sorters = { new: (a, b) => (Number(b.isNew) - Number(a.isNew)) || (cropClass(a) - cropClass(b)) || (b.price - a.price), 'price-asc'",
  "  const sorters = { new: (a, b) => (cropClass(a) - cropClass(b)) || (Number(b.isNew) - Number(a.isNew)) || (b.price - a.price), newest: (a, b) => (Number(b.isNew) - Number(a.isNew)) || (b.price - a.price), 'price-asc'")])
patch('shop.html', [('<option value="new">Sortieren: Neu</option>', '<option value="new">Sortieren: Empfohlen</option>\n            <option value="newest">Sortieren: Neu</option>')])
# 2. heads never cut: no top crop on tiles, entries, PDP stack
patch('src/styles/chrome.css', [(".tile-media img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; object-position: 50% 12%; }", ".tile-media img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; object-position: 50% 0%; }")])
patch('src/styles/home.css', [(".entry-media img { width: 100%; height: 100%; object-fit: cover; object-position: 50% 12%;", ".entry-media img { width: 100%; height: 100%; object-fit: cover; object-position: 50% 0%;")])
patch('src/styles/product.css', [(".pdp-media img { width: 100%; height: 100%; object-fit: cover; object-position: 50% 10%; }", ".pdp-media img { width: 100%; height: 100%; object-fit: cover; object-position: 50% 0%; }")])
# 3. sheets: scrim race, head aligned with the site header hairline
patch('src/js/store.js', [
 ("let lastFocus;\nexport function openSheet(name) {", "let lastFocus; const pending = [];\nexport function openSheet(name) {\n  while (pending.length) clearTimeout(pending.pop());"),
 ("  document.querySelectorAll('.sheet.is-on').forEach((el) => { el.classList.remove('is-on'); setTimeout(() => (el.hidden = true), 260); });\n  const scrim = document.querySelector('.scrim'); if (scrim) { scrim.classList.remove('is-on'); setTimeout(() => (scrim.hidden = true), 260); }",
  "  document.querySelectorAll('.sheet.is-on').forEach((el) => { el.classList.remove('is-on'); pending.push(setTimeout(() => (el.hidden = true), 260)); });\n  const scrim = document.querySelector('.scrim'); if (scrim) { scrim.classList.remove('is-on'); pending.push(setTimeout(() => (scrim.hidden = true), 260)); }"),
 ("        <div class=\"muted\">${esc(i.color)}${i.size && i.size !== 'Einheitsgröße' ? ` · Größe ${esc(i.size)}` : ''}</div>", "        <div>${esc(i.color)}${i.size && i.size !== 'Einheitsgröße' ? ` · Größe ${esc(i.size)}` : ''}</div>"),
])
patch('src/js/bag-page.js', [("        <div class=\"muted\">${esc(i.color)}${i.size && i.size !== 'Einheitsgröße' ? ` · Größe ${esc(i.size)}` : ''}</div>", "        <div>${esc(i.color)}${i.size && i.size !== 'Einheitsgröße' ? ` · Größe ${esc(i.size)}` : ''}</div>")])
patch('src/styles/chrome.css', [
 (".sheet-head { display: flex; justify-content: space-between; align-items: center; height: var(--header-h); padding: 0 var(--pad); border-bottom: 1px solid var(--line); }", ".sheet-head { display: flex; justify-content: space-between; align-items: center; height: var(--chrome-h); padding: 0 var(--pad); border-bottom: 1px solid var(--line); }"),
 (".search-grid { padding-bottom: 80px; }", ".search-grid { padding-bottom: 80px; }\n.search-grid:empty { display: none; }"),
])
# 4. PDP: colour name in ink, hint spacing, related air
patch('src/js/product.js', [("  $('[data-color]').textContent = `${v.color}${p.variants.length > 1 ? ` · ${p.variants.length} Farben` : ''}`;", "  $('[data-color]').innerHTML = `${esc(v.color)}${p.variants.length > 1 ? ` <span class=\"muted\">· ${p.variants.length} Farben</span>` : ''}`;")])
patch('product.html', [('<p class="t-m muted" data-color></p>', '<p class="t-m" data-color></p>')])
patch('src/styles/product.css', [
 (".pdp-sizes { display: grid; gap: 10px; position: relative; }", ".pdp-sizes { display: grid; gap: 10px; position: relative; margin-bottom: 12px; }"),
 ("visibility: hidden; position: absolute; left: 0; right: 0; bottom: -22px; text-align: left; }", "visibility: hidden; position: absolute; left: 0; right: 0; bottom: -30px; text-align: left; }"),
 (".related { padding-top: 72px; }", ".related { padding-top: 96px; }"),
 ("  .related { padding-top: 56px; }", "  .related { padding-top: 56px; }\n  .related .row-head { padding-bottom: 20px; }"),
])
# 5. commerce: confirmation seams + full bar, bag page column tops, error copy sentence case
patch('src/styles/commerce.css', [
 (".confirm .btn { justify-self: start; margin-top: 12px; }", ".confirm .btn { justify-self: stretch; margin-top: 12px; }\n.confirm .summary { border-top: 0; padding-top: 0; }\n.confirm .mini-lines { padding-bottom: 14px; }"),
 (".lines .line { grid-template-columns: 120px 1fr; }", ".lines .line { grid-template-columns: 120px 1fr; }\n.lines .line:first-child { border-top: 1px solid var(--line); }"),
])
patch('src/styles/tokens.css', [(".field .hint.err { color: var(--ink); }", ".field .hint.err { color: var(--ink); text-transform: none; letter-spacing: 0; }")])
# 6. design system
patch('design-system.md', [
 ("  Default order groups tiles by the shot class of the displayed photo (head visible, then headless on-model, then\n  flat-lays) so each row reads as one line; a product's displayed colourway is the reduced one, else one shot with the head visible.",
  "  Default order (\"Empfohlen\") groups tiles by the shot class of the displayed photo (front with face, then back views with\n  the head visible, then headless crops, then flat-lays), newest first inside each group, so each row reads as one line;\n  \"Neu\" is an explicit sort. A product's displayed colourway is the reduced one, else one shot with the head visible."),
 ("  centred, max-width 420px: title (28px uppercase) · price line · colour row (swatches linking to the sister\n  colourways + colour name in 15px) ·", "  centred, max-width 420px: title (28px uppercase) · price line · colour row (swatches linking to the sister\n  colourways + colour name in 15px ink, the colour count in ink-2) · a 12px row \"Größe\" left / \"Größentabelle\" link right ·"),
 ("hairlines) · Bestellübersicht · \"Jetzt kaufen\" bar → confirmation page. Validation is inline: the field gets an\n  ink border and its helper line turns into a 12px uppercase message in ink; no native browser bubbles.",
  "hairlines) · Bestellübersicht · \"Jetzt kaufen\" bar → confirmation page. Validation is inline: the field gets an\n  ink border and its helper line turns into a 12px sentence-case message in ink; no native browser bubbles.\n  Sheets (bag, menu, filter) carry a head as tall as the site chrome (89px) so their hairline meets the header's."),
 ("| `--ink-2` | rgba(11,22,32,.65) | secondary text only where the bar uses grey: struck old price, footer legal, form helpers, swatch and filter counts, close buttons.",
  "| `--ink-2` | rgba(11,22,32,.65) | secondary text only where the bar uses grey: struck old price, footer legal, form helpers, swatch, colour, heading and filter counts, close buttons."),
])
print('r7 patched')
