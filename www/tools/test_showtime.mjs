// node tools/test_showtime.mjs URLBASE  — menús Publicidad / Promos de Adrián y sus modos
import puppeteer from 'puppeteer-core';
const [base] = process.argv.slice(2);
const b = await puppeteer.launch({ executablePath: '/usr/bin/google-chrome', headless: 'new', protocolTimeout: 600000, args: ['--no-sandbox', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--autoplay-policy=no-user-gesture-required', '--mute-audio'] });
const espera = ms => new Promise(r => setTimeout(r, ms));
const errs = [];
async function abre(q) {
  const p = await b.newPage(); await p.setViewport({ width: 1280, height: 720 });
  p.on('pageerror', e => { errs.push(q + ' PAGEERROR ' + e.message); console.log('PAGEERROR', q, e.message); });
  p.on('console', m => { if (m.type() === 'error' && !/404|Failed to load resource|Manifest|bad HTTP/.test(m.text())) { errs.push(q + ' ' + m.text()); console.log('ERR', q, m.text()); } });
  await p.evaluateOnNewDocument(() => { localStorage.setItem('ac3d_opts', JSON.stringify({ quality: 'baja', gradas: false })); window.__noCabVideo = true; window.__noMono = true; window.__noAviso = true; });
  await p.goto(base + 'index.html?' + q); await p.waitForFunction('window.__eng && document.getElementById("loading").classList.contains("hidden")', { timeout: 120000 }); return p;
}
let p = await abre('screen=publicidad'); await espera(1500); await p.screenshot({ path: 'tmp/st_menu_pub.png' });
console.log('menu pub:', await p.evaluate(() => [...document.querySelectorAll('#menu button')].map(x => x.textContent.trim().slice(0, 40)).join(' | ')));
await p.close();
p = await abre('screen=promosadrian'); await espera(1200); await p.screenshot({ path: 'tmp/st_menu_promos.png' }); await p.close();
for (const [q, shots, nom] of [['mode=publicidad&sub=cortinillas', [1500, 5000, 9000], 'cort'], ['mode=publicidad&sub=anuncio:patatin', [2500, 9000], 'ad'], ['mode=publicidad&sub=cadena:cocina', [3000, 14000, 30000, 38000], 'cocina'], ['mode=publicidad&sub=cadena:boom', [3000], 'boom'], ['mode=publicidad&sub=cadena:pasapalabra', [3000], 'pasa'], ['mode=promoadrian&sub=bote', [4000, 12000], 'adrian']]) {
  p = await abre(q); let t = 0; for (const [k, ms] of shots.entries()) { await espera(ms - t); t = ms; await p.screenshot({ path: `tmp/st_${nom}_${k}.png` }); }
  await p.waitForFunction('!document.getElementById("showtime") && !document.getElementById("promoRot") && document.querySelectorAll("#actions button").length', { timeout: 180000 }).catch(e => console.log('TIMEOUT', q));
  console.log(q, 'MEC', JSON.stringify(await p.evaluate(() => window.__mec))); await p.close();
}
console.log('ERRORES', errs.length, errs.slice(0, 8)); await b.close();
