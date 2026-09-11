# Chiemsee Store

A working front-end storefront for **Chiemsee's current range**, in German, built as the quiet sibling of the
Chiemsee × Join the Ride relaunch site. Same brand, two shops: JTR sells the new capsule, this one sells what
Chiemsee sells today, in a modern, restrained shell.

The design bar is **Arket**: Acne-grade restraint at Chiemsee's price points (tee €24.95, sweater €49.95,
fleece €69.95 to €89.95, ski jacket €219.95). The measured teardown of that bar is in [`bar.md`](bar.md);
the rules the build obeys are in [`design-system.md`](design-system.md).

> **Prototype.** Everything runs in the browser. There is no backend, no payment and no order processing:
> the bag, the wishlist and the order live in `localStorage` / `sessionStorage`. The checkout collects an
> address but never card details, and the confirmation says so on the page.

## Run it

```bash
npm install
npm run dev        # http://localhost:5191
```

```bash
npm run build      # -> dist/
npm run preview    # serves the built site
```

Node 20+ and npm. No external requests at runtime: fonts, images and data are all local, so it works behind a
school or office firewall.

## Deploy

`npm run build` produces a fully static `dist/`. Every path it emits is relative (`base: './'`), so the same
build works at a domain root **and** inside a subfolder.

**The site is live at https://signallabhq-coder.github.io/Chiemseeold-store-redo/** and updates itself.
`.github/workflows/deploy-pages.yml` builds on every push to `main` and copies `dist/` onto the `gh-pages`
branch, which is what Pages serves (Settings -> Pages -> Deploy from a branch: `gh-pages` / root). It commits
only when the build actually changed, and it reuses the published branch's history so each deploy uploads a
diff rather than the whole 127 MB of imagery.

Any other static host works too, with build command `npm run build` and output directory `dist` (the sibling
JTR site runs on Cloudflare Pages).

## What's in it

| Page | File | What it does |
|---|---|---|
| Home | `index.html` | Hero, three category entries, new arrivals, season band, sale row |
| Category | `shop.html?cat=damen\|herren\|kinder\|accessoires\|sale` | Grid, sub-type strip, filter drawer, sort, hover second photo |
| Product | `product.html?id=<style>&c=<colour>` | Image stack, colour switch, size gate, add to bag, related products |
| Bag | `bag.html` | Line items, quantity, remove, shipping rule, totals |
| Checkout | `checkout.html` | Address, shipping, payment choice, inline validation, order summary |
| Confirmation | `confirmation.html` | Order number, items, totals, prototype notice |
| Wishlist | `wishlist.html` | Hearted products |
| About | `ueber-chiemsee.html` | Brand page, since 1982 |

## The opening frame

The home page opens on a replica of **chiemsee.com as it stands today** — the real hero, nav, promo tiles and
autumn band, in Nunito Sans at the site's own colours. It holds for five seconds behind a countdown, then a
six-column wipe hands over to this store.

The hand-over is an overlay teardown, not a navigation: the store is mounted underneath from the first frame,
so there is no page that can fail to load. Three independent paths end it — the animation finishing, a hard
watchdog timer, or the viewer pressing Esc or "Direkt zum Shop" — and all three run the same idempotent
teardown, so it cannot strand anyone on the old shop. It plays once per browser session; `?intro=1` replays it
and `?intro=0` skips it.

Search is a full-page overlay available on every page (the "Suche" link, or the `/` key). It is typo-tolerant:
"hodie" finds the hoodies.

Deep links work and survive back/forward: filters, sort and the chosen colourway all live in the URL.

Shipping rule: free from €80, otherwise €4.95.

## Structure

```
index.html …            8 pages, one per route
src/styles/             tokens.css (the design tokens) + chrome, home, shop, product, commerce
src/js/                 store.js (catalogue, bag, wishlist, header/footer, sheets)
                        tile.js (the one product-tile component) · shop.js · product.js
                        search.js · bag-page.js · checkout.js · home.js
public/data/            catalog.json — 63 styles, 161 colourways
public/assets/products/ product photography, 1200px + 480px thumbs
public/assets/campaign/ campaign and heritage imagery
public/fonts/           Hanken Grotesk, vendored woff2
tools/                  the data and image pipeline, plus render and smoke tooling
design-system.md        the rulebook
bar.md                  the measured Arket teardown
HANDOFF.md              full context for picking this up cold
```

## Data pipeline

The catalogue is Chiemsee's real range, scraped from chiemsee.com: names, prices, sale prices, colourways,
sizes, materials, descriptions and photography. Four scripts turn the raw scrape into what the site serves:

```bash
py tools/process-images.py <masters dir>   # resize to 1200px + 480px thumbs
py tools/classify-shots.py                 # tag each photo: face / back / body / flat (OpenCV)
py tools/sample-swatches.py                # sample the real garment colour per colourway
py tools/normalize-grounds.py              # re-ground white flat-lays onto the studio grey
py tools/build-catalog.py <scrape.json>    # -> public/data/catalog.json
```

Why the shot classes matter: Chiemsee shoots some products on a model, some as flat-lays, some from behind.
The grid's default order ("Empfohlen") groups tiles by shot class so every row reads as one line instead of a
jumble. That single move is what let the grid beat Arket in the blind comparison.

## Testing

```bash
npm run build
npx vite preview --port 5192 --strictPort   # in one shell
node tools/smoke.mjs http://localhost:5192  # in another
```

`tools/smoke.mjs` drives the **built** site: every page loads without a console error or failed request, and
the buy flow runs end to end (size gate blocks, add to bag, totals with shipping, empty checkout blocked with
inline errors, filled checkout to a confirmation with an order number, bag cleared). It also checks the sale
view shows only reduced items and that the phone layout does not scroll sideways. 19 checks, all green.

`tools/shoot-flows.mjs <outdir>` re-shoots the 25 interaction screenshots the design critics judge.

## How it was built

Via the design-loop method: split into four pieces, and for each piece a builder followed by three
fresh-context critics judging the rendered output only, never the code.

- **Brief critic** — does it do the job for a shopper?
- **System critic** — does it obey `design-system.md`, rule by rule?
- **Craft critic** — blind A/B against Arket; ours has to win.

Eleven rounds. Three of the four pieces passed all three critics: the **product page** (round 8), the
**category grid** (round 9, having beaten Arket in the blind comparison four rounds running) and the
**commerce flow** (rounds 9 and 11). The **home page** passes Brief and System; its Craft critic is still
open on head air in the large photo tiles, which comes from the source photography framing heads at the very
top of the frame. `HANDOFF.md` names the next lever.

Real defects the loop caught: flat-lays shot on white while models were shot on grey, a men's ski trouser
filed under kids, a drawer scrim lost to a timing race, a clipped toolbar on phones, and a top-level `await`
that the dev server tolerated but the production build rejected.

## Notes

Product imagery, product copy and the Chiemsee marks belong to Chiemsee. This repository is internal work for
the brand, not a public distribution of those assets.
