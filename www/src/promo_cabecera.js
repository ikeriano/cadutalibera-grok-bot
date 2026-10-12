// ===================================================================================================
// v1.13 · CABECERA 3D (7 s) y APERTURA DEL PROGRAMA, hechas en el motor three.js del juego con sus propios
// personajes y plató, siguiendo la estructura de planos de una cabecera de referencia (sin usar ni un
// fotograma ni audio de ella). Audio de la cabecera: cabecera/cabecera_nueva.mp3 si existe; si no,
// cabecera3d.mp3; si no, música sintetizada. Se pueden ver en Promos y suenan al empezar cada Programa completo.
// ===================================================================================================
let COPRO_APERTURA = null;
const aperturaOn = () => { try { return localStorage.getItem('ac_apertura') !== '0'; } catch (e) { return true; } };
function capTxtTex(txt, op = {}) { // texto plano (para líneas pequeñas y el subtítulo rosa)
  const W = op.w || 1024, H = op.h || 160;
  return cabTex(W, H, (g, w, h) => { g.font = `900 ${op.px || 110}px ${CAB_FUENTE}`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.lineJoin = 'round';
    if (op.borde) { g.lineWidth = op.lw || 14; g.strokeStyle = op.borde; g.strokeText(txt, w / 2, h / 2 + 4, w - 20); }
    g.fillStyle = op.color || '#ffffff'; g.fillText(txt, w / 2, h / 2 + 4, w - 20); });
}
function capSubtitulos(cfg) { // subtítulo propio del juego (tema/edición) — por defecto EL JUEGO / GRAN ESTRENO
  if (cfg && cfg.ex) { const p = cfg.ex.split(' '); return [p.length > 1 ? p.slice(1).join(' ') : p[0], cfg.ex2 || (p.length > 1 ? p[0] : 'GRAN ESTRENO')]; }
  return ['EL JUEGO', 'GRAN ESTRENO'];
}
function capFigura(T, shirt, piel) { const f = Rm({ shirt, color: piel }); return f; }
function capAnda(f, t, v = 9) { const a = Math.sin(t * v); f.legL.rotation.x = a * 0.5; f.legR.rotation.x = -a * 0.5; f.armL.rotation.x = -a * 0.4; f.armR.rotation.x = a * 0.4; f.body.position.y = Math.abs(Math.cos(t * v)) * 0.03; }
function capQuieto(f) { f.legL.rotation.x = f.legR.rotation.x = 0; f.armL.rotation.x = f.armR.rotation.x = 0; f.armL.rotation.z = -0.12; f.armR.rotation.z = 0.12; f.body.position.y = 0; }
function capAplaude(f, t, ph = 0) { const a = Math.sin(t * 16 + ph); f.armL.rotation.x = f.armR.rotation.x = -1.3; f.armL.rotation.z = -0.5 - a * 0.25; f.armR.rotation.z = 0.5 + a * 0.25; f.body.position.y = Math.abs(Math.sin(t * 5 + ph)) * 0.05; }
function capBrazosArriba(f, t, ph = 0) { f.armL.rotation.z = -2.6 + Math.sin(t * 7 + ph) * 0.2; f.armR.rotation.z = 2.6 - Math.sin(t * 7 + ph) * 0.2; f.armL.rotation.x = f.armR.rotation.x = 0; f.body.position.y = Math.abs(Math.sin(t * 6 + ph)) * 0.08; }

