// ===================================================================================================
// Etapas 2011-2021 (plató de Antena 3): pantallas de PREMIOS (10 cifras, comodines, acumulado) y del BOTE
// (100.000 € + oponentes que quedan), pedestales de cristal con la moneda del rival y retoques del plató
// copiados de las fotos (suelo blanco brillante, aros rosas, columnas curvas, paredes con tubos azules).
// ===================================================================================================
const PANT = {
  mat: null, logoMap: null, est: { usadas: [], comodines: 2, placar: 0, bote: 100000, quedan: 10 },
  _c: {}, _t: {},
  lienzo(k, w, h) { if (!this._c[k]) { const c = document.createElement('canvas'); c.width = w; c.height = h; this._c[k] = c; const t = new Wo(c); t.colorSpace = ln; this._t[k] = t; } return this._c[k]; },
  texPremios() { this.dibujaPremios(); return this._t.premios; },
  texBote() { this.dibujaBote(); return this._t.bote; },
  cifras() { return ((typeof etapa === 'function' && etapa().cifras) || ETAPAS_DATOS['2011'].cifras).slice(0, 10); },
  /** columnas de píldoras: [izq, der] por filas de mayor a menor */
  filas() { const c = this.cifras().map((v, i) => ({ v: typeof v === 'number' ? v : +String(v).replace(/[^\d]/g, '') || 0, i })).sort((a, b) => b.v - a.v); const f = []; for (let k = 0; k < c.length; k += 2) f.push([c[k], c[k + 1]].filter(Boolean)); return f; },
  dibujaPremios() {
    const c = this.lienzo('premios', 1024, 680), g = c.getContext('2d'), W = c.width, H = c.height, e = this.est;
    // fondo azul con rayos
    const fg = g.createLinearGradient(0, 0, 0, H); fg.addColorStop(0, '#1a6ae8'); fg.addColorStop(1, '#0a3ab0'); g.fillStyle = fg; g.fillRect(0, 0, W, H);
    g.save(); g.translate(W * 0.5, H * 1.05); for (let i = 0; i < 18; i++) { g.rotate(Math.PI / 18); g.fillStyle = i % 2 ? 'rgba(80,200,255,.16)' : 'rgba(0,30,120,.18)'; g.beginPath(); g.moveTo(0, 0); g.lineTo(-90, -H * 1.4); g.lineTo(90, -H * 1.4); g.fill(); } g.restore();
    const pild = (x, y, w, h, txt, apagada) => {
      g.save(); _rr(g, x, y, w, h, h / 2); const gr = g.createLinearGradient(0, y, 0, y + h);
      if (apagada) { gr.addColorStop(0, '#5a5a62'); gr.addColorStop(0.5, '#2a2a30'); gr.addColorStop(1, '#141418'); } else { gr.addColorStop(0, '#fff2a0'); gr.addColorStop(0.45, '#ffc21a'); gr.addColorStop(1, '#c87a00'); }
      g.fillStyle = gr; g.fill(); g.lineWidth = 4; g.strokeStyle = apagada ? '#55555c' : '#8a4a00'; g.stroke(); g.restore();
      g.font = `900 ${Math.round(h * 0.6)}px "Arial Black", Arial, sans-serif`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillStyle = apagada ? '#6a6a72' : '#1a0e00'; g.fillText(txt, x + w / 2, y + h / 2 + 2);
    };
    const filas = this.filas(), usadas = new Set(e.usadas), n = filas.length;
    filas.forEach((f, r) => {
      const k = 1 - r * 0.11, w = 300 * k, h = 70 * Math.max(0.72, k), y = 40 + r * 88, cx = [W * 0.37, W * 0.69];
      f.forEach((p, j) => pild(cx[j] - w / 2, y + (70 - h) / 2, w, h, eurTxt(p.v), usadas.has(p.i)));
      // comodines: círculos verdes con huellas a la izquierda
      if (r < e.comodines) { const x = W * 0.14, yy = y + 35; g.save(); g.fillStyle = '#18a040'; g.strokeStyle = '#0a5a20'; g.lineWidth = 4; g.beginPath(); g.arc(x, yy, 30, 0, 7); g.fill(); g.stroke(); g.restore(); _pies(g, x, yy, 32, '#c8ffd8'); }
    });
    // marcador del acumulado entre dos semicírculos plateados con huellas
    const by = 40 + n * 88 + 14, bh = Math.min(140, H - by - 20), bw = W * 0.52, bx = (W - bw) / 2;
    for (const sx of [-1, 1]) { const cx = W / 2 + sx * (bw / 2 + 4); g.save(); g.beginPath(); g.arc(cx, by + bh / 2, bh / 2, sx < 0 ? Math.PI / 2 : -Math.PI / 2, sx < 0 ? Math.PI * 1.5 : Math.PI / 2); g.closePath(); const sg = g.createLinearGradient(0, by, 0, by + bh); sg.addColorStop(0, '#f4f6fa'); sg.addColorStop(1, '#8a92a4'); g.fillStyle = sg; g.fill(); g.lineWidth = 4; g.strokeStyle = '#c87a00'; g.stroke(); g.restore(); _pies(g, cx + sx * bh * 0.2, by + bh / 2, bh * 0.38, '#6a7080'); }
    g.save(); g.fillStyle = '#1a1000'; g.fillRect(bx - 6, by - 6, bw + 12, bh + 12); const bg = g.createLinearGradient(0, by, 0, by + bh); bg.addColorStop(0, '#fff2a0'); bg.addColorStop(0.5, '#ffc21a'); bg.addColorStop(1, '#b86a00'); g.fillStyle = bg; g.fillRect(bx, by, bw, bh); g.restore();
    g.font = `900 ${Math.round(bh * 0.66)}px "Arial Black", Arial, sans-serif`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillStyle = '#1a0e00'; g.fillText(eurTxt(e.placar), W / 2, by + bh / 2 + 3);
    this._t.premios && (this._t.premios.needsUpdate = true); return c;
  },
  dibujaBote() {
    const c = this.lienzo('bote', 1024, 680), g = c.getContext('2d'), W = c.width, H = c.height, e = this.est;
    const fg = g.createLinearGradient(0, 0, W, H); fg.addColorStop(0, '#0a3ab0'); fg.addColorStop(1, '#1a7ae8'); g.fillStyle = fg; g.fillRect(0, 0, W, H);
    g.save(); g.translate(W * 0.15, H * 0.1); for (let i = 0; i < 14; i++) { g.rotate(Math.PI / 14); g.fillStyle = i % 2 ? 'rgba(90,210,255,.14)' : 'rgba(0,20,90,.16)'; g.beginPath(); g.moveTo(0, 0); g.lineTo(-120, -1400); g.lineTo(120, -1400); g.fill(); } g.restore();
    // aros concéntricos naranja / amarillo / rojo
    const cx = W / 2, cy = H * 0.68;
    [[0.46, '#ff8a1a'], [0.38, '#ffd23a'], [0.3, '#ff3a2a'], [0.22, '#ffb02a']].forEach(([r, col]) => { g.save(); g.lineWidth = 22; g.strokeStyle = col; g.shadowColor = col; g.shadowBlur = 26; g.beginPath(); g.ellipse(cx, cy, W * r, H * r * 0.42, 0, 0, 7); g.stroke(); g.restore(); });
    g.save(); g.fillStyle = '#14161c'; g.strokeStyle = '#ff8a1a'; g.lineWidth = 8; g.beginPath(); g.arc(cx, cy - 18, 62, 0, 7); g.fill(); g.stroke(); g.restore();
    g.font = '900 84px "Arial Black", Arial, sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillStyle = '#ffffff'; g.fillText(String(e.quedan), cx, cy - 14);
    g.font = '900 64px "Arial Black", Arial, sans-serif'; g.lineWidth = 10; g.strokeStyle = '#0a1a5a'; g.strokeText(e.quedan === 1 ? 'OPONENTE' : 'OPONENTES', cx, cy + 92); g.fillStyle = '#ffffff'; g.fillText(e.quedan === 1 ? 'OPONENTE' : 'OPONENTES', cx, cy + 92);
    // bote en letras 3D plateadas
    const t = eurTxt(e.bote); g.font = '900 170px "Arial Black", Arial, sans-serif';
    for (let d = 14; d > 0; d -= 2) { g.fillStyle = `rgb(${40 + d * 4},${44 + d * 4},${56 + d * 4})`; g.fillText(t, cx + d * 0.6, H * 0.26 + d); }
    const sg = g.createLinearGradient(0, H * 0.12, 0, H * 0.4); sg.addColorStop(0, '#ffffff'); sg.addColorStop(0.45, '#c8ccd8'); sg.addColorStop(0.55, '#8a92a4'); sg.addColorStop(1, '#e8ecf4'); g.fillStyle = sg; g.fillText(t, cx, H * 0.26); g.lineWidth = 3; g.strokeStyle = '#4a5060'; g.strokeText(t, cx, H * 0.26);
    this._t.bote && (this._t.bote.needsUpdate = true); return c;
  },
  /** pantalla grande del plató: 'bote' | 'premios' | null (logo) */
  mostrar(k) { if (!this.mat) return; const t = k === 'bote' ? this.texBote() : k === 'premios' ? this.texPremios() : this.logoMap; if (this.mat.map !== t) { this.mat.map = t; this.mat.needsUpdate = true; } },
  actualiza(o = {}) { Object.assign(this.est, o); this.dibujaPremios(); this.dibujaBote(); },
  /** tarjeta 2D (encima del plató) con una de las pantallas */
  async tarjeta(k, s, ms = 3200) {
    const c = k === 'bote' ? this.dibujaBote() : this.dibujaPremios(); const d = document.createElement('div'); d.id = 'pant2d';
    d.style.cssText = 'position:absolute;left:50%;top:46%;width:min(70vw,108vh);transform:translate(-50%,-50%) scale(.6);opacity:0;transition:all .35s cubic-bezier(.2,1.3,.4,1);z-index:13;pointer-events:none;border:6px solid #d8dce4;border-radius:14px;box-shadow:0 0 40px #2a8affaa,0 10px 30px #000a;overflow:hidden';
    const im = new Image(); im.src = c.toDataURL('image/jpeg', 0.9); im.style.cssText = 'display:block;width:100%'; d.appendChild(im); document.getElementById('hud').appendChild(d);
    requestAnimationFrame(() => { d.style.opacity = '1'; d.style.transform = 'translate(-50%,-50%) scale(1)'; });
    try { await s.w(ms); } finally { d.style.opacity = '0'; setTimeout(() => d.remove(), 400); }
  },
};
const eurTxt = v => String(Math.round(+v || 0)).replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ' €';
function texMonedaRival(n) {
  return Vt(256, 192, (g, w, h) => {
    g.clearRect(0, 0, w, h); _rr(g, 14, 10, w - 28, h - 20, 26); const gr = g.createLinearGradient(0, 10, 0, h - 10); gr.addColorStop(0, '#fff0a0'); gr.addColorStop(0.5, '#f0a818'); gr.addColorStop(1, '#a86200'); g.fillStyle = gr; g.fill(); g.lineWidth = 6; g.strokeStyle = '#6a3a00'; g.stroke();
    for (const x of [44, w - 44]) _pies(g, x, h / 2, 40, '#d8dce4');
    g.font = '900 120px "Arial Black", Arial, sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillStyle = '#111'; g.fillText(String(n), w / 2, h / 2 + 6);
  });
}
/** pedestal blanco tipo copa con cúpula de cristal y la moneda dorada con el número del rival */
function pedestalCristal(R, p, n, Ht) {
  const T = _E; const y0 = Ht + 0.82;
  const copa = new T.Mesh(new T.LatheGeometry([[0.06, 0], [0.09, 0.06], [0.14, 0.14], [0.24, 0.24], [0.33, 0.33], [0.36, 0.37], [0.36, 0.4], [0.3, 0.4]].map(([x, y]) => new T.Vector2(x, y)), 40), new T.MeshPhongMaterial({ color: 0xf4f4f8, specular: 0xffffff, shininess: 90, emissive: 0x2a2a30, side: T.DoubleSide }));
  copa.position.set(p.x, y0, p.z); R.add(copa);
  const borde = new T.Mesh(new T.CylinderGeometry(0.4, 0.4, 0.035, 40), new T.MeshPhongMaterial({ color: 0xffffff, specular: 0xffffff, shininess: 120, emissive: 0x3a3a40 })); borde.position.set(p.x, y0 + 0.4, p.z); R.add(borde);
  const cup = new T.Mesh(new T.SphereGeometry(0.34, 32, 12, 0, Math.PI * 2, 0, Math.PI / 2), new T.MeshPhongMaterial({ color: 0xd8f0ff, specular: 0xffffff, shininess: 140, transparent: true, opacity: 0.22, depthWrite: false, side: T.DoubleSide }));
  cup.position.set(p.x, y0 + 0.415, p.z); R.add(cup);
  const mon = new T.Mesh(new T.PlaneGeometry(0.4, 0.3), new T.MeshBasicMaterial({ map: texMonedaRival(n), transparent: true, side: T.DoubleSide }));
  mon.position.set(p.x, y0 + 0.6, p.z); mon.lookAt(0, y0 + 0.6, 0); R.add(mon);
  const sop = new T.Mesh(new T.BoxGeometry(0.08, 0.06, 0.05), new T.MeshPhongMaterial({ color: 0x9aa0aa })); sop.position.set(p.x, y0 + 0.44, p.z); R.add(sop);
}
/** retoques del plató de las fotos: suelo blanco brillante, aros rosas, paredes con tubos y LED, columnas curvas */
function retocaPlatoFotos(em, osc, lo, marco) {
  const T = _E, R = em.root; const get = n => { const l = []; R.traverse(o => o.name === n && l.push(o)); return l; };
  const blanco = Vt(1024, 1024, (g, w) => { const gr = g.createRadialGradient(w / 2, w / 2, 40, w / 2, w / 2, w / 2); gr.addColorStop(0, '#ffffff'); gr.addColorStop(1, '#dcdce4'); g.fillStyle = gr; g.fillRect(0, 0, w, w); g.strokeStyle = 'rgba(120,120,140,.12)'; g.lineWidth = 2; for (let r = 60; r < w / 2; r += 48) { g.beginPath(); g.arc(w / 2, w / 2, r, 0, 7); g.stroke(); } });
  for (const m of get('suelo')) { m.material.map = blanco; m.material.color.set(0xeeeef4); m.material.specular && m.material.specular.set(0x888899); m.material.shininess = 110; m.material.needsUpdate = true; }
  for (const m of get('plat')) { const top = m.material[1]; if (top) { top.map = blanco; top.color.set(0xf4f4f8); top.shininess = 120; top.needsUpdate = true; } }
  for (const m of get('aroT')) { m.material.color && m.material.color.set(0xff3a78); m.material.needsUpdate = true; }
  const tubo = osc ? '#b05aff' : '#5ab8ff';
  for (const m of get('pared')) {
    const tex = Vt(2048, 256, (g, w, h) => { g.fillStyle = '#05060c'; g.fillRect(0, 0, w, h); for (let y = 30; y < h; y += 58) { const gr = g.createLinearGradient(0, y, 0, y + 22); gr.addColorStop(0, '#0a1a3a'); gr.addColorStop(0.5, tubo); gr.addColorStop(1, '#0a1a3a'); g.fillStyle = gr; g.fillRect(0, y, w, 22); } for (let x = 6; x < w; x += 14) for (let y = 8; y < h; y += 14) { g.fillStyle = (x + y) % 28 ? 'rgba(120,200,255,.35)' : 'rgba(255,255,255,.5)'; g.fillRect(x, y, 3, 3); } });
    m.material.emissiveMap = tex; m.material.needsUpdate = true;
  }
  // columnas curvas blancas con luz rosa a los lados de la pantalla grande
  const colMat = new T.MeshLambertMaterial({ color: 0xf8f0f4, emissive: 0x5a3040, side: T.DoubleSide }), luz = new T.MeshBasicMaterial({ color: 0xff5aa0 });
  for (const a of [Math.PI + 0.85 - 0.42, Math.PI + 0.85 + 0.42, Math.PI - 0.62 - 0.32, Math.PI - 0.62 + 0.32]) {
    const curva = new T.Mesh(new T.CylinderGeometry(10.9, 10.9, 7.2, 12, 1, true, a - 0.05, 0.1), colMat); curva.position.y = 3.6; R.add(curva);
    const tira = new T.Mesh(new T.CylinderGeometry(10.85, 10.85, 7.0, 6, 1, true, a - 0.012, 0.024), luz); tira.position.y = 3.6; R.add(tira);
  }
}
/** 2011-2021: los tableros laterales de premios del plató muestran la tabla clásica (10 cifras + comodines), no la de 2021 */
function clasicaPremiosEnPlato(eng, clasica) {
  const st = eng && eng.studio; if (!st || !st.prizeBoards) return; const tex = PANT.texPremios(); let n = 0;
  for (const b of st.prizeBoards) {
    const m = b.children && b.children[0]; if (!m || !m.material || !m.material.map) continue;
    if (clasica && m.material.map !== tex) { m.userData.mapOrig = m.material.map; m.material.map = tex; m.material.needsUpdate = true; if (b.children[3]) { b.children[3].userData.visOrig = b.children[3].visible; b.children[3].visible = false; b.children[3].scale.setScalar(0.0001); } n++; }
    else if (!clasica && m.userData.mapOrig) { m.material.map = m.userData.mapOrig; delete m.userData.mapOrig; m.material.needsUpdate = true; if (b.children[3]) { b.children[3].visible = true; b.children[3].scale.setScalar(1); } }
  }
  typeof mec === 'function' && mec('tablero premios ' + (clasica ? 'clasico' : '2021') + ' ' + n);
}
