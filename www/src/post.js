
// ===================================================================================================
// Plató de Antena 3 (2011-2017) y su versión oscura (2017-2021), copiado de las fotos del programa:
// tarima central con trampilla, anillo de 10 trampillas con aros rojos/naranjas y pedestales en forma
// de copa, barandilla metálica, gradas en círculo, gran techo circular blanco y pantallas (logo y premios).
// La etapa 2021-actual usa el «Plató virtual» del APK (morado, tarima blanca), igual que en las fotos.
// ===================================================================================================
let A3VAR = '2011'; // '2011' | '2015' | '2017'
const A3 = { angulos: [18, 54, 90, 126, 162].map(d => d * Math.PI / 180), RH: 5.55, RT: 0.62 };
function texPuerta(col1 = '#ff6a1a', col2 = '#ffc21a', oscuro = false) {
  return Vt(256, 256, (g, s) => {
    const n = s / 2; const gr = g.createRadialGradient(n, n * 0.8, 10, n, n, n); gr.addColorStop(0, oscuro ? '#2a2a34' : '#5a3a30'); gr.addColorStop(1, oscuro ? '#0a0a10' : '#1e1210'); g.fillStyle = gr; g.fillRect(0, 0, s, s);
    g.strokeStyle = 'rgba(0,0,0,.6)'; g.lineWidth = 3; g.beginPath(); g.moveTo(n, 0); g.lineTo(n, s); g.stroke();
    g.fillStyle = col2; g.shadowColor = col1; g.shadowBlur = 12;
    for (const dx of [-0.2, 0.2]) { g.beginPath(); g.ellipse(n + dx * s, n - s * 0.08, s * 0.075, s * 0.15, dx < 0 ? -0.1 : 0.1, 0, 7); g.fill(); g.beginPath(); g.arc(n + dx * s * 1.05, n + s * 0.2, s * 0.06, 0, 7); g.fill(); }
  });
}
function texPremios() { // pantalla de premios de 2011-2017 (fondo verde, pastillas amarillas)
  return Vt(512, 640, (g, w, h) => {
    const gr = g.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, '#15c27a'); gr.addColorStop(1, '#0a7a4a'); g.fillStyle = gr; g.fillRect(0, 0, w, h);
    g.strokeStyle = '#ffd23a'; g.lineWidth = 10; g.strokeRect(8, 8, w - 16, h - 16);
    const vals = [['5.000 €', '4.000 €'], ['3.000 €', '2.500 €'], ['2.000 €', '1.500 €'], ['1.000 €', '500 €'], ['250 €', '100 €'], ['50 €', '1 €']];
    vals.forEach((f, i) => f.forEach((t, j) => { const x = 36 + j * 228, y = 40 + i * 78, ww = 212, hh = 62; g.beginPath(); g.roundRect ? g.roundRect(x, y, ww, hh, 31) : g.rect(x, y, ww, hh); const pg = g.createLinearGradient(0, y, 0, y + hh); pg.addColorStop(0, '#fff6a8'); pg.addColorStop(0.5, '#ffcc1a'); pg.addColorStop(1, '#b07a00'); g.fillStyle = pg; g.fill(); g.lineWidth = 3; g.strokeStyle = '#4a3000'; g.stroke(); g.fillStyle = '#1a1000'; g.font = '900 38px Arial'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(t, x + ww / 2, y + hh / 2 + 2); }));
    g.fillStyle = '#0a2a1a'; g.beginPath(); g.roundRect ? g.roundRect(150, 530, 212, 80, 18) : g.rect(150, 530, 212, 80); g.fill(); g.fillStyle = '#ffd23a'; g.font = '900 54px Arial'; g.textAlign = 'center'; g.fillText('0 €', 256, 572);
  });
}
function texLogoPantalla(s) { // el logo del APK dibujado en la pantalla del plató
  const c = document.createElement('canvas'); c.width = 640; c.height = 430; const g = c.getContext('2d');
  const T = g.createLinearGradient(0, 0, 0, 430); T.addColorStop(0, '#1b52e6'); T.addColorStop(1, '#0a1a7a'); g.fillStyle = T; g.fillRect(0, 0, 640, 430);
  for (let i = 0; i < 6; i++) { g.strokeStyle = `rgba(255,255,255,${0.05 + i * 0.02})`; g.lineWidth = 6; g.beginPath(); g.ellipse(320, 330, 120 + i * 50, 30 + i * 12, 0, 0, 7); g.stroke(); }
  g.save(); g.translate(80, 0); pv(g, 480, 430, { variant: s.id }); g.restore();
  const W = new Wo(c); W.colorSpace = ln; return W;
}
function texPared(osc, map) { return new _E.MeshLambertMaterial({ side: _E.BackSide, color: 0x000000, emissive: 0xffffff, emissiveMap: map, emissiveIntensity: 1 }); }
function sector(r0, r1, a0, a1, y0, y1, mat) { // bloque con forma de corona circular (gradas)
  const T = _E, sh = new T.Shape(), n = Math.max(8, Math.ceil((a1 - a0) / 0.05));
  for (let i = 0; i <= n; i++) { const a = a0 + (a1 - a0) * i / n; i ? sh.lineTo(Math.sin(a) * r1, -Math.cos(a) * r1) : sh.moveTo(Math.sin(a) * r1, -Math.cos(a) * r1); }
  for (let i = n; i >= 0; i--) { const a = a0 + (a1 - a0) * i / n; sh.lineTo(Math.sin(a) * r0, -Math.cos(a) * r0); }
  const g = new T.ExtrudeGeometry(sh, { depth: y1 - y0, bevelEnabled: false, curveSegments: 1 }); g.rotateX(-Math.PI / 2);
  const m = new T.Mesh(g, mat); m.position.y = y0; return m;
}
function estudioA3(em, s, movil) {
  const T = _E, R = em.root, osc = A3VAR === '2017';
  const lam = (c, e = 0, o = {}) => new T.MeshLambertMaterial({ color: c, emissive: e, ...o });
  const bas = (c, o = {}) => new T.MeshBasicMaterial({ color: c, ...o });
  const add = (m, x = 0, y = 0, z = 0) => { m.position.set(x, y, z); R.add(m); return m; };
  const glowMat = (c, op = 0.9) => new T.MeshBasicMaterial({ color: c, transparent: true, opacity: op, blending: T.AdditiveBlending, depthWrite: false, side: T.DoubleSide });
  const anillo = (r0, r1, y, mat, seg = 96, a0 = 0, al = Math.PI * 2) => { const m = new T.Mesh(new T.RingGeometry(r0, r1, seg, 1, a0, al), mat); m.rotation.x = -Math.PI / 2; m.position.y = y; R.add(m); return m; };
  const NAR = osc ? 0xff1a2a : 0xff5a10, AMA = osc ? 0xff3040 : 0xffa020;
  const sTheme = { ...s, glow: osc ? 0xff2030 : (s.id === 'normal' ? 0xff6a1a : s.glow) };
  // luz base
  R.add(new T.HemisphereLight(osc ? 0x9a9ab8 : 0xfff4ea, 0x302018, osc ? 0.7 : 1.25));
  for (const [x, z, c] of [[0, 0, osc ? 0xff2040 : 0xfff0e0], [5, 4, osc ? 0xff2040 : 0xffe0c8], [-5, 4, osc ? 0xff2040 : 0xffe0c8], [5, -4, 0xffffff], [-5, -4, 0xffffff]]) { const pl = new T.PointLight(c, osc ? 14 : 11, 14, 1.6); pl.position.set(x, 4.5, z); R.add(pl); }
  const dl = new T.DirectionalLight(0xffffff, osc ? 0.6 : 1.0); dl.position.set(3, 12, 6); R.add(dl);
  // suelo general (negro brillante; en la versión oscura, con líneas LED de colores)
  const suelo = new T.Mesh(new T.CircleGeometry(26, 72), new T.MeshPhongMaterial({ color: osc ? 0x030306 : 0x0a080a, specular: 0x333344, shininess: 60, map: Vt(1024, 1024, (g, w) => {
    g.fillStyle = osc ? '#020205' : '#0c0a0c'; g.fillRect(0, 0, w, w);
    if (osc) { const cols = ['#ffffff', '#ff3a5a', '#ffffff', '#c8d8ff', '#ffffff', '#ff8aa0']; for (let i = 0; i < 160; i++) { const a = i / 160 * Math.PI * 2; g.strokeStyle = cols[i % cols.length]; g.globalAlpha = 0.8; g.lineWidth = 2.5; g.beginPath(); g.moveTo(w / 2 + Math.sin(a) * w * 0.148, w / 2 + Math.cos(a) * w * 0.148); g.lineTo(w / 2 + Math.sin(a) * w * 0.235, w / 2 + Math.cos(a) * w * 0.235); g.stroke(); } g.globalAlpha = 1; }
    else { g.strokeStyle = 'rgba(255,120,40,.10)'; g.lineWidth = 2; for (let r = 40; r < w / 2; r += 34) { g.beginPath(); g.arc(w / 2, w / 2, r, 0, 7); g.stroke(); } }
  }) })); suelo.rotation.x = -Math.PI / 2; suelo.name = 'suelo'; R.add(suelo);
  // anillo de juego (plataforma baja) con borde iluminado
  const plat = new T.Mesh(new T.CylinderGeometry(gn, gn + 0.05, Ht, 120), [lam(osc ? 0x0a0a10 : 0x3a2622, osc ? 0x080008 : 0x2a0c06), new T.MeshPhongMaterial({ color: osc ? 0xffffff : 0xa89c88, specular: 0x554444, shininess: 70, map: Vt(1024, 1024, (g, w) => { const gg = g.createRadialGradient(w / 2, w / 2, w * 0.2, w / 2, w / 2, w / 2); gg.addColorStop(0, osc ? '#0c0c12' : '#e8d6aa'); gg.addColorStop(1, osc ? '#08080c' : '#b89a64'); g.fillStyle = gg; g.fillRect(0, 0, w, w); g.strokeStyle = osc ? 'rgba(255,40,60,.18)' : 'rgba(120,80,30,.18)'; g.lineWidth = 3; for (let r = w * 0.25; r < w / 2; r += 26) { g.beginPath(); g.arc(w / 2, w / 2, r, 0, 7); g.stroke(); } for (let i = 0; i < 40; i++) { const a = i / 40 * Math.PI * 2; g.beginPath(); g.moveTo(w / 2 + Math.sin(a) * w * 0.24, w / 2 + Math.cos(a) * w * 0.24); g.lineTo(w / 2 + Math.sin(a) * w * 0.5, w / 2 + Math.cos(a) * w * 0.5); g.stroke(); } }) }), lam(0)]);
  plat.position.y = Ht / 2; plat.name = 'plat'; R.add(plat);
  anillo(gn - 0.04, gn + 0.06, Ht + 0.004, glowMat(NAR, 0.95));
  anillo(gn + 0.05, gn + 0.12, 0.02, glowMat(NAR, 0.5));
  // foso entre la tarima y el anillo
  anillo(on, Bn, Ht + 0.003, bas(0x020203)); anillo(Bn - 0.05, Bn, Ht + 0.005, glowMat(NAR, 0.8));
  // tarima central
  const tar = new T.Mesh(new T.CylinderGeometry(on, on + 0.08, Ae - Ht, 96), [lam(osc ? 0x101018 : 0x3a2a2a, osc ? 0x100008 : 0x1a0a06), new T.MeshPhongMaterial({ color: osc ? 0x1a1a22 : 0x2a2a30, specular: 0x2a2a34, shininess: 50, map: Vt(512, 512, (g, w) => { const gr = g.createRadialGradient(w / 2, w / 2, 20, w / 2, w / 2, w / 2); gr.addColorStop(0, osc ? '#16161e' : '#202026'); gr.addColorStop(1, osc ? '#08080c' : '#0a0a0e'); g.fillStyle = gr; g.fillRect(0, 0, w, w); g.strokeStyle = osc ? 'rgba(255,40,60,.35)' : 'rgba(255,140,40,.35)'; g.lineWidth = 4; for (const r of [0.33, 0.42]) { g.beginPath(); g.arc(w / 2, w / 2, w * r, 0, 7); g.stroke(); } }) }), lam(0)]);
  tar.position.y = Ht + (Ae - Ht) / 2; R.add(tar);
  // banda de luz en el canto de la tarima
  const banda = new T.Mesh(new T.CylinderGeometry(on + 0.085, on + 0.085, 0.07, 96, 1, true), glowMat(NAR, 0.95)); banda.position.y = Ae - 0.08; R.add(banda);
  // escalones de subida (delante)
  for (let k = 0; k < 3; k++) { const h = Ht + (Ae - Ht) * (k + 1) / 4; const st = new T.Mesh(new T.BoxGeometry(1.9, h, 0.32), lam(osc ? 0x15151c : 0x3a3036, 0x050304)); st.position.set(0, h / 2, on + 0.75 - k * 0.3); R.add(st); const led = new T.Mesh(new T.BoxGeometry(1.9, 0.02, 0.02), glowMat(0xffffff, 0.7)); led.position.set(0, h + 0.005, on + 0.75 - k * 0.3 + 0.16); R.add(led); }
  // trampilla central
  const puerta = texPuerta(osc ? '#ff2030' : '#ff6a1a', osc ? '#ff4050' : '#ffc21a', osc);
  { const hc = em.makeHole(new T.Vector3(0, Ae, 0), 0.8, puerta, sTheme); hc.halo && (hc.halo.material.opacity = 0.18); em.holes.push(hc); const ac = new T.Mesh(new T.RingGeometry(0.86, 1.12, 64), bas(osc ? 0xff1020 : 0xe8101a)); ac.rotation.x = -Math.PI / 2; ac.position.y = Ae + 0.012; R.add(ac); }
  // 10 trampillas en círculo (1-5 a la izquierda de delante hacia atrás, 6-10 a la derecha de atrás hacia delante)
  const pos = []; for (let k = 0; k < 5; k++) pos.push(lo(A3.RH, -A3.angulos[k], Ht)); for (let k = 4; k >= 0; k--) pos.push(lo(A3.RH, A3.angulos[k], Ht));
  const copaGeo = new T.LatheGeometry([[0.07, 0], [0.09, 0.05], [0.11, 0.12], [0.2, 0.24], [0.3, 0.34], [0.33, 0.38], [0.31, 0.39]].map(([x, y]) => new T.Vector2(x, y)), 32);
  const copaMat = new T.MeshLambertMaterial({ color: osc ? 0x2a0006 : 0xffa040, emissive: osc ? 0xc00818 : 0xff6a10, emissiveIntensity: osc ? 0.8 : 1.0, transparent: true, opacity: 0.92, side: T.DoubleSide }), bordeCopa = glowMat(osc ? 0xff2030 : 0xffb030, 0.95);
  const tallo = new T.CylinderGeometry(0.035, 0.05, 0.86, 10), tMat = new T.MeshPhongMaterial({ color: 0xc0c4cc, specular: 0xffffff, shininess: 100 });
  pos.forEach((O, k) => {
    const h = em.makeHole(O, A3.RT, puerta, sTheme); h.halo.material.opacity = 0.22;
    // aro exterior fijo (rojo/naranja) como en las fotos
    const aro = new T.Mesh(new T.RingGeometry(A3.RT * 1.14, A3.RT * (osc ? 1.55 : 1.5), 48), bas(osc ? 0xff1020 : 0xd80818)); aro.rotation.x = -Math.PI / 2; aro.position.set(O.x, Ht + 0.018, O.z); aro.name = 'aroT'; R.add(aro);
    const tw = new T.Mesh(new T.CylinderGeometry(A3.RT * 1.62, A3.RT * 1.7, 0.3, 48, 1, true), new T.MeshPhongMaterial({ color: osc ? 0x18181e : 0x6a6e78, specular: 0xffffff, shininess: 80, emissive: 0x000000 })); tw.position.set(O.x, Ht + 0.15, O.z); R.add(tw);
    const tin = new T.Mesh(new T.CylinderGeometry(A3.RT * 1.55, A3.RT * 1.55, 0.29, 48, 1, true), bas(osc ? 0xc00818 : 0xc00a14, { side: T.DoubleSide })); tin.position.set(O.x, Ht + 0.15, O.z); R.add(tin);
    const tb = new T.Mesh(new T.RingGeometry(A3.RT * 1.55, A3.RT * 1.72, 48), new T.MeshPhongMaterial({ color: osc ? 0x26262e : 0x9a9ea8, specular: 0xffffff, shininess: 100, side: T.DoubleSide })); tb.rotation.x = -Math.PI / 2; tb.position.set(O.x, Ht + 0.3, O.z); R.add(tb);
    const tr = new T.Mesh(new T.RingGeometry(A3.RT * 1.18, A3.RT * 1.55, 48), bas(osc ? 0xff1020 : 0xe8101a)); tr.rotation.x = -Math.PI / 2; tr.position.set(O.x, Ht + 0.2, O.z); tr.name = 'aroT'; R.add(tr); tin.name = 'aroT';
    const tl = new T.Mesh(new T.TorusGeometry(A3.RT * 1.6, 0.025, 6, 48), glowMat(osc ? 0xff2030 : 0xff3a2a, 0.95)); tl.rotation.x = Math.PI / 2; tl.position.set(O.x, Ht + 0.3, O.z); R.add(tl);
    const lab = new T.Sprite(new T.SpriteMaterial({ map: rh(String(k + 1), me.rival(k + 1)), depthWrite: false, transparent: true }));
    lab.scale.set(1, 0.78, 1); lab.center.set(0.5, 0.68); lab.position.set(O.x, Ht + 2.25, O.z); R.add(lab); h.label = lab;
    // pedestal tipo copa, hacia el centro
    const d = new T.Vector3(-O.x, 0, -O.z).normalize(), p = O.clone().addScaledVector(d, 0.98);
    const t = new T.Mesh(tallo, tMat); t.position.set(p.x, Ht + 0.43, p.z); R.add(t);
    pedestalCristal(R, p, k + 1, Ht);
    const base = new T.Mesh(new T.CylinderGeometry(0.2, 0.24, 0.05, 20), lam(0x55555c)); base.position.set(p.x, Ht + 0.025, p.z); R.add(base);
    em.holes.push(h);
  });
  // barandilla (tubo metálico; LED blanco en la versión oscura) con hueco de entrada delante
  const railMat = osc ? glowMat(0xffffff, 0.95) : new T.MeshPhongMaterial({ color: 0xb8bcc8, specular: 0xffffff, shininess: 90 });
  const gap = 0.2, RR = gn + 0.18;
  for (const y of [0.55, 1.05]) { const tor = new T.Mesh(new T.TorusGeometry(RR, y > 1 ? 0.035 : 0.022, 8, 160, Math.PI * 2 - gap * 2), railMat); tor.rotation.x = Math.PI / 2; tor.rotation.z = -Math.PI / 2 + gap; tor.position.y = Ht + y; R.add(tor); }
  const poste = new T.CylinderGeometry(0.025, 0.025, 1.05, 6), pMat = osc ? lam(0x202028) : railMat;
  for (let a = gap; a <= Math.PI * 2 - gap + 1e-3; a += (Math.PI * 2 - gap * 2) / 40) { const m = new T.Mesh(poste, pMat); const v = lo(RR, a, Ht + 0.525); m.position.copy(v); R.add(m); }
  const lamas = new T.Mesh(new T.CylinderGeometry(RR + 0.05, RR + 0.05, 1.0, 160, 1, true, gap, Math.PI * 2 - gap * 2), new T.MeshPhongMaterial({ side: T.DoubleSide, transparent: true, color: 0xffffff, specular: 0xffffff, shininess: 60, emissive: osc ? 0x000000 : 0x101014, map: Vt(1024, 64, (g, w, h) => { g.clearRect(0, 0, w, h); for (let x = 0; x < w; x += 8) { g.fillStyle = osc ? 'rgba(30,30,40,.85)' : 'rgba(150,154,164,.85)'; g.fillRect(x, 0, 5, h); } g.fillStyle = osc ? 'rgba(255,255,255,.9)' : 'rgba(220,224,232,1)'; g.fillRect(0, 0, w, 4); }) }));
  lamas.material.map.wrapS = T.RepeatWrapping; lamas.material.map.repeat.set(6, 1); lamas.position.y = Ht + 0.5; R.add(lamas);
  // gradas en círculo detrás de la barandilla (hueco delante para las cámaras)
  const grMat = lam(osc ? 0x0a0a12 : 0x1a1418, osc ? 0x05050a : 0x080406), frente = glowMat(osc ? 0xff2040 : 0xff3a1a, osc ? 0.9 : 0.75);
  const a0 = wi[0] - 0.06, a1 = wi[1] + 0.05;
  Yt.forEach((f, i) => {
    const r0 = (i ? Yt[i - 1].r + 0.35 : gn + 1.45), r1 = f.r + 0.35;
    for (const sg of [1, -1]) {
      const m = sector(r0, r1, sg > 0 ? a0 : -a1, sg > 0 ? a1 : -a0, 0, f.y, grMat); R.add(m);
      const fr = new T.Mesh(new T.CylinderGeometry(r0 + 0.01, r0 + 0.01, 0.06, 64, 1, true, sg > 0 ? a0 : -a1, a1 - a0), frente); fr.position.y = (i ? Yt[i - 1].y : 0.32) + 0.03; R.add(fr);
      if (!i) { const bw = new T.Mesh(new T.CylinderGeometry(gn + 1.2, gn + 1.2, 1.9, 72, 1, true, sg > 0 ? a0 : -a1, a1 - a0), new T.MeshBasicMaterial({ side: T.DoubleSide, map: Vt(512, 64, (g, w, h) => { const gr = g.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, osc ? '#3a0820' : '#ff6a5a'); gr.addColorStop(0.5, osc ? '#c0103a' : '#d8102a'); gr.addColorStop(1, osc ? '#200410' : '#5a0410'); g.fillStyle = gr; g.fillRect(0, 0, w, h); g.fillStyle = 'rgba(255,255,255,.55)'; g.fillRect(0, h * 0.18, w, 2); g.fillRect(0, h * 0.82, w, 2); }) })); bw.position.y = 0.95; R.add(bw); }
    }
  });
  // pared del fondo con franjas de luz
  const pared = new T.Mesh(new T.CylinderGeometry(Cn, Cn, 7, 96, 1, true), texPared(osc, Vt(2048, 256, (g, w, h) => { g.fillStyle = osc ? '#05050a' : '#120a0c'; g.fillRect(0, 0, w, h); for (let y = 40; y < h; y += 46) { g.fillStyle = osc ? 'rgba(160,40,255,.55)' : 'rgba(255,90,30,.55)'; g.fillRect(0, y, w, 6); } for (let x = 0; x < w; x += 64) { g.fillStyle = osc ? 'rgba(255,40,80,.25)' : 'rgba(255,170,60,.18)'; g.fillRect(x, 0, 3, h); } })));
  pared.position.y = 3.5; pared.name = 'pared'; R.add(pared);
  // techo: gran anillo blanco (2011-2017) / anillo oscuro con LEDs (2017-2021)
  const techoMat = osc ? lam(0x15151c, 0x0a0410) : new T.MeshLambertMaterial({ color: 0xffffff, emissive: 0xd8d8e0, emissiveIntensity: 0.85, side: T.DoubleSide });
  if (!osc) techoMat.map = Vt(2048, 64, (g, w, h) => { g.fillStyle = '#ffffff'; g.fillRect(0, 0, w, h); for (let x = 0; x < w; x += 64) { g.fillStyle = 'rgba(40,40,50,.55)'; g.fillRect(x, 0, 4, h); } });
  const t1 = new T.Mesh(new T.CylinderGeometry(10.2, 3.8, 1.6, 96, 1, true), techoMat); t1.position.y = 6.9; R.add(t1);
  const t2 = new T.Mesh(new T.RingGeometry(9.6, 12.6, 96), osc ? lam(0x0a0a10) : lam(0x2a2a30, 0x101014)); t2.rotation.x = Math.PI / 2; t2.position.y = 8.1; R.add(t2);
  const t3 = new T.Mesh(new T.CylinderGeometry(4.0, 4.0, 0.5, 64, 1, true), osc ? glowMat(0xff2040, 0.8) : lam(0xffffff, 0xffffff)); t3.position.y = 6.65; R.add(t3);
  for (const [r, y] of [[4.02, 6.4], [9.62, 8.1], [7, 7.2]]) { const l = new T.Mesh(new T.TorusGeometry(r, 0.04, 6, 128), glowMat(osc ? 0xff3050 : 0xffffff, 0.9)); l.rotation.x = Math.PI / 2; l.position.y = y; R.add(l); }
  // focos colgados en el hueco central del techo
  const foco = new T.CylinderGeometry(0.14, 0.1, 0.3, 10), fMat = lam(0x222228), fLuz = glowMat(0xfff2d0, 0.9);
  for (let i = 0; i < 18; i++) { const a = i / 18 * Math.PI * 2, r = i % 2 ? 2.2 : 3.3; const m = new T.Mesh(foco, fMat); m.position.copy(lo(r, a, 7.0)); R.add(m); const d = new T.Mesh(new T.CircleGeometry(0.1, 10), fLuz); d.rotation.x = Math.PI / 2; d.position.copy(lo(r, a, 6.84)); R.add(d); }
  const truss = new T.Mesh(new T.TorusGeometry(2.8, 0.06, 6, 64), lam(0x55555c)); truss.rotation.x = Math.PI / 2; truss.position.y = 7.1; R.add(truss);
  // pantallas: logo (izquierda del fondo) y premios (derecha); en la versión oscura, pantalla grande del logo al fondo
  const logoMat = new T.MeshBasicMaterial({ map: texLogoPantalla(s), color: 0xffffff }); em.screenMats.push(logoMat);
  const marco = (w, h, mat, x, y, z) => { const g = new T.Group(); const sc = new T.Mesh(new T.PlaneGeometry(w, h), mat); g.add(sc); const fr = new T.Mesh(new T.BoxGeometry(w + 0.3, h + 0.3, 0.2), lam(osc ? 0x0a0a10 : 0xd8dce4, osc ? 0x000000 : 0x202024)); fr.position.z = -0.12; g.add(fr); const gl = new T.Mesh(new T.PlaneGeometry(w + 0.5, h + 0.5), glowMat(osc ? 0xff2040 : 0x2a8aff, 0.35)); gl.position.z = -0.2; g.add(gl); g.position.set(x, y, z); g.lookAt(0, y * 0.8, 0); R.add(g); return g; };
  PANT.mat = logoMat; PANT.logoMap = logoMat.map;
  if (osc) { const L = lo(11.2, Math.PI + 0.7, 4.0); marco(6.0, 3.6, logoMat, L.x, L.y, L.z); em.screenFocus = L.clone().multiplyScalar(0.98); const B = lo(11.6, Math.PI - 0.55, 3.6); const pb = marco(3.2, 2.15, new T.MeshBasicMaterial({ map: PANT.texPremios() }), B.x, B.y, B.z); em.prizeBoards.push(pb); }
  else {
    const L = lo(11.0, Math.PI + 0.85, 3.7); const g = marco(5.0, 3.4, logoMat, L.x, L.y, L.z); { const col = new T.Mesh(new T.CylinderGeometry(11.35, 11.35, 6.4, 40, 1, true, Math.PI + 0.85 - 0.3, 0.6), new T.MeshLambertMaterial({ color: 0xf0f0f4, emissive: 0x6a6a70, side: T.DoubleSide })); col.position.y = 3.2; R.add(col); } em.screenFocus = L.clone().multiplyScalar(0.98);
    { const P2 = lo(11.2, Math.PI - 0.62, 4.0); const pb = marco(4.2, 2.8, new T.MeshBasicMaterial({ map: PANT.texPremios() }), P2.x, P2.y, P2.z); em.prizeBoards.push(pb); }
  }
  if (!osc) { const esp = Vt(512, 512, (g, w) => { const gr = g.createRadialGradient(w / 2, w / 2, 10, w / 2, w / 2, w / 2); gr.addColorStop(0, '#ff6ad8'); gr.addColorStop(0.35, '#5a2ad8'); gr.addColorStop(0.7, '#1a3ad8'); gr.addColorStop(1, '#0a0a3a'); g.fillStyle = gr; g.fillRect(0, 0, w, w); g.strokeStyle = 'rgba(255,255,255,.25)'; g.lineWidth = 6; for (let r = 30; r < w / 2; r += 34) { g.beginPath(); g.arc(w / 2, w / 2, r, 0, 7); g.stroke(); } });
    const C = lo(11.9, Math.PI + 0.3, 3.6); const cs = new T.Mesh(new T.CircleGeometry(1.7, 64), new T.MeshBasicMaterial({ map: esp })); cs.position.copy(C); cs.lookAt(0, 3.4, 0); R.add(cs); const cm = new T.Mesh(new T.TorusGeometry(1.75, 0.12, 8, 64), lam(0xe0e2ea, 0x303034)); cm.position.copy(C); cm.lookAt(0, 3.4, 0); R.add(cm); }
  // brillo animado de los aros
  const aros = []; R.traverse(o => { if (o.material && o.material.blending === T.AdditiveBlending && o.geometry && o.geometry.type === 'RingGeometry') aros.push(o); });
  em.anim.push((dt, t) => { const k = 0.82 + Math.sin(t * 2.2) * 0.12; aros.forEach((o, i) => o.material.opacity = Math.min(1, k + (i % 3) * 0.04)); });
  try { retocaPlatoFotos(em, osc, lo, marco); } catch (e) { console.warn(e); }
  try { ym(em, s); } catch (e) { /* decorados */ }
}
function alturaA3(x, z) {
  const r = Math.hypot(x, z), a = Math.abs(Math.atan2(x, z));
  if (r > Cn - 0.6) return null;
  if (r < on - 0.05) return Ae;
  if (Math.abs(x) < 0.95 && z > 0 && z < on + 0.95) { const k = Math.max(0, Math.min(3, Math.floor((z - (on - 0.3)) / 0.3))); return Ae - (k + 1) * (Ae - Ht) / 4 > Ht ? Ae - (k) * (Ae - Ht) / 4 : Ht; }
  if (r < gn) return Ht;
  if (r < gn + 0.45) return a < 0.18 ? Ht * 0.5 : null;
  if (a < 0.16 && z > 0) return 0;
  return null;
}