// ---------------------------------------------- A) CABECERA 3D ----------------------------------------------
PROMOS.cab3dv = { id: 'cab3dv', nombre: 'Cabecera 3D', dur: 7.6, emoji: '🌀', sub: 'Túnel de neón, trampilla con huellas y logo sobre la tarima', soloMusica: true,
  musica: { bpm: 128, golpes: [1.84, 3.86, 7.48], fin: 7.55 },
  montar(C) {
    const T = C.T, cfg = C.cfg, [sub1, sub2] = capSubtitulos(cfg);
    // --- 1. túnel cilíndrico metálico con anillos de neón azul y rosa/morado
    const S1 = new T.Scene(); S1.background = new T.Color(0x02030a); S1.fog = new T.Fog(0x02030a, 6, 46);
    S1.add(new T.HemisphereLight(0xb8c8ff, 0x200a30, 1.3));
    const metal = cabTex(512, 512, (g, w, h) => { const gr = g.createLinearGradient(0, 0, w, 0); for (let i = 0; i <= 16; i++) gr.addColorStop(i / 16, i % 2 ? '#3a4050' : '#8a92a6'); g.fillStyle = gr; g.fillRect(0, 0, w, h); g.fillStyle = 'rgba(0,0,0,.35)'; for (let y = 0; y < h; y += 32) g.fillRect(0, y, w, 4); });
    metal.wrapS = metal.wrapT = T.RepeatWrapping; metal.repeat.set(2, 14);
    const tubo = new T.Mesh(new T.CylinderGeometry(3, 3, 120, 48, 1, true), new T.MeshPhongMaterial({ map: metal, side: T.BackSide, specular: 0xffffff, shininess: 90 })); tubo.rotation.x = Math.PI / 2; tubo.position.z = -55; S1.add(tubo);
    const anillos = []; for (let i = 0; i < 30; i++) { const m = new T.Mesh(new T.TorusGeometry(2.85, 0.07, 8, 64), new T.MeshBasicMaterial({ color: i % 2 ? 0xd04aff : 0x3ab8ff })); m.position.z = 2 - i * 3.6; S1.add(m); anillos.push(m);
      const h = new T.Mesh(new T.TorusGeometry(2.85, 0.25, 6, 48), new T.MeshBasicMaterial({ color: i % 2 ? 0xd04aff : 0x3ab8ff, transparent: true, opacity: 0.18, blending: T.AdditiveBlending, depthWrite: false })); h.position.z = m.position.z; S1.add(h); }
    const ahora = cabFrase(tituloAC()[0], 1.3, { cara: 'blanco', capas: 10, fondo: 0.35 }); ahora.position.z = -30; S1.add(ahora);
    // fragmentos angulosos en los que se rompe la palabra
    const frag = []; const fm = new T.MeshLambertMaterial({ color: 0xffffff, emissive: 0x404040 }); for (let i = 0; i < 70; i++) { const m = new T.Mesh(new T.TetrahedronGeometry(0.12 + Math.random() * 0.22), fm); m.visible = false; m.userData = { v: new T.Vector3((Math.random() - 0.5) * 9, (Math.random() - 0.5) * 6, 4 + Math.random() * 8), r: new T.Vector3(Math.random() * 9, Math.random() * 9, 0), p0: new T.Vector3((Math.random() - 0.5) * 3.6, (Math.random() - 0.5) * 1.2, 0) }; S1.add(m); frag.push(m); }
    // --- 2. plano cenital: trampilla negra con huellas amarillas que se parte y deja caer una figura al vacío
    const S2 = new T.Scene(); S2.background = new T.Color(0xdfe9ff); S2.add(new T.HemisphereLight(0xffffff, 0x8090b0, 1.6));
    const sueloTx = cabTex(1024, 1024, (g, w) => { const gr = g.createRadialGradient(w / 2, w / 2, 40, w / 2, w / 2, w / 2); gr.addColorStop(0, '#e4e6ec'); gr.addColorStop(1, '#a8acb8'); g.fillStyle = gr; g.fillRect(0, 0, w, w); g.strokeStyle = 'rgba(255,255,255,.55)'; g.lineWidth = 3; for (let r = 260; r < w; r += 60) { g.beginPath(); g.arc(w / 2, w / 2, r, 0, 7); g.stroke(); } g.strokeStyle = 'rgba(90,96,110,.4)'; for (let i = 0; i < 48; i++) { const a = i / 48 * Math.PI * 2; g.beginPath(); g.moveTo(w / 2 + Math.cos(a) * 250, w / 2 + Math.sin(a) * 250); g.lineTo(w / 2 + Math.cos(a) * w, w / 2 + Math.sin(a) * w); g.stroke(); } });
    const anilloSuelo = new T.Mesh(new T.RingGeometry(1.25, 9, 96), new T.MeshPhongMaterial({ map: sueloTx, specular: 0xffffff, shininess: 120 })); anilloSuelo.rotation.x = -Math.PI / 2; S2.add(anilloSuelo);
    const aroT = new T.Mesh(new T.RingGeometry(1.12, 1.25, 96), new T.MeshBasicMaterial({ color: 0x9aa0ae })); aroT.rotation.x = -Math.PI / 2; aroT.position.y = 0.003; S2.add(aroT);
    const tapaTx = cabTex(512, 512, (g, w) => { g.fillStyle = '#08080c'; g.beginPath(); g.arc(w / 2, w / 2, w / 2, 0, 7); g.fill(); g.lineWidth = 10; g.strokeStyle = '#ffd21a'; g.beginPath(); g.arc(w / 2, w / 2, w * 0.36, 0, 7); g.stroke(); g.shadowColor = '#ffd21a'; g.shadowBlur = 30; _pies(g, w / 2, w / 2, w * 0.3, '#ffd21a'); });
    const hojas = []; for (const sx of [-1, 1]) { const bis = new T.Group(); bis.position.set(sx * 1.12, 0.002, 0); S2.add(bis); const geo = new T.CircleGeometry(1.12, 48, sx < 0 ? Math.PI / 2 : -Math.PI / 2, Math.PI); geo.rotateX(-Math.PI / 2); geo.translate(-sx * 1.12, 0, 0); const m = new T.Mesh(geo, new T.MeshBasicMaterial({ map: tapaTx, side: T.DoubleSide })); bis.add(m); hojas.push([bis, sx]); }
    const vacioTx = cabTex(512, 512, (g, w) => { const gr = g.createRadialGradient(w / 2, w / 2, 10, w / 2, w / 2, w / 2); gr.addColorStop(0, '#ffffff'); gr.addColorStop(0.5, '#cfe4ff'); gr.addColorStop(1, '#4a8aff'); g.fillStyle = gr; g.fillRect(0, 0, w, w); });
    const vacio = new T.Mesh(new T.CylinderGeometry(1.12, 2.4, 14, 48, 1, true), new T.MeshBasicMaterial({ map: vacioTx, side: T.BackSide, fog: false })); vacio.position.y = -7; S2.add(vacio);
    const fondoV = new T.Mesh(new T.CircleGeometry(2.4, 48), new T.MeshBasicMaterial({ color: 0xffffff })); fondoV.rotation.x = -Math.PI / 2; fondoV.position.y = -13.9; S2.add(fondoV);
    const cayendo = capFigura(T, 0xff7a1a); cayendo.root.scale.setScalar(0.55); S2.add(cayendo.root);
    // --- 3. tarima escalonada con el logo, paneles azules, aros amarillos y focos
    const S3 = new T.Scene(); S3.background = new T.Color(0x030820); S3.fog = new T.Fog(0x030820, 18, 40); S3.add(new T.HemisphereLight(0xe0e8ff, 0x101030, 1.3)); { const l = new T.DirectionalLight(0xffffff, 1.2); l.position.set(2, 8, 6); S3.add(l); }
    const plata = new T.MeshPhongMaterial({ color: 0xc8ccd8, specular: 0xffffff, shininess: 140 }), amarillo = new T.MeshPhongMaterial({ color: 0xffd21a, emissive: 0x6a4a00, specular: 0xffffff, shininess: 80 });
    [[6.2, 0.35, 0, plata], [5.8, 0.3, 0.35, amarillo], [4.4, 0.32, 0.65, plata], [4.0, 0.28, 0.97, amarillo], [2.6, 0.3, 1.25, plata]].forEach(([r, h, y, m]) => { const c = new T.Mesh(new T.CylinderGeometry(r, r + 0.08, h, 96), m); c.position.y = y + h / 2; S3.add(c); });
    const tc3 = new T.Mesh(new T.CircleGeometry(1.4, 48), new T.MeshBasicMaterial({ map: tapaTx })); tc3.rotation.x = -Math.PI / 2; tc3.position.y = 1.56; S3.add(tc3);
    const panelTx = cabTex(1024, 512, (g, w, h) => { g.fillStyle = '#041040'; g.fillRect(0, 0, w, h); for (let i = 0; i < 14; i++) { const x = i * 76 + 6; const gr = g.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, '#0a2a9a'); gr.addColorStop(0.5, '#3a8aff'); gr.addColorStop(1, '#0a2a9a'); g.fillStyle = gr; g.fillRect(x, 30 + (i % 3) * 20, 64, h - 60 - (i % 3) * 40); g.fillStyle = 'rgba(160,220,255,.6)'; g.fillRect(x + 6, 50, 6, h - 100); } });
    panelTx.wrapS = T.RepeatWrapping; panelTx.repeat.set(3, 1);
    const muro = new T.Mesh(new T.CylinderGeometry(16, 16, 12, 96, 1, true), new T.MeshBasicMaterial({ map: panelTx, side: T.BackSide })); muro.position.y = 4; S3.add(muro);
    const aros = []; for (let i = 0; i < 3; i++) { const m = new T.Mesh(new T.TorusGeometry(7 + i * 2.3, 0.08, 8, 128), new T.MeshBasicMaterial({ color: 0xffd21a })); m.rotation.x = Math.PI / 2; m.position.y = 6 + i * 1.4; S3.add(m); aros.push(m); }
    const conoGeo = new T.ConeGeometry(1.5, 14, 24, 1, true); conoGeo.translate(0, -7, 0); const conos = []; for (let i = 0; i < 6; i++) { const m = new T.Mesh(conoGeo, new T.MeshBasicMaterial({ color: i % 2 ? 0x6ab8ff : 0xffffff, transparent: true, opacity: 0.13, blending: T.AdditiveBlending, depthWrite: false, side: T.DoubleSide })); m.position.set(-10 + i * 4, 12, -6); S3.add(m); conos.push(m); }
    const logo = new T.Group(); logo.position.set(0, 3.6, 0); S3.add(logo);
    const l1 = cabFrase(tituloL1(), 1.0, { cara: 'blanco', capas: 10, fondo: 0.3 }), l2 = cabFrase(tituloL2(), 1.35, { cara: 'blanco', capas: 10, fondo: 0.3 }); l1.position.set(-0.5, 1.15, 0); l2.position.set(0.2, 0, 0); logo.add(l1, l2);
    const st1 = new T.Mesh(new T.PlaneGeometry(4.6, 0.72), new T.MeshBasicMaterial({ map: capTxtTex(sub1, { color: '#ff5ad8', borde: '#3a0a5a', px: 116 }), transparent: true })); st1.position.set(0.2, -1.05, 0.05);
    const st2 = new T.Mesh(new T.PlaneGeometry(3.2, 0.4), new T.MeshBasicMaterial({ map: capTxtTex(sub2, { color: '#ffffff', borde: '#0a1a5a', px: 100 }), transparent: true })); st2.position.set(0.6, -1.6, 0.05); logo.add(st1, st2);
    C.escenas = [S1, S2, S3];
    const flash = (a, col = '255,255,255') => { if (a <= 0) return; C.g2.fillStyle = `rgba(${col},${Math.min(1, a)})`; C.g2.fillRect(0, 0, C.c2.width, C.c2.height); };
    const st = window.__cabv = { plano: 0 };
    return t => {
      if (t < 2) { st.plano = 1; // túnel
        const z = -t * 14 - t * t * 4; C.cam.position.set(Math.sin(t * 3) * 0.15, Math.cos(t * 2.5) * 0.1, z); C.cam.lookAt(0, 0, z - 10); C.cam.rotation.z = t * 0.6;
        const rompe = t >= 1.84; ahora.visible = !rompe; ahora.position.set(0, 0, C.lerp(z - 30, z - 3.2, C.ease(t / 1.84))); ahora.rotation.y = Math.sin(t * 2) * 0.15;
        S1.background.setHex(rompe ? 0x5a0a1a : 0x02030a); S1.fog.color.copy(S1.background);
        frag.forEach(m => { m.visible = rompe; if (rompe) { const d = t - 1.84, u = m.userData; m.position.set(u.p0.x + u.v.x * d, u.p0.y + u.v.y * d, z - 3.2 + u.v.z * d); m.rotation.set(u.r.x * d, u.r.y * d, 0); } });
        anillos.forEach((m, i) => m.material.color.setHex((i + Math.floor(t * 8)) % 2 ? 0xd04aff : 0x3ab8ff));
        C.render(S1); flash(rompe ? (2.0 - t) * 4 : 0, '120,10,30'); flash((t - 1.9) * 10);
      } else if (t < 3.86) { st.plano = 2; const d = t - 2; // cenital
        const y = C.lerp(9, 3.8, C.ease(d / 1.4)); C.cam.position.set(0, y, 0.001); C.cam.up.set(Math.sin(d * 0.9), 0, -Math.cos(d * 0.9)); C.cam.lookAt(0, -1, 0);
        const k = C.ease((d - 1.06) / 0.3); hojas.forEach(([b, sx]) => b.rotation.z = sx * k * 1.7);
        cayendo.root.visible = d > 0.55; const caida = Math.max(0, d - 1.2); cayendo.root.position.set(0, 0.05 - caida * caida * 7, 0); cayendo.root.rotation.y = d * 3; capBrazosArriba(cayendo, t);
        C.render(S2); flash(1 - d * 5);
      } else { st.plano = 3; const d = t - 3.86; C.cam.up.set(0, 1, 0); // revelado del logo
        const k = C.ease(d / 2.2); C.cam.position.set(Math.sin(d * 0.25) * 2, C.lerp(9.5, 4.4, k), C.lerp(4, 13, k)); C.cam.lookAt(0, C.lerp(2.2, 3.4, k), 0);
        conos.forEach((m, i) => { m.rotation.z = Math.sin(t * 1.8 + i) * 0.6; m.rotation.x = Math.cos(t * 1.3 + i) * 0.3; }); aros.forEach((m, i) => m.rotation.z = t * (0.3 + i * 0.15));
        const golpe = 3.62; logo.lookAt(C.cam.position.x * 0.2, C.cam.position.y * 0.3 + 2.5, C.cam.position.z);
        const e1 = C.rebote((d - 0.2) / 0.7), e2 = C.rebote((d - 0.45) / 0.7); l1.scale.setScalar(Math.max(0.01, e1)); l2.scale.setScalar(Math.max(0.01, e2));
        st1.scale.set(Math.max(0.01, C.ease((d - 2.0) / 0.3)), 1, 1); st2.material.opacity = C.ease((d - 2.4) / 0.3);
        const h = d >= golpe ? 1 + (1 - C.rebote((d - golpe) / 0.45)) * 0.35 : 1; logo.scale.setScalar(h); if (d >= golpe && d < golpe + 0.25) C.cam.position.x += Math.sin(d * 140) * 0.08;
        C.render(S3); flash(d >= golpe ? 0.6 - (d - golpe) * 3 : 0);
      }
    };
  } };
