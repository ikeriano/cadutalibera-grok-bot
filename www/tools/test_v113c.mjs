// v1.13c: capturas de la Cabecera 3D y de la Apertura del programa. node tools/test_v113c.mjs URLBASE SALIDA
import puppeteer from 'puppeteer-core';
const [base, out = 'tmp/v113c'] = process.argv.slice(2);
const b = await puppeteer.launch({ executablePath: '/usr/bin/google-chrome', headless: 'new', protocolTimeout: 600000, args: ['--no-sandbox', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--autoplay-policy=no-user-gesture-required', '--mute-audio'] });
const espera = ms => new Promise(r => setTimeout(r, ms)); const errs = [];
const p = await b.newPage(); await p.setViewport({ width: 1280, height: 720 }); await p.setCacheEnabled(false);
p.on('pageerror', e => errs.push(e.message)); p.on('console', m => { if (m.type() === 'error' && !/404|Failed to load|Manifest|bad HTTP/.test(m.text())) errs.push(m.text()); if (m.type() === 'warn' && /promo/.test(m.text())) errs.push(m.text()); });
await p.evaluateOnNewDocument(() => { localStorage.setItem('ac3d_opts', JSON.stringify({ quality: 'baja', gradas: false })); window.__noAviso = true; window.__coproForce = 'lola'; });
await p.goto(base + 'index.html'); await p.waitForFunction('window.__eng && document.getElementById("loading").classList.contains("hidden")', { timeout: 120000 });
const TR = [[0, 12.4, 15], [12.4, 16, 6], [16, 21, 6], [21, 23.5, 4], [23.5, 29, 8], [29, 33, 6]];
const inv = t => { let b = 0; for (const [a0, a1, d] of TR) { if (t < a1) return b + (t - a0) / (a1 - a0) * d; b += d; } return b; };
const tomas = async (fn, lista, pref) => { await p.evaluate(fn); await espera(800); console.log(pref, 'audio', await p.evaluate(() => window.__promo.audio)); for (let [t, n] of lista) { if (pref === 'apertura') t = inv(t); await p.evaluate(t => window.__promoT = t, t); await espera(1600); console.log(n, JSON.stringify(await p.evaluate(() => [window.__promo.t, window.__apertura && window.__apertura.plano]))); await p.screenshot({ path: `${out}-${pref}-${n}.png` }); } await p.evaluate(() => window.__promoT = 999); await espera(1500); };
await tomas(() => { window.__promoT = 0; window.__promoCab3Dv(); }, [[0.9, '1-tunel'], [1.55, '1-rotura'], [2.5, '2-trampilla'], [3.5, '2-caida'], [5.0, '3-logo'], [6.9, '3-golpe']], 'cabecera');
await tomas(() => { window.__promoT = 0; window.__promoApertura(); }, [[2.0, '1-espiral'], [5.0, '2-publico'], [7.8, '3-escalera'], [10.5, '4-adrian'], [14.8, '5-concursantes'], [18.0, '6-seleccion'], [20.6, '6-seleccion-resuelta'], [21.5, '7-cortinilla'], [22.9, '7-logo'], [26.0, '8-centro'], [28.0, '8-copresentadora'], [31.5, '9-grua']], 'apertura');
// opción en Opciones
console.log('ERRORES', errs.length, errs.slice(0, 8)); await b.close();
