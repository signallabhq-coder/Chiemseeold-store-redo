# bar.md — Arket (men's new arrivals grid + PDP + home), measured 2026-09-09

Bar: https://www.arket.com/en_eur/men/new-arrivals.html (grid), /en-eu/product/relaxed-poplin-shirt-blue-1330593007/ (PDP), /en_eur/index.html (home).
Why Arket: Acne's restraint at Chiemsee's price points (tee €19 to €49, knits €69 to €79, outerwear €129 to €249). Chiemsee today: tee €24.95, sweater €49.95, fleece €69.95 to €89.95, ski jacket €219.95.
Reference renders: renders/bar/arket-grid.png (first screen, 1440×900 DPR2), arket-grid-s1.png (scrolled 900px), arket-grid-full-1/2/4.png (full-page chunks). PDP and home were measured live through the browser pane (computed styles); Akamai blocks headless capture of those two URLs, so no PDP/home render file exists yet.
Every line below is measured from computed styles or pixel-measured from the renders. A critic can check each by looking.

1. **One family, one weight, three sizes.** Everything is the same grotesk at weight 400: nav, tile names, prices, PDP title, buttons, footer. No bold anywhere, no italics. Three sizes carry the whole site: 12px (badges, breadcrumb, "New"), 16px (all chrome, tile name + price, body, PDP accordion rows), 24 to 28px (page heading, PDP title + price). Nothing in between, nothing larger except the wordmark logotype.

2. **Black on white, and the only colour is the product.** Text rgb(0,0,0) on white. Chrome carries zero accent colour: buttons are black fills with white text; hairlines are black at 1px. The single exception is a 12px "NEW" chip (blue text on a pale yellow square) in the corner of a tile. Colour swatches under each tile are 10px squares. Everything else that is coloured is a garment or a photograph.

3. **Four columns, 1px gutters, 3:4 tiles, one 2×2 breaker.** At 1440px: tiles are 357×476 (image only), at x = 0 / 358 / 716 / 1077, a 1px white seam between them, zero page margin. One editorial 2×2 tile (718×1078) interrupts the rhythm about once per screen; it sits on a coloured backdrop (sea blue, dusty pink, sky) while every product tile sits on the same light-grey studio ground. Captions live below the image, centred: NAME in uppercase 16px, price on the next line, swatch row on a third.

4. **One crop, one ground, so a row reads as a line.** Every product shot is on-model, head to hip or head to knee, model centred, same light-grey seamless (about rgb(240,240,240)), same lighting. Consistency of crop is what makes the grid look designed instead of merchandised. The 2×2 editorial tiles are the only tight crops (face, hands, fabric).

5. **Quiet chrome, generous air above the grid.** Sticky white header of 120px total: 40px wordmark left, a grey search field centre, three line icons right, then a nav row of four 16px words; a single hairline closes it. Below: 12px uppercase breadcrumb, a 28px heading, two lines of 16px intro, a small black pill, then the filter row (two hairline-boxed buttons + item count). The first product image starts at y ≈ 490px on a 900px viewport, so more than half of the first screen is white space and type.

6. **PDP: pictures left, a centred column of decisions right, exactly one black bar.** Thumbnail rail (small) + one large 3:4 image stack fill the left ~55%; the right column is centred text: title and price at 24px uppercase, a swatch + "Blue +5" line, size boxes 56×42 with a 1px hairline (selected = solid hairline, others invisible until hover), then ONE black "Add to bag" bar 360×49 at 22px, then hairline accordion rows in uppercase 16px ("Materials and suppliers", "Product details") with chevrons. No reviews block, no badges, no urgency copy. Header stays sticky over the page.

7. **Motion is measured in fractions of a second and never moves anything.** Transition durations on the page: 0.15s, 0.3s, 0.4s, all colour/opacity. Hover swaps the tile image; nothing scales, nothing slides, nothing bounces. Corners are 2px (visually square); one element on the whole page has a shadow.

## How this applies to our pieces
- **Category grid + PDP** are judged against 1 to 7 directly.
- **Home** is judged against 1, 2, 5, 7 plus the spirit of Arket's home: a full-bleed photographic hero (one frame, no collage) with one large regular-weight statement in white (Arket sets it at roughly 56px on a 1440 viewport, two short lines) and a 16px subline, nothing else on the image; then blocks that are photographs first and words second. Our surfing/boardsports vibe is allowed to be louder in the photography (colour, water, movement); the chrome around it stays as quiet as Arket's.
- **Bag / checkout / search** are judged against 1, 2, 5, 7: same type scale, black bars only, hairlines, no decoration.
- **Recalibration rule (from the JTR run):** a brand-mandated Chiemsee trait (the jumper mark, the sea-blue accent, the German-language catalogue) is not a craft deficiency against Arket. Judge execution within the sanctioned idiom.
