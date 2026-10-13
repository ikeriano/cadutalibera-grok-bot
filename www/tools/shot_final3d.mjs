import puppeteer from 'puppeteer-core';
const [base, out, lang = 'it', mode = 'entrenamiento', sub = 'final', waits = '6,14,25'] = process.argv.slice(2);
const b = await puppeteer.launch({ executablePath: '/usr/bin/google-chrome', headless: 'new', protocolTimeout: 600000, args: ['--no-sandbox', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--autoplay-policy=no-user-gesture-required', '--mute-audio'] });
const p = await b.newPage(); await p.setViewport({ width: 1024, height: 768 });
p.on('pageerror', e => console.log('PAGEERROR', e.message));
await p.evaluateOnNewDocument((l) => { localStorage.setItem('ac_lang', l); localStorage.setItem('ac3d_opts', JSON.stringify({ quality: 'baja', gradas: false, voz: false, chistes: false, monologo: false })); window.__noCabVideo = true; window.__noMono = true; window.__noAviso = true; }, lang);
await p.goto(base + 'index.html?mode=' + mode + '&sub=' + sub); await p.waitForFunction('window.__eng && document.getElementById("loading").classList.contains("hidden")', { timeout: 120000 }).catch(() => console.log('timeout'));
let t0 = Date.now(), k = 0;
for (const w of waits.split(',').map(Number)) { await new Promise(r => setTimeout(r, Math.max(0, w * 1000 - (Date.now() - t0)))); await p.screenshot({ path: `${out}-${++k}.png` }); }
await b.close();
