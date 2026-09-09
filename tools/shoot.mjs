// shoot.mjs — DPR2 capture of a URL with overlays stripped.
// usage: node shoot.mjs <url> <out.png> [--full] [--w=1440] [--h=900] [--wait=4000] [--kill=sel1,sel2] [--click=sel] [--scroll=N]
import puppeteer from 'puppeteer-core';
import fs from 'node:fs';

const [,, url, out, ...rest] = process.argv;
const opt = Object.fromEntries(rest.filter(a => a.startsWith('--')).map(a => {
  const i = a.indexOf('=');
  return i < 0 ? [a.slice(2), true] : [a.slice(2, i), a.slice(i + 1)];
}));
const W = +(opt.w || 1440), H = +(opt.h || 900);

const browser = await puppeteer.launch({
  executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
  headless: opt.headful ? false : true,
  args: ['--disable-gpu', '--hide-scrollbars', '--font-render-hinting=none', '--disable-lcd-text', '--lang=en-GB', '--disable-blink-features=AutomationControlled', '--window-size=1440,900'],
  ignoreDefaultArgs: ['--enable-automation'],
});
const page = await browser.newPage();
await page.evaluateOnNewDocument(() => {
  Object.defineProperty(navigator, 'webdriver', { get: () => undefined });
  window.chrome = window.chrome || { runtime: {} };
  Object.defineProperty(navigator, 'languages', { get: () => ['en-GB', 'en'] });
  Object.defineProperty(navigator, 'plugins', { get: () => [1, 2, 3] });
});
await page.setExtraHTTPHeaders({ 'Accept-Language': 'en-GB,en;q=0.9', 'sec-ch-ua': '"Chromium";v="140", "Google Chrome";v="140", "Not?A_Brand";v="24"', 'sec-ch-ua-platform': '"Windows"', 'sec-ch-ua-mobile': '?0' });
await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36');
await page.setViewport({ width: W, height: H, deviceScaleFactor: 2 });
page.on('pageerror', (e) => console.error('PAGEERROR', e.message));
page.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') console.error('CONSOLE', m.type(), m.text()); });
page.on('requestfailed', (r) => console.error('REQFAIL', r.url().slice(0, 120)));
page.on('response', (r) => { if (r.status() >= 400) console.error('HTTP', r.status(), r.url().slice(0, 120)); });
await page.goto(url, { waitUntil: 'networkidle2', timeout: 90000, referer: opt.referer ? String(opt.referer) : undefined }).catch(e => console.error('goto:', e.message));
await new Promise(r => setTimeout(r, +(opt.wait || 4000)));

// Generic overlay killer: cookie banners, modals, location pickers, membership popups. Skipped with --nokill (our own pages).
const kill = String(opt.kill || '').split(',').filter(Boolean);
if (!opt.nokill) await page.evaluate((extra) => {
  const sels = [
    '#onetrust-consent-sdk', '#onetrust-banner-sdk', '.onetrust-pc-dark-filter', '[id*="cookie"]', '[class*="cookie"]',
    '[class*="Cookie"]', '[id*="consent"]', '[class*="consent"]', '[class*="modal"]', '[class*="Modal"]', '[role="dialog"]',
    '[class*="popup"]', '[class*="Popup"]', '[class*="overlay"]', '[class*="Overlay"]', '[class*="membership"]',
    '[class*="location"]', '[class*="Location"]', '[class*="newsletter"]', '[class*="Newsletter"]', ...extra,
  ];
  for (const s of sels) document.querySelectorAll(s).forEach(el => {
    // don't nuke the whole page: skip elements that contain the main product grid
    if (el.querySelectorAll('img').length > 12 || el.tagName === 'BODY' || el.tagName === 'HTML') return;
    const cs = getComputedStyle(el);
    if (cs.position === 'fixed' || cs.position === 'absolute' || /dialog|modal|popup|overlay|cookie|consent|newsletter|membership|location/i.test(s)) el.remove();
  });
  document.documentElement.style.overflow = 'auto';
  document.body.style.overflow = 'auto';
  document.body.style.position = 'static';
}, kill);