function promoCab3Dv(theme) { const d = { ...PROMOS.cab3dv, tema: theme || { id: 'normal' } }; d.audio = RC.audioExtra && RC.audioExtra('cabecera_nueva') ? 'cabecera_nueva' : 'cabecera3d'; return promoCorre(d); }


// ---- Reloj del minijuego de Scratch (solo para la pregunta de selección de la apertura) ----
// Mismos disfraces (sb3/img), misma geometría del escenario 480x360 y misma animación que los objetos
// Relogio / Relogio2 / RelogioDig1-4 del proyecto: la huella aparece en el centro, se desliza a la derecha,
// se convierte en la cápsula amarilla con «00:SS» en dígitos negros, y en los 5 últimos segundos parpadea
// la franja roja (Relogio2); suena el aviso «5» del proyecto.
const RELOJ_SB3 = { disco: ['4ca3f568f949468d31ac5cc8005fa0b8', 38, -42], capsula: ['ac50d7d82ffb869291f1c530c383597f', -210, -42], rojo: ['0530e4a9757101fa175ddc6d2280a63f', 480, -38],
  dig: [['b73e3a0d381b1e52794ab5549bf2849c', 6, 22], ['dc2d482421694c2f9293fce1d5f9e3e0', 18, 22], ['1e951033259aafb7d2c9e329fdff2d75', 18, 22], ['f3673cb3591715d04ec17eca130c0073', 18, 22], ['7bfe32f159b3467725a1c638ce30f669', 18, 22], ['16bc65a67fe0d6aa023a62bf7146db61', 18, 22], ['e7cfaa673ca4d551b50985c8e5aa9ed9', 16, 22], ['8ce5be56a8528d444fa11e2e9fc6b757', 16, 22], ['a0288d3b2d208bb41dec35135e9cba81', 16, 22], ['aa52312511f8c95b24c1f69fe21782e2', 16, 22]],
  dig3: ['eca9058e354078d11d6c039d3b09debe', 'a6e1b5ead2d2cd191f5448a2e8b621ef', 'b4d0643359bafb35ea50757c207777cc', '69ad3a96b6526c1d741f6b663292ba40', '79a8dfd086f479c9afb5425cfd598536', '2166f14da53f9d222ce05cf513798195', '8aecc14c06b9906c0f750f812ca7a1ca', '2bdc6ac214101bd611f63add9f845ff5', 'ccdf87f9a8da6676824ba62f5fbef111', 'a7a8eb480ad9017d2af253715a751988'].map(m => [m, 30, 22]) };
