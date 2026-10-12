import puppeteer from 'puppeteer-core';
const b = await puppeteer.launch({ executablePath: '/usr/bin/google-chrome', headless: 'new', protocolTimeout: 900000, args: ['--no-sandbox', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--mute-audio'] });
const p = await b.newPage(); await p.setViewport({ width: 960, height: 540 }); await p.setCacheEnabled(false);
await p.evaluateOnNewDocument(() => { localStorage.setItem('ac3d_opts', JSON.stringify({ quality: 'baja', gradas: false })); window.__noAviso = true; });
await p.goto('http://localhost:8813/index.html'); await p.waitForFunction('window.__eng && document.getElementById("loading").classList.contains("hidden")', { timeout: 120000 });
await p.evaluate(() => { window.__promoT = 0; window.__promoCab3Dv(); setTimeout(()=>window.__audioCab=window.__promo.audio,500); document.querySelector('#promo3d div') && (document.querySelector('#promo3d div').style.display='none'); });
await new Promise(r => setTimeout(r, 1500));
for (let i = 0; i < 190; i++) { await p.evaluate(t => window.__promoT = t, i / 25); await new Promise(r => setTimeout(r, 120)); await p.evaluate(() => new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)))); await p.screenshot({ path: `/tmp/fr/f${String(i).padStart(4, '0')}.jpg`, type: 'jpeg', quality: 90 }); }
console.log('AUDIO', await p.evaluate(() => window.__audioCab)); await b.close();