// Click any button whose text matches --clicktext (e.g. "Stay in Belgium"), then nuke large fixed overlays.
for (const t of String(opt.clicktext || '').split('|').filter(Boolean)) {
  await page.evaluate((t) => {
    const all = [...document.querySelectorAll('button')].concat([...document.querySelectorAll('a')]);
    const b = all.find(e => e.textContent.trim().toLowerCase() === t.toLowerCase()) || all.find(e => e.textContent.trim().toLowerCase().includes(t.toLowerCase()));
    if (b) b.click();
  }, t);
  await new Promise(r => setTimeout(r, 1200));
}
await page.addStyleTag({ content: '#onetrust-consent-sdk,.onetrust-pc-dark-filter,[id^="onetrust"],[role="dialog"],[aria-modal="true"],[class*="cookie" i]:not(body):not(html):not(main){display:none !important}' });
if (opt.clicksel) {
  try {
    await Promise.all([page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 60000 }), page.click(String(opt.clicksel))]);
    await new Promise(r => setTimeout(r, 3000));
    await page.addStyleTag({ content: '#onetrust-consent-sdk,.onetrust-pc-dark-filter,[id^="onetrust"],[role="dialog"],[aria-modal="true"]{display:none !important}' });
  } catch (e) { console.error('clicksel:', e.message); }
}
if (!opt.nokill) await page.evaluate(() => {
  const vw = innerWidth, vh = innerHeight;
  for (const el of [...document.querySelectorAll('body *')]) {
    const cs = getComputedStyle(el);
    if (cs.position !== 'fixed' && cs.position !== 'sticky') continue;
    const r = el.getBoundingClientRect();
    const area = Math.max(0, Math.min(r.right, vw) - Math.max(r.left, 0)) * Math.max(0, Math.min(r.bottom, vh) - Math.max(r.top, 0));
    const isHeader = r.top <= 2 && r.height < vh * 0.25 && r.width > vw * 0.8;
    const isNav = el.tagName === 'HEADER' || el.closest('header') || el.querySelector('nav, header') || el.tagName === 'NAV';
    if (!isHeader && !isNav && area > vw * vh * 0.12 && el.querySelectorAll('img').length <= 12) el.remove();
  }
  document.querySelectorAll('aside,[class*="drawer"],[class*="Drawer"],[class*="sidepanel"],[class*="SidePanel"],[class*="flyout"]').forEach(el => {
    const cs = getComputedStyle(el); if (cs.position === 'fixed' || cs.position === 'absolute') el.remove();
  });
});
if (opt.click) { try { await page.click(String(opt.click)); await new Promise(r => setTimeout(r, 1500)); } catch {} }
if (opt.scroll) {
  await page.evaluate(y => window.scrollTo(0, y), +opt.scroll);
  await new Promise(r => setTimeout(r, 1500));
}
// lazy-load nudge for full-page
if (opt.full) {
  await page.evaluate(async () => {
    const h = document.documentElement.scrollHeight;
    for (let y = 0; y < h; y += 700) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 120)); }
    window.scrollTo(0, 0);
  });
  await new Promise(r => setTimeout(r, 1500));
}
if (opt.probe) {
  const probe = await page.evaluate(() => {
    const cs = (el, props) => { const c = getComputedStyle(el); return Object.fromEntries(props.map(p => [p, c[p]])); };
    const T = ['fontFamily','fontSize','lineHeight','fontWeight','letterSpacing','textTransform','color','backgroundColor'];
    const out = { viewport: [innerWidth, innerHeight], fonts: {}, samples: [] };
    // every visible text node's computed type -> histogram
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    let n; const seen = new Map();
    while ((n = walker.nextNode())) {
      const t = n.textContent.trim(); if (t.length < 2) continue;
      const el = n.parentElement; const r = el.getBoundingClientRect(); if (!r.width || !r.height || r.bottom < 0 || r.top > 4000) continue;
      const c = getComputedStyle(el); const k = `${c.fontSize}/${c.lineHeight} w${c.fontWeight} ${c.textTransform} ${c.color} | ${c.fontFamily.split(',')[0]}`;
      const e = seen.get(k) || { key: k, count: 0, examples: [] }; e.count++; if (e.examples.length < 4) e.examples.push(t.slice(0, 40)); seen.set(k, e);
    }
    out.fonts = [...seen.values()].sort((a, b) => b.count - a.count).slice(0, 25);
    // geometry: images bigger than 150px
    const imgs = [...document.querySelectorAll('img')].map(i => { const r = i.getBoundingClientRect(); return { x: Math.round(r.x), y: Math.round(r.y + scrollY), w: Math.round(r.width), h: Math.round(r.height) }; }).filter(r => r.w > 150 && r.h > 150);
    out.images = imgs.slice(0, 24);
    // header
    const hdr = document.querySelector('header'); if (hdr) { const r = hdr.getBoundingClientRect(); out.header = { h: Math.round(r.height), ...cs(hdr, ['backgroundColor','position','borderBottom']) }; }
    // buttons / accents
    out.buttons = [...document.querySelectorAll('button, a')].filter(b => { const c = getComputedStyle(b); return c.backgroundColor !== 'rgba(0, 0, 0, 0)' && b.getBoundingClientRect().width > 40; }).slice(0, 12).map(b => ({ text: b.textContent.trim().slice(0, 30), ...cs(b, ['backgroundColor','color','borderRadius','fontSize','fontWeight','textTransform','letterSpacing','padding']) }));
    out.bodyBg = getComputedStyle(document.body).backgroundColor;
    out.links = [...document.querySelectorAll('a')].slice(0, 400).reduce((m, a) => { const c = getComputedStyle(a).color; m[c] = (m[c] || 0) + 1; return m; }, {});
    out.borderRadii = [...document.querySelectorAll('*')].slice(0, 3000).reduce((m, el) => { const r = getComputedStyle(el).borderRadius; if (r !== '0px') m[r] = (m[r] || 0) + 1; return m; }, {});
    out.shadows = [...document.querySelectorAll('*')].slice(0, 3000).filter(el => getComputedStyle(el).boxShadow !== 'none').length;
    out.transitions = [...new Set([...document.querySelectorAll('*')].slice(0, 3000).map(el => getComputedStyle(el).transitionDuration).filter(d => d !== '0s'))];
    return out;
  });
  fs.writeFileSync(out.replace(/\.png$/, '') + '.probe.json', JSON.stringify(probe, null, 1));
}
await page.screenshot({ path: out, fullPage: !!opt.full });
if (opt.links) {
  const links = await page.evaluate(() => [...document.querySelectorAll('a[href]')].map(a => a.href).filter(h => /\/p\/|product|\.html/.test(h)));
  fs.writeFileSync(out + '.links.txt', [...new Set(links)].join('\n'));
}
console.log('saved', out);
await browser.close();
