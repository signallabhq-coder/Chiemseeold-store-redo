# HANDOFF — Chiemsee Store (current-range shop, sibling of the JTR relaunch site)

_Written 2026-09-09 for a fresh Claude Code session. The JTR relaunch site in `..\site\` is a separate project and was NOT touched._

## What this is
A fully working front-end prototype of a modern, clean shop for Chiemsee's CURRENT range (Chiemsee's own Magento shop at
chiemsee.com is the data source). German UI. Sibling of the Chiemsee × Join the Ride relaunch site; cross-linked via the
top strip and one footer link, otherwise independent. Design bar: **Arket** (measured in `bar.md`), i.e. Acne-grade
restraint at Chiemsee's price points. Rules: `design-system.md` (the System critic judges against it).

## Repository
`https://github.com/signallabhq-coder/Chiemseeold-store-redo` (branch `main`). The working copy here is the origin
clone. `node_modules`, `dist` and `renders/` are gitignored: run `npm ci && npm run build` after a fresh clone, and
re-shoot renders with `tools/shoot-flows.mjs`. Verified 2026-09-10 by cloning fresh, building and passing
`tools/smoke.mjs` (19 checks).

## Run
- Preview tool: `preview_start` name **`chiemsee-store`** (in `~\.claude\.claude\launch.json`, port **5191**, strictPort).
- Shell: `cd chiemsee-store && npm run dev` (Vite, port 5191). Build: `npm run build` → `dist/`.
- **Gotcha:** Vite sometimes serves stale CSS after Python-scripted edits (Windows file watcher). If a CSS change is not
  visible, restart the dev server (`preview_stop` + `preview_start`).

## Pages (static Vite MPA, vanilla JS modules, zero external requests)
`index.html` home · `shop.html?cat=damen|herren|kinder|accessoires|sale` (+ `type`, `size`, `color`, `price`, `sale=1`,
`sort`) · `product.html?id=<style>&c=<colour-slug>` · `bag.html` · `checkout.html` → `confirmation.html` · `wishlist.html`
· `ueber-chiemsee.html`. Search is an overlay on every page (`/` key or "Suche").

## Data
- `public/data/catalog.json` — 63 styles / 161 colourways scraped from chiemsee.com (names, prices, sale prices, sizes,
  material, descriptions, images). Built by `tools/build-catalog.py <scraped catalog.json>` which merges
  `tools/shots.json` (shot class per photo: face / back / body / flat, from `tools/classify-shots.py` + hand overrides in
  `tools/patch-r7.py`), `tools/faces.json` (face size, bust vs full-length) and `tools/swatches.json` (sampled garment colour).
- Images: `public/assets/products/<style>/…jpg` (1200w) + `.thumb.jpg` (480w). Flat-lays that Chiemsee shot on white were
  re-grounded to the studio grey #DEDFE3 (`tools/normalize-grounds.py`) so every tile shares one ground.
- Campaign imagery: `public/assets/campaign/` (Chiemsee's own banners + the real 1990s windsurf still used as the hero).
- Bag / wishlist / order live in localStorage / sessionStorage (`chiemsee-store-*`). No backend, no payment.

## Design loop status (see the progress artifact and `renders/r1..r9`)
- Pieces: A Home · B Category grid · C Product page · D Commerce flow. Three fresh-context critics per piece per round
  (Brief / System / Craft), judging renders only (`tools/shoot-flows.mjs` produces 25 interaction renders per round).
- **C Product page: WON in round 8 (Brief, System, Craft all PASS).**
- Round 8: all four Brief critics PASS; Grid System PASS; Commerce Craft PASS; the grid **beat Arket in the blind A/B**
  three rounds running (R6–R8) while still failing its own bar on caption baselines (fixed in R9 with per-row alignment).
- **B Category grid: WON in round 9** (and beat Arket in the blind A/B in R6 to R9).
- **D Commerce flow: WON across R9/R11** (Brief + Craft R9, System R11 after the rulebook named its grey secondary uses).
- **A Home: Brief + System pass (R9 to R11); Craft still open** on head air in the big photo tiles (source photos have heads
  at the very top of the frame) and the reserved caption line on phones. Next lever: per-image focal points (a `focus` value
  per photo in the catalogue driving `object-position`).
- Renders per round in `renders/r1..r11`; critic briefs are in the session transcript, format: VERDICT / BIGGEST GAP / EVIDENCE.

## Tooling
- `tools/shoot-flows.mjs <outdir>` — the render script (DPR2, forces lazy images to load and decode before capture).
- `tools/shoot.mjs <url> <out.png> --nokill` — single first-screen render (in the scratchpad copy; puppeteer-core in `tools/`).
- `tools/chunk.py` — splits tall renders into 2400px chunks for critics. `tools/patch-r*.py` — the builder passes, kept for the record.

## Known limits / next steps
- Higgsfield had 0.8 credits: no new imagery. The hero is an upscaled 1990s slide; a real 2× plate would help.
- Chiemsee's own photography mixes crops; the grid is sequenced by shot class to compensate.
- Prototype notices are intentional (footer, checkout, confirmation).
