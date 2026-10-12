// v1.13: capturas del reloj de Scratch en la pregunta de selección. node tools/test_reloj.mjs URLBASE SALIDA
import puppeteer from 'puppeteer-core';
const [base, out = 'tmp/reloj'] = process.argv.slice(2);
const b = await puppeteer.launch({ executablePath: '/usr/bin/google-chrome', headless: 'new', args: ['--no-sandbox', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--mute-audio'] });
const p = await b.newPage(); await p.setViewport({ width: 1280, height: 720 }); await p.setCacheEnabled(false); const errs = [];
p.on('pageerror', e => errs.push(e.message));
await p.evaluateOnNewDocument(() => { localStorage.setItem('ac3d_opts', JSON.stringify({ quality: 'baja', gradas: false })); window.__noAviso = true; });
await p.goto(base + 'index.html'); await p.waitForFunction('window.__eng && document.getElementById("loading").classList.contains("hidden")', { timeout: 120000 });
await p.evaluate(() => { window.__promoT = 16; window.__promoApertura(); });
for (const d of [0.15, 0.5, 0.75, 1.3, 1.7, 2.4, 3.6]) { await p.evaluate(t => window.__promoT = t, 16 + d); await new Promise(r => setTimeout(r, 1300)); await p.screenshot({ path: `${out}-${String(d).replace('.', '_')}.png` }); }
console.log('ERRORES', errs.length, errs); await b.close();
