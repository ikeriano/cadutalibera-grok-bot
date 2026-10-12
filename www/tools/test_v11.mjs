// Programa completo 2021 (Acerte) con autojuego y capturas de cada detalle 1.1. node tools/test_v11.mjs LANG SEG [fallaFinal]
import puppeteer from 'puppeteer-core';
const [lang = 'es', seg = '900', fallaFinal = '0', tr = '0'] = process.argv.slice(2);
const base = 'http://localhost:8811/';
const b = await puppeteer.launch({ executablePath: '/usr/bin/google-chrome', headless: 'new', protocolTimeout: 900000, args: ['--no-sandbox', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--autoplay-policy=no-user-gesture-required', '--mute-audio'] });
const p = await b.newPage(); await p.setViewport({ width: 1280, height: 720 }); const errs = [];
p.on('pageerror', e => errs.push('PAGEERROR ' + e.message)); p.on('console', m => { if (m.type() === 'error' && !/404|Failed to load resource|Manifest|bad HTTP/.test(m.text())) errs.push(m.text()); });
await p.evaluateOnNewDocument((l, ff, tr) => { localStorage.setItem('ac_lang', l); localStorage.setItem('ac_etapa', '2021'); if (!localStorage.getItem('ac3d_opts')) localStorage.setItem('ac3d_opts', JSON.stringify({ quality: 'baja', gradas: false })); window.__noCabVideo = true; window.__noMono = true; window.__noAviso = true; window.__ff = +ff; if (+tr) window.__testRodadas = +tr; }, lang, fallaFinal, tr);
await p.goto(base + 'index.html?mode=programa'); await p.waitForFunction('window.__eng && document.getElementById("loading").classList.contains("hidden")', { timeout: 120000 });
await p.evaluate(() => {
  window.__botForce = 'fail'; window.__decisionAuto = 'seguir';
  setInterval(() => { try { const sk = document.getElementById('btnSkip'); if (sk && !sk.classList.contains('hidden')) sk.click(); document.querySelectorAll('#actions button').forEach(x => /Ir al centro|Continuar|Empezar|Jugar|¡Vamos|Seguir/i.test(x.textContent) && !/otra/i.test(x.textContent) && x.click());
    const pn = window.__hu; const enFinal = window.__jfClock && pn && pn.final;
    if (pn && pn.active && pn.q && !pn.evaluating && pn.input.value === '' && !(enFinal && window.__ff && window.__nf >= 3)) { if (!pn.__t) pn.__t = Date.now(); if (Date.now() - pn.__t > 2500) { pn.__t = 0; if (enFinal) window.__nf = (window.__nf || 0) + 1; const w = pn.q.exact ? pn.q.exact : pn.q.missing.join(''); [...w].forEach(k => { const bb = document.querySelector(`#acKb b[data-k="${k}"]`); bb ? bb.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true })) : (pn.input.value += k, pn.onInput()); }); } }
    const st = window.__st; if (st && st.els) for (const [k, el] of st.els) if (el.style.display !== 'none' && el.style.pointerEvents === 'auto' && k !== 'BotãoMenu3') { el.click(); break; }
    if (window.__e3 && window.__e3.turn === 'me' && window.__e3.q) window.__e3.choose(window.__e3.q[2] ?? 0);
    if (window.__sn && window.__sn.turn === 'me' && window.__sn.q) window.__sn.answer(window.__sn.q[1]); } catch (e) { } }, 450);
});
const vistos = new Set(); const fin = Date.now() + (+seg) * 1000; let k = 0;
const pruebas = { kb: '(()=>{const e=document.getElementById("acKb");return e&&e.style.display==="block"})()', moneda: '!!(window.__acMoneda&&window.__acMoneda.parent)', grieta: '!!document.querySelector("#acCoin.sep")', wipe: '!!document.querySelector("#acWipe.go")&&getComputedStyle(document.getElementById("acWipe")).opacity>0.8', sino: '!!document.getElementById("sn")', cual3: '!!document.getElementById("e3")', letras: '!!document.querySelector("#splitUi.vlio")', final: '!!(window.__jfClock&&window.__hu&&window.__hu.final&&window.__hu.active)', fin: '!!document.getElementById("acFin")', premios: '!!(window.__st&&window.__st.isShown&&window.__st.isShown("Painel")&&window.__hu)', eleccion: '!!(window.__st&&window.__st.isShown&&window.__st.isShown("MenuEscolha"))' };
while (Date.now() < fin) {
  await new Promise(r => setTimeout(r, 300));
  for (const [n, ex] of Object.entries(pruebas)) { if (vistos.has(n)) continue; let ok = false; try { ok = await p.evaluate(ex); } catch (e) { } if (ok) { vistos.add(n); if (n === 'kb' || n === 'final') await new Promise(r => setTimeout(r, 1200)); await p.screenshot({ path: `/workspace/acerte/v11-${lang}-${n}.png` }); console.log('captura', n, Math.round((fin - Date.now()) / 1000)); } }
  if (++k % 100 === 0) await p.screenshot({ path: `tmp/v11_${lang}_${k}.png` });
  const m = await p.evaluate(() => window.__mec || []); if (m.some(x => /^fin|ganado|perdido/.test(x)) || await p.evaluate(() => /Jugar otra/i.test(document.getElementById('actions')?.innerText || ''))) { await new Promise(r => setTimeout(r, 1500)); break; }
}
console.log('MEC', JSON.stringify(await p.evaluate(() => window.__mec)));
console.log('VISTOS', [...vistos].join(','));
console.log('ERRORES', errs.length, errs.slice(0, 6)); await b.close();
