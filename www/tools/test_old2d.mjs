// 2D con el lector de paquete, emulando un WebView antiguo (sin Map/Set/Promise/Object.assign/PointerEvent…)
import puppeteer from 'puppeteer-core';
const [base, out, W = 1280, H = 800, lang = 'it'] = process.argv.slice(2);
const b = await puppeteer.launch({ executablePath: '/usr/bin/google-chrome', headless: 'new', args: ['--no-sandbox', '--mute-audio', '--autoplay-policy=document-user-activation-required'] });
const p = await b.newPage(); await p.setViewport({ width: +W, height: +H, isMobile: true, hasTouch: true }); const errs = [], f404 = [];
p.on('pageerror', e => errs.push(e.message)); p.on('response', r => { if (r.status() >= 400) f404.push(r.status() + ' ' + r.url()); });
await p.evaluateOnNewDocument((l) => { localStorage.setItem('ac_lang', l); localStorage.setItem('cl_prof', JSON.stringify({ n: 'Iker', g: 'm' }));
  window.Map = undefined; window.Set = undefined; window.Promise = undefined; Object.assign = undefined; Object.values = undefined; String.prototype.padStart = undefined; String.prototype.normalize = undefined; Element.prototype.closest = undefined; Array.from = undefined; window.PointerEvent = undefined; delete window.onpointerdown; delete HTMLElement.prototype.onpointerdown;
  HTMLMediaElement.prototype.play = function () { throw new Error('autoplay bloqueado'); }; }, lang);
await p.goto(base + '/index.html'); await new Promise(r => setTimeout(r, 3500));
await p.screenshot({ path: out + '-1menu.png' });
const st = await p.evaluate(() => ({ url: location.pathname, pronto: !!window.__clPronto, err: (document.getElementById('clErr') || {}).textContent || '', st: document.getElementById('st') && document.getElementById('st').getBoundingClientRect().width }));
await p.tap('#mPlay').catch(e => errs.push('tap ' + e.message)); await new Promise(r => setTimeout(r, 2500)); await p.screenshot({ path: out + '-2tab.png' });
await p.evaluate(() => { const C = window.__CL; C.G.bank = 50000; C.G.opp.forEach(o => o.out = true); C.giocoFinale(); }); await new Promise(r => setTimeout(r, 7000));
const k = await p.$$('.gfk'); if (k[0]) await k[0].tap(); await new Promise(r => setTimeout(r, 400)); await p.screenshot({ path: out + '-3finale.png' });
const typed = await p.evaluate(() => window.__CL.D.typed.join(''));
console.log(JSON.stringify({ ...st, typed, errs, f404: f404.slice(0, 5) })); await b.close();
