// v1.13: presentador sorpresa en el Programa completo + escenas nuevas. node tools/test_v113.mjs URLBASE SALIDA
import puppeteer from 'puppeteer-core';
const [base, out = 'tmp/v113'] = process.argv.slice(2);
const b = await puppeteer.launch({ executablePath: '/usr/bin/google-chrome', headless: 'new', protocolTimeout: 900000, args: ['--no-sandbox', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--autoplay-policy=no-user-gesture-required', '--mute-audio'] });
const errs = []; const espera = ms => new Promise(r => setTimeout(r, ms));
async function abre(q, pre = () => { }, arg) {
  const p = await b.newPage(); await p.setViewport({ width: 1280, height: 720 });
  p.on('pageerror', e => { errs.push(q + ' PAGEERROR ' + e.message); console.log('PAGEERROR', q, e.message); }); p.on('console', m => { if (m.type() === 'error' && !/404|Failed to load|Manifest|bad HTTP/.test(m.text())) { errs.push(q + ' ' + m.text()); console.log('ERR', q, m.text()); } });
  await p.evaluateOnNewDocument(pre, arg); await p.evaluateOnNewDocument(() => { localStorage.setItem('ac3d_opts', JSON.stringify({ quality: 'baja', gradas: false })); window.__noCabVideo = true; window.__noMono = true; window.__noAviso = true; window.__noCab3d = true; window.__copreForce = false; });
  await p.goto(base + 'index.html?' + q); await p.waitForFunction('window.__eng && document.getElementById("loading").classList.contains("hidden")', { timeout: 120000 }); return p;
}
const bocadillo = p => p.evaluate(() => { const b = document.getElementById('bubble'); return b && !b.classList.contains('hidden') ? [b.querySelector('b').textContent, b.querySelector('span').textContent] : null; });
// 1) Programa completo con presentador sorpresa (etapa 2021: duelo, moneda, decisión, final, despedida)
const r1 = {};
for (const [id, etapa] of (process.env.SOLO_SECCIONES ? [] : [[process.env.COPRO || 'lola', '2021']])) {
  const p = await abre('mode=programa', (id, et) => { window.__coproForce = id; localStorage.setItem('ac_etapa', et); window.__testRodadas = 6; window.__botForce = 'fail'; window.__pruebaForce = 'clasico'; window.__decisionAuto = 'seguir'; }, id, etapa);
  // driver: salta cabecera, responde el panel, pulsa botones del escenario (como tools/test_extras.mjs)
  await p.evaluate(() => setInterval(() => { try { const sk = document.getElementById('btnSkip'); if (sk && !sk.classList.contains('hidden')) sk.click(); document.querySelectorAll('#actions button').forEach(x => /Seguir|Ir al centro|Jugar/.test(x.textContent) && x.click()); const pn = window.__panel; if (pn && pn.active && pn.q && !pn.evaluating && pn.input.value === '') { pn.input.value = pn.q.missing.join(''); pn.onInput(); } const st = window.__st; if (st && st.els) for (const [k, el] of st.els) if (el.style.display !== 'none' && el.style.pointerEvents === 'auto' && k !== 'BotãoMenu3') { el.click(); break; } if (window.__e3 && window.__e3.turn === 'me' && window.__e3.q) window.__e3.choose(window.__e3.q[2] ?? 0); } catch (e) { } }, 450));
  const nombre = await p.evaluate(id => window.__copro.datos.find(x => x.id === id).nombre, id);
  const frases = new Set(); const shots = new Set(); const t0 = Date.now(); let fin = false;
  while (Date.now() - t0 < 14 * 60e3) {
    await espera(400); const bb = await bocadillo(p).catch(() => null);
    const mec = await p.evaluate(() => window.__mec.slice(-1)[0] || '');
    if (bb && bb[0] === nombre && !frases.has(bb[1])) {
      frases.add(bb[1]); const ult = (await p.evaluate(() => window.__mec.filter(m => m.startsWith('copro ')).slice(-1)[0] || '')).slice(6); const fase = frases.size === 1 ? 'entra' : ult;
      if (fase && !shots.has(fase)) { shots.add(fase); await espera(600); await p.screenshot({ path: `${out}-presentador-${id}-${fase}.png` }); }
      console.log('  ', id, '[' + (frases.size === 1 ? 'entra' : (await p.evaluate(() => window.__mec.filter(m => m.startsWith('copro ')).slice(-1)[0] || ''))) + ']', '«' + bb[1] + '»');
    }
    if (bb && bb[0] === nombre && /Adiós|adiós|honor|Gracias por dejarme|estamos fuera|Apago|mañana|recoger|desmaquillo|placer/.test(bb[1]) && !shots.has('despedida')) { shots.add('despedida'); await p.screenshot({ path: `${out}-presentador-${id}-despedida.png` }); }
    fin = await p.evaluate(() => !document.getElementById('menu').classList.contains('hidden') || !!document.getElementById('finCard') || (window.__mec || []).some(m => /^fin|outro/.test(m))).catch(() => false);
    if (fin && shots.has('despedida')) break;
    const st = await p.evaluate(() => !window.__copro.estado().activo && window.__mec.some(m => m.startsWith('presentador sorpresa')));
    if (st && frases.size > 3) { await espera(3000); break; }
  }
  const mec = await p.evaluate(() => window.__mec);
  r1[id] = { etapa, frases: frases.size, mec: mec.filter(m => /presentador|etapa|decision|bote|plantado/.test(m)), activoAlFinal: (await p.evaluate(() => window.__copro.estado())).activo };
  console.log('PROGRAMA', id, JSON.stringify(r1[id])); await p.close();
}
// 2) Secciones: lista del menú + una escena nueva de cada sección
const r2 = {};
for (const [modo, sub] of (process.env.ESCENAS ? JSON.parse(process.env.ESCENAS) : [['oculta', 'loro'], ['tomas', 'mosca'], ['fuera', 'cafetera']])) {
  const p = await abre('mode=' + modo + '&sub=' + sub);
  const datos = await p.evaluate(m => window.__extras.datos[m].length, modo); r2[modo] = datos;
  await espera(9000); await p.screenshot({ path: `${out}-${modo}-escena.png` });
  await p.waitForFunction('!document.getElementById("exLook") && document.querySelectorAll("#actions button").length', { timeout: 300000 }).catch(() => console.log('TIMEOUT', modo));
  console.log(modo, sub, 'escenas', datos, 'MEC', JSON.stringify((await p.evaluate(() => window.__mec)).slice(-2)));
  // menú de la sección
  await p.evaluate(m => { const b = [...document.querySelectorAll('#actions button')].find(x => /Lista/.test(x.textContent)); b && b.click(); }, modo); await espera(1500);
  const n = await p.evaluate(() => document.querySelectorAll('#menu button').length); console.log(modo, 'botones en el menú', n);
  await p.screenshot({ path: `${out}-${modo}-menu.png` }); await p.close();
}
// 3) Opciones: fila nueva
{ const p = await abre('mode=main'); await p.evaluate(() => { const b = [...document.querySelectorAll('#menu button')].find(x => /Opciones/.test(x.textContent)); b && b.click(); }); await espera(1200);
  console.log('opcion presentador sorpresa', await p.evaluate(() => !!document.getElementById('rowCopro'))); await p.evaluate(() => document.getElementById('rowCopro')?.scrollIntoView()); await p.screenshot({ path: `${out}-opciones.png` }); await p.close(); }
console.log('RESUMEN', JSON.stringify({ r1, r2 }));
console.log('ERRORES', errs.length, errs.slice(0, 10)); await b.close();
