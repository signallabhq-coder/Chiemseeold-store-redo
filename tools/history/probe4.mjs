import puppeteer from 'puppeteer-core';
const b = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true });
const p = await b.newPage(); await p.setViewport({ width: 1440, height: 900 });
const bad = []; p.on('response', r => { if (r.status() >= 400) bad.push(r.status() + ' ' + r.url()); });
await p.goto('http://localhost:5191/product.html?id=3326307&c=hydro', { waitUntil: 'networkidle0' }); await new Promise(r => setTimeout(r, 1500));
console.log(JSON.stringify(await p.evaluate(() => [...document.querySelectorAll('[data-related] img')].map(i => ({ src: i.getAttribute('src').slice(-45), complete: i.complete, nw: i.naturalWidth, loading: i.loading, rect: Math.round(i.getBoundingClientRect().top) }))), null, 0));
console.log('bad responses:', bad.slice(0, 5));
await b.close();
