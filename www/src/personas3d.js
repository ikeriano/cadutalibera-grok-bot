// ===================================================================================================
// Personas 3D · personajes «de persona» (low-poly procedurales con texturas horneadas en canvas) para
// los juegos de Iker. Caras inventadas (no son gente real): piel, pelo, barbas, gafas, ropa y cuerpos
// variados, con respiración, parpadeo, movimiento de labios al hablar y público con caras.
// Uso: const P3D = p3dLib(THREE); P3D.persona({seed, g:'m'|'f', shirt, ...}) → figura con la misma
// interfaz que los monigotes {root, body, legL, legR, armL, armR, head}. Ajuste: localStorage
// 'personajes3d' = 'monigotes' | 'personas'.
// ===================================================================================================
function p3dLib(T) {
  if (p3dLib._api) return p3dLib._api;
  const MOVIL = /Android|iPhone|iPad|Mobile/i.test(navigator.userAgent);
  const hashS = s => { let h = 2166136261; s = String(s); for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619); h ^= h >>> 16; h = Math.imul(h, 0x85ebca6b); h ^= h >>> 13; h = Math.imul(h, 0xc2b2ae35); h ^= h >>> 16; return h >>> 0; };
  const rng = seed => { let a = hashS(seed) || 1; const nx = () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; for (let i = 0; i < 7; i++) nx(); return nx; };
  const pick = (r, l) => l[Math.floor(r() * l.length)];
  const hex = n => '#' + (n >>> 0).toString(16).padStart(6, '0').slice(-6);
  const mix = (a, b, t) => { const A = new T.Color(a), B = new T.Color(b); return '#' + A.lerp(B, t).getHexString(); };
  const PIELES = ['#f3d0b4', '#eec19e', '#e3ad86', '#d69b72', '#c3855c', '#a96c47', '#8a5234', '#6a3d26'];
  const PELOS = ['#16110e', '#2a1c13', '#3f2a1b', '#5d3d24', '#86603a', '#b88f55', '#d3b273', '#7d3618', '#8d8780', '#c9c5bd'];
  const OJOS = ['#3b2414', '#4f3018', '#6b4a22', '#5b6a2e', '#3f6d8a', '#2d4f6e', '#6b6f45'];
  const ROPA = [0xd8262e, 0x1f4fb0, 0x2e7d4f, 0xf2f2f2, 0x1a1a1a, 0xf0b428, 0x7a2ad0, 0xff7a1a, 0x2aa8c8, 0x8a8f99, 0xe85a9a, 0x24324f, 0x7a4a2a, 0xb8d8f0];
  const PANTS = [0x22325a, 0x1a1a1e, 0x3a3f4a, 0xb8a582, 0x2b4a7a, 0x4a3a2a];
  const on = () => { try { return localStorage.getItem('personajes3d') === 'personas'; } catch (e) { return false; } };
  const set = v => { try { localStorage.setItem('personajes3d', v ? 'personas' : 'monigotes'); } catch (e) { } };
  // ------------------------------------------------ ficha de la persona ------------------------------------------------
  function ficha(o = {}) {
    const r = rng(o.seed ?? Math.random()), g = o.g === 'f' || o.g === 'm' ? o.g : (r() < 0.5 ? 'f' : 'm');
    const edad = o.edad ?? (r() < 0.2 ? 55 + r() * 20 : 22 + r() * 33);
    let skin = o.skin || pick(r, PIELES);
    let pelo = edad > 58 && r() < 0.75 ? pick(r, PELOS.slice(8)) : pick(r, PELOS.slice(0, 8));
    if (skin >= '#a0' && skin < '#b' || skin < '#a0') pelo = r() < 0.85 ? PELOS[0] : pelo; // pieles oscuras: pelo oscuro casi siempre
    const estilosM = ['corto', 'corto', 'corto', 'raya', 'rizado', 'rapado', edad > 45 ? 'calvo' : 'corto', edad > 50 ? 'entradas' : 'raya'];
    const estilosF = ['largo', 'largo', 'melena', 'coleta', 'rizadoL', 'recogido', 'melena', 'largo'];
    const f = {
      g, edad, skin, pelo, ojos: pick(r, OJOS), estilo: o.pelo || (g === 'm' ? pick(r, estilosM) : pick(r, estilosF)),
      barba: g === 'm' ? (o.barba ?? pick(r, ['no', 'no', 'no', 'sombra', 'sombra', 'perilla', 'completa', 'bigote', edad > 45 ? 'completa' : 'sombra'])) : 'no',
      gafas: o.gafas ?? (r() < (edad > 45 ? 0.45 : 0.18)), ancho: o.ancho ?? (0.92 + r() * 0.26), barriga: o.barriga ?? (g === 'm' && edad > 38 && r() < 0.45 ? 0.02 + r() * 0.05 : r() * 0.012),
      alto: o.alto ?? ((g === 'm' ? 1.0 : 0.95) * (0.96 + r() * 0.08)), cejas: 0, labios: g === 'f' ? pick(r, ['#b2424e', '#c2565a', '#a8384a', '#c06868', '#9c4a4a']) : null,
      prenda: o.prenda || (g === 'm' ? pick(r, ['polo', 'camisa', 'camiseta', 'jersey', 'americana', 'camisa']) : pick(r, ['blusa', 'camiseta', 'jersey', 'vestido', 'americana', 'blusa'])),
      shirt: o.shirt != null ? o.shirt : pick(r, ROPA), pants: o.pants != null ? o.pants : pick(r, PANTS), falda: o.falda ?? (g === 'f' && r() < 0.35),
      r, seed: o.seed
    };
    f.cejasCol = f.pelo === PELOS[8] || f.pelo === PELOS[9] ? mix(f.pelo, '#3a3a3a', 0.4) : mix(f.pelo, '#000', 0.25);
    f.barbaCol = mix(f.pelo, '#000', 0.1);
    if (f.prenda === 'vestido') f.falda = true;
    return Object.assign(f, o.extra || {});
  }
  // ------------------------------------------------ cara (textura equirectangular) ------------------------------------------------
  // lon 0 = frente; lat 0 = altura de los ojos aprox. x = W(0.5 + lon/360), y = H(0.5 - lat/180) con H = W/2
  function pintaCara(g, W, H, f, st, base) {
    const k = W / 360, X = lon => W * (0.5 + lon / 360), Y = lat => H * (0.5 - lat / 180);
    const el = (lon, lat, rx, ry, fill, rot = 0) => { g.save(); g.translate(X(lon), Y(lat)); g.scale(1 / Math.cos(lat * Math.PI / 180), 1); g.rotate(rot); g.beginPath(); g.ellipse(0, 0, rx * k, ry * k, 0, 0, Math.PI * 2); g.fillStyle = fill; g.fill(); g.restore(); };
    const skin = base || f.skin, sk = new T.Color(skin);
    const osc = (c, t) => mix(skin, c, t);
    g.fillStyle = skin; g.fillRect(0, 0, W, H);
    // volumen suave: mejillas, sienes, ojeras, barbilla
    const rad = (lon, lat, r, col, a) => { const gr = g.createRadialGradient(X(lon), Y(lat), 0, X(lon), Y(lat), r * k); gr.addColorStop(0, col.replace('A', a)); gr.addColorStop(1, col.replace('A', 0)); g.fillStyle = gr; g.fillRect(X(lon) - r * k, Y(lat) - r * k, 2 * r * k, 2 * r * k); };
    rad(-27, -14, 16, 'rgba(220,90,90,A)', f.g === 'f' ? 0.22 : 0.1); rad(27, -14, 16, 'rgba(220,90,90,A)', f.g === 'f' ? 0.22 : 0.1);
    rad(-17, 3, 12, 'rgba(60,30,20,A)', 0.16); rad(17, 3, 12, 'rgba(60,30,20,A)', 0.16);
    rad(0, -48, 18, 'rgba(255,255,255,A)', 0.06); rad(0, 30, 26, 'rgba(255,255,255,A)', 0.07);
    rad(-58, 0, 30, 'rgba(70,35,25,A)', 0.22); rad(58, 0, 30, 'rgba(70,35,25,A)', 0.22); rad(0, -72, 16, 'rgba(60,30,20,A)', 0.1);
    // arrugas
    if (f.edad > 45) {
      g.strokeStyle = 'rgba(70,35,25,' + Math.min(0.35, (f.edad - 45) / 60) + ')'; g.lineWidth = Math.max(1, k * 0.5);
      for (const la of [30, 34.5, 39]) { g.beginPath(); g.moveTo(X(-16), Y(la)); g.quadraticCurveTo(X(0), Y(la + 1.5), X(16), Y(la)); g.stroke(); }
      for (const s of [-1, 1]) { g.beginPath(); g.moveTo(X(s * 7), Y(-12)); g.quadraticCurveTo(X(s * 14), Y(-20), X(s * 13), Y(-30)); g.stroke(); for (const d of [0, 2.5]) { g.beginPath(); g.moveTo(X(s * 29), Y(5 + d)); g.lineTo(X(s * 34), Y(6 + d * 1.6)); g.stroke(); } }
    }
    // barba / sombra (antes que la boca)
    if (f.barba !== 'no' && f.barba) {
      const col = new T.Color(f.barbaCol), r = rng((f.seed || '') + 'barba');
      const zona = (lon, lat) => {
        const jaw = lat < -14 && Math.abs(lon) < 50 - Math.max(0, lat + 50) * 0 && lat > -62 && Math.abs(lon) < 46;
        const lab = Math.abs(lon) < 11 && lat < -19 && lat > -31; // labios libres
        const mej = lat >= -14 && lat < -4 && Math.abs(lon) > 30 && Math.abs(lon) < 48;
        if (f.barba === 'perilla') return !lab && ((Math.abs(lon) < 12 && lat < -18 && lat > -50) || (Math.abs(lon) < 13 && lat > -21 && lat < -16));
        if (f.barba === 'bigote') return !lab && Math.abs(lon) < 13 && lat > -21 && lat < -15.5;
        return !lab && (jaw || mej || (lat >= -21 && lat < -15.5 && Math.abs(lon) < 13));
      };
      const dens = f.barba === 'sombra' ? 0.18 : 0.75, n = Math.floor(W * H * (f.barba === 'sombra' ? 0.25 : 0.5));
      g.fillStyle = `rgba(${col.r * 255 | 0},${col.g * 255 | 0},${col.b * 255 | 0},${dens})`;
      if (f.barba !== 'sombra') { // base continua
        for (let y = 0; y < H; y += 2) for (let x = W * 0.33 | 0; x < W * 0.67; x += 2) { const lon = (x / W - 0.5) * 360, lat = 90 - y / H * 180; if (zona(lon, lat)) g.fillRect(x, y, 2, 2); }
      }
      g.fillStyle = `rgba(${col.r * 200 | 0},${col.g * 200 | 0},${col.b * 200 | 0},${f.barba === 'sombra' ? 0.22 : 0.5})`;
      for (let i = 0; i < n * 0.08; i++) { const lon = (r() - 0.5) * 100, lat = -4 - r() * 60; if (zona(lon, lat)) g.fillRect(X(lon), Y(lat), Math.max(1, k * 0.45), Math.max(1, k * (f.barba === 'sombra' ? 0.45 : 1.2))); }
    }
    // nariz: sombras y aletas (la punta es geometría)
    el(-3, -14, 1.3, 0.8, osc('#2a120a', 0.45)); el(3, -14, 1.3, 0.8, osc('#2a120a', 0.45));
    rad(-5.5, -7, 5, 'rgba(70,35,25,A)', 0.18); rad(5.5, -7, 5, 'rgba(70,35,25,A)', 0.18);
    // ojos
    const ojo = (s) => {
      const cx = s * 17, cy = 4, E = 1.25; g.save(); g.translate(X(cx), Y(cy)); g.scale(E, E); g.translate(-X(cx), -Y(cy));
      if (st.blink) {
        g.strokeStyle = osc('#1b0d08', 0.75); g.lineWidth = Math.max(1, k * 0.8); g.beginPath(); g.moveTo(X(cx - 6.5), Y(cy)); g.quadraticCurveTo(X(cx), Y(cy - 2.2), X(cx + 6.5), Y(cy)); g.stroke(); g.restore();
        return;
      }
      g.save(); g.beginPath(); g.moveTo(X(cx - 6.5), Y(cy)); g.quadraticCurveTo(X(cx), Y(cy + 4.6), X(cx + 6.5), Y(cy + 0.4)); g.quadraticCurveTo(X(cx), Y(cy - 3.6), X(cx - 6.5), Y(cy)); g.closePath();
      g.fillStyle = '#f2ece6'; g.fill(); g.clip();
      el(cx, cy + 0.3, 3.1, 3.1, f.ojos); el(cx, cy + 0.3, 1.9, 1.9, mix(f.ojos, '#000', 0.35)); el(cx, cy + 0.3, 1.25, 1.25, '#0a0606'); el(cx + 0.9, cy + 1.3, 0.6, 0.6, 'rgba(255,255,255,.9)');
      const gr = g.createLinearGradient(0, Y(cy + 4), 0, Y(cy)); gr.addColorStop(0, 'rgba(60,30,20,.45)'); gr.addColorStop(1, 'rgba(60,30,20,0)'); g.fillStyle = gr; g.fillRect(X(cx - 7), Y(cy + 4.6), 14 * k, 4 * k);
      g.restore();
      g.strokeStyle = f.g === 'f' ? '#120806' : osc('#1b0d08', 0.8); g.lineWidth = Math.max(1, k * (f.g === 'f' ? 1.1 : 0.75)); g.beginPath(); g.moveTo(X(cx - 6.8), Y(cy - 0.2)); g.quadraticCurveTo(X(cx), Y(cy + 4.8), X(cx + 6.8), Y(cy + 0.6)); g.stroke();
      g.strokeStyle = osc('#5a2a1a', 0.35); g.lineWidth = Math.max(1, k * 0.5); g.beginPath(); g.moveTo(X(cx - 5.5), Y(cy - 1.2)); g.quadraticCurveTo(X(cx), Y(cy - 3.8), X(cx + 5.5), Y(cy - 0.6)); g.stroke();
      g.strokeStyle = osc('#3a1a10', 0.3); g.beginPath(); g.moveTo(X(cx - 6), Y(cy + 6.6)); g.quadraticCurveTo(X(cx), Y(cy + 8.5), X(cx + 6), Y(cy + 6.6)); g.stroke(); // pliegue del párpado
      g.restore();
    };
    ojo(-1); ojo(1);
    // cejas
    g.strokeStyle = f.cejasCol; g.lineCap = 'round';
    for (const s of [-1, 1]) {
      g.lineWidth = k * (f.g === 'f' ? 1.6 : 2.6); g.beginPath(); g.moveTo(X(s * 8.5), Y(13.5)); g.quadraticCurveTo(X(s * 17), Y(17.5 + (f.g === 'f' ? 1 : 0)), X(s * 26), Y(13.8)); g.stroke();
    }
    // boca
    const lab = f.labios || osc('#9a3a3a', 0.42), mo = st.mouth || 0, my = -24;
    if (mo > 0) {
      const h = mo === 1 ? 2.4 : 4.6;
      el(0, my - h * 0.35, 8.2, h, '#3a0c0c');
      g.save(); g.beginPath(); g.ellipse(X(0), Y(my - h * 0.35), 8.2 * k, h * k, 0, 0, Math.PI * 2); g.clip(); g.fillStyle = '#f1ece4'; g.fillRect(X(-7), Y(my + 1.2), 14 * k, 1.9 * k); el(0, my - h * 1.1, 5, 1.8, '#a24a4a'); g.restore();
      el(0, my + 1.2, 9.5, 1.5, lab); el(0, my - h * 0.35 - h - 0.6, 7.6, 1.9, mix(lab, '#fff', 0.08));
    } else {
      g.save(); g.translate(X(0), Y(my)); g.beginPath(); g.moveTo(-10 * k, 0); g.bezierCurveTo(-5 * k, -3.3 * k, -1.5 * k, -2.6 * k, 0, -2.0 * k); g.bezierCurveTo(1.5 * k, -2.6 * k, 5 * k, -3.3 * k, 10 * k, 0); g.bezierCurveTo(5 * k, 0.6 * k, -5 * k, 0.6 * k, -10 * k, 0); g.fillStyle = mix(lab, '#000', 0.12); g.fill();
      g.beginPath(); g.moveTo(-9.5 * k, 0.2 * k); g.bezierCurveTo(-5 * k, 4.4 * k, 5 * k, 4.4 * k, 9.5 * k, 0.2 * k); g.closePath(); g.fillStyle = lab; g.fill();
      g.strokeStyle = 'rgba(40,10,10,.75)'; g.lineWidth = Math.max(1, k * 0.55); g.beginPath(); g.moveTo(-10 * k, 0); g.quadraticCurveTo(0, 1.2 * k, 10 * k, 0); g.stroke();
      g.fillStyle = 'rgba(255,255,255,.22)'; g.beginPath(); g.ellipse(0, 2.2 * k, 3.5 * k, 0.8 * k, 0, 0, 7); g.fill(); g.restore();
    }
    rad(0, -33, 5, 'rgba(70,35,25,A)', 0.12); // hoyuelo bajo el labio
    g.fillStyle = mix(skin, '#6a3020', 0.1); g.fillRect(X(160), Y(-50), X(178) - X(160), Y(-70) - Y(-50)); // muestra para nariz y orejas
    // pelo pintado en el cuero cabelludo (debajo de la geometría de pelo)
    if (f.estilo !== 'calvo') { g.fillStyle = mix(f.pelo, skin, f.estilo === 'rapado' ? 0.55 : 0.15); g.fillRect(0, 0, W, Y(f.estilo === 'entradas' ? 50 : 44)); g.fillRect(0, 0, X(-95), Y(-25)); g.fillRect(X(95), 0, W - X(95), Y(-25)); }
    else { g.fillStyle = mix(f.pelo, skin, 0.35); g.fillRect(0, Y(20), X(-80), Y(-25) - Y(20)); g.fillRect(X(80), Y(20), W - X(80), Y(-25) - Y(20)); }
  }
  function canvas(w, h) { const c = document.createElement('canvas'); c.width = w; c.height = h; return c; }
  function texDe(c) { const t = new T.CanvasTexture(c); t.colorSpace = T.SRGBColorSpace; t.anisotropy = 4; return t; }
  function caras(f, W) {
    const H = W / 2, mk = st => { const c = canvas(W, H); pintaCara(c.getContext('2d'), W, H, f, st); return texDe(c); };
    return { base: mk({}), blink: mk({ blink: 1 }), m1: mk({ mouth: 1 }), m2: mk({ mouth: 2 }) };
  }
  // ------------------------------------------------ geometrías ------------------------------------------------
  const pintar = (geo, col) => { const c = new T.Color(col), n = geo.attributes.position.count, a = new Float32Array(n * 3); for (let i = 0; i < n; i++) { a[i * 3] = c.r; a[i * 3 + 1] = c.g; a[i * 3 + 2] = c.b; } geo.setAttribute('color', new T.BufferAttribute(a, 3)); return geo; };
  const uvFijo = (geo, u, v) => { const a = geo.attributes.uv; for (let i = 0; i < a.count; i++) a.setXY(i, u, v); return geo; };
  const nonIdx = g => g; // todas indexadas
  const merge = l => {
    const keys = ['position', 'normal', 'uv', 'color'].filter(k => l.every(g => g.attributes[k]));
    l.forEach(g => Object.keys(g.attributes).forEach(k => keys.includes(k) || g.deleteAttribute(k)));
    return T.BufferGeometryUtils ? T.BufferGeometryUtils.mergeGeometries(l) : p3dMerge(l);
  };
  function p3dMerge(l) { // mezcla mínima (posición, normal, uv, color) para geometrías indexadas
    const keys = Object.keys(l[0].attributes), out = new T.BufferGeometry(); let nv = 0; const idx = [];
    for (const g of l) { const ix = g.index ? g.index.array : [...Array(g.attributes.position.count).keys()]; for (const i of ix) idx.push(i + nv); nv += g.attributes.position.count; }
    for (const k of keys) { const s = l[0].attributes[k].itemSize, a = new Float32Array(nv * s); let o = 0; for (const g of l) { const at = g.attributes[k]; for (let i = 0; i < at.count; i++) for (let j = 0; j < s; j++) a[o++] = at.array[i * s + j]; } out.setAttribute(k, new T.BufferAttribute(a, s)); }
    out.setIndex(idx); return out;
  }
  function cabezaGeo(R, segs = 28, rings = 20) {
    const g = new T.SphereGeometry(R, segs, rings); g.rotateY(-Math.PI / 2);
    const p = g.attributes.position, v = new T.Vector3();
    for (let i = 0; i < p.count; i++) {
      v.fromBufferAttribute(p, i).divideScalar(R);
      let { x, y, z } = v;
      if (y < 0) { const t = Math.pow(-y, 1.4); x *= 1 - 0.24 * t; z *= 1 - (z < 0 ? 0.35 : 0.08) * t; } // mandíbula
      if (z < 0) z *= 1.1; else z *= 0.93; // cráneo hacia atrás, cara plana
      if (z > 0.55 && y > -0.35 && y < 0.15 && Math.abs(x) > 0.3) z -= 0.05 * (1 - Math.abs(y + 0.1) * 3); // cuencas
      if (z > 0.5 && y < -0.62 && Math.abs(x) < 0.35) z += 0.04; // barbilla
      p.setXYZ(i, x * R * 0.84, y * R * 1.08, z * R * 0.98);
    }
    g.computeVertexNormals(); return g;
  }
  function narizGeo(R) {
    const n = new T.SphereGeometry(R * 0.13, 10, 8); n.scale(0.6, 1.6, 0.8);
    const p = n.attributes.position; for (let i = 0; i < p.count; i++) { const y = p.getY(i), z = p.getZ(i); if (z > 0) p.setZ(i, z * (1 + Math.max(0, -y) / (R * 0.3))); } n.computeVertexNormals();
    n.rotateX(-0.3); n.translate(0, -R * 0.1, R * 0.86);
    const t = new T.SphereGeometry(R * 0.07, 10, 8); t.scale(1.1, 0.85, 0.9); t.translate(0, -R * 0.24, R * 0.97);
    const a1 = new T.SphereGeometry(R * 0.06, 8, 6), a2 = a1.clone(); a1.translate(-R * 0.085, -R * 0.26, R * 0.9); a2.translate(R * 0.085, -R * 0.26, R * 0.9);
    return [n, t, a1, a2];
  }
  function orejasGeo(R) { const l = []; for (const s of [-1, 1]) { const o = new T.SphereGeometry(R * 0.26, 10, 8); o.scale(0.32, 1, 0.68); o.rotateY(s * 0.35); o.translate(s * R * 0.84, -R * 0.05, -R * 0.06); l.push(o); } return l; }
  let _pelTex = null;
  function pelTex() {
    if (_pelTex) return _pelTex; const c = canvas(128, 128), g = c.getContext('2d'); g.fillStyle = '#d8d8d8'; g.fillRect(0, 0, 128, 128);
    const r = rng('pelo'); for (let i = 0; i < 900; i++) { const x = r() * 128, y = r() * 128, l = 6 + r() * 22, s = r(); g.strokeStyle = s < 0.5 ? 'rgba(0,0,0,.28)' : 'rgba(255,255,255,.35)'; g.lineWidth = 0.6 + r(); g.beginPath(); g.moveTo(x, y); g.lineTo(x + (r() - 0.5) * 3, y + l); g.stroke(); }
    _pelTex = texDe(c); _pelTex.wrapS = _pelTex.wrapT = T.RepeatWrapping; _pelTex.repeat.set(3, 2); return _pelTex;
  }
  function peloGeo(f, R) {
    const l = [], e = f.estilo, r = rng((f.seed || '') + 'pelo');
    const casco = (alto = 0.5, tilt = -0.55, esc = 1.07) => { tilt -= 0.28; const s = new T.SphereGeometry(R * esc, 26, 12, 0, Math.PI * 2, 0, Math.PI * alto); s.scale(0.85, 1.08, 1.02); s.rotateX(tilt); s.translate(0, R * 0.02, -R * 0.04); return s; };
    const nuca = (bajo = 0.72) => { const s = new T.SphereGeometry(R * 1.05, 20, 8, Math.PI + 0.35, Math.PI - 0.7, Math.PI * 0.3, Math.PI * (bajo - 0.3)); s.scale(0.85, 1.08, 1.06); s.translate(0, 0, -R * 0.04); return s; };
    if (e === 'calvo') { const s = new T.SphereGeometry(R * 1.02, 22, 6, Math.PI + 0.1, Math.PI - 0.2, Math.PI * 0.42, Math.PI * 0.2); s.scale(0.86, 1.08, 1.08); l.push(s); return l; }
    if (e === 'rapado') { l.push(casco(0.5, -0.5, 1.025), nuca(0.66)); return l; }
    if (e === 'entradas') { l.push(casco(0.42, -0.85, 1.05), nuca(0.7)); return l; }
    if (e === 'corto' || e === 'raya' || e === 'rizado') {
      const c = casco(0.5, -0.5, e === 'rizado' ? 1.12 : 1.08);
      if (e === 'rizado' || e === 'raya') { const p = c.attributes.position; for (let i = 0; i < p.count; i++) { const x = p.getX(i), y = p.getY(i), z = p.getZ(i); const n = e === 'rizado' ? 1 + 0.06 * Math.sin(x * 140) * Math.sin(y * 150) * Math.sin(z * 130) : 1 + (y > R * 0.6 ? 0.06 : 0) + (z > 0 && y > R * 0.3 ? 0.04 : 0); p.setXYZ(i, x * n, y * n, z * n); } c.computeVertexNormals(); }
      l.push(c, nuca(0.7)); return l;
    }
    // mujeres
    const c = casco(0.52, -0.42, 1.09); l.push(c, nuca(0.78));
    const lado = (s, largo) => { const p = new T.CylinderGeometry(R * 0.32, R * 0.42, largo, 10, 4, true, 0, Math.PI * 2); p.scale(0.55, 1, 1); p.translate(s * R * 0.78, -largo / 2 + R * 0.3, -R * 0.12); return p; };
    if (e === 'largo' || e === 'rizadoL') {
      const larg = R * (2.6 + r() * 0.8); const b = new T.CylinderGeometry(R * 0.95, R * 1.25, larg, 18, 5, true, Math.PI / 2 + 0.05, Math.PI - 0.1); b.translate(0, -larg / 2 + R * 0.2, -R * 0.15);
      l.push(b, lado(-1, larg * 0.8), lado(1, larg * 0.8));
      if (e === 'rizadoL') l.forEach(g => { const p = g.attributes.position; for (let i = 0; i < p.count; i++) { const x = p.getX(i), y = p.getY(i), z = p.getZ(i), n = 1 + 0.07 * Math.sin(y * 90 + x * 40); p.setXYZ(i, x * n, y, z * n); } g.computeVertexNormals(); });
    } else if (e === 'melena') {
      const larg = R * 1.7; const b = new T.CylinderGeometry(R * 0.98, R * 1.12, larg, 18, 3, true, Math.PI / 2 + 0.05, Math.PI - 0.1); b.translate(0, -larg / 2 + R * 0.25, -R * 0.12); l.push(b, lado(-1, larg * 0.95), lado(1, larg * 0.95));
    } else if (e === 'coleta') {
      const m = new T.SphereGeometry(R * 0.3, 12, 10); m.translate(0, R * 0.25, -R * 1.1); const cola = new T.CylinderGeometry(R * 0.22, R * 0.08, R * 2, 10); cola.rotateX(0.35); cola.translate(0, -R * 0.65, -R * 1.25); l.push(m, cola);
    } else if (e === 'recogido') { const m = new T.SphereGeometry(R * 0.42, 14, 10); m.translate(0, R * 0.65, -R * 0.75); l.push(m); }
    const fl = new T.SphereGeometry(R * 1.1, 18, 6, Math.PI * 0.08, Math.PI * 0.84, Math.PI * 0.18, Math.PI * 0.16); fl.rotateY(Math.PI); fl.scale(0.86, 1.08, 1.0); fl.rotateX(-0.12); l.push(fl); // flequillo
    return l;
  }
  function gafasGeo(R) {
    const l = []; for (const s of [-1, 1]) { const t = new T.TorusGeometry(R * 0.17, R * 0.022, 6, 18); t.scale(1.15, 0.85, 1); t.translate(s * R * 0.31, R * 0.08, R * 1.02); l.push(t); const p = new T.CylinderGeometry(R * 0.018, R * 0.018, R * 0.85, 5); p.rotateX(Math.PI / 2); p.translate(s * R * 0.6, R * 0.1, R * 0.55); l.push(p); }
    const pu = new T.CylinderGeometry(R * 0.018, R * 0.018, R * 0.22, 5); pu.rotateZ(Math.PI / 2); pu.translate(0, R * 0.11, R * 1.04); l.push(pu); return l;
  }
  // ropa: textura del torso (u=0.5 delante)
  function pintaTorso(f, W, H, y0, y1, o) {
    const c = canvas(W, H), g = c.getContext('2d'), Yv = y => H * (1 - (y - y0) / (y1 - y0)), sh = hex(f.shirt), dark = mix(sh, '#000', 0.25), X = u => u * W;
    g.fillStyle = sh; g.fillRect(0, 0, W, H);
    const gr = g.createLinearGradient(0, 0, W, 0); gr.addColorStop(0, 'rgba(0,0,0,.18)'); gr.addColorStop(0.3, 'rgba(0,0,0,0)'); gr.addColorStop(0.7, 'rgba(0,0,0,0)'); gr.addColorStop(1, 'rgba(0,0,0,.18)'); g.fillStyle = gr; g.fillRect(0, 0, W, H);
    // arrugas de tela
    const r = rng((f.seed || '') + 'tela'); g.strokeStyle = 'rgba(0,0,0,.07)'; g.lineWidth = 2; for (let i = 0; i < 14; i++) { const x = r() * W, y = Yv(0.95 + r() * 0.4); g.beginPath(); g.moveTo(x, y); g.quadraticCurveTo(x + 10, y - 8, x + 22, y - 2); g.stroke(); }
    const piel = f.skin, cuello = Yv(1.5);
    if (f.prenda === 'americana' || o.traje) {
      const camisa = o.camisa != null ? hex(o.camisa) : '#f4f4f4', traje = o.traje != null ? hex(o.traje) : sh;
      g.fillStyle = traje; g.fillRect(0, 0, W, H); g.fillStyle = gr; g.fillRect(0, 0, W, H);
      g.fillStyle = camisa; g.beginPath(); g.moveTo(X(0.43), cuello - 2); g.lineTo(X(0.57), cuello - 2); g.lineTo(X(0.5), Yv(1.12)); g.closePath(); g.fill();
      if (o.corbata != null) { g.fillStyle = hex(o.corbata); g.beginPath(); g.moveTo(X(0.49), Yv(1.47)); g.lineTo(X(0.51), Yv(1.47)); g.lineTo(X(0.515), Yv(1.2)); g.lineTo(X(0.5), Yv(1.15)); g.lineTo(X(0.485), Yv(1.2)); g.closePath(); g.fill(); g.fillStyle = mix(hex(o.corbata), '#000', 0.2); g.fillRect(X(0.488), Yv(1.5), X(0.024), Yv(1.47) - Yv(1.5)); }
      g.fillStyle = mix(traje, '#000', 0.3); for (const s of [-1, 1]) { g.beginPath(); g.moveTo(X(0.5 + s * 0.07), cuello - 2); g.lineTo(X(0.5 + s * 0.12), Yv(1.36)); g.lineTo(X(0.5 + s * 0.07), Yv(1.33)); g.lineTo(X(0.5), Yv(1.1)); g.closePath(); g.fill(); }
      g.strokeStyle = mix(traje, '#000', 0.45); g.lineWidth = 2; g.beginPath(); g.moveTo(X(0.5), Yv(1.1)); g.lineTo(X(0.505), Yv(0.86)); g.stroke(); g.fillStyle = mix(traje, '#000', 0.5); for (const y of [1.05, 0.95]) { g.beginPath(); g.arc(X(0.51), Yv(y), 2.5, 0, 7); g.fill(); }
      g.fillStyle = 'rgba(0,0,0,.25)'; g.fillRect(X(0.6), Yv(1.33), X(0.07), 3); g.fillRect(X(0.33), Yv(1.0), X(0.08), 3); g.fillRect(X(0.59), Yv(1.0), X(0.08), 3);
    } else if (f.prenda === 'polo' || f.prenda === 'camisa' || f.prenda === 'blusa') {
      g.fillStyle = piel; g.beginPath(); g.moveTo(X(0.46), cuello); g.lineTo(X(0.54), cuello); g.lineTo(X(0.5), Yv(f.prenda === 'blusa' ? 1.36 : 1.4)); g.closePath(); g.fill();
      g.fillStyle = dark; for (const s of [-1, 1]) { g.beginPath(); g.moveTo(X(0.5 + s * 0.035), cuello - 3); g.lineTo(X(0.5 + s * 0.11), cuello + 4); g.lineTo(X(0.5 + s * 0.09), Yv(1.43)); g.lineTo(X(0.5 + s * 0.012), Yv(1.39)); g.closePath(); g.fill(); }
      g.strokeStyle = dark; g.lineWidth = 2; g.beginPath(); g.moveTo(X(0.5), Yv(1.4)); g.lineTo(X(0.5), f.prenda === 'polo' ? Yv(1.3) : Yv(0.86)); g.stroke();
      g.fillStyle = mix(sh, '#fff', 0.5); for (let y = 1.36; y > (f.prenda === 'polo' ? 1.3 : 0.9); y -= 0.08) { g.beginPath(); g.arc(X(0.505), Yv(y), 2, 0, 7); g.fill(); }
      if (f.prenda === 'camisa') { g.strokeStyle = 'rgba(0,0,0,.18)'; g.strokeRect(X(0.56), Yv(1.32), X(0.06), Yv(1.24) - Yv(1.32)); }
    } else { // camiseta / jersey / vestido: cuello redondo
      g.fillStyle = piel; g.beginPath(); g.ellipse(X(0.5), cuello, X(f.prenda === 'vestido' ? 0.09 : 0.06), (Yv(1.42) - cuello), 0, 0, 7); g.fill();
      g.strokeStyle = dark; g.lineWidth = 4; g.beginPath(); g.ellipse(X(0.5), cuello, X(f.prenda === 'vestido' ? 0.09 : 0.06), (Yv(1.42) - cuello), 0, 0, Math.PI); g.stroke();
      if (f.prenda === 'jersey') { g.fillStyle = 'rgba(0,0,0,.08)'; for (let x = 0; x < W; x += 6) g.fillRect(x, 0, 2, H); g.fillStyle = dark; g.fillRect(0, Yv(0.92), W, Yv(0.86) - Yv(0.92)); }
      if (f.prenda === 'camiseta' && r() < 0.5) { g.fillStyle = mix(sh, r() < 0.5 ? '#fff' : '#000', 0.45); g.fillRect(X(0.42), Yv(1.3), X(0.16), Yv(1.12) - Yv(1.3)); }
    }
    // cintura: pantalón y cinturón
    if (!f.falda) { g.fillStyle = hex(f.pants); g.fillRect(0, Yv(0.9), W, H); g.fillStyle = '#1a120c'; g.fillRect(0, Yv(0.91), W, Yv(0.88) - Yv(0.91)); g.fillStyle = '#c8b070'; g.fillRect(X(0.48), Yv(0.91), X(0.04), Yv(0.88) - Yv(0.91)); }
    return texDe(c);
  }
  // ------------------------------------------------ figura completa ------------------------------------------------
  const vivos = new Set();
  function persona(o = {}) {
    const f = ficha(o), R = 0.118, hi = o.hiRes ? (MOVIL ? 768 : 1024) : (MOVIL ? 512 : 768);
    const cuerpoMat = new T.MeshLambertMaterial({ vertexColors: true, emissive: 0x161616 });
    const caraT = caras(f, hi);
    const caraMat = new T.MeshLambertMaterial({ map: caraT.base, emissive: 0x141414 });
    const root = new T.Group(), body = new T.Group(); root.add(body); root.name = 'persona3d'; body.scale.setScalar(f.alto);
    const w = f.ancho * (f.g === 'f' ? 0.9 : 1), bar = f.barriga;
    // torso (torno) con textura de ropa
    const y0 = 0.8, y1 = 1.53, pts = [], N = 14;
    const rad = y => { // radio por altura
      const t = (y - y0) / (y1 - y0);
      let r = f.g === 'f' ? 0.155 - 0.03 * Math.sin(Math.min(1, t / 0.5) * Math.PI) * 1 + 0.018 * Math.exp(-Math.pow((t - 0.66) / 0.1, 2)) : 0.15 + 0.03 * t;
      r += bar * Math.exp(-Math.pow((t - 0.3) / 0.22, 2));
      if (t > 0.86) r *= Math.cos((t - 0.86) / 0.14 * Math.PI / 2) * 0.62 + 0.38; // hombros redondeados hasta el cuello
      return Math.max(0.05, r * w);
    };
    for (let i = 0; i <= N; i++) { const y = y0 + (y1 - y0) * i / N; pts.push(new T.Vector2(rad(y), y)); }
    const tg = new T.LatheGeometry(pts, 22, Math.PI); tg.scale(1, 1, 0.62 + bar * 1.5);
    pintar(tg, '#ffffff');
    const torsoMat = new T.MeshLambertMaterial({ map: pintaTorso(f, 256, 256, y0, y1, o), emissive: 0x121212 });
    const torso = new T.Mesh(tg, torsoMat); body.add(torso);
    // falda / vestido
    if (f.falda) { const fg = new T.CylinderGeometry(0.16 * w, 0.25 * w, 0.42, 18, 1, true); fg.translate(0, 0.72, 0); fg.scale(1, 1, 0.8); const fm = new T.Mesh(fg, new T.MeshLambertMaterial({ color: f.prenda === 'vestido' ? f.shirt : f.pants, emissive: 0x111111, side: T.DoubleSide })); body.add(fm); }
    // piernas (pivote en la cadera, como los monigotes)
    const pierna = s => {
      const G = new T.Group(); G.position.set(s * 0.085 * w, 0.86, 0);
      const pc = f.falda ? mix(f.skin, '#2a2020', 0.15) : hex(f.pants);
      const muslo = new T.CapsuleGeometry(0.068 * w, 0.32, 4, 10); muslo.translate(0, -0.2, 0); pintar(muslo, pc);
      const gemelo = new T.CapsuleGeometry(0.052, 0.34, 4, 10); gemelo.translate(0, -0.56, -0.005); pintar(gemelo, pc);
      const zap = new T.CapsuleGeometry(0.048, 0.13, 4, 8); zap.rotateX(Math.PI / 2); zap.scale(1.05, 0.75, 1); zap.translate(0, -0.82, 0.045); pintar(zap, f.g === 'f' && f.falda ? '#3a1218' : pick(f.r, ['#1a1410', '#2a1d14', '#efefef', '#3a2a1c']));
      G.add(new T.Mesh(merge([muslo, gemelo, zap]), cuerpoMat)); body.add(G); return G;
    };
    const legL = pierna(-1), legR = pierna(1);
    // brazos (pivote en el hombro)
    const corta = f.prenda === 'camiseta' || f.prenda === 'polo' || (f.prenda === 'vestido' && f.r() < 0.6);
    const mangaCol = o.traje != null ? hex(o.traje) : hex(f.shirt);
    const brazo = s => {
      const G = new T.Group(); G.position.set(s * (0.19 * w + 0.025), 1.43, 0); G.rotation.z = s * 0.12;
      const l = [];
      if (corta) { const m = new T.CapsuleGeometry(0.06, 0.1, 4, 10); m.translate(0, -0.08, 0); l.push(pintar(m, mangaCol)); const b = new T.CapsuleGeometry(0.044, 0.2, 4, 8); b.translate(0, -0.2, 0); l.push(pintar(b, f.skin)); }
      else { const m = new T.CapsuleGeometry(0.056, 0.24, 4, 10); m.translate(0, -0.15, 0); l.push(pintar(m, mangaCol)); }
      const ante = new T.CapsuleGeometry(corta ? 0.04 : 0.047, 0.22, 4, 8); ante.translate(0, -0.41, 0.01); l.push(pintar(ante, corta ? f.skin : mangaCol));
      if (!corta && o.camisa != null) { const pu = new T.CylinderGeometry(0.044, 0.044, 0.03, 10); pu.translate(0, -0.53, 0.01); l.push(pintar(pu, hex(o.camisa))); }
      const mano = new T.SphereGeometry(0.045, 10, 8); mano.scale(0.62, 1.3, 0.95); mano.translate(0, -0.6, 0.012); l.push(pintar(mano, f.skin));
      const pulgar = new T.CapsuleGeometry(0.014, 0.04, 3, 6); pulgar.rotateZ(-s * 0.5); pulgar.translate(-s * 0.0, -0.58, 0.045); l.push(pintar(pulgar, f.skin));
      G.add(new T.Mesh(merge(l), cuerpoMat)); body.add(G); return G;
    };
    const armL = brazo(-1), armR = brazo(1);
    // cabeza: grupo anclaje (lo usa el bocadillo) + grupo interior que respira/mira
    const head = new T.Group(); head.position.y = 1.665; body.add(head);
    const inner = new T.Group(); head.add(inner);
    const sk = [cabezaGeo(R)];
    for (const n of [...narizGeo(R), ...orejasGeo(R)]) sk.push(uvFijo(n, 0.5 + 169 / 360, 0.5 - 60 / 180));
    const cuello = new T.CylinderGeometry(R * 0.44, R * 0.5, R * 1.3, 12, 1, true); cuello.translate(0, -R * 1.1, -R * 0.12); sk.push(uvFijo(cuello, 0.5, 0.64));
    const cab = new T.Mesh(merge(sk), caraMat); inner.add(cab);
    if (f.estilo !== 'calvo' || true) { const pg = peloGeo(f, R); if (pg.length) { const pm = new T.Mesh(merge(pg.map(g => (g.attributes.uv || g.setAttribute('uv', new T.BufferAttribute(new Float32Array(g.attributes.position.count * 2), 2)), g))), new T.MeshLambertMaterial({ color: f.pelo, map: pelTex(), side: T.DoubleSide, emissive: 0x0a0806 })); inner.add(pm); } }
    if (f.gafas) { const gm = new T.Mesh(merge(gafasGeo(R)), new T.MeshLambertMaterial({ color: f.r() < 0.5 ? 0x141414 : 0x5a3a20 })); inner.add(gm); }
    const fig = { root: body ? root : root, body, legL, legR, armL, armR, head, walkPhase: 0, gesture: 0, gestureType: '', t: Math.random() * 10, p3d: { f, inner, caraMat, caraT, torso, blinkT: 1 + Math.random() * 3, blink: 0, mouth: 0, mT: 0, ph: Math.random() * 9, last: performance.now(), lejos: 0 } };
    if (o.mic) { const mg = new T.Group(), a = new T.Mesh(new T.CylinderGeometry(0.018, 0.014, 0.18, 8), new T.MeshLambertMaterial({ color: 0x222222 })), b = new T.Mesh(new T.SphereGeometry(0.036, 10, 8), new T.MeshLambertMaterial({ color: 0x9a9a9a, emissive: 0x222222 })); b.position.y = 0.11; mg.add(a, b); mg.position.set(0, -0.62, 0.05); mg.rotation.x = -0.6; armR.add(mg); }
    vivos.add(fig); arranca(); return fig;
  }
  // ------------------------------------------------ animación (respirar, parpadear, labios) ------------------------------------------------
  let habla = () => false, raf = 0;
  function tick() {
    raf = requestAnimationFrame(tick); const now = performance.now();
    for (const fig of vivos) {
      const p = fig.p3d, dt = Math.min(0.1, (now - p.last) / 1000); p.last = now;
      let enEscena = fig.root.parent; if (!enEscena) { if ((p.lejos += dt) > 30) { vivos.delete(fig); Object.values(p.caraT).forEach(t => t.dispose()); } continue; } p.lejos = 0;
      p.ph += dt; const t = p.ph;
      p.torso.scale.set(1 + Math.sin(t * 1.7) * 0.012, 1, 1 + Math.sin(t * 1.7) * 0.02); // respiración
      const h = habla(fig.head);
      p.inner.rotation.y = Math.sin(t * 0.37) * 0.07 + Math.sin(t * 1.13) * 0.025; p.inner.rotation.x = Math.sin(t * 0.5) * 0.025 + (h ? Math.sin(t * 5.2) * 0.03 : 0); p.inner.rotation.z = Math.sin(t * 0.29) * 0.02;
      p.blinkT -= dt; if (p.blinkT < 0) { p.blink = 0.13; p.blinkT = 2 + Math.random() * 4; } if (p.blink > 0) p.blink -= dt;
      if (h) { p.mT -= dt; if (p.mT <= 0) { const x = Math.random(); p.mouth = p.mouth === 0 ? (x < 0.55 ? 2 : 1) : (x < 0.35 ? 0 : x < 0.65 ? 1 : 2); p.mT = 0.07 + Math.random() * 0.08; } } else p.mouth = 0;
      const m = p.blink > 0 && !p.mouth ? p.caraT.blink : p.mouth === 2 ? p.caraT.m2 : p.mouth === 1 ? p.caraT.m1 : p.caraT.base;
      if (p.caraMat.map !== m) { p.caraMat.map = m; }
    }
  }
  function arranca() { if (!raf) raf = requestAnimationFrame(tick); }
  // ------------------------------------------------ público: atlas de 8 caras sobre piel blanca (la tiñe el color de instancia) ------------------------------------------------
  let _atlas = null;
  function atlasPublico() {
    if (_atlas) return _atlas; const W = 256, H = 128, c = canvas(W * 4, H * 2), g = c.getContext('2d');
    for (let i = 0; i < 8; i++) {
      const f = ficha({ seed: 'publico' + i, g: i % 2 ? 'f' : 'm', edad: [30, 28, 60, 45, 24, 66, 40, 35][i], barba: ['no', 'no', 'completa', 'no', 'sombra', 'no', 'bigote', 'no'][i], pelo: 'calvo' });
      f.estilo = 'calvo'; f.pelo = '#ffffff';
      const cc = canvas(W, H); pintaCara(cc.getContext('2d'), W, H, f, {}, '#ffffff'); g.drawImage(cc, (i % 4) * W, Math.floor(i / 4) * H);
    }
    _atlas = texDe(c); return _atlas;
  }
  function cabezaPublico(geoNeck) { // en el sistema de la cabeza del público (centro a 0.15, radio 0.13)
    const R = 0.125, h = cabezaGeo(R, 16, 12); h.translate(0, 0.15, 0);
    const l = [h]; for (const n of [...narizGeo(R), ...orejasGeo(R)]) { n.translate(0, 0.15, 0); l.push(uvFijo(n, 0.5 + 169 / 360, 0.5 - 60 / 180)); }
    if (geoNeck) l.push(uvFijo(geoNeck, 0.5, 0.64));
    return merge(l);
  }
  function materialPublico(mat, nCaras = 8) { // usa aFace (por instancia) para elegir la cara del atlas
    mat.map = atlasPublico(); const prev = mat.onBeforeCompile;
    mat.onBeforeCompile = (s, r) => { prev && prev(s, r); s.vertexShader = s.vertexShader.replace('#include <common>', '#include <common>\nattribute float aFace;').replace('#include <uv_vertex>', '#include <uv_vertex>\n#ifdef USE_MAP\nvMapUv = vMapUv * vec2(0.25, 0.5) + vec2(mod(aFace, 4.0) * 0.25, floor(aFace / 4.0) * 0.5);\n#endif'); };
    const k = mat.customProgramCacheKey ? mat.customProgramCacheKey() : ''; mat.customProgramCacheKey = () => k + '-p3d'; return mat;
  }
  function carasInstancias(geo, n, seed) { const r = rng(seed), a = new Float32Array(Math.max(1, n)); for (let i = 0; i < a.length; i++) a[i] = Math.floor(r() * 8); geo.setAttribute('aFace', new T.InstancedBufferAttribute(a, 1)); return geo; }
  // ------------------------------------------------ fila de Opciones (mismo estilo que el resto) ------------------------------------------------
  function fila(onCambio, cls = { row: 'orow', btn: 'tbtn', sel: 'sel' }) {
    const row = document.createElement('div'); row.className = cls.row; row.id = 'rowPersonajes';
    const lb = document.createElement('label'); lb.textContent = '🧑 Personajes'; row.appendChild(lb);
    for (const [v, t] of [['monigotes', 'Monigotes'], ['personas', 'Personas 3D']]) { const b = document.createElement('button'); b.className = cls.btn + (((on() ? 'personas' : 'monigotes') === v) ? ' ' + cls.sel : ''); b.textContent = t; b.dataset.v = v; b.onclick = ev => { ev.stopPropagation(); set(v === 'personas'); row.querySelectorAll('button').forEach(x => x.classList.toggle(cls.sel, x === b)); try { onCambio && onCambio(v === 'personas'); } catch (e) { console.warn(e); } }; row.appendChild(b); }
    return row;
  }
  return p3dLib._api = { on, set, ficha, persona, setHabla: fn => { habla = fn; }, atlasPublico, cabezaPublico, materialPublico, carasInstancias, fila, vivos, pintaCara, rng };
}
if (typeof window !== 'undefined') window.p3dLib = p3dLib;
