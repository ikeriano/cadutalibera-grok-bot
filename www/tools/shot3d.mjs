import puppeteer from 'puppeteer-core';
const [lang, out, accion] = process.argv.slice(2);
const b = await puppeteer.launch({ executablePath: '/usr/bin/google-chrome', headless: 'new', args: ['--no-sandbox', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--autoplay-policy=no-user-gesture-required'] });
const p = await b.newPage(); await p.setViewport({ width: 1280, height: 720 });
p.on('pageerror', e => console.log('PAGEERROR', e.message)); p.on('console', m => { if (m.type() === 'error') console.log('ERR', m.text().slice(0, 200)); });
await p.evaluateOnNewDocument((l) => { localStorage.setItem('ac_lang', l); }, lang);
await p.goto('http://localhost:8823/index.html'); await p.waitForFunction('window.__eng && document.getElementById("loading").classList.contains("hidden")', { timeout: 90000 }).catch(e => console.log('timeout'));
await new Promise(r => setTimeout(r, 4000)); await p.screenshot({ path: out + '-1.png' });
await p.mouse.click(640, 400); await new Promise(r => setTimeout(r, 2500)); await p.screenshot({ path: out + '-2.png' });
if (accion) { await p.evaluate(accion); await new Promise(r => setTimeout(r, 9000)); await p.screenshot({ path: out + '-3.png' }); }
await b.close();
