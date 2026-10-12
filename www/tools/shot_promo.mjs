// capturas de una promo: node tools/shot_promo.mjs URLBASE id prefijo t1,t2,...
import puppeteer from 'puppeteer-core';
const [base, id, pre, ts] = process.argv.slice(2);
const b = await puppeteer.launch({ executablePath: '/usr/bin/google-chrome', headless: 'new', args: ['--no-sandbox', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--autoplay-policy=no-user-gesture-required'] });
const p = await b.newPage(); await p.setViewport({ width: +(process.env.VW || 960), height: +(process.env.VH || 540) });
p.on('pageerror', e => console.log('PAGEERROR', e.message)); p.on('console', m => { if ((m.type() === 'error' || m.type() === 'warning') && !/404|Failed to load|Manifest|GPU stall|WebGL/.test(m.text())) console.log(m.type(), m.text()); });
await p.evaluateOnNewDocument(() => { window.__noAviso = true; }); await p.goto(base + 'index.html?screen=main'); await p.waitForFunction('window.__eng && document.getElementById("loading").classList.contains("hidden")', { timeout: 90000 });
await p.evaluate(id => { window.__pp = id === 'cabecera' ? window.__cab3D('normal') : window.__promo3D(id); }, id);
const tiempos = ts.split(',').map(Number);
for (const [i, t] of tiempos.entries()) { if (process.env.FIJO) { await p.evaluate(t => window.__promoT = t, t); await new Promise(r => setTimeout(r, 700)); } else await p.waitForFunction(t => window.__promo && window.__promo.t >= t, { timeout: 180000, polling: 30 }, t); await p.screenshot({ path: `${pre}_${String(i).padStart(2, '0')}.jpg`, quality: 70 }); }
if (process.env.FIJO) await p.evaluate(() => window.__promoT = null);
await p.waitForFunction('window.__promo.estado !== "reproduciendo"', { timeout: 60000 }).catch(() => console.log('no terminó'));
console.log(id, await p.evaluate(() => JSON.stringify(window.__promo))); await b.close();
