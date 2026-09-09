# builder patch for round 5 (kept for the record)
import pathlib, re
ROOT = pathlib.Path(__file__).resolve().parents[1]
def patch(rel, pairs):
    p = ROOT / rel; s = p.read_text(encoding='utf-8')
    for old, new in pairs:
        assert old in s, (rel, old[:70]); s = s.replace(old, new)
    p.write_text(s, encoding='utf-8')

# tile: default to the reduced colourway so a product never shows two prices across pages
patch('src/js/tile.js', [("  const v = variant || p.variants[0];", "  const v = variant || p.variants.find((x) => x.oldPrice) || p.variants[0];")])

# home: kids entry photo, damen crop, band scrim, phone rows of four, phone band copy
patch('index.html', [
 ('<img src="/assets/campaign/entry-damen.jpg" alt="" style="object-position:40% 30%" width="1110" height="920">', '<img src="/assets/campaign/entry-damen.jpg" alt="" style="object-position:40% 0%" width="1110" height="920">'),
 ('<img src="/assets/campaign/cat-kids.webp" alt="" style="object-position:50% 50%" width="1280" height="400">', '<img src="/assets/products/3326237/chiemsee-3326237-18-4718-c.jpg" alt="" style="object-position:50% 15%" width="1200" height="1714">'),
])
patch('src/styles/home.css', [
 (".band::after { content: \"\"; position: absolute; inset: 0; background: linear-gradient(to top, rgba(11,22,32,.5) 0%, rgba(11,22,32,0) 50%); pointer-events: none; }",
  ".band::after { content: \"\"; position: absolute; inset: 0; background: linear-gradient(to top, rgba(11,22,32,.66) 0%, rgba(11,22,32,.3) 40%, rgba(11,22,32,0) 65%), radial-gradient(ellipse 55% 70% at 15% 95%, rgba(11,22,32,.5), rgba(11,22,32,0) 70%); pointer-events: none; }"),
 ("@media (max-width: 760px) { .band img { object-position: 62% 30%; } .band-copy { max-width: 60%; } }", "@media (max-width: 760px) { .band img { object-position: 68% 30%; } .band-copy { max-width: 70%; } .band-copy h2 { text-wrap: balance; max-width: 10ch; } }"),
])
patch('src/js/home.js', [("const cols = () => (innerWidth > 1200 ? 4 : innerWidth > 760 ? 3 : 2);", "const cols = () => (innerWidth > 1200 || innerWidth <= 760 ? 4 : 3);")])

# grid: crop-class sequencing, chips inside the toolbar, more air above the grid
s = (ROOT / 'src/js/shop.js').read_text(encoding='utf-8')
assert "const sorters = {" in s or "sort" in s
s = s.replace("const sizeRank = ", "// crop class keeps rows reading as one line: 0 = on-model tops/jackets (head visible), 1 = trousers/shorts (headless crops), 2 = flat-lays (accessories, swimwear)\nconst cropClass = (p) => (p.gender === 'accessoires' || /Bademode|Taschen|Mützen/.test(p.type) ? 2 : /Hosen/.test(p.type) || /hose|shorts|pants/i.test(p.name) ? 1 : 0);\nconst sizeRank = ", 1)
(ROOT / 'src/js/shop.js').write_text(s, encoding='utf-8')
m = re.search(r"\n(\s*)(list\.sort\(.*?\);)", s)
assert m, 'sort call not found'
print('sort line:', m.group(2)[:120])
