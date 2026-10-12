import puppeteer from 'puppeteer-core';
const [url, expr, out] = process.argv.slice(2);
const b = await puppeteer.launch({ executablePath: '/usr/bin/google-chrome', headless: 'new', args: ['--no-sandbox', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist','--autoplay-policy=no-user-gesture-required'] });
const p = await b.newPage(); await p.setViewport({ width: 1280, height: 720 });
p.on('pageerror', e => console.log('PAGEERROR', e.message)); p.on('console', m => { if (['error','warning','warn'].includes(m.type())) console.log('C', m.text().slice(0,300)); });
await p.goto(url); await p.waitForFunction('window.__eng && document.getElementById("loading").classList.contains("hidden")', { timeout: 90000 }).catch(e => console.log('timeout'));
await new Promise(r => setTimeout(r, 3000));
if (expr) { try { console.log('R', JSON.stringify(await p.evaluate(expr)).slice(0,3000)); } catch (e) { console.log('EVALERR', e.message); } }
if (out) { await new Promise(r => setTimeout(r, 2500)); await p.screenshot({ path: out }); }
await b.close();