// ===================================================================================================
// Etapas del programa (Opciones › Etapa) y especiales
// ===================================================================================================
const ETAPAS = {
  '2011': { nombre: '2011-2014', sub: 'Antena 3 · 10 rivales, duelos clásicos', plato: 'antena3', nota: 'Plató de Antena 3. El central se elige con la tableta y se enfrenta a 10 rivales, cada uno en su trampilla. Solo duelos clásicos. Cada trampilla esconde una de las 10 cifras. Tras cada duelo ganado: plantarte o seguir. Si tiras a los 10, te llevas el bote.' },
  '2015': { nombre: '2015-2017', sub: 'Antena 3 · Entre tres, Adivina, Palabra musical, Letras desordenadas', plato: 'antena3', nota: 'Mismo plató, con la pantalla verde de premios. Duelos Clásico, Entre tres, Adivina, Palabra musical y Letras desordenadas, y comodines. Si pierdes, el oponente ocupa tu sitio y se queda con tu dinero y tu comodín. 10 cifras, una por trampilla.' },
  '2017': { nombre: '2017-2021', sub: 'Plató oscuro · monedas y Huella Dobladora', plato: 'oscuro', nota: 'Plató oscuro con aros de neón rojo. 10 rivales y 10 cifras de las monedas, una por trampilla. Una trampilla esconde la Huella Dobladora: dobla tu bote. Tras cada duelo ganado: plantarte o seguir.' },
  '2021': { nombre: 'Caduta Libera (Italia)', sub: '10 oponentes · moneda de dos lados · Desafío final', plato: 'virtual', nota: 'Plató redondo azul con 10 trampillas de aros cian y la trampilla central. El líder derriba a los 10 oponentes; tras cada duelo elige un lado de la moneda (sumar, vida extra o perderlo todo). Después: salir con la mitad o el DESAFÍO FINAL, 10 preguntas en 2 minutos.' },
};
for (const [k, e] of Object.entries(ETAPAS)) Object.assign(e, ETAPAS_DATOS[k] || {});
// registro de la mecánica usada (para las pruebas automáticas)
window.__mec = []; const mec = t => { window.__mec.push(t); };
/** reparte las 10 cifras de la etapa entre las 10 trampillas (al azar en cada programa) */
function cifrasTrampillas() { const c = (etapa().cifras || []).slice(0, 10).map((v, i) => i); for (let i = c.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [c[i], c[j]] = [c[j], c[i]]; } const m = {}; c.forEach((v, i) => m[i + 1] = v); return m; }
const cifraTxt = v => v === 'vida' ? 'un comodín' : v === 'mitad' ? 'la mitad' : v === 'doble' ? 'el doble' : v === 'cero' ? 'lo pierdes todo' : Uo(+String(v).replace('+', '')) + ' €';
/** 2011-2021: al tirar al rival, la trampilla descubre su cifra (sin elegir lado). 2017-2021: Huella Dobladora. */
async function ayFija(a, e, t) {
  const { s } = a; F.stopMusic(), F.play('AhoraCaigo - Moeda.mp3'), F.play('Moeda@Valores');
  const ix = (t.cifrasT || {})[e] ?? 0, v = (etapa().cifras || [1000])[ix]; t.moedas.push(e);
  try { a.eng.studio.setHoleColor(e, 0xffd23a); } catch (x) { }
  a.hud.hint('🪙 La trampilla ' + e + ' esconde…'); await s.w(1400); a.hud.hint(null);
  TA(typeof v === 'number' ? '+' + v : v, t); F.play('fairydust@Moeda1'); mec('moneda fija ' + v);
  ze.aplauso(2, 0.6); a.hud.toast(`🪙 Trampilla ${e}: <b>${cifraTxt(v)}</b>`, 2600); await s.w(2000);
  if (etapa().dobladora && t.dobladora === e) { mec('dobladora'); t.placar *= 2; F.play('pop'); ze.vitores(3); a.hud.toast('🎵 ¡HUELLA DOBLADORA! Doblas tu bote', 2800); await s.w(2600); }
  PANT.actualiza({ usadas: PANT.est.usadas.concat(ix), placar: t.placar, comodines: Math.max(0, t.vidas) }); PANT.mostrar('premios');
  return { val: v, other: null };
}
let ETAPA = localStorage.getItem('ac_etapa') || '2021';
const etapa = () => ETAPAS[ETAPA] || ETAPAS['2021'];
const monedaFija = () => etapa().moneda === 'fija' && !window.__botForce;
function platoDe(p) { return p === 'oscuro' ? (A3VAR = '2017', 'antena3') : p === 'antena3' ? (A3VAR = ETAPA === '2015' ? '2015' : '2011', 'antena3') : p; }
function aplicarPlato(theme) { const p = (theme && theme.plato) || (it && it.plato) || null; p && yv(platoDe(p)); }
function planEtapa(a) {
  const e = etapa(), base = Zv0(a);
  const N = e.duelos || 8; while (base.length < N) base.push(base[base.length % 8] || 'clasico');
  if (e.especiales) { const plan = Array.from({ length: N }, () => 'clasico'); for (const [k, v] of Object.entries(e.especiales)) plan[+k - 1] = v; return plan; }
  if (!e.pruebas) return base.slice(0, N);
  const ok = e.pruebas; const alt = ok.filter(x => x !== 'gallina');
  const plan = base.slice(0, N).map(p => ok.includes(p) ? p : alt[Math.floor(Math.random() * alt.length)]);
  if (ok.includes('gallina') && !plan.includes('gallina')) plan[4] = 'gallina';
  return plan;
}
const ESPECIALES = [
  { id: 'mil', name: '¡Ahora caigo! 1000', emoji: '🎉', plato: 'virtual', wallA: '#3a0a6a', wallB: '#8a2ad0', chevA: '#ff5fd8', chevB: '#ffd23a', glow: 0xd04aff, accent: 0xff4fd8, fog: 0x0c0418, bg: 0x060210, host: { suit: 0x141414, shirt: 0xffffff, tie: 0xd04aff, bowtie: true }, hashtag: '#AhoraCaigo1000', decor: 'none', banner: '¡AHORA CAIGO! 1000', festivo: true, saludo: '¡Muy buenas noches! Hoy es un día histórico: ¡celebramos el programa mil de ¡Ahora caigo!', extra: ['Mil programas, miles de trampillas abiertas y muchísimos concursantes. ¡Gracias por estar ahí cada tarde!'], despedida: '¡Y así celebramos el programa mil! Gracias por acompañarnos. ¡A por los dos mil!' },
  { id: 'fantasticos', name: 'Los 11 fantásticos', emoji: '🦸', plato: 'virtual', wallA: '#1a0a5a', wallB: '#5a2ad0', chevA: '#3ad0ff', chevB: '#ff5fd8', glow: 0x3ad0ff, accent: 0xff5fd8, fog: 0x060418, bg: 0x030210, host: { suit: 0x1a1a3a, shirt: 0xffffff, tie: 0x3ad0ff }, hashtag: '#Los11Fantásticos', decor: 'none', banner: 'LOS 11 FANTÁSTICOS', festivo: true, saludo: '¡Bienvenidos a un especial único! Hoy juegan Los once fantásticos: los mejores concursantes de la historia del programa.', extra: ['Once leyendas, diez trampillas y un solo ganador. ¡Que empiece el duelo de campeones!'], despedida: '¡Hasta aquí el especial de Los once fantásticos! Qué nivel. ¡Hasta la próxima!' },
  { id: 'mayores', name: 'Navidad con mayores', emoji: '👵', plato: 'virtual', gold: true, wallA: '#5a2200', wallB: '#e0820c', chevA: '#fff0a8', chevB: '#ffb21a', glow: 0xffb21a, accent: 0xffe08a, fog: 0x140800, bg: 0x0a0400, host: { suit: 0xb01a1a, shirt: 0xffffff, tie: 0x1a8a30, hat: 'papanoel' }, hashtag: '#AhoraCaigoNavidad', decor: 'navidad', banner: 'ESPECIAL NAVIDAD CON MAYORES', festivo: true, saludo: '¡Feliz Navidad! Hoy nos acompañan nuestros mayores en un especial lleno de cariño, turrón y trampillas doradas.', extra: ['La trampilla central se ha vestido de oro y de pompones para la ocasión. ¡Mucha suerte a todos!'], despedida: '¡Feliz Navidad a todos y a todas! Gracias, abuelos y abuelas, por esta tarde tan bonita.' },
  { id: 'sub400ikeriano', name: 'Especial 400 suscriptores · Ikeriano el campeón 2', emoji: '🏆', plato: 'virtual', wallA: '#06204a', wallB: '#0a5ac8', chevA: '#ffd23a', chevB: '#f39a12', glow: 0xffd23a, accent: 0x2a8aff, fog: 0x020a1a, bg: 0x01060f, host: { suit: 0x0a1a3a, shirt: 0xffffff, tie: 0xffd23a, bowtie: true, hat: 'fiesta' }, hashtag: '#AhoraCaigo400', decor: 'especial300', banner: 'Especial 400 suscriptores · Ikeriano el campeón 2', festivo: true, saludo: '¡Muy buenas noches! Bienvenidos al Especial 400 suscriptores del canal Ikeriano el campeón 2.', extra: ['¡Cuatrocientos suscriptores! Gracias de corazón a todos los que veis el canal. Este programa es para vosotros.'], despedida: '¡Hasta aquí el Especial 400 suscriptores! Gracias a todos los suscriptores de Ikeriano el campeón 2. ¡A por los quinientos!', credito: ['Especial 400 suscriptores', ['Dedicado a los suscriptores', 'del canal de YouTube', '«Ikeriano el campeón 2»']] },
  { id: 'sub400marchelitos', name: 'Especial 400 suscriptores · marchelitosthemona', emoji: '👑', plato: 'virtual', wallA: '#0a3a2a', wallB: '#14a070', chevA: '#ffe25a', chevB: '#3affb0', glow: 0x3affb0, accent: 0xffe25a, fog: 0x02140c, bg: 0x010a06, host: { suit: 0x0a2a1a, shirt: 0xffffff, tie: 0xffe25a, bowtie: true, hat: 'corona' }, hashtag: '#AhoraCaigo400', decor: 'especial300', banner: 'Especial 400 suscriptores · marchelitosthemona', festivo: true, saludo: '¡Muy buenas noches! Hoy celebramos el Especial 400 suscriptores del canal marchelitosthemona.', extra: ['¡Cuatrocientos suscriptores! Muchas gracias a toda la comunidad de marchelitosthemona. ¡Que empiece la fiesta!'], despedida: '¡Y hasta aquí el Especial 400 suscriptores de marchelitosthemona! Gracias a todos. ¡Nos vemos en el próximo vídeo!', credito: ['Especial 400 suscriptores', ['Dedicado a los suscriptores', 'del canal de YouTube', '«marchelitosthemona»']] },
  { id: 'profesiones', name: 'Especial Profesiones', emoji: '👷', plato: 'virtual', wallA: '#2a2a32', wallB: '#4a5a6a', chevA: '#ffc21a', chevB: '#ff8a1a', glow: 0xffc21a, accent: 0xff8a1a, fog: 0x08090c, bg: 0x040506, host: { suit: 0x2a3440, shirt: 0xffffff, tie: 0xffc21a }, hashtag: '#AhoraCaigoProfesiones', decor: 'none', banner: 'ESPECIAL PROFESIONES', festivo: true, saludo: '¡Muy buenas noches! Bienvenidos al Especial Profesiones: hoy juegan bomberos, cocineros, médicos, profesores y muchos más.', extra: ['Cada concursante viene con su oficio. ¡A ver qué profesión sabe más!'], despedida: '¡Hasta aquí el Especial Profesiones! Gracias a todos los trabajadores que nos han acompañado. ¡Hasta la próxima!' },
  { id: 'sanvalentin', name: 'San Valentín', emoji: '💘', plato: 'virtual', wallA: '#7a0a3a', wallB: '#d02a6a', chevA: '#ffd0e0', chevB: '#ff4a8a', glow: 0xff4a8a, accent: 0xffd0e0, fog: 0x14020a, bg: 0x0a0106, host: { suit: 0x5a0a2a, shirt: 0xffffff, tie: 0xff4a8a }, hashtag: '#AhoraCaigoSanValentín', decor: 'carnaval', banner: 'ESPECIAL SAN VALENTÍN', festivo: true, saludo: '¡Muy buenas noches, enamorados! Bienvenidos al especial de San Valentín de ¡Ahora caigo!', extra: ['Hoy las trampillas están llenas de corazones. ¡Que no se os rompa ninguno!'], despedida: '¡Feliz San Valentín a todos! Gracias por pasar esta noche con nosotros. ¡Hasta la próxima!' },
  { id: 'famosos', name: 'Especial Famosos', emoji: '🌟', plato: 'virtual', wallA: '#1a1a1a', wallB: '#5a4a1a', chevA: '#ffd23a', chevB: '#c9a227', glow: 0xffd23a, accent: 0xffe7a0, fog: 0x060604, bg: 0x030302, host: { suit: 0x0a0a0a, shirt: 0xffffff, tie: 0x0a0a0a, bowtie: true }, hashtag: '#AhoraCaigoFamosos', decor: 'primetime', banner: 'ESPECIAL FAMOSOS', festivo: true, saludo: '¡Muy buenas noches! Hoy tenemos un especial lleno de estrellas: ¡el Especial Famosos de ¡Ahora caigo!', extra: ['Los famosos juegan por una causa solidaria. ¡Que nadie se caiga antes de tiempo!'], despedida: '¡Hasta aquí el Especial Famosos! Gracias a todas las estrellas que han jugado esta noche. ¡Hasta la próxima!' },
  { id: 'abuelos', name: 'Especial Abuelos', emoji: '👴', plato: 'virtual', wallA: '#5a3a1a', wallB: '#b07a3a', chevA: '#fff0c8', chevB: '#ffb05a', glow: 0xffb05a, accent: 0xfff0c8, fog: 0x0c0804, bg: 0x060402, host: { suit: 0x4a2a10, shirt: 0xffffff, tie: 0xffb05a }, hashtag: '#AhoraCaigoAbuelos', decor: 'none', banner: 'ESPECIAL ABUELOS', festivo: true, saludo: '¡Muy buenas noches! Hoy es un día muy bonito: bienvenidos al Especial Abuelos de ¡Ahora caigo!', extra: ['Toda una vida de experiencia contra diez trampillas. ¡Que tiemblen los jóvenes!'], despedida: '¡Gracias a todos los abuelos y abuelas que han jugado hoy! Sois los mejores. ¡Hasta la próxima!' },
];
ESPECIALES.forEach(t => { if (!Do.find(d => d.id === t.id)) Do.push(t); });
Object.assign(Eo, { mil: { ...Eo.carnaval, deco: 'brillos' }, fantasticos: { ...Eo.ninos, perLetter: null, text: ['#ffffff', '#c8f0ff', '#3ad0ff'], deco: 'estrellas' }, mayores: { ...Eo.primetime, deco: 'nieve' }, sub400ikeriano: { ...(Eo.especial300 || Eo.primetime) }, sub400marchelitos: { ...(Eo.especial300 || Eo.primetime) }, profesiones: { ...Eo.primetime }, sanvalentin: { ...Eo.carnaval, deco: 'brillos' }, famosos: { ...Eo.primetime, deco: 'brillos' }, abuelos: { ...Eo.primetime } });

