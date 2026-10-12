import puppeteer from 'puppeteer-core'; import fs from 'fs';
const [lang, out, h] = process.argv.slice(2);
const b = await puppeteer.launch({ executablePath: '/usr/bin/google-chrome', headless: 'new', args: ['--no-sandbox', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const p = await b.newPage(); await p.setViewport({ width: 1280, height: 720 });
await p.evaluateOnNewDocument((l) => { localStorage.setItem('ac_lang', l); }, lang);
await p.goto('http://localhost:8823/index.html'); await p.waitForFunction('window.__eng && document.getElementById("loading").classList.contains("hidden")', { timeout: 90000 }).catch(e => console.log('timeout'));
await new Promise(r => setTimeout(r, 3000));
const url = await p.evaluate((h) => { const e = window.__eng; const cam = e.camera.clone(); cam.fov = 60; cam.position.set(0, +h, 0.01); cam.up.set(0, 0, -1); cam.lookAt(0, 0, 0); cam.updateProjectionMatrix(); cam.updateMatrixWorld(); e.renderer.render(e.scene, cam); return e.renderer.domElement.toDataURL('image/png'); }, h || 30);
fs.writeFileSync(out, Buffer.from(url.split(',')[1], 'base64')); await b.close();
