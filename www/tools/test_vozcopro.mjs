// v1.13: comprueba que la charla del presentador sorpresa suena con voces Piper (voz/st) y Adrián con voz/. node tools/test_vozcopro.mjs URLBASE [copro]
import puppeteer from 'puppeteer-core';
const [base, copro = 'nuria'] = process.argv.slice(2);
const b = await puppeteer.launch({ executablePath: '/usr/bin/google-chrome', headless: 'new', protocolTimeout: 600000, args: ['--no-sandbox', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--autoplay-policy=no-user-gesture-required', '--mute-audio'] });
const p = await b.newPage(); await p.setViewport({ width: 1280, height: 720 }); await p.setCacheEnabled(false); const errs = [], st = new Set(), ad = new Set();
p.on('pageerror', e => errs.push(e.message)); p.on('response', r => { const u = r.url(); if (r.status() === 200 && /\/voz\/st\/\w+\.mp3/.test(u)) st.add(u); else if (r.status() === 200 && /\/voz\/\w+\.mp3/.test(u)) ad.add(u); });
await p.evaluateOnNewDocument(c => { localStorage.setItem('ac3d_opts', JSON.stringify({ quality: 'baja', gradas: false })); window.__noAviso = true; window.__noApertura = true; window.__noCab3d = true; window.__noCabVideo = true; window.__noMono = true; window.__coproForce = c; window.__testRodadas = 6; window.__botForce = 'fail'; }, copro);
await p.goto(base + 'index.html?mode=programa'); await p.waitForFunction('window.__eng && document.getElementById("loading").classList.contains("hidden")', { timeout: 120000 });
await p.evaluate(() => setInterval(() => { try { const sk = document.getElementById('btnSkip'); if (sk && !sk.classList.contains('hidden')) sk.click(); } catch (e) { } }, 500));
const t0 = Date.now(); while (Date.now() - t0 < 150000) { await new Promise(r => setTimeout(r, 2000)); if ((await p.evaluate(() => window.__mec.some(m => /^copro (duelo|caida|moneda)/.test(m))))) break; }
console.log('mec', JSON.stringify((await p.evaluate(() => window.__mec)).filter(m => /copro|presentador/.test(m))));
console.log('voces copresentador (voz/st)', st.size, ' voces Adrián (voz/)', ad.size); console.log('ERRORES', errs.length, errs.slice(0, 5)); await b.close();
