
// ===================================================================================================
// Promos 3D en tiempo real (Opciones del menú › Promos), Casting, «Elige el valor de cada huella»
// y el inicio especial del Gran estreno. Todo con personajes virtuales (Marco Vitale, presentador 3D).
// Audios originales de los vídeos: solo en la versión privada (cabecera/<nombre>.mp3) o cargándolos
// con «Cargar músicas»; si no están, la música se sintetiza y la voz es Piper (davefx / daniela).
// ===================================================================================================
const PROMO_QR = '111111100000000010011101001111111|100000100111100100100100001000001|101110101111001100000110101011101|101110101011000000110011101011101|101110101011111110001111001011101|100000101100111000010100001000001|111111101010101010101010101111111|000000001001101010011111100000000|101111100011011001010010101111100|101100000111011011111101001101101|010010100011011111000000110010110|110000000011010101101111111011111|100100101111001110000010110011000|001010000110000100100011001000111|000000101101100111100010011001110|100010011100010100100101111011100|000011101011000101101010010110001|000101000111101010111101001101101|110101101000011110101110010110110|000111011000110010000100010111110|010110110011101000110010110111000|111010001100101111000001101100001|101000101110110001001010001011110|100100010011110010111111010011101|100010100111111001000001111110000|000000001101100001111000100010101|111111100110011111001101101010110|100000101111111011111111100011101|101110101101111010000010111111000|101110101011100101111001010011111|101110101100001110100010001101000|100000100010100100011100000011100|111111101111001101010010101100010'.split('|');
const PROMO_WEB = 'https://ikeriano.github.io/ahoracaigo-web/';
// ---------- Marco Vitale, presentador virtual: camisa blanca arremangada, tirantes negros, pantalón oscuro, gafas y zapatillas blancas ----------
function promoAdrian() {
  const T = _E, L = (c, e = 0) => new T.MeshLambertMaterial({ color: c, emissive: e });
  const piel = L(0xf0c8a8, 0x2a1408), camisa = L(0xf6f6f8, 0x202024), pant = L(0x1e2230, 0x050608), negro = L(0x101012), zap = L(0xffffff, 0x303030), pelo = L(0x5a3a22, 0x100804);
  const root = new T.Group(), cuerpo = new T.Group(); root.add(cuerpo);
  const cil = (r0, r1, h, m) => { const g = new T.CylinderGeometry(r0, r1, h, 14); g.translate(0, -h / 2, 0); return new T.Mesh(g, m); };
  const pierna = sx => { const cad = new T.Group(); cad.position.set(sx * 0.1, 0.94, 0); cuerpo.add(cad); cad.add(cil(0.085, 0.075, 0.46, pant)); const rod = new T.Group(); rod.position.y = -0.46; cad.add(rod); rod.add(cil(0.072, 0.062, 0.44, pant)); const z = new T.Mesh(new T.BoxGeometry(0.12, 0.08, 0.27), zap); z.position.set(0, -0.48, 0.05); rod.add(z); const su = new T.Mesh(new T.BoxGeometry(0.125, 0.025, 0.28), L(0xd8d8d8)); su.position.set(0, -0.515, 0.05); rod.add(su); return { cad, rod }; };
  const pL = pierna(-1), pR = pierna(1);
  const torso = new T.Mesh(new T.CapsuleGeometry(0.19, 0.36, 4, 14), camisa); torso.position.y = 1.2; torso.scale.set(1, 1, 0.68); cuerpo.add(torso);
  const cad = new T.Mesh(new T.CylinderGeometry(0.2, 0.19, 0.12, 16), pant); cad.position.y = 0.98; cad.scale.z = 0.72; cuerpo.add(cad);
  for (const sx of [-1, 1]) { for (const sz of [1, -1]) { const t = new T.Mesh(new T.BoxGeometry(0.035, 0.52, 0.012), negro); t.position.set(sx * 0.085, 1.21, sz * 0.132); t.rotation.z = sx * sz * 0.06; cuerpo.add(t); } }
  const cuello = new T.Mesh(new T.CylinderGeometry(0.055, 0.06, 0.1, 10), piel); cuello.position.y = 1.47; cuerpo.add(cuello);
  const cab = new T.Group(); cab.position.y = 1.6; cuerpo.add(cab);
  const cr = new T.Mesh(new T.SphereGeometry(0.135, 20, 16), piel); cr.scale.set(0.95, 1.1, 1); cab.add(cr);
  const pe = new T.Mesh(new T.SphereGeometry(0.142, 20, 12, 0, Math.PI * 2, 0, Math.PI * 0.5), pelo); pe.position.y = 0.025; pe.scale.set(0.98, 0.9, 1.02); pe.rotation.x = -0.25; cab.add(pe);
  for (const sx of [-1, 1]) { const o = new T.Mesh(new T.SphereGeometry(0.016, 8, 6), negro); o.position.set(sx * 0.045, 0.01, 0.125); cab.add(o); const g = new T.Mesh(new T.TorusGeometry(0.035, 0.007, 6, 18), negro); g.position.set(sx * 0.047, 0.01, 0.135); cab.add(g); const pa = new T.Mesh(new T.BoxGeometry(0.006, 0.006, 0.12), negro); pa.position.set(sx * 0.125, 0.015, 0.075); cab.add(pa); }
  const pu = new T.Mesh(new T.BoxGeometry(0.03, 0.006, 0.006), negro); pu.position.set(0, 0.015, 0.137); cab.add(pu);
  const boca = new T.Mesh(new T.TorusGeometry(0.035, 0.006, 6, 16, Math.PI), L(0x8a2a2a)); boca.position.set(0, -0.05, 0.126); boca.rotation.z = Math.PI; cab.add(boca);
  const brazo = sx => { const hom = new T.Group(); hom.position.set(sx * 0.25, 1.42, 0); cuerpo.add(hom); hom.add(cil(0.062, 0.056, 0.27, camisa)); const man = new T.Mesh(new T.CylinderGeometry(0.06, 0.06, 0.05, 12), camisa); man.position.y = -0.25; hom.add(man); const co = new T.Group(); co.position.y = -0.28; hom.add(co); co.add(cil(0.045, 0.04, 0.25, piel)); const mano = new T.Mesh(new T.SphereGeometry(0.052, 10, 8), piel); mano.position.y = -0.29; mano.scale.set(0.8, 1.1, 0.6); co.add(mano); const pul = new T.Mesh(new T.CapsuleGeometry(0.014, 0.05, 2, 6), piel); pul.position.set(-sx * 0.035, -0.27, 0.03); pul.visible = false; co.add(pul); return { hom, co, pul }; };
  const bL = brazo(-1), bR = brazo(1);
  const pose = (p = {}) => { // ángulos en radianes
    bL.hom.rotation.set(p.hlx || 0, 0, p.hlz ?? -0.1); bR.hom.rotation.set(p.hrx || 0, 0, p.hrz ?? 0.1); bL.co.rotation.set(p.clx || 0, 0, p.clz || 0); bR.co.rotation.set(p.crx || 0, 0, p.crz || 0);
    pL.cad.rotation.x = p.pl || 0; pR.cad.rotation.x = p.pr || 0; pL.rod.rotation.x = p.rl || 0; pR.rod.rotation.x = p.rr || 0; cab.rotation.set(p.cx || 0, p.cy || 0, p.cz || 0); cuerpo.position.y = p.by || 0; cuerpo.rotation.z = p.bz || 0;
    bR.pul.visible = !!p.pulgar; boca.scale.set(1, p.boca ?? 1, 1);
  };
  const A = {
    idle: t => pose({ hlx: -0.55, hrx: -0.55, hlz: 0.35, hrz: -0.35, clx: -0.9, crx: -0.9, by: Math.sin(t * 2) * 0.005, cy: Math.sin(t * 0.7) * 0.08 }),
    habla: t => { const a = Math.sin(t * 3.1), b = Math.sin(t * 2.3 + 1); pose({ hlx: -0.5 - a * 0.25, hrx: -0.6 - b * 0.3, hlz: -0.15 - a * 0.1, hrz: 0.2 + b * 0.15, clx: -0.9 - a * 0.3, crx: -1 - b * 0.35, cy: Math.sin(t * 1.3) * 0.15, cx: Math.sin(t * 2.7) * 0.04, boca: 0.6 + Math.abs(Math.sin(t * 11)) * 1.4, by: Math.sin(t * 2) * 0.006 }); },
    frota: t => { const a = Math.sin(t * 14) * 0.08; pose({ hlx: -0.65 + a, hrx: -0.65 - a, hlz: 0.42, hrz: -0.42, clx: -1.0, crx: -1.0, boca: 1.6, cz: Math.sin(t * 2) * 0.06 }); },
    señala: (t, izq = true) => pose({ hlx: izq ? -1.4 : -0.2, hlz: izq ? -0.35 : -0.1, hrx: izq ? -0.2 : -1.4, hrz: izq ? 0.1 : 0.35, clx: izq ? -0.1 : -0.2, crx: izq ? -0.2 : -0.1, cy: izq ? 0.35 : -0.35, boca: 1.2 }),
    pulgar: t => pose({ hlx: -0.2, hrx: -0.6, hrz: 0.3, crx: -1.6, pulgar: true, boca: 1.8, cy: Math.sin(t * 2) * 0.05 }),
    presenta: (t, k = 1) => pose({ hlx: -0.9 * k, hrx: -0.9 * k, hlz: -0.9 * k, hrz: 0.9 * k, clx: -0.3, crx: -0.3, boca: 1.6, cx: -0.05 }),
    anda: t => { const a = Math.sin(t * 6.5); pose({ pl: a * 0.45, pr: -a * 0.45, rl: Math.max(0, -a) * 0.6, rr: Math.max(0, a) * 0.6, hlx: -a * 0.4, hrx: a * 0.4, clx: -0.3, crx: -0.3, by: Math.abs(Math.cos(t * 6.5)) * 0.03 }); },
    cae: t => pose({ hlx: -2.6, hrx: -2.6, hlz: -0.5, hrz: 0.5, pl: -0.5, pr: 0.3, rl: 0.6, rr: 0.4, boca: 2 }),
  };
  A.idle(0); return { root, A, pose, cab };
}
function promoShowTime2D(g, w, h, k, cfg, op = {}) { // cortinilla de círculos concéntricos y «SHOW TIME tv»
  const cx = w / 2, cy = h / 2, R = Math.hypot(w, h) / 2; if (k <= 0) return;
  const f = cfg && cfg.f2d || ['#1a6ae0', '#4aa8ff', '#bfe6ff'], cols = [f[0], f[1], f[2], f[1]], paso = h * 0.09, desp = (k * 26) % (paso * 4);
  g.save(); g.beginPath(); g.arc(cx, cy, R * Math.min(1, k * 2.4), 0, 7); g.clip();
  for (let r = R + paso * 4, i = 0; r > 0; r -= paso, i++) { g.fillStyle = cols[(i + Math.floor(desp / paso)) % 4]; g.beginPath(); g.arc(cx, cy, Math.max(0, r - (desp % paso)), 0, 7); g.fill(); }
  g.restore();
  const reb = x => x <= 0 ? 0 : x >= 1 ? 1 : 1 - Math.pow(2, -9 * x) * Math.cos(x * 13);
  const rc = h * 0.2 * reb(Math.max(0, (k - 0.08) * 2.2)); if (rc < 2) return;
  const dx = op.presenta ? -rc * 0.7 * Math.min(1, Math.max(0, (k - 0.3) * 4)) : 0;
  if (op.presenta && k > 0.3) { const a = Math.min(1, (k - 0.3) * 4); g.save(); g.globalAlpha = a; const pw = rc * 2.3, ph = rc * 0.6, px = cx + dx + rc * 0.5, py = cy - ph / 2; const gr = g.createLinearGradient(0, py, 0, py + ph); gr.addColorStop(0, '#ff9a2a'); gr.addColorStop(1, '#e8500a'); g.fillStyle = gr; g.beginPath(); g.roundRect ? g.roundRect(px, py, pw * a, ph, ph / 2) : g.rect(px, py, pw * a, ph); g.fill(); g.font = `italic 900 ${ph * 0.5}px ${CAB_FUENTE}`; g.fillStyle = '#ffffff'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('PRESENTA', px + pw * 0.6, cy + 2); g.restore(); }
  g.fillStyle = '#ffffff'; g.beginPath(); g.arc(cx + dx, cy, rc * 1.12, 0, 7); g.fill();
  g.lineWidth = rc * 0.08; g.strokeStyle = '#ff5a1a'; g.beginPath(); g.arc(cx + dx, cy, rc * 1.02, 0, 7); g.stroke();
  const gc = g.createLinearGradient(cx + dx - rc, cy - rc, cx + dx + rc, cy + rc); gc.addColorStop(0, '#2a7aff'); gc.addColorStop(0.5, '#0a2aa0'); gc.addColorStop(0.51, '#06166a'); gc.addColorStop(1, '#0a1a5a'); g.fillStyle = gc; g.beginPath(); g.arc(cx + dx, cy, rc * 0.97, 0, 7); g.fill();
  const txt = (t, x, y, px) => { g.font = `italic 900 ${px}px ${CAB_FUENTE}`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillStyle = '#0a2a9a'; for (let d = 1; d <= px * 0.12; d++) g.fillText(t, x + d, y + d); g.fillStyle = '#ffffff'; g.fillText(t, x, y); };
  g.save(); g.translate(cx + dx, cy); g.rotate(-0.12); txt('SHOW', -rc * 0.12, -rc * 0.24, rc * 0.42); txt('TIME', rc * 0.06, rc * 0.2, rc * 0.42); g.font = `900 ${rc * 0.16}px ${CAB_FUENTE}`; g.fillStyle = '#ffffff'; g.fillText('tv', rc * 0.62, rc * 0.34); g.restore();
}
let PROMO_LOGO = null;
function promoLogoCanvas() { if (PROMO_LOGO) return PROMO_LOGO; const c = document.createElement('canvas'); c.width = 480; c.height = 420; pv(c.getContext('2d'), 480, 420, { variant: 'normal' }); return PROMO_LOGO = c; }
function promoMarcas(g, w, h, op = {}) { // marcas de agua: logo arriba a la derecha, SHOW TIME TV abajo a la derecha, «TP», #AHORACAIGO…
  const u = h / 100; g.save();
  if (op.logo) { const lw = u * 16; g.globalAlpha = op.alfa ?? 0.85; g.drawImage(promoLogoCanvas(), w - lw - u * 3, u * 2.5, lw, lw * 420 / 480); g.globalAlpha = 1; }
  if (op.estreno) { g.font = `900 ${u * 3}px ${CAB_FUENTE}`; g.textAlign = 'center'; g.fillStyle = '#ffffff'; g.strokeStyle = '#0a1a5a'; g.lineWidth = u * 0.7; const x = w - u * 11, y = u * 18.5; g.strokeText('GRAN ESTRENO', x, y); g.fillText('GRAN ESTRENO', x, y); g.fillStyle = '#ffd23a'; g.strokeText('MUY PRONTO', x, y + u * 3.6); g.fillText('MUY PRONTO', x, y + u * 3.6); }
  if (op.hashtag) { g.font = `900 ${u * 4}px ${CAB_FUENTE}`; g.textAlign = 'left'; g.textBaseline = 'top'; g.lineWidth = u * 0.8; g.strokeStyle = '#0a1a5a'; g.strokeText('#AHORACAIGO', u * 3, u * 3); g.fillStyle = '#ffffff'; g.fillText('#AHORACAIGO', u * 3, u * 3); }
  if (op.tp) { g.fillStyle = '#18c040'; g.beginPath(); g.roundRect ? g.roundRect(w - u * 9, u * 3, u * 6, u * 3.6, u * 0.8) : g.rect(w - u * 9, u * 3, u * 6, u * 3.6); g.fill(); g.font = `900 ${u * 2.6}px ${CAB_FUENTE}`; g.fillStyle = '#ffffff'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('TP', w - u * 6, u * 4.9); }
  if (op.showtime) { g.font = `italic 900 ${u * 3.4}px ${CAB_FUENTE}`; g.textAlign = 'right'; g.textBaseline = 'bottom'; g.globalAlpha = 0.85; g.lineWidth = u * 0.7; g.strokeStyle = '#0a2a9a'; g.strokeText('SHOW TIME TV', w - u * 3, h - u * 3); g.fillStyle = '#ffffff'; g.fillText('SHOW TIME TV', w - u * 3, h - u * 3); }
  g.restore();
}
function promoQR(g, x, y, s) { const n = PROMO_QR.length, m = s / (n + 8); g.fillStyle = '#ffffff'; g.fillRect(x, y, s, s); g.fillStyle = '#000000'; PROMO_QR.forEach((f, j) => { for (let i = 0; i < n; i++) if (f[i] === '1') g.fillRect(x + (i + 4) * m, y + (j + 4) * m, m + 0.6, m + 0.6); }); }
// música de respaldo de las promos: base rítmica, pads de tensión y golpes en los momentos clave
function promoSynth(ctx, out, dur, op = {}) {
  const t0 = ctx.currentTime + 0.08, nodos = [], bpm = op.bpm || 120, b = 60 / bpm;
  const env = (g, t, a, d, v) => { g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(v, t + a); g.gain.exponentialRampToValueAtTime(0.0001, t + a + d); };
  const osc = (tipo, f, t, d, v, f2, a = 0.005) => { const o = ctx.createOscillator(), g = ctx.createGain(); o.type = tipo; o.frequency.setValueAtTime(f, t); if (f2) o.frequency.exponentialRampToValueAtTime(f2, t + d); env(g, t, a, d, v); o.connect(g).connect(out); o.start(t); o.stop(t + a + d + 0.05); nodos.push(o); };
  const nb = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate); { const d = nb.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1; }
  const ruido = (t, d, v, f0, f1, q = 1, a) => { const s = ctx.createBufferSource(), bp = ctx.createBiquadFilter(), g = ctx.createGain(); s.buffer = nb; s.loop = true; bp.type = 'bandpass'; bp.Q.value = q; bp.frequency.setValueAtTime(f0, t); bp.frequency.exponentialRampToValueAtTime(f1, t + d); env(g, t, a ?? Math.min(0.3, d / 3), d, v); s.connect(bp).connect(g).connect(out); s.start(t); s.stop(t + d + 0.5); nodos.push(s); };
  const golpe = t => { osc('sine', 140, t0 + t, 0.9, 0.9, 32); ruido(t0 + t, 0.5, 0.6, 1800, 300, 0.8); [0, 4, 7, 12].forEach(n => osc('sawtooth', 196 * Math.pow(2, n / 12), t0 + t, 0.9, 0.06)); };
  const prog = op.menor ? [[0, 3, 7], [-4, 0, 3], [-2, 2, 5], [-5, -1, 2]] : [[0, 4, 7], [-3, 0, 4], [5, 9, 12], [7, 11, 14]];
  const fin = op.fin ?? dur - 4;
  for (let i = 0, t = op.desde || 0; t < fin; i++, t += b) {
    const T0 = t0 + t, ch = prog[Math.floor(i / 8) % 4];
    if (!op.sinBateria) { osc('sine', 120, T0, 0.22, 0.7, 45); if (i % 2) ruido(T0, 0.16, 0.3, 2500, 1500, 0.7); ruido(T0 + b / 2, 0.05, 0.1, 9000, 8000, 3); }
    osc('square', 55 * Math.pow(2, ch[0] / 12) * 2, T0, b * 0.8, 0.1);
    if (i % 8 === 0) ch.forEach(n => osc('sawtooth', 261.6 * Math.pow(2, n / 12), T0, b * 7.5, 0.025, null, 0.6));
  }
  (op.golpes || []).forEach(golpe);
  (op.aplausos || []).forEach(t => ruido(t0 + t, 3, 0.25, 3000, 2000, 0.4, 0.2));
  (op.viento || []).forEach(t => ruido(t0 + t, 2.5, 0.35, 400, 1500, 0.6, 0.4));
  ruido(t0 + fin - 1.2, 1.2, 0.35, 300, 8000, 1.2); golpe(fin + 0.1); [0, 4, 7, 12, 16].forEach((n, k) => osc('triangle', 523 * Math.pow(2, n / 12), t0 + fin + 0.4 + k * 0.08, 1.6, 0.07));
  return { t0, stop: () => nodos.forEach(n => { try { n.stop(); } catch (e) {} }) };
}
const PROMO_AUDIO = () => localStorage.getItem('ac_promo_audio') || 'recreado'; // 'original' (si está cargado) | 'recreado'
// motor común de las promos: lienzo 3D + capa de rótulos 3D + capa 2D, audio y salto
async function promoCorre(def, hud, sess) {
  const T = _E, W0 = window;
  const div = document.createElement('div'); div.id = 'promo3d'; div.style.cssText = 'position:fixed;inset:0;z-index:60;background:#000;cursor:pointer';
  const cv = document.createElement('canvas'); cv.style.cssText = 'position:absolute;inset:0;width:100%;height:100%';
  const c2 = document.createElement('canvas'); c2.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;pointer-events:none';
  const salta = document.createElement('div'); salta.textContent = 'Toca para saltar ⏭'; salta.style.cssText = 'position:absolute;left:18px;bottom:16px;padding:6px 14px;border-radius:18px;background:#0008;color:#fff;font:600 15px system-ui;opacity:.85;pointer-events:none';
  div.append(cv, c2, salta); document.body.appendChild(div);
  let ren; try { ren = new T.WebGLRenderer({ canvas: cv, antialias: true }); } catch (e) { div.remove(); return false; }
  const pr = Math.min(2, W0.devicePixelRatio || 1); ren.setPixelRatio(pr); ren.outputColorSpace = T.SRGBColorSpace; ren.autoClear = false;
  const cam = new T.PerspectiveCamera(50, 16 / 9, 0.05, 300), tcam = new T.PerspectiveCamera(40, 16 / 9, 0.1, 100); tcam.position.set(0, 0, 10); tcam.lookAt(0, 0, 0);
  const txt = new T.Scene(); const g2 = c2.getContext('2d');
  const resize = () => { const w = innerWidth, h = innerHeight; ren.setSize(w, h, false); cam.aspect = tcam.aspect = w / h; cam.updateProjectionMatrix(); tcam.updateProjectionMatrix(); c2.width = w * pr; c2.height = h * pr; };
  resize(); addEventListener('resize', resize);
  const st = W0.__promo = { id: def.id, estado: 'cargando', t: 0 };
  const C = { T, ren, cam, tcam, txt, g2, c2, cv, cfg: cabTema(def.tema || { id: 'normal' }), anchoTxt: () => 2 * 10 * Math.tan(20 * Math.PI / 180) * tcam.aspect,
    ease: x => x < 0 ? 0 : x > 1 ? 1 : x * x * (3 - 2 * x), lerp: (a, b, k) => a + (b - a) * k, rebote: x => x <= 0 ? 0 : x >= 1 ? 1 : 1 - Math.pow(2, -9 * x) * Math.cos(x * 13),
    render(sc, cm = cam, vp) { if (vp) { const w = c2.width / pr, h = c2.height / pr; ren.setScissorTest(true); ren.setViewport(vp[0] * w, vp[1] * h, vp[2] * w, vp[3] * h); ren.setScissor(vp[0] * w, vp[1] * h, vp[2] * w, vp[3] * h); const a0 = cm.aspect; cm.aspect = vp[2] * w / (vp[3] * h); cm.updateProjectionMatrix(); ren.render(sc, cm); cm.aspect = a0; cm.updateProjectionMatrix(); ren.setScissorTest(false); ren.setViewport(0, 0, w, h); } else ren.render(sc, cm); },
  };
  C.def = def;
  // rótulos 3D: C.rotulo(texto, tamaño, opciones) -> grupo; C.anima(grupo, t, t0, t1, modo)
  C.rotulo = (s, size = 0.8, op = {}) => { const G = cabFrase(s, size * 1.35, { cara: op.cara || 'rotulo', capas: 8, fondo: 0.25 }); G.visible = false; G.position.set(op.x || 0, (op.y || 0) * 1.3, 0); G.userData.y0 = (op.y || 0) * 1.3; txt.add(G); return G; };
  C.anima = (G, t, t0, t1, modo = 'vuela') => {
    const on = t >= t0 && t < t1; G.visible = on; if (!on) return; const d = t - t0, esc = Math.min(1, C.anchoTxt() * 0.92 / Math.max(0.1, G.userData.ancho)); G.scale.setScalar(esc);
    G.userData.letras.forEach((L, i) => { const D = L.userData.dest; const k = C.rebote((d - i * 0.03) / 0.6), k2 = C.ease((d - i * 0.025) / 0.5);
      if (modo === 'vuela') { L.position.set(D.x + (1 - k2) * (8 + i * 0.4), D.y + (1 - k2) * 2, D.z - (1 - k2) * 12); L.rotation.set(0, (1 - k2) * -1.4, 0); }
      else if (modo === 'cae') { L.position.set(D.x, D.y + (1 - k) * 7, D.z); L.rotation.z = (1 - k) * 0.6; }
      else if (modo === 'golpe') { const s = 1 + (1 - C.rebote(d / 0.5)) * 2.5; L.position.set(D.x * s, D.y * s, D.z); L.scale.setScalar(s); }
      else if (modo === 'sube') { L.position.set(D.x, D.y - (1 - k2) * 1.5, D.z); L.scale.setScalar(Math.max(0.01, k2)); }
      else L.position.copy(D); });
    if (modo === 'golpe' && d > 0.45 && d < 0.75) G.position.x = Math.sin(d * 120) * 0.06; else G.position.x = 0; };
  // audio
  const vol = To.mute ? 0 : Math.max(0, Math.min(1, To.vol));
  let audio = null, synth = null, voces = [], reloj0 = performance.now();
  const orig = def.audioUrl || (def.audio && RC.audioExtra && RC.audioExtra(def.audio));
  const usarOrig = orig && (def.soloMusica || PROMO_AUDIO() === 'original');
  if (usarOrig) { audio = new Audio(orig); audio.volume = vol; try { await audio.play(); } catch (e) { audio = null; } }
  if (!audio) { try { F.ctx.state === 'suspended' && await F.ctx.resume(); const gm = F.ctx.createGain(); gm.gain.value = vol * 0.45; gm.connect(F.ctx.destination); synth = promoSynth(F.ctx, gm, def.dur, def.musica || {}); synth.gain = gm; } catch (e) { synth = null; } }
  const ahora = () => window.__promoT != null ? window.__promoT : audio && !audio.paused && audio.currentTime > 0 ? audio.currentTime : synth ? Math.max(0, F.ctx.currentTime - synth.t0) : (performance.now() - reloj0) / 1000;
  const vozOn = !usarOrig && !To.mute && it.voz !== false; const vPend = vozOn ? (def.voces || []).map(v => ({ ...v })) : [];
  st.estado = 'reproduciendo'; st.audio = usarOrig ? 'original' : synth ? 'sintetizada' : 'sin';
  C.audioOrig = !!audio; const frame = def.montar(C);
  let fin = null; const termina = new Promise(r => fin = r); let hecho = false; const acaba = e => { if (!hecho) { hecho = true; st.estado = e; fin(); } };
  div.addEventListener('pointerdown', ev => { ev.preventDefault(); ev.stopPropagation(); acaba('saltado'); }); hud && hud.skip && hud.skip(() => acaba('saltado'));
  const vigila = setInterval(() => { if (sess && sess.alive === false) acaba('abort'); }, 100);
  const bucle = () => {
    if (hecho) return; const t = ahora(); st.t = t; if (t >= def.dur) { acaba('terminado'); return; }
    for (const v of vPend) if (!v.ya && t >= v.t) { v.ya = true; const a = new Audio(v.url); a.volume = Math.min(1, vol * 1.1 + 0.1); a.play().catch(() => {}); voces.push(a); }
    g2.setTransform(1, 0, 0, 1, 0, 0); g2.clearRect(0, 0, c2.width, c2.height); ren.setClearColor(0x000000, 1); ren.clear();
    try { frame(t); } catch (e) { console.warn('promo', e); }
    ren.clearDepth(); ren.render(txt, tcam);
    requestAnimationFrame(bucle);
  };
  requestAnimationFrame(bucle);
  const tope = setTimeout(() => { if (window.__promoT == null) acaba('tiempo'); }, (def.dur + 8) * 1000);
  await termina; clearTimeout(tope); clearInterval(vigila); hud && hud.skip && hud.skip(null); removeEventListener('resize', resize);
  voces.forEach(a => { try { a.pause(); } catch (e) {} });
  if (audio) { const a0 = audio, v0 = a0.volume; let i = 0; const fd = setInterval(() => { a0.volume = Math.max(0, v0 * (1 - ++i / 8)); if (i >= 8) { clearInterval(fd); a0.pause(); } }, 40); }
  if (synth) { try { synth.gain.gain.setTargetAtTime(0, F.ctx.currentTime, 0.1); setTimeout(() => synth.stop(), 600); } catch (e) {} }
  div.style.transition = 'opacity .35s'; div.style.opacity = '0';
  setTimeout(() => { const lib = sc => sc && sc.traverse(o => { o.geometry && o.geometry.dispose(); const ms = o.material ? (Array.isArray(o.material) ? o.material : [o.material]) : []; ms.forEach(m => { m.map && m.map.dispose(); m.dispose(); }); }); (C.escenas || []).forEach(lib); lib(txt); try { ren.dispose(); ren.forceContextLoss(); } catch (e) {} div.remove(); }, 400);
  sess && sess.check && sess.check(); return true;
}
// ---------- decorados compartidos ----------
function promoTunel(op = {}) { // túnel de líneas de neón rojas (con pilares azules y panel-píldora con el logo al fondo)
  const T = _E, S = new T.Scene(); S.background = new T.Color(0x020206); S.fog = new T.Fog(0x020206, 18, op.largo || 70);
  const largo = op.largo || 64, an = op.ancho || 6, al = op.alto || 4.2;
  const rojo = new T.MeshBasicMaterial({ color: 0xff1a2a }), rojoR = new T.MeshBasicMaterial({ color: 0xff1a2a, transparent: true, opacity: 0.28 }), azul = new T.MeshBasicMaterial({ color: 0x2a6aff }), azulR = new T.MeshBasicMaterial({ color: 0x2a6aff, transparent: true, opacity: 0.25 });
  const suelo = new T.Mesh(new T.PlaneGeometry(an * 3, largo + 20), new T.MeshPhongMaterial({ color: 0x9aa0b4, specular: 0xffffff, shininess: 160, transparent: true, opacity: 0.55 })); suelo.rotation.x = -Math.PI / 2; suelo.position.z = -largo / 2; S.add(suelo);
  S.add(new T.HemisphereLight(0xc8d8ff, 0x101018, 1.2));
  const linea = (x0, y0, x1, y1, z, m, mr) => { const L = Math.hypot(x1 - x0, y1 - y0), g = new T.BoxGeometry(L, 0.05, 0.05); for (const [mm, sy] of [[m, 1], [mr, -1]]) { if (!mm) continue; const b = new T.Mesh(g, mm); b.position.set((x0 + x1) / 2, sy * (y0 + y1) / 2, z); b.rotation.z = sy * Math.atan2(y1 - y0, x1 - x0); S.add(b); } };
  for (let z = 2; z > -largo; z -= op.paso || 2.2) {
    for (const sx of [-1, 1]) { for (let k = 0; k < 4; k++) { const y = 0.5 + k * 0.9; linea(sx * an / 2, y, sx * (an / 2 + 0.9), y + 0.45, z, rojo, rojoR); } linea(sx * an / 2, 0.02, sx * an / 2, al, z, op.pilares ? null : rojo, op.pilares ? null : rojoR); }
    for (let k = -2; k <= 2; k++) linea(k * 1.1, al, k * 1.1 + 0.8, al + 0.4, z, rojo, null);
    linea(-an / 2, al, an / 2, al, z, rojo, null);
  }
  if (op.pilares) for (let z = 0; z > -largo; z -= 8) for (const sx of [-1, 1]) { for (const [m, sy] of [[azul, 1], [azulR, -1]]) { const p = new T.Mesh(new T.BoxGeometry(0.5, al, 0.5), m); p.position.set(sx * (an / 2 - 0.3), sy * al / 2, z); S.add(p); } }
  let panel = null;
  if (op.panel !== false) { const tx = cabTex(1024, 512, (g, w, h) => { const r = h / 2; g.fillStyle = '#0a2aa0'; g.beginPath(); g.roundRect ? g.roundRect(4, 4, w - 8, h - 8, r) : g.rect(0, 0, w, h); g.fill(); const gr = g.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, '#2a7aff'); gr.addColorStop(1, '#06166a'); g.fillStyle = gr; g.beginPath(); g.roundRect ? g.roundRect(24, 24, w - 48, h - 48, r - 20) : g.rect(24, 24, w - 48, h - 48); g.fill(); g.lineWidth = 12; g.strokeStyle = '#8ad8ff'; g.stroke(); g.drawImage(promoLogoCanvas(), w / 2 - 230, 40, 460, 400); });
    panel = new T.Mesh(new T.PlaneGeometry(7, 3.5), new T.MeshBasicMaterial({ map: tx, transparent: true })); panel.position.set(0, 2.2, -largo + 2); S.add(panel); const pr = panel.clone(); pr.material = new T.MeshBasicMaterial({ map: tx, transparent: true, opacity: 0.25 }); pr.position.y = -2.2; pr.scale.y = -1; S.add(pr); }
  return { scene: S, panel, largo };
}
function promoPuerta(S, pos, r, ring = 0xff7a1a) { // trampilla de dos hojas que se abren hacia abajo (luz roja dentro)
  const T = _E, G = new T.Group(); G.position.copy(pos); S.add(G);
  const hueco = new T.Mesh(new T.CircleGeometry(r, 48), new T.MeshBasicMaterial({ color: 0x000000 })); hueco.rotation.x = -Math.PI / 2; hueco.position.y = 0.004; G.add(hueco);
  const brillo = new T.Mesh(new T.CircleGeometry(r * 0.98, 48), new T.MeshBasicMaterial({ color: 0xff1010, transparent: true, opacity: 0 })); brillo.rotation.x = -Math.PI / 2; brillo.position.y = -0.6; G.add(brillo);
  const tx = cabHuellas('#ff8a1a', '#101018', '#ff9a2a'), hojas = [];
  for (const sx of [-1, 1]) { const bis = new T.Group(); bis.position.set(sx * r, 0.01, 0); G.add(bis); const geo = new T.CircleGeometry(r, 32, sx < 0 ? -Math.PI / 2 : Math.PI / 2, Math.PI); geo.rotateX(-Math.PI / 2); const uv = geo.attributes.uv; const m = new T.Mesh(geo, new T.MeshBasicMaterial({ map: tx, side: T.DoubleSide })); m.position.x = -sx * r; bis.add(m); hojas.push([bis, sx]); }
  const aro = new T.Mesh(new T.RingGeometry(r, r * 1.18, 64), new T.MeshBasicMaterial({ color: ring })); aro.rotation.x = -Math.PI / 2; aro.position.y = 0.012; G.add(aro);
  const luz = new T.PointLight(0xff2020, 0, 8); luz.position.set(0, 0.5, 0); G.add(luz);
  return { G, aro, abre: k => { hojas.forEach(([b, sx]) => b.rotation.z = sx * k * 1.65); brillo.material.opacity = k * 0.9; luz.intensity = k * 30; } };
}
function promoPlatoAdrian(cfg, op = {}) { // pared azul con pantalla grande, suelo reflectante y pasarela con ranuras neón
  const T = _E, S = new T.Scene(); S.background = new T.Color(0x02040c); S.add(new T.HemisphereLight(0xe8f0ff, 0x101018, 1.5)); { const l = new T.DirectionalLight(0xffffff, 1.1); l.position.set(1, 5, 6); S.add(l); }
  const pantC = document.createElement('canvas'); pantC.width = 1024; pantC.height = 576; const pantT = new T.CanvasTexture(pantC); pantT.colorSpace = T.SRGBColorSpace;
  const pared = new T.Mesh(new T.CylinderGeometry(14, 14, 7, 96, 1, true, Math.PI * 0.72, Math.PI * 0.56), new T.MeshBasicMaterial({ side: T.DoubleSide, map: cabTex(1024, 512, (g, w, h) => { const gr = g.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, '#06124a'); gr.addColorStop(0.6, '#0a3ac8'); gr.addColorStop(1, '#06124a'); g.fillStyle = gr; g.fillRect(0, 0, w, h); g.fillStyle = 'rgba(120,200,255,.35)'; for (let y = 40; y < h; y += 60) g.fillRect(0, y, w, 4); for (let x = 0; x < w; x += 128) { g.fillStyle = 'rgba(255,190,40,.6)'; g.fillRect(x, h * 0.72, 60, 10); } }) })); pared.position.set(0, 3.3, 5); S.add(pared);
  const pant = new T.Mesh(new T.PlaneGeometry(6.4, 3.6), new T.MeshBasicMaterial({ map: pantT })); pant.position.set(0, 3.3, -8.6); S.add(pant);
  const marco = new T.Mesh(new T.BoxGeometry(6.8, 4.0, 0.2), new T.MeshPhongMaterial({ color: 0x0a1a5a, emissive: 0x050a20 })); marco.position.set(0, 3.3, -8.75); S.add(marco);
  for (const sx of [-1, 1]) { const col = new T.Mesh(new T.BoxGeometry(1.2, 4.2, 0.3), new T.MeshBasicMaterial({ map: cabTex(128, 512, (g, w, h) => { g.fillStyle = '#0a1a5a'; g.fillRect(0, 0, w, h); g.fillStyle = '#ffc21a'; g.beginPath(); g.ellipse(w / 2, h / 2, w * 0.32, h * 0.38, 0, 0, 7); g.fill(); g.fillStyle = '#000'; g.beginPath(); g.ellipse(w / 2, h / 2, w * 0.18, h * 0.3, 0, 0, 7); g.fill(); }) })); col.position.set(sx * 4.2, 3.3, -8.5); S.add(col); }
  const suelo = new T.Mesh(new T.PlaneGeometry(30, 30), new T.MeshPhongMaterial({ color: 0x8a90a8, specular: 0xffffff, shininess: 170, map: cabTex(512, 512, (g, w) => { g.fillStyle = '#20263a'; g.fillRect(0, 0, w, w); const gr = g.createLinearGradient(0, 0, 0, w); gr.addColorStop(0, 'rgba(60,120,255,.5)'); gr.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = gr; g.fillRect(w * 0.35, 0, w * 0.3, w); }) })); suelo.rotation.x = -Math.PI / 2; suelo.position.z = -2; S.add(suelo);
  // pasarela con ranuras de neón rojas y azules
  for (let i = 0; i < 16; i++) for (const sx of [-1, 1]) { const m = new T.Mesh(new T.BoxGeometry(1.6, 0.02, 0.08), new T.MeshBasicMaterial({ color: i % 2 ? 0x2a6aff : 0xff1a2a })); m.position.set(sx * 2.4, 0.012, 6 - i * 0.9); m.rotation.y = sx * 0.25; S.add(m); }
  const pasa = new T.Mesh(new T.BoxGeometry(3.2, 0.06, 16), new T.MeshPhongMaterial({ color: 0xb8c0d8, specular: 0xffffff, shininess: 140 })); pasa.position.set(0, 0.03, -1); S.add(pasa);
  return { scene: S, pantC, pantT };
}
function promoPantalla(C, g, w, h, t, modo, op = {}) { // contenido de la pantalla grande (logo, vídeo de archivo recreado, carrusel)
  const gr = g.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, '#1b52e6'); gr.addColorStop(1, '#0a1a7a'); g.fillStyle = gr; g.fillRect(0, 0, w, h);
  if (modo === 'logo') { g.drawImage(promoLogoCanvas(), w / 2 - h * 0.55, h * 0.04, h * 1.1, h * 0.96); return; }
  if (modo === 'dvd') { // «vídeo de archivo» casero: niño virtual presentando, con grano y rótulo «Año 2013»
    g.fillStyle = '#5a4a3a'; g.fillRect(0, 0, w, h); g.fillStyle = '#8a7a6a'; g.fillRect(0, h * 0.65, w, h * 0.35); g.fillStyle = '#c8b89a'; g.fillRect(w * 0.08, h * 0.1, w * 0.26, h * 0.4);
    const cx = w * 0.55 + Math.sin(t * 1.3) * 10, cy = h * 0.42; g.fillStyle = '#2ac85a'; g.beginPath(); g.ellipse(cx, cy + h * 0.38, w * 0.15, h * 0.26, 0, 0, 7); g.fill(); g.fillStyle = '#f0c8a8'; g.beginPath(); g.arc(cx, cy, h * 0.16, 0, 7); g.fill(); g.fillStyle = '#5a3a22'; g.beginPath(); g.arc(cx, cy - h * 0.05, h * 0.165, Math.PI, 0); g.fill(); g.fillStyle = '#1a1a1a'; for (const sx of [-1, 1]) { g.beginPath(); g.arc(cx + sx * h * 0.055, cy, h * 0.018, 0, 7); g.fill(); } g.strokeStyle = '#8a2a2a'; g.lineWidth = 5; g.beginPath(); g.arc(cx, cy + h * 0.05, h * 0.05 * (0.5 + Math.abs(Math.sin(t * 9))), 0.2, Math.PI - 0.2); g.stroke();
    g.fillStyle = '#c8c8d0'; g.save(); g.translate(cx + w * 0.12, cy + h * 0.2); g.rotate(-0.6 + Math.sin(t * 3) * 0.2); g.fillRect(-6, -h * 0.12, 12, h * 0.16); g.beginPath(); g.arc(0, -h * 0.13, 14, 0, 7); g.fill(); g.restore();
    const im = g.getImageData(0, 0, w, h), d = im.data; for (let i = 0; i < d.length; i += 4 * 7) { const n = (Math.random() - 0.5) * 50; d[i] += n; d[i + 1] += n; d[i + 2] += n; } g.putImageData(im, 0, 0);
    g.fillStyle = 'rgba(255,255,255,.06)'; g.fillRect(0, (t * 300) % h, w, 6);
    g.fillStyle = '#ff7a10'; g.fillRect(w * 0.05, h * 0.8, w * 0.22, h * 0.1); g.font = `900 ${h * 0.065}px ${CAB_FUENTE}`; g.fillStyle = '#fff'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('Año 2013', w * 0.16, h * 0.855);
    g.font = `700 ${h * 0.045}px monospace`; g.textAlign = 'right'; g.fillText('▶ PLAY  SP  00:0' + Math.floor(t % 10) + ':' + String(Math.floor((t * 25) % 60)).padStart(2, '0'), w * 0.95, h * 0.08); return; }
  if (modo === 'carrusel') { const L = op.lista, i = Math.floor(t / op.cada) % L.length, k = (t % op.cada) / op.cada, dx = k > 0.85 ? (k - 0.85) / 0.15 * w : 0; g.save(); g.translate(-dx, 0);
    const [n, a] = L[i]; g.fillStyle = '#0a0a1a'; g.fillRect(w * 0.1, h * 0.12, w * 0.8, h * 0.6); g.strokeStyle = '#ffc21a'; g.lineWidth = 8; g.strokeRect(w * 0.1, h * 0.12, w * 0.8, h * 0.6); g.font = `900 ${h * 0.12}px ${CAB_FUENTE}`; g.fillStyle = '#ffffff'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(n, w / 2, h * 0.42, w * 0.74);
    g.fillStyle = '#ff7a10'; g.fillRect(w * 0.05, h * 0.8, w * 0.42, h * 0.1); g.font = `900 ${h * 0.06}px ${CAB_FUENTE}`; g.fillStyle = '#fff'; g.fillText(n + ' · ' + a, w * 0.26, h * 0.855, w * 0.4); g.restore(); }
}
// ---------- las promos ----------
const promoTramo = (C, t, lista) => { // lista: [t0, t1, [x,y,z] desde, [x,y,z] hasta, mirar desde, mirar hasta, curva]
  for (const [a, b, p0, p1, m0, m1, cur] of lista) if (t >= a && t < b) { const k = (cur || C.ease)((t - a) / (b - a)); C.cam.position.set(C.lerp(p0[0], p1[0], k), C.lerp(p0[1], p1[1], k), C.lerp(p0[2], p1[2], k)); C.cam.lookAt(C.lerp(m0[0], m1[0], k), C.lerp(m0[1], m1[1], k), C.lerp(m0[2], m1[2], k)); return k; }
  return 1;
};
const PROMOS = {
  casting: { id: 'casting', nombre: 'Casting', dur: 40, emoji: '📝', sub: '¡Apúntate al casting de ¡Ahora caigo!', musica: { bpm: 118, golpes: [4, 11.2, 19, 34], fin: 36.6 },
    montar(C) {
      const T = C.T, cfg = { ...cabTema({ id: 'normal' }), wall: '#2a1080', wall2: '#5a2ad0', chev: '#ffd23a', f2d: ['#1a6ae0', '#4aa8ff', '#bfe6ff'] };
      const E = cabEstudio(cfg, { id: 'normal' }, { sinObjetos: true }); C.escenas = [E.scene];
      const P = promoPuerta(E.scene, new T.Vector3(0, 0.456, 0), 1.1, 0xffd23a); E.tc.visible = false; E.tcr.visible = false;
      const r1 = C.rotulo('La CUENTA ATRÁS', 0.8, { y: 0.6 }), r1b = C.rotulo('HA COMENZADO', 0.8, { y: -0.5 }), r2 = C.rotulo('EL PLATÓ ESTÁ LISTO', 0.8), r3 = C.rotulo('PARA RECIBIR A', 0.7, { y: 0.55 }), r3b = C.rotulo('NUEVOS CONCURSANTES', 0.7, { y: -0.45 }), r4 = C.rotulo('COMO TÚ', 1.5, { cara: 'amarillo' }), r5 = C.rotulo('¿Serás tú el próximo', 0.65, { y: 0.7 }), r5b = C.rotulo('EN CAER?', 1.3, { y: -0.6, cara: 'amarillo' }), r6 = C.rotulo('¡APÚNTATE AL CASTING!', 0.7, { y: 2.6 }), r7 = C.rotulo('¡TE ESPERAMOS!', 1.1);
      // círculo amarillo con huellas que gira y se convierte en QR
      const caraA = cabTex(512, 512, (g, w) => { g.fillStyle = '#ffd21a'; g.beginPath(); g.arc(w / 2, w / 2, w / 2 - 4, 0, 7); g.fill(); g.lineWidth = 14; g.strokeStyle = '#ffffff'; g.stroke(); _pies(g, w / 2, w / 2, w * 0.36, '#1a1000'); });
      const caraB = cabTex(512, 512, (g, w) => { g.fillStyle = '#ffd21a'; g.beginPath(); g.arc(w / 2, w / 2, w / 2 - 4, 0, 7); g.fill(); promoQR(g, w * 0.17, w * 0.17, w * 0.66); g.font = `900 30px ${CAB_FUENTE}`; g.fillStyle = '#1a1000'; g.textAlign = 'center'; g.fillText('CASTING', w / 2, w * 0.12); });
      const disco = new T.Group(); const dA = new T.Mesh(new T.CircleGeometry(1.6, 64), new T.MeshBasicMaterial({ map: caraA, transparent: true })), dB = new T.Mesh(new T.CircleGeometry(1.6, 64), new T.MeshBasicMaterial({ map: caraB, transparent: true })); dB.rotation.y = Math.PI; dB.position.z = -0.01; disco.add(dA, dB); disco.visible = false; C.txt.add(disco);
      return t => {
        E.update(t);
        const k = promoTramo(C, t, [[0, 2.6, [9, 11, 9], [3, 4.2, 7], [0, 0, 0], [0, 1, 0]], [2.6, 6.6, [0, 3.2, 14], [0, 2.2, 7.5], [0, 1, 0], [0, 0.8, 0]], [6.6, 10.6, [-4, 0.9, 5], [4, 1.2, 4], [-2, 6, -12], [3, 7, -12]], [10.6, 14.6, [-8.5, 5.5, -4], [-7.4, 3.2, -5.6], [-9, 3.6, -9.5], [-9.6, 3.5, -9]], [14.6, 18.6, [-8, 0.55, 6], [8, 0.55, 5], [-2, 0.4, -6], [2, 0.4, -6]], [18.6, 40, [0, 4.6, 14.5], [0, 4.6, 14.5], [0, 1.2, -2], [0, 1.2, -2]]]);
        P.abre(t >= 4 && t < 18.6 ? C.ease((t - 4) / 0.7) : 0);
        C.cv.style.filter = t > 33.6 && t < 37 ? `blur(${Math.min(8, (t - 33.6) * 8)}px)` : '';
        if (t < 36.8) C.render(E.scene);
        C.anima(r1, t, 0.2, 2.6, 'vuela'); C.anima(r1b, t, 0.5, 2.6, 'vuela'); C.anima(r2, t, 2.9, 6.6, 'sube'); C.anima(r3, t, 6.9, 10.6, 'vuela'); C.anima(r3b, t, 7.2, 10.6, 'vuela'); C.anima(r4, t, 11, 14.6, 'golpe'); C.anima(r5, t, 15, 18.6, 'vuela'); C.anima(r5b, t, 15.8, 18.6, 'golpe'); C.anima(r6, t, 19, 33.6, 'cae'); r7.visible = false; if (t >= 34 && t < 36.8) { const g = C.g2, w = C.c2.width, h = C.c2.height, k = 1 + (1 - C.rebote((t - 34) / 0.5)) * 2; g.save(); g.translate(w / 2, h / 2); g.scale(k, k); g.font = `900 ${h * 0.13}px ${CAB_FUENTE}`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.lineJoin = 'round'; g.lineWidth = h * 0.025; g.strokeStyle = '#000'; g.strokeText('¡TE ESPERAMOS!', 0, 0, w * 0.9 / k); g.fillStyle = '#fff'; g.fillText('¡TE ESPERAMOS!', 0, 0, w * 0.9 / k); g.restore(); }
        disco.visible = t >= 20 && t < 33.6; if (disco.visible) { const d = t - 20; disco.position.set(0, -0.4 + (1 - C.rebote(d / 0.8)) * 6, 0); disco.scale.setScalar(Math.min(1, C.anchoTxt() * 0.35 / 3.2)); disco.rotation.y = t < 22 ? 0 : t < 22.8 ? C.ease((t - 22) / 0.8) * Math.PI : t < 32 ? Math.PI : t < 32.8 ? Math.PI + C.ease((t - 32) / 0.8) * Math.PI : 0; }
        if (t < 36.8) promoMarcas(C.g2, C.c2.width, C.c2.height, { logo: true, showtime: true, alfa: 0.6 });
        if (t >= 36.6) promoShowTime2D(C.g2, C.c2.width, C.c2.height, (t - 36.6) / 3.4, C.cfg);
      };
    } },
  anuncio: { id: 'anuncio', nombre: 'Gran anuncio', dur: 21, emoji: '📣', sub: 'La próxima semana, un gran anuncio', audio: 'promo_anuncio', voces: [{ t: 3.4, url: './voz/promo_anuncio_voz.mp3' }], musica: { bpm: 96, menor: true, golpes: [1.0, 2.7, 13, 18], fin: 16.2, sinBateria: false },
    montar(C) {
      const T = C.T, E = cabEstudio(cabTema({ id: 'normal' }), { id: 'normal' }, { sinObjetos: true }); E.tc.visible = false; E.tcr.visible = false;
      const P = promoPuerta(E.scene, new T.Vector3(0, 0.456, 0), 1.1, 0xff7a1a); const cian = new T.Mesh(new T.TorusGeometry(1.45, 0.06, 8, 64), new T.MeshBasicMaterial({ color: 0x2ad8ff })); cian.rotation.x = Math.PI / 2; cian.position.y = 0.47; E.scene.add(cian);
      const F2 = new T.Scene(); const fx = cabTex(1024, 1024, (g, w) => { g.fillStyle = '#021a3a'; g.fillRect(0, 0, w, w); for (let i = 0; i < 70; i++) { g.strokeStyle = i % 3 ? 'rgba(40,200,255,.35)' : 'rgba(200,250,255,.5)'; g.lineWidth = 2 + (i % 4) * 3; g.beginPath(); const y = (i * 61) % w; g.moveTo(0, y); for (let x = 0; x <= w; x += 32) g.lineTo(x, y + Math.sin(x / 90 + i) * 60); g.stroke(); } }); fx.wrapS = fx.wrapT = T.MirroredRepeatWrapping;
      const fondo = new T.Mesh(new T.PlaneGeometry(60, 34), new T.MeshBasicMaterial({ map: fx })); fondo.position.z = -10; F2.add(fondo);
      const H = new T.Scene(); H.background = new T.Color(0x0a2aa0); H.add(new T.HemisphereLight(0xffffff, 0x303050, 1.8)); { const l = new T.DirectionalLight(0xffffff, 1); l.position.set(2, 3, 4); H.add(l); }
      const ch = cabChevrons(cabTema({ id: 'normal' })); ch.repeat.set(-3, 1); const fh = new T.Mesh(new T.PlaneGeometry(9, 2.2), new T.MeshBasicMaterial({ map: ch })); fh.position.set(0, 1.4, -2.5); H.add(fh);
      const A = promoAdrian(); H.add(A.root); const hc = new T.PerspectiveCamera(30, 1, 0.1, 50); hc.position.set(0, 1.25, 3.1); hc.lookAt(0, 1.2, 0);
      C.escenas = [E.scene, F2, H];
      const tit = cabFrase(tituloL1(), 1.1, { cara: 'blanco', capas: 10, fondo: 0.3 }), tit2 = cabFrase(tituloL2(), 1.1, { cara: 'blanco', capas: 10, fondo: 0.3 }); tit.position.set(0, 2.6, 0.6); tit2.position.set(0, 1.55, 0.6); E.scene.add(tit, tit2);
      const R = [[C.rotulo('¡LA PRÓXIMA SEMANA!', 0.85), 4, 5, 'golpe'], [C.rotulo('NO TE PIERDAS EN', 0.75, { y: 0.5 }), 5, 8, 'vuela'], [C.rotulo('SHOWTIME TV ESPAÑA', 0.75, { y: -0.5 }), 5.3, 8, 'vuela'], [C.rotulo('UN GRAN ANUNCIO', 0.9, { y: 0.5 }), 8, 11, 'golpe'], [C.rotulo('QUE MARCARÁ UN ANTES Y UN DESPUÉS', 0.42, { y: -0.45 }), 8.5, 11, 'sube'], [C.rotulo('PARA LOS CONCURSANTES DE', 0.45, { y: 1.5 }), 11, 13, 'sube'], [C.rotulo(tituloL1(), 1.2, { y: 0.35, cara: 'blanco' }), 11.3, 13, 'cae'], [C.rotulo(tituloL2(), 1.2, { y: -0.95, cara: 'blanco' }), 11.4, 13, 'cae']];
      return t => {
        if (t < 3) { E.update(t); const d = t; [tit, tit2].forEach((G, gi) => G.userData.letras.forEach((L, i) => { const D = L.userData.dest, k = C.rebote((d - 0.1 - (gi * 6 + i) * 0.03) / 0.55); L.position.set(D.x, D.y + (1 - k) * 6, D.z); }));
          const caida = t > 2.3 ? (t - 2.3) / 0.7 : 0; P.abre(C.ease((t - 1.6) / 0.6)); [tit, tit2].forEach(G => G.visible = t < 1.9);
          if (t < 1.4) { C.cam.position.set(0, 2.2, C.lerp(10, 8.4, t / 1.4)); C.cam.lookAt(0, 1.6, 0); } else if (t < 2.3) { const k = C.ease((t - 1.4) / 0.9); C.cam.position.set(0, C.lerp(2.2, 2.6, k), C.lerp(8.4, 1.6, k)); C.cam.lookAt(0, C.lerp(1.6, 0, k), C.lerp(0, -0.4, k)); } else { C.cam.position.set(0, C.lerp(2.6, -2.5, caida), C.lerp(1.6, 0.2, caida)); C.cam.lookAt(0, -6, 0); }
          C.render(E.scene); if (t > 2.3) { const g = C.g2, w = C.c2.width, h = C.c2.height; for (let i = 0; i < 6; i++) { g.fillStyle = `rgba(80,180,255,${0.25 * Math.random()})`; g.beginPath(); g.arc(Math.random() * w, Math.random() * h, h * 0.1 * Math.random(), 0, 7); g.fill(); } }
          promoMarcas(C.g2, C.c2.width, C.c2.height, { tp: true }); }
        else if (t < 13) { fx.offset.x = t * 0.05; fx.offset.y = Math.sin(t * 0.4) * 0.1; C.cam.position.set(Math.sin(t * 0.3) * 0.6, 0, 6); C.cam.lookAt(0, 0, -10); C.render(F2); promoMarcas(C.g2, C.c2.width, C.c2.height, { tp: true }); }
        else if (t < 16.2) { const g = C.g2, w = C.c2.width, h = C.c2.height; A.A.frota(t); A.root.rotation.y = Math.sin(t) * 0.1; ch.offset.x = t * 0.3; C.render(H, hc, [0.5, 0, 0.5, 1]);
          g.fillStyle = '#0a3ac8'; g.fillRect(0, 0, w / 2, h); for (let i = 0; i < 6; i++) { g.strokeStyle = `rgba(120,200,255,${0.2 + i * 0.05})`; g.lineWidth = h * 0.02; g.beginPath(); g.arc(-w * 0.1, h * 1.1, h * (0.5 + i * 0.18) + Math.sin(t * 2 + i) * 6, -1.2, 0); g.stroke(); }
          const caja = (x, y, bw, bh, col, tx, fs) => { g.fillStyle = col; g.beginPath(); g.roundRect ? g.roundRect(x, y, bw, bh, bh * 0.2) : g.rect(x, y, bw, bh); g.fill(); g.font = `900 ${fs}px ${CAB_FUENTE}`; g.fillStyle = '#fff'; g.textAlign = 'left'; g.textBaseline = 'middle'; g.fillText(tx, x + bh * 0.3, y + bh / 2, bw - bh * 0.4); };
          const e = C.ease((t - 13) / 0.5); caja(w * 0.05 - (1 - e) * w * 0.5, h * 0.3, w * 0.3, h * 0.08, '#0a1a7a', 'UN GRAN ANUNCIO', h * 0.045); caja(w * 0.04 - (1 - C.ease((t - 13.2) / 0.5)) * w * 0.5, h * 0.4, w * 0.42, h * 0.14, '#ff7a10', '¡AHORA CAIGO!', h * 0.085); caja(w * 0.05 - (1 - C.ease((t - 13.4) / 0.5)) * w * 0.5, h * 0.56, w * 0.32, h * 0.08, '#0a1a7a', 'LA PRÓXIMA SEMANA', h * 0.045);
          const lw = h * 0.3; g.drawImage(promoLogoCanvas(), w * 0.72 - lw / 2, h * 0.66, lw, lw * 420 / 480); promoMarcas(g, w, h, { tp: true }); }
        R.forEach(([G, a, b, m]) => C.anima(G, t, a, b, m));
        if (t >= 16.2) promoShowTime2D(C.g2, C.c2.width, C.c2.height, (t - 16.2) / 4.8, C.cfg);
      };
    } },
  proximamente: { id: 'proximamente', nombre: 'Gran estreno · Próximamente', dur: 23, emoji: '🌟', sub: '10 oponentes, 6 juegos diferentes… ¡próximamente!', audio: 'promo_proximamente', voces: [{ t: 0.4, url: './voz/promo_prox_1.mp3' }, { t: 6.4, url: './voz/promo_prox_2.mp3' }, { t: 9.6, url: './voz/promo_prox_3.mp3' }], musica: { bpm: 120, golpes: [1, 2.2, 3.2, 4, 8.2, 9, 10.2, 13], fin: 18 },
    montar(C) {
      const T = C.T, cfg = cabTema({ id: 'normal' }), E = cabEstudio(cfg, { id: 'normal' }, { sinObjetos: true });
      const H = new T.Scene(); H.add(new T.HemisphereLight(0xffffff, 0x303050, 1.8)); const bgC = document.createElement('canvas'); bgC.width = 1024; bgC.height = 576; const bgT = new T.CanvasTexture(bgC); bgT.colorSpace = T.SRGBColorSpace; const Bs = new T.Scene(); Bs.background = bgT; { const l = new T.DirectionalLight(0xffffff, 1); l.position.set(2, 3, 4); H.add(l); }
      const A = promoAdrian(); H.add(A.root); const hc = new T.PerspectiveCamera(30, 1, 0.1, 50); hc.position.set(0, 1.2, 3.4); hc.lookAt(0, 1.15, 0);
      C.escenas = [E.scene, H, Bs];
      const tit = cabFrase(tituloL1(), 1.1, { cara: 'blanco', capas: 10, fondo: 0.3 }), tit2 = cabFrase(tituloL2(), 1.1, { cara: 'blanco', capas: 10, fondo: 0.3 }); tit.position.set(0, 2.6, 0.6); tit2.position.set(0, 1.55, 0.6); E.scene.add(tit, tit2); [tit, tit2].forEach(G => G.visible = false);
      const fondoCurvas = t => { curvas(bgC.getContext('2d'), 1024, 576, t); bgT.needsUpdate = true; C.render(Bs); };
      const R = [[C.rotulo('10 OPONENTES', 1.0, { cara: 'amarillo' }), 1.0, 2.2, 'golpe'], [C.rotulo('1 CONCURSANTE CENTRAL', 0.62, { cara: 'amarillo' }), 2.2, 3.2, 'vuela'], [C.rotulo('8 FASES', 1.9, { cara: 'amarillo' }), 3.2, 4.0, 'golpe'], [C.rotulo('6 JUEGOS DIFERENTES', 0.7, { cara: 'amarillo' }), 4.0, 7.0, 'vuela'], [C.rotulo('600.000', 1.5, { cara: 'blanco' }), 9.0, 10.2, 'golpe']];
      const huellas = cabHuellas('#ff8a1a'); const disco = new T.Mesh(new T.CircleGeometry(2.2, 64), new T.MeshBasicMaterial({ map: huellas, transparent: true })); disco.position.z = -2; C.txt.add(disco); disco.visible = false;
      const curvas = (g, w, h, t) => { const gr = g.createLinearGradient(0, 0, w, h); gr.addColorStop(0, '#0a2ab0'); gr.addColorStop(1, '#1a6ae8'); g.fillStyle = gr; g.fillRect(0, 0, w, h); for (let i = 0; i < 7; i++) { g.strokeStyle = `rgba(${90 + i * 20},${180 + i * 8},255,${0.25 + i * 0.07})`; g.lineWidth = h * (0.05 + i * 0.012); g.beginPath(); g.arc(-w * 0.05, h * 1.15, h * (0.45 + i * 0.16) + Math.sin(t * 2 + i) * 4, -1.4, 0.1); g.stroke(); } };
      const caja = (g, x, y, bw, bh, col, tx, fs) => { g.fillStyle = col; g.beginPath(); g.roundRect ? g.roundRect(x, y, bw, bh, bh * 0.25) : g.rect(x, y, bw, bh); g.fill(); g.font = `900 ${fs}px ${CAB_FUENTE}`; g.fillStyle = '#fff'; g.textAlign = 'left'; g.textBaseline = 'middle'; g.fillText(tx, x + bh * 0.3, y + bh / 2, bw - bh * 0.5); };
      return t => {
        const g = C.g2, w = C.c2.width, h = C.c2.height, vert = w < h; { const sc = Math.min(1, (w / h) * 1.5); tit.scale.setScalar(sc); tit2.scale.setScalar(sc); tit2.position.y = 2.6 - 1.05 * sc; }
        disco.visible = t >= 0.2 && t < 2.2; if (disco.visible) { const k = C.rebote((t - 0.2) / 0.8); disco.scale.setScalar(Math.max(0.01, k) * Math.min(1, C.anchoTxt() * 0.45 / 4.4)); disco.rotation.z = Math.sin(t * 3) * 0.05; }
        if (t < 2.2) { const r = Math.min(w, h) * (0.15 + Math.min(1, t / 1) * 0.3); g.strokeStyle = '#ff9a2a'; g.shadowColor = '#ff7a1a'; g.shadowBlur = h * 0.06; g.lineWidth = h * 0.012; g.beginPath(); g.arc(w / 2, h / 2, r, 0, 7); g.stroke(); g.shadowBlur = 0; }
        else if (t < 3.2) { E.update(t); const k = C.ease((t - 2.2) / 1); C.cam.position.set(C.lerp(-2.4, 2.4, k), 1.6, 3.6); C.cam.lookAt(0, 1.2, 0); C.render(E.scene); }
        else if (t < 4.0) { const x = bgC.getContext('2d'); x.fillStyle = (t * 8) % 2 < 1 ? '#ffffff' : '#ff9a1a'; x.fillRect(0, 0, 1024, 576); bgT.needsUpdate = true; C.render(Bs); }
        else if (t < 8.2) { E.update(t); const k = (t - 4) / 4.2; const a = C.lerp(-1.4, 1.2, C.ease(k)); C.cam.position.set(Math.sin(a) * C.lerp(11, 6, k), C.lerp(4.6, 2.2, k), Math.cos(a) * C.lerp(11, 6, k)); C.cam.lookAt(0, 1.6, 0); C.render(E.scene); }
        else if (t < 9.0) { E.update(t); tit.visible = tit2.visible = true; [tit, tit2].forEach(G => G.userData.letras.forEach(L => L.position.copy(L.userData.dest))); const k = C.ease((t - 8.2) / 0.8); C.cam.position.set(C.lerp(-1.2, 0, k), C.lerp(2.6, 2.2, k), C.lerp(1.6, 5.5, k)); C.cam.lookAt(C.lerp(-1.2, 0, k), C.lerp(2.6, 2.1, k), 0); C.render(E.scene); }
        else if (t < 10.2) { tit.visible = tit2.visible = false; fondoCurvas(t); }
        else if (t < 13.0) { E.update(t); tit.visible = tit2.visible = true; const d = t - 10.2; [tit, tit2].forEach((G, gi) => G.userData.letras.forEach((L, i) => { const D = L.userData.dest, k = C.rebote((d - (gi * 6 + i) * 0.04) / 0.7); L.position.set(D.x + (1 - k) * (i - 3) * 2, D.y + (1 - k) * 5, D.z - (1 - k) * 8); L.rotation.y = (1 - k) * 2; }));
          C.cam.position.set(0, 2.1, C.lerp(7.5, 6.6, Math.min(1, d / 2.8))); C.cam.lookAt(0, 2.05, 0); C.render(E.scene); if (d < 0.5) { g.fillStyle = `rgba(255,255,255,${1 - d / 0.5})`; g.fillRect(0, 0, w, h); } }
        else if (t < 18.0) { tit.visible = tit2.visible = false; fondoCurvas(t); A.A.habla ? A.A.habla(t) : A.A.idle(t); A.root.rotation.y = Math.sin(t * 0.7) * 0.08;
          const lw = vert ? w * 0.7 : h * 0.62, cx = vert ? w / 2 : w * 0.72, cy = vert ? h * 0.3 : h * 0.5; g.save(); g.strokeStyle = '#ffd23a'; g.lineWidth = h * 0.01; g.beginPath(); g.arc(cx, cy, lw * 0.5, 0, 7); g.stroke(); g.restore();
          C.render(H, hc, vert ? [0.1, 0.45, 0.8, 0.5] : [0.5, 0, 0.44, 1]);
          const lg = vert ? w * 0.36 : h * 0.3; g.drawImage(promoLogoCanvas(), cx + lw * 0.12, cy + lw * 0.12, lg, lg * 420 / 480);
          const bx = vert ? w * 0.06 : w * 0.05, by = vert ? h * 0.62 : h * 0.34, B = vert ? w * 0.88 : w * 0.38, uh = vert ? w * 0.1 : h * 0.08;
          const e = k0 => C.ease((t - 13 - k0) / 0.45);
          caja(g, bx - (1 - e(0)) * w, by, B * 0.75, uh, '#0a1a7a', 'GRAN ESTRENO', uh * 0.55);
          caja(g, bx - (1 - e(0.25)) * w, by + uh * 1.2, B, uh * 1.6, '#ff7a10', tituloTexto(), uh * 0.95);
          if (t > 14.2) caja(g, bx - (1 - e(1.2)) * w, by + uh * 3.0, B * 0.75, uh, '#0a1a7a', 'PRÓXIMAMENTE', uh * 0.55);
          promoMarcas(g, w, h, {}); }
        R.forEach(([G, a, b, m]) => C.anima(G, t, a, b, m));
        if (t >= 18) promoShowTime2D(g, w, h, (t - 18) / 5, C.cfg);
      };
    } },
  estanoche: { id: 'estanoche', nombre: 'Esta noche', dur: 31, emoji: '🌙', sub: 'Descubre el secreto mejor guardado', audio: 'promo_estanoche', musica: { bpm: 100, menor: true, golpes: [6, 14, 20, 21, 22], fin: 26 },
    montar(C) {
      const T = C.T, U = promoTunel({ pilares: true, largo: 64 }); C.escenas = [U.scene];
      const R = [[C.rotulo('ESTA NOCHE', 1.1), 6, 9, 'golpe'], [C.rotulo('DESCUBRE', 0.95, { y: 1.1 }), 14, 17, 'sube'], [C.rotulo('EL SECRETO', 0.95, { y: 0 }), 14.2, 17, 'sube'], [C.rotulo('MEJOR GUARDADO', 0.6, { y: -1 }), 14.4, 17, 'sube'], [C.rotulo('VIVE', 1.8), 20, 21, 'golpe'], [C.rotulo('DE', 1.8), 21, 22, 'golpe']];
      return t => {
        const negro = (t >= 6 && t < 9) || (t >= 14 && t < 17) || (t >= 20 && t < 22);
        const z = t < 22 ? C.lerp(4, -U.largo + 16, t / 22) : C.lerp(-U.largo + 16, -U.largo + 8.5, C.ease((t - 22) / 3));
        C.cam.position.set(Math.sin(t * 0.4) * 0.25, 1.7 + Math.sin(t * 0.9) * 0.06, z); C.cam.lookAt(0, 2, z - 10);
        if (!negro && t < 26.2) C.render(U.scene);
        R.forEach(([G, a, b, m]) => C.anima(G, t, a, b, m));
        if (t >= 26) promoShowTime2D(C.g2, C.c2.width, C.c2.height, (t - 26) / 5, C.cfg);
      };
    } },
  huella: { id: 'huella', nombre: 'Elige el valor de cada huella', dur: 73, emoji: '👣', sub: 'Tú decides cuánto vale cada huella', audio: 'promo_huella', musica: { bpm: 112, golpes: [3, 25, 26, 33, 53, 63], fin: 68 },
    voces: [[4, 1], [14, 2], [24.5, 3], [37.5, 4], [52.6, 5], [56, 6]].map(([t, n]) => ({ t, url: `./voz/promo_huella_${n}.mp3` })),
    montar(C) {
      const T = C.T, cfg = cabTema({ id: 'normal' }), E = cabEstudio(cfg, { id: 'normal' }, { sinObjetos: true }); E.tc.visible = false; E.tcr.visible = false; C.escenas = [E.scene];
      const P = promoPuerta(E.scene, new T.Vector3(0, 0.456, 0), 1.1, 0xff7a1a);
      const logo3d = new T.Mesh(new T.PlaneGeometry(4.2, 3.6), new T.MeshBasicMaterial({ map: new T.CanvasTexture(promoLogoCanvas()), transparent: true })); logo3d.material.map.colorSpace = T.SRGBColorSpace; logo3d.position.set(0, 4.6, -3); E.scene.add(logo3d);
      const A = promoAdrian(); A.root.position.set(1.2, 0.45, 0.6); E.scene.add(A.root);
      // pirámide invertida de 20 huellas (6-5-4-3-2), píldoras amarillas y verdes
      const pir = new T.Group(); const val = huellaValores(); let n = 0;
      [6, 5, 4, 3, 2].forEach((c, f) => { for (let i = 0; i < c; i++, n++) { const v = val[n]; const tx = cabTex(256, 96, (g, w, h) => { g.fillStyle = n < 10 ? '#ffd21a' : '#3ac85a'; g.beginPath(); g.roundRect ? g.roundRect(4, 4, w - 8, h - 8, h / 2 - 4) : g.rect(0, 0, w, h); g.fill(); g.lineWidth = 5; g.strokeStyle = '#1a1000'; g.stroke(); g.font = `900 40px ${CAB_FUENTE}`; g.fillStyle = '#1a1000'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(huellaTxt(v), w / 2, h / 2 + 2, w - 30); }); const m = new T.Mesh(new T.PlaneGeometry(0.7, 0.26), new T.MeshBasicMaterial({ map: tx, transparent: true })); m.position.set((i - (c - 1) / 2) * 0.74, -f * 0.3, 0); pir.add(m); } });
      pir.position.set(-0.75, 2.05, 1.2); pir.scale.setScalar(1.15); pir.visible = false; E.scene.add(pir);
      // portátil 3D con el formulario
      const port = new T.Group(); const baseP = new T.Mesh(new T.BoxGeometry(2.2, 0.08, 1.5), new T.MeshPhongMaterial({ color: 0x9aa0b0, specular: 0xffffff, shininess: 90 })); port.add(baseP);
      const formTx = cabTex(1024, 640, (g, w, h) => { g.fillStyle = '#f4f6fa'; g.fillRect(0, 0, w, h); g.fillStyle = '#0a2aa0'; g.fillRect(0, 0, w, 90); g.drawImage(promoLogoCanvas(), 20, 6, 90, 78); g.font = `900 34px ${CAB_FUENTE}`; g.fillStyle = '#fff'; g.textAlign = 'left'; g.textBaseline = 'middle'; g.fillText('¡Elige el valor de cada huella!', 130, 46); g.fillStyle = '#1a1a2a'; g.font = '600 26px Arial'; const L = ['En la primera temporada virtual de ¡Ahora caigo!', 'con Marco Vitale en SHOW TIME TV ESPAÑA,', 'tú podrás ser parte del programa…', '', 'Coloca los 20 valores en la pirámide de huellas:', 'se usarán en el especial «Elige tu huella».']; L.forEach((s, i) => g.fillText(s, 40, 140 + i * 40)); for (let i = 0; i < 3; i++) { g.strokeStyle = '#8a90a0'; g.lineWidth = 3; g.strokeRect(40, 400 + i * 62, w - 80, 46); } g.fillStyle = '#ff7a10'; g.fillRect(w - 260, h - 70, 220, 50); g.fillStyle = '#fff'; g.font = '900 26px Arial'; g.fillText('ENVIAR', w - 200, h - 44); });
      const pantP = new T.Mesh(new T.BoxGeometry(2.2, 1.4, 0.06), [0, 1, 2, 3].map(() => new T.MeshPhongMaterial({ color: 0x8a90a0 })).concat([new T.MeshBasicMaterial({ map: formTx }), new T.MeshPhongMaterial({ color: 0x8a90a0 })])); pantP.position.set(0, 0.72, -0.72); pantP.rotation.x = -0.18; port.add(pantP); port.position.set(0, 1.0, 2.8); port.visible = false; E.scene.add(port);
      const R = [[C.rotulo('¡Elige el valor', 0.95, { y: 0.55 }), 33, 37, 'sube'], [C.rotulo('de cada huella!', 0.95, { y: -0.55 }), 33.3, 37, 'sube'], [C.rotulo('ENTRA EN: Menú › Elige tu huella', 0.42, { y: -2.6 }), 42, 48, 'vuela'], [C.rotulo('¡SERÁ TU DECISIÓN!', 0.95), 52.8, 55, 'golpe']];
      return t => {
        E.update(t); P.abre(t > 3 && t < 4.4 ? Math.sin((t - 3) / 1.4 * Math.PI) : t > 62.6 ? C.ease((t - 62.6) / 0.6) : 0);
        const cam = (a, b) => promoTramo(C, t, [[a, b, [0.1, 1.85, 4.9], [0.3, 1.8, 4.2], [0.2, 1.45, 0], [0.3, 1.45, 0]]]);
        if (t < 4) promoTramo(C, t, [[0, 4, [0, 2.4, 8.5], [0, 1.6, 5.5], [0, 1.2, 0], [0, 0.6, 0]]]);
        else if (t < 41) cam(4, 41); else if (t < 48) promoTramo(C, t, [[41, 48, [0, 2.3, 5.3], [0, 2.0, 4.3], [0, 1.4, 2.4], [0, 1.4, 2.4]]]); else if (t < 63) cam(48, 63); else promoTramo(C, t, [[63, 75, [0, 2.4, 6.5], [0, 2.4, 6.5], [0, 0.5, 0], [0, 0.4, 0]]]);
        pir.visible = (t >= 25 && t < 26) || (t >= 29 && t < 41) || (t >= 48 && t < 55); port.visible = t >= 41 && t < 48;
        if (t < 25) A.A.habla(t); else if (t < 26.5) A.A.señala(t, true); else if (t < 55) A.A.habla(t); else if (t < 57) A.A.señala(t, false); else if (t < 59) A.A.pulgar(t);
        if (t >= 59 && t < 62.6) { const k = C.ease((t - 59) / 3.4); A.root.position.set(C.lerp(1.2, 0, k), 0.45, C.lerp(0.6, 0, k)); A.root.rotation.y = -1.2 * Math.min(1, (t - 59) * 2); A.A.anda(t); }
        if (t >= 62.6) { const d = t - 62.9; A.root.position.set(0, 0.45 - (d > 0 ? d * d * 9 : 0), 0); A.root.rotation.y = 0; A.A.cae(t); A.root.visible = A.root.position.y > -6; }
        if (!(t >= 26 && t < 29)) C.render(E.scene);
        if (t >= 26 && t < 29) huellaPantallaValores(C.g2, C.c2.width, C.c2.height, t < 27.5 ? 'altos' : 'bajos');
        R.forEach(([G, a, b, m]) => C.anima(G, t, a, b, m));
        if (t < 68) promoMarcas(C.g2, C.c2.width, C.c2.height, { logo: true, showtime: true, alfa: 0.6 });
        if (t >= 68) promoShowTime2D(C.g2, C.c2.width, C.c2.height, (t - 68) / 5, C.cfg);
      };
    } },
  estreno: { id: 'estreno', nombre: 'Gran estreno (inicio del primer programa)', dur: 75, emoji: '🎬', sub: 'Marco Vitale presenta ¡Ahora caigo!', audio: 'estreno', musica: { bpm: 104, golpes: [6, 25, 42, 59.5, 66], viento: [59.6], aplausos: [66.2], fin: 68 },
    voces: [{ t: 6.8, url: './voz/promo_estreno_1.mp3' }, { t: 25.6, url: './voz/promo_estreno_2.mp3' }, { t: 43.0, url: './voz/promo_estreno_3.mp3' }],
    montar(C) {
      const T = C.T, cfg = cabTema({ id: 'normal' }), S = promoPlatoAdrian(cfg), U = promoTunel({ panel: false, largo: 40, ancho: 5.5, paso: 1.6 }), E = cabEstudio(cfg, { id: 'normal' }, { sinObjetos: true });
      C.escenas = [S.scene, U.scene, E.scene];
      const A = promoAdrian(); S.scene.add(A.root); const A2 = promoAdrian(); U.scene.add(A2.root);
      const hueco = new T.Mesh(new T.PlaneGeometry(1.6, 1.6), new T.MeshBasicMaterial({ color: 0x000000 })); hueco.rotation.x = -Math.PI / 2; hueco.position.set(0, 0.015, -8); hueco.scale.set(1, 0.01, 1); U.scene.add(hueco);
      const tit = cabFrase(tituloL1(), 1.2, { cara: 'blanco', capas: 10, fondo: 0.3 }), tit2 = cabFrase(tituloL2(), 1.2, { cara: 'blanco', capas: 10, fondo: 0.3 }); tit.position.set(0, 2.2, 0); tit2.position.set(0, 1.05, 0); E.scene.add(tit, tit2);
      const lista = [['La Hora Del Quiz', '2020'], ['Cifras y Letras', '2021'], ['Jeopardy España', '2023'], ['Wipeout España', '2024'], ['¿QQSM?', '2021-2025']];
      const g = S.pantC.getContext('2d');
      return t => {
        if (t < 6) { promoShowTime2D(C.g2, C.c2.width, C.c2.height, Math.min(1, t / 2.6) * 0.75 + (t > 2.6 ? (t - 2.6) * 0.06 : 0), C.cfg, { presenta: true }); return; }
        if (t < 42) { const modo = t < 16 ? 'logo' : t < 25 ? 'dvd' : t < 28 ? 'logo' : 'carrusel'; promoPantalla(C, g, 1024, 576, t - (modo === 'carrusel' ? 28 : 0), modo, { lista, cada: 2.8 }); S.pantT.needsUpdate = true;
          A.root.position.set(0, 0, 0.8); A.root.rotation.y = 0; if (t < 7 || (t > 24 && t < 25.6)) A.A.idle(t); else A.A.habla(t);
          const k = t < 25 ? 0 : C.ease((t - 25) / 17); C.cam.position.set(0, C.lerp(1.3, 3.4, k), C.lerp(3.4, 13, k)); C.cam.lookAt(0, C.lerp(1.2, 1.8, k), C.lerp(-1, 0, k)); C.render(S.scene);
          promoMarcas(C.g2, C.c2.width, C.c2.height, { logo: true, estreno: true, hashtag: true }); return; }
        if (t < 63) { // túnel: «¡Aquí comienza ¡Ahora caigo!» y la caída
          let z = 0, rotY = 0; if (t < 49.5) { if (t < 45.8) A2.A.habla(t); else A2.A.presenta(t, C.ease((t - 45.8) / 0.5)); z = t > 47 ? C.lerp(0, -0.4, C.ease((t - 47) / 0.5)) : 0; }
          else if (t < 51) { A2.A.idle(t); z = -0.4; rotY = C.ease((t - 49.5) / 1.5) * Math.PI; }
          else if (t < 59.3) { A2.A.anda(t); z = C.lerp(-0.4, -8, C.ease((t - 51) / 8.3) * 0.5 + (t - 51) / 8.3 * 0.5); rotY = Math.PI; }
          else { A2.A.cae(t); z = -8; rotY = Math.PI; }
          hueco.scale.y = t > 59.2 ? Math.min(1, (t - 59.2) * 4) : 0.01; const caida = t > 59.5 ? Math.pow(t - 59.5, 2) * 4.9 : 0; A2.root.position.set(0, -caida, z); A2.root.rotation.y = rotY; A2.root.visible = caida < 8;
          C.cam.position.set(0, 1.5, 4.2 + (t > 51 ? (t - 51) * 0.25 : 0)); C.cam.lookAt(0, 1.2, -3); C.render(U.scene); promoMarcas(C.g2, C.c2.width, C.c2.height, { logo: true, hashtag: true }); return; }
        if (t < 68.4) { E.update(t); const k = C.ease((t - 63) / 3); C.cam.position.set(C.lerp(-6, 0, k), C.lerp(5, 0.9, k), C.lerp(9, 6.8, k)); C.cam.lookAt(0, C.lerp(1, 2, k), 0);
          [tit, tit2].forEach((G, gi) => G.userData.letras.forEach((L, i) => { const D = L.userData.dest, kk = C.rebote((t - 65.4 - (gi * 6 + i) * 0.03) / 0.6); L.position.set(D.x, D.y + (1 - kk) * 7, D.z); })); C.render(E.scene); }
        if (t >= 68) promoShowTime2D(C.g2, C.c2.width, C.c2.height, (t - 68) / 7, C.cfg);
      };
    } },
};
// ---------- «Elige el valor de cada huella»: 20 valores (10 de la huella blanca y 10 de la negra) ----------
const HUELLA_DEF = ETAPAS_DATOS['2021'].cifras.slice(); // las 20 cifras están en src/etapas_datos.js
function huellaValores() { try { const v = JSON.parse(localStorage.getItem('ac_huellas') || 'null'); if (Array.isArray(v) && v.length === 20 && [...v].sort().join() === [...HUELLA_DEF].sort().join()) return v; } catch (e) {} return HUELLA_DEF.slice(); }
const huellaTxt = v => v === 'vida' ? 'COMODÍN' : v === 'mitad' ? '÷2' : v === 'doble' ? 'x2' : v === 'cero' ? 'PIERDE TODO' : String(+String(v).replace('+', '')).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
function huellaMapa(def, lado) { // en el especial «Elige tu huella» (o si se activa para todos) la moneda usa la pirámide del jugador
  const usar = (Xe && Xe.theme && Xe.theme.id === 'eligehuella') || localStorage.getItem('ac_huellas_siempre') === '1';
  const v = usar ? huellaValores() : HUELLA_DEF, m = { ...def }; for (let i = 1; i <= 10; i++) m[i] = v[lado * 10 + i - 1]; return m;
}
function huellaPantallaValores(g, w, h, cual) {
  const gr = g.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, '#0a3ac8'); gr.addColorStop(1, '#06124a'); g.fillStyle = gr; g.fillRect(0, 0, w, h);
  const u = h / 100; g.font = `900 ${u * 8}px ${CAB_FUENTE}`; g.fillStyle = '#fff'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(cual === 'altos' ? 'VALORES ALTOS' : 'VALORES BAJOS', w / 2, u * 16);
  const filas = cual === 'altos' ? [['1 de', '50.000', '#ffd21a'], ['2 de', '25.000', '#ffd21a'], ['3 de', '15.000', '#ffd21a'], ['1 de', '5.000', '#ffd21a']] : [['3 de', '5.000', '#3ac85a'], ['5 de', '1.000', '#3ac85a'], ['1', 'COMODÍN', '#3ad0ff'], ['1', '÷2', '#ff7a1a'], ['1', 'LO PIERDES TODO', '#e8102a'], ['1', 'x2', '#d04aff'], ['1 de', '1', '#3ac85a']];
  filas.forEach(([a, b, c], i) => { const col = i % 2, fil = Math.floor(i / 2), x = w * (col ? 0.55 : 0.12), y = u * (34 + fil * 15); g.font = `900 ${u * 6}px ${CAB_FUENTE}`; g.textAlign = 'left'; g.fillStyle = '#fff'; g.fillText(a, x, y); const bx = x + u * 13, bw = u * 30; g.fillStyle = c; g.beginPath(); g.roundRect ? g.roundRect(bx, y - u * 4.5, bw, u * 9, u * 4.5) : g.rect(bx, y - u * 4.5, bw, u * 9); g.fill(); g.fillStyle = '#1a1000'; g.textAlign = 'center'; g.font = `900 ${u * (b.length > 8 ? 3.6 : 5.4)}px ${CAB_FUENTE}`; g.fillText(b, bx + bw / 2, y + 2, bw - u * 2); });
}
// ---------- Casting: los que se apuntan aparecen como oponentes en las partidas ----------
const CASTING = []; const CASTING_ORDEN = [3, 7, 1, 9, 5, 2, 8, 4, 10, 6];
const castingDB = () => new Promise((res, rej) => { const r = indexedDB.open('ac3d_casting', 1); r.onupgradeneeded = () => r.result.createObjectStore('p', { keyPath: 'id', autoIncrement: true }); r.onsuccess = () => res(r.result); r.onerror = () => rej(r.error); });
async function castingCarga() { try { const d = await castingDB(); const l = await new Promise(r => { const q = d.transaction('p').objectStore('p').getAll(); q.onsuccess = () => r(q.result || []); q.onerror = () => r([]); }); CASTING.length = 0; CASTING.push(...l.sort((a, b) => a.fecha - b.fecha)); } catch (e) {} }
async function castingGuarda(p) { const d = await castingDB(); await new Promise((r, j) => { const t = d.transaction('p', 'readwrite'); t.objectStore('p').put(p); t.oncomplete = r; t.onerror = () => j(t.error); }); await castingCarga(); }
async function castingBorra(id) { const d = await castingDB(); await new Promise(r => { const t = d.transaction('p', 'readwrite'); t.objectStore('p').delete(id); t.oncomplete = r; t.onerror = r; }); await castingCarga(); }
const castingOn = () => localStorage.getItem('ac_casting_on') !== '0';
function castingDe(a) { if (!castingOn() || !CASTING.length) return null; const i = CASTING_ORDEN.indexOf(a); return i >= 0 && i < CASTING.length ? CASTING[CASTING.length - 1 - i] : null; }
const castingNombre = a => { const p = castingDe(a); return p ? p.nombre : null; };
const castingJob = a => { const p = castingDe(a); return p ? (p.profesion || '') + (p.ciudad ? ' (' + p.ciudad + ')' : '') : null; };
const castingAspecto = a => { const p = castingDe(a); return p ? { color: parseInt((p.piel || '#e8eef8').slice(1), 16), shirt: parseInt((p.color || '#ff7a1a').slice(1), 16) } : {}; };
castingCarga();
// ---------- especial «Elige tu huella» y Gran estreno ----------
if (!Do.find(d => d.id === 'eligehuella')) Do.push({ id: 'eligehuella', name: 'Especial Elige tu huella', emoji: '👣', plato: 'virtual', wallA: '#0b2fa8', wallB: '#1b52e6', chevA: '#ffd23a', chevB: '#3ac85a', glow: 0xffd23a, accent: 0x3ac85a, fog: 0x030817, bg: 0x02040c, host: { suit: 0x1b2a5c, shirt: 0xffffff, tie: 0xffd23a }, hashtag: '#EligeTuHuella', decor: 'none', banner: 'ESPECIAL ELIGE TU HUELLA', festivo: true, saludo: '¡Muy buenas noches! Hoy es un especial muy especial: los valores de cada huella los habéis elegido vosotros.', extra: ['Cada vez que se gane un duelo, la moneda tendrá vuestros valores. ¡Será tu decisión!'], despedida: '¡Hasta aquí el especial Elige tu huella! Gracias por elegir los valores. ¡Hasta la próxima!' });
Object.assign(Eo, { eligehuella: { ...Eo.normal } });
const estrenoPendiente = () => !localStorage.getItem('ac_estreno_visto') && !window.__noEstreno;
async function promoEstreno(hud, sess) { localStorage.setItem('ac_estreno_visto', '1'); return promoCorre(PROMOS.estreno, hud, sess); }
window.__promo3D = id => promoCorre(PROMOS[id]);
// ---------- secciones del menú: Promos, Casting y Elige el valor de cada huella ----------
function menuExtra(a, r) {
  const caja = (html, css = '') => { const d = document.createElement('div'); d.style.cssText = 'background:#0a1a5acc;border:2px solid #3a6aff;border-radius:16px;padding:12px 14px;margin:6px 0;color:#fff;font:15px system-ui;' + css; if (html) d.innerHTML = html; return d; };
  const boton = (txt, fn, sel) => { const b = document.createElement('button'); b.className = 'tbtn' + (sel ? ' sel' : ''); b.innerHTML = txt; b.onclick = ev => { ev.stopPropagation(); try { F.play('Tecla'); } catch (e) {} fn(b); }; return b; };
  if (a === 'promos') {
    r.appendChild(Pa('Promos'));
    r.appendChild(caja('Promos de ¡Ahora caigo! en 3D, en tiempo real, con nuestro presentador virtual <b>Marco Vitale</b> (personajes virtuales, sin personas reales).'));
    const lista = [['cabecera', '🎬', 'Cabecera del programa', '26 s · la cabecera de cada programa'], ['cab3dv', '🌀', 'Cabecera 3D', '7 s · túnel de neón, trampilla y logo'], ['apertura', '🎬', 'Apertura del programa', '33 s · plató, público, Marco, concursantes y pregunta de selección'], ['donarturo', '🎩', 'Sketch: El regreso de Don Ernesto', '2-3 min · un presentador legendario vuelve al plató'], ['videocab', '🎥', 'Cabecera 3D con tu vídeo', VCAB.nombre ? 'tu vídeo: ' + VCAB.nombre : 'elige el vídeo en Opciones › ELEGIR VÍDEO PARA LA CABECERA 3D']].concat(['estreno', 'proximamente', 'casting', 'anuncio', 'estanoche', 'huella'].map(k => [k, PROMOS[k].emoji, PROMOS[k].nombre, Math.round(PROMOS[k].dur) + ' s · ' + PROMOS[k].sub]));
    for (const [k, em, n, s] of lista) r.appendChild(ei(em + ' ' + n, s, k === 'estreno' ? 'gold' : '', () => k === 'cabecera' ? cab3D(null, null, xf(Ms)) : k === 'cab3dv' ? promoCab3Dv(xf(Ms)) : k === 'apertura' ? promoApertura({ tema: xf(Ms) }) : k === 'donarturo' ? promoArturo() : k === 'videocab' ? cabVideo(null, null, xf(Ms)).then(ok => ok || Lt('options')) : promoCorre(PROMOS[k])));
    const fila = document.createElement('div'); fila.className = 'orow orow-wrap'; const lb = document.createElement('label'); lb.textContent = '🔊 Audio de las promos'; fila.appendChild(lb);
    const hay = ['estreno', 'promo_proximamente', 'promo_anuncio', 'promo_estanoche', 'promo_huella'].some(n => RC.audioExtra && RC.audioExtra(n));
    for (const [v, t] of [['recreado', 'Recreado (voz de Marco Vitale)'], ['original', 'Original del vídeo' + (hay ? '' : ' (cárgalo en Opciones)')]]) fila.appendChild(boton(t, b => { localStorage.setItem('ac_promo_audio', v); fila.querySelectorAll('button').forEach(x => x.classList.toggle('sel', x === b)); }, PROMO_AUDIO() === v));
    r.appendChild(fila);
    const f2 = document.createElement('div'); f2.className = 'mrow'; f2.append(boton(estrenoPendiente() ? '🎬 El Gran estreno sale en el próximo programa' : '🔁 Ver el Gran estreno en el próximo programa', b => { localStorage.removeItem('ac_estreno_visto'); b.innerHTML = '🎬 El Gran estreno sale en el próximo programa'; })); r.appendChild(f2);
    promosV115(r);
    r.appendChild(Ia('main')); return;
  }
  if (a === 'casting') {
    r.appendChild(Pa('Casting'));
    r.appendChild(caja('¡Apúntate al casting de <b>¡Ahora caigo!</b>! Rellena tu ficha y aparecerás como oponente en las partidas, con tu nombre, tu profesión y tu avatar. Se guarda solo en este dispositivo.'));
    const f = caja(''); const campo = (id, et, tipo = 'text', ph = '', max = 24) => { const l = document.createElement('label'); l.style.cssText = 'display:block;margin:6px 0 2px;font-weight:700'; l.textContent = et; const i = document.createElement('input'); i.type = tipo; i.id = id; i.placeholder = ph; i.maxLength = max; i.style.cssText = 'width:100%;box-sizing:border-box;padding:8px 10px;border-radius:10px;border:2px solid #3a6aff;background:#fff;color:#111;font:16px system-ui'; i.addEventListener('keydown', e => e.stopPropagation()); f.append(l, i); return i; };
    const iN = campo('cNombre', 'Nombre', 'text', 'Tu nombre', 18), iE = campo('cEdad', 'Edad', 'number', '25', 3), iC = campo('cCiudad', 'Ciudad', 'text', 'Tu ciudad', 24), iP = campo('cProf', 'Profesión', 'text', 'A qué te dedicas', 40), iF = campo('cFrase', 'Tu frase', 'text', '¡Yo no me caigo!', 80);
    const colores = ['#ff7a1a', '#e8102a', '#2a8aff', '#3ac85a', '#ffd21a', '#d04aff', '#ff5fb0', '#1a1a1a', '#ffffff'], pieles = ['#e8eef8', '#f6d2b8', '#e0a880', '#a8704a', '#6a4028'];
    let col = colores[0], piel = pieles[0]; const paleta = (et, l, set, get) => { const d = document.createElement('div'); d.style.cssText = 'margin:8px 0 2px'; d.innerHTML = `<b>${et}</b><br>`; l.forEach(c => { const b = document.createElement('button'); b.style.cssText = `width:34px;height:34px;margin:4px;border-radius:50%;border:3px solid ${c === get() ? '#ffd21a' : '#0008'};background:${c};cursor:pointer`; b.onclick = ev => { ev.preventDefault(); ev.stopPropagation(); set(c); d.querySelectorAll('button').forEach(x => x.style.borderColor = '#0008'); b.style.borderColor = '#ffd21a'; }; d.appendChild(b); }); f.appendChild(d); };
    paleta('Color de la ropa del avatar', colores, c => col = c, () => col); paleta('Aspecto (tono del avatar)', pieles, c => piel = c, () => piel);
    const msg = document.createElement('p'); msg.className = 'onote';
    const ok = boton('✅ Apuntarme al casting', async () => { const nombre = iN.value.trim(); if (!nombre) { msg.textContent = 'Escribe al menos tu nombre.'; return; } await castingGuarda({ nombre: nombre.slice(0, 18), edad: Math.max(0, Math.min(120, +iE.value || 0)), ciudad: iC.value.trim(), profesion: iP.value.trim(), frase: iF.value.trim(), color: col, piel, fecha: Date.now() }); try { Xe.setTheme(xf(Ms)); Xe.resetPositions(); } catch (e) {} Lt('casting'); });
    f.append(document.createElement('br'), ok, msg); r.appendChild(f);
    const lis = caja('<b>Apuntados (' + CASTING.length + ')</b>' + (CASTING.length > 10 ? ' · juegan los 10 últimos' : ''));
    CASTING.slice().reverse().forEach(p => { const d = document.createElement('div'); d.style.cssText = 'display:flex;align-items:center;gap:8px;margin:6px 0;flex-wrap:wrap'; d.innerHTML = `<span style="width:22px;height:22px;border-radius:50%;background:${p.color};border:4px solid ${p.piel}"></span><span><b>${p.nombre.replace(/</g, '&lt;')}</b>${p.edad ? ', ' + p.edad : ''}${p.ciudad ? ' · ' + p.ciudad.replace(/</g, '&lt;') : ''}${p.profesion ? ' · ' + p.profesion.replace(/</g, '&lt;') : ''}${p.frase ? '<br><i>«' + p.frase.replace(/</g, '&lt;') + '»</i>' : ''}</span>`; d.append(boton('🎮 Jugar como central', () => { me.set('central', p.nombre); p.profesion && me.set('profesion', p.profesion); msg.textContent = '¡' + p.nombre + ' será el concursante central!'; }), boton('🗑️', async () => { await castingBorra(p.id); try { Xe.setTheme(xf(Ms)); } catch (e) {} Lt('casting'); })); lis.appendChild(d); });
    r.appendChild(lis);
    const fila = document.createElement('div'); fila.className = 'mrow'; fila.append(boton(castingOn() ? '✅ El casting juega en las partidas' : '⬜ El casting no juega en las partidas', b => { localStorage.setItem('ac_casting_on', castingOn() ? '0' : '1'); b.innerHTML = castingOn() ? '✅ El casting juega en las partidas' : '⬜ El casting no juega en las partidas'; try { Xe.setTheme(xf(Ms)); } catch (e) {} }), Ia('main')); r.appendChild(fila); return;
  }
  if (a === 'huellas') {
    r.appendChild(Pa('Elige el valor de cada huella'));
    r.appendChild(caja('Coloca los 20 valores en la pirámide de huellas. Toca dos huellas para <b>intercambiar</b> sus valores. Las 10 amarillas son la huella <b>blanca</b> de la moneda y las 10 verdes, la <b>negra</b>. Se usan en el <b>Especial Elige tu huella</b> (Jugar › Programa especial).'));
    let v = huellaValores(), sel = -1; const pir = caja('', 'text-align:center');
    const pinta = () => { pir.innerHTML = ''; let n = 0; [6, 5, 4, 3, 2].forEach(c => { const f = document.createElement('div'); for (let i = 0; i < c; i++, n++) { const k = n, b = document.createElement('button'); b.textContent = huellaTxt(v[k]); b.style.cssText = `min-width:52px;margin:2px;padding:6px 5px;border-radius:16px;border:2px solid ${sel === k ? '#ffffff' : '#1a1000'};background:${k < 10 ? '#ffd21a' : '#3ac85a'};color:#1a1000;font:900 11px system-ui;white-space:nowrap;cursor:pointer;transform:${sel === k ? 'scale(1.1)' : 'none'}`; b.onclick = ev => { ev.stopPropagation(); try { F.play('Tecla'); } catch (e) {} if (sel < 0) sel = k; else { [v[sel], v[k]] = [v[k], v[sel]]; sel = -1; localStorage.setItem('ac_huellas', JSON.stringify(v)); } pinta(); }; f.appendChild(b); } pir.appendChild(f); }); };
    pinta(); r.appendChild(pir);
    const fila = document.createElement('div'); fila.className = 'mrow'; fila.append(boton('🔀 Al azar', () => { for (let i = v.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [v[i], v[j]] = [v[j], v[i]]; } localStorage.setItem('ac_huellas', JSON.stringify(v)); pinta(); }), boton('↩️ Como en el programa', () => { v = HUELLA_DEF.slice(); localStorage.removeItem('ac_huellas'); pinta(); }), boton('▶️ Jugar el especial', () => { Ms = 'eligehuella'; localStorage.setItem('ac_theme', Ms); try { Xe.setTheme(xf(Ms)); Xe.resetPositions(); } catch (e) {} ii('programa'); }));
    r.appendChild(fila);
    const f2 = document.createElement('div'); f2.className = 'mrow'; f2.append(boton(localStorage.getItem('ac_huellas_siempre') === '1' ? '✅ Usar mis valores en todos los programas' : '⬜ Usar mis valores en todos los programas', b => { const on = localStorage.getItem('ac_huellas_siempre') !== '1'; localStorage.setItem('ac_huellas_siempre', on ? '1' : '0'); b.innerHTML = (on ? '✅' : '⬜') + ' Usar mis valores en todos los programas'; }), Ia('main')); r.appendChild(f2); return;
  }
}
// rutas directas: …/#casting y …/#huellas (el QR de la promo del casting apunta aquí)
(function rutas() { const ir = () => { const h = (location.hash || '').slice(1); if (!['casting', 'huellas', 'promos'].includes(h)) return; const ld = document.getElementById('loading'); if (!window.__eng || !ld || !ld.classList.contains('hidden') || !document.getElementById('menu')) return setTimeout(ir, 700); setTimeout(() => { try { Lt(h); } catch (e) {} }, 600); }; setTimeout(ir, 1200); addEventListener('hashchange', ir); })();
window.__ac = { V2, CASTING, castingNombre, castingJob, menu: x => Lt(x), huellaValores };
