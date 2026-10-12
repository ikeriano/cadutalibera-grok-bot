// modos nuevos v1.11: node tools/test_extras.mjs URL
import puppeteer from 'puppeteer-core';
const [base] = process.argv.slice(2);
const b = await puppeteer.launch({ executablePath: '/usr/bin/google-chrome', headless: 'new', protocolTimeout: 600000, args: ['--no-sandbox', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--autoplay-policy=no-user-gesture-required', '--mute-audio'] });
const errs = []; const espera = ms => new Promise(r => setTimeout(r, ms));
async function abre(q, pre = () => { }) {
  const p = await b.newPage(); await p.setViewport({ width: 1280, height: 720 });
  p.on('pageerror', e => { errs.push(q + ' PAGEERROR ' + e.message); console.log('PAGEERROR', q, e.message); }); p.on('console', m => { if (m.type() === 'error' && !/404|Failed to load|Manifest|bad HTTP/.test(m.text())) { errs.push(q + ' ' + m.text()); console.log('ERR', q, m.text()); } });
  await p.evaluateOnNewDocument(pre); await p.evaluateOnNewDocument(() => { localStorage.setItem('ac3d_opts', JSON.stringify({ quality: 'baja', gradas: false })); window.__noCabVideo = true; window.__noMono = true; window.__noAviso = true; });
  await p.goto(base + 'index.html?' + q); await p.waitForFunction('window.__eng && document.getElementById("loading").classList.contains("hidden")', { timeout: 120000 }); return p;
}
const fin = p => p.waitForFunction('!document.getElementById("exLook") && document.querySelectorAll("#actions button").length', { timeout: 300000 }).catch(() => console.log('TIMEOUT'));
for (const [q, shots, pre] of process.env.SOLO ? [] : [['mode=oculta&sub=trampilla', [9000, 30000], () => { window.__copreForce = 'carmen'; }], ['mode=tomas&sub=equivocada', [5000, 9000], () => { window.__copreForce = false; }], ['mode=fuera&sub=maquillaje', [6000], () => { window.__copreForce = 'concursante'; }], ['mode=fuera&sub=directora', [6000], () => { window.__copreForce = false; }], ['mode=tomas&sub=lio', [1500], () => { window.__copreForce = false; }]]) {
  const p = await abre(q, pre); let t = 0; const nom = q.replace(/mode=|&sub=/g, '_'); for (const [k, ms] of shots.entries()) { await espera(ms - t); t = ms; await p.screenshot({ path: `tmp/ex${nom}_${k}.png` }); }
  await fin(p); await p.screenshot({ path: `tmp/ex${nom}_fin.png` }); console.log(q, 'MEC', JSON.stringify(await p.evaluate(() => window.__mec))); await p.close();
}
// paseo: escaleras, grada, calle y vuelta
{ const p = await abre('mode=paseo'); await espera(2500);
  const r = await p.evaluate(async () => { const e = window.__eng, g = window.__paseo.geo, a = g.ang[0], H = []; for (let s = 0; s < 7; s++) { const rr = g.R0 + (s + 0.5) * (g.R1 - g.R0) / 7; H.push(+e.studio.heightAt(Math.sin(a) * rr, Math.cos(a) * rr).toFixed(2)); } const top = e.studio.heightAt(Math.sin(Math.PI) * (g.R1 + 0.4), Math.cos(Math.PI) * (g.R1 + 0.4)); return { escalera: H, pasarela: top }; });
  console.log('PASEO alturas', JSON.stringify(r));
  // subir andando por la escalera: colocar al pie y caminar hacia fuera
  await p.evaluate(() => { const e = window.__eng, g = window.__paseo.geo, a = g.ang[0]; e.player.root.position.set(Math.sin(a) * (g.R0 - 0.4), 0, Math.cos(a) * (g.R0 - 0.4)); e.yaw = a + Math.PI; });
  await p.keyboard.down('KeyW'); await espera(4500); await p.keyboard.up('KeyW'); await espera(600);
  console.log('tras subir', JSON.stringify(await p.evaluate(() => window.__paseo.pos))); await p.screenshot({ path: 'tmp/ex_paseo_grada.png' });
  await p.evaluate(() => { const e = window.__eng; e.player.root.position.set(0, 0, window.__paseo.Cn - 2.2); e.yaw = Math.PI; });
  await p.keyboard.down('KeyW'); await espera(2500); await p.keyboard.up('KeyW'); await espera(2500);
  console.log('calle', JSON.stringify(await p.evaluate(() => [window.__paseo.fuera, window.__paseo.pos])));
  await p.keyboard.down('KeyS'); await espera(300); await p.keyboard.up('KeyS'); await p.evaluate(() => { window.__eng.yaw = 0; }); await espera(300); await p.keyboard.down('KeyW'); await espera(1200); await p.keyboard.up('KeyW');
  await p.evaluate(() => { window.__eng.yaw = Math.PI; }); await espera(400); await p.keyboard.down('KeyW'); await espera(1500); await p.keyboard.up('KeyW'); await espera(500); await p.screenshot({ path: 'tmp/ex_paseo_calle.png' });
  await p.evaluate(() => { const e = window.__eng; e.yaw = 0; e.player.root.position.z = window.__paseo.Z0 + 1.6; e.player.root.position.x = 0; }); await p.keyboard.down('KeyW'); await espera(1500); await p.keyboard.up('KeyW'); await espera(2000);
  console.log('vuelta', JSON.stringify(await p.evaluate(() => [window.__paseo.fuera, window.__paseo.pos]))); console.log('MEC', JSON.stringify(await p.evaluate(() => window.__mec))); await p.close(); }
// copresentador en Programa completo y en Monólogos
for (const [q, pre] of [['mode=programa', () => { window.__copreForce = 'manolo'; window.__testRodadas = 1; window.__botForce = 'fail'; window.__pruebaForce = 'clasico'; }], ['mode=monologos&sub=tel-dentista', () => { window.__copreForce = 'toni'; }]]) {
  const p = await abre(q, pre);
  await p.evaluate(() => setInterval(() => { try { const sk = document.getElementById('btnSkip'); if (sk && !sk.classList.contains('hidden') && !window.__mec.some(m => m.startsWith('copresentador'))) sk.click(); const pn = window.__panel; if (pn && pn.active && pn.q && !pn.evaluating && pn.input.value === '') { pn.input.value = pn.q.missing.join(''); pn.onInput(); } const st = window.__st; if (st && st.els) for (const [k, el] of st.els) if (el.style.display !== 'none' && el.style.pointerEvents === 'auto' && k !== 'BotãoMenu3') { el.click(); break; } if (window.__e3 && window.__e3.turn === 'me' && window.__e3.q) window.__e3.choose(window.__e3.q[2] ?? 0); } catch (e) { } }, 450));
  await p.waitForFunction('window.__mec.some(m => m.startsWith("copresentador"))', { timeout: 400000 }).catch(() => console.log('SIN COPRESENTADOR', q)); await espera(9000); await p.screenshot({ path: `tmp/ex_copre_${q.slice(5, 13)}.png` });
  console.log(q, 'MEC', JSON.stringify(await p.evaluate(() => window.__mec))); await p.close();
}
console.log('ERRORES', errs.length, errs.slice(0, 8)); await b.close();
