import puppeteer from 'puppeteer-core';
const [port, lang, out] = process.argv.slice(2);
const b = await puppeteer.launch({ executablePath: '/usr/bin/google-chrome', headless: 'new', args: ['--no-sandbox', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
const p = await b.newPage(); await p.setViewport({ width: 1280, height: 720 });
p.on('pageerror', e => console.log('PAGEERROR', e.message));
await p.evaluateOnNewDocument(l => { localStorage.setItem('ac_lang', l); }, lang);
await p.goto(`http://localhost:${port}/index.html`); await p.waitForFunction('window.__eng', { timeout: 90000 });
await new Promise(r => setTimeout(r, 3000)); await p.mouse.click(640, 600); await new Promise(r => setTimeout(r, 1500));
await p.evaluate("setTimeout(()=>__ii('clasico'))"); await new Promise(r => setTimeout(r, 8000));
const fr = p.frames().map(f => f.url()).filter(u => /clasico/.test(u)); console.log('frames', fr);
const txt = await p.evaluate(() => document.body.innerText); console.log('zip?', /zip|scratch|cargar|carica/i.test(txt) ? 'PROMPT VISIBLE: ' + txt.slice(0, 200) : 'no');
await p.screenshot({ path: out + '-1.png' });
const f = p.frames().find(f => /clasico_cl/.test(f.url()));
if (f) { await f.evaluate(() => { const e = document.querySelector('#bPlay, .play, [data-a=play]') || [...document.querySelectorAll('img,div,button')].find(x => /play/i.test(x.id + x.className + (x.src || ''))); e && e.click(); }); await new Promise(r => setTimeout(r, 4000)); await p.screenshot({ path: out + '-2.png' }); }
await b.close();
