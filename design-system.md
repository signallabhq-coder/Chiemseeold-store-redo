# design-system.md — Chiemsee Store (the current-range shop, sibling of the JTR relaunch site)

Forked 2026-09-09 from `..\site\design-system.md` (JTR relaunch). This shop sells Chiemsee's CURRENT range at
current prices (€9.95 to €399.95), in German, to Chiemsee's existing customer. It runs alongside the JTR site and
never modifies it. The System critic judges rendered output against THIS file only. Bar mechanisms: `bar.md` (Arket).

## 1. Voice and language
- **German.** Product names, categories, chrome and copy are German (the catalogue is chiemsee.com's own data).
  Keep Chiemsee's real product names verbatim ("Comfort-Fit Sherpa Fleeceweste mit Brusttasche"). Do not translate.
- Short declarative lines. Sentence case for prose, uppercase only where the bar uses it (tile names, PDP title,
  accordion rows, breadcrumb, badges).
- **No em/en dashes (— –) anywhere in visible copy** (Carlo, 2026-08-23). Period, comma, parentheses, "bis" for ranges,
  middot (·) for label separators. Compound hyphens stay (Comfort-Fit, T-Shirt, Sherpa-Fleece).
- **No scrolling tagline ticker/marquee.** A single static 12px announcement strip at the very top is allowed (the
  bar has one) and carries at most one sentence + one link.
- No invented slogans in hero positions. Sanctioned hero lines (from the brand deck and Chiemsee's own site):
  "Urlaubsgefühl. Jeden Tag." · "Seit 1982 am Wasser." · "Vom See auf den Berg." · "Good vibes only." ·
  "Boardsport seit 1982." Category intros may be one plain sentence about the range.
- No urgency copy ("Nur noch 2!", countdowns), no review stars, no trust badges. Sale is shown by price only.
- Cross-link to the sibling site is sanctioned exactly twice: the top announcement strip ("Chiemsee × Join the Ride:
  die neue Kollektion" → https://chiemsee-jtr.pages.dev) and one footer link. Nowhere else.

## 2. Colour tokens (CSS custom properties)
| token | value | role |
|---|---|---|
| `--paper` | #FFFFFF | page ground everywhere |
| `--ground` | #DEDFE3 | the product-photo studio ground (Chiemsee shoots on this grey); tile and PDP image backgrounds are this so images dissolve into their frame |
| `--ink` | #0B1620 | all text, all hairlines, the filled CTA, the footer band |
| `--ink-2` | rgba(11,22,32,.65) | secondary text only where the bar uses grey: struck old price, footer legal, form helpers, swatch, colour, heading and filter counts, close and remove controls, form field labels, footer column headings, 12px eyebrows (order number, hero eyebrow on paper), and the secondary descriptor in a radio row (delivery time, payment note). Breadcrumb, intro lines and the item count are ink. 65% is the AA floor; never lighter |
| `--hydro` | #1F6F8F | THE accent (Chiemsee's own colourway "Hydro", lake-teal blue). Exactly two jobs: the reduced price, and the "NEU" chip text. Nothing else. Never a button, never a hover colour, never a background |
| `--chip` | #F3EDCF | the pale square behind a "NEU" chip only |
| `--line` | rgba(11,22,32,.18) | hairlines: header bottom, filter boxes, size boxes, accordion rows, footer top |
- Rule: chrome sees only paper / ink / ink-2 / line. Colour comes from garments and photographs (bar mechanism 2).
- Focus ring: 2px solid ink, offset 2px. (Not hydro; hydro has two jobs.)
- Buttons: filled = ink with paper text; outline = 1px `--line` with ink text. Radius 2px everywhere it exists. No shadows anywhere.

## 3. Typography
- One family: `"Hanken Grotesk", "Helvetica Neue", Helvetica, Arial, sans-serif`, vendored woff2 in /public/fonts.
  No other family, ever. **Weight 400 only, site-wide.** No bold, no italics (bar mechanism 1). The wordmark is the
  one exemption: `CHIEMSEE` set at 22px, weight 500, letter-spacing 0.18em, uppercase, next to the jumper badge.
- Three sizes, nothing else:
  - `--t-s: 12px / 16px`, letter-spacing 0.06em, uppercase: breadcrumb, badges ("NEU", "SALE"), announcement strip,
    swatch counts ("+3"), footer legal, form helper text.
  - `--t-m: 15px / 22px`, letter-spacing 0.01em: ALL chrome. Nav, tile name (uppercase) and price, filters, item
    count, PDP size labels, accordion rows (uppercase), body copy, form fields, buttons, footer links.
  - `--t-l: 28px / 34px`, letter-spacing -0.01em: page heading (category name), PDP title + price (uppercase), section
    headings on home, bag/checkout headings.
  - Home hero statement: `--t-hero: clamp(34px, 3.9vw, 56px) / 1.05`, weight 400, sentence case, paper white on
    photography, one line where the viewport allows. One per page, home only.
- Secondary tone is `--ink-2`, never a third tone. Prices in ink; reduced price in hydro with the old price in ink-2
  struck through, same size, same line.

## 4. Layout
- **Header (identical on all pages):** announcement strip 32px (paper, 12px text, hairline below) → main row 56px:
  nav words left (Damen · Herren · Kinder · Accessoires · Sale), wordmark centred (badge 22px tall + CHIEMSEE), utilities
  right (Suche · Merkliste (n) · Warenkorb (n), counts in parentheses) → 1px hairline. Sticky. Paper ground. 24px side
  padding. Total 89px. The bag drawer lists items and shows Zwischensumme, Versand and Gesamt, its totals following the items, plus a 12px note on the free-shipping threshold.
  On phones (< 900px) the header collapses to: jumper badge left (wordmark text hidden), then Suche · Warenkorb (n) · Menü
  right; the category nav, Merkliste and "Über Chiemsee" live in the Menü sheet, whose rows are set at the 28px size
  (the one place chrome uses --t-l, because the sheet is the phone's whole navigation).
- **Category page:** breadcrumb row (12px, ink-2) → heading block: 28px category name, one 15px intro line, then the
  sub-category strip (15px words, active = underlined 1px) → filter row: [Filter +] [Sortieren ≡] hairline boxes left,
  item count (ink-2) right; active filter chips (hairline, 48px) sit in the same row → the grid. The first tile image
  starts between 40% and 55% down a 900px viewport (y 360 to 495px): generous air above the grid, as the bar (bar 5).
  Default order ("Empfohlen") groups tiles by the shot class of the displayed photo (front with face, then back views with
  the head visible, then headless crops, then flat-lays), newest first inside each group, so each row reads as one line;
  Inside the front-facing group, bust shots come before full-length shots. "Neu" is an explicit sort. A product's
  displayed colourway is the reduced one, else one shot with the head visible. A flat product shot used as an entry tile
  is scaled to roughly the garment mass of the on-model tiles beside it.
- **Grid:** 4 equal columns, **1px paper gutters**, zero page margin, tiles are 3:4 (image area), image fills the
  tile on `--ground`. Caption below the image, centred, on paper, set tight: NAME uppercase 15px (the product name
  without its fit prefix, e.g. "Sherpa Fleeceweste mit Brusttasche"; the full name lives on the PDP; at most two
  lines, three on phones, longer names clip with an ellipsis) · price 15px directly beneath · swatch row (10px squares,
  max 5, then "+n" in 12px). Caption block height 112px (134px on phones), identical on every tile; within one grid row
  every name block takes the tallest name's height, so prices and swatches share one baseline across the row.
  One 2×2 editorial tile (Chiemsee campaign photography, tight crop or landscape, no caption or a 12px caption)
  per two rows at most, never two in one 900px viewport. Breakpoints: 3 columns < 1200px, 2 columns < 760px.
- **PDP:** two columns 55 / 45. On phones the image stack becomes a swipeable single frame with a 12px "n / m" counter beneath it. Left: vertical stack of every image of the colourway at 3:4 on `--ground`, 1px paper
  seams, no thumbnails, no carousel, no zoom cursor. Right: sticky column (top = header height + 24px), content
  centred, max-width 420px: title (28px uppercase) · price line · colour row (swatches linking to the sister
  colourways + colour name in 15px ink, the colour count in ink-2) · a 12px row "Größe" left / "Größentabelle" link right · size boxes 56×42 hairline (selected = 1px ink border), left-aligned, wrapping;
  the 12px hint sits inside the gap beneath the boxes so nothing moves when it appears · ONE filled ink bar
  "In den Warenkorb" 48px tall with a 48×48 hairline heart square (Merkliste) beside it · hairline accordion rows
  (all closed by default) uppercase 15px: "Beschreibung", "Material & Pflege",
  "Versand & Retoure" (shipping and returns live in that row, no extra reassurance line). Below both columns: one
  row of 4 tiles "Passt dazu" (same tile component). No reviews, no badges, no stock counters.
- **Home:** on phones the Neu and Sale rows show four tiles as two rows of two. Full-bleed hero photograph (the heritage windsurf still: real 90s photography, one frame, no collage)
  carrying exactly three things in paper white, bottom-left: a 12px eyebrow ("Chiemsee · Boardsport seit 1982"),
  the hero statement, one outline button. Nothing else over the hero → three entry tiles Damen / Herren / Kinder
  (studio product shots on `--ground`, 3:4, zero gutters, a 15px uppercase ink caption below the image, the same idiom
  as the product tiles; on phones they stack full-width, still 3:4; the entry photos never repeat a product shown in the rows
  below) → "Neu" product row (ONE grid row, tile
  component) → one full-bleed season band (current campaign photograph, one 28px statement + one small outline
  button, bottom-left, scrim) → "Sale" product row (one grid row) → footer. No further sections.
  The hero may be as loud as the photography allows (surf, water, colour); the chrome around it stays paper/ink.
- **Merkliste** uses the category-page layout: heading block, then the tile grid (full width, zero margin).
- **Bag / Checkout / Suche:** single centred column max-width 1080px on paper; line items are
  120×160 image + 15px text (96×128 in the bag drawer); order summaries (checkout sidebar, confirmation) use compact
  rows of 56×75 image + 15px name + 12px meta; totals right-aligned; one filled bar per page (an empty state
  replaces the list, never sits beside it). Checkout = one page: Adresse · Versand · Zahlung (radio rows with
  hairlines) · Bestellübersicht · "Jetzt kaufen" bar → confirmation page. Validation is inline: the field gets an
  ink border and its helper line becomes a 12px sentence-case message in ink; no native browser bubbles.
  Sheets (bag, menu, filter) carry a head as tall as the site chrome (89px) so their hairline meets the header's.
  Search = full-page overlay on paper (not a dropdown) with a 28px input line, popular terms, a "Neu eingetroffen"
  row while the query is empty, and results as the tile component.
- **Footer:** hairline top, paper: four columns of 15px links (Hilfe · Über Chiemsee · Rechtliches · Join the Ride),
  the jumper badge small at left, a 12px ink-2 legal line. No newsletter box, no social icon row larger than 12px.
- Corners 2px max. No shadows. No cards (surfaces are separated by hairlines or by the grid seam, never by boxes).

## 5. Motion
- Chrome and grid: opacity / colour transitions 150 to 400ms ease-in-out only. Tile hover = crossfade to the second
  image (b shot) of that colourway. Nothing moves position, nothing scales, no parallax, no zoom.
- Overlays (search, filter drawer, bag drawer): 240ms opacity fade; the sheet may translate ≤ 12px on entry.
- Home hero may run a slow 8s ease-out scale from 1.04 to 1.00 on load (the sanctioned "film" move). Nothing else animates on home.
- `prefers-reduced-motion`: all transitions collapse to 0.

## 6. Imagery
- Product tiles and PDP: Chiemsee's own product photography (scraped, `chiemsee-<style>-<colour>-a..f.jpg`). "a" is the
  tile image, "b" the hover image, all on the PDP stack. All grounds are the studio grey: flat-lay shots that Chiemsee
  photographed on white are re-grounded to `--ground` in the build (tools/normalize-grounds.py), so the seam between
  photo and frame is invisible on every tile. Serve at 1200px wide (grid) with 600px thumbnails (bag, search).
- Campaign / editorial: Chiemsee's current campaign banners (Fall 2026 Fleece / Troyer / Hoodie), the beach and ski
  category banners, the 40-years windsurf still, the team surf shots. Full-bleed, no filters, no text overlays except
  the sanctioned hero statement and section headings.
- Never: AI-generated imagery for this shop (no credits, and the shop is the real range), stock photos, the JTR
  relaunch collection imagery (that belongs to the sibling site), competitor marks.
- Reserve aspect-ratio on every image (no layout shift); lazy-load below the fold.

## 7. Commerce data and behaviour (this is what "fully functional" means here)
- Catalogue: `public/data/catalog.json`, 63 styles / 161 colourways from chiemsee.com (name, price, old price,
  colour, main colour, sizes, material, description, images, category, type). All pages render from it client-side.
- Category pages: `shop.html?cat=herren|damen|kinder|accessoires|sale` with sub-type strip and hash-free query
  filters (Größe, Farbe, Preis, Typ, "Nur reduzierte Artikel"), sort (Neu, Preis auf/ab). Deep-linkable, back/forward safe.
- PDP: `product.html?id=<style>&c=<colour-slug>`; colour swatches switch variant in place and update the URL.
  Size required before add-to-bag (inline 12px hint "Bitte Größe wählen." in ink, all size boxes switch to ink hairlines). Items without
  size data show "Einheitsgröße" on the PDP and carry no size line in the bag.
- Bag: localStorage key `chiemsee-store-bag`, qty steppers, remove, subtotal, free shipping from €80 else €4.95,
  total. Header count live on every page. Bag drawer opens on add; full page at `bag.html`.
- Merkliste (wishlist): localStorage `chiemsee-store-wishlist`, heart toggle on tiles and PDP, page `wishlist.html`.
- Checkout: `checkout.html` with HTML5 validation (name, address, PLZ 5 digits, email), shipping choice, payment
  method choice (PayPal · Kreditkarte · Klarna · Rechnung as radios, NO card fields, no real payment), order summary,
  then `confirmation.html` with an order number and the items, bag cleared. Clearly a prototype: no server.
- Search: overlay on every page, fuzzy + typo-tolerant, matches name, type, colour, style number; keyboard navigable.
- Sizes: apparel S to 6XL as scraped; kids numeric; accessories "Einheitsgröße"; socks 35-38 etc.
- Everything is static Vite (multi-page), vanilla JS modules, zero external requests (fonts and images local).

## 8. Accessibility and hygiene
- Semantic landmarks (header/nav/main/footer), alt text on every product image ("<name>, <colour>, Ansicht <n>"),
  visible focus (2px ink), all controls reachable by keyboard, filter drawer and search overlay trap focus and close on Esc.
- Contrast: ink on paper AAA; ink-2 at 65% passes AA at 12px; hydro #1F6F8F on paper = 5.3:1 at 15px (AA).
  Paper text over the hero photo must measure ≥ 4.5:1 against the actual pixels: use a bottom scrim
  (rgba(11,22,32,.45) → transparent) when the photo is bright.
- No layout shift: aspect-ratio on all media, header height fixed, fonts preloaded.
- Self-contained: no external fonts/CDNs/analytics (school firewall). Works from `file://` after `vite build`? No:
  served via Vite preview / Cloudflare Pages like the sibling site.
