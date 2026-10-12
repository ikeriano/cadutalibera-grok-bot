// ===== ¡Ahora caigo! 1.1 · detalles del programa brasileño (vídeo de referencia):
// teclado QWERTY en el tablero, moneda dorada sobre el oponente elegido, moneda que se agrieta, cortinillas giratorias
// con el emblema de las huellas, trampilla roja con vacío negro, «FIN DEL JUEGO» en el Desafío Final.
(function () {
  const css = document.createElement('style');
  css.textContent = `
#acKb{position:absolute;left:158px;top:232px;width:624px;padding:4px 0 0;box-sizing:border-box;height:96px;z-index:60;display:none;user-select:none;background:linear-gradient(#0a2a9a,#061660);border-radius:10px;box-shadow:0 0 0 2px #2a6aff inset}
#acKb .f{display:flex;justify-content:center;gap:5px;margin-bottom:4px}
#acKb b{flex:0 0 48px;height:25px;line-height:25px;text-align:center;font:700 17px/25px Arial,sans-serif;color:#0a1a5a;background:linear-gradient(#ffffff,#cfd8ff);border:2px solid #1f3a9a;border-radius:5px;cursor:pointer;box-shadow:0 2px 0 #06124a}
#acKb b:active,#acKb b.on{background:linear-gradient(#ffe27a,#f3b212)}
#acKb b.w{flex-basis:70px}
#acWipe{position:fixed;inset:0;z-index:9000;pointer-events:none;display:flex;align-items:center;justify-content:center;background:radial-gradient(circle,#0a3cff 0,#03114a 70%);opacity:0}
#acWipe canvas{width:min(60vw,60vh);height:min(60vw,60vh)}
#acWipe.go{animation:acW 1.1s ease-in-out forwards}#acWipe.go canvas{animation:acWr 1.1s ease-in-out forwards}
@keyframes acW{0%{opacity:0;clip-path:circle(0 at 50% 50%)}35%{opacity:1;clip-path:circle(75% at 50% 50%)}70%{opacity:1;clip-path:circle(75% at 50% 50%)}100%{opacity:0;clip-path:circle(0 at 50% 50%)}}
@keyframes acWr{0%{transform:rotate(-540deg) scale(.2)}50%{transform:rotate(0) scale(1)}100%{transform:rotate(360deg) scale(1.6)}}
#acCoin{position:fixed;left:50%;top:44%;width:360px;height:360px;margin:-180px 0 0 -180px;z-index:8000;pointer-events:none}
#acCoin .h{position:absolute;top:0;width:180px;height:360px;overflow:hidden;transition:transform .7s cubic-bezier(.3,1.6,.5,1)}
#acCoin .h i{position:absolute;top:0;width:360px;height:360px;border-radius:50%;border:8px solid #9aa6d8;box-sizing:border-box}
#acCoin .l{left:0}#acCoin .l i{left:0;background:radial-gradient(circle at 35% 35%,#ffffff,#b8c0dc 60%,#6d7598)}
#acCoin .r{right:0}#acCoin .r i{right:0;background:radial-gradient(circle at 65% 35%,#fff3b0,#e6b32a 60%,#8a5a06)}
#acCoin .k{position:absolute;left:174px;top:0;width:12px;height:360px;background:#000;clip-path:polygon(50% 0,100% 12%,0 26%,100% 40%,0 55%,100% 70%,0 84%,50% 100%,40% 100%,0 84%,90% 70%,0 55%,90% 40%,0 26%,90% 12%,40% 0);opacity:0;transition:opacity .2s}
#acCoin .p{position:absolute;left:50%;top:50%;background:rgba(3,12,60,.92);border:3px solid #ffd23a;border-radius:16px;padding:10px 22px;transform:translate(-50%,-50%) scale(.2);opacity:0;font:900 44px/1.05 Impact,Arial Black,sans-serif;color:#ffd23a;text-shadow:0 0 18px #ff9a00,0 3px 0 #6a3a00;white-space:nowrap;text-align:center;transition:all .5s cubic-bezier(.3,1.6,.5,1)}
#acCoin .p.mal{color:#5aff6a;text-shadow:0 0 18px #0a8a1a,0 3px 0 #003a00}
#acCoin.ab .k{opacity:1}#acCoin.sep .l{transform:translate(-150px,30px) rotate(-28deg)}#acCoin.sep .r{transform:translate(150px,30px) rotate(28deg)}#acCoin.sep .k{opacity:0}#acCoin.sep .p{transform:translate(-50%,-50%) scale(1);opacity:1}
#acFin{position:fixed;inset:0;z-index:8500;display:flex;align-items:center;justify-content:center;pointer-events:none;font:900 min(14vw,120px)/1 Impact,Arial Black,sans-serif;color:#ff2a3a;text-shadow:0 0 30px #000,0 6px 0 #4a0008;animation:acF 3.2s ease forwards}
@keyframes acF{0%{opacity:0;transform:scale(2.4)}15%{opacity:1;transform:scale(1)}80%{opacity:1}100%{opacity:0}}`;
  document.head.appendChild(css);

  // emblema metálico circular con dos huellas amarillas (dibujado, sin recursos del Scratch)
  function emblema(c) {
    const g = c.getContext('2d'), w = c.width, m = w / 2;
    let gr = g.createRadialGradient(m * 0.7, m * 0.6, 10, m, m, m); gr.addColorStop(0, '#ffffff'); gr.addColorStop(0.55, '#9aa6c8'); gr.addColorStop(1, '#3a4468');
    g.fillStyle = gr; g.beginPath(); g.arc(m, m, m - 4, 0, 7); g.fill();
    g.fillStyle = '#0a1a5a'; g.beginPath(); g.arc(m, m, m * 0.8, 0, 7); g.fill();
    g.strokeStyle = '#ffb21a'; g.lineWidth = m * 0.05; g.beginPath(); g.arc(m, m, m * 0.74, 0, 7); g.stroke();
    const pie = (x, y, s, rot) => { g.save(); g.translate(x, y); g.rotate(rot); g.fillStyle = '#ffd23a'; g.shadowColor = '#ff9a00'; g.shadowBlur = 18;
      g.beginPath(); g.ellipse(0, -s * 0.35, s * 0.36, s * 0.52, 0, 0, 7); g.fill(); g.beginPath(); g.ellipse(0, s * 0.55, s * 0.26, s * 0.3, 0, 0, 7); g.fill();
      for (let i = 0; i < 5; i++) { g.beginPath(); g.arc(-s * 0.3 + i * s * 0.15, -s * 1.0 - (i === 0 ? s * 0.05 : 0), s * (i === 0 ? 0.12 : 0.08), 0, 7); g.fill(); } g.restore(); };
    pie(m - m * 0.2, m + m * 0.02, m * 0.3, -0.15); pie(m + m * 0.2, m - m * 0.08, m * 0.3, 0.15);
  }
  window.__acEmblema = emblema;
  let wipe = null;
  window.__acWipe = () => {
    try {
      if (!wipe) { wipe = document.createElement('div'); wipe.id = 'acWipe'; const c = document.createElement('canvas'); c.width = c.height = 512; emblema(c); wipe.appendChild(c); document.body.appendChild(wipe); }
      wipe.classList.remove('go'); void wipe.offsetWidth; wipe.classList.add('go'); window.__acWipes = (window.__acWipes || 0) + 1;
    } catch (e) { }
  };

  // moneda que se agrieta y revela el premio
  const etiqueta = v => v === 'vida' ? '❤ VIDA EXTRA' : v === 'cero' ? '☠ PIERDE TODO' : v === 'mitad' ? '÷ 2' : v === 'doble' ? 'x 2' : String(+String(v).replace('+', '')) + ' €'.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  window.__acGrieta = async (v, lado, s) => {
    try {
      const d = document.createElement('div'); d.id = 'acCoin';
      d.innerHTML = `<div class="h l"><i></i></div><div class="h r"><i></i></div><div class="k"></div><div class="p${v === 'cero' ? ' mal' : ''}">${etiqueta(v)}</div>`;
      document.body.appendChild(d); window.__acGrietaUlt = etiqueta(v);
      const w = ms => s && s.w ? s.w(ms) : new Promise(r => setTimeout(r, ms));
      await w(250); d.classList.add('ab'); try { F.play('saltar@Moeda1'); } catch (e) { }
      await w(450); d.classList.add('sep'); await w(1500); d.style.transition = 'opacity .3s'; d.style.opacity = '0'; setTimeout(() => d.remove(), 400);
    } catch (e) { }
  };

  // moneda dorada de huellas flotando sobre el oponente elegido
  window.__acMonedaSobre = (eng, r) => {
    try {
      const op = eng.opps && eng.opps[r - 1]; if (!op) return;
      const tx = Vt(256, 256, (g) => { const gr = g.createRadialGradient(100, 90, 10, 128, 128, 128); gr.addColorStop(0, '#fff6c0'); gr.addColorStop(0.6, '#f0b62a'); gr.addColorStop(1, '#8a5a06');
        g.fillStyle = gr; g.beginPath(); g.arc(128, 128, 124, 0, 7); g.fill(); const e2 = document.createElement('canvas'); e2.width = e2.height = 256; emblema(e2); g.globalAlpha = 0.9; g.drawImage(e2, 28, 28, 200, 200); });
      const mat = new Ie({ map: tx, side: Et, transparent: true, toneMapped: false });
      const m = new V(new ke(0.55, 0.55, 0.08, 40), [new Ie({ color: 0xc89a1a }), mat, mat]);
      m.rotation.x = Math.PI / 2; const grp = new ft(); grp.add(m); eng.scene.add(grp);
      const t0 = performance.now(); window.__acMoneda = grp;
      const anim = () => { if (!grp.parent) return; const t = (performance.now() - t0) / 1000; const p = op.root.position;
        grp.position.set(p.x, p.y + 2.9 + Math.sin(t * 3) * 0.12, p.z); grp.rotation.y = t * 2.4;
        if (t > 4.5) { eng.scene.remove(grp); return; } requestAnimationFrame(anim); };
      anim();
    } catch (e) { console.warn('acMoneda', e); }
  };

  // vacío negro en la trampilla mientras cae el concursante
  window.__acAro = (n, e, on) => {
    try { const h = n.studio.holes[e];
      if (on) { if (h.__aroRojo) return; const m = new V(new bn(h.r * 1.1, h.r * 0.1, 12, 72), new Ie({ color: 0xff1a2a, toneMapped: false })); m.rotation.x = Math.PI / 2; m.position.copy(h.pos); m.position.y += 0.06; (n.studio.root || n.scene).add(m); h.__aroRojo = m; }
      else if (h.__aroRojo) { h.__aroRojo.parent && h.__aroRojo.parent.remove(h.__aroRojo); h.__aroRojo = null; }
    } catch (x) { }
  };
  window.__acVacio = (n, e, on) => {
    if (!on) window.__acAro(n, e, false);
    try { const h = n.studio.holes[e]; [h.doorA, h.doorB].forEach(d => d.children.forEach(c => { c.material.__c ??= c.material.color.getHex(); c.material.color.setHex(on ? 0 : c.material.__c); })); } catch (x) { }
  };

  window.__acFin = () => {
    try { const d = document.createElement('div'); d.id = 'acFin'; d.textContent = window.__LANG === 'it' ? 'FINE DEL GIOCO' : 'FIN DEL JUEGO'; document.body.appendChild(d); setTimeout(() => d.remove(), 3300); try { F.play('DropM.mp3'); } catch (e) { } } catch (e) { }
  };

  // teclado QWERTY bajo las casillas en blanco del tablero de preguntas
  const instala = () => { let h; try { h = hu; } catch (e) { return false; } if (!h || !document.getElementById('panelBox')) return false;
  try {
    const box = document.getElementById('panelBox'), kb = document.createElement('div'); kb.id = 'acKb';
    const filas = ['QWERTYUIOP', 'ASDFGHJKLÑ', 'ZXCVBNM'];
    kb.innerHTML = filas.map((f, i) => `<div class="f">${[...f].map(k => `<b data-k="${k}">${k}</b>`).join('')}${i === 2 ? '<b class="w" data-k="⌫">⌫</b>' : ''}</div>`).join('');
    box.appendChild(kb);
    const pulsa = k => { if (!hu.active) return; if (k === '⌫') hu.input.value = hu.input.value.slice(0, -1); else hu.input.value += k; hu.onInput(); };
    kb.addEventListener('pointerdown', ev => { const b = ev.target.closest('b'); if (!b) return; ev.preventDefault(); ev.stopPropagation(); b.classList.add('on'); setTimeout(() => b.classList.remove('on'), 140); pulsa(b.dataset.k); });
    kb.addEventListener('click', ev => { ev.preventDefault(); ev.stopPropagation(); });
    const rs = hu.renderSlots.bind(hu), si = hu.stopInput.bind(hu);
    hu.renderSlots = (...a) => { rs(...a); kb.style.display = hu.active ? 'block' : 'none'; };
    hu.stopInput = (...a) => { si(...a); kb.style.display = 'none'; };
    const ha = hu.hideAll && hu.hideAll.bind(hu); if (ha) hu.hideAll = (...a) => { kb.style.display = 'none'; return ha(...a); };
  } catch (e) { console.warn('acKb', e); }
  return true; };
  const iv = setInterval(() => { if (instala()) { clearInterval(iv); try { window.__hu = hu; } catch (e) { } } }, 300);
  // ayuda para pruebas: caída de un oponente con el aro rojo y el vacío negro
  window.__acPruebaCaida = async (e = 3) => { const s = { w: ms => new Promise(r => setTimeout(r, ms)), alive: true, until: async f => { while (!f()) await new Promise(r => setTimeout(r, 100)); } }; const c = { eng: Xe, hud: yn, st: du, panel: hu, s }; try { await new sy(c).caida(e, Xe.opps[e - 1]); } catch (x) { return String(x); } return 'ok'; };
  window.__ii = typeof ii === 'function' ? ii : null;
})();
