// Prueba automática del programa completo: node tools/test_programa.mjs URLBASE [plato] [etapa] [salida] [prueba]
import puppeteer from 'puppeteer-core';
const [base, plato = 'clasico', etapa = '2021', out = 'tmp/prog', prueba = 'clasico'] = process.argv.slice(2);
const b = await puppeteer.launch({ executablePath: '/usr/bin/google-chrome', headless: 'new', protocolTimeout: 600000, args: ['--no-sandbox', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--autoplay-policy=no-user-gesture-required', '--mute-audio'] });
const p = await b.newPage(); await p.setViewport({ width: 1280, height: 720 });
const errs = [];
p.on('pageerror', e => { errs.push('PAGEERROR ' + e.message); console.log('PAGEERROR', e.message); });
p.on('console', m => { if (m.type() === 'error' && !/404|Failed to load resource|Manifest|bad HTTP/.test(m.text())) { errs.push(m.text()); console.log('ERR', m.text()); } });
await p.evaluateOnNewDocument((pl, et) => { localStorage.setItem('ac3d_opts', JSON.stringify({ plato: pl, quality: 'baja', gradas: false })); localStorage.setItem('ac_etapa', et); localStorage.setItem('ac_pub_programa', '1'); window.__noCabVideo = true; window.__noMono = true; window.__noAviso = true; window.__dobladoraForce = 7; window.__copreForce = 'manolo'; window.__regidorForce = true; window.__coproForce = 'lola'; }, plato, etapa);
await p.goto(base + 'index.html?mode=programa'); await p.waitForFunction('window.__eng && document.getElementById("loading").classList.contains("hidden")', { timeout: 120000 });
await p.evaluate((prueba) => {
  window.__botForce = 'fail'; window.__decisionAuto = 'seguir'; window.__testRodadas = 1; if (prueba !== 'plan') window.__pruebaForce = prueba; window.__log = [];
  setInterval(() => {
    try {
      const sk = document.getElementById('btnSkip'); if (sk && !sk.classList.contains('hidden')) sk.click();
      document.querySelectorAll('#actions button').forEach(x => x.click());
      const pn = window.__panel; if (pn && pn.active && pn.q && !pn.evaluating && pn.input.value === '') { pn.input.value = pn.q.missing.join(''); pn.onInput(); }
      const st = window.__st; for (const [k, el] of st.els) if (el.style.display !== 'none' && el.style.pointerEvents === 'auto' && k !== 'BotãoMenu3') { el.click(); window.__log.push('click ' + k); break; }
      if (window.__e3 && window.__e3.turn === 'me' && window.__e3.q) window.__e3.choose(window.__e3.q[2] ?? 0);
    } catch (e) { window.__log.push('drv ' + e.message); }
  }, 450);
}, prueba);
const t0 = Date.now(); let n = 0;
while (Date.now() - t0 < 9 * 60e3) {
  await new Promise(r => setTimeout(r, 6000));
  const st = await p.evaluate(() => ({ menu: !document.getElementById('menu').classList.contains('hidden'), fin: !!document.getElementById('finCard'), score: (document.getElementById('hashtag') || {}).textContent }));
  await p.screenshot({ path: `${out}_${String(++n).padStart(2, '0')}.png` });
  console.log(Math.round((Date.now() - t0) / 1000) + 's', JSON.stringify(st));
  if (st.menu && n > 2) break; { const m = await p.evaluate(() => window.__mec.filter(x => x.startsWith('regidor'))); console.log('REG', JSON.stringify(m)); if (m.length >= 5) break; }
}
console.log('MEC:', JSON.stringify(await p.evaluate(() => window.__mec)));
console.log('ERRORES:', errs.length); errs.slice(0, 20).forEach(e => console.log(' -', e)); await b.close();
