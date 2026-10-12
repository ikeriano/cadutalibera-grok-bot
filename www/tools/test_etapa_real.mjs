// Arranque real: Opciones › Etapa (clic en el botón) y luego Programa completo. node tools/test_etapa_real.mjs URL ETAPA SEGUNDOS
import puppeteer from 'puppeteer-core';
const [base, et, seg = '90', tr = '0', dobl = '0', hasta = '@@'] = process.argv.slice(2);
const b = await puppeteer.launch({ executablePath: '/usr/bin/google-chrome', headless: 'new', protocolTimeout: 600000, args: ['--no-sandbox', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--autoplay-policy=no-user-gesture-required', '--mute-audio'] });
const p = await b.newPage(); await p.setViewport({ width: 1280, height: 720 }); const errs = [];
p.on('pageerror', e => errs.push('PAGEERROR ' + e.message)); p.on('console', m => { if (m.type() === 'error' && !/404|Failed to load resource|Manifest|bad HTTP/.test(m.text())) errs.push(m.text()); });
await p.evaluateOnNewDocument(() => { if (!localStorage.getItem('ac3d_opts')) localStorage.setItem('ac3d_opts', JSON.stringify({ quality: 'baja', gradas: false })); localStorage.setItem('ac_pub_programa', '1'); window.__noCabVideo = true; window.__noMono = true; window.__noAviso = true; });
await p.goto(base + 'index.html?screen=options'); await p.waitForFunction('window.__eng && document.getElementById("loading").classList.contains("hidden") && document.querySelector("#rowEtapa button")', { timeout: 120000 });
await p.click(`#rowEtapa button[data-v="${et}"]`); await new Promise(r => setTimeout(r, 1500));
console.log('opts', await p.evaluate(() => localStorage.getItem('ac3d_opts')));
await p.evaluateOnNewDocument((tr, dobl) => { window.__etTR = +tr || 0; if (+dobl) window.__dobladoraForce = +dobl; }, tr, dobl);
await p.goto(base + 'index.html?mode=programa'); await p.waitForFunction('window.__eng && document.getElementById("loading").classList.contains("hidden")', { timeout: 120000 });
await p.evaluate(() => {
  window.__botForce = 'fail'; window.__decisionAuto = 'seguir'; if (window.__etTR) window.__testRodadas = window.__etTR; window.__pruebaForce = 'clasico';
  setInterval(() => { try { const sk = document.getElementById('btnSkip'); if (sk && !sk.classList.contains('hidden')) sk.click(); const ss = document.getElementById('stSaltar'); if (ss && window.__saltaPub) ss.click(); document.querySelectorAll('#actions button').forEach(x => /Jugar otra/.test(x.textContent) || x.click());
    const pn = window.__panel; if (pn && pn.active && pn.q && !pn.evaluating && pn.input.value === '') { pn.input.value = pn.q.missing.join(''); pn.onInput(); }
    const st = window.__st; if (st && st.els) for (const [k, el] of st.els) if (el.style.display !== 'none' && el.style.pointerEvents === 'auto' && k !== 'BotãoMenu3') { el.click(); break; }
    if (window.__e3 && window.__e3.turn === 'me' && window.__e3.q) window.__e3.choose(window.__e3.q[2] ?? 0); } catch (e) { } }, 450);
});
const fin = Date.now() + (+seg) * 1000; let n = 0;
while (Date.now() < fin) { await new Promise(r => setTimeout(r, 15000)); await p.screenshot({ path: `tmp/real${et}_${String(++n).padStart(2, '0')}.png` }); const m = await p.evaluate(() => window.__mec || []); if (m.some(x => x.startsWith(hasta))) break; }
console.log('PLATO', await p.evaluate(() => (window.__eng.theme && window.__eng.theme.id) + ' A3VAR=' + (typeof A3VAR !== 'undefined' ? A3VAR : '?')));
console.log('MEC', JSON.stringify(await p.evaluate(() => window.__mec)));
console.log('ERRORES', errs.length, errs.slice(0, 5)); await b.close();
