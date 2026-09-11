// smoke.mjs — exercises the BUILT site: every page loads clean, and the buy flow works end to end.
// usage: node tools/smoke.mjs [base=http://localhost:5192]
import puppeteer from 'puppeteer-core';

const base = process.argv[2] || 'http://localhost:5192';
const problems = [];
const browser = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true, args: ['--disable-gpu'] });
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });
let current = '';
page.on('pageerror', (e) => problems.push(`PAGEERROR ${current}: ${e.message}`));
page.on('console', (m) => { if (m.type() === 'error' && !/favicon/i.test(m.text())) problems.push(`CONSOLE ${current}: ${m.text()}`); });
page.on('requestfailed', (r) => { if (!/favicon/i.test(r.url())) problems.push(`REQFAIL ${current}: ${r.url().slice(0, 110)}`); });
page.on('response', (r) => { if (r.status() >= 400 && !/favicon/i.test(r.url())) problems.push(`HTTP ${r.status()} ${current}: ${r.url().slice(0, 110)}`); });

const go = async (path) => { current = path; await page.goto(base + path, { waitUntil: 'networkidle0', timeout: 60000 }); await new Promise((r) => setTimeout(r, 600)); };
const click = (sel) => page.$eval(sel, (el) => el.click());
const text = (sel) => page.$eval(sel, (el) => el.textContent.trim()).catch(() => null);
const check = (ok, label) => { console.log(`${ok ? 'ok  ' : 'FAIL'}  ${label}`); if (!ok) problems.push(`CHECK: ${label}`); };

// wait for the preview server
for (let i = 0; i < 40; i++) {
  try { await page.goto(base + '/index.html', { timeout: 3000 }); break; } catch { await new Promise((r) => setTimeout(r, 1000)); }
}

await go('/index.html?intro=0');
check((await page.$$('[data-row="new"] .tile')).length >= 4, 'home: Neu row has products');
check((await page.$$('[data-row="sale"] .tile')).length >= 4, 'home: Sale row has products');
check((await page.$$('.entry')).length === 3, 'home: three category entries');

await go('/shop.html?cat=herren');
const count = await text('[data-count]');
check((await page.$$('.tile')).length > 10, `shop: grid populated (${count})`);
await click('[data-open="filter"]'); await new Promise((r) => setTimeout(r, 400));
await click('input[name="type"][value="Fleece"]'); await click('[data-apply]'); await new Promise((r) => setTimeout(r, 500));
check(/Artikel/.test(await text('[data-count]') || ''), `shop: filter applied (${await text('[data-count]')})`);

await go('/shop.html?cat=sale');
const saleTiles = await page.$$eval('.tile .tile-price', (els) => els.map((e) => !!e.querySelector('s')));
check(saleTiles.length > 0 && saleTiles.every(Boolean), `sale: all ${saleTiles.length} tiles show a struck old price`);

await go('/product.html?id=3326307&c=hydro');
check((await text('[data-name]'))?.length > 5, `pdp: name "${await text('[data-name]')}"`);
await click('[data-add]'); await new Promise((r) => setTimeout(r, 400));
check(await page.$eval('[data-size-hint]', (e) => e.classList.contains('is-shown')), 'pdp: size gate blocks add-to-bag');
await click('[data-sizes] button[data-size="L"]'); await click('[data-add]'); await new Promise((r) => setTimeout(r, 600));
check(/1/.test(await text('[data-bag-count]') || ''), `pdp: item added (Warenkorb ${await text('[data-bag-count]')})`);
check((await text('[data-bag-total]'))?.includes('54,90'), `drawer: total with shipping = ${await text('[data-bag-total]')}`);

await go('/bag.html');
check((await page.$$('.lines .line')).length === 1, 'bag: one line item');
await go('/checkout.html');
await click('button[type="submit"]'); await new Promise((r) => setTimeout(r, 400));
check((await page.$$('.field.is-invalid')).length >= 5, 'checkout: empty submit blocked with inline errors');
for (const [sel, val] of [['#fn', 'Carlo'], ['#ln', 'Franke'], ['#street', 'Obenhauptstraße 13'], ['#zip', '22335'], ['#city', 'Hamburg'], ['#email', 'test@example.com']]) await page.type(sel, val);
await Promise.all([page.waitForNavigation({ waitUntil: 'networkidle0' }), click('button[type="submit"]')]);
current = '/confirmation.html';
check(/CH-/.test(await text('[data-num]') || ''), `confirmation: order number ${await text('[data-num]')}`);
check(/0/.test(await text('[data-bag-count]') || ''), 'confirmation: bag cleared');

await go('/index.html?intro=0');
await click('[data-open="search"]'); await new Promise((r) => setTimeout(r, 500));
await page.type('#search-input', 'hodie'); await new Promise((r) => setTimeout(r, 600));
check((await page.$$('[data-results] .tile')).length >= 3, `search: typo "hodie" found ${(await page.$$('[data-results] .tile')).length} hoodies`);

await go('/wishlist.html');
check(await page.$('[data-empty]') !== null, 'wishlist: renders');
await go('/ueber-chiemsee.html');
check((await page.$$('.prose')).length >= 2, 'about: renders');

// --- the opening frame: the old shop, then the hand-over to the store ---
await go('/index.html?intro=1');
check(await page.$('.oldshop') !== null, 'intro: the old-shop opening frame is shown');
check(await page.$eval('.os-hero-word', (e) => e.textContent.trim()) === 'Fall Essentials', 'intro: hero reads FALL ESSENTIALS, as chiemsee.com does');
check((await page.$$('.os-nav a')).length === 6, 'intro: six nav items incl. Windsurf World Cup 2026');
check((await page.$$('.os-utils svg')).length === 4, 'intro: search / wishlist / bag / account icons');
check(await page.$('.os-gift-badge') !== null, 'intro: the rewards button with its badge');
check((await page.$$('.os-promo figure')).length === 3, 'intro: three promo tiles');
await new Promise((r) => setTimeout(r, 7500));
check(await page.$('.oldshop') === null, 'intro: hands over to the store when the timer ends');
check(await page.$('.os-wipe') === null, 'intro: the wipe cleans itself up');
check(await page.evaluate(() => !document.body.style.overflow), 'intro: page scrolling is restored');
check((await page.$$('[data-row="new"] .tile')).length >= 4, 'intro: the store underneath is intact');

await go('/index.html?intro=1');
await new Promise((r) => setTimeout(r, 600));
await click('[data-skip]');
await new Promise((r) => setTimeout(r, 2200));
check(await page.$('.oldshop') === null, 'intro: the skip button hands over early');

await go('/index.html?intro=0');
await new Promise((r) => setTimeout(r, 400));
check(await page.$('.oldshop') === null, 'intro: ?intro=0 skips it entirely');

await page.setViewport({ width: 390, height: 844 });
await go('/index.html?intro=0');
check(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1), 'phone: no horizontal overflow on home');
await go('/shop.html?cat=damen');
check(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1), 'phone: no horizontal overflow on shop');

await browser.close();
console.log(problems.length ? `\n${problems.length} PROBLEM(S):\n` + [...new Set(problems)].join('\n') : '\nNo console errors, failed requests or failed checks.');
process.exit(problems.length ? 1 : 0);
