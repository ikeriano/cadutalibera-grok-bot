import puppeteer from 'puppeteer-core';
const [base, out, lang = 'it', W = 600, H = 960] = process.argv.slice(2);
const b = await puppeteer.launch({ executablePath: '/usr/bin/google-chrome', headless: 'new', args: ['--no-sandbox', '--autoplay-policy=no-user-gesture-required', '--mute-audio'] });
const p = await b.newPage(); await p.setViewport({ width: +W, height: +H }); const errs = [];
p.on('pageerror', e => errs.push(e.message));
await p.evaluateOnNewDocument((l) => { delete window.PointerEvent; window.PointerEvent = undefined; localStorage.setItem('ac_lang', l); localStorage.setItem('cl_prof', JSON.stringify({ n: 'Iker', g: 'm' })); }, lang);
await p.goto(base + '/clasico_cl/index.html?v=t'); await new Promise(r => setTimeout(r, 1500));
const w = (ms) => new Promise(r => setTimeout(r, ms));
await p.evaluate(() => { const C = window.__CL; C.nuovaPartita(); C.G.bank = 85000; C.G.opp.forEach(o => o.out = true); setTimeout(C.giocoFinale, 1200); }); await w(1200);
await w(1800); await p.screenshot({ path: out + '-1titolo.png' });
await w(5200); await p.screenshot({ path: out + '-2finale.png' });
// risponde 3 domande con la tastiera a schermo
for (let k = 0; k < 3; k++) { await p.evaluate(() => { const D = window.__CL.D; const need = D.ans.filter((c, i) => !D.fixed[i] && c !== ' ').map(c => c.normalize('NFD').replace(/[\u0300-\u036f]/g, '')); const kb = document.getElementById('kb'); kb.value = need.join(''); kb.dispatchEvent(new Event('input')); }); await w(1300); }
await p.evaluate(() => { const D = window.__CL.D; const need = D.ans.filter((c, i) => !D.fixed[i] && c !== ' '); const kb = document.getElementById('kb'); kb.value = need.slice(0, 1).join(''); kb.dispatchEvent(new Event('input')); });
await w(300); await p.screenshot({ path: out + '-3progresso.png' });
await p.evaluate(() => { window.__CL.D.t = 1200; }); await w(5600); await p.screenshot({ path: out + '-4caduta.png' });
await w(3500); await p.screenshot({ path: out + '-5fine.png' });
// vittoria
await p.evaluate(() => { const C = window.__CL; C.nuovaPartita(); C.G.bank = 85000; C.G.opp.forEach(o => o.out = true); setTimeout(C.giocoFinale, 1200); }); await w(1200); await w(7500);
for (let k = 0; k < 10; k++) { await p.evaluate(() => { const D = window.__CL.D; if (!D.ans) return; const need = D.ans.filter((c, i) => !D.fixed[i] && c !== ' ').map(c => c.normalize('NFD').replace(/[\u0300-\u036f]/g, '')); const kb = document.getElementById('kb'); kb.value = need.join(''); kb.dispatchEvent(new Event('input')); }); await w(1100); }
await w(2200); await p.screenshot({ path: out + '-6vittoria.png' }); await w(4500); await p.screenshot({ path: out + '-7fine.png' });
console.log('ERR', errs); await b.close();
