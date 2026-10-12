import puppeteer from 'puppeteer-core';
const [url, out] = process.argv.slice(2);
const b = await puppeteer.launch({ executablePath: '/usr/bin/google-chrome', headless: 'new', args: ['--no-sandbox', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const p = await b.newPage(); await p.setViewport({ width: 1280, height: 720 });
p.on('pageerror', e => console.log('PAGEERROR', e.message)); p.on('console', m => { if (m.type() === 'error') console.log('ERR', m.text()); });
await p.goto(url); await p.waitForFunction('window.__eng && document.getElementById("loading").classList.contains("hidden")', { timeout: 60000 }).catch(e => console.log('timeout')); await new Promise(r => setTimeout(r, 4000));
await p.screenshot({ path: out }); await b.close();
