import puppeteer from 'puppeteer-core';
const b = await puppeteer.launch({ executablePath: '/usr/bin/google-chrome', headless: 'new', protocolTimeout: 300000, args: ['--no-sandbox', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--autoplay-policy=no-user-gesture-required'] });
const W = ms => new Promise(r => setTimeout(r, ms));
for (const lang of ['es', 'pt']) {
  const p = await b.newPage(); await p.setViewport({ width: 1280, height: 720 });
  p.on('pageerror', e => console.log(lang, 'PAGEERROR', e.message));
  await p.evaluateOnNewDocument(l => { localStorage.setItem('ac_lang', l); window.__noAviso = true; }, lang);
  await p.goto('http://localhost:8811/index.html'); await p.waitForFunction('window.__eng && document.getElementById("loading").classList.contains("hidden")', { timeout: 120000 }); await W(3000);
  await p.screenshot({ path: `/workspace/acerte/shot-${lang}-1-portada.png` });
  await p.mouse.click(640, 600); await W(2500); await p.screenshot({ path: `/workspace/acerte/shot-${lang}-2-menu.png` });
  const txt = await p.evaluate(() => document.getElementById('menu').innerText.slice(0, 600)); console.log(lang, JSON.stringify(txt));
  const clic = async re => p.evaluate(r => { const e = [...document.querySelectorAll('#menu button, #menu .item, #menu [class*=card], #menu div')].find(x => new RegExp(r, 'i').test(x.innerText || '') && x.children.length < 4); if (e) { e.click(); return e.innerText.slice(0, 40); } return null; }, re);
  console.log(lang, 'opc', await clic('^\\s*⚙?\\s*(Opciones|Opções)')); await W(2000); await p.screenshot({ path: `/workspace/acerte/shot-${lang}-3-opciones.png` });
  await p.evaluate(() => { const r = document.getElementById('rowIdioma'); r && r.scrollIntoView(); }); await W(800); await p.screenshot({ path: `/workspace/acerte/shot-${lang}-4-idioma.png` });
  await p.close();
}
await b.close();
