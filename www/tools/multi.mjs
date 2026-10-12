import puppeteer from 'puppeteer-core'; import fs from 'fs';
const [lang, pasosF] = process.argv.slice(2); const pasos = JSON.parse(fs.readFileSync(pasosF));
const b = await puppeteer.launch({ executablePath: '/usr/bin/google-chrome', headless: 'new', args: ['--no-sandbox', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--autoplay-policy=no-user-gesture-required'] });
const p = await b.newPage(); await p.setViewport({ width: 1280, height: 720 });
p.on('pageerror', e => console.log('PAGEERROR', e.message));
await p.evaluateOnNewDocument((l) => { localStorage.setItem('ac_lang', l); window.__noAviso = true; window.__clk = (r) => { const L = [...document.querySelectorAll('button,div,span,a,label')].filter(e => e.offsetParent && e.children.length < 4 && new RegExp(r, 'i').test((e.innerText || '').trim())); L.sort((a, b) => a.innerText.length - b.innerText.length); if (L[0]) { L[0].click(); return 'ok ' + L[0].innerText.slice(0, 40); } return 'NO ' + r; }; }, lang);
await p.goto('http://localhost:8823/' + (pasos.url || 'index.html')); await p.waitForFunction('document.getElementById("loading")?document.getElementById("loading").classList.contains("hidden"):true', { timeout: 90000 }).catch(e => console.log('timeout'));
await new Promise(r => setTimeout(r, 3000));
for (const [out, js, w] of pasos.pasos) { if (js && js.startsWith('@')) { const [x, y] = js.slice(1).split(',').map(Number); await p.mouse.click(x, y); } else if (js) console.log(out, await p.evaluate(js).catch(e => 'E ' + e.message)); await new Promise(r => setTimeout(r, w || 2000)); if (out) { await p.screenshot({ path: '/workspace/caduta/shots/' + out + '.png' }); const t = await p.evaluate(() => document.body.innerText); const m = t.match(/.{0,30}(acerte|ou caia|Rafa\b|reais|R\$).{0,30}/gi); if (m) console.log('  VISIBLE:', m.slice(0, 5)); } }
await b.close();