const RELOJ_IMG = {};
const relojImg = m => { if (!RELOJ_IMG[m]) { const im = new Image(); im.src = `./sb3/img/${m}.webp`; RELOJ_IMG[m] = im; } return RELOJ_IMG[m]; };
function relojPrecarga() { const t = RELOJ_SB3; [t.disco, t.capsula, t.rojo, ...t.dig, ...t.dig3].forEach(c => relojImg(c[0])); }
function relojSprite(g, c, x, y, alfa, E, ox, oy) { // dibuja un disfraz (resolución 2) con su centro de rotación en (x,y) del escenario
  const im = relojImg(c[0]); if (!im.complete || !im.naturalWidth || alfa <= 0) return; g.globalAlpha = Math.max(0, Math.min(1, alfa));
  g.drawImage(im, ox + (x - c[1] / 2) * E, oy - (y + c[2] / 2) * E, im.naturalWidth / 2 * E, im.naturalHeight / 2 * E); g.globalAlpha = 1; }
const relojCifra = n => n === 0 ? 9 : n - 1; // los disfraces se llaman 1..9,0
function relojScratch(g, d, w, ySuelo, op = {}) {
  // d: segundos desde el mensaje «relogio». Escala: el escenario de Scratch (480 de ancho) ocupa todo el ancho.
  const E = w / 480, ox = w / 2, oy = ySuelo - 59 * E; // la base de la cápsula (y=-59) queda en ySuelo
  const T0 = 5, paso = 0.98, inicio = 1.15, para = op.para ?? 3.4; g.save();
  const corriendo = d >= inicio, tiempo = !corriendo ? T0 : Math.max(0, T0 - Math.floor((Math.min(d, para) - inicio) / paso));
  // franja roja (Relogio2): parpadea mientras Tempo <= 5 (fundido de 10 pasos de entrada y 10 de salida)
  if (corriendo && d < para && tiempo <= 5) { const f = ((d - inicio) * 30) % 20, a = f < 10 ? f / 10 : 1 - (f - 10) / 10; relojSprite(g, RELOJ_SB3.rojo, 0, 0, a, E, ox, oy); }
  if (d < 0.63) { // huella: aparece en el centro (10 pasos), espera 0,3 s y se desliza 0,33 s hasta x=175
    const a = Math.min(1, d / 0.33), x = d < 0.3 ? 0 : 175 * Math.min(1, (d - 0.3) / 0.33); relojSprite(g, RELOJ_SB3.disco, x, 0, a, E, ox, oy);
  } else { // cápsula amarilla (5 pasos de fundido)
    relojSprite(g, RELOJ_SB3.capsula, 0, 0, Math.min(1, (d - 0.63) / 0.17), E, ox, oy);
    if (d >= inicio - 0.15) { const ss = String(tiempo).padStart(2, '0');
      relojSprite(g, RELOJ_SB3.dig[relojCifra(0)], 137, -41, 1, E, ox, oy); relojSprite(g, RELOJ_SB3.dig[relojCifra(0)], 155, -41, 1, E, ox, oy);
      relojSprite(g, RELOJ_SB3.dig3[relojCifra(+ss[0])], 180, -41, 1, E, ox, oy); relojSprite(g, RELOJ_SB3.dig[relojCifra(+ss[1])], 198, -41, 1, E, ox, oy); }
  }
  g.restore(); return tiempo;
}

