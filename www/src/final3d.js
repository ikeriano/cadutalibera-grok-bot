// ===================================================================================================
// JUEGO FINAL (3D): rótulo «JUEGO FINAL / GIOCO FINALE», teclado A–Z en dos filas, botón PASA/PASSA,
// reloj amarillo de huellas y huellas doradas grandes abajo (como en las capturas de referencia).
// ===================================================================================================
(() => {
  const IT = () => window.__LANG === 'it';
  const css = document.createElement('style'); css.textContent = `
#jfTitulo{position:fixed;left:0;right:0;bottom:4%;z-index:90;text-align:center;pointer-events:none;font:900 clamp(48px,11vw,140px)/1 "Arial Black",Arial,sans-serif;letter-spacing:.04em;color:#fff6e0;
 background:linear-gradient(#ffffff 0%,#fff1c8 45%,#e9b97a 55%,#fff 100%);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;
 filter:drop-shadow(0 4px 0 #7a4a10) drop-shadow(0 8px 10px rgba(0,0,0,.6));animation:jfIn 3.2s ease both}
@keyframes jfIn{0%{opacity:0;transform:scale(1.6)}15%{opacity:1;transform:scale(1)}85%{opacity:1}100%{opacity:0}}
body.jf #acKb{background:transparent;box-shadow:none;height:auto}
body.jf #acKb b{flex:0 0 40px;height:38px;font:900 26px/38px Arial,sans-serif;color:#fff;background:linear-gradient(#a0602a,#5a2c0a);border:2px solid #ffd27a;border-radius:3px;box-shadow:0 2px 0 #2a1200;text-shadow:0 1px 0 #000}
body.jf #acKb b.on{background:linear-gradient(#ffe27a,#f3b212);color:#3a1a00}
body.jf #acKb b.w{flex-basis:46px;font-size:20px}
#jfPasa{position:absolute;right:-118px;top:30px;width:92px;height:32px;font:900 21px/32px Arial,sans-serif;color:#fff;text-align:center;background:linear-gradient(#b07038,#5a2c0a);border:2px solid #fff;border-radius:3px;cursor:pointer;letter-spacing:.06em;box-shadow:0 2px 0 #2a1200}
body.jf #btnPasar{display:none!important}
#jfHuellas{position:fixed;left:0;right:0;bottom:0;height:42%;z-index:55;pointer-events:none;display:none;
}
body.jf #jfHuellas{display:block}
#jfHuellas svg{position:absolute;bottom:-6%;width:24%;opacity:.5}`;
  document.head.appendChild(css);
  const pie = (x, r) => `<svg viewBox="0 0 200 200" style="${x}"><g fill="#ffd25a" stroke="#c88a10" stroke-width="5" transform="rotate(${r} 100 100)"><ellipse cx="70" cy="70" rx="26" ry="44"/><ellipse cx="70" cy="150" rx="22" ry="26"/><ellipse cx="135" cy="60" rx="26" ry="44"/><ellipse cx="135" cy="140" rx="22" ry="26"/></g><circle cx="100" cy="100" r="96" fill="none" stroke="#ffd25a" stroke-width="5"/></svg>`;
  const hu = document.createElement('div'); hu.id = 'jfHuellas'; hu.innerHTML = pie('left:-4%', -20) + pie('right:-4%', 20); document.body.appendChild(hu);
  window.__jfTitulo = (ms = 3200) => new Promise(async r => { for (let i = 0; i < 100; i++) { const l = document.getElementById('loading'); if (!l || l.classList.contains('hidden')) break; await new Promise(q => setTimeout(q, 100)); } const d = document.createElement('div'); d.id = 'jfTitulo'; d.textContent = IT() ? 'GIOCO FINALE' : 'JUEGO FINAL'; document.body.appendChild(d); setTimeout(() => { d.remove(); r(); }, ms); });
  try { window.__du = du; } catch (e) { }
  let kbFinal = false;
  const filas = (fin) => fin ? ['ABCDEFGHIJKLM', 'NOPQRSTUVWXYZ'] : ['QWERTYUIOP', 'ASDFGHJKLÑ', 'ZXCVBNM'];
  const pinta = (kb, fin) => { const f = filas(fin); kb.innerHTML = f.map((r, i) => `<div class="f">${[...r].map(k => `<b data-k="${k}">${k}</b>`).join('')}${i === f.length - 1 ? '<b class="w" data-k="⌫">⌫</b>' : ''}</div>`).join(''); };
  const color = (on) => { try { for (const k of ['Relogio2', 'd1', 'd2', 'd3', 'd4']) { let el = null; try { el = window.__hu.st.els.get(k); } catch (e) { } if (el) el.style.filter = on && k === 'Relogio2' ? 'hue-rotate(48deg) saturate(1.6) brightness(1.25)' : ''; } } catch (e) { } };
  setInterval(() => {
    const kb = document.getElementById('acKb'); const fin = !!window.__jfClock && !!(window.__hu && window.__hu.active);
    document.body.classList.toggle('jf', !!window.__jfClock && document.getElementById('panelBox') && getComputedStyle(document.getElementById('panelBox')).display !== 'none');
    if (kb && fin !== kbFinal) { kbFinal = fin; pinta(kb, fin); let p = document.getElementById('jfPasa'); if (fin && !p) { p = document.createElement('div'); p.id = 'jfPasa'; kb.appendChild(p); p.addEventListener('pointerdown', ev => { ev.preventDefault(); ev.stopPropagation(); const h = window.__hu; h && h.pasaCb && h.pasaCb(); }); } if (p) { p.textContent = IT() ? 'PASSA' : 'PASA'; p.style.display = fin ? 'block' : 'none'; } }
    color(!!window.__jfClock);
  }, 150);
})();
