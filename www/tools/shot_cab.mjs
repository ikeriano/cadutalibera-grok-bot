// capturas de la cabecera 3D: node tools/shot_cab.mjs URLBASE tema prefijo
import puppeteer from 'puppeteer-core';
const [base, tema, pre] = process.argv.slice(2);
const b = await puppeteer.launch({ executablePath: '/usr/bin/google-chrome', headless: 'new', args: ['--no-sandbox', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--autoplay-policy=no-user-gesture-required'] });
const p = await b.newPage(); await p.setViewport({ width: 960, height: 540 });
p.on('pageerror', e => console.log('PAGEERROR', e.message)); p.on('console', m => { if (m.type() === 'error' && !/404|Failed to load|Manifest/.test(m.text())) console.log('ERR', m.text()); });
await p.evaluateOnNewDocument(() => { window.__noAviso = true; }); await p.goto(base + 'index.html?screen=main'); await p.waitForFunction('window.__eng && document.getElementById("loading").classList.contains("hidden")', { timeout: 90000 });
await p.evaluate(t => { window.__cabP = window.__cab3D(t); }, tema);
const tiempos = [0.7, 2.4, 4.6, 5.4, 6.0, 8, 11, 14, 17, 20, 21.8, 23.2, 25];
for (const [i, t] of tiempos.entries()) { await p.waitForFunction(t => window.__cab3d && window.__cab3d.t >= t, { timeout: 120000, polling: 30 }, t); await p.screenshot({ path: `${pre}_${String(i).padStart(2, '0')}.jpg`, quality: 70 }); }
console.log(JSON.stringify(await p.evaluate(() => ({ estado: window.__cab3d.estado, audio: window.__cab3d.audio }))));
await p.waitForFunction('window.__cab3d.estado !== "reproduciendo"', { timeout: 30000 }).catch(() => console.log('no terminó'));
console.log(await p.evaluate(() => window.__cab3d.estado)); await b.close();
