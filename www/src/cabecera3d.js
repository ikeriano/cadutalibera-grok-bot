
// ===================================================================================================
// Cabecera 3D del Programa TV (copia plano a plano del vídeo de cabecera, 26,7 s):
//  0-1 s anillo plateado + trampilla con huellas · 1-4 s vuelo entre letras de metal · 4-6,2 s plató,
//  el rótulo ¡AHORA CAIGO! cae con rebote (golpe a 4,95 s) · 6,2-22 s plano secuencia por el plató ·
//  22-26,7 s cortinilla «SHOW TIME». Cambia de colores, rótulo y objetos flotantes según el especial.
// Música: cabecera/cabecera3d.mp3 (zip completo o «Cargar músicas»); si no está, se sintetiza.
// ===================================================================================================
const CAB_DUR = 26.7;
const CAB_TEMAS = {
  normal: {}, primetime: { obj: ['estrella', 'moneda'], tunel: ['#05103a', '#c8a030', '#fff2c0'] },
  halloween: { obj: ['calabaza', 'murcielago'], wall: '#3a0c60', wall2: '#6a1aa0', chev: '#ff8a1a', ring: 0xff7a1a, tunel: ['#1a0630', '#ff7a1a', '#ffe0a0'], f2d: ['#3a0c60', '#7a2ab0', '#ff9a2a'], ex: 'ESPECIAL HALLOWEEN' },
  navidad: { obj: ['regalo', 'copo', 'estrella'], wall: '#8a0c12', wall2: '#c81a22', chev: '#ffffff', ring: 0x3aff6a, tunel: ['#3a0408', '#ff3a3a', '#fff0f0'], f2d: ['#a00c16', '#e83a3a', '#2fbf4a'], ex: 'ESPECIAL NAVIDAD' },
  nochebuena: { obj: ['estrella', 'copo'], wall: '#08154a', wall2: '#13307e', chev: '#ffe08a', ring: 0xffd27a, tunel: ['#020830', '#ffd27a', '#fffbe8'], ex: 'NOCHEBUENA' },
  mayores: { obj: ['regalo', 'corazon', 'copo'], wall: '#5a2200', wall2: '#e0820c', chev: '#fff0a8', ring: 0xffd23a, tunel: ['#2a1000', '#ffb21a', '#fff6d8'], f2d: ['#8a3a00', '#e0820c', '#ffd23a'], ex: 'NAVIDAD CON MAYORES' },
  carnaval: { obj: ['mascara', 'confeti'], wall: '#4b0f8a', wall2: '#8a1fd0', chev: '#3dff8a', ring: 0xff4fd8, tunel: ['#200640', '#ff4fd8', '#fff0ff'], f2d: ['#4b0f8a', '#a03ae0', '#3dff8a'], ex: 'ESPECIAL CARNAVAL' },
  findeano: { obj: ['uvas', 'estrella'], wall: '#151515', wall2: '#3a3326', chev: '#ffe28a', ring: 0xffe28a, tunel: ['#0a0a0a', '#c9a227', '#fff6d0'], f2d: ['#1a1a1a', '#6a5a2a', '#ffe28a'], ex: 'FIN DE AÑO' },
  verano: { obj: ['sol', 'pelota'], wall: '#0aa6b8', wall2: '#33d6d0', chev: '#ffb02e', ring: 0xffd23a, tunel: ['#02405a', '#33e6f0', '#fffbe0'], f2d: ['#0a8ab8', '#33d6d0', '#ffd23a'], ex: 'ESPECIAL VERANO' },
  ninos: { obj: ['globo', 'pelota', 'estrella'], wall: '#0f8fd1', wall2: '#26c2f0', chev: '#ff5fb0', ring: 0xff5fb0, tunel: ['#063a6a', '#26c2f0', '#ffffff'], f2d: ['#0f8fd1', '#5ad8ff', '#ff5fb0'], ex: 'ESPECIAL NIÑOS' },
  especial300: { obj: ['trofeo', 'moneda'], wall: '#3a0610', wall2: '#8a0f1c', chev: '#ffe08a', ring: 0xffd23a, tunel: ['#200208', '#d4a017', '#fff3c8'], f2d: ['#5a0a18', '#a01a2a', '#ffd23a'], ex: '300 SUSCRIPTORES' },
  mil: { obj: ['mil', 'confeti', 'moneda'], wall: '#3a0a6a', wall2: '#8a2ad0', chev: '#ffd23a', ring: 0xd04aff, tunel: ['#1a0430', '#d04aff', '#fff0ff'], f2d: ['#3a0a6a', '#8a2ad0', '#ff5fd8'], ex: 'PROGRAMA 1000' },
  fantasticos: { obj: ['estrella', 'trofeo'], wall: '#1a0a5a', wall2: '#5a2ad0', chev: '#3ad0ff', ring: 0x3ad0ff, tunel: ['#060430', '#3ad0ff', '#f0ffff'], f2d: ['#1a0a5a', '#5a2ad0', '#3ad0ff'], ex: 'LOS 11 FANTÁSTICOS' },
  sub400ikeriano: { obj: ['trofeo', 'moneda', 'confeti'], wall: '#06204a', wall2: '#0a5ac8', chev: '#ffd23a', ring: 0xffd23a, tunel: ['#020a2a', '#ffd23a', '#fffbe0'], f2d: ['#0a3a9a', '#2a8aff', '#ffd23a'], ex: '400 SUSCRIPTORES', ex2: 'IKERIANO EL CAMPEÓN 2' },
  sub400marchelitos: { obj: ['corona', 'moneda', 'confeti'], wall: '#0a3a2a', wall2: '#14a070', chev: '#ffe25a', ring: 0x3affb0, tunel: ['#02200f', '#3affb0', '#f0fff8'], f2d: ['#0a5a3a', '#1ac080', '#ffe25a'], ex: '400 SUSCRIPTORES', ex2: 'MARCHELITOSTHEMONA' },
  profesiones: { obj: ['casco', 'maletin', 'llave', 'gorro'], wall: '#2a2a32', wall2: '#4a5a6a', chev: '#ffc21a', ring: 0xffc21a, tunel: ['#101418', '#ffc21a', '#fff8e0'], f2d: ['#2a3440', '#5a6a7a', '#ffc21a'], ex: 'ESPECIAL PROFESIONES' },
  sanvalentin: { obj: ['corazon'], wall: '#7a0a3a', wall2: '#d02a6a', chev: '#ffd0e0', ring: 0xff4a8a, tunel: ['#3a0418', '#ff4a8a', '#fff0f6'], f2d: ['#a01a4a', '#ff5a9a', '#ffd0e0'], ex: 'SAN VALENTÍN' },
  famosos: { obj: ['estrella', 'claqueta'], wall: '#1a1a1a', wall2: '#5a4a1a', chev: '#ffd23a', ring: 0xffd23a, tunel: ['#0a0a0a', '#ffd23a', '#fffbe8'], f2d: ['#202020', '#806a20', '#ffd23a'], ex: 'ESPECIAL FAMOSOS' },
  abuelos: { obj: ['gafas', 'corazon', 'tarta'], wall: '#5a3a1a', wall2: '#b07a3a', chev: '#fff0c8', ring: 0xffb05a, tunel: ['#2a1808', '#ffb05a', '#fff8ea'], f2d: ['#7a4a1a', '#c08a4a', '#fff0c8'], ex: 'ESPECIAL ABUELOS' },
};
function cabTema(th) {
  const c = { wall: '#0b3ac8', wall2: '#1b6af0', chev: '#ffb21a', ring: 0x2ad8ff, tunel: ['#061a6a', '#2ad8ff', '#eaffff'], f2d: ['#1a6ae0', '#4aa8ff', '#bfe6ff'], obj: ['moneda'], ex: null, ex2: null };
  const t = CAB_TEMAS[th && th.id] || (th && th.id && th.id !== 'normal' ? { wall: th.wallA, wall2: th.wallB, chev: th.chevA, ex: th.banner || ('ESPECIAL ' + (th.name || '').toUpperCase()) } : {});
  const r = { ...c, ...t }; if (th && th.cabRotulo) r.ex = th.cabRotulo; if (th && th.cabRotulo2) r.ex2 = th.cabRotulo2; return r;
}
function cabTex(w, h, f) { const c = document.createElement('canvas'); c.width = w; c.height = h; const g = c.getContext('2d'); f(g, w, h); const t = new _E.CanvasTexture(c); t.colorSpace = _E.SRGBColorSpace; t.anisotropy = 4; return t; }
const CAB_FUENTE = '"Arial Black", "Arial Bold", Arial, sans-serif';
function cabIcono(g, tipo, s) { // objetos flotantes de los especiales, dibujados (sin emojis)
  const c = s / 2; g.save(); g.lineJoin = 'round'; g.lineCap = 'round';
  const circ = (x, y, r, col) => { g.fillStyle = col; g.beginPath(); g.arc(x, y, r, 0, 7); g.fill(); };
  switch (tipo) {
    case 'play': acPlay(g, c, c, s * 0.9); break;
    case 'calabaza': for (const [dx, k] of [[-0.22, 0.8], [0.22, 0.8], [0, 1]]) { g.fillStyle = k < 1 ? '#d8540a' : '#ff7a1a'; g.beginPath(); g.ellipse(c + dx * s, c + s * 0.06, s * 0.26 * k, s * 0.32, 0, 0, 7); g.fill(); } g.fillStyle = '#2a6a10'; g.fillRect(c - s * 0.04, s * 0.1, s * 0.08, s * 0.16); g.fillStyle = '#ffe23a'; for (const dx of [-0.13, 0.13]) { g.beginPath(); g.moveTo(c + dx * s - s * 0.07, c); g.lineTo(c + dx * s + s * 0.07, c); g.lineTo(c + dx * s, c - s * 0.1); g.fill(); } g.beginPath(); g.moveTo(c - s * 0.2, c + s * 0.14); g.lineTo(c + s * 0.2, c + s * 0.14); g.lineTo(c, c + s * 0.24); g.fill(); break;
    case 'murcielago': g.fillStyle = '#140818'; g.strokeStyle = '#b06aff'; g.lineWidth = s * 0.02; g.beginPath(); g.moveTo(c, c - s * 0.08); for (const sg of [1, -1]) { g.moveTo(c, c - s * 0.06); g.quadraticCurveTo(c + sg * s * 0.2, c - s * 0.3, c + sg * s * 0.46, c - s * 0.1); g.quadraticCurveTo(c + sg * s * 0.36, c, c + sg * s * 0.32, c + s * 0.12); g.quadraticCurveTo(c + sg * s * 0.24, c + s * 0.02, c + sg * s * 0.16, c + s * 0.14); g.quadraticCurveTo(c + sg * s * 0.08, c + s * 0.04, c, c + s * 0.16); } g.fill(); g.stroke(); circ(c, c - s * 0.02, s * 0.09, '#140818'); circ(c - s * 0.035, c - s * 0.04, s * 0.018, '#ff3a3a'); circ(c + s * 0.035, c - s * 0.04, s * 0.018, '#ff3a3a'); break;
    case 'regalo': g.fillStyle = '#e8102a'; g.fillRect(s * 0.18, s * 0.38, s * 0.64, s * 0.46); g.fillStyle = '#c80a20'; g.fillRect(s * 0.14, s * 0.28, s * 0.72, s * 0.14); g.fillStyle = '#ffd23a'; g.fillRect(c - s * 0.05, s * 0.28, s * 0.1, s * 0.56); for (const sg of [-1, 1]) { g.beginPath(); g.ellipse(c + sg * s * 0.1, s * 0.22, s * 0.11, s * 0.06, sg * 0.5, 0, 7); g.fill(); } break;
    case 'copo': g.strokeStyle = '#ffffff'; g.lineWidth = s * 0.05; for (let i = 0; i < 6; i++) { const a = i * Math.PI / 3; g.beginPath(); g.moveTo(c, c); g.lineTo(c + Math.cos(a) * s * 0.4, c + Math.sin(a) * s * 0.4); g.stroke(); for (const k of [0.22, 0.32]) { const x = c + Math.cos(a) * s * k, y = c + Math.sin(a) * s * k; for (const d of [0.6, -0.6]) { g.beginPath(); g.moveTo(x, y); g.lineTo(x + Math.cos(a + d) * s * 0.08, y + Math.sin(a + d) * s * 0.08); g.stroke(); } } } break;
    case 'estrella': g.fillStyle = '#ffd23a'; g.strokeStyle = '#fff6b0'; g.lineWidth = s * 0.03; g.beginPath(); for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, r = i % 2 ? s * 0.18 : s * 0.42; g.lineTo(c + Math.cos(a) * r, c + Math.sin(a) * r); } g.closePath(); g.fill(); g.stroke(); break;
    case 'corazon': g.fillStyle = '#ff2a5a'; g.beginPath(); g.moveTo(c, s * 0.82); g.bezierCurveTo(s * 0.02, s * 0.5, s * 0.16, s * 0.12, c, s * 0.32); g.bezierCurveTo(s * 0.84, s * 0.12, s * 0.98, s * 0.5, c, s * 0.82); g.fill(); g.fillStyle = 'rgba(255,255,255,.5)'; g.beginPath(); g.ellipse(s * 0.32, s * 0.36, s * 0.07, s * 0.04, -0.7, 0, 7); g.fill(); break;
    case 'mascara': g.fillStyle = '#ff4fd8'; g.beginPath(); g.ellipse(c, c, s * 0.42, s * 0.22, 0, 0, 7); g.fill(); g.fillStyle = '#ffd23a'; g.fillRect(s * 0.08, c - s * 0.03, s * 0.84, s * 0.06); g.fillStyle = '#200640'; for (const sg of [-1, 1]) { g.beginPath(); g.ellipse(c + sg * s * 0.17, c - s * 0.02, s * 0.1, s * 0.07, sg * 0.3, 0, 7); g.fill(); } break;
    case 'confeti': { const cols = ['#ff4fd8', '#3dff8a', '#ffd23a', '#3ad0ff', '#ff5a3a']; for (let i = 0; i < 14; i++) { g.fillStyle = cols[i % 5]; g.save(); g.translate(s * (0.15 + ((i * 37) % 70) / 100), s * (0.15 + ((i * 53) % 70) / 100)); g.rotate(i); g.fillRect(-s * 0.05, -s * 0.02, s * 0.1, s * 0.04); g.restore(); } break; }
    case 'uvas': for (const [x, y] of [[0.38, 0.38], [0.62, 0.38], [0.5, 0.52], [0.3, 0.52], [0.7, 0.52], [0.4, 0.66], [0.6, 0.66], [0.5, 0.8]]) { circ(s * x, s * y, s * 0.1, '#7a2ab0'); circ(s * x - s * 0.03, s * y - s * 0.03, s * 0.025, '#d8a0ff'); } g.fillStyle = '#2a8a20'; g.fillRect(c - s * 0.02, s * 0.14, s * 0.04, s * 0.16); break;
    case 'sol': g.strokeStyle = '#ffb02e'; g.lineWidth = s * 0.05; for (let i = 0; i < 12; i++) { const a = i * Math.PI / 6; g.beginPath(); g.moveTo(c + Math.cos(a) * s * 0.28, c + Math.sin(a) * s * 0.28); g.lineTo(c + Math.cos(a) * s * 0.44, c + Math.sin(a) * s * 0.44); g.stroke(); } circ(c, c, s * 0.24, '#ffd23a'); break;
    case 'pelota': circ(c, c, s * 0.4, '#ffffff'); g.fillStyle = '#ff3a3a'; g.beginPath(); g.moveTo(c, c); g.arc(c, c, s * 0.4, -0.4, 0.8); g.fill(); g.fillStyle = '#3a8aff'; g.beginPath(); g.moveTo(c, c); g.arc(c, c, s * 0.4, 1.7, 2.9); g.fill(); g.fillStyle = '#ffd23a'; g.beginPath(); g.moveTo(c, c); g.arc(c, c, s * 0.4, 3.8, 5.0); g.fill(); break;
    case 'globo': g.fillStyle = '#ff5fb0'; g.beginPath(); g.ellipse(c, s * 0.4, s * 0.26, s * 0.32, 0, 0, 7); g.fill(); g.strokeStyle = '#ffffff'; g.lineWidth = s * 0.015; g.beginPath(); g.moveTo(c, s * 0.72); g.quadraticCurveTo(c + s * 0.1, s * 0.84, c, s * 0.96); g.stroke(); circ(c - s * 0.1, s * 0.3, s * 0.05, 'rgba(255,255,255,.6)'); break;
    case 'trofeo': g.fillStyle = '#ffd23a'; g.beginPath(); g.moveTo(s * 0.26, s * 0.16); g.lineTo(s * 0.74, s * 0.16); g.quadraticCurveTo(s * 0.74, s * 0.56, c, s * 0.58); g.quadraticCurveTo(s * 0.26, s * 0.56, s * 0.26, s * 0.16); g.fill(); g.strokeStyle = '#ffd23a'; g.lineWidth = s * 0.05; for (const sg of [-1, 1]) { g.beginPath(); g.arc(c + sg * s * 0.26, s * 0.3, s * 0.1, 0, 7); g.stroke(); } g.fillRect(c - s * 0.05, s * 0.56, s * 0.1, s * 0.16); g.fillStyle = '#b07a00'; g.fillRect(s * 0.3, s * 0.72, s * 0.4, s * 0.1); break;
    case 'corona': g.fillStyle = '#ffd23a'; g.beginPath(); g.moveTo(s * 0.14, s * 0.72); g.lineTo(s * 0.14, s * 0.3); g.lineTo(s * 0.32, s * 0.5); g.lineTo(c, s * 0.22); g.lineTo(s * 0.68, s * 0.5); g.lineTo(s * 0.86, s * 0.3); g.lineTo(s * 0.86, s * 0.72); g.fill(); circ(c, s * 0.58, s * 0.06, '#e8102a'); circ(s * 0.3, s * 0.62, s * 0.04, '#3ad0ff'); circ(s * 0.7, s * 0.62, s * 0.04, '#3dff8a'); break;
    case 'mil': g.font = `900 ${s * 0.36}px ${CAB_FUENTE}`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.lineWidth = s * 0.06; g.strokeStyle = '#5a1aa0'; g.strokeText('1000', c, c); g.fillStyle = '#ffd23a'; g.fillText('1000', c, c); break;
    case 'casco': g.fillStyle = '#ffc21a'; g.beginPath(); g.arc(c, s * 0.6, s * 0.32, Math.PI, 0); g.fill(); g.fillRect(s * 0.1, s * 0.58, s * 0.8, s * 0.08); g.fillStyle = '#e0a000'; g.fillRect(c - s * 0.04, s * 0.28, s * 0.08, s * 0.3); break;
    case 'maletin': g.fillStyle = '#7a4a1a'; g.fillRect(s * 0.14, s * 0.34, s * 0.72, s * 0.46); g.strokeStyle = '#4a2a0a'; g.lineWidth = s * 0.06; g.strokeRect(s * 0.36, s * 0.2, s * 0.28, s * 0.16); g.fillStyle = '#ffd23a'; g.fillRect(c - s * 0.05, s * 0.5, s * 0.1, s * 0.07); break;
    case 'llave': g.strokeStyle = '#c8ccd8'; g.lineWidth = s * 0.1; g.beginPath(); g.moveTo(s * 0.28, s * 0.72); g.lineTo(s * 0.62, s * 0.38); g.stroke(); g.lineWidth = s * 0.08; g.beginPath(); g.arc(s * 0.68, s * 0.32, s * 0.14, 0.9, 5.4); g.stroke(); break;
    case 'gorro': circ(s * 0.34, s * 0.36, s * 0.16, '#ffffff'); circ(s * 0.66, s * 0.36, s * 0.16, '#ffffff'); circ(c, s * 0.28, s * 0.18, '#ffffff'); g.fillStyle = '#ffffff'; g.fillRect(s * 0.26, s * 0.4, s * 0.48, s * 0.3); g.fillStyle = '#d8dce8'; g.fillRect(s * 0.26, s * 0.62, s * 0.48, s * 0.1); break;
    case 'claqueta': g.fillStyle = '#1a1a1a'; g.fillRect(s * 0.16, s * 0.4, s * 0.68, s * 0.42); g.save(); g.translate(s * 0.16, s * 0.4); g.rotate(-0.25); g.fillRect(0, -s * 0.14, s * 0.7, s * 0.12); g.fillStyle = '#ffffff'; for (let i = 0; i < 4; i++) g.fillRect(s * (0.04 + i * 0.17), -s * 0.14, s * 0.08, s * 0.12); g.restore(); g.fillStyle = '#ffffff'; g.fillRect(s * 0.2, s * 0.5, s * 0.6, s * 0.02); break;
    case 'gafas': g.strokeStyle = '#3a2a1a'; g.lineWidth = s * 0.05; for (const sg of [-1, 1]) { g.fillStyle = 'rgba(180,220,255,.7)'; g.beginPath(); g.arc(c + sg * s * 0.2, c, s * 0.15, 0, 7); g.fill(); g.stroke(); } g.beginPath(); g.moveTo(c - s * 0.05, c - s * 0.02); g.quadraticCurveTo(c, c - s * 0.08, c + s * 0.05, c - s * 0.02); g.stroke(); break;
    case 'tarta': g.fillStyle = '#ffd0e0'; g.fillRect(s * 0.18, s * 0.5, s * 0.64, s * 0.3); g.fillStyle = '#ff7aa8'; g.fillRect(s * 0.18, s * 0.5, s * 0.64, s * 0.07); g.fillStyle = '#ffffff'; g.fillRect(c - s * 0.025, s * 0.3, s * 0.05, s * 0.2); circ(c, s * 0.26, s * 0.045, '#ffb02e'); break;
    default: circ(c, c, s * 0.42, '#d8dce6'); _pies(g, c, c, s * 0.42, '#ffc21a');
  }
  g.restore();
}
// letra «extruida»: capas apiladas del mismo glifo (frente con brillo metálico, cantos plateados oscureciendo)
function cabLetra(ch, size, { cara = 'metal', capas = 12, fondo = 0.22, px = 220 } = {}) {
  const T = _E, G = new T.Group(), H = 256, fuente = `900 ${px * 0.86}px ${CAB_FUENTE}`;
  const mc = document.createElement('canvas').getContext('2d'); mc.font = fuente; const med = Math.max(20, mc.measureText(ch).width);
  const W = Math.ceil(med + 48);
  const glifo = (fill, stroke, lw = 16) => cabTex(W, H, (g, w, h) => { g.font = fuente; g.textAlign = 'center'; g.textBaseline = 'middle'; g.lineJoin = 'round'; if (stroke) { g.lineWidth = lw; g.strokeStyle = stroke(g, w, h); g.strokeText(ch, w / 2, h / 2 + 8); } g.fillStyle = fill(g, w, h); g.fillText(ch, w / 2, h / 2 + 8); });
  const met = (g, w, h) => { const gr = g.createLinearGradient(0, h * 0.15, w * 0.2, h * 0.9); gr.addColorStop(0, '#ffffff'); gr.addColorStop(0.35, '#c8ccd8'); gr.addColorStop(0.5, '#6a7080'); gr.addColorStop(0.62, '#e8ecf4'); gr.addColorStop(1, '#8a90a0'); return gr; };
  const front = cara === 'blanco' ? glifo(() => '#ffffff', met) : cara === 'rotulo' ? glifo(() => '#ffffff', () => '#000000', 22) : cara === 'amarillo' ? glifo(() => '#ffd21a', () => '#000000', 22) : glifo(met, () => '#f4f6fa');
  const side = glifo(() => '#ffffff', () => '#ffffff', cara === 'rotulo' || cara === 'amarillo' ? 22 : 16);
  const geo = new T.PlaneGeometry(size * W / H, size), oscuro = cara === 'rotulo' || cara === 'amarillo';
  for (let i = capas; i >= 1; i--) { const k = oscuro ? 0.05 + 0.12 * (1 - i / capas) : 0.38 + 0.4 * (1 - i / capas); const m = new T.Mesh(geo, new T.MeshBasicMaterial({ map: side, color: new T.Color(k * 0.9, k * 0.92, k), alphaTest: 0.45, side: T.DoubleSide })); m.position.z = -i * fondo * size / capas; G.add(m); }
  const f = new T.Mesh(geo, new T.MeshBasicMaterial({ map: front, alphaTest: 0.45, side: T.DoubleSide })); f.position.z = 0.002; G.add(f);
  G.userData.ancho = size * (med + 10) / H; return G;
}
// frase 3D centrada, letra a letra (cada letra en G.userData.letras con su posición de destino)
function cabFrase(txt, size, op = {}) {
  const T = _E, G = new T.Group(), letras = []; let x = 0;
  for (const ch of txt) { if (ch === ' ') { x += size * 0.32; continue; } const L = cabLetra(ch, size, op); x += L.userData.ancho / 2; L.position.x = x; x += L.userData.ancho / 2 + size * 0.02; letras.push(L); G.add(L); }
  letras.forEach(L => { L.position.x -= x / 2; L.userData.dest = L.position.clone(); }); G.userData.letras = letras; G.userData.ancho = x; return G;
}
function cabChevrons(cfg) {
  const t = cabTex(1024, 256, (g, w, h) => { const gr = g.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, cfg.wall2); gr.addColorStop(1, cfg.wall); g.fillStyle = gr; g.fillRect(0, 0, w, h);
    g.fillStyle = cfg.chev; for (let x = 0; x < w; x += 256) for (const dx of [0, 70]) { g.beginPath(); g.moveTo(x + dx + 20, 40); g.lineTo(x + dx + 70, 40); g.lineTo(x + dx + 130, 128); g.lineTo(x + dx + 70, 216); g.lineTo(x + dx + 20, 216); g.lineTo(x + dx + 80, 128); g.closePath(); g.fill(); }
    g.fillStyle = '#8ad8ff'; g.fillRect(0, 0, w, 14); g.fillStyle = 'rgba(255,255,255,.5)'; g.fillRect(0, 14, w, 3); g.fillStyle = '#0a1440'; g.fillRect(0, h - 18, w, 18); });
  t.wrapS = _E.RepeatWrapping; return t;
}
function cabSynth(ctx, out) { // música de respaldo (misma estructura y golpes que la del vídeo)
  const t0 = ctx.currentTime + 0.08, nodos = [];
  const env = (g, t, a, d, v) => { g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(v, t + a); g.gain.exponentialRampToValueAtTime(0.0001, t + a + d); };
  const osc = (tipo, f, t, d, v, f2) => { const o = ctx.createOscillator(), g = ctx.createGain(); o.type = tipo; o.frequency.setValueAtTime(f, t); if (f2) o.frequency.exponentialRampToValueAtTime(f2, t + d); env(g, t, 0.005, d, v); o.connect(g).connect(out); o.start(t); o.stop(t + d + 0.05); nodos.push(o); };
  const nb = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate); { const d = nb.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1; }
  const ruido = (t, d, v, f0, f1, q = 1) => { const s = ctx.createBufferSource(), bp = ctx.createBiquadFilter(), g = ctx.createGain(); s.buffer = nb; s.loop = true; bp.type = 'bandpass'; bp.Q.value = q; bp.frequency.setValueAtTime(f0, t); bp.frequency.exponentialRampToValueAtTime(f1, t + d); env(g, t, Math.min(0.3, d / 3), d, v); s.connect(bp).connect(g).connect(out); s.start(t); s.stop(t + d + 0.1); nodos.push(s); };
  ruido(t0 + 0.2, 1.0, 0.35, 200, 3000, 2); osc('sine', 55, t0 + 0.3, 0.8, 0.5, 40);
  const arp = [0, 7, 12, 16, 12, 7, 0, 7, 14, 19, 14, 7]; const bpm = 128, b = 60 / bpm;
  for (let i = 0; i < 22; i++) { const t = t0 + 1 + i * b / 2; osc('sawtooth', 220 * Math.pow(2, (arp[i % arp.length] + (i > 11 ? 2 : 0)) / 12), t, 0.12, 0.09); if (i % 2 === 0) osc('sine', 110, t, 0.2, 0.3, 60); }
  ruido(t0 + 3.6, 1.3, 0.3, 400, 6000, 1.5);
  const golpe = t => { osc('sine', 140, t, 0.9, 0.9, 32); ruido(t, 0.5, 0.6, 1800, 300, 0.8); [0, 4, 7, 12].forEach(n => osc('sawtooth', 261.6 * Math.pow(2, n / 12), t, 0.7, 0.07)); };
  golpe(t0 + 4.95); golpe(t0 + 5.92);
  const prog = [[0, 4, 7], [-3, 0, 4], [5, 9, 12], [7, 11, 14]];
  for (let i = 0, t = t0 + 6.2; t < t0 + 22; i++, t += b) {
    osc('sine', 120, t, 0.22, 0.75, 45); if (i % 2) ruido(t, 0.16, 0.35, 2500, 1500, 0.7); ruido(t + b / 2, 0.05, 0.12, 9000, 8000, 3);
    const ch = prog[Math.floor(i / 8) % 4]; osc('square', 55 * Math.pow(2, ch[0] / 12) * 2, t, b * 0.8, 0.12);
    if (i % 8 === 0 || i % 8 === 3 || i % 8 === 6) ch.forEach(n => osc('sawtooth', 261.6 * Math.pow(2, n / 12), t, b * 0.7, 0.05));
  }
  ruido(t0 + 21, 1.2, 0.4, 300, 8000, 1.2); golpe(t0 + 22.1); [0, 4, 7, 12, 16].forEach((n, k) => osc('triangle', 523 * Math.pow(2, n / 12), t0 + 22.4 + k * 0.08, 1.6, 0.08));
  osc('sine', 1046, t0 + 24.2, 1.2, 0.12);
  return { t0, stop: () => nodos.forEach(n => { try { n.stop(); } catch (e) {} }) };
}
function cabHuellas(ring, fondo = '#0c0c14', pies = '#ffc21a') { return cabTex(512, 512, (g, w) => { const gr = g.createRadialGradient(w / 2, w * 0.4, 20, w / 2, w / 2, w / 2); gr.addColorStop(0, '#3a3a48'); gr.addColorStop(0.6, fondo); gr.addColorStop(1, '#000'); g.fillStyle = gr; g.beginPath(); g.arc(w / 2, w / 2, w / 2, 0, 7); g.fill(); g.strokeStyle = '#c8ccd8'; g.lineWidth = 4; g.beginPath(); g.moveTo(w / 2, 10); g.lineTo(w / 2, w - 10); g.stroke(); _pies(g, w / 2, w / 2 - 10, w * 0.32, pies); g.shadowColor = ring; g.shadowBlur = 30; g.strokeStyle = ring; g.lineWidth = 16; g.beginPath(); g.arc(w / 2, w / 2, w / 2 - 14, 0, 7); g.stroke(); }); }
function cabEstudio(cfg, theme, op = {}) { // plató vacío del vídeo (suelo gris, tarima, 10 podios, muro de galones, pantallas, objetos y focos)
  const T = _E, huellas = cabHuellas;
  const s4 = new T.Scene(); s4.background = new T.Color(0x04060e); s4.fog = new T.Fog(0x04060e, 22, 48); s4.add(new T.HemisphereLight(0xe0e8ff, 0x101020, 1.4)); { const l = new T.DirectionalLight(0xffffff, 1.0); l.position.set(-3, 9, 6); s4.add(l); }
  const piso = new T.Mesh(new T.CircleGeometry(16, 96), new T.MeshPhongMaterial({ color: 0xffffff, specular: 0x555566, shininess: 80, map: cabTex(1024, 1024, (g, w) => { const gr = g.createRadialGradient(w / 2, w / 2, 0, w / 2, w / 2, w / 2); gr.addColorStop(0, '#9aa0ae'); gr.addColorStop(0.5, '#4a4e5a'); gr.addColorStop(1, '#14161e'); g.fillStyle = gr; g.fillRect(0, 0, w, w); g.strokeStyle = 'rgba(160,220,255,.5)'; g.lineWidth = 3; for (let i = 0; i < 48; i++) { const a = i / 48 * Math.PI * 2; g.beginPath(); g.moveTo(w / 2 + Math.cos(a) * w * 0.3, w / 2 + Math.sin(a) * w * 0.3); g.lineTo(w / 2 + Math.cos(a) * w * 0.5, w / 2 + Math.sin(a) * w * 0.5); g.stroke(); } }) })); piso.rotation.x = -Math.PI / 2; s4.add(piso);
  const tar = new T.Mesh(new T.CylinderGeometry(4, 4.1, 0.45, 96), new T.MeshPhongMaterial({ color: 0xc8ccd8, specular: 0xffffff, shininess: 120 })); tar.position.y = 0.22; s4.add(tar);
  const tc = new T.Mesh(new T.CircleGeometry(1.1, 48), new T.MeshBasicMaterial({ map: huellas('#ff2020', '#101018', '#ffc21a') })); tc.rotation.x = -Math.PI / 2; tc.position.y = 0.455; s4.add(tc);
  const tcr = new T.Mesh(new T.RingGeometry(1.1, 1.3, 64), new T.MeshBasicMaterial({ color: 0xe8101a })); tcr.rotation.x = -Math.PI / 2; tcr.position.y = 0.456; s4.add(tcr);
  for (let i = 0; i < 10; i++) { const a = Math.PI / 2 + (i - 4.5) * 0.38 * (i < 5 ? 1 : 1) + (i < 5 ? -0.25 : 0.25) + Math.PI, R = 7; const x = Math.sin(a) * R, z = Math.cos(a) * R; const p = new T.Mesh(new T.CylinderGeometry(0.85, 0.9, 0.3, 40), new T.MeshPhongMaterial({ color: 0x20222a, specular: 0x888899, shininess: 90 })); p.position.set(x, 0.15, z); s4.add(p); const r = new T.Mesh(new T.RingGeometry(0.6, 0.85, 40), new T.MeshBasicMaterial({ color: 0xe8101a })); r.rotation.x = -Math.PI / 2; r.position.set(x, 0.305, z); s4.add(r); const d = new T.Mesh(new T.CircleGeometry(0.6, 32), new T.MeshBasicMaterial({ map: tc.material.map })); d.rotation.x = -Math.PI / 2; d.position.set(x, 0.306, z); s4.add(d); }
  const chev4 = cabChevrons(cfg); chev4.repeat.set(-14, 1);
  const muro4 = new T.Mesh(new T.CylinderGeometry(11, 11, 1.4, 128, 1, true, Math.PI * 0.3, Math.PI * 1.4), new T.MeshBasicMaterial({ map: chev4, side: T.DoubleSide })); muro4.position.y = 0.7; s4.add(muro4);
  const logoTx = cabTex(1024, 640, (g, w, h) => { const gr = g.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, cfg.wall2); gr.addColorStop(1, cfg.wall); g.fillStyle = gr; g.fillRect(0, 0, w, h); g.strokeStyle = 'rgba(255,255,255,.12)'; g.lineWidth = 10; for (let i = 0; i < 8; i++) { g.beginPath(); g.ellipse(w / 2, h * 0.8, 200 + i * 80, 50 + i * 20, 0, 0, 7); g.stroke(); } g.save(); g.translate(w * 0.15, 0); pv(g, w * 0.7, h, { variant: theme && theme.id }); g.restore(); });
  const textoTx = t => cabTex(1024, 400, (g, w, h) => { const gr = g.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, cfg.wall2); gr.addColorStop(1, cfg.wall); g.fillStyle = gr; g.fillRect(0, 0, w, h); g.font = `900 ${t.length > 10 ? 120 : 190}px ${CAB_FUENTE}`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.lineJoin = 'round'; g.lineWidth = 14; g.strokeStyle = '#7a8090'; g.strokeText(t, w / 2, h / 2 + 10, w - 40); g.fillStyle = '#ffffff'; g.fillText(t, w / 2, h / 2 + 10, w - 40); });
  const pantallas = [[0, 7.5, 4.2, logoTx], [-0.42, 4.6, 2.6, textoTx(tituloL1())], [0.42, 4.6, 2.6, textoTx(tituloL2())], [-0.78, 3.6, 2.4, logoTx], [0.78, 3.6, 2.4, logoTx], [-1.12, 4.6, 2.6, textoTx(cfg.ex ? cfg.ex.split(' ')[0] : '¡AHORA')], [1.12, 4.6, 2.6, textoTx(cfg.ex ? cfg.ex.split(' ').slice(1).join(' ') || 'CAIGO!' : 'CAIGO!')]];
  pantallas.forEach(([a, w, h, tx]) => { const R = 12.2, A = Math.PI + a; const g = new T.Group(); const m = new T.Mesh(new T.PlaneGeometry(w, h), new T.MeshBasicMaterial({ map: tx })); g.add(m); const fr = new T.Mesh(new T.BoxGeometry(w + 0.3, h + 0.3, 0.25), new T.MeshPhongMaterial({ color: 0x2a3a6a, specular: 0x8899cc, shininess: 60 })); fr.position.z = -0.15; g.add(fr); for (const sx of [-1, 1]) { const col = new T.Mesh(new T.BoxGeometry(0.35, 7, 0.4), new T.MeshPhongMaterial({ color: 0x1a2a5a, emissive: 0x0a1030 })); col.position.set(sx * (w / 2 + 0.3), -0.5, -0.1); g.add(col); const led = new T.Mesh(new T.BoxGeometry(0.06, 6.4, 0.05), new T.MeshBasicMaterial({ color: 0x8ad8ff })); led.position.set(sx * (w / 2 + 0.3), -0.5, 0.12); g.add(led); } g.position.set(Math.sin(A) * R, 3.8, Math.cos(A) * R); g.lookAt(0, 3.6, 0); s4.add(g); });
  // objetos flotantes (monedas plateadas con huellas o los del especial)
  const monedaTx = cabTex(256, 256, (g, w) => { const gr = g.createRadialGradient(w * 0.4, w * 0.35, 10, w / 2, w / 2, w / 2); gr.addColorStop(0, '#ffffff'); gr.addColorStop(0.6, '#b8bcc8'); gr.addColorStop(1, '#6a6e7a'); g.fillStyle = gr; g.beginPath(); g.arc(w / 2, w / 2, w / 2, 0, 7); g.fill(); g.lineWidth = 8; g.strokeStyle = '#8a8e9a'; g.beginPath(); g.arc(w / 2, w / 2, w / 2 - 14, 0, 7); g.stroke(); _pies(g, w / 2, w / 2, w * 0.36, '#3a3e4a'); });
  const iconos = {}; (op.sinObjetos ? [] : cfg.obj).forEach(o => { if (o !== 'moneda') iconos[o] = cabTex(256, 256, (g, w) => cabIcono(g, o, w)); });
  const flot = [];
  for (let i = 0; i < (op.sinObjetos ? 0 : 18); i++) { const tipo = cfg.obj[i % cfg.obj.length], a = i * 2.39, r = 3.5 + (i * 37 % 60) / 10; let m;
    if (tipo === 'moneda') { m = new T.Mesh(new T.CylinderGeometry(0.55, 0.55, 0.08, 40), [new T.MeshPhongMaterial({ color: 0xa8acb8, specular: 0xffffff, shininess: 120 }), new T.MeshBasicMaterial({ map: monedaTx }), new T.MeshBasicMaterial({ map: monedaTx })]); m.rotation.x = Math.PI / 2; const gg = new T.Group(); gg.add(m); m = gg; }
    else { m = new T.Sprite(new T.SpriteMaterial({ map: iconos[tipo], transparent: true, depthWrite: false })); m.scale.set(1.3, 1.3, 1); }
    m.position.set(Math.sin(a) * r, 1.6 + (i % 4) * 0.9, Math.cos(a) * r); m.userData = { y: m.position.y, f: 0.6 + (i % 5) * 0.15, ph: i, sprite: tipo !== 'moneda' }; s4.add(m); flot.push(m); }
  // focos que barren (conos de luz blancos y azules)
  const conoGeo = new T.ConeGeometry(1.6, 12, 24, 1, true); conoGeo.translate(0, -6, 0);
  const conos = []; for (let i = 0; i < 8; i++) { const m = new T.Mesh(conoGeo, new T.MeshBasicMaterial({ color: i % 2 ? 0x6aa8ff : 0xffffff, transparent: true, opacity: 0.12, blending: T.AdditiveBlending, depthWrite: false, side: T.DoubleSide })); const a = i / 8 * Math.PI * 2; m.position.set(Math.sin(a) * 9, 11, Math.cos(a) * 9); m.userData.ph = i; s4.add(m); conos.push(m); }
  const update = t => {
      chev4.offset.x = t * 0.3; flot.forEach(m => { const u = m.userData; m.position.y = u.y + Math.sin(t * u.f + u.ph) * 0.35; if (u.sprite) { m.material.rotation = Math.sin(t * u.f + u.ph) * 0.3; m.scale.x = 1.3 * Math.abs(Math.cos(t * u.f * 1.2 + u.ph)) + 0.15; } else m.rotation.y = t * u.f * 2 + u.ph; });
      conos.forEach(c => { c.rotation.x = Math.sin(t * 0.9 + c.userData.ph) * 0.55; c.rotation.z = Math.cos(t * 0.7 + c.userData.ph * 1.3) * 0.55; c.material.opacity = 0.09 + 0.05 * Math.sin(t * 3 + c.userData.ph); });
  };
  return { scene: s4, update, tc, tcr, chev: chev4 };
}
async function cab3D(hud, sess, theme) {
  const T = _E, cfg = cabTema(theme || {}), W0 = window;
  const div = document.createElement('div'); div.id = 'cab3d'; div.style.cssText = 'position:fixed;inset:0;z-index:60;background:#000;cursor:pointer';
  const cv = document.createElement('canvas'); cv.style.cssText = 'position:absolute;inset:0;width:100%;height:100%';
  const c2 = document.createElement('canvas'); c2.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;pointer-events:none';
  const salta = document.createElement('div'); salta.textContent = 'Toca para saltar ⏭'; salta.style.cssText = 'position:absolute;right:18px;bottom:16px;padding:6px 14px;border-radius:18px;background:#0008;color:#fff;font:600 15px system-ui;opacity:.85;pointer-events:none';
  div.append(cv, c2, salta); document.body.appendChild(div);
  let ren; try { ren = new T.WebGLRenderer({ canvas: cv, antialias: true }); } catch (e) { div.remove(); return false; }
  ren.setPixelRatio(Math.min(2, W0.devicePixelRatio || 1)); ren.outputColorSpace = T.SRGBColorSpace;
  const cam = new T.PerspectiveCamera(50, 16 / 9, 0.05, 200);
  const resize = () => { const w = innerWidth, h = innerHeight; ren.setSize(w, h, false); cam.aspect = w / h; cam.updateProjectionMatrix(); c2.width = w * Math.min(2, devicePixelRatio || 1); c2.height = h * Math.min(2, devicePixelRatio || 1); };
  resize(); addEventListener('resize', resize);
  const anim = [], st = W0.__cab3d = { estado: 'cargando', t: 0, tema: theme && theme.id };
  const ease = x => x < 0 ? 0 : x > 1 ? 1 : x * x * (3 - 2 * x), lerp = (a, b, k) => a + (b - a) * k;
  const rebote = x => { if (x <= 0) return 0; if (x >= 1) return 1; return 1 - Math.pow(2, -9 * x) * Math.cos(x * 13); };
  const huellas = cabHuellas;
  const plata = new T.MeshPhongMaterial({ color: 0xb8bcc8, specular: 0xffffff, shininess: 140, emissive: 0x202228 });
  // ---------- escena 1: anillo + trampilla con huellas sobre vórtice ----------
  const s1 = new T.Scene(); s1.add(new T.AmbientLight(0xffffff, 0.6)); { const l = new T.PointLight(0xffffff, 60, 30); l.position.set(3, 3, 5); s1.add(l); const l2 = new T.PointLight(0x4a8aff, 40, 30); l2.position.set(-4, -2, 3); s1.add(l2); }
  const vort = cabTex(1024, 1024, (g, w) => { g.fillStyle = '#01030c'; g.fillRect(0, 0, w, w); g.translate(w / 2, w / 2); for (let i = 0; i < 9; i++) { g.rotate(Math.PI * 2 / 9); const gr = g.createLinearGradient(0, 0, w / 2, 0); gr.addColorStop(0, 'rgba(10,40,140,0)'); gr.addColorStop(0.5, 'rgba(30,80,220,.45)'); gr.addColorStop(1, 'rgba(10,30,120,0)'); g.strokeStyle = gr; g.lineWidth = 40; g.beginPath(); for (let r = 0; r < w / 2; r += 8) g.lineTo(Math.cos(r / 140) * r, Math.sin(r / 140) * r); g.stroke(); } });
  const vm = new T.Mesh(new T.PlaneGeometry(40, 40), new T.MeshBasicMaterial({ map: vort })); vm.position.z = -8; s1.add(vm);
  const anillo = new T.Mesh(new T.TorusGeometry(1.55, 0.13, 24, 96), plata); s1.add(anillo);
  const anillo2 = new T.Mesh(new T.TorusGeometry(1.9, 0.03, 8, 96, 4.4), new T.MeshBasicMaterial({ color: 0x4a6aaa })); anillo2.position.z = -0.4; s1.add(anillo2);
  const disco = new T.Mesh(new T.CircleGeometry(1.45, 64), new T.MeshBasicMaterial({ map: huellas('#ff8a1a'), transparent: true, opacity: 0 })); s1.add(disco);
  // ---------- escena 2: vuelo entre letras de metal ----------
  const s2 = new T.Scene();
  const flu = cabTex(512, 512, (g, w) => { const [a, b, c] = cfg.tunel; g.fillStyle = a; g.fillRect(0, 0, w, w); for (let i = 0; i < 40; i++) { const y = (i * 97) % w, x = (i * 53) % w; const gr = g.createLinearGradient(x, y, x + 260, y + 40); gr.addColorStop(0, 'rgba(0,0,0,0)'); gr.addColorStop(0.5, i % 3 ? b : c); gr.addColorStop(1, 'rgba(0,0,0,0)'); g.globalAlpha = 0.35; g.strokeStyle = gr; g.lineWidth = 10 + (i % 5) * 8; g.beginPath(); g.moveTo(x - 60, y); g.bezierCurveTo(x + 60, y - 60, x + 140, y + 60, x + 300, y); g.stroke(); } g.globalAlpha = 1; });
  flu.wrapS = flu.wrapT = T.RepeatWrapping; flu.repeat.set(3, 8);
  const tunel = new T.Mesh(new T.CylinderGeometry(7, 7, 120, 48, 1, true), new T.MeshBasicMaterial({ map: flu, side: T.BackSide })); tunel.rotation.x = Math.PI / 2; tunel.position.z = -50; s2.add(tunel);
  const nucleo = new T.Sprite(new T.SpriteMaterial({ map: cabTex(256, 256, (g, w) => { const gr = g.createRadialGradient(w / 2, w / 2, 0, w / 2, w / 2, w / 2); gr.addColorStop(0, '#ffffff'); gr.addColorStop(0.25, cfg.tunel[2]); gr.addColorStop(0.6, cfg.tunel[1] + '88'); gr.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = gr; g.fillRect(0, 0, w, w); }), blending: T.AdditiveBlending, depthWrite: false })); nucleo.scale.set(26, 26, 1); nucleo.position.z = -100; s2.add(nucleo);
  const sueltas = []; const letras2 = '¡ACERTOUCAI!AC'.split('');
  letras2.forEach((ch, i) => { const L = cabLetra(ch, 1.6 + (i % 3) * 0.5); const a = i * 2.4; L.position.set(Math.cos(a) * (1.6 + (i % 2) * 1.2), Math.sin(a) * (1.3 + (i % 3) * 0.5), -6 - i * 5.2); L.rotation.set(Math.sin(i) * 0.6, Math.cos(i * 1.7) * 0.9, Math.sin(i * 2.3) * 0.5); L.userData.v = [(i % 2 ? 1 : -1) * 0.6, 0.4 + (i % 3) * 0.3]; s2.add(L); sueltas.push(L); });
  // ---------- escena 3: trampilla del plató y el rótulo que cae ----------
  const s3 = new T.Scene(); s3.background = new T.Color(0x0a0e1a); s3.add(new T.HemisphereLight(0xdde8ff, 0x202030, 1.6)); { const l = new T.DirectionalLight(0xffffff, 1.2); l.position.set(2, 6, 5); s3.add(l); }
  const suelo3 = new T.Mesh(new T.CircleGeometry(30, 64), new T.MeshPhongMaterial({ color: 0x8a8e9a, specular: 0x666677, shininess: 90, map: cabTex(512, 512, (g, w) => { const gr = g.createRadialGradient(w / 2, w / 2, 10, w / 2, w / 2, w / 2); gr.addColorStop(0, '#c8ccd8'); gr.addColorStop(1, '#3a3e4a'); g.fillStyle = gr; g.fillRect(0, 0, w, w); }) })); suelo3.rotation.x = -Math.PI / 2; s3.add(suelo3);
  const chev = cabChevrons(cfg); chev.repeat.set(-6, 1);
  const muro = new T.Mesh(new T.CylinderGeometry(9, 9, 2.6, 96, 1, true, Math.PI * 0.62, Math.PI * 0.76), new T.MeshBasicMaterial({ map: chev, side: T.DoubleSide })); muro.position.y = 1.3; s3.add(muro);
  const banco = new T.Mesh(new T.CylinderGeometry(8.6, 8.6, 0.25, 96, 1, true, Math.PI * 0.62, Math.PI * 0.76), new T.MeshBasicMaterial({ color: 0x8ad8ff, side: T.DoubleSide })); banco.position.y = 0.12; s3.add(banco);
  const tram = new T.Group(); s3.add(tram);
  const base3 = new T.Mesh(new T.CylinderGeometry(2.1, 2.25, 0.35, 64), new T.MeshPhongMaterial({ color: 0x14161e, specular: 0x888899, shininess: 100 })); base3.position.y = 0.175; tram.add(base3);
  const aroMat = new T.MeshBasicMaterial({ color: cfg.ring }); const aro3 = new T.Mesh(new T.TorusGeometry(1.75, 0.09, 12, 96), aroMat); aro3.rotation.x = Math.PI / 2; aro3.position.y = 0.36; tram.add(aro3);
  const tapa = new T.Mesh(new T.CircleGeometry(1.66, 64), new T.MeshBasicMaterial({ map: huellas('#ff8a1a', '#101018', '#ff9a2a') })); tapa.rotation.x = -Math.PI / 2; tapa.position.y = 0.355; tram.add(tapa);
  const titulo = []; const filas = [['¡', 'A', 'H', 'O', 'R', 'A'], ['C', 'A', 'I', 'G', 'O', '!']];
  filas.forEach((f, fi) => { const Ls = f.map(ch => cabLetra(ch, 1.55, { cara: 'blanco', capas: 12, fondo: 0.3 })); const ancho = Ls.reduce((s, L) => s + L.userData.ancho, 0); let x = -ancho / 2 + (fi ? 0.15 : -0.1); Ls.forEach((L, k) => { x += L.userData.ancho / 2; const y = fi ? 1.75 : 3.15; L.userData.dest = new T.Vector3(x, y, 0.4); L.userData.rot = [(Math.random() - 0.5) * 0.12, (Math.random() - 0.5) * 0.2, (Math.random() - 0.5) * 0.18 + (fi ? 0.03 : -0.03)]; L.userData.t = 4.5 + (fi * 6 + k) * 0.032; x += L.userData.ancho / 2; L.visible = false; s3.add(L); titulo.push(L); }); });
  let rot1 = null, rot2 = null;
  const placa = (txt, w, col) => { const tx = cabTex(1024, 160, (g, W, H) => { g.fillStyle = 'rgba(0,0,0,0)'; g.clearRect(0, 0, W, H); const gr = g.createLinearGradient(0, 0, 0, H); gr.addColorStop(0, col); gr.addColorStop(1, '#000'); g.fillStyle = gr; g.beginPath(); g.roundRect ? g.roundRect(8, 16, W - 16, H - 32, 40) : g.rect(8, 16, W - 16, H - 32); g.fill(); g.lineWidth = 6; g.strokeStyle = '#ffffff'; g.stroke(); g.font = `900 ${txt.length > 22 ? 52 : 70}px ${CAB_FUENTE}`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillStyle = '#ffffff'; g.fillText(txt, W / 2, H / 2 + 4, W - 60); }); return new T.Mesh(new T.PlaneGeometry(w, w * 160 / 1024), new T.MeshBasicMaterial({ map: tx, transparent: true, side: T.DoubleSide })); };
  if (cfg.ex) { rot1 = placa(cfg.ex, 4.6, cfg.wall2); rot1.position.set(0, 0.62, 1.2); rot1.visible = false; s3.add(rot1); }
  if (cfg.ex2) { rot2 = placa(cfg.ex2, 3.8, cfg.wall); rot2.position.set(0, 0.62, 1.25); rot2.visible = false; s3.add(rot2); }
  // ---------- escena 4: el plató entero (plano secuencia) ----------
  const est = cabEstudio(cfg, theme), s4 = est.scene;
  const camino = new T.CatmullRomCurve3([[-10, 8, 5], [-8, 5.5, -1], [-5, 4.2, -5.5], [-1.5, 4, -7.2], [2.5, 4, -7], [6, 3.6, -3], [6, 2.4, 3], [3, 2.6, 9], [0, 4.6, 14.5]].map(p => new T.Vector3(...p)), false, 'centripetal');
  const mirada = new T.CatmullRomCurve3([[0, 3.4, -12], [-2, 3.6, -12], [0, 3.8, -12.2], [-1, 3.8, -12.2], [4, 3.8, -12], [0, 2.5, -6], [-2, 1, 0], [0, 1.4, -2], [0, 1.6, -4]].map(p => new T.Vector3(...p)));
  // ---------- cortinilla 2D «SHOW TIME» ----------
  const g2 = c2.getContext('2d');
  const showTime = (k) => { const w = c2.width, h = c2.height, cx = w / 2, cy = h / 2, R = Math.hypot(w, h) / 2; g2.clearRect(0, 0, w, h); if (k <= 0) return;
    const cols = [cfg.f2d[0], cfg.f2d[1], cfg.f2d[2], cfg.f2d[1]]; const paso = h * 0.09, desp = (k * 26) % (paso * 4);
    const rmax = R * Math.min(1, k * 2.4); g2.save(); g2.beginPath(); g2.arc(cx, cy, rmax, 0, 7); g2.clip();
    for (let r = R + paso * 4, i = 0; r > 0; r -= paso, i++) { g2.fillStyle = cols[(i + Math.floor(desp / paso)) % 4]; g2.beginPath(); g2.arc(cx, cy, Math.max(0, r - (desp % paso)), 0, 7); g2.fill(); }
    g2.restore();
    const rc = h * 0.2 * rebote(Math.max(0, (k - 0.08) * 2.2)); if (rc < 2) return;
    g2.fillStyle = '#ffffff'; g2.beginPath(); g2.arc(cx, cy, rc * 1.12, 0, 7); g2.fill();
    g2.lineWidth = rc * 0.08; g2.strokeStyle = '#ff5a1a'; g2.beginPath(); g2.arc(cx, cy, rc * 1.02, 0, 7); g2.stroke();
    const gc = g2.createLinearGradient(cx - rc, cy - rc, cx + rc, cy + rc); gc.addColorStop(0, '#2a7aff'); gc.addColorStop(0.5, '#0a2aa0'); gc.addColorStop(0.51, '#06166a'); gc.addColorStop(1, '#0a1a5a'); g2.fillStyle = gc; g2.beginPath(); g2.arc(cx, cy, rc * 0.97, 0, 7); g2.fill();
    const txt = (t, x, y, px) => { g2.font = `italic 900 ${px}px ${CAB_FUENTE}`; g2.textAlign = 'center'; g2.textBaseline = 'middle'; g2.fillStyle = '#0a2a9a'; for (let d = 1; d <= px * 0.12; d++) g2.fillText(t, x + d, y + d); g2.fillStyle = '#ffffff'; g2.fillText(t, x, y); };
    g2.save(); g2.translate(cx, cy); g2.rotate(-0.12); txt('SHOW', -rc * 0.12, -rc * 0.24, rc * 0.42); txt('TIME', rc * 0.06, rc * 0.2, rc * 0.42); g2.font = `900 ${rc * 0.16}px ${CAB_FUENTE}`; g2.fillStyle = '#ffffff'; g2.fillText('tv', rc * 0.62, rc * 0.34); g2.restore();
    if (cfg.ex && k > 0.3) { const a = Math.min(1, (k - 0.3) * 4); g2.globalAlpha = a; const fy = cy + rc * 1.45; g2.font = `900 ${h * 0.055}px ${CAB_FUENTE}`; g2.textAlign = 'center'; g2.lineWidth = h * 0.012; g2.strokeStyle = '#0a1a5a'; g2.strokeText(cfg.ex, cx, fy); g2.fillStyle = '#ffffff'; g2.fillText(cfg.ex, cx, fy); if (cfg.ex2) { g2.font = `900 ${h * 0.04}px ${CAB_FUENTE}`; g2.strokeText(cfg.ex2, cx, fy + h * 0.065); g2.fillStyle = '#ffd23a'; g2.fillText(cfg.ex2, cx, fy + h * 0.065); } g2.globalAlpha = 1; }
  };
  // ---------- audio ----------
  let audio = null, synth = null, reloj0 = performance.now(); const url = RC.cab3dUrl && RC.cab3dUrl();
  const vol = To.mute ? 0 : Math.max(0, Math.min(1, To.vol));
  if (url) { audio = new Audio(url); audio.volume = vol; try { await audio.play(); } catch (e) { audio = null; } }
  if (!audio) { try { F.ctx.state === 'suspended' && await F.ctx.resume(); const gm = F.ctx.createGain(); gm.gain.value = vol * 0.55; gm.connect(F.ctx.destination); synth = cabSynth(F.ctx, gm); synth.gain = gm; } catch (e) { synth = null; } }
  const ahora = () => audio && !audio.paused && audio.currentTime > 0 ? audio.currentTime : synth ? Math.max(0, F.ctx.currentTime - synth.t0) : (performance.now() - reloj0) / 1000;
  st.estado = 'reproduciendo'; st.audio = audio ? 'mp3' : synth ? 'sintetizada' : 'sin';
  // ---------- bucle ----------
  let fin = null; const termina = new Promise(r => fin = r); let hecho = false; const acaba = e => { if (!hecho) { hecho = true; st.estado = e; fin(); } };
  div.addEventListener('pointerdown', ev => { ev.preventDefault(); ev.stopPropagation(); acaba('saltado'); }); hud && hud.skip && hud.skip(() => acaba('saltado'));
  const vigila = setInterval(() => { if (sess && sess.alive === false) acaba('abort'); }, 100);
  const tmp = new T.Vector3(), tmp2 = new T.Vector3();
  const frame = () => {
    if (hecho) return; const t = ahora(); st.t = t; if (t >= CAB_DUR) { acaba('terminado'); return; }
    let escena = null;
    if (t < 1.05) { escena = s1; const k = t / 1.05; anillo.rotation.set(0.9 - k * 0.9, Math.sin(k * 3) * 0.5 + k * 2.2, 0); anillo2.rotation.z = -k * 2; vm.rotation.z = k * 0.9; disco.material.opacity = ease((k - 0.3) / 0.3); cam.position.set(0, 0, lerp(7, 1.2, Math.pow(k, 2.4))); cam.lookAt(0, 0, -1); cam.rotation.z = 0; }
    else if (t < 4.05) { escena = s2; const k = (t - 1.05) / 3; const z = lerp(2, -88, k); cam.position.set(Math.sin(k * 7) * 1.1, Math.cos(k * 5) * 0.7, z); tmp.set(Math.sin(k * 7 + 0.6) * 0.8, Math.cos(k * 5 + 0.6) * 0.5, z - 8); cam.lookAt(tmp); cam.rotation.z += Math.sin(k * 4) * 0.25; flu.offset.y = -k * 3; flu.offset.x = k * 0.6; sueltas.forEach(L => { L.rotation.y += L.userData.v[0] * 0.02; L.rotation.x += L.userData.v[1] * 0.012; }); }
    else if (t < 6.2) { escena = s3; const k = (t - 4.05) / 2.15; chev.offset.x = t * 0.35; cam.position.set(Math.sin(k * 1.2) * 0.4, lerp(2.0, 2.4, k), lerp(8.6, 7.6, ease(k))); cam.lookAt(0, 1.8, 0); cam.rotation.z = 0;
      titulo.forEach(L => { const d = t - L.userData.t; if (d < 0) { L.visible = false; return; } L.visible = true; const kk = rebote(d / 0.55); const D = L.userData.dest; L.position.set(D.x, D.y + (1 - kk) * 7, D.z); const [rx, ry, rz] = L.userData.rot; L.rotation.set(rx, ry, rz + (1 - kk) * 0.8); });
      const golpe = t > 5.92 ? Math.max(0, 1 - (t - 5.92) / 0.3) : 0; if (golpe) { titulo.forEach(L => L.position.y += Math.sin(t * 90) * 0.05 * golpe); cam.position.y += Math.sin(t * 70) * 0.04 * golpe; }
      aroMat.color.setHex(t > 5.9 ? 0xff1a1a : cfg.ring);
      if (rot1) { rot1.visible = t > 5.15; rot1.position.y = 0.62 + (1 - rebote((t - 5.15) / 0.5)) * 5; } if (rot2) { rot2.visible = t > 5.45; rot2.position.y = 0.0 + (1 - rebote((t - 5.45) / 0.5)) * 5; rot2.position.z = 1.4; } }
    else { escena = s4; const k = Math.min(1, (t - 6.2) / 15.8); const kk = ease(k) * 0.92 + k * 0.08; camino.getPointAt(Math.min(1, kk), tmp); mirada.getPoint(Math.min(1, kk), tmp2); cam.position.copy(tmp); cam.lookAt(tmp2); cam.rotation.z += (k < 0.1 ? (0.1 - k) * 2.2 : 0) + Math.sin(k * 9) * 0.04 * (1 - k);
      est.update(t);
    }
    if (t >= 22) { showTime((t - 22) / 4.7); } else g2.clearRect(0, 0, c2.width, c2.height);
    if (t < 24.2 && escena) ren.render(escena, cam); else ren.clear();
    requestAnimationFrame(frame);
  };
  requestAnimationFrame(frame);
  const tope = setTimeout(() => acaba('tiempo'), (CAB_DUR + 6) * 1000);
  await termina; clearTimeout(tope); clearInterval(vigila); hud && hud.skip && hud.skip(null); removeEventListener('resize', resize);
  if (audio) { const a0 = audio; const v0 = a0.volume; let i = 0; const fade = setInterval(() => { a0.volume = Math.max(0, v0 * (1 - ++i / 8)); if (i >= 8) { clearInterval(fade); a0.pause(); } }, 40); }
  if (synth) { try { synth.gain.gain.setTargetAtTime(0, F.ctx.currentTime, 0.1); setTimeout(() => synth.stop(), 600); } catch (e) {} }
  div.style.transition = 'opacity .35s'; div.style.opacity = '0';
  setTimeout(() => { for (const sc of [s1, s2, s3, s4]) sc.traverse(o => { o.geometry && o.geometry.dispose(); const ms = o.material ? (Array.isArray(o.material) ? o.material : [o.material]) : []; ms.forEach(m => { m.map && m.map.dispose(); m.dispose(); }); }); try { ren.dispose(); ren.forceContextLoss(); } catch (e) {} div.remove(); }, 400);
  sess && sess.check && sess.check(); return true;
}
window.__cab3D = (id) => cab3D(null, null, Do.find(d => d.id === id) || Do[0]);
// aviso (solo la primera vez) en la versión web sin músicas: cómo cargarlas desde Opciones
(function avisoMusicas() { return; // Caduta Libera: nunca se piden archivos
  const mira = () => {
    const ld = document.getElementById('loading'); if (!window.__eng || !ld || !ld.classList.contains('hidden')) return setTimeout(mira, 800);
    try { if (RC.tieneSonidos() || localStorage.getItem('ac_aviso_musica') || window.__noAviso) return; } catch (e) { return; }
    const d = document.createElement('div'); d.id = 'avisoMusicas';
    d.style.cssText = 'position:fixed;inset:0;z-index:80;display:flex;align-items:center;justify-content:center;background:#000a;font-family:system-ui,sans-serif';
    d.innerHTML = '<div style="max-width:440px;margin:16px;padding:22px 24px;border-radius:18px;background:linear-gradient(#1b52e6,#0a1a7a);border:3px solid #ffc21a;color:#fff;text-align:center;box-shadow:0 10px 40px #000a"><div style="font-size:40px">🎶</div><h2 style="margin:6px 0 10px;font-size:21px">Músicas y sonidos del programa</h2><p style="margin:0 0 10px;line-height:1.4;font-size:15px">Esta versión web no trae las músicas, los sonidos ni el audio de la cabecera, porque tienen derechos. Mientras tanto suenan efectos y música hechos por el juego.</p><p style="margin:0 0 16px;line-height:1.4;font-size:15px">Para oírlos, ve a <b>Opciones › «Cargar músicas»</b> y elige <b>ahoracaigo_sonidos.zip</b>. Solo hay que hacerlo una vez: se guardan en este dispositivo.</p><button style="font:800 17px system-ui;padding:10px 28px;border:0;border-radius:22px;background:#ffc21a;color:#1a1000;cursor:pointer">Entendido</button></div>';
    d.querySelector('button').onclick = ev => { ev.stopPropagation(); localStorage.setItem('ac_aviso_musica', '1'); d.remove(); };
    document.body.appendChild(d);
  };
  setTimeout(mira, 1500);
})();