// ---------------------------------------------- B) APERTURA DEL PROGRAMA ----------------------------------------------
const APERTURA_PREGUNTAS = [['¿Cuál es el planeta más grande del sistema solar?', 'JÚPITER'], ['¿Qué animal es conocido como el rey de la selva?', 'LEÓN'], ['¿Cuál es el océano más grande del mundo?', 'PACÍFICO'], ['¿Qué instrumento tiene teclas blancas y negras?', 'PIANO'], ['¿En qué estación del año caen las hojas?', 'OTOÑO']];
const APERTURA_NOMBRES = ['Rocío', 'Fermín', 'Lidia', 'Paco', 'Inés', 'Ramón', 'Sara', 'Toño', 'Elena', 'Julio'];
const APERTURA_COLORES = [0xe8102a, 0x2a8aff, 0x2fbf4a, 0xffb02e, 0x9a3ae0, 0x1ac0c0, 0xff5fb0, 0x8a5a2a, 0xffd23a, 0x4a4ae0];
// tramos de la apertura: [inicio original, fin original, duración real] — sincronizados con apertura/apertura.mp3
// (intro 15 s, concursantes 6 s, selección 6 s, cortinilla 4 s, presentación central 8 s, grúa 6 s = 45 s)
const APERTURA_TRAMOS = [[0, 12.4, 15], [12.4, 16, 6], [16, 21, 6], [21, 23.5, 4], [23.5, 29, 8], [29, 33, 6]];
const aperturaRemap = t => { let b = 0; for (const [a0, a1, d] of APERTURA_TRAMOS) { if (t < b + d) return a0 + (t - b) / d * (a1 - a0); b += d; } return 33 + (t - b); };
PROMOS.apertura = { id: 'apertura', nombre: 'Apertura del programa', dur: 45, audioUrl: './apertura/apertura.mp3', soloMusica: true, emoji: '🎬', sub: 'Presentación del programa: plató, público, Marco, concursantes y pregunta de selección',
  musica: { bpm: 120, golpes: [4, 15, 27, 31, 39], fin: 44.5 },
  montar(C) {
    const T = C.T, cfg = C.cfg, def = C.def || {}, W = () => C.c2.width, H = () => C.c2.height, g = C.g2;
    const E = cabEstudio(cfg, { id: 'normal' }, { sinObjetos: true }); const S = E.scene;
    // escalera LED al fondo (sube hasta la pasarela de entrada)
    const esc = new T.Group(); esc.position.set(0, 0, -4.6); S.add(esc);
    for (let i = 0; i < 10; i++) { const p = new T.Mesh(new T.BoxGeometry(3.2, 0.32, 0.6), new T.MeshPhongMaterial({ color: 0x1a1e2a, specular: 0x8899cc, shininess: 80 })); p.position.set(0, 0.16 + i * 0.32, -i * 0.6); esc.add(p); const led = new T.Mesh(new T.BoxGeometry(3.2, 0.05, 0.02), new T.MeshBasicMaterial({ color: i % 2 ? 0x3ab8ff : 0xd04aff })); led.position.set(0, 0.3 + i * 0.32, -i * 0.6 + 0.31); led.userData.i = i; esc.add(led); }
    const esLed = esc.children.filter(m => m.userData.i != null);
    const pasoEsc = k => new T.Vector3(0, 3.2 - Math.min(1, k) * 2.75, -10.2 + Math.min(1, k) * 6.4); // de lo alto de la escalera al suelo
    // público en gradas (detrás de los podios, a la derecha)
    const gradas = []; for (let f = 0; f < 4; f++) for (let i = 0; i < 16; i++) { const a = Math.PI * 0.12 + i * 0.075, R = 12.5 + f * 1.1; const p = capFigura(T, APERTURA_COLORES[(i + f) % 10], [0xf0c8a8, 0xd8a888, 0xa87858][(i * 3 + f) % 3]); p.root.position.set(Math.sin(a) * R, 0.3 + f * 0.6, Math.cos(a) * R); p.root.scale.setScalar(0.9); p.root.lookAt(0, p.root.position.y, 0); S.add(p.root); gradas.push(p);
      const banco = new T.Mesh(new T.BoxGeometry(0.8, 0.3 + f * 0.6, 0.8), new T.MeshPhongMaterial({ color: 0x20243a })); banco.position.set(p.root.position.x, (0.3 + f * 0.6) / 2, p.root.position.z); S.add(banco); }
    // pantalla del fondo con el bote
    const bote = (typeof etapa === 'function' && etapa().bote) || 100000;
    const pantTx = cabTex(1024, 512, (g2, w, h) => { const gr = g2.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, '#1b52e6'); gr.addColorStop(1, '#06166a'); g2.fillStyle = gr; g2.fillRect(0, 0, w, h); g2.drawImage(promoLogoCanvas(), w * 0.04, h * 0.1, h * 0.92, h * 0.8); g2.font = `900 60px ${CAB_FUENTE}`; g2.fillStyle = '#ffd21a'; g2.textAlign = 'center'; g2.fillText('BOTE DE HOY', w * 0.68, h * 0.34); g2.font = `900 130px ${CAB_FUENTE}`; g2.lineWidth = 12; g2.strokeStyle = '#06166a'; const s = bote.toLocaleString('es-ES') + ' €'; g2.strokeText(s, w * 0.68, h * 0.62); g2.fillStyle = '#ffffff'; g2.fillText(s, w * 0.68, h * 0.62); });
    const pant = new T.Mesh(new T.PlaneGeometry(9, 4.5), new T.MeshBasicMaterial({ map: pantTx })); pant.position.set(0, 7.2, -13.5); S.add(pant);
    // personajes
    const ad = promoAdrian(); S.add(ad.root);
    const g0 = COPRO_DATOS && (typeof window.__coproForce === 'string' ? COPRO_DATOS.find(x => x.id === window.__coproForce) : null) || (def.copro !== false && (window.__coproForce !== false && coproOn()) ? exAzar(COPRO_DATOS) : null);
    if (def.programa && g0) COPRO_APERTURA = g0;
    const co = g0 ? capFigura(T, g0.shirt) : null; co && S.add(co.root);
    const jug = APERTURA_NOMBRES.map((n, i) => { const f = capFigura(T, APERTURA_COLORES[i]); S.add(f.root); f.root.visible = false; return f; });
    const elegido = Math.floor(Math.random() * 10); const pq = exAzar(APERTURA_PREGUNTAS);
    const nombreCentro = def.nombreJugador || APERTURA_NOMBRES[elegido];
    const destJ = i => { const a = (i / 10) * Math.PI * 2; return new T.Vector3(Math.sin(a) * 2.2, 0.45, Math.cos(a) * 2.2); };
    const bump = new T.Scene(); bump.background = new T.Color(0x0a2aa0); bump.add(new T.HemisphereLight(0xffffff, 0x202040, 1.4));
    const vortTx = cabTex(512, 512, (g2, w) => { for (let i = 0; i < 24; i++) { g2.fillStyle = i % 2 ? '#ff2a1a' : '#ffd21a'; g2.beginPath(); g2.moveTo(w / 2, w / 2); g2.arc(w / 2, w / 2, w, i / 24 * Math.PI * 2, (i + 1) / 24 * Math.PI * 2); g2.fill(); } const gr = g2.createRadialGradient(w / 2, w / 2, 0, w / 2, w / 2, w / 2); gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(0.2, 'rgba(255,255,255,0)'); g2.fillStyle = gr; g2.fillRect(0, 0, w, w); });
    const vort = new T.Mesh(new T.CircleGeometry(1.6, 64), new T.MeshBasicMaterial({ map: vortTx })); vort.position.z = 0.006; bump.add(vort);
    const bp = promoPuerta(bump, new T.Vector3(0, 0, 0), 1.6, 0xffd21a); bp.G.rotation.x = Math.PI / 2;
    const blogo = new T.Mesh(new T.PlaneGeometry(4.4, 3.85), new T.MeshBasicMaterial({ map: new T.CanvasTexture(promoLogoCanvas()), transparent: true })); blogo.material.map.colorSpace = T.SRGBColorSpace; bump.add(blogo);
    const bcam = new T.PerspectiveCamera(45, 16 / 9, 0.1, 50); bcam.position.set(0, 0, 6.5); bcam.lookAt(0, 0, 0);
    C.escenas = [S, bump];
    // líneas habladas (bocadillos + voz sintética del navegador si está disponible)
    const g1 = g0 ? g0.nombre : '';
    const lineas = [[9.6, 12, 'ADRIÁN VEGA', '¡Buenas noches y bienvenidos a ¡Ahora caigo!!'], [12, 14.6, 'ADRIÁN VEGA', 'Diez rivales, diez trampillas... ¡y alguien en el centro! ¡Que pasen nuestros concursantes!'], [16, 21, 'ADRIÁN VEGA', 'Pregunta de selección: el más rápido se queda en el centro.']]
      .concat(g0 ? [[24, 26.6, 'ADRIÁN VEGA', '¡Y hoy no estoy solo! Me acompaña ' + g0.nombre.split(' · ')[0] + '.'], [26.6, 29, g1.toUpperCase(), '¡Hola a todos! ¡' + nombreCentro + ', mucha suerte!']] : [[24, 29, 'ADRIÁN VEGA', '¡' + nombreCentro + ', bienvenido al centro! ¡Mucha suerte!']]);
    const dichas = new Set(); const vozOn = !To.mute && window.speechSynthesis && !window.__promoT;
    const decir = txt => { try { if (!vozOn) return; const u = new SpeechSynthesisUtterance(txt.replace(/¡|!/g, '')); u.lang = 'es-ES'; u.rate = 1.1; speechSynthesis.speak(u); } catch (e) { } };
    const bocadillo = (quien, txt, k) => { const w = W(), h = H(), s = h / 720; g.save(); g.globalAlpha = Math.min(1, k * 4); g.font = `700 ${22 * s}px system-ui, sans-serif`; const ancho = Math.min(w * 0.6, g.measureText(txt).width + 40 * s); const x = 30 * s, y = 26 * s;
      g.fillStyle = '#ffffff'; g.beginPath(); g.roundRect ? g.roundRect(x, y, ancho, 78 * s, 18 * s) : g.rect(x, y, ancho, 78 * s); g.fill(); g.fillStyle = '#ff8a1a'; g.font = `800 ${13 * s}px system-ui, sans-serif`; g.fillText(quien, x + 16 * s, y + 24 * s); g.fillStyle = '#18204a'; g.font = `700 ${21 * s}px system-ui, sans-serif`; g.fillText(txt, x + 16 * s, y + 56 * s, ancho - 30 * s); g.restore(); };
    const rotulo = (titulo, sub, k) => { const w = W(), h = H(), s = h / 720, x = 60 * s - (1 - C.ease(k * 3)) * 500 * s, y = h - 150 * s; g.save(); g.fillStyle = '#ff7a10'; g.fillRect(x, y, 440 * s, 54 * s); g.fillStyle = '#0a1a6a'; g.fillRect(x, y + 54 * s, 440 * s, 36 * s); g.fillStyle = '#fff'; g.font = `900 ${30 * s}px ${CAB_FUENTE}`; g.fillText(titulo, x + 18 * s, y + 38 * s); g.font = `700 ${18 * s}px system-ui`; g.fillText(sub, x + 18 * s, y + 79 * s); g.restore(); };
    const seleccion = (d) => { // gráfico de la pregunta de selección (0-5 s)
      const w = W(), h = H(), s = h / 720, cy = h - 210 * s; g.save(); g.fillStyle = 'rgba(0,0,20,.35)'; g.fillRect(0, 0, w, h);
      // retratos alrededor
      for (let i = 0; i < 10; i++) { const x = w / 2 + (i - 4.5) * 108 * s, y = cy - 110 * s, gana = d > 4.1 && i === elegido; g.fillStyle = gana ? '#ff7a10' : '#0a1a6a'; g.beginPath(); g.arc(x, y, 44 * s, 0, 7); g.fill(); g.lineWidth = 5 * s; g.strokeStyle = gana ? '#ffd21a' : '#7ab8ff'; g.stroke(); const col = '#' + APERTURA_COLORES[i].toString(16).padStart(6, '0'); g.fillStyle = col; g.beginPath(); g.ellipse(x, y + 26 * s, 26 * s, 18 * s, 0, Math.PI, 0); g.fill(); g.fillStyle = '#f0c8a8'; g.beginPath(); g.arc(x, y - 6 * s, 16 * s, 0, 7); g.fill(); g.fillStyle = '#fff'; g.font = `800 ${14 * s}px system-ui`; g.textAlign = 'center'; g.fillText(APERTURA_NOMBRES[i], x, y + 62 * s); }
      // banda inferior azul oscuro con la pregunta
      g.fillStyle = '#06124a'; g.fillRect(w * 0.08, cy, w * 0.84, 170 * s); g.fillStyle = '#ff7a10'; g.fillRect(w * 0.08, cy, w * 0.84, 6 * s); g.textAlign = 'center'; g.fillStyle = '#fff'; g.font = `800 ${28 * s}px system-ui`; g.fillText(pq[0], w / 2, cy + 48 * s, w * 0.8);
      const L = [...pq[1]], tw = 64 * s, x0 = w / 2 - L.length * tw / 2; L.forEach((ch, i) => { const k = C.ease((d - 3.4 - i * 0.08) / 0.18), sx = Math.abs(Math.cos(k * Math.PI)); const x = x0 + i * tw + tw / 2; g.save(); g.translate(x, cy + 112 * s); g.scale(Math.max(0.05, sx), 1); g.fillStyle = k > 0.5 ? '#ffd21a' : '#1a2a8a'; g.fillRect(-28 * s, -32 * s, 56 * s, 64 * s); g.strokeStyle = '#7ab8ff'; g.lineWidth = 3 * s; g.strokeRect(-28 * s, -32 * s, 56 * s, 64 * s); if (k > 0.5) { g.fillStyle = '#06124a'; g.font = `900 ${38 * s}px ${CAB_FUENTE}`; g.fillText(ch, 0, 14 * s); } g.restore(); });
      relojScratch(g, d, w, cy - 162 * s);
      if (d > 4.1) { g.fillStyle = '#ff7a10'; g.font = `900 ${34 * s}px ${CAB_FUENTE}`; g.fillText('¡' + nombreCentro.toUpperCase() + ' AL CENTRO!', w / 2, cy - 180 * s); }
      g.restore(); };
    relojPrecarga(); let aviso5 = false;
    const st = window.__apertura = { plano: '' };
    const conAudio = C.audioOrig; // con el audio de la grabación no se muestran bocadillos ni se usa voz sintética
    return tReal => { const t = aperturaRemap(tReal);
      E.update(t); esLed.forEach(m => m.material.color.setHex((m.userData.i + Math.floor(t * 6)) % 2 ? 0x3ab8ff : 0xd04aff));
      // --- personajes
      // Marco: baja la escalera 6.5-9, va al borde de la tarima y presenta
      { const k = (t - 6.5) / 2.1; let p; if (t < 6.5) p = pasoEsc(0); else if (t < 8.6) p = pasoEsc(k); else if (t < 9.6) p = pasoEsc(1).lerp(new T.Vector3(-1.7, 0.45, -1.4), C.ease(t - 8.6)); else p = new T.Vector3(-1.7, 0.45, -1.4); if (t >= 22) p = new T.Vector3(-0.9, 0.45, 1.6);
        ad.root.position.copy(p); ad.root.rotation.y = t < 9 ? 0 : 0; ad.root.visible = t >= 6.3; if (t < 9.6 && t >= 6.5) ad.A.anda(t); else if (lineas.some(l => t >= l[0] && t < l[1] && l[2] === 'ADRIÁN VEGA')) ad.A.habla(t); else ad.A.presenta(t, 0.8); }
      jug.forEach((f, i) => { const t0 = 12.6 + i * 0.28; f.root.visible = t >= t0 && t < 22 || (t >= 22 && i === elegido) || (t >= 29 && true); const k = (t - t0) / 2.4; if (t < 22) { if (k < 1) { f.root.position.copy(pasoEsc(Math.max(0, k * 1.6))).lerp(destJ(i), Math.max(0, k * 1.6 - 1) / 0.6); capAnda(f, t + i); } else { f.root.position.copy(destJ(i)); capQuieto(f); } f.root.lookAt(0, f.root.position.y, 0); }
        else if (i === elegido) { f.root.position.set(0, 0.45, 0.6); f.root.rotation.set(0, 0, 0); t < 24 ? capBrazosArriba(f, t) : capQuieto(f); }
        else { f.root.position.copy(destJ(i)).multiplyScalar(2.9).setY(0.3); f.root.lookAt(0, 0.3, 0); capQuieto(f); } });
      if (co) { co.root.visible = t >= 23.6; co.root.position.set(1.0, 0.45, 1.5); co.root.rotation.set(0, -0.2, 0); t > 26.6 && t < 29 ? capBrazosArriba(co, t) : capQuieto(co); }
      gradas.forEach((p, i) => (t >= 4 && t < 7) || (t > 28) ? (i % 3 ? capAplaude(p, t, i) : capBrazosArriba(p, t, i)) : capQuieto(p));
      // --- planos de cámara
      let plano = '';
      if (t < 4) { plano = 'espiral'; const k = C.ease(t / 4), a = 2.6 + k * 2.4, R = C.lerp(1.2, 15, k), y = C.lerp(0.6, 8.5, k); const p0 = new T.Vector3(Math.sin(2.75) * 7, 0, Math.cos(2.75) * 7); C.cam.position.set(C.lerp(p0.x, 0, k) + Math.sin(a) * R, y, C.lerp(p0.z, 0, k) + Math.cos(a) * R); C.cam.lookAt(C.lerp(p0.x, 0, k), C.lerp(0.2, 0.5, k), C.lerp(p0.z, -2, k)); }
      else if (t < 6.5) { plano = 'publico'; const d = t - 4; C.cam.position.set(2 + d * 0.4, 2.4, 3); C.cam.lookAt(Math.sin(0.5) * 13, 1.6, Math.cos(0.5) * 13); }
      else if (t < 9.6) { plano = 'escalera'; const p = ad.root.position; C.cam.position.set(2.2, 2.4, p.z + 6); C.cam.lookAt(p.x, p.y + 1.1, p.z); }
      else if (t < 12.4) { plano = 'adrian'; C.cam.position.set(-1.1, 2.05, 2.4); C.cam.lookAt(-1.7, 1.75, -1.4); }
      else if (t < 16) { plano = 'concursantes'; const d = t - 12.4; C.cam.position.set(Math.sin(d * 0.15) * 9, 6.5 - d * 0.3, 9); C.cam.lookAt(0, 0.8, -3); }
      else if (t < 21) { plano = 'seleccion'; C.cam.position.set(0, 5.5, 8); C.cam.lookAt(0, 0.6, 0); }
      else if (t < 23.5) plano = 'cortinilla';
      else if (t < 29) { plano = 'centro'; C.cam.position.set(0.2, 1.9, 6.4); C.cam.lookAt(0, 1.45, 1.1); }
      else { plano = 'grua'; const k = C.ease((t - 29) / 3.6); C.cam.position.set(0, C.lerp(2.2, 9.5, k), C.lerp(6.4, 19, k)); C.cam.lookAt(0, C.lerp(1.4, 4.2, k), C.lerp(1.1, -8, k)); }
      st.plano = plano;
      if (plano === 'cortinilla') { const d = t - 21; bp.abre(C.ease((d - 0.2) / 0.5)); vort.rotation.z = -t * 6; vort.visible = d < 1.4; bp.G.visible = d < 1.4; blogo.visible = d >= 1.2; if (blogo.visible) { const k = C.rebote((d - 1.2) / 0.6); blogo.scale.setScalar(Math.max(0.01, 2.6 - k * 1.6)); blogo.position.z = (1 - k) * 2; }
        C.render(bump, bcam); if (d >= 1.2 && d < 1.45) { g.fillStyle = `rgba(255,255,255,${1 - (d - 1.2) * 4})`; g.fillRect(0, 0, W(), H()); } }
      else C.render(S);
      if (plano === 'seleccion') { seleccion(t - 16); if (!aviso5 && !conAudio && t - 16 >= 1.15 && window.__promoT == null && !To.mute) { aviso5 = true; try { const a = new Audio('./sb3/snd/419ca907843416e034fb72fd6a79bed3.mp3'); a.volume = Math.min(1, To.vol); a.play().catch(() => { }); } catch (e) { } } }
      if (plano === 'centro' && t > 24.6) rotulo(nombreCentro.toUpperCase(), 'Concursante del centro', t - 24.6);
      if (!conAudio) for (const l of lineas) if (t >= l[0] && t < l[1]) { bocadillo(l[2], l[3], t - l[0]); if (!dichas.has(l)) { dichas.add(l); decir(l[3]); } }
      g.fillStyle = 'rgba(0,0,0,0.01)'; g.fillRect(0, 0, 2, 2); // fuerza a presentar el lienzo 2D aunque quede vacío
      if (t > 32.4) { g.fillStyle = `rgba(0,0,0,${(t - 32.4) / 0.6})`; g.fillRect(0, 0, W(), H()); }
    };
  } };
