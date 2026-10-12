// capturas en vertical y horizontal: node tools/test_orient.mjs URL salida
import puppeteer from 'puppeteer-core';
const [base, out = 'tmp/or'] = process.argv.slice(2);
const b = await puppeteer.launch({ executablePath: '/usr/bin/google-chrome', headless: 'new', protocolTimeout: 300000, args: ['--no-sandbox', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--autoplay-policy=no-user-gesture-required', '--mute-audio'] });
const errs = []; const espera = ms => new Promise(r => setTimeout(r, ms));
async function caso(nom, q, vw, vh, prep) {
  const p = await b.newPage(); await p.setViewport({ width: vw, height: vh, isMobile: true, hasTouch: true, deviceScaleFactor: 1 });
  p.on('pageerror', e => errs.push(nom + ' ' + e.message)); p.on('console', m => { if (m.type() === 'error' && !/404|Failed to load|Manifest|bad HTTP/.test(m.text())) errs.push(nom + ' ' + m.text()); });
  await p.evaluateOnNewDocument(() => { localStorage.setItem('ac3d_opts', JSON.stringify({ quality: 'baja', gradas: false })); localStorage.setItem('ac_copresentador', '0'); window.__noCabVideo = true; window.__noMono = true; window.__noAviso = true; window.__testRodadas = 7; window.__pruebaForce = 'clasico'; });
  await p.goto(base + 'index.html?' + q); await p.waitForFunction('window.__eng && document.getElementById("loading").classList.contains("hidden")', { timeout: 120000 });
  await prep(p); await p.screenshot({ path: `${out}_${nom}_${vw}x${vh}.png` }); await p.close();
}
for (const [vw, vh] of [[390, 844], [844, 390]]) {
  await caso('menu', 'screen=main', vw, vh, () => espera(1500));
  await caso('duelo', 'mode=programa', vw, vh, async p => { await p.evaluate(() => setInterval(() => { const sk = document.getElementById('btnSkip'); if (sk && !sk.classList.contains('hidden')) sk.click(); const st = window.__st; if (st && st.els) for (const [k, el] of st.els) if (el.style.display !== 'none' && el.style.pointerEvents === 'auto' && k !== 'BotãoMenu3') { el.click(); break; } }, 400)); await p.waitForFunction('window.__panel && window.__panel.active && window.__panel.q', { timeout: 150000 }).catch(() => { }); await espera(2500); });
  await caso('paseo', 'mode=paseo', vw, vh, async p => { await espera(3000); await p.touchscreen.touchStart(90, vh - 120); for (let k = 1; k <= 6; k++) { await p.touchscreen.touchMove(90, vh - 120 - k * 9); await espera(60); } await espera(1500); });
  await caso('promo', 'mode=promoadrian&sub=casting', vw, vh, () => espera(7000));
}
console.log('ERRORES', errs.length, errs.slice(0, 6)); await b.close();
