// shoot-flows.mjs — scripted interaction renders for the critics (DPR2, 1440x900).
// usage: node shoot-flows.mjs <outdir> [base=http://localhost:5191]
import puppeteer from 'puppeteer-core';
import fs from 'node:fs';

const [,, outDir = 'renders/flows', base = 'http://localhost:5191'] = process.argv;
fs.mkdirSync(outDir, { recursive: true });
const browser = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true, args: ['--disable-gpu', '--hide-scrollbars', '--font-render-hinting=none', '--disable-lcd-text'] });
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
page.on('pageerror', (e) => console.error('PAGEERROR', e.message));
page.on('console', (m) => { if (m.type() === 'error' && !/favicon/.test(m.text())) console.error('CONSOLE', m.text()); });
const nudge = async () => { await page.evaluate(async () => { const h = document.documentElement.scrollHeight; for (let y = 0; y < h; y += 600) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 90)); } window.scrollTo(0, 0); }); await page.evaluate(() => document.querySelectorAll('img[loading="lazy"]').forEach((i) => { i.loading = 'eager'; })); await page.evaluate(() => Promise.race([Promise.all([...document.images].filter((i) => !i.complete).map((i) => new Promise((r) => { i.onload = i.onerror = r; }))), new Promise((r) => setTimeout(r, 8000))])); await decodeAll(); await new Promise((r) => setTimeout(r, 800)); };
const decodeAll = () => page.evaluate(() => Promise.race([Promise.all([...document.images].filter((i) => i.complete && i.naturalWidth).map((i) => i.decode().catch(() => {}))), new Promise((r) => setTimeout(r, 5000))]));
const shot = async (name, full = false) => { if (full) await nudge(); else await decodeAll(); await new Promise((r) => setTimeout(r, 600)); await page.screenshot({ path: `${outDir}/${name}.png`, fullPage: full }); console.log('saved', name); };
const go = async (u) => { await page.goto(base + u, { waitUntil: 'networkidle0' }); await new Promise((r) => setTimeout(r, 800)); };
const settle = () => new Promise((r) => setTimeout(r, 500));
// DOM click: puppeteer's coordinate click scrolls targets under the sticky header and hits the nav instead.
const click = (sel) => page.$eval(sel, (el) => el.click());

// Home full page
await go('/index.html'); await page.evaluate(() => document.querySelector('.hero-img').style.animation = 'none'); await shot('home-full', true);
// Shop full + filter drawer + filtered state + sort + hover
await go('/shop.html?cat=herren'); await shot('shop-full', true);
await click('[data-open="filter"]'); await settle(); await shot('shop-filter-open');
await click('input[name="type"][value="Fleece"]'); await click('input[name="size"][value="L"]'); await click('[data-apply]'); await settle(); await shot('shop-filtered');
await go('/shop.html?cat=herren'); await page.hover('.tile:nth-of-type(2) .tile-media'); await new Promise((r) => setTimeout(r, 1500)); await shot('shop-hover');
await go('/shop.html?cat=damen&sort=price-asc'); await shot('shop-damen-sorted');
await go('/shop.html?cat=sale'); await shot('shop-sale', true);
// PDP: colour switch, size validation, add to bag, bag sheet
await go('/product.html?id=3326307&c=hydro'); await shot('pdp-full', true);
await click('[data-add]'); await settle(); await shot('pdp-size-hint');
await click('[data-sizes] button[data-size="L"]'); await click('[data-add]'); await settle(); await shot('pdp-bag-sheet');
await click('.sheet-bag [data-close]'); await settle();
await click('[data-swatches] a:nth-child(2)'); await settle(); await shot('pdp-colour-switched');
await click('[data-sizes] button[data-size="M"]'); await click('[data-add]'); await settle(); await click('.sheet-bag [data-close]'); await settle();
await go('/product.html?id=3326120'); await click('[data-add]'); await settle(); await shot('pdp-accessory-onesize');
// Search
await go('/index.html'); await click('[data-open="search"]'); await settle(); await shot('search-empty');
await page.type('#search-input', 'hodie'); await settle(); await shot('search-typo-hoodie');
// Bag page, checkout, validation, confirmation
await go('/bag.html'); await shot('bag-page', true);
await go('/checkout.html'); await shot('checkout-full', true);
await click('button[type="submit"]'); await settle(); await shot('checkout-invalid');
await page.type('#fn', 'Carlo'); await page.type('#ln', 'Franke'); await page.type('#street', 'Obenhauptstraße 13'); await page.type('#zip', '22335'); await page.type('#city', 'Hamburg'); await page.type('#email', 'test@example.com');
await click('input[name="pay"][value="Klarna"]'); await settle(); await shot('checkout-filled', true);
await Promise.all([page.waitForNavigation({ waitUntil: 'networkidle0' }), click('button[type="submit"]')]); await settle(); await shot('confirmation', true);
// Wishlist + about + mobile
await go('/shop.html?cat=accessoires'); await click('.tile:nth-of-type(1) [data-wish]'); await click('.tile:nth-of-type(3) [data-wish]'); await go('/wishlist.html'); await shot('wishlist');
await go('/ueber-chiemsee.html'); await shot('about-full', true);
await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2 });
await go('/index.html'); await shot('m-home', true);
await go('/shop.html?cat=damen'); await shot('m-shop');
await go('/product.html?id=3326308&c=hydro'); await shot('m-pdp', true);
await click('.hdr-burger'); await settle(); await shot('m-menu');
await browser.close();
