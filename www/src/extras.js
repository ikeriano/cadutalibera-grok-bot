// ===================================================================================================
// CÁMARA OCULTA, TOMAS FALSAS, FUERA DE CÁMARAS, COPRESENTADOR y PASEO (gradas + calle).
// Solo personajes virtuales inventados (Marco Vitale, concursantes, equipo). Voces Piper (davefx = Marco).
// ===================================================================================================
const copreOn = () => { try { return localStorage.getItem('ac_copresentador') !== '0'; } catch (e) { return true; } };
const exAzar = l => l[Math.floor(Math.random() * l.length)];
/** Marco habla (voz davefx pregrabada) */
async function exAdrian(i, ses, txt) { let fin = false; i.say(txt, 3000).then(() => fin = true); await ses.until(() => fin); }
/** otro personaje: bocadillo con su nombre + su voz Piper */
async function exOtro(i, ses, quien, txt, cabeza, nombre) {
  const [nom, voz] = EX_DATOS.personajes[quien] || [quien, 'carlfm'];
  i.say(txt, 1e5, cabeza || null, nombre || nom, { voice: false });
  try { await stHabla(voz, txt, ses); } finally { i.hideBubble(); }
}
// ---------------- capa de «look» (cámara oculta / toma falsa / backstage) ----------------
function exCapa(modo) {
  const c = document.createElement('canvas'); c.id = 'exLook'; c.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;z-index:11;pointer-events:none';
  document.getElementById('hud').appendChild(c); const t0 = performance.now(); let vivo = true; const cv = Xe.renderer && Xe.renderer.domElement;
  const capa = { sello: null, selloT: 0, titulo: '', claqueta: null, claqT: 0, fin() { vivo = false; c.remove(); if (cv) cv.style.transform = ''; } };
  const bucle = () => {
    if (!vivo) return; const k = Math.min(2, devicePixelRatio || 1), w = c.width = innerWidth * k, h = c.height = innerHeight * k, g = c.getContext('2d'), t = (performance.now() - t0) / 1000, u = Math.min(w, h);
    g.clearRect(0, 0, w, h);
    if (modo === 'oculta') {
      g.strokeStyle = 'rgba(255,255,255,.85)'; g.lineWidth = u * 0.006; const m = u * 0.05, L = u * 0.08;
      for (const [x, y, sx, sy] of [[m, m, 1, 1], [w - m, m, -1, 1], [m, h - m, 1, -1], [w - m, h - m, -1, -1]]) { g.beginPath(); g.moveTo(x, y + sy * L); g.lineTo(x, y); g.lineTo(x + sx * L, y); g.stroke(); }
      if (t % 1 < 0.6) { g.fillStyle = '#ff2020'; g.beginPath(); g.arc(m + u * 0.05, m + u * 0.11, u * 0.015, 0, 7); g.fill(); }
      g.font = `900 ${u * 0.035}px Arial`; g.fillStyle = '#fff'; g.textAlign = 'left'; g.textBaseline = 'middle'; g.fillText('CÁMARA OCULTA', m + u * 0.08, m + u * 0.11);
    } else if (modo === 'tomas') {
      for (let n = 0; n < 160; n++) { g.fillStyle = `rgba(255,255,255,${Math.random() * 0.12})`; g.fillRect(Math.random() * w, Math.random() * h, 2, 2); }
      g.fillStyle = 'rgba(255,210,40,.92)'; g.fillRect(u * 0.03, u * 0.1, u * 0.34, u * 0.065); g.font = `900 ${u * 0.042}px Arial`; g.fillStyle = '#1a1000'; g.textAlign = 'left'; g.textBaseline = 'middle'; g.fillText('TOMAS FALSAS', u * 0.045, u * 0.133);
      const f = Math.floor(t * 25) % 25, s = Math.floor(t) % 60, mi = Math.floor(t / 60); g.font = `700 ${u * 0.032}px monospace`; g.fillStyle = 'rgba(0,0,0,.55)'; g.fillRect(w - u * 0.42, h - u * 0.09, u * 0.4, u * 0.06); g.fillStyle = '#fff'; g.fillText(`TC 01:${String(17 + mi).padStart(2, '0')}:${String(s).padStart(2, '0')}:${String(f).padStart(2, '0')}`, w - u * 0.41, h - u * 0.06);
    } else {
      const vg = g.createRadialGradient(w / 2, h / 2, u * 0.3, w / 2, h / 2, Math.hypot(w, h) * 0.6); vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(1, 'rgba(0,0,0,.65)'); g.fillStyle = vg; g.fillRect(0, 0, w, h);
      for (let n = 0; n < 120; n++) { g.fillStyle = `rgba(255,255,255,${Math.random() * 0.1})`; g.fillRect(Math.random() * w, Math.random() * h, 2, 2); }
      g.font = `900 ${u * 0.034}px Arial`; g.textAlign = 'left'; g.textBaseline = 'middle'; g.fillStyle = '#fff'; g.fillText('FUERA DE CÁMARAS', u * 0.05, u * 0.12); if (t % 1 < 0.6) { g.fillStyle = '#ff2020'; g.beginPath(); g.arc(w - u * 0.2, u * 0.12, u * 0.014, 0, 7); g.fill(); } g.fillStyle = '#fff'; g.fillText('REC', w - u * 0.18, u * 0.12);
      if (cv) cv.style.transform = `translate(${Math.sin(t * 1.7) * 6 + Math.sin(t * 5.3) * 2}px,${Math.cos(t * 1.3) * 5 + Math.sin(t * 4.1) * 2}px) rotate(${Math.sin(t * 0.9) * 0.6}deg) scale(1.06)`;
    }
    if (capa.titulo && t < 4.5) { g.fillStyle = 'rgba(10,20,90,.85)'; g.fillRect(0, h * 0.78, w * 0.7, u * 0.07); g.font = `800 ${u * 0.036}px system-ui`; g.fillStyle = '#fff'; g.textAlign = 'left'; g.textBaseline = 'middle'; g.fillText(capa.titulo, u * 0.04, h * 0.78 + u * 0.035, w * 0.66); }
    if (capa.claqueta != null) { const d = (performance.now() - capa.claqT) / 1000; if (d > 1.6) capa.claqueta = null; else { g.save(); g.translate(w / 2, h * 0.45); const s2 = u * 0.5; g.fillStyle = '#111'; g.fillRect(-s2 / 2, -s2 * 0.15, s2, s2 * 0.55); g.fillStyle = '#fff'; g.font = `800 ${s2 * 0.09}px Arial`; g.textAlign = 'center'; g.fillText('¡AHORA CAIGO!', 0, s2 * 0.02); g.fillText('ESCENA 1 · TOMA ' + capa.claqueta, 0, s2 * 0.2); g.save(); g.translate(-s2 / 2, -s2 * 0.15); g.rotate(d < 0.35 ? -0.5 + d / 0.35 * 0.5 : 0); for (let j = 0; j < 6; j++) { g.fillStyle = j % 2 ? '#fff' : '#111'; g.fillRect(j * s2 / 6, -s2 * 0.1, s2 / 6, s2 * 0.1); } g.restore(); g.restore(); } }
    if (capa.sello) { const d = (performance.now() - capa.selloT) / 1000; if (d > 2.6) capa.sello = null; else { const e = Math.min(1, d / 0.25); g.save(); g.translate(w / 2, h * 0.4); g.rotate(-0.12); g.scale(2 - e, 2 - e); g.globalAlpha = Math.min(1, e * 1.2); g.font = `900 ${u * (capa.sello.length > 14 ? 0.08 : 0.1)}px "Arial Black", Arial`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.lineWidth = u * 0.012; g.strokeStyle = capa.selloCol || '#e01010'; const tw = g.measureText(capa.sello).width; g.strokeRect(-tw / 2 - u * 0.03, -u * 0.07, tw + u * 0.06, u * 0.14); g.fillStyle = capa.selloCol || '#e01010'; g.fillText(capa.sello, 0, 0); g.restore(); } }
    requestAnimationFrame(bucle);
  };
  requestAnimationFrame(bucle); return capa;
}
function exSonidoClaqueta() { try { const c = F.ctx, b = c.createBuffer(1, c.sampleRate * 0.08, c.sampleRate), d = b.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / d.length, 3); const s = c.createBufferSource(), g = c.createGain(); g.gain.value = 0.7; s.buffer = b; s.connect(g); g.connect(F.sfx); s.start(); } catch (e) { } }
function exTablaFalsa(ms = 3800) {
  const d = document.createElement('div'); d.id = 'exTabla'; d.style.cssText = 'position:absolute;left:50%;top:40%;transform:translate(-50%,-50%);z-index:13;pointer-events:none;background:linear-gradient(#1a6ae8,#0a3ab0);border:5px solid #d8dce4;border-radius:14px;padding:12px 18px;min-width:min(70vw,420px);font:900 clamp(16px,3.4vw,28px) Arial;color:#1a0e00;box-shadow:0 0 30px #2a8aff';
  d.innerHTML = ['1 CROQUETA', 'UN ABRAZO', '0,50 €', 'UN BOLÍGRAFO', 'MEDIA TORTILLA'].map(t => `<div style="margin:6px auto;padding:6px 14px;border-radius:30px;background:linear-gradient(#fff2a0,#ffc21a,#c87a00);text-align:center">${t}</div>`).join('');
  document.getElementById('hud').appendChild(d); setTimeout(() => d.remove(), ms);
}
// ---------------- utilería de «fuera de cámaras» ----------------
function exUtileria(e, lugar) {
  const T = _E, G = new T.Group(); const x = -4.6, z = 4.4, y = (e.studio.heightAt && e.studio.heightAt(x, z)) ?? 0; G.position.set(x, y, z);
  const L = (c, em = 0) => new T.MeshLambertMaterial({ color: c, emissive: em });
  let extra = null;
  if (lugar === 'maquillaje') {
    const esp = new T.Mesh(new T.BoxGeometry(1.4, 1.0, 0.05), new T.MeshPhongMaterial({ color: 0xcfe8ff, specular: 0xffffff, shininess: 150, emissive: 0x203040 })); esp.position.set(0, 1.55, -0.8); G.add(esp);
    for (let k = 0; k < 10; k++) { const b = new T.Mesh(new T.SphereGeometry(0.05, 8, 6), new T.MeshBasicMaterial({ color: 0xfff2c0 })); const a = k / 10; b.position.set(k < 5 ? -0.75 : 0.75, 1.1 + (k % 5) * 0.22, -0.78); G.add(b); }
    const mesa = new T.Mesh(new T.BoxGeometry(1.6, 0.08, 0.5), L(0xf4f4f8, 0x202024)); mesa.position.set(0, 0.85, -0.6); G.add(mesa);
    const silla = new T.Mesh(new T.CylinderGeometry(0.25, 0.25, 0.5, 14), L(0x1a1a1e)); silla.position.set(0, 0.25, 0.1); G.add(silla);
    extra = Rm({ shirt: 0xff5aa0, p3d: { seed: 'copro-nuria', g: 'f' } }); extra.root.position.set(x + 0.75, y, z + 0.3); e.scene.add(extra.root);
  } else if (lugar === 'control') {
    for (let r = 0; r < 2; r++) for (let q = 0; q < 4; q++) { const m = new T.Mesh(new T.PlaneGeometry(0.62, 0.38), new T.MeshBasicMaterial({ color: [0x2a6aff, 0x1a8a4a, 0x8a2aff, 0xff7a1a][(q + r) % 4] })); m.position.set(-0.99 + q * 0.66, 1.2 + r * 0.42, -0.8); G.add(m); }
    const mesa = new T.Mesh(new T.BoxGeometry(2.8, 0.75, 0.6), L(0x2a2a30)); mesa.position.set(0, 0.38, -0.4); G.add(mesa);
    extra = Rm({ shirt: 0x2a2a34, p3d: { seed: 'copro-rober', g: 'm' } }); extra.root.position.set(x - 0.7, y, z + 0.2); e.scene.add(extra.root);
  }
  e.scene.add(G); e.host.root.position.set(x + (lugar === 'control' ? 0.4 : 0), y, z + 0.1); e.face(e.host, new P(x, y, z + 6)); extra && e.face(extra, e.host.root.position);
  return { G, extra, centro: new P(x, y, z), quitar() { e.scene.remove(G); extra && e.scene.remove(extra.root); } };
}
// ---------------- el guion de cada sketch ----------------
async function exCorre(modo, id, n, t) {
  const { eng: e, hud: i } = n, h = e.host, L = EX_DATOS[modo], d = escEsGen(id) ? escGen(modo, id) : (L.find(x => x.id === id) || L[0]);
  mec(modo + ' ' + d.id); e.resetPositions(); e.opps.forEach(o => o.root.visible = true);
  const capa = exCapa(modo); capa.titulo = { oculta: 'CÁMARA OCULTA', tomas: 'TOMAS FALSAS', fuera: 'FUERA DE CÁMARAS' }[modo] + ' · ' + d.titulo;
  const lugX = d.gen ? d.lugarAC : d.lugar, ut = modo === 'fuera' && lugX && lugX !== 'plato' ? exUtileria(e, lugX) : null;
  if (modo === 'oculta') F.playMusic('TrilhaCurta@Stage', true, 0.25);
  try {
    await Af(t, i, async v => {
      for (const [quien, txt, cam, gest, fx] of d.pasos) {
        const p0 = h.root.position, m = /^(opp|hole)(\d+)$/.exec(cam || '');
        if (cam === 'wide') Ot.wide(e); else if (m && m[1] === 'opp') Ot.opp(e, +m[2]); else if (m) Ot.hole(e, +m[2]); else if (cam === 'cerca' && ut) e.cut(new P(ut.centro.x + 0.3, ut.centro.y + 1.6, ut.centro.z + 3.0), new P(ut.centro.x, ut.centro.y + 1.3, ut.centro.z)); else e.cut(new P(p0.x + 0.9, p0.y + 1.7, p0.z + 3.0), new P(p0.x, p0.y + 1.35, p0.z));
        if (gest) try { He(h, ['saluda', 'senala', 'habla', 'aplaude', 'arriba', 'lamenta', 'gracias'].includes(gest) ? gest : 'habla', 2.4); } catch (x) { }
        const [f, fa] = (fx || '').split(':'), k = +fa || 0;
        if (f === 'claqueta') { capa.claqueta = k || 1; capa.claqT = performance.now(); setTimeout(exSonidoClaqueta, 330); await v.w(1500); }
        else if (f === 'trampillaNo') { for (let j = 0; j < 3; j++) { e.studio.setHoleColor(k, 16719904); await v.w(260); e.studio.setHoleColor(k, 16777215); await v.w(260); } F.play('Tecla'); }
        else if (f === 'cae' && e.opps[k - 1]) { F.play('DropM.mp3'); ze.ooh(1); e.fall(e.opps[k - 1], k); }
        else if (f === 'abreVacia') { const o = e.opps[k - 1]; o && (o.root.visible = false); e.studio.holes[k].target = 1; F.play('DropM.mp3'); setTimeout(() => { e.studio.holes[k].target = 0; o && (o.root.visible = true); }, 2500); }
        else if (f === 'tablaFalsa') exTablaFalsa();
        else if (f === 'inocente') { capa.sello = '¡INOCENTE, INOCENTE!'; capa.selloCol = '#ffd23a'; capa.selloT = performance.now(); try { ea(e.studio, new P(0, Ae + 1.5, 0)); ea(e.studio, new P(-3, 2, -2)); ea(e.studio, new P(3, 2, -2)); } catch (x) { } ze.risas(); ze.ovacion(5); }
        else if (f === 'corten') { capa.sello = '¡CORTEN!'; capa.selloCol = '#e01010'; capa.selloT = performance.now(); exSonidoClaqueta(); }
        else if (f === 'tomafalsa') { capa.sello = 'TOMA FALSA'; capa.selloCol = '#e01010'; capa.selloT = performance.now(); ze.risas(); }
        else if (f === 'risas') ze.risas(); else if (f === 'aplauso') ze.aplauso(2.5, 0.7); else if (f === 'ooh') ze.ooh(0.8);
        else if (f === 'silencio') i.toast('🤫 …', 1500);
        if (quien === 'adrian') await exAdrian(i, v, txt);
        else if (quien === 'conc') { const nn = m && m[1] === 'opp' ? +m[2] : 1 + Math.floor(Math.random() * 10); await exOtro(i, v, 'conc', txt, e.opps[nn - 1] && e.opps[nn - 1].head, me.rival(nn)); }
        else if ((quien === 'maq' || quien === 'dir') && ut && ut.extra) await exOtro(i, v, quien, txt, ut.extra.head);
        else await exOtro(i, v, quien, txt, null);
        await v.w(350);
      }
      await v.w(1200);
      await copresentador(n, v, { ctx: modo });
    });
  } finally { capa.fin(); ut && ut.quitar(); try { F.stopMusic(0.8); } catch (x) { } i.hideBubble(); e.resetPositions(); document.getElementById('exTabla')?.remove(); }
  return d;
}
// ---------------- copresentador (aleatorio; Opciones › Copresentador) ----------------
async function copresentador(n, ses, o = {}) {
  if (window.__copreForce === false) return false;
  if (!o.forzar && !window.__copreForce && !(copreOn() && Math.random() < (o.prob ?? 0.3))) return false;
  const { eng: e, hud: i } = n, h = e.host, C = EX_DATOS.copres; let g = exAzar(C.invitados);
  if (typeof window.__copreForce === 'string') g = C.invitados.find(x => x.id === window.__copreForce) || g;
  const vis = e.opps.map((x, k) => k).filter(k => e.opps[k].root.visible);
  if (g.tipo === 'concursante' && !vis.length) g = C.invitados[0];
  mec('copresentador ' + g.id + (o.ctx ? ' · ' + o.ctx : ''));
  let fig, origen, temporal = false, nombre = g.nombre;
  if (g.tipo === 'concursante') { const k = exAzar(vis); fig = e.opps[k]; origen = fig.root.position.clone(); nombre = me.rival(k + 1) + ' · concursante'; }
  else { fig = Rm({ shirt: g.shirt, p3d: { seed: 'copro-' + (g.id || g.nombre), g: g.voz === 'daniela' || /^(lola|nuria|carmen)/i.test(g.id || g.nombre || '') ? 'f' : 'm' } }); temporal = true; e.scene.add(fig.root); origen = new P(g.tipo === 'publico' ? -2.6 : 3.2, 0, 10.5); fig.root.position.copy(origen); }
  const hp = h.root.position.clone();
  try {
    Ot.wide(e, 1); He(h, 'saluda', 2); await exAdrian(i, ses, exAzar(C.invita)); ze.aplauso(3, 0.6);
    const dest = hp.clone().add(new P(1.05, 0, 0.45)); await Promise.race([e.walkTo(fig, dest, 2.2), ses.w(7000)]);
    fig.root.position.copy(dest); e.face(fig, new P(dest.x, 0, dest.z + 6)); e.face(h, new P(hp.x, 0, hp.z + 6));
    const mid = hp.clone().add(dest).multiplyScalar(0.5); e.cut(new P(mid.x + 0.2, mid.y + 1.65, mid.z + 3.6), new P(mid.x, mid.y + 1.3, mid.z));
    for (let j = 0; j < g.lineas.length; j++) {
      if (j === 1) { He(fig, 'senala', 2); if (g.ayuda === 'trampilla') { const k = 1 + (e.opps.findIndex(x => !x.root.visible) + 1 || 0); const hid = e.opps[k - 1] && !e.opps[k - 1].root.visible; for (let q = 0; q < 3; q++) { e.studio.setHoleColor(k, 16719904); await ses.w(200); e.studio.setHoleColor(k, 16777215); await ses.w(200); } if (hid || k === 1 && !e.opps[0].root.visible) e.studio.holes[k].target = 1; F.play('DropM.mp3'); ze.ooh(0.8); setTimeout(() => { e.studio.holes[k].target = 0; }, 2000); } else if (g.ayuda === 'lee') i.toast('📋 ' + nombre.split(' ·')[0] + ' lee la pregunta', 2400); else ze.aplauso(2, 0.6); }
      i.say(g.lineas[j], 1e5, fig.head, nombre, { voice: false }); try { await stHabla(g.voz, g.lineas[j], ses); } finally { i.hideBubble(); } await ses.w(250);
    }
    He(h, 'aplaude', 2); await exAdrian(i, ses, exAzar(C.gracias)); ze.aplauso(3, 0.75);
    await Promise.race([e.walkTo(fig, origen, 2.2), ses.w(7000)]); fig.root.position.copy(origen);
  } finally { if (temporal) e.scene.remove(fig.root); else { fig.root.position.copy(origen); e.face(fig, new P(0, 0, 0)); } i.hideBubble(); }
  return true;
}
function filaCopresentador() {
  const row = document.createElement('div'); row.className = 'orow'; row.id = 'rowCopres';
  const lb = document.createElement('label'); lb.textContent = '🎤 Copresentador sorpresa'; row.appendChild(lb);
  for (const [v, t] of [['1', 'Sí'], ['0', 'No']]) { const b = document.createElement('button'); b.className = 'tbtn' + ((copreOn() ? '1' : '0') === v ? ' sel' : ''); b.textContent = t; b.onclick = ev => { ev.stopPropagation(); localStorage.setItem('ac_copresentador', v); row.querySelectorAll('button').forEach(x => x.classList.toggle('sel', x === b)); }; row.appendChild(b); }
  return row;
}
// ---------------- PASEO: escaleras a la grada + pasarela alta + salida a la calle ----------------
const PASEO = { Z0: 90 };
function paseoMontar(e) {
  const T = _E, G = new T.Group(), L = (c, em = 0) => new T.MeshLambertMaterial({ color: c, emissive: em }); G.name = 'paseo';
  const R0 = gn + 0.35, PASO = 0.32, SUBE = 0.25, N = 7, TOP = N * SUBE, R1 = R0 + N * PASO, ANCHO = 1.3, ang = [0.42, -0.42];
  const geo = { R0, R1, TOP, ang, ANCHO };
  const escMat = L(0xd8dce4, 0x303038), bordeMat = new T.MeshBasicMaterial({ color: 0x3ad0ff });
  for (const a of ang) for (let s = 0; s < N; s++) { const r = R0 + (s + 0.5) * PASO, h = (s + 1) * SUBE; const m = new T.Mesh(new T.BoxGeometry(ANCHO, h, PASO), escMat); m.position.set(Math.sin(a) * r, h / 2, Math.cos(a) * r); m.rotation.y = a; G.add(m); const l = new T.Mesh(new T.BoxGeometry(ANCHO, 0.02, 0.03), bordeMat); l.position.set(Math.sin(a) * (r + PASO / 2 - 0.02), h + 0.01, Math.cos(a) * (r + PASO / 2 - 0.02)); l.rotation.y = a; G.add(l); }
  // pasarela alta por encima de las gradas (de una escalera a la otra por detrás)
  const pas = new T.Mesh(new T.CylinderGeometry(R1 + 0.9, R1 + 0.9, 0.12, 96, 1, true), escMat); const anillo = new T.Mesh(new T.RingGeometry(R1, R1 + 0.9, 96, 1, ang[0] - 0.12 + Math.PI / 2, Math.PI * 2 - (ang[0] - 0.12) * 2), new T.MeshLambertMaterial({ color: 0xc8ccd8, emissive: 0x2a2a30, side: T.DoubleSide }));
  anillo.rotation.x = -Math.PI / 2; anillo.position.y = TOP + 0.01; G.add(anillo); pas.visible = false;
  const bar = new T.Mesh(new T.TorusGeometry(R1 + 0.9, 0.03, 6, 120, Math.PI * 2 - (ang[0] - 0.12) * 2), new T.MeshBasicMaterial({ color: 0x3ad0ff })); bar.rotation.x = Math.PI / 2; bar.rotation.z = -(Math.PI / 2 + ang[0] - 0.12) + Math.PI; bar.position.y = TOP + 0.9; G.add(bar);
  // puerta de salida (al fondo, delante)
  const zP = Cn - 0.25; const marcoM = L(0x2a2a30); const pu = new T.Mesh(new T.PlaneGeometry(1.6, 2.4), new T.MeshBasicMaterial({ color: 0x0a0a0a })); pu.position.set(0, 1.2, zP - 0.02); pu.rotation.y = Math.PI; G.add(pu);
  const sal = new T.Mesh(new T.PlaneGeometry(1.2, 0.35), new T.MeshBasicMaterial({ map: Vt(256, 72, (g, w, h) => { g.fillStyle = '#0aa040'; g.fillRect(0, 0, w, h); g.fillStyle = '#fff'; g.font = '900 44px Arial'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('🚶 SALIDA', w / 2, h / 2 + 2); }) })); sal.position.set(0, 2.7, zP - 0.05); sal.rotation.y = Math.PI; G.add(sal);
  for (const sx of [-0.85, 0.85]) { const c = new T.Mesh(new T.BoxGeometry(0.12, 2.5, 0.12), marcoM); c.position.set(sx, 1.25, zP - 0.05); G.add(c); }
  // la CALLE (lejos del plató; se llega por la puerta)
  const Z0 = PASEO.Z0, C = new T.Group(); C.name = 'calle';
  const suelo = new T.Mesh(new T.PlaneGeometry(80, 50), L(0x5a5a62, 0x1a1a20)); suelo.rotation.x = -Math.PI / 2; suelo.position.set(0, 0, Z0 + 15); C.add(suelo);
  const acera = (z0, z1) => { const m = new T.Mesh(new T.BoxGeometry(80, 0.12, z1 - z0), L(0xb8b4ac, 0x3a3832)); m.position.set(0, 0.06, (z0 + z1) / 2); C.add(m); };
  acera(Z0, Z0 + 7); acera(Z0 + 17, Z0 + 22);
  const asf = new T.Mesh(new T.PlaneGeometry(80, 10), L(0x26262a, 0x0a0a0c)); asf.rotation.x = -Math.PI / 2; asf.position.set(0, 0.01, Z0 + 12); C.add(asf);
  for (let x = -38; x < 40; x += 4) { const r = new T.Mesh(new T.PlaneGeometry(2, 0.2), new T.MeshBasicMaterial({ color: 0xffffff })); r.rotation.x = -Math.PI / 2; r.position.set(x, 0.02, Z0 + 12); C.add(r); }
  for (let x = -6; x <= 6; x += 1.2) { const r = new T.Mesh(new T.PlaneGeometry(0.6, 8), new T.MeshBasicMaterial({ color: 0xf0f0f0 })); r.rotation.x = -Math.PI / 2; r.position.set(x, 0.02, Z0 + 12); C.add(r); } // paso de cebra
  // fachada del estudio con letrero inventado
  const fach = new T.Mesh(new T.BoxGeometry(40, 12, 2), L(0x1a2a6a, 0x0a1440)); fach.position.set(0, 6, Z0 - 1); C.add(fach);
  const cartel = new T.Mesh(new T.PlaneGeometry(14, 2.4), new T.MeshBasicMaterial({ map: Vt(1024, 176, (g, w, h) => { const gr = g.createLinearGradient(0, 0, w, 0); gr.addColorStop(0, '#2a0a6a'); gr.addColorStop(1, '#ff3a9a'); g.fillStyle = gr; g.fillRect(0, 0, w, h); stLogo(g, 110, h / 2, 120); g.font = '900 64px "Arial Black", Arial'; g.fillStyle = '#fff'; g.textAlign = 'left'; g.textBaseline = 'middle'; g.fillText('ESTUDIOS SHOW TIME', 330, h / 2); }) })); cartel.position.set(0, 9, Z0 + 0.02); C.add(cartel);
  const ent = new T.Mesh(new T.PlaneGeometry(3, 3.2), new T.MeshBasicMaterial({ map: Vt(256, 280, (g, w, h) => { g.fillStyle = '#e8f4ff'; g.fillRect(0, 0, w, h); g.fillStyle = '#2a3a6a'; g.fillRect(w / 2 - 3, 0, 6, h); g.fillStyle = '#0a1440'; g.font = '900 34px Arial'; g.textAlign = 'center'; g.fillText('ENTRADA', w / 2, 40); g.fillText('¡AHORA CAIGO!', w / 2, 80); }) })); ent.position.set(0, 1.6, Z0 + 0.02); C.add(ent);
  for (let k = 0; k < 6; k++) { const v = new T.Mesh(new T.PlaneGeometry(4, 2.2), new T.MeshBasicMaterial({ color: 0x8ac8ff })); v.position.set(-15 + k * 6 + (k >= 3 ? 0 : 0), 5 + (k % 2) * 3, Z0 + 0.02); if (Math.abs(v.position.x) > 3) C.add(v); }
  // edificios enfrente y farolas
  for (let k = 0; k < 8; k++) { const hh = 8 + (k * 37 % 9), b = new T.Mesh(new T.BoxGeometry(9, hh, 6), L([0xc8a888, 0x9aa0b0, 0xd8c8a8, 0x8a7a6a][k % 4], 0x1a1612)); b.position.set(-35 + k * 10, hh / 2, Z0 + 26); C.add(b);
    for (let f = 1; f < hh - 1; f += 2.2) for (let q = -3; q <= 3; q += 2) { const v = new T.Mesh(new T.PlaneGeometry(1, 1.2), new T.MeshBasicMaterial({ color: (k + f + q) % 3 ? 0xffe8a0 : 0x2a3040 })); v.position.set(-35 + k * 10 + q, f + 0.6, Z0 + 22.98); v.rotation.y = Math.PI; C.add(v); } }
  for (let x = -24; x <= 24; x += 8) for (const z of [Z0 + 6.5, Z0 + 17.5]) { const p = new T.Mesh(new T.CylinderGeometry(0.06, 0.08, 4.2, 8), L(0x2a2a30)); p.position.set(x, 2.1, z); C.add(p); const lu = new T.Mesh(new T.SphereGeometry(0.28, 12, 8), new T.MeshBasicMaterial({ color: 0xfff0b0 })); lu.position.set(x, 4.3, z); C.add(lu); }
  const luz = new T.HemisphereLight(0xcfe0ff, 0x404040, 0.0); C.add(luz); PASEO.luz = luz;
  G.add(C); e.scene.add(G); PASEO.G = G; PASEO.geo = geo; return geo;
}
/** altura del suelo en el Paseo (null = no se puede pasar) */
function paseoAltura(orig, x, z) {
  const Z0 = PASEO.Z0, g = PASEO.geo;
  if (z > Z0 - 5) { if (z < Z0 + 0.4 || z > Z0 + 22.6 || Math.abs(x) > 38) return null; return (z < Z0 + 7 || z > Z0 + 17) ? 0.12 : 0; }
  const r = Math.hypot(x, z), a = Math.atan2(x, z);
  for (const aa of g.ang) { const da = a - aa, lat = Math.sin(da) * r, rad = Math.cos(da) * r; if (Math.abs(lat) < g.ANCHO / 2 && rad > g.R0 && rad < g.R1) return Math.min(g.TOP, (Math.floor((rad - g.R0) / ((g.R1 - g.R0) / 7)) + 1) * 0.25); }
  if (r >= g.R1 - 0.05 && r <= g.R1 + 0.85 && Math.abs(a) >= g.ang[0] - 0.12) return g.TOP;
  if (Math.abs(x) < 1.0 && z > Cn - 3.2 && z < Cn - 0.5) return 0;
  return orig(x, z);
}
async function modoPaseo(n, t) {
  const { eng: e, hud: i } = n; mec('paseo'); const st = e.studio, orig = st.heightAt.bind(st); paseoMontar(e);
  st.heightAt = (x, z) => paseoAltura(orig, x, z); window.__paseo = { eng: e, geo: PASEO.geo, Z0: PASEO.Z0, Cn };
  const fog0 = e.scene.fog && e.scene.fog.density; let fuera = false;
  const fundido = async () => { const d = document.createElement('div'); d.style.cssText = 'position:fixed;inset:0;background:#000;z-index:50;opacity:0;transition:opacity .35s;pointer-events:none'; document.body.appendChild(d); requestAnimationFrame(() => d.style.opacity = '1'); await t.w(400); setTimeout(() => { d.style.opacity = '0'; setTimeout(() => d.remove(), 400); }, 120); };
  try {
    e.player.root.position.set(0, 0, 9.5); e.player.root.rotation.y = Math.PI; e.walkMode(true); document.documentElement.classList.add('paseo');
    i.hint('🕹️ Joystick / WASD · sube por las escaleras azules a la grada · 🚶 SALIDA al fondo para salir a la calle'); setTimeout(() => i.hint(null), 7000);
    i.say(EX_DATOS.paseo.bienvenida, 4500);
    for (; ;) {
      await t.w(200); const p = e.player.root.position;
      window.__paseo.pos = [+p.x.toFixed(2), +p.y.toFixed(2), +p.z.toFixed(2)]; window.__paseo.fuera = fuera;
      if (!fuera && Math.abs(p.x) < 1.0 && p.z > Cn - 1.0) { await fundido(); fuera = true; mec('paseo calle'); p.set(0, 0.12, PASEO.Z0 + 2.5); e.yaw = Math.PI; e.player.root.rotation.y = 0; if (e.scene.fog) e.scene.fog.density = fog0 * 0.25; PASEO.luz.intensity = 1.2; i.say(EX_DATOS.paseo.calle, 4500); }
      else if (fuera && Math.abs(p.x) < 1.4 && p.z < PASEO.Z0 + 1.0) { await fundido(); fuera = false; mec('paseo vuelta'); p.set(0, 0, Cn - 3.6); e.yaw = 0; e.player.root.rotation.y = Math.PI; if (e.scene.fog) e.scene.fog.density = fog0; PASEO.luz.intensity = 0; i.say(EX_DATOS.paseo.vuelta, 2500); }
      if (!fuera && p.y > PASEO.geo.TOP - 0.05 && !window.__paseo.arriba) { window.__paseo.arriba = true; mec('paseo grada'); }
    }
  } finally { document.documentElement.classList.remove('paseo'); delete st.heightAt; e.walkMode(false); PASEO.G && e.scene.remove(PASEO.G); if (e.scene.fog && fog0) e.scene.fog.density = fog0; e.resetPositions(); }
}
// ---------------- menús y modos ----------------
const EX_MENU = { oculta: ['📹', 'Cámara oculta', 'Bromas a Marco en el plató… ¡Inocente, inocente!'], tomas: ['🎬', 'Tomas falsas', 'Lapsus, trampillas que se adelantan y «¡Corten!»'], fuera: ['🎥', 'Fuera de cámaras', 'Maquillaje, ensayos, técnicos y la pausa publicitaria'] };
function menuExtras2(a, r) {
  const [em, tit, sub] = EX_MENU[a]; r.appendChild(Pa(em + ' ' + tit));
  const d = document.createElement('div'); d.style.cssText = 'background:#0a1a5acc;border:2px solid #3a6aff;border-radius:16px;padding:10px 12px;margin:4px 0;color:#fff;font:14px system-ui'; d.innerHTML = sub + '. Personajes virtuales inventados (voces sintéticas).'; r.appendChild(d);
  r.appendChild(ei('▶ Ver todas seguidas', EX_DATOS[a].length + ' escenas', 'gold', () => ii(a, 'todas')));
  if (a === 'tomas' && window.Ep3000) r.appendChild(ei(window.Ep3000.titulo, window.Ep3000.sub, 'gold', () => window.Ep3000.abrir()));
  menuEscGen(a, r);
  for (const s of EX_DATOS[a]) r.appendChild(ei(s.titulo, s.pasos.length + ' frases', '', () => ii(a, s.id)));
  r.appendChild(Ia('main'));
}
async function modoExtras(a, e, n, t) {
  if (a === 'paseo') return modoPaseo(n, t);
  const L = EX_DATOS[a], ids = e === 'todas' ? L.map(x => x.id) : [escEsGen(e) || (e && L.find(x => x.id === e)) ? e : L[0].id];
  let d; for (const id of ids) d = await exCorre(a, id, n, t);
  const sig = d.gen ? { id: 'g' + (d.n % ESC_GEN.total + 1) } : L[(L.indexOf(d) + 1) % L.length];
  yn.score(`${EX_MENU[a][0]} «${d.titulo}»`, true); yn.actions([{ label: 'Siguiente ▶', cls: 'gold', fn: () => ii(a, sig.id) }, { label: 'Repetir', fn: () => ii(a, d.id) }, { label: 'Lista', fn: () => { jt && (jt.alive = false), jt = null, Mi = false, Lt(a); } }]);
  Xe.startOrbit(new P(0, 0, 0), 10.8, 5, 0, 0.08, 1); await t.until(() => false);
}
window.__extras = { copresentador, paseoAltura, datos: EX_DATOS };
