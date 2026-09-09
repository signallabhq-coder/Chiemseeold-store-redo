import puppeteer from 'puppeteer-core';
const b = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true });
const p = await b.newPage(); await p.setViewport({ width: 1440, height: 900 });
await p.goto('http://localhost:5191/product.html?id=3326269', { waitUntil: 'networkidle0' }); await new Promise(r => setTimeout(r, 800));
console.log(JSON.stringify(await p.evaluate(() => {
  const r = (s) => { const e = document.querySelector(s); if (!e) return null; const c = getComputedStyle(e); const b = e.getBoundingClientRect(); return { x: b.x, y: b.y, w: b.width, h: b.height, pos: c.position, top: c.top, disp: c.display }; };
  return { pdp: r('.pdp'), media: r('.pdp-media'), side: r('.pdp-side'), info: r('.pdp-info'), name: r('[data-name]'), add: r('[data-add]'), cols: getComputedStyle(document.querySelector('.pdp')).gridTemplateColumns, html: document.querySelector('.pdp-info').innerHTML.slice(0, 200) };
}), null, 1));
await b.close();
