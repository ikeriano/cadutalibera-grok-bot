// v1.13: capturas de la promo «Cabecera de estreno». node tools/test_cabnueva.mjs URLBASE SALIDA
import puppeteer from 'puppeteer-core';
const [base, out = 'tmp/cabnueva'] = process.argv.slice(2);
const b = await puppeteer.launch({ executablePath: '/usr/bin/google-chrome', headless: 'new', protocolTimeout: 600000, args: ['--no-sandbox', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--autoplay-policy=no-user-gesture-required', '--mute-audio'] });
const espera = ms => new Promise(r => setTimeout(r, ms)); const errs = [];
const p = await b.newPage(); await p.setViewport({ width: 1280, height: 720 });
p.on('pageerror', e => errs.push(e.message)); p.on('console', m => { if (m.type() === 'error' && !/404|Failed to load|Manifest/.test(m.text())) errs.push(m.text()); if (m.type() === 'warn' && /promo/.test(m.text())) errs.push(m.text()); });
await p.evaluateOnNewDocument(() => { localStorage.setItem('ac3d_opts', JSON.stringify({ quality: 'baja', gradas: false })); window.__noAviso = true; });
await p.goto(base + 'index.html'); await p.waitForFunction('window.__eng && document.getElementById("loading").classList.contains("hidden")', { timeout: 120000 });
await p.evaluate(() => { window.__promoT = 0; window.__promo3D('cabnueva'); });
for (const t of [1.8, 4.4, 8.6, 10.5, 13.2, 15.5]) { await p.evaluate(t => window.__promoT = t, t); await espera(1500); await p.screenshot({ path: `${out}-${String(t).replace('.', '_')}.png` }); }
console.log('estado', JSON.stringify(await p.evaluate(() => window.__promo))); console.log('ERRORES', errs.length, errs.slice(0, 5)); await b.close();