function promoApertura(op = {}) { const d = { ...PROMOS.apertura, ...op }; return promoCorre(d, op.hud, op.sess).finally(() => { try { window.speechSynthesis && speechSynthesis.cancel(); } catch (e) { } }); }
/** al empezar cada Programa completo: cabecera 3D + apertura (desactivable en Opciones) */
async function aperturaPrograma(hud, sess, theme) {
  if (window.__noApertura || !aperturaOn()) return false;
  mec('apertura cabecera'); await promoCorre({ ...PROMOS.cab3dv, tema: theme || { id: 'normal' }, audio: RC.audioExtra && RC.audioExtra('cabecera_nueva') ? 'cabecera_nueva' : 'cabecera3d' }, hud, sess);
  if (sess && sess.alive === false) return true;
  mec('apertura programa'); await promoApertura({ programa: true, hud, sess, tema: theme || { id: 'normal' } });
  return true;
}
function filaApertura() {
  const row = document.createElement('div'); row.className = 'orow'; row.id = 'rowApertura';
  const lb = document.createElement('label'); lb.textContent = '🎬 Cabecera 3D y apertura larga en el Programa completo'; row.appendChild(lb);
  for (const [v, t] of [['1', 'Sí'], ['0', 'No']]) { const b = document.createElement('button'); b.className = 'tbtn' + ((aperturaOn() ? '1' : '0') === v ? ' sel' : ''); b.textContent = t; b.onclick = ev => { ev.stopPropagation(); localStorage.setItem('ac_apertura', v); row.querySelectorAll('button').forEach(x => x.classList.toggle('sel', x === b)); }; row.appendChild(b); }
  return row;
}
window.__promoCab3Dv = () => promoCab3Dv(); window.__promoApertura = op => promoApertura(op || {});
