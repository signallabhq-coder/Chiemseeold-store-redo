import puppeteer from 'puppeteer-core';
const b = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true });
const p = await b.newPage(); await p.setViewport({ width: 1440, height: 900 });
await p.goto('http://localhost:5191/index.html', { waitUntil: 'networkidle0' });
console.log(await p.evaluate(() => { const s = document.querySelector('.strip .short'), l = document.querySelector('.strip .long'); return JSON.stringify({ short: s && getComputedStyle(s).display, long: l && getComputedStyle(l).display, text: document.querySelector('.strip a').textContent, rules: [...document.styleSheets].flatMap(ss => { try { return [...ss.cssRules].map(r => r.cssText).filter(t => t.includes('.strip')); } catch { return []; } }) }); }));
await b.close();