function filaEtapa() {
  const box = document.createElement('div');
  const row = document.createElement('div'); row.className = 'orow'; row.id = 'rowEtapa';
  const lb = document.createElement('label'); lb.textContent = '📅 Etapa del programa'; row.appendChild(lb);
  for (const [k, e] of Object.entries(ETAPAS)) {
    const b = document.createElement('button'); b.className = 'tbtn' + (ETAPA === k ? ' sel' : ''); b.textContent = e.nombre; b.title = e.sub; b.dataset.v = k;
    b.onclick = ev => { ev.stopPropagation(); F.play('Tecla'); ETAPA = k; localStorage.setItem('ac_etapa', k); it.plato = e.plato; Sh(it); aplicarPlato(xf(Ms)); Xe.setTheme(xf(Ms)); Ii(); Xe.resetPositions(); Xe.lookEvent('menu'); Xe.startOrbit(new P(0, 0, 0), 10.8, 4.8, 0.5, 0.06, 1.2); Lt('options'); };
    row.appendChild(b);
  }
  const n = document.createElement('p'); n.className = 'onote'; n.textContent = etapa().nota;
  box.append(row, n); return box;
}
function filaRecursos() {
  const box = document.createElement('div');
  const row = document.createElement('div'); row.className = 'orow'; row.id = 'rowRecursos';
  const lb = document.createElement('label'); lb.textContent = '🎶 Músicas, sonidos y gráficos del APK'; row.appendChild(lb);
  const inp = document.createElement('input'); inp.type = 'file'; inp.multiple = true; inp.accept = '.zip,.sb3,audio/*,image/*,video/mp4'; inp.style.display = 'none';
  const b = document.createElement('button'); b.className = 'tbtn sel'; b.textContent = '📂 Cargar músicas'; b.onclick = ev => { ev.stopPropagation(); inp.click(); };
  const est = document.createElement('p'); est.className = 'onote';
  const pinta = () => { const e = RC.estado(); est.innerHTML = (e.localSnd || e.cargadasSnd ? `✅ Sonidos y músicas: ${e.localSnd ? 'incluidos en esta copia' : e.cargadasSnd + ' guardados en este dispositivo'}` : '🔇 Sin las músicas del APK: carga <b>ahoracaigo_sonidos.zip</b> una sola vez y quedarán guardadas en este navegador.') + '<br>' + (e.localImg || e.cargadasImg ? `✅ Gráficos del APK: ${e.localImg ? 'incluidos' : e.cargadasImg + ' guardados'}` : '🖼️ Gráficos dibujados por el juego (el zip de sonidos trae también los del APK).') + (e.logo ? '<br>✅ Logo propio cargado' : ''); };
  inp.onchange = async () => { const fs = [...inp.files]; inp.value = ''; if (!fs.length) return; try { const r = await RC.cargar(fs, t => est.textContent = t); F.buffers.clear(); est.textContent = `✅ Guardados: ${r.ns} sonidos, ${r.ni} imágenes${r.nl ? ', logo' : ''}${r.nv ? ', vídeo de la cabecera' : ''}${r.np ? `, ${r.np} sin reconocer (ver «Cargar sb3 / sonidos / sprites»)` : ''}. Recargando…`; setTimeout(() => location.reload(), 1200); } catch (e) { est.textContent = '❌ No se pudo leer: ' + e.message; } };
  const inpL = document.createElement('input'); inpL.type = 'file'; inpL.accept = 'image/*'; inpL.style.display = 'none';
  const bl = document.createElement('button'); bl.className = 'tbtn'; bl.textContent = '🖼️ Logo'; bl.onclick = ev => { ev.stopPropagation(); inpL.click(); };
  inpL.onchange = async () => { const f = inpL.files[0]; inpL.value = ''; if (!f) return; await RC.guardarLogo(f); est.textContent = '✅ Logo guardado. Recargando…'; setTimeout(() => location.reload(), 900); };
  const bb = document.createElement('button'); bb.className = 'tbtn'; bb.textContent = '🗑️ Borrar'; bb.onclick = async ev => { ev.stopPropagation(); if (!confirm('¿Borrar las músicas, gráficos y logo guardados en este dispositivo?')) return; await RC.borrar(); location.reload(); };
  const row2 = document.createElement('div'); row2.className = 'orow'; row2.id = 'rowSb3';
  const lb2 = document.createElement('label'); lb2.textContent = '📦 Cargar sb3 / sonidos / sprites'; row2.appendChild(lb2);
  const b2 = document.createElement('button'); b2.className = 'tbtn sel'; b2.id = 'btnRecursos'; b2.textContent = 'Abrir ▶'; b2.onclick = ev => { ev.stopPropagation(); try { F.play('Tecla'); } catch (e) { } Lt('recursos'); }; row2.appendChild(b2);
  row.append(b, bl, bb, inp, inpL); pinta(); box.append(row2, row, est); return box;
}
