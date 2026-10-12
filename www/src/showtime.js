const VOZ_TONO = { carlfm: 0.86, mls_10246: 0.9, sharvard_m: 0.88, claude: 0.93, ald: 1.0, op: 1.05, daniela: 1.22, sharvard_f: 1.2, mls_9972: 1.16 };
// ===================================================================================================
// SHOW TIME TV (cadena inventada): pausa publicitaria con anuncios INVENTADOS (marcas y productos ficticios),
// cortinillas («Publicidad», «Volvemos en 1 minuto», «3 anuncios»…), promos de otros programas de la cadena
// (¡Boom!, Pasapalabra y «La Cocina de Paco» con el cocinero virtual Chef Paco Sartén, en una cocina 3D)
// y «Promos de Marco» (el presentador virtual presenta ¡Ahora caigo! en el plató). Voces: Piper.
// ===================================================================================================
ST_DATOS.monologos.forEach(m => { if (!ko.find(k => k.id === m.id)) ko.push(m); });
const CADENA = ST_DATOS.cadena || 'Show Time TV';
const pubEnPrograma = () => { try { return localStorage.getItem('ac_pub_programa') === '1'; } catch (e) { return false; } };
let ST_IDX = null;
async function stIndice() { if (ST_IDX) return ST_IDX; try { ST_IDX = RC.FILE ? (typeof __VOZ_ST !== 'undefined' ? __VOZ_ST : {}) : await (await fetch(`${Us}voz/st/index.json`)).json(); } catch (e) { ST_IDX = typeof __VOZ_ST !== 'undefined' ? __VOZ_ST : {}; } return ST_IDX; }
/** reproduce una frase con su voz Piper (si no está, espera lo que se tardaría en leerla) */
async function stHabla(voz, texto, ses) {
  const idx = await stIndice(), k = _f(voz + '|' + texto);
  const esperaLeer = () => ses.w(700 + texto.split(/\s+/).length * 330);
  if (!zn.enabled) return esperaLeer();
  if (idx[k] == null || window.__LANG === 'it') { // sin voz pregrabada: Piper sin conexión con el tono del personaje (todos hablan siempre)
    const r = zn.tts(texto, VOZ_TONO[voz] || 1.0, false); let fin = false; Promise.race([r.done, new Promise(z => setTimeout(z, 15000))]).then(() => fin = true);
    try { await ses.until(() => fin); } catch (e) { try { zn.stop(); } catch (x) { } throw e; } return;
  }
  try { const r = await F.playUrl(`${Us}voz/st/${k}.mp3`, 1, 'voz'); if (!r || r.dur < 0) return esperaLeer(); let fin = false; r.done.then(() => fin = true); await ses.until(() => fin); } catch (e) { if (e === _o) throw e; await esperaLeer(); }
}
function stJingle(tipo = 'entra') { // sintonía corta de la cadena (sintetizada)
  try { const c = F.ctx, t0 = c.currentTime + 0.02, notas = tipo === 'entra' ? [523, 659, 784, 1047] : tipo === 'sale' ? [1047, 784, 659, 880] : [784, 988];
    notas.forEach((f, i) => { const o = c.createOscillator(), g = c.createGain(); o.type = 'triangle'; o.frequency.value = f; g.gain.setValueAtTime(0, t0 + i * 0.13); g.gain.linearRampToValueAtTime(0.18, t0 + i * 0.13 + 0.02); g.gain.exponentialRampToValueAtTime(0.001, t0 + i * 0.13 + 0.5); o.connect(g); g.connect(F.sfx); o.start(t0 + i * 0.13); o.stop(t0 + i * 0.13 + 0.55); });
  } catch (e) { }
}
// ---------------- lienzo de la cadena ----------------
function stLogo(g, x, y, s, alfa = 1) { // logo inventado: estrella + «SHOW TIME TV»
  g.save(); g.globalAlpha = alfa; g.translate(x, y); const R = s * 0.5;
  g.fillStyle = '#ffd23a'; g.beginPath(); for (let i = 0; i < 10; i++) { const r = i % 2 ? R * 0.45 : R, a = -Math.PI / 2 + i * Math.PI / 5; g.lineTo(Math.cos(a) * r, Math.sin(a) * r); } g.closePath(); g.fill(); g.lineWidth = s * 0.05; g.strokeStyle = '#a0500a'; g.stroke();
  g.font = `900 ${s * 0.34}px "Arial Black", Arial, sans-serif`; g.textAlign = 'left'; g.textBaseline = 'middle'; g.lineWidth = s * 0.08; g.strokeStyle = '#2a0a5a'; g.strokeText('SHOW TIME', R * 1.15, -s * 0.12); g.fillStyle = '#fff'; g.fillText('SHOW TIME', R * 1.15, -s * 0.12);
  g.font = `900 ${s * 0.28}px "Arial Black", Arial, sans-serif`; g.fillStyle = '#ff5ad0'; g.strokeText('TV', R * 1.15, s * 0.24); g.fillText('TV', R * 1.15, s * 0.24); g.restore();
}
function stTexto(g, t, x, y, px, col = '#fff', borde = '#1a0a3a', max) { g.font = `900 ${px}px "Arial Black", Arial, sans-serif`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.lineJoin = 'round'; g.lineWidth = px * 0.16; g.strokeStyle = borde; g.strokeText(t, x, y, max); g.fillStyle = col; g.fillText(t, x, y, max); }
function stSub(g, w, h, t) { if (!t) return; g.save(); g.font = `700 ${Math.round(h * 0.04)}px system-ui, Arial`; const tw = Math.min(w * 0.9, g.measureText(t).width + 30); g.fillStyle = 'rgba(0,0,0,.6)'; g.fillRect((w - tw) / 2, h * 0.88, tw, h * 0.07); g.fillStyle = '#fff'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(t, w / 2, h * 0.915, w * 0.88); g.restore(); }
class StPantalla {
  constructor(ses) {
    this.ses = ses; this.vivo = true; this.dibujo = null; this.t0 = performance.now(); this.sub = '';
    const d = this.div = document.createElement('div'); d.id = 'showtime'; d.style.cssText = 'position:fixed;inset:0;z-index:70;background:#000;cursor:pointer';
    this.c3 = document.createElement('canvas'); this.c3.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;display:none';
    this.c = document.createElement('canvas'); this.c.style.cssText = 'position:absolute;inset:0;width:100%;height:100%';
    const sk = document.createElement('button'); sk.className = 'tbtn'; sk.id = 'stSaltar'; sk.textContent = 'Saltar ⏭'; sk.style.cssText = 'position:absolute;right:14px;bottom:14px;z-index:2';
    sk.onclick = ev => { ev.stopPropagation(); this.vivo = false; };
    d.append(this.c3, this.c, sk); document.body.appendChild(d);
    const tam = () => { const k = Math.min(2, devicePixelRatio || 1); this.c.width = innerWidth * k; this.c.height = innerHeight * k; }; tam(); this.tam = tam; addEventListener('resize', tam);
    const bucle = () => { if (!this.div.isConnected) return; const g = this.c.getContext('2d'), w = this.c.width, h = this.c.height, t = (performance.now() - this.t0) / 1000; g.clearRect(0, 0, w, h); try { this.dibujo && this.dibujo(g, w, h, t); } catch (e) { } if (this.marca) stLogo(g, w * 0.86, h * 0.07, h * 0.06, 0.85); stSub(g, w, h, this.sub); requestAnimationFrame(bucle); }; requestAnimationFrame(bucle);
  }
  /** sesión que se corta al pulsar Saltar o al salir */
  get s() { const yo = this; return { w: ms => yo.ses.w(ms).then(() => { if (!yo.vivo) throw _o; }), until: f => yo.ses.until(() => !yo.vivo || f()).then(() => { if (!yo.vivo) throw _o; }) }; }
  escena(f, marca = true) { this.dibujo = f; this.t0 = performance.now(); this.marca = marca; this.sub = ''; }
  cerrar() { removeEventListener('resize', this.tam); try { F.stopTag('voz'); } catch (e) { } this.div.style.transition = 'opacity .3s'; this.div.style.opacity = '0'; setTimeout(() => this.div.remove(), 320); }
}
// ---------------- cortinillas ----------------
async function stCortinilla(P, tipo) {
  const txt = { publicidad: ['PUBLICIDAD', ''], min1: ['VOLVEMOS EN', '1 MINUTO'], seg30: ['VOLVEMOS EN', '30 SEGUNDOS'], anuncios3: ['3', 'ANUNCIOS'], anuncio1: ['1', 'ANUNCIO'], volvemos: ['VOLVEMOS CON', '¡AHORA CAIGO!'] }[tipo];
  stJingle(tipo === 'volvemos' ? 'sale' : 'entra');
  P.escena((g, w, h, t) => {
    const gr = g.createLinearGradient(0, 0, w, h); gr.addColorStop(0, '#2a0a6a'); gr.addColorStop(0.6, '#8a1ab0'); gr.addColorStop(1, '#ff3a9a'); g.fillStyle = gr; g.fillRect(0, 0, w, h);
    g.save(); g.translate(w / 2, h / 2); g.rotate(t * 0.3); for (let i = 0; i < 16; i++) { g.rotate(Math.PI / 8); g.fillStyle = i % 2 ? 'rgba(255,210,60,.12)' : 'rgba(255,255,255,.05)'; g.beginPath(); g.moveTo(0, 0); g.lineTo(-w * 0.12, -w); g.lineTo(w * 0.12, -w); g.fill(); } g.restore();
    const k = Math.min(1, t / 0.45), e = 1 - Math.pow(1 - k, 3);
    stLogo(g, w * 0.5 - h * 0.17, h * 0.2, h * 0.16 * e);
    const grande = /^\d$/.test(txt[0]);
    if (grande) { g.save(); g.translate(w / 2, h * 0.55); g.scale(e, e); g.fillStyle = '#ffd23a'; g.beginPath(); g.arc(0, 0, h * 0.16, 0, 7); g.fill(); g.lineWidth = h * 0.02; g.strokeStyle = '#fff'; g.stroke(); g.lineWidth = h * 0.012; g.strokeStyle = '#fff'; g.beginPath(); g.arc(0, 0, h * 0.2, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * Math.min(1, t / 2.6)); g.stroke(); g.restore(); stTexto(g, txt[0], w / 2, h * 0.56, h * 0.22 * e, '#2a0a5a', '#fff'); stTexto(g, txt[1], w / 2, h * 0.82, h * 0.09 * e, '#fff'); }
    else { stTexto(g, txt[0], w / 2 - (1 - e) * w, h * 0.52, h * (txt[1] ? 0.1 : 0.17), '#fff', '#2a0a5a', w * 0.9); if (txt[1]) stTexto(g, txt[1], w / 2 + (1 - e) * w, h * 0.68, h * 0.13, '#ffd23a', '#2a0a5a', w * 0.9); }
  }, false);
  mec('cortinilla ' + tipo); await stHabla('daniela', ST_DATOS.cortinillas[tipo], P.s); await P.s.w(500);
}
// ---------------- anuncios inventados ----------------
function stProducto(g, tipo, x, y, s, t, c) { // dibujos de los productos (inventados)
  g.save(); g.translate(x, y); g.rotate(Math.sin(t * 2) * 0.08); const brillo = (xx, yy, ww, hh) => { g.fillStyle = 'rgba(255,255,255,.35)'; g.fillRect(xx, yy, ww, hh); };
  const caja = (w, h, col, r = 0.1) => { _rr(g, -w / 2, -h / 2, w, h, s * r); g.fillStyle = col; g.fill(); g.lineWidth = s * 0.03; g.strokeStyle = '#0008'; g.stroke(); };
  if (tipo === 'botella') { caja(s * 0.5, s * 0.9, c[0]); g.fillStyle = c[1]; g.fillRect(-s * 0.1, -s * 0.62, s * 0.2, s * 0.18); brillo(-s * 0.18, -s * 0.35, s * 0.08, s * 0.6); }
  else if (tipo === 'bolsa') { g.beginPath(); g.moveTo(-s * 0.4, -s * 0.5); g.lineTo(s * 0.4, -s * 0.5); g.lineTo(s * 0.46, s * 0.5); g.lineTo(-s * 0.46, s * 0.5); g.closePath(); g.fillStyle = c[0]; g.fill(); g.lineWidth = s * 0.03; g.strokeStyle = '#0008'; g.stroke(); for (let i = 0; i < 5; i++) { g.fillStyle = '#ffe08a'; g.beginPath(); g.ellipse(-s * 0.2 + i * s * 0.1, s * 0.1 + Math.sin(t * 4 + i) * s * 0.05, s * 0.08, s * 0.05, i, 0, 7); g.fill(); } }
  else if (tipo === 'colchon') { caja(s * 1.1, s * 0.35, '#f4f4ff', 0.12); g.strokeStyle = c[0]; g.lineWidth = s * 0.02; for (let i = -4; i <= 4; i++) { g.beginPath(); g.moveTo(i * s * 0.12, -s * 0.15); g.lineTo(i * s * 0.12, s * 0.15); g.stroke(); } for (let i = 0; i < 3; i++) { g.fillStyle = 'rgba(255,255,255,.9)'; g.beginPath(); g.arc(-s * 0.3 + i * s * 0.3, -s * 0.4 - Math.sin(t * 2 + i) * s * 0.05, s * 0.12, 0, 7); g.fill(); } }
  else if (tipo === 'calcetin') { for (const dx of [-0.2, 0.2]) { g.save(); g.translate(dx * s, 0); g.fillStyle = c[0]; g.fillRect(-s * 0.12, -s * 0.45, s * 0.24, s * 0.6); g.beginPath(); g.ellipse(dx < 0 ? -s * 0.05 : s * 0.05, s * 0.2, s * 0.22, s * 0.13, 0, 0, 7); g.fill(); g.fillStyle = '#fff'; g.fillRect(-s * 0.12, -s * 0.45, s * 0.24, s * 0.08); g.restore(); } g.fillStyle = '#c8ccd8'; g.fillRect(-s * 0.08, -s * 0.15, s * 0.16, s * 0.06); }
  else if (tipo === 'yogur') { g.beginPath(); g.moveTo(-s * 0.3, -s * 0.35); g.lineTo(s * 0.3, -s * 0.35); g.lineTo(s * 0.24, s * 0.4); g.lineTo(-s * 0.24, s * 0.4); g.closePath(); g.fillStyle = '#fff'; g.fill(); g.strokeStyle = '#0006'; g.lineWidth = s * 0.03; g.stroke(); g.fillStyle = c[0]; g.fillRect(-s * 0.27, -s * 0.1, s * 0.54, s * 0.2); g.fillStyle = '#c0c4cc'; g.fillRect(-s * 0.33, -s * 0.42, s * 0.66, s * 0.08); }
  else if (tipo === 'movil') { caja(s * 0.5, s * 0.9, '#7a4a2a', 0.04); for (let r = 0; r < 4; r++) for (let q = 0; q < 2; q++) { g.strokeStyle = '#5a3018'; g.lineWidth = s * 0.015; g.strokeRect(-s * 0.25 + q * s * 0.25 + (r % 2) * s * 0.1, -s * 0.45 + r * s * 0.225, s * 0.25, s * 0.225); } caja(s * 0.36, s * 0.5, '#1a2a4a', 0.03); brillo(-s * 0.15, -s * 0.2, s * 0.05, s * 0.4); }
  else if (tipo === 'gominolas') { for (let i = 0; i < 7; i++) { const yy = -Math.abs(Math.sin(t * 5 + i)) * s * 0.4; g.fillStyle = ['#ff3a3a', '#ffd23a', '#3ac85a', '#3a8aff', '#ff5ad0'][i % 5]; g.beginPath(); g.ellipse(-s * 0.45 + i * s * 0.15, s * 0.2 + yy, s * 0.07, s * 0.1, 0, 0, 7); g.fill(); } }
  else if (tipo === 'robot') { g.fillStyle = c[0]; g.beginPath(); g.arc(0, 0, s * 0.42, 0, 7); g.fill(); g.lineWidth = s * 0.04; g.strokeStyle = c[1]; g.stroke(); g.fillStyle = c[1]; g.beginPath(); g.arc(0, -s * 0.1, s * 0.12, 0, 7); g.fill(); g.fillStyle = '#3aff8a'; g.beginPath(); g.arc(0, -s * 0.1, s * 0.05, 0, 7); g.fill(); g.font = `${s * 0.25}px serif`; g.textAlign = 'center'; g.fillText('♪', s * 0.5 + Math.sin(t * 3) * s * 0.1, -s * 0.4); }
  g.restore();
}
async function stAnuncio(P, a) {
  mec('anuncio ' + a.id); let fase = 0;
  P.escena((g, w, h, t) => {
    const gr = g.createRadialGradient(w / 2, h / 2, 10, w / 2, h / 2, w * 0.7); gr.addColorStop(0, a.color[0]); gr.addColorStop(1, a.color[1]); g.fillStyle = gr; g.fillRect(0, 0, w, h);
    for (let i = 0; i < 24; i++) { g.fillStyle = 'rgba(255,255,255,.08)'; g.beginPath(); g.arc((i * 137 % 100) / 100 * w, ((i * 71 + t * 40) % 100) / 100 * h, h * 0.02 + (i % 4) * h * 0.01, 0, 7); g.fill(); }
    const e = Math.min(1, t / 0.6);
    stProducto(g, a.dibujo, w * (fase < 2 ? 0.3 : 0.5), h * (fase < 2 ? 0.5 : 0.42), h * 0.45 * (0.6 + 0.4 * e), t, a.color);
    if (fase < 2) { stTexto(g, a.marca.toUpperCase(), w * 0.68, h * 0.38, h * 0.12, '#fff', '#000', w * 0.5); stTexto(g, a.producto, w * 0.68, h * 0.52, h * 0.045, '#ffe', '#000', w * 0.55); }
    else { stTexto(g, a.marca.toUpperCase(), w / 2, h * 0.14, h * 0.11, '#fff', '#000', w * 0.8); stTexto(g, a.lema, w / 2, h * 0.74, h * 0.05, '#ffd23a', '#000', w * 0.92); }
    g.font = `600 ${h * 0.022}px system-ui`; g.fillStyle = 'rgba(255,255,255,.7)'; g.textAlign = 'left'; g.fillText('Anuncio inventado · marca y producto ficticios', w * 0.02, h * 0.97);
  });
  for (let i = 0; i < a.lineas.length; i++) { fase = i; P.sub = a.lineas[i]; await stHabla(a.voz, a.lineas[i], P.s); await P.s.w(250); }
  await P.s.w(900);
}
// ---------------- promos de la cadena: ¡Boom!, Pasapalabra ----------------
async function stPromoBoom(P, d) {
  mec('promo boom');
  P.escena((g, w, h, t) => {
    g.fillStyle = '#0a0a14'; g.fillRect(0, 0, w, h); const cx = w * 0.32, cy = h * 0.55, r = h * 0.22;
    const cols = ['#ff3030', '#3080ff', '#30d050', '#ffd030']; cols.forEach((c, i) => { g.strokeStyle = c; g.lineWidth = h * 0.018; g.beginPath(); g.moveTo(cx + r * 0.7, cy - r * 0.3 + i * r * 0.2); g.bezierCurveTo(w * 0.55, cy - r + i * r * 0.5, w * 0.6, cy + i * h * 0.05, w * 0.9, h * 0.35 + i * h * 0.12); g.stroke(); });
    const gr = g.createRadialGradient(cx - r * 0.3, cy - r * 0.3, r * 0.1, cx, cy, r); gr.addColorStop(0, '#5a5a6a'); gr.addColorStop(1, '#0a0a10'); g.fillStyle = gr; g.beginPath(); g.arc(cx, cy, r, 0, 7); g.fill();
    g.fillStyle = '#2a2a30'; g.fillRect(cx - r * 0.18, cy - r * 1.18, r * 0.36, r * 0.25); g.strokeStyle = '#c8a060'; g.lineWidth = h * 0.012; g.beginPath(); g.moveTo(cx, cy - r * 1.18); g.quadraticCurveTo(cx + r * 0.3, cy - r * 1.6, cx + r * 0.5, cy - r * 1.45); g.stroke();
    for (let i = 0; i < 8; i++) { const a = t * 9 + i; g.fillStyle = i % 2 ? '#ffd23a' : '#ff6a1a'; g.beginPath(); g.arc(cx + r * 0.5 + Math.cos(a) * h * 0.03, cy - r * 1.45 + Math.sin(a) * h * 0.03, h * 0.008, 0, 7); g.fill(); }
    stTexto(g, '¡BOOM!', w * 0.68, h * 0.2, h * 0.16 * (1 + Math.max(0, Math.sin(t * 3)) * 0.06), '#ffd23a', '#a00000');
    stTexto(g, 'ESTA TARDE · ' + CADENA.toUpperCase(), w * 0.68, h * 0.85, h * 0.045, '#fff', '#000', w * 0.6);
  });
  for (const l of d.lineas) { P.sub = l; await stHabla(d.voz, l, P.s); await P.s.w(200); } await P.s.w(700);
}
async function stPromoPasapalabra(P, d) {
  mec('promo pasapalabra'); const L = 'ABCDEFGHIJLMNÑOPQRSTUVXYZ'.split('');
  P.escena((g, w, h, t) => {
    const gr = g.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, '#0a2a8a'); gr.addColorStop(1, '#020a3a'); g.fillStyle = gr; g.fillRect(0, 0, w, h);
    const cx = w * 0.35, cy = h * 0.5, R = h * 0.34; L.forEach((l, i) => { const a = -Math.PI / 2 + i / L.length * Math.PI * 2, x = cx + Math.cos(a) * R, y = cy + Math.sin(a) * R, on = i < (t * 4) % (L.length + 6); g.fillStyle = on ? (i % 7 === 3 ? '#e02a2a' : '#2ac83a') : '#2a6aff'; g.beginPath(); g.arc(x, y, h * 0.042, 0, 7); g.fill(); g.lineWidth = h * 0.006; g.strokeStyle = '#fff'; g.stroke(); g.font = `900 ${h * 0.045}px Arial`; g.fillStyle = '#fff'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(l, x, y + 1); });
    stTexto(g, 'PASAPALABRA', w * 0.72, h * 0.3, h * 0.09, '#fff', '#0a1a6a', w * 0.5); stTexto(g, 'CADA TARDE', w * 0.72, h * 0.45, h * 0.06, '#ffd23a', '#0a1a6a'); stTexto(g, CADENA.toUpperCase(), w * 0.72, h * 0.56, h * 0.05, '#fff', '#0a1a6a');
  });
  for (const l of d.lineas) { P.sub = l; await stHabla(d.voz, l, P.s); await P.s.w(200); } await P.s.w(700);
}
// ---------------- La Cocina de Paco (cocina 3D + Chef Paco Sartén, cocinero virtual inventado) ----------------
function stCocina3D() {
  const T = _E, sc = new T.Scene(); sc.background = new T.Color(0xeef0f4);
  sc.add(new T.HemisphereLight(0xffffff, 0x8a8070, 1.5)); const dl = new T.DirectionalLight(0xffffff, 1.4); dl.position.set(2, 6, 5); sc.add(dl);
  const M = (c, o = {}) => new T.MeshPhongMaterial({ color: c, shininess: 40, ...o }); const caja = (w, h, d, mat, x, y, z) => { const m = new T.Mesh(new T.BoxGeometry(w, h, d), mat); m.position.set(x, y, z); sc.add(m); return m; };
  const madera = M(0xd8c4a0), blanco = M(0xf8f8fa, { shininess: 80 }), cristal = M(0x14161a, { shininess: 120, specular: 0x888888 }), acero = M(0xb8bcc4, { shininess: 120, specular: 0xffffff });
  caja(20, 0.1, 14, M(0xd0d2d6, { shininess: 90 }), 0, -0.05, 0); // suelo
  caja(14, 2.2, 0.2, M(0x2a2a30), 0, 4.1, -4.1); for (let x = -7; x < 7; x += 0.35) caja(0.04, 2.2, 0.02, M(0x3a3a42), x, 4.1, -3.99); // pared de listones oscuros
  caja(14, 3, 0.2, blanco, 0, 1.5, -4.2); // pared blanca
  for (let i = 0; i < 3; i++) { caja(1.3, 1.1, 0.6, blanco, -5.2 + i * 1.35, 2.6, -3.8); caja(1.1, 0.8, 0.05, cristal, -5.2 + i * 1.35, 1.55, -3.48); caja(1.3, 0.9, 0.6, M(0x9a9ea6), -5.2 + i * 1.35, 1.55, -3.8); caja(1.3, 1.1, 0.6, blanco, -5.2 + i * 1.35, 0.55, -3.8); } // columna de hornos
  caja(2.2, 0.9, 0.7, madera, 1.5, 0.45, -3.75); caja(2.3, 0.06, 0.75, blanco, 1.5, 0.93, -3.75); caja(2.4, 0.04, 0.3, blanco, 0.5, 1.9, -4.0); // muebles y estante
  for (let i = 0; i < 4; i++) { const b = new T.Mesh(new T.CylinderGeometry(0.05, 0.05, 0.32, 10), M([0x2a6a2a, 0x6a2a1a, 0x2a2a6a, 0xa08a2a][i])); b.position.set(-0.2 + i * 0.25, 2.08, -4.0); sc.add(b); }
  const fr = caja(1.6, 2.4, 0.8, acero, 4.2, 1.2, -3.7); caja(0.02, 2.3, 0.02, M(0x555555), 4.2, 1.2, -3.29); // frigorífico de acero (sin marca)
  caja(0.2, 4, 8, M(0xd8104a, { shininess: 20 }), 6.2, 2, -0.5); // pared roja/magenta
  caja(1.2, 2.2, 0.7, M(0x9a9ea6), 5.6, 1.1, 1.0); caja(0.9, 0.6, 0.05, cristal, 5.24, 1.5, 1.0).rotation.y = Math.PI / 2;
  // isla: muebles de madera clara, encimera blanca, placa de inducción negra, tabla de madera y sartén
  caja(4.4, 0.9, 1.4, madera, 0, 0.45, 0.6); caja(4.6, 0.08, 1.6, blanco, 0, 0.94, 0.6); caja(1.5, 0.02, 0.9, cristal, 0.5, 0.99, 0.55);
  caja(0.9, 0.06, 0.5, M(0xa07040), -1.3, 1.01, 0.7);
  const sarten = new T.Group(); const base = new T.Mesh(new T.CylinderGeometry(0.28, 0.24, 0.06, 28), M(0x1a1a1e)); sarten.add(base); const mango = new T.Mesh(new T.BoxGeometry(0.45, 0.03, 0.05), M(0x1a1a1e)); mango.position.x = 0.45; sarten.add(mango);
  const tort = new T.Mesh(new T.CylinderGeometry(0.24, 0.24, 0.05, 28), M(0xf0c040)); tort.position.y = 0.05; sarten.add(tort); sarten.position.set(0.5, 1.03, 0.55); sc.add(sarten);
  for (const x of [-1.5, 0, 1.5]) { const l = new T.Mesh(new T.CylinderGeometry(0.12, 0.12, 0.7, 16), new T.MeshBasicMaterial({ color: 0xfffaf0 })); l.position.set(x, 3.4, 0.4); sc.add(l); caja(0.01, 1.6, 0.01, M(0x333333), x, 4.5, 0.4); }
  // Chef Paco Sartén (personaje virtual): chaquetilla blanca y gorro alto
  const chef = new T.Group(), piel = M(0xf0c8a8), ropa = M(0xffffff, { shininess: 30 });
  const cuerpo = new T.Mesh(new T.CylinderGeometry(0.34, 0.38, 1.1, 20), ropa); cuerpo.position.y = 1.15; chef.add(cuerpo);
  for (let i = 0; i < 3; i++) { const bt = new T.Mesh(new T.SphereGeometry(0.03, 8, 6), M(0xdddddd)); bt.position.set(0.1, 1.45 - i * 0.18, 0.34); chef.add(bt); }
  const piernas = new T.Mesh(new T.CylinderGeometry(0.3, 0.28, 0.6, 16), M(0x2a2a34)); piernas.position.y = 0.3; chef.add(piernas);
  const cabeza = new T.Mesh(new T.SphereGeometry(0.24, 20, 16), piel); cabeza.position.y = 1.95; chef.add(cabeza);
  for (const dx of [-0.08, 0.08]) { const ojo = new T.Mesh(new T.SphereGeometry(0.03, 8, 6), M(0x111111)); ojo.position.set(dx, 2.0, 0.22); chef.add(ojo); }
  const bigote = new T.Mesh(new T.BoxGeometry(0.18, 0.04, 0.04), M(0x6a6a6a)); bigote.position.set(0, 1.88, 0.23); chef.add(bigote);
  const gorroB = new T.Mesh(new T.CylinderGeometry(0.22, 0.22, 0.08, 20), ropa); gorroB.position.y = 2.17; chef.add(gorroB);
  const gorro = new T.Mesh(new T.CylinderGeometry(0.27, 0.2, 0.6, 20), ropa); gorro.position.y = 2.5; chef.add(gorro);
  const brazoI = new T.Mesh(new T.CylinderGeometry(0.08, 0.08, 0.7, 10), ropa), brazoD = brazoI.clone();
  const hI = new T.Group(), hD = new T.Group(); hI.position.set(-0.4, 1.6, 0); hD.position.set(0.4, 1.6, 0); brazoI.position.y = -0.35; brazoD.position.y = -0.35; hI.add(brazoI); hD.add(brazoD); chef.add(hI, hD);
  const espatula = new T.Mesh(new T.BoxGeometry(0.05, 0.5, 0.02), madera); espatula.position.set(0, -0.8, 0.05); hD.add(espatula);
  chef.position.set(0, 0, -0.5); sc.add(chef);
  return { sc, chef, hI, hD, sarten, tort, cabeza };
}
async function stPromoCocina(P, d) {
  mec('promo cocina'); const T = _E; let r = null, C = null, paso = 0;
  try { r = new T.WebGLRenderer({ canvas: P.c3, antialias: true }); r.setPixelRatio(Math.min(2, devicePixelRatio || 1)); C = stCocina3D(); } catch (e) { r = null; }
  const cam = new T.PerspectiveCamera(42, 16 / 9, 0.1, 60); P.c3.style.display = r ? 'block' : 'none'; let vivo = true;
  const tiro = [[0, 2.5, 6.4, 0, 1.7, -0.6], [2.4, 2.4, 5.0, 0, 1.75, -0.5], [-0.8, 2.5, 3.8, 0.2, 1.45, 0], [0.9, 2.9, 3.6, 0.4, 1.25, 0.2], [-3.2, 2.6, 5.6, 0.5, 1.7, -0.8]];
  const bucle = () => { if (!vivo || !r) return; const t = performance.now() / 1000; const w = innerWidth, h = innerHeight; r.setSize(w, h, false); cam.aspect = w / h; cam.updateProjectionMatrix();
    const k = tiro[paso % tiro.length]; cam.position.lerp(new T.Vector3(k[0] + Math.sin(t * 0.3) * 0.2, k[1], k[2]), 0.04); cam.lookAt(k[3], k[4], k[5]);
    C.hD.rotation.x = -0.6 + Math.sin(t * 6) * 0.35; C.hI.rotation.z = 0.25 + Math.sin(t * 2) * 0.1; C.cabeza.rotation.y = Math.sin(t * 1.3) * 0.25; C.chef.position.y = Math.abs(Math.sin(t * 3)) * 0.02;
    if (paso === 5) { const f = (t % 1.2) / 1.2; C.tort.position.y = 0.05 + Math.sin(f * Math.PI) * 0.6; C.tort.rotation.x = f * Math.PI * 2; } else { C.tort.position.y = 0.05; C.tort.rotation.x = 0; }
    C.tort.material.color.set(paso >= 6 ? 0xe0a030 : 0xf0c040); r.render(C.sc, cam); requestAnimationFrame(bucle); };
  requestAnimationFrame(bucle);
  P.escena((g, w, h, t) => { // rótulos encima de la cocina
    if (!r) { g.fillStyle = '#f0f0f4'; g.fillRect(0, 0, w, h); stTexto(g, '👨‍🍳', w / 2, h / 2, h * 0.3); }
    g.save(); g.fillStyle = 'rgba(216,16,74,.92)'; g.fillRect(w * 0.04, h * 0.06, w * 0.36, h * 0.11); g.fillStyle = '#fff'; g.font = `900 ${h * 0.05}px "Arial Black", Arial`; g.textAlign = 'left'; g.textBaseline = 'middle'; g.fillText('LA COCINA DE PACO', w * 0.055, h * 0.1, w * 0.34); g.font = `700 ${h * 0.025}px system-ui`; g.fillText('Hoy: ' + d.receta, w * 0.055, h * 0.145, w * 0.34); g.restore();
    if (t < 6 || paso === 0) { g.save(); g.fillStyle = 'rgba(255,255,255,.92)'; g.fillRect(w * 0.06, h * 0.72, w * 0.34, h * 0.08); g.fillStyle = '#d8104a'; g.font = `900 ${h * 0.035}px Arial`; g.textAlign = 'left'; g.textBaseline = 'middle'; g.fillText(d.chef, w * 0.075, h * 0.76, w * 0.32); g.restore(); }
    if (paso > 0 && paso < d.lineas.length - 1) { g.save(); g.fillStyle = '#ffd23a'; g.beginPath(); g.arc(w * 0.92, h * 0.25, h * 0.06, 0, 7); g.fill(); stTexto(g, String(paso), w * 0.92, h * 0.255, h * 0.06, '#d8104a', '#fff'); g.restore(); }
    g.font = `600 ${h * 0.02}px system-ui`; g.fillStyle = 'rgba(0,0,0,.55)'; g.textAlign = 'left'; g.fillText('Programa y cocinero inventados (personaje virtual)', w * 0.02, h * 0.97);
  });
  try { for (let i = 0; i < d.lineas.length; i++) { paso = i; P.sub = d.lineas[i]; await stHabla(d.voz, d.lineas[i], P.s); await P.s.w(300); } await P.s.w(800); }
  finally { vivo = false; P.c3.style.display = 'none'; try { r && r.dispose(); r && r.forceContextLoss && r.forceContextLoss(); } catch (e) { } }
}
async function stPromoCadena(P, d) { return d.id === 'boom' ? stPromoBoom(P, d) : d.id === 'pasapalabra' ? stPromoPasapalabra(P, d) : stPromoCocina(P, d); }
// ---------------- la pausa completa ----------------
const azar = l => l.slice().sort(() => Math.random() - 0.5);
/** que: 'pausa' | 'anuncio:<id>' | 'cadena:<id>' | 'cortinillas' */
async function stCorre(que = 'pausa', ses) {
  const P = new StPantalla(ses); try { F.stopMusic(0.5); } catch (e) { }
  try {
    if (que.startsWith('anuncio:')) await stAnuncio(P, ST_DATOS.anuncios.find(a => a.id === que.slice(8)) || ST_DATOS.anuncios[0]);
    else if (que.startsWith('cadena:')) await stPromoCadena(P, ST_DATOS.promosCadena.find(a => a.id === que.slice(7)) || ST_DATOS.promosCadena[0]);
    else if (que === 'cortinillas') { for (const c of ['publicidad', 'min1', 'anuncios3', 'seg30', 'anuncio1', 'volvemos']) await stCortinilla(P, c); }
    else {
      const ads = azar(ST_DATOS.anuncios), promo = azar(ST_DATOS.promosCadena)[0];
      await stCortinilla(P, 'publicidad'); await stCortinilla(P, 'min1'); await stCortinilla(P, 'anuncios3');
      await stAnuncio(P, ads[0]); await stAnuncio(P, ads[1]); await stCortinilla(P, 'seg30'); await stPromoCadena(P, promo);
      await stCortinilla(P, 'anuncio1'); await stAnuncio(P, ads[2]); await stCortinilla(P, 'volvemos');
    }
  } catch (e) { if (e !== _o) throw e; if (!ses.alive) { P.cerrar(); throw e; } }
  P.cerrar();
}
window.__showtime = { corre: (q, s) => stCorre(q, s), datos: ST_DATOS };
// ---------------- Promos de Marco (en el plató, con el presentador virtual) ----------------
async function promoAdrianCorre(n, def, t) {
  const { eng: e, hud: i } = n, h = e.host; mec('promo adrian ' + def.id);
  const rot = document.createElement('div'); rot.id = 'promoRot'; rot.style.cssText = 'position:absolute;left:0;right:0;top:12%;text-align:center;z-index:12;pointer-events:none;font:900 clamp(26px,6vw,64px) "Arial Black",Arial,sans-serif;color:#fff;text-shadow:0 0 18px #2a8aff,0 4px 0 #0a1a5a,0 6px 10px #000;transition:transform .35s cubic-bezier(.2,1.3,.4,1),opacity .3s;opacity:0;transform:scale(.6)';
  const bug = document.createElement('canvas'); bug.width = 360; bug.height = 110; bug.style.cssText = 'position:absolute;right:12px;top:56px;width:150px;z-index:12;pointer-events:none;opacity:.9'; stLogo(bug.getContext('2d'), 60, 55, 100);
  const hudEl = document.getElementById('hud'); hudEl.append(rot, bug);
  const ponRot = (a, b) => { rot.style.opacity = '0'; rot.style.transform = 'scale(.6)'; setTimeout(() => { rot.innerHTML = (a || '') + (b ? `<div style="font-size:.55em;color:#ffd23a">${b}</div>` : ''); if (a || b) { rot.style.opacity = '1'; rot.style.transform = 'scale(1)'; } }, 180); };
  try {
    F.playMusic('TrilhaCurta@Stage', true, 0.35); e.opps.forEach(o => o.root.visible = true);
    await Af(t, i, async v => {
      const p0 = h.root.position.clone(); const tiros = [[0.9, 1.7, 3.2], [-1.4, 1.5, 3.6], [0.2, 1.6, 2.2], [2.4, 2.4, 5.5]];
      for (let k = 0; k < def.pasos.length; k++) {
        const [txt, gest, r1, r2] = def.pasos[k], q = tiros[k % tiros.length];
        e.cut(new P(p0.x + q[0], p0.y + q[1], p0.z + q[2]), new P(p0.x, p0.y + 1.35, p0.z)); e.face(h, new P(p0.x + q[0], 0, p0.z + q[2] + 4));
        try { He(h, ['saluda', 'senala', 'habla', 'aplaude', 'arriba'].includes(gest) ? gest : 'habla', 2.5); } catch (x) { }
        ponRot(r1, r2); let fin = false; i.say(txt, 3200).then(() => fin = true); await v.until(() => fin); await v.w(300);
      }
      ponRot(''); try { ze.aplauso(2.5, 0.6); } catch (x) { } await v.w(900);
    });
  } finally { rot.remove(); bug.remove(); try { F.stopMusic(0.8); } catch (x) { } i.hideBubble && i.hideBubble(); }
}
// ---------------- menús: «Promos de Marco», «Publicidad» y la fila de Opciones ----------------
function filaPublicidad() {
  const row = document.createElement('div'); row.className = 'orow'; row.id = 'rowPublicidad';
  const lb = document.createElement('label'); lb.textContent = '📺 Publicidad en el Programa completo'; row.appendChild(lb);
  for (const [v, t] of [['1', 'Sí'], ['0', 'No']]) { const b = document.createElement('button'); b.className = 'tbtn' + ((pubEnPrograma() ? '1' : '0') === v ? ' sel' : ''); b.textContent = t; b.onclick = ev => { ev.stopPropagation(); localStorage.setItem('ac_pub_programa', v); row.querySelectorAll('button').forEach(x => x.classList.toggle('sel', x === b)); }; row.appendChild(b); }
  return row;
}
function menuShowTime(a, r) {
  const caja = html => { const d = document.createElement('div'); d.style.cssText = 'background:#0a1a5acc;border:2px solid #3a6aff;border-radius:16px;padding:10px 12px;margin:4px 0;color:#fff;font:14px system-ui'; d.innerHTML = html; return d; };
  if (a === 'promosadrian') {
    r.appendChild(Pa('Promos de Marco'));
    r.appendChild(caja(`Promos en 3D en el plató: nuestro presentador virtual <b>Marco Vitale</b> presenta ¡Ahora caigo! en ${CADENA}. (Personaje virtual, voz sintética.)`));
    for (const d of ST_DATOS.promosAdrian) r.appendChild(ei(d.emoji + ' ' + d.titulo, d.sub, d.id === 'proximo' ? 'gold' : '', () => ii('promoadrian', d.id)));
    r.appendChild(Ia('main')); return;
  }
  r.appendChild(Pa('Publicidad · ' + CADENA));
  r.appendChild(caja(`Pausa publicitaria de <b>${CADENA}</b> con anuncios <b>inventados</b> (marcas y productos de broma) y promos de la cadena. También puede salir en mitad del Programa completo.`));
  r.appendChild(ei('📺 Pausa publicitaria completa', 'Cortinillas, 3 anuncios, una promo y ¡volvemos!', 'gold', () => ii('publicidad', 'pausa')));
  r.appendChild(ei('⏱️ Cortinillas', 'Publicidad · Volvemos en 1 minuto · 30 segundos · 3 anuncios · 1 anuncio', '', () => ii('publicidad', 'cortinillas')));
  r.appendChild(Pa('Promos de la cadena'));
  for (const d of ST_DATOS.promosCadena) r.appendChild(ei(d.emoji + ' ' + d.titulo, d.id === 'cocina' ? 'Con el Chef Paco Sartén: ' + d.receta : 'Promo del programa', '', () => ii('publicidad', 'cadena:' + d.id)));
  r.appendChild(Pa('Anuncios inventados'));
  const g = document.createElement('div'); g.className = 'themes';
  for (const d of ST_DATOS.anuncios) { const b = document.createElement('button'); b.className = 'tbtn'; b.innerHTML = `<span>🛒</span>${d.marca}`; b.title = d.producto; b.onclick = ev => { ev.stopPropagation(); ii('publicidad', 'anuncio:' + d.id); }; g.appendChild(b); }
  r.appendChild(g); r.appendChild(filaPublicidad()); r.appendChild(Ia('main'));
}
async function modoShowTime(a, e, n, t) {
  if (a === 'promoadrian') {
    const l = ST_DATOS.promosAdrian, d = l.find(x => x.id === e) || l[0]; await promoAdrianCorre(n, d, t); await copresentador(n, t, { ctx: 'promo' });
    const sig = l[(l.indexOf(d) + 1) % l.length];
    yn.score(`📺 «${d.titulo}»`, true); yn.actions([{ label: 'Siguiente ▶', cls: 'gold', fn: () => ii('promoadrian', sig.id) }, { label: 'Repetir', fn: () => ii('promoadrian', d.id) }, { label: 'Lista', fn: () => { jt && (jt.alive = false), jt = null, Mi = false, Lt('promosadrian'); } }]);
    Xe.startOrbit(new P(0, 0, 0), 10.8, 5, 0, 0.08, 1); await t.until(() => false);
  } else {
    await stCorre(e || 'pausa', t);
    if ((e || 'pausa') === 'pausa') await instalaV115().aleatoriaReproduce(.7);
    yn.actions([{ label: 'Ver otra vez', cls: 'gold', fn: () => ii('publicidad', e) }, { label: 'Publicidad', fn: () => { jt && (jt.alive = false), jt = null, Mi = false, Lt('publicidad'); } }]);
    Xe.startOrbit(new P(0, 0, 0), 10.8, 5, 0, 0.08, 1); await t.until(() => false);
  }
}
