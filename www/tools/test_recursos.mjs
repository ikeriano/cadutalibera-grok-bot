// Prueba de Opciones › «Cargar sb3 / sonidos / sprites» con un sb3 de prueba generado (tools/gen_sb3_prueba.py)
import puppeteer from 'puppeteer-core';
const base = process.argv[2], out = process.argv[3] || 'tmp/rec';
const SB3 = process.argv[4] || 'tmp/test_sb3/prueba.sb3';
const b = await puppeteer.launch({ executablePath: '/usr/bin/google-chrome', headless: 'new', args: ['--no-sandbox', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--autoplay-policy=no-user-gesture-required'] });
const p = await b.newPage(); await p.setViewport({ width: 1100, height: 680 }); let err = 0;
p.on('pageerror', e => { err++; console.log('PAGEERROR', e.message); });
p.on('console', m => { if (m.type() === 'error' && !/favicon|404|ERR_FILE_NOT_FOUND|Failed to load resource/.test(m.text())) { err++; console.log('ERR', m.text()); } });
p.on('dialog', d => d.accept());
await p.evaluateOnNewDocument(() => { window.__noAviso = true; });
const listo = () => p.waitForFunction('window.__eng && document.getElementById("loading").classList.contains("hidden")', { timeout: 90000 });
const espera = ms => new Promise(r => setTimeout(r, ms));
await p.goto(base + 'index.html?screen=options'); await listo(); await espera(800);
await p.click('#btnRecursos'); await p.waitForSelector('#recContador');
console.log('inicial:', await p.$eval('#recContador', e => e.textContent));
// 1) subir el sb3
const inp = await p.$('#recInSb3'); await inp.uploadFile(SB3);
await p.waitForFunction(() => /Proyecto Scratch|colocados/.test(document.getElementById('recMsg')?.textContent || ''), { timeout: 60000 });
console.log('msg:', await p.$eval('#recMsg', e => e.textContent));
await espera(1500); await listo(); await p.waitForSelector('#recContador', { timeout: 30000 });
console.log('tras sb3:', await p.$eval('#recContador', e => e.textContent), '|', await p.$eval('#recResumen', e => e.innerText.replace(/\n/g, ' · ')));
const info = await p.evaluate(async () => {
  const S = __RC.slots(); const menuH = __rec.menuH(); const pool = __RC.pool();
  // todos los sonidos guardados se pueden decodificar (incluidos los ADPCM convertidos)
  let ok = 0, mal = []; for (const s of S.snd.filter(s => s.h && __RC.estadoHueco(s.key) === 'mio')) { try { const ab = await __RC.snd(s.h); await __rec.decodifica(ab); ok++; } catch (e) { mal.push(s.nombre); } }
  return { imgMenu: __RC.img(menuH).slice(0, 5), logo: !!__RC.logo, pool: pool.map(x => x.kind + ':' + x.nombre), sndOk: ok, sndMal: mal, faltanSnd: S.snd.filter(s => !__RC.estadoHueco(s.key)).map(s => s.nombre) };
});
console.log(JSON.stringify(info));
// 2) asignar el sonido no reconocido a «Música de la cabecera 3D»
await p.evaluate(() => { const sel = [...document.querySelectorAll('#recPool select')].find(s => s.closest('div').textContent.includes('Sonido misterioso')); sel.value = 'cab3d'; sel.dispatchEvent(new Event('change')); });
await espera(600); console.log('asignado:', await p.$eval('#recMsg', e => e.textContent), '| cab3d =', await p.evaluate(() => __RC.estadoHueco('cab3d')));
// 3) sueltos: fallo.wav (alias) + MenuEscolhaop3.png (nombre del sprite)
await (await p.$('#recInSueltos')).uploadFile('tmp/test_sb3/fallo.wav');
await p.waitForFunction(() => /colocados/.test(document.getElementById('recMsg')?.textContent || ''), { timeout: 20000 }); console.log('suelto:', await p.$eval('#recMsg', e => e.textContent));
// 4) subir a un hueco concreto (Despedida) con su botón ⬆️ / 🔁
await p.evaluate(() => [...document.querySelectorAll('#menu button')].find(x => x.textContent === 'Sonidos').click());
await p.evaluate(() => document.querySelectorAll('#recLista details').forEach(d => { if (/Cabeceras|Efectos/.test(d.dataset.grupo)) d.open = true; })); await espera(400);
const [fc] = await Promise.all([p.waitForFileChooser(), p.evaluate(() => { const row = document.querySelector('[data-key="video"]'); row.querySelector('button[title="Subir"],button[title="Cambiar"]').click(); })]);
await fc.accept(['tmp/test_sb3/fallo.wav'].map(x => x)).catch(() => {}); await espera(800);
console.log('hueco suelto video (acepta cualquier archivo en la prueba):', await p.evaluate(() => __RC.estadoHueco('video')));
await p.evaluate(() => { const row = document.querySelector('[data-key="video"]'); const bt = row && row.querySelector('button[title="Borrar"]'); bt && bt.click(); }); await espera(500);
console.log('video tras borrar:', await p.evaluate(() => __RC.estadoHueco('video')));
// escuchar un sonido
await p.evaluate(() => { const bt = document.querySelector('#recLista button[title="Escuchar"]'); bt && bt.click(); }); await espera(500);
console.log('escuchando:', await p.evaluate(() => __rec.audioKey));
// captura 1: lista con grupos abiertos
await p.evaluate(() => { [...document.querySelectorAll('#menu button')].find(x => x.textContent === 'Todo').click(); });
await p.evaluate(() => { document.querySelectorAll('#recLista details').forEach(d => { if (/Huellas|Efectos/.test(d.dataset.grupo || '')) d.open = true; }); }); await espera(800);
await p.evaluate(() => { const c = document.querySelector('#menu .col'); const t = document.getElementById('recResumen'); c.scrollTop = t.offsetTop - 60; });
await espera(500); await p.screenshot({ path: out + '_lista.jpg', quality: 78 });
await p.evaluate(() => { const c = document.querySelector('#menu .col'); const t = document.querySelector('#recLista details[data-grupo*="Huellas"]'); c.scrollTop = t.offsetTop - 10; }); await espera(600); await p.screenshot({ path: out + '_huellas.jpg', quality: 78 });
// 5) «Aplicar» y comprobar que las imágenes se usan en el juego (pantallas 3D y gráficos 2D)
await p.goto(base + 'index.html?mode=explorar'); await listo(); await espera(6000);
await p.screenshot({ path: out + '_juego_explorar.jpg', quality: 78 });
await p.goto(base + 'index.html?mode=entrenamiento&sub=duelo'); await listo(); await espera(9000); await p.screenshot({ path: out + '_juego_duelo.jpg', quality: 78 });
console.log('img en juego:', await p.evaluate(() => [...document.querySelectorAll('#stage2d img')].slice(0, 6).map(i => i.src.slice(0, 5)).join(',')));
// 6) interruptor «Usar mis archivos»
await p.goto(base + 'index.html?screen=recursos'); await listo(); await p.waitForSelector('#recUsarNo'); await p.click('#recUsarNo'); await espera(1500); await listo(); await p.waitForSelector('#recContador');
console.log('usar=No →', await p.evaluate(() => [__RC.usar, __RC.img(__rec.menuH()).slice(0, 5)].join(' ')));
await p.click('#recUsarSi'); await espera(1500); await listo(); await p.waitForSelector('#recContador');
console.log('usar=Sí →', await p.evaluate(() => [__RC.usar, __RC.img(__rec.menuH()).slice(0, 5)].join(' ')), '|', await p.$eval('#recContador', e => e.textContent));
console.log('ERRORES:', err); await b.close();
