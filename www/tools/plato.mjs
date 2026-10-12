// capturas del plató: node tools/plato.mjs URLBASE plato salida [cam x,y,z,lx,ly,lz]
import puppeteer from 'puppeteer-core';
const [base, plato, out, cam] = process.argv.slice(2);
const b = await puppeteer.launch({ executablePath: '/usr/bin/google-chrome', headless: 'new', args: ['--no-sandbox', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--autoplay-policy=no-user-gesture-required'] });
const p = await b.newPage(); await p.setViewport({ width: 1280, height: 720 });
p.on('pageerror', e => console.log('PAGEERROR', e.message)); p.on('console', m => { if (m.type() === 'error' && !/404|Failed to load|Manifest/.test(m.text())) console.log('ERR', m.text()); });
await p.evaluateOnNewDocument((pl) => { localStorage.setItem('ac3d_opts', JSON.stringify({ plato: pl, quality: 'alta' })); }, plato);
await p.goto(base + 'index.html?screen=main'); await p.waitForFunction('window.__eng && document.getElementById("loading").classList.contains("hidden")', { timeout: 90000 });
await p.evaluate((cam) => { document.getElementById('menu').style.display = 'none'; const e = window.__eng; if (cam) { const c = cam.split(',').map(Number); e.cut(new THREE.Vector3(c[0], c[1], c[2]), new THREE.Vector3(c[3], c[4], c[5])); } }, cam || '');
await new Promise(r => setTimeout(r, 3500)); await p.screenshot({ path: out }); await b.close();
