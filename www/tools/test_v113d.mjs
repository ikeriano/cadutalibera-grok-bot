// v1.13d: capturas del sketch «El regreso de Don Arturo». node tools/test_v113d.mjs URLBASE SALIDA
import puppeteer from 'puppeteer-core';
const [base, out = 'tmp/v113d'] = process.argv.slice(2);
const b = await puppeteer.launch({ executablePath: '/usr/bin/google-chrome', headless: 'new', protocolTimeout: 600000, args: ['--no-sandbox', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--autoplay-policy=no-user-gesture-required', '--mute-audio'] });
const espera = ms => new Promise(r => setTimeout(r, ms)); const errs = [];
const p = await b.newPage(); await p.setViewport({ width: 1280, height: 720 }); await p.setCacheEnabled(false);
p.on('pageerror', e => errs.push(e.message)); p.on('console', m => { if (m.type() === 'error' && !/404|Failed to load|Manifest|bad HTTP/.test(m.text())) errs.push(m.text()); if (m.type() === 'warn' && /promo/.test(m.text())) errs.push(m.text()); });
await p.evaluateOnNewDocument(() => { localStorage.setItem('ac3d_opts', JSON.stringify({ quality: 'baja', gradas: false })); window.__noAviso = true; });
await p.goto(base + 'index.html'); await p.waitForFunction('window.__eng && document.getElementById("loading").classList.contains("hidden")', { timeout: 120000 });
const G = await p.evaluate(() => window.__arturoGuion.map(l => [l.plano, l.gesto, +l.t0.toFixed(2), +l.t1.toFixed(2)]));
console.log('lineas', G.length, 'duracion', G[G.length - 1][3].toFixed(1), 's');
await p.evaluate(() => { window.__promoT = 0; window.__promoArturo(); });
const tomas = [[1, 'pantalla-logo', 3], [2, 'trampillas', 7], [3, 'trampilla-central', 16], [3, 'cae', 19], [4, 'tumbado', 23], [5, 'tarta-1500', 33], [6, 'esmoquin', 38]];
for (const [pl, n, idx] of tomas) { const l = G[idx]; const t = (l[2] + l[3]) / 2 + (n === 'cae' ? 0.4 : 0); await p.evaluate(t => window.__promoT = t, t); await espera(1600); console.log(n, JSON.stringify(await p.evaluate(() => window.__arturo))); await p.screenshot({ path: `${out}-${n}.png` }); }
await p.evaluate(() => window.__promoT = 999); await espera(1500);
console.log('estado', await p.evaluate(() => window.__promo.estado)); console.log('ERRORES', errs.length, errs.slice(0, 8)); await b.close();
