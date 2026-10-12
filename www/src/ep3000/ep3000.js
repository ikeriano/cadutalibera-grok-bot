// «… en el año 3000»: episodio completo de ¡Ahora caigo! en un plató futurista (robots, hologramas, trampillas,
// duelos, moneda, juego final). Voces Piper pregrabadas (medium/high, comprobadas con faster-whisper). Sin recursos con derechos.
import * as THREE from 'three';
import EP_ES from './datos_es.json';
import EP_IT from './datos_it.json';
const IT = (window.__LANG || localStorage.getItem('ac_lang') || 'it') === 'it';
const EP = IT ? EP_IT : EP_ES;
const TL = (it, es) => IT ? it : es;
const VOZ = IT ? 'ep3000/voz_it/' : 'ep3000/voz/';
const C = EP.color || '#ffd23a', C2 = EP.color2 || '#0a1a5a';
let abierto = false;
function abrir(alSalir, desde = 0) {
  if (abierto) return; abierto = true;
  const $ = (t, css, h) => { const d = document.createElement(t); if (css) d.style.cssText = css; if (h != null) d.innerHTML = h; return d; };
  const root = $('div', 'position:fixed;inset:0;z-index:99995;background:#000;font-family:system-ui,Arial;color:#fff;overflow:hidden;user-select:none');
  ['pointerdown', 'pointerup', 'click', 'keydown', 'wheel', 'touchstart'].forEach(ev => root.addEventListener(ev, e => e.stopPropagation()));
  document.body.appendChild(root);
  const R = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true }); R.setPixelRatio(Math.min(2, devicePixelRatio)); R.setSize(innerWidth, innerHeight); root.appendChild(R.domElement);
  R.toneMapping = THREE.ACESFilmicToneMapping; R.outputColorSpace = THREE.SRGBColorSpace;
  const S = new THREE.Scene(); S.background = new THREE.Color(0x02030c); S.fog = new THREE.FogExp2(0x050418, 0.022);
  const cam = new THREE.PerspectiveCamera(50, innerWidth / innerHeight, .1, 400); cam.position.set(0, 9, 20);
  const onR = () => { R.setSize(innerWidth, innerHeight); cam.aspect = innerWidth / innerHeight; cam.updateProjectionMatrix(); }; addEventListener('resize', onR);
  S.add(new THREE.HemisphereLight(0x8899ff, 0x110022, .7)); const dl = new THREE.DirectionalLight(0xffffff, 1.1); dl.position.set(5, 14, 8); S.add(dl);
  const M = (c, e = 0, o = {}) => new THREE.MeshStandardMaterial(Object.assign({ color: c, emissive: e, roughness: .35, metalness: .6 }, o));
  const NEON = c => new THREE.MeshBasicMaterial({ color: c });
  const KS = EP.app === 'karasevda'; const F = EP.cfg.formato || 'ac', AC = F === 'ac';
  // --- plató: suelo con rejilla, aro LED, gradas de luz, ciudad futurista al fondo y estrellas ---
  const suelo = new THREE.Mesh(new THREE.CircleGeometry(40, 64), M(0x0a0c22, 0x020210, { metalness: .9, roughness: .25 })); suelo.rotation.x = -Math.PI / 2; S.add(suelo);
  const grid = new THREE.PolarGridHelper(26, 24, 12, 64, 0x2a3cff, 0x1a1a66); grid.position.y = .02; S.add(grid);
  const aros = []; for (const [r, c] of [[7.6, 0xff2bd6], [8.1, 0x29e6ff], [3, new THREE.Color(C).getHex()]]) { const a = new THREE.Mesh(new THREE.TorusGeometry(r, .06, 8, 120), NEON(c)); a.rotation.x = Math.PI / 2; a.position.y = .08; S.add(a); aros.push(a); }
  if (!AC) { aros[1].visible = false; aros[0].scale.setScalar(F === 'caz' ? 1.6 : 1.3); }
  const flot = []; for (let i = 0; i < 3; i++) { const a = new THREE.Mesh(new THREE.TorusGeometry(9 + i * 2.2, .05, 6, 120), new THREE.MeshBasicMaterial({ color: [0x29e6ff, 0xff2bd6, 0x9a5bff][i], transparent: true, opacity: .55 })); a.position.y = 9 + i * 1.6; a.rotation.x = Math.PI / 2; S.add(a); flot.push(a); }
  const est = new THREE.BufferGeometry(), N = 1500, pa = new Float32Array(N * 3); for (let i = 0; i < N; i++) { const r = 80 + Math.random() * 120, t = Math.random() * 6.28, f = Math.random() * 1.4; pa[i * 3] = r * Math.cos(t) * Math.cos(f); pa[i * 3 + 1] = 5 + r * Math.sin(f); pa[i * 3 + 2] = r * Math.sin(t) * Math.cos(f); } est.setAttribute('position', new THREE.BufferAttribute(pa, 3)); S.add(new THREE.Points(est, new THREE.PointsMaterial({ color: 0xffffff, size: .5 })));
  for (let i = 0; i < 46; i++) { const h = 6 + Math.random() * 26, t = i / 46 * 6.28 + Math.random() * .1, r = 46 + Math.random() * 14; const b = new THREE.Mesh(new THREE.BoxGeometry(3 + Math.random() * 3, h, 3 + Math.random() * 3), M(0x0b0d22, [0x29e6ff, 0xff2bd6, 0x6a4bff][i % 3], { emissiveIntensity: .12 })); b.position.set(r * Math.cos(t), h / 2, r * Math.sin(t)); S.add(b);
    const v = new THREE.Mesh(new THREE.BoxGeometry(.3, h * .9, .3), NEON([0x29e6ff, 0xff2bd6, 0xffd23a][i % 3])); v.position.set(b.position.x * .97, h / 2, b.position.z * .97); S.add(v); }
  const naves = []; for (let i = 0; i < 6; i++) { const g = new THREE.Group(); const c = new THREE.Mesh(new THREE.SphereGeometry(1, 16, 8), M(0xaab4cc, 0x000000)); c.scale.set(2.2, .45, 1); g.add(c); const l = new THREE.Mesh(new THREE.SphereGeometry(.35, 8, 6), NEON(0x29e6ff)); l.position.y = -.4; g.add(l); g.userData = { r: 38 + i * 4, v: .05 + i * .02, h: 16 + i * 3, f: i }; S.add(g); naves.push(g); }
  // gradas de público robot (luces)
  for (let i = 0; i < 120; i++) { const t = Math.PI * .15 + i / 120 * Math.PI * 1.7, f = i % 3; const p = new THREE.Mesh(new THREE.SphereGeometry(.18, 6, 4), NEON([0x29e6ff, 0xff2bd6, 0xffd23a][i % 3])); p.position.set((15 + f * 1.4) * Math.cos(t), 1 + f * 1.1, (15 + f * 1.4) * Math.sin(t)); S.add(p); }
  // pantalla holográfica gigante
  const scC = document.createElement('canvas'); scC.width = 1024; scC.height = 512; const scG = scC.getContext('2d'); const scT = new THREE.CanvasTexture(scC); scT.colorSpace = THREE.SRGBColorSpace;
  const pant = new THREE.Mesh(new THREE.PlaneGeometry(16, 8), new THREE.MeshBasicMaterial({ map: scT, transparent: true, opacity: .92, side: THREE.DoubleSide, blending: THREE.AdditiveBlending, depthWrite: false })); pant.position.set(0, 8.5, -14); S.add(pant);
  function pantalla(lineas, tam = 64) { scG.clearRect(0, 0, 1024, 512); const gr = scG.createLinearGradient(0, 0, 0, 512); gr.addColorStop(0, 'rgba(20,60,255,.35)'); gr.addColorStop(1, 'rgba(255,40,200,.25)'); scG.fillStyle = gr; scG.fillRect(0, 0, 1024, 512);
    scG.strokeStyle = '#29e6ff'; scG.lineWidth = 8; scG.strokeRect(8, 8, 1008, 496); for (let y = 0; y < 512; y += 6) { scG.fillStyle = 'rgba(0,0,0,.18)'; scG.fillRect(0, y, 1024, 2); }
    scG.textAlign = 'center'; scG.fillStyle = '#fff'; scG.shadowColor = '#29e6ff'; scG.shadowBlur = 20; lineas.forEach((l, i) => { scG.font = `900 ${i ? tam * .7 : tam}px system-ui`; scG.fillText(l, 512, 512 / 2 - (lineas.length - 1) * tam * .45 + i * tam * .95 + tam * .3, 980); }); scT.needsUpdate = true; }
  pantalla([EP.cfg.show, TL('ANNO 3000', 'AÑO 3000')]);
  // focos móviles
  const focos = []; for (let i = 0; i < 8; i++) { const cono = new THREE.Mesh(new THREE.ConeGeometry(1.6, 16, 24, 1, true), new THREE.MeshBasicMaterial({ color: [0x29e6ff, 0xff2bd6, 0xffffff, 0x9a5bff][i % 4], transparent: true, opacity: .09, side: THREE.DoubleSide, blending: THREE.AdditiveBlending, depthWrite: false }));
    cono.geometry.translate(0, -8, 0); const g = new THREE.Group(); g.add(cono); const t = i / 8 * 6.28; g.position.set(13 * Math.cos(t), 15, 13 * Math.sin(t)); g.userData.f = i; S.add(g); focos.push(g); }
  // --- personajes ---
  const caraTex = (fondo, ojos, boca) => { const c = document.createElement('canvas'); c.width = c.height = 128; const g = c.getContext('2d'); g.fillStyle = fondo; g.fillRect(0, 0, 128, 128); g.fillStyle = ojos; g.beginPath(); g.arc(42, 56, 12, 0, 7); g.arc(86, 56, 12, 0, 7); g.fill(); if (boca) { g.fillRect(40, 88, 48, 8); } const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t; };
  function robot(col, holo, i) {
    const g = new THREE.Group(); const mat = holo ? new THREE.MeshBasicMaterial({ color: 0x55eaff, transparent: true, opacity: .45, blending: THREE.AdditiveBlending, depthWrite: false }) : M(col, 0x000000, { metalness: .8, roughness: .3 });
    const cuerpo = new THREE.Mesh(i % 3 === 1 ? new THREE.CylinderGeometry(.55, .7, 1.4, 16) : new THREE.BoxGeometry(1.1, 1.4, .8), mat); cuerpo.position.y = 1.3; g.add(cuerpo);
    const cab = new THREE.Mesh(i % 2 ? new THREE.SphereGeometry(.5, 20, 14) : new THREE.BoxGeometry(.85, .7, .7), mat); cab.position.y = 2.45; g.add(cab);
    const visor = new THREE.Mesh(new THREE.PlaneGeometry(.66, .4), new THREE.MeshBasicMaterial({ map: caraTex('#071022', holo ? '#aaffff' : ['#29e6ff', '#ff2bd6', '#ffd23a', '#7cff6a'][i % 4], true), transparent: holo })); visor.position.set(0, 2.47, i % 2 ? .51 : .37); g.add(visor);
    const ant = new THREE.Mesh(new THREE.CylinderGeometry(.03, .03, .5), mat); ant.position.y = 3.0; g.add(ant); const bola = new THREE.Mesh(new THREE.SphereGeometry(.09, 8, 6), NEON(0xff2bd6)); bola.position.y = 3.28; g.add(bola);
    for (const s of [-1, 1]) { const b = new THREE.Mesh(new THREE.CylinderGeometry(.11, .11, 1.1, 8), mat); b.position.set(s * .75, 1.3, 0); b.rotation.z = s * .2; g.add(b); const p = new THREE.Mesh(new THREE.CylinderGeometry(.14, .14, .7, 8), mat); p.position.set(s * .3, .35, 0); g.add(p); }
    g.userData = { cab, holo, mat, base: 0, brazo: g.children.filter(x => x.geometry && x.geometry.type === 'CylinderGeometry' && Math.abs(x.position.x) > .5) }; return g;
  }
  function humano(ropa, piel, pelo, mujer) {
    const g = new THREE.Group(); const mR = M(ropa, 0, { metalness: .3, roughness: .6 }), mP = M(piel, 0, { metalness: 0, roughness: .8 });
    const cuerpo = new THREE.Mesh(new THREE.CapsuleGeometry(.42, 1.0, 4, 12), mR); cuerpo.position.y = 1.45; g.add(cuerpo);
    const cab = new THREE.Mesh(new THREE.SphereGeometry(.36, 20, 16), mP); cab.position.y = 2.45; g.add(cab);
    const pl = new THREE.Mesh(new THREE.SphereGeometry(.38, 20, 16, 0, 6.28, 0, mujer ? 2.0 : 1.4), M(pelo, 0, { metalness: .1, roughness: .7 })); pl.position.y = 2.5; g.add(pl);
    const fc = document.createElement('canvas'); fc.width = fc.height = 128; const fg = fc.getContext('2d'); fg.fillStyle = '#fff'; fg.beginPath(); fg.ellipse(44, 58, 11, 8, 0, 0, 7); fg.ellipse(84, 58, 11, 8, 0, 0, 7); fg.fill(); fg.fillStyle = '#2a1a0a'; fg.beginPath(); fg.arc(45, 59, 5.5, 0, 7); fg.arc(85, 59, 5.5, 0, 7); fg.fill();
    fg.strokeStyle = '#2a1a0a'; fg.lineWidth = 5; fg.lineCap = 'round'; fg.beginPath(); fg.moveTo(32, 42); fg.lineTo(56, 40); fg.moveTo(72, 40); fg.lineTo(96, 42); fg.stroke(); fg.strokeStyle = '#9a3a3a'; fg.lineWidth = 5; fg.beginPath(); fg.arc(64, 82, 14, .25, Math.PI - .25); fg.stroke();
    const ft = new THREE.CanvasTexture(fc); ft.colorSpace = THREE.SRGBColorSpace; const face = new THREE.Mesh(new THREE.PlaneGeometry(.56, .56), new THREE.MeshBasicMaterial({ map: ft, transparent: true })); face.position.set(0, 2.44, .345); g.add(face);
    const visor = new THREE.Mesh(new THREE.TorusGeometry(.4, .03, 6, 30, Math.PI), NEON(0x29e6ff)); visor.position.set(0, 2.62, 0); visor.rotation.x = -Math.PI / 2.4; g.add(visor);
    for (const s of [-1, 1]) { const p = new THREE.Mesh(new THREE.CapsuleGeometry(.14, .7, 3, 8), mR); p.position.set(s * .2, .45, 0); g.add(p); const b = new THREE.Mesh(new THREE.CapsuleGeometry(.1, .7, 3, 8), mR); b.position.set(s * .55, 1.5, 0); b.rotation.z = s * .15; g.add(b); }
    const traje = new THREE.Mesh(new THREE.TorusGeometry(.43, .03, 6, 30), NEON(0xff2bd6)); traje.rotation.x = Math.PI / 2; traje.position.y = 1.5; g.add(traje);
    g.userData = { cab, face }; return g;
  }
  const centro = new THREE.Mesh(new THREE.CylinderGeometry(1.6, 1.8, .5, 40), M(0x1a1d3a, new THREE.Color(C).getHex(), { emissiveIntensity: .25 })); centro.position.y = .25; S.add(centro);
  const cent = KS ? humano(0x1d2a44, 0xd9a888, 0x1a120c, false) : humano(EP.cfg.centg === 'F' ? 0xc0306a : 0x2a5cc0, 0xe7b896, EP.cfg.centg === 'F' ? 0x5a2a12 : 0x2a1a0c, EP.cfg.centg === 'F'); cent.position.y = .5; S.add(cent);
  const plats = [], rivales = [];
  for (let i = 0; i < 10; i++) { const t = -Math.PI / 2 + Math.PI * .1 + i / 10 * 6.28; const x = 7.85 * Math.cos(t), z = 7.85 * Math.sin(t);
    if (!AC) { // sin trampillas: robots de público en la grada (o, en Kara Sevda, solo Nihan y Ozan en atriles)
      let ch = null; plats.push(null);
      if (KS) { if (i < 2) { ch = i === 0 ? humano(0xeeeeff, 0xe7c0a0, 0x3a2414, true) : humano(0x222222, 0xd8a888, 0x111111, false); const px = i === 0 ? -3.4 : 3.4; const at = new THREE.Mesh(new THREE.BoxGeometry(1.6, 1.1, .9), M(0x1b1e3e, 0xff2bd6, { emissiveIntensity: .35 })); at.position.set(px, .55, 1.6); S.add(at); ch.position.set(px, 0, .8); ch.lookAt(px * .3, 0, 12); S.add(ch); } }
      else { const isF = F === 'caz' && i < 2, isC = F === 'cyl' && i === 0; ch = robot([0xb8c2d8, 0xd65a2a, 0, 0x6a7a96, 0, 0xf2d24a, 0, 0xe8e8f0, 0, 0xff8ad8][i], EP.robots[i] && EP.robots[i][2] === 'holo' && !isF && !isC, i);
        if (isF) { ch.position.set(i === 0 ? -2.4 : 2.4, 0, 8); ch.lookAt(i === 0 ? -2.4 : 2.4, 0, -9); } else if (isC) { ch.position.set(4.2, 0, 3.2); ch.lookAt(1, 0, 12); } else { const a2 = Math.PI * .2 + i / 10 * Math.PI * 1.6 + Math.PI; ch.position.set(13.5 * Math.cos(a2), 0, 13.5 * Math.sin(a2)); ch.scale.setScalar(.8); ch.lookAt(0, 0, 0); } S.add(ch); }
      rivales.push(ch); continue; }
    const p = new THREE.Group(); p.position.set(x, 0, z); const tapa = new THREE.Mesh(new THREE.CylinderGeometry(1.05, 1.05, .3, 32), M(0x22264a, 0x29e6ff, { emissiveIntensity: .2 })); tapa.position.y = .15; p.add(tapa);
    const borde = new THREE.Mesh(new THREE.TorusGeometry(1.08, .05, 6, 40), NEON(0x29e6ff)); borde.rotation.x = Math.PI / 2; borde.position.y = .32; p.add(borde); const hueco = new THREE.Mesh(new THREE.CircleGeometry(1.02, 32), NEON(0x000000)); hueco.rotation.x = -Math.PI / 2; hueco.position.y = .01; p.add(hueco);
    p.userData = { tapa, borde, ang: t }; S.add(p); plats.push(p);
    let ch = null; const RB = EP.robots[i];
    if (KS) { if (i === 0) ch = humano(0xeeeeff, 0xe7c0a0, 0x3a2414, true); else if (i === 1) ch = humano(0x222222, 0xd8a888, 0x111111, false); }
    else ch = robot([0xb8c2d8, 0xd65a2a, 0, 0x6a7a96, 0, 0xf2d24a, 0, 0xe8e8f0, 0, 0xff8ad8][i], RB && RB[2] === 'holo', i);
    if (ch) { ch.position.set(x, .3, z); ch.lookAt(0, .3, 0); S.add(ch); } rivales.push(ch);
  }
  if (false) for (let i = 2; i < 10; i++) { const fl = new THREE.Mesh(new THREE.ConeGeometry(.5, 1.6, 16, 1, true), new THREE.MeshBasicMaterial({ color: 0xff2bd6, transparent: true, opacity: .4, blending: THREE.AdditiveBlending, depthWrite: false })); fl.position.copy(plats[i].position).setY(1.1); S.add(fl); }
  const atril = new THREE.Mesh(new THREE.CylinderGeometry(.6, .9, 1.4, 6), M(0x1b1e3e, 0xff2bd6, { emissiveIntensity: .3 })); atril.position.set(-11, .7, 4); S.add(atril);
  const host = KS ? humano(0x3a3a3a, 0xcf9e80, 0x8a8a8a, false) : humano(0x111133, 0xe2b090, 0x2a1a0c, false); host.position.set(-11, 0, 5.4); host.lookAt(0, 0, 0); S.add(host);
  const bip = KS ? null : robot(0x29e6ff, false, 1); if (bip) { bip.scale.setScalar(.75); bip.position.set(-9, 1.2, 6.6); bip.lookAt(0, 1, 0); S.add(bip); }
  let chaser = null; const marcas = {}; const escalones = [];
  if (F === 'mill') { // asiento caliente: dos sillones enfrentados en el centro, escalera de premios holográfica
    atril.visible = false; for (const sx of [-1.5, 1.5]) { const sil = new THREE.Group(); const as = new THREE.Mesh(new THREE.BoxGeometry(1.1, .25, 1.1), M(0x20244a, 0x9a5bff, { emissiveIntensity: .4 })); as.position.y = 1.1; const re = new THREE.Mesh(new THREE.BoxGeometry(.2, 1.4, 1.1), M(0x20244a, 0x29e6ff, { emissiveIntensity: .3 })); re.position.set(sx > 0 ? .55 : -.55, 1.8, 0); const pi = new THREE.Mesh(new THREE.CylinderGeometry(.08, .3, 1, 10), M(0xc0c8e0)); pi.position.y = .5; sil.add(as, re, pi); sil.position.set(sx * 1.1, 0, 0); S.add(sil); }
    centro.scale.set(2, 1, 2); cent.position.set(1.7, .95, 0); cent.lookAt(-5, .95, 0); host.position.set(-1.7, .95, 0); host.lookAt(5, .95, 0); if (bip) bip.position.set(-6, 1.4, 5);
    for (let k = 0; k < 15; k++) { const e = new THREE.Mesh(new THREE.BoxGeometry(3.4, .32, .05), new THREE.MeshBasicMaterial({ color: k === 4 || k === 9 || k === 14 ? 0xffd23a : 0x29e6ff, transparent: true, opacity: .35 })); e.position.set(10, 1 + k * .45, -6); e.lookAt(0, 1 + k * .45, 4); S.add(e); escalones.push(e); } }
  if (F === 'caz') { // cabina del cazador, mesa del equipo y tablero-escalera en el suelo
    const cab = new THREE.Mesh(new THREE.CylinderGeometry(2, 2.4, 3, 8), M(0x2a0a12, 0xff2040, { emissiveIntensity: .35 })); cab.position.set(0, 1.5, -10); S.add(cab);
    chaser = robot(0x8a1020, false, 0); chaser.scale.setScalar(1.35); chaser.position.set(0, 3, -10); chaser.lookAt(0, 3, 8); S.add(chaser);
    const mesa = new THREE.Mesh(new THREE.BoxGeometry(8, 1, 1.2), M(0x10183a, 0x29e6ff, { emissiveIntensity: .35 })); mesa.position.set(0, .5, 6.9); S.add(mesa);
    centro.visible = false; cent.position.set(0, 0, 8); cent.lookAt(0, 0, -9); atril.position.set(-8, .7, 2); host.position.set(-8, 0, 3.2); host.lookAt(0, 0, 0); if (bip) bip.position.set(7, 1.4, 4);
    for (let k = 0; k < 8; k++) { const e = new THREE.Mesh(new THREE.BoxGeometry(3.2, .08, 1.1), new THREE.MeshBasicMaterial({ color: k === 7 ? 0x7cff6a : 0x29e6ff, transparent: true, opacity: .45 })); e.position.set(0, .06, -7 + k * 1.55); S.add(e); escalones.push(e); }
    marcas.j = new THREE.Mesh(new THREE.CylinderGeometry(.5, .5, .3, 24), NEON(0x29e6ff)); marcas.c = new THREE.Mesh(new THREE.CylinderGeometry(.55, .55, .32, 24), NEON(0xff2040)); marcas.j.visible = marcas.c.visible = false; S.add(marcas.j, marcas.c); }
  if (F === 'cyl') { // dos mesas frente al panel de letras y cifras
    centro.visible = false; for (const sx of [-4.2, 4.2]) { const m = new THREE.Mesh(new THREE.BoxGeometry(2.4, 1.1, 1), M(0x0f2a4a, 0x3ad0ff, { emissiveIntensity: .35 })); m.position.set(sx, .55, 4.2); S.add(m); }
    cent.position.set(-4.2, 0, 3.2); cent.lookAt(-1, 0, 12); host.position.set(0, 0, 1); host.lookAt(0, 0, 12); atril.position.set(0, .7, 2.1); if (bip) bip.position.set(7.5, 1.4, 2); pant.position.set(0, 6, -9); pant.scale.setScalar(1.2); }
  if (KS) { cent.position.set(0, .5, 0); cent.lookAt(0, .5, 12); }
  if (bip) bip.lookAt(0, bip.position.y, 0);
  const moneda = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.2, .14, 48), new THREE.MeshBasicMaterial({ color: 0xffd23a, transparent: true, opacity: .8, blending: THREE.AdditiveBlending })); moneda.position.set(0, 5, 0); moneda.visible = false; S.add(moneda);
  const conf = new THREE.Points(new THREE.BufferGeometry().setAttribute('position', new THREE.BufferAttribute(new Float32Array(900), 3)), new THREE.PointsMaterial({ size: .25, color: 0xffd23a, transparent: true, opacity: 0 })); S.add(conf);
  // --- quién es quién ---
  const PJ = w => { if (KS) return { kemal: cent, nihan: rivales[0], ozan: rivales[1], onder: host }[w] || null; if (w === 'host') return host; if (w === 'cent') return cent; if (w === 'bip') return bip; if (w === 'chaser') return chaser; if (/^r\d$/.test(w)) return rivales[+w[1]]; return null; };
  const NOM = w => { if (KS) return { kemal: 'Kemal', nihan: 'Nihan', ozan: 'Ozan', onder: 'Önder', narr: 'Narrador', r0: 'Nihan', r1: 'Ozan' }[w] || ''; return { host: EP.cfg.host, cent: EP.cfg.cent, bip: 'Bip 3000', chaser: 'El Cazatrón', narr: TL('Voce dell\'anno 3000', 'Voz del año 3000'), dire: TL('Regia', 'Dirección') }[w] || (EP.robots[+String(w).slice(1)] || [''])[0]; };
  const frente = (o, d, h = 2.4, lado = .35) => { const f = new THREE.Vector3(0, 0, 1).applyQuaternion(o.quaternion).setY(0).normalize(); const l = new THREE.Vector3(f.z, 0, -f.x); const pos = o.position.clone().add(f.multiplyScalar(d)).add(l.multiplyScalar(d * lado)); pos.y = o.position.y + h + .4; return [o, pos, h]; };
  const CAMS = { grua: null, host: () => F === 'mill' ? [host, new THREE.Vector3(-5.5, 3.6, 5.5), 2.2] : frente(host, 4.2), cent: () => F === 'mill' ? [cent, new THREE.Vector3(5.5, 3.6, 5.5), 2.2] : frente(cent, 4.0, 2.3), bip: () => frente(bip || host, 3.6, 2.4 * (bip ? .75 : 1)), jugador: () => null, chaser: () => frente(chaser || host, 5, 2.8 * (chaser ? 1.35 : 1), .2), equipo: () => [cent, new THREE.Vector3(5, 4, 14), 1.8], tablero: () => [escalones[4] || cent, new THREE.Vector3(9, 8, 6), 0], letras: () => [pant, new THREE.Vector3(0, 4, 8), 0], cifras: () => [pant, new THREE.Vector3(0, 4, 8), 0], aro: () => [cent, new THREE.Vector3(0, 15, 15), 1], moneda: () => [moneda, new THREE.Vector3(0, 6, 9), 0], final: () => [cent, new THREE.Vector3(-3, 4, 7.5), 2] };
  // --- audio: música sintetizada futurista + efectos + voces ---
  const ac = new (window.AudioContext || window.webkitAudioContext)(); const master = ac.createGain(); master.gain.value = .9; master.connect(ac.destination);
  const musG = ac.createGain(); musG.gain.value = .12; musG.connect(master); let musOn = true;
  const nota = (f, t, d, tipo = 'sawtooth', v = .3, dest = musG) => { const o = ac.createOscillator(), g = ac.createGain(), fl = ac.createBiquadFilter(); fl.type = 'lowpass'; fl.frequency.value = 1800; o.type = tipo; o.frequency.value = f; g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(v, t + .02); g.gain.exponentialRampToValueAtTime(.001, t + d); o.connect(fl); fl.connect(g); g.connect(dest); o.start(t); o.stop(t + d + .05); };
  let compas = 0, musT = 0; const PROG = [[220, 261.6, 329.6], [196, 246.9, 293.7], [174.6, 220, 261.6], [196, 246.9, 329.6]];
  function musica() { if (!abierto) return; const t0 = Math.max(ac.currentTime + .05, musT); const ch = PROG[compas++ % 4]; if (musOn) { for (let k = 0; k < 8; k++) nota(ch[k % 3] * (k > 3 ? 2 : 1), t0 + k * .22, .2, 'square', .12); nota(ch[0] / 2, t0, 1.7, 'sawtooth', .25); }
    musT = t0 + 1.76; setTimeout(musica, Math.max(50, (musT - ac.currentTime - .3) * 1000)); }
  const sfx = { bien: () => { const t = ac.currentTime; nota(880, t, .25, 'sine', .4, master); nota(1320, t + .1, .35, 'sine', .35, master); }, mal: () => { const t = ac.currentTime; nota(140, t, .6, 'sawtooth', .45, master); nota(110, t + .05, .6, 'square', .3, master); },
    cae: () => { const t = ac.currentTime, o = ac.createOscillator(), g = ac.createGain(); o.frequency.setValueAtTime(900, t); o.frequency.exponentialRampToValueAtTime(60, t + 1.4); g.gain.setValueAtTime(.35, t); g.gain.exponentialRampToValueAtTime(.001, t + 1.5); o.connect(g); g.connect(master); o.start(t); o.stop(t + 1.6); },
    aplauso: () => { const n = ac.sampleRate * 2.2, b = ac.createBuffer(1, n, ac.sampleRate), d = b.getChannelData(0); for (let i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * (Math.random() < .3 ? 1 : .2) * Math.min(1, (n - i) / n * 2); const s = ac.createBufferSource(), f = ac.createBiquadFilter(), g = ac.createGain(); f.type = 'bandpass'; f.frequency.value = 2500; g.gain.value = .5; s.buffer = b; s.connect(f); f.connect(g); g.connect(master); s.start(); },
    tic: () => nota(1200, ac.currentTime, .05, 'square', .15, master) };
  const an = ac.createAnalyser(); an.fftSize = 256; an.connect(master); const anD = new Uint8Array(128); let hablando = null, fuente = null;
  const cacheV = {}; const carga = k => cacheV[k] || (cacheV[k] = fetch(VOZ + k + '.mp3').then(r => { if (!r.ok) throw 0; return r.arrayBuffer(); }).then(b => ac.decodeAudioData(b)).catch(() => null));
  // --- HUD ---
  const hud = $('div', 'position:absolute;inset:0;pointer-events:none');
  const sub = $('div', 'position:absolute;left:50%;bottom:4%;transform:translateX(-50%);max-width:88%;background:#000b;border-left:5px solid ' + C + ';border-radius:10px;padding:8px 14px;font:600 clamp(14px,2.4vw,24px) system-ui;text-shadow:0 1px 3px #000;display:none');
  const tablero = $('div', 'position:absolute;left:50%;top:5%;transform:translateX(-50%);width:min(860px,92%);display:none;text-align:center');
  const preg = $('div', `background:linear-gradient(${C2}ee,#05081aee);border:3px solid #29e6ff;border-radius:16px;padding:10px 16px;font:800 clamp(15px,2.6vw,28px) system-ui;box-shadow:0 0 30px #29e6ff88`);
  const fichas = $('div', 'display:flex;flex-wrap:wrap;justify-content:center;gap:4px;margin-top:8px');
  const relojes = $('div', 'display:flex;justify-content:space-between;margin-top:8px;font:900 clamp(16px,3vw,30px) system-ui');
  tablero.append(preg, fichas, relojes);
  const bote = $('div', `position:absolute;right:2%;top:3%;background:#000a;border:2px solid ${C};border-radius:12px;padding:6px 12px;font:900 clamp(13px,2.2vw,22px) system-ui;color:${C};display:none`);
  const rot = $('div', 'position:absolute;left:3%;top:4%;font:900 clamp(16px,3vw,34px) system-ui;color:#29e6ff;text-shadow:0 0 16px #29e6ff;letter-spacing:2px');
  const barra = $('div', 'position:absolute;right:1.5%;bottom:1.5%;display:flex;gap:6px;pointer-events:auto');
  const bt = (t, fn) => { const b = $('button', `padding:8px 12px;border-radius:10px;border:2px solid ${C};background:#000a;color:#fff;font:bold 14px system-ui;cursor:pointer`, t); b.onclick = e => { e.stopPropagation(); fn(b); }; return b; };
  let pausa = false, saltar = false, fin = false;
  barra.append(bt('⏸', b => { pausa = !pausa; b.innerHTML = pausa ? '▶' : '⏸'; pausa ? ac.suspend() : ac.resume(); }), bt(TL('⏭ Salta', '⏭ Saltar'), () => { saltar = true; try { fuente && fuente.stop(); } catch (e) { } }), bt('🎵', () => { musOn = !musOn; }), bt(TL('✕ Esci', '✕ Salir'), () => cerrar()));
  const lado = $('div', 'position:absolute;right:1.5%;top:12%;width:min(240px,30vw);display:none;font:800 clamp(10px,1.5vw,15px) system-ui');
  const ops = $('div', 'display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-top:8px'); tablero.appendChild(ops);
  const fila = (t, col, bg) => $('div', `padding:3px 8px;margin:2px 0;border-radius:14px;border:2px solid ${col};background:${bg || '#000a'};color:#fff;text-align:center`, t);
  const ESCM = [100, 200, 300, 500, 1000, 2000, 4000, 8000, 16000, 32000, 64000, 125000, 250000, 500000, 1000000];
  function escalera(n) { lado.style.display = ''; lado.innerHTML = ''; for (let k = 14; k >= 0; k--) lado.appendChild(fila((k + 1) + ' · ' + ESCM[k].toLocaleString(IT ? 'it-IT' : 'es-ES'), k === 4 || k === 9 || k === 14 ? C : '#29e6ff', k === n ? 'linear-gradient(#ffb020,#c06000)' : k < n ? '#0a3a2a' : '')); escalones.forEach((e, k) => e.material.opacity = k === n ? .95 : k < n ? .6 : .25); }
  function tableroCaz(pj, pc) { lado.style.display = ''; lado.innerHTML = `<div style="text-align:center;color:#ff4060;margin-bottom:4px">🤖 EL CAZATRÓN</div>`; for (let k = 0; k < 8; k++) { const t = k === pc && k === pj ? '⚡ ¡CAZADO!' : k === pc ? '🤖 Cazatrón' : k === pj ? '🧑 ' + NOM(lastJ) : k === 7 ? '🏠 CASA' : ''; lado.appendChild(fila(t || '&nbsp;', k === 7 ? '#7cff6a' : '#29e6ff', k === pc ? '#a01030' : k === pj ? '#1050c0' : '')); }
    const zz = k => -7 + k * 1.55; if (marcas.j) { marcas.j.visible = marcas.c.visible = true; marcas.j.position.set(0, .2, zz(Math.min(pj, 7))); marcas.c.position.set(0, .22, zz(Math.max(0, pc))); } }
  let lastJ = 'cent';
  const opciones = (L, ok) => { ops.innerHTML = ''; (L || []).forEach((o, i) => { const d = $('div', `padding:6px 10px;border-radius:20px;border:2px solid #29e6ff;background:#071a3a;font:700 clamp(12px,1.9vw,19px) system-ui;text-align:left`, `<b style="color:${C}">${'ABCD'[i]}:</b> ${o}`); d.dataset.l = 'ABCD'[i]; ops.appendChild(d); }); };
  const marca = (l, col) => [...ops.children].forEach(d => { if (d.dataset.l === l) d.style.background = col; });
  const fichasTxt = (L, col) => { fichas.innerHTML = ''; for (const ch of L) fichas.appendChild($('div', `min-width:30px;height:40px;line-height:40px;padding:0 4px;border-radius:6px;background:${col || '#123'};color:#fff;border:2px solid #29e6ff;font:900 22px system-ui`, ch)); };
  hud.append(lado, rot, bote, tablero, sub, barra); root.appendChild(hud);
  const tiles = (resp, ver) => { fichas.innerHTML = ''; const L = String(resp || '').toUpperCase(); for (const ch of L) { if (ch === ' ') { fichas.appendChild($('div', 'width:14px')); continue; } const v = ver || !/[A-ZÁÉÍÓÚÑÜ0-9]/.test(ch); fichas.appendChild($('div', `min-width:26px;height:36px;line-height:36px;border-radius:6px;background:${v ? C : '#123'};color:${v ? '#111' : '#29e6ff'};border:2px solid #29e6ff;font:900 22px system-ui`, v ? ch : '')); } };
  let tA = 30, tB = 30, tActivo = -1, tFin = 100, modoFinal = false;
  const pintaRel = () => { relojes.innerHTML = modoFinal ? `<span style="margin:auto;color:${C}">⏱ ${Math.ceil(tFin)} s</span>` : `<span style="color:#ff7ad8">${EP.cfg.cent || ''} ${Math.ceil(tA)}</span><span style="color:#29e6ff">${Math.ceil(tB)} ${NOM('r' + rivalAct) || ''}</span>`; };
  let rivalAct = 0;
  // --- cámara ---
  let camObj = null, camPos = new THREE.Vector3(0, 9, 20), mirar = new THREE.Vector3(0, 2, 0), grua = true;
  function plano(c, p) {
    grua = false; const pj = PJ(p.w);
    if (c === 'grua' || !c) { grua = true; return; }
    if (c === 'jugador') c = p.jug === 'cent' || !p.jug ? 'cent' : p.jug; if (CAMS[c]) { const [o, pos, h] = CAMS[c](); camPos.copy(pos); mirar.copy(o.position).setY(o.position.y + h); return; }
    if (c === 'duelo') { const rv = rivales[p.rival != null ? p.rival : rivalAct]; const mid = rv ? rv.position.clone().multiplyScalar(.5) : new THREE.Vector3(); const perp = new THREE.Vector3(-mid.z, 0, mid.x).normalize().multiplyScalar(7.5); camPos.copy(mid).add(perp).setY(4.2); mirar.copy(mid).setY(2); return; }
    const idx = p.idx != null ? p.idx : (/^r\d$/.test(c) ? +c[1] : null); const o = idx != null ? (rivales[idx] || plats[idx]) : pj;
    if (o) { if (c === 'cae') { const d = o.position.clone().setY(0).normalize(); camPos.copy(o.position).sub(d.multiplyScalar(5.5)).setY(5); mirar.copy(o.position).setY(.5); } else { const [, pos, h] = frente(o, 4.2, 2.3); camPos.copy(pos); mirar.copy(o.position).setY(o.position.y + h); } }
  }
  // --- animaciones de los pasos ---
  const cayendo = [];
  function caer(i) { const p = plats[i], ch = rivales[i]; sfx.cae(); p.userData.borde.material = NEON(0xff1010); p.userData.cae = 0; cayendo.push({ p, ch, t: 0 }); }
  let confT = -1;
  function accion(p) {
    const a = p.a; if (p.jug) lastJ = p.jug;
    if (F === 'mill') {
      if (a === 'comodines') { pantalla(['50:50 · PÚBLICO', 'LLAMADA AL PASADO']); escalera(-1); }
      if (a === 'mpregunta') { tablero.style.display = ''; preg.textContent = p.preg; fichas.innerHTML = ''; relojes.innerHTML = ''; opciones(p.ops); escalera(p.nivel); pantalla([TL('Domanda ', 'Pregunta ') + (p.nivel + 1), ESCM[p.nivel].toLocaleString(IT ? 'it-IT' : 'es-ES') + ' ' + EP.cfg.unidad]); }
      if (a === 'comodin' && p.com === '5050') { let n = 0; [...ops.children].forEach(d => { if (d.dataset.l !== p.ok && n < 2) { d.style.visibility = 'hidden'; n++; } }); sfx.tic(); }
      if (a === 'comodin' && p.com === 'publico') { pantalla(['PÚBLICO ROBOT', p.ok + ': 74 %']); sfx.tic(); }
      if (a === 'comodin' && p.com === 'llamada') { pantalla(['LLAMADA AL PASADO', 'Año 2025']); }
      if (a === 'mresp') { marca(p.ok, '#c06000'); sfx.tic(); }
      if (a === 'mbien') { marca(p.ok, '#108a3a'); sfx.bien(); escalera(p.nivel); }
    }
    if (F === 'caz') {
      if (a === 'cash') { tablero.style.display = ''; preg.textContent = 'BANCO DE DINERO · 60 segundos'; fichas.innerHTML = ''; ops.innerHTML = ''; modoFinal = true; tFin = 60; pintaRel(); lado.style.display = 'none'; pantalla(['BANCO DE DINERO', NOM(p.jug)]); }
      if (a === 'cpregunta') { preg.textContent = p.t; ops.innerHTML = ''; }
      if (a === 'cbien') { sfx.bien(); fichasTxt([(p.dinero || 0).toLocaleString(IT ? 'it-IT' : 'es-ES') + ' ' + EP.cfg.unidad], '#0a5a2a'); }
      if (a === 'cpaso') sfx.tic();
      if (a === 'tablero') { modoFinal = false; tablero.style.display = ''; preg.textContent = 'TABLERO · ' + NOM(p.jug) + ' contra el Cazatrón'; fichas.innerHTML = ''; relojes.innerHTML = ''; ops.innerHTML = ''; tableroCaz(p.pj, p.pc); pantalla(['EL TABLERO', NOM(p.jug) + ' vs Cazatrón']); }
      if (a === 'tpregunta') { preg.textContent = p.t; opciones(p.ops); }
      if (a === 'tresp') { sfx.tic(); }
      if (a === 'tmover') { tableroCaz(p.pj, p.pc); sfx.bien(); }
      if (a === 'cazado') { tableroCaz(p.pj, p.pc); sfx.mal(); pantalla(['¡CAZADO!']); }
      if (a === 'casa') { sfx.aplauso(); pantalla(['¡A CASA!', bote.textContent.replace('💰 ', '')]); lado.style.display = 'none'; tablero.style.display = 'none'; }
      if (a === 'cfinal') { tablero.style.display = ''; preg.textContent = 'CAZA FINAL · 2 minutos'; ops.innerHTML = ''; fichas.innerHTML = ''; modoFinal = true; tFin = 120; pintaRel(); pantalla(['CAZA FINAL']); }
      if (a === 'facierta' || a === 'cacierta') { sfx.bien(); fichasTxt(['Equipo: ' + (p.pasos || 0), 'Cazatrón: ' + (p.pc || 0)], '#123'); return; }
      if (a === 'fpregunta') { preg.textContent = p.t; return; }
      if (a === 'cazturno') { tFin = 120; pantalla(['TURNO DEL CAZATRÓN', (p.pasos || 0) + ' pasos']); }
      if (a === 'cfalla') { sfx.mal(); }
      if (a === 'tiempo') { sfx.mal(); fichasTxt(['Equipo: ' + p.pasos, 'Cazatrón: ' + p.pc], '#0a5a2a'); }
    }
    if (F === 'cyl') {
      if (a === 'letras' || a === 'final') { tablero.style.display = ''; preg.textContent = a === 'final' ? 'DUELO FINAL · palabra misteriosa' : 'LETRAS · 30 segundos'; ops.innerHTML = ''; fichasTxt(a === 'final' ? [...p.letras].map(() => '?') : [...p.letras]); modoFinal = true; tFin = 30; pintaRel(); pantalla([a === 'final' ? 'DUELO FINAL' : 'LETRAS', [...(a === 'final' ? '?????????' : p.letras)].join(' ')]); return; }
      if (a === 'pista') { fichasTxt(['H', '?', '?', '?', 'G', '?', '?', '?', 'A']); }
      if (a === 'palabra') { fichasTxt([...p.pal], '#0a5a2a'); sfx.tic(); }
      if (a === 'cifras') { tablero.style.display = ''; preg.textContent = 'CIFRAS · objetivo ' + p.obj; ops.innerHTML = ''; fichasTxt(p.nums.map(String)); modoFinal = true; tFin = 45; pintaRel(); pantalla(['OBJETIVO', String(p.obj)], 90); }
      if (a === 'solucion') { sfx.bien(); }
      if (a === 'puntos') { bote.style.display = ''; bote.textContent = 'Pablo ' + p.pts[0] + ' · ' + p.pts[1] + ' Robotina'; }
      if (a === 'gana') { bote.style.display = ''; bote.textContent = 'Pablo ' + p.pts[0] + ' · ' + p.pts[1] + ' Robotina'; }
    }
    if (a === 'tele') { const ch = rivales[p.idx]; if (ch) { const col = new THREE.Mesh(new THREE.CylinderGeometry(.9, .9, 14, 24, 1, true), new THREE.MeshBasicMaterial({ color: 0x29e6ff, transparent: true, opacity: .5, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide })); col.position.copy(ch.position).setY(7); S.add(col); sfx.cae(); let k = 0; const iv = setInterval(() => { k++; ch.scale.setScalar(Math.max(.01, 1 - k / 20)); ch.position.y += .15; col.material.opacity = .5 * (1 - k / 30); if (k > 30) { clearInterval(iv); ch.visible = false; S.remove(col); } }, 50); } tablero.style.display = 'none'; }
    if (p.rival != null) rivalAct = p.rival;
    if (p.bote != null) { bote.style.display = ''; bote.textContent = '💰 ' + p.bote.toLocaleString(IT ? 'it-IT' : 'es-ES') + ' ' + (EP.cfg.unidad || ''); }
    if (a === 'intro') { rot.textContent = TL('ANNO 3000', 'AÑO 3000'); pantalla([TL('ANNO 3000', 'AÑO 3000'), TL('Benvenuti nel futuro', 'Bienvenidos al futuro')]); }
    if (a === 'logo') { rot.textContent = EP.cfg.show.toUpperCase(); pantalla([EP.cfg.show]); sfx.aplauso(); }
    if (a === 'duelo') { tablero.style.display = ''; preg.textContent = (EP.cfg.ronda || TL('DUELLO', 'DUELO')).toUpperCase() + (p.premio ? ' · ' + p.premio.toLocaleString(IT ? 'it-IT' : 'es-ES') + ' ' + EP.cfg.unidad : ''); tiles(''); tA = tB = 30; modoFinal = false; pintaRel(); pantalla([EP.cfg.cent + TL(' contro', ' contra'), NOM('r' + rivalAct)]); }
    if (a === 'pregunta' || a === 'fpregunta') { tablero.style.display = ''; preg.textContent = p.t; tiles(p.resp, false); tActivo = p.turno != null ? p.turno : 0; if (a === 'fpregunta') { modoFinal = true; pantalla([F === 'caz' ? 'CAZA FINAL' : TL('GIOCO FINALE', 'JUEGO FINAL'), TL('Domanda ', 'Pregunta ') + p.n]); } }
    if (a === 'acierta' || a === 'facierta') { const L = preg.textContent; tiles(p.t.replace(/\.$/, ''), true); sfx.bien(); tActivo = -1; }
    if (a === 'falla' || a === 'error') { sfx.mal(); tActivo = -1; }
    if (a === 'cae') { caer(p.idx); tablero.style.display = 'none'; }
    if (a === 'paso') { sfx.tic(); }
    if (a === 'aplausos' || a === 'gana' || a === 'celebra') { sfx.aplauso(); tablero.style.display = 'none'; }
    if (a === 'moneda' || a === 'moneda_gira') { moneda.visible = true; moneda.userData.gira = true; }
    if (a === 'moneda_cara') { moneda.userData.gira = false; moneda.rotation.set(Math.PI / 2, 0, 0); pantalla([TL('TESTA!', '¡CARA!'), TL('MONTEPREMI x2', 'BOTE x2')]); sfx.bien(); }
    if (a === 'decide') { moneda.visible = false; }
    if (a === 'final') { tablero.style.display = ''; preg.textContent = TL('GIOCO FINALE · 10 domande · 100 secondi', 'JUEGO FINAL · 10 preguntas · 100 segundos'); tiles(''); modoFinal = true; tFin = 100; pintaRel(); pantalla([TL('GIOCO FINALE', 'JUEGO FINAL'), TL('100 secondi', '100 segundos')]); }
    if (a === 'gana' || a === 'confeti') { confT = 0; conf.material.opacity = 1; lado.style.display = 'none'; tablero.style.display = 'none'; pantalla([TL('HA VINTO!', '¡HA GANADO!'), bote.textContent.replace('💰 ', '')]); }
    if (a === 'anuncio') { pantalla([TL('PUBBLICITÀ', 'PUBLICIDAD'), TL('Robot aspirapolvere cantastorie', 'Robot aspiradora cuentacuentos')]); }
    if (a === 'corten') { pantalla([TL('STOP!', '¡CORTEN!'), TL('PAPERA', 'TOMA FALSA')]); rot.textContent = TL('🎬 PAPERE', '🎬 TOMAS FALSAS'); }
  }
  // --- bucle ---
  const clk = new THREE.Clock(); let T = 0;
  function bucle() {
    if (!abierto) return; requestAnimationFrame(bucle); const dt = Math.min(.05, clk.getDelta()); if (pausa) { R.render(S, cam); return; } T += dt;
    focos.forEach(f => { f.rotation.x = Math.sin(T * .7 + f.userData.f) * .5; f.rotation.z = Math.cos(T * .5 + f.userData.f * 1.3) * .5; });
    flot.forEach((a, i) => { a.rotation.z = T * (.1 + i * .05); a.position.y = 9 + i * 1.6 + Math.sin(T + i) * .3; });
    aros[0].material.color.setHSL((T * .05) % 1, 1, .55);
    naves.forEach(n => { const u = n.userData, a = T * u.v + u.f; n.position.set(u.r * Math.cos(a), u.h + Math.sin(T + u.f) * 2, u.r * Math.sin(a)); n.rotation.y = -a; });
    an.getByteFrequencyData(anD); let amp = 0; for (let i = 2; i < 40; i++) amp += anD[i]; amp /= 38 * 255;
    [cent, host, bip, ...rivales].forEach((c, i) => { if (!c) return; const hab = c === hablando; c.userData.cab.position.y = (c.userData.cab.position.y * .7) + .3 * (2.45 + (hab ? amp * .25 : 0) + Math.sin(T * 2 + i) * .02); if (c.userData.holo) c.userData.mat.opacity = .35 + Math.random() * .15 + Math.sin(T * 9 + i) * .05; });
    if (bip && !cayendo.some(x => x.ch === bip)) bip.position.y = 1.2 + Math.sin(T * 1.7) * .25;
    for (const x of cayendo) { x.t += dt; const k = Math.min(1, x.t / .5); x.p.userData.tapa.rotation.x = k * 1.9; x.p.userData.tapa.position.z = k * .6; if (x.ch && x.t > .3) { x.ch.position.y -= dt * (x.t * 14); x.ch.rotation.z += dt * 3; if (x.ch.position.y < -12) x.ch.visible = false; } }
    if (moneda.visible && moneda.userData.gira) { moneda.rotation.x += dt * 9; moneda.position.y = 5 + Math.sin(T * 2) * .4; }
    if (confT >= 0) { confT += dt; const a = conf.geometry.attributes.position; for (let i = 0; i < 300; i++) { const s = i * 7.3; a.setXYZ(i, Math.sin(s) * 9 * (.3 + (i % 10) / 10), 14 - ((confT * (2 + i % 5) + s) % 14), Math.cos(s * 1.7) * 9 * (.3 + (i % 7) / 7)); } a.needsUpdate = true; conf.material.color.setHSL((T * .3) % 1, 1, .6); }
    if (tActivo >= 0 && !modoFinal) { if (tActivo === 0) tA = Math.max(0, tA - dt * .5); else tB = Math.max(0, tB - dt * .5); pintaRel(); } if (modoFinal && tFin > 0 && tablero.style.display !== 'none') { tFin = Math.max(0, tFin - dt * .6); pintaRel(); }
    if (grua) { const a = T * .08; camPos.set(19 * Math.cos(a), 8 + Math.sin(T * .2) * 2, 19 * Math.sin(a)); mirar.set(0, 2, 0); }
    cam.position.lerp(camPos, grua ? .05 : .12); const m = cam.userData.m || (cam.userData.m = mirar.clone()); m.lerp(mirar, .15); cam.lookAt(m);
    R.render(S, cam);
  }
  const espera = ms => new Promise(r => { const t0 = performance.now(); const f = () => { if (fin || saltar) return r(); if (pausa) return setTimeout(f, 100); if (performance.now() - t0 >= ms) return r(); setTimeout(f, 50); }; f(); });
  async function di(p, k) {
    sub.style.display = ''; sub.innerHTML = `<b style="color:${C}">${NOM(p.w)}:</b> ${p.t.replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]))}`;
    hablando = PJ(p.w); const b = k ? await carga(k) : null; if (fin) return;
    if (b && !saltar) { fuente = ac.createBufferSource(); fuente.buffer = b; fuente.connect(an); musG.gain.setTargetAtTime(.05, ac.currentTime, .1); const ok = new Promise(r => fuente.onended = r); fuente.start(); await ok; musG.gain.setTargetAtTime(.12, ac.currentTime, .3); }
    else await espera(800 + p.t.length * 55);
    hablando = null; if (!saltar) await espera(p.a === 'cae' ? 1500 : 260); saltar = false;
  }
  async function correr() {
    const P = EP.pasos, K = EP.voz;
    for (let i = 0; i < desde && i < P.length; i++) { plano(P[i].c, P[i]); accion(P[i]); }
    for (let i = desde; i < P.length && !fin; i++) { for (let j = 1; j <= 3 && i + j < P.length; j++) carga(K[i + j]); const p = P[i]; plano(p.c, p); accion(p); await di(p, K[i]); while (pausa && !fin) await new Promise(r => setTimeout(r, 120)); }
    if (fin) return; sub.innerHTML = TL('<b>Fine della puntata.</b> ', '<b>Fin del episodio.</b> ') + EP.cfg.show; barra.prepend(bt(TL('↻ Rivedi', '↻ Ver otra vez'), () => { cerrar(); setTimeout(() => abrir(alSalir), 50); }));
  }
  function cerrar() { if (fin) return; fin = true; abierto = false; try { fuente && fuente.stop(); } catch (e) { } try { ac.close(); } catch (e) { } removeEventListener('resize', onR); R.dispose(); root.remove(); alSalir && alSalir(); }
  window.__ep3000 = { estado: () => ({ T, grua }) };
  ac.resume(); bucle(); musica(); correr();
}
window.Ep3000 = { titulo: '🤖 ' + EP.cfg.show + TL(' · puntata completa', ' · episodio completo'), sub: TL('Studio futuristico con robot e ologrammi: 10 sfidanti, duelli con le botole, moneta e gioco finale', 'Plató futurista con robots y hologramas: presentación, duelos con trampillas, moneda y juego final'), abrir };
