// v1.13 · SKETCH «El regreso de Don Ernesto» (~2,5 min). Don Ernesto es un personaje ORIGINAL inventado para el juego
// (presentador legendario ficticio: pelo plateado rizado, gran bigote, pajarita roja y traje mostaza/morado; no se
// parece a ninguna persona real). Vuelve al plató y compite con Marco Vitale por el protagonismo. Planos: junto a la
// pantalla del logo, presentando la fila de trampillas, sobre la trampilla central, tumbado posando, saliendo de una
// tarta gigante del «programa 1500» y de esmoquin ante los cilindros azules. Bocadillos + voz sintética del navegador.
const ARTURO_GUION = [
  // plano 1 · pantalla del logo
  [1, 'a', '¡Buenas noches! Hoy tenemos un programa muy tranquilo, muy normal, sin sorpresas...', 'habla'],
  [1, 'r', '¡Sorpresaaa! ¿Me echabais de menos? ¡Pues claro que sí!', 'apunta'],
  [1, 'a', '¿Y usted quién es? ¿Cómo ha entrado? ¡Seguridad!', 'señala'],
  [1, 'r', '¿Que quién soy? ¡Don Ernesto! ¡El presentador legendario! ¡Cuarenta temporadas sin despeinarme!', 'apunta'],
  [1, 'a', 'Pues lleva el pelo como una oveja recién levantada.', 'habla'],
  [1, 'r', 'Es volumen, chaval. Volumen de leyenda. Mira a la cámara uno: así se señala con estilo.', 'apunta'],
  [1, 'a', 'Esa es la cámara del catering, Don Ernesto.', 'pulgar'],
  // plano 2 · fila de trampillas
  [2, 'r', '¡Contemplad, amigos! ¡Las trampillas! ¡En mis tiempos eran de madera y crujían de emoción!', 'abre'],
  [2, 'a', 'Ahora son automáticas, tienen luces y un botón rojo.', 'habla'],
  [2, 'r', '¿Botón? Yo las abría dando un pisotón y gritando «¡fuera!». Funcionaba la mitad de las veces.', 'abre'],
  [2, 'a', '¿Y la otra mitad?', 'habla'],
  [2, 'r', 'La otra mitad me caía yo. Pero con una sonrisa preciosa.', 'pulgar'],
  [2, 'a', 'Bueno, Don Ernesto, encantado, pero el programa lo presento yo.', 'habla'],
  [2, 'r', 'Hagamos un trato: el que aguante más tiempo en la trampilla central, se queda con el plató.', 'apunta'],
  // plano 3 · trampilla central
  [3, 'r', '¡Aquí estoy! ¡En el centro! ¡Donde nací como presentador!', 'abre'],
  [3, 'a', 'Don Ernesto, no se ponga ahí, que esa la controla Rober y hoy está juguetón.', 'señala'],
  [3, 'r', 'Tonterías. Una leyenda nunca cae. Una leyenda... ¿Qué ha sido ese clic?', 'susto'],
  [3, 'a', 'Eso es el clic de antes del clonc.', 'habla'],
  [3, 'r', '¡Pues que no haga clonc! ¡Exijo que no haga clonc! ¡Tengo contrato!', 'susto'],
  [3, 'r', '¡Clooonc! ¡Volveréeee!', 'cae'],
  [3, 'a', 'Bueno... pues ya está. Volvemos con el programa normal.', 'pulgar'],
  // plano 4 · tumbado en el suelo
  [4, 'r', 'Psst. Marco. Aquí abajo. Bueno, aquí al lado.', 'tumbado'],
  [4, 'a', '¿Pero cómo ha salido del foso tan rápido?', 'señala'],
  [4, 'r', 'Hay una escalerita detrás. Llevo treinta años usándola. Ahora, silencio: estoy posando para el cartel de mi regreso.', 'tumbado'],
  [4, 'a', '¿Tumbado en el suelo del plató?', 'habla'],
  [4, 'r', 'Es una pose clásica: «el galán que descansa». Hazme una foto. Por mi lado bueno. Los dos son buenos.', 'tumbado'],
  [4, 'a', 'Le hago la foto si me promete irse luego.', 'habla'],
  [4, 'r', 'Prometido. Bueno, prometido a medias. Como las trampillas de madera.', 'tumbado'],
  // plano 5 · tarta del programa 1500
  [5, 'a', 'Y ahora, señoras y señores... ¡celebramos el programa mil quinientos! ¡Que entre la tarta!', 'abre'],
  [5, 'r', '¡Felicidadeees! ¡Sorpresa doble! ¡Salgo de la tarta como en los ochenta!', 'abre'],
  [5, 'a', '¡Don Ernesto! ¡Que esa tarta era para el equipo!', 'señala'],
  [5, 'r', 'Tranquilo, solo me he comido el piso de arriba. El de fresa. Mil quinientos programas... ¿y cuántos he presentado yo?', 'habla'],
  [5, 'a', 'Ninguno. Es la primera vez que viene.', 'habla'],
  [5, 'r', 'Detalles. En mi corazón los he presentado todos. ¡Que caiga el confeti!', 'abre'],
  // plano 6 · esmoquin ante los cilindros azules
  [6, 'r', 'Damas y caballeros... para la gran despedida, me he puesto el esmoquin de las galas.', 'manos'],
  [6, 'a', '¿Y de dónde ha sacado ese decorado de cilindros azules?', 'señala'],
  [6, 'r', 'Del almacén. Es el plató de mi programa de 1987: «¡Ahora me agacho!». Duró dos semanas.', 'manos'],
  [6, 'a', 'Don Ernesto, de verdad: ha sido un placer, pero el foco es mío.', 'habla'],
  [6, 'r', 'Lo sé, chaval. Lo haces muy bien. Casi tan bien como yo en mis sueños.', 'manos'],
  [6, 'r', 'Así que te devuelvo el plató... con una condición: la próxima gala, presentamos juntos.', 'apunta'],
  [6, 'a', 'Trato hecho. Pero lejos de la trampilla central.', 'pulgar'],
  [6, 'r', '¡Trato hecho! Y ahora todos conmigo: tres, dos, uno... ¡Ahora caigo!', 'abre'],
];
const ARTURO_T = (() => { let t = 1; return ARTURO_GUION.map(l => { const d = 1.0 + l[2].split(/\s+/).length * 0.24; const r = { plano: l[0], quien: l[1], txt: l[2], gesto: l[3], t0: t, t1: t + d }; t += d + 0.25; return r; }); })();
const ARTURO_DUR = ARTURO_T[ARTURO_T.length - 1].t1 + 2.5;
function arturoFigura() { // a partir del esqueleto del Marco de las promos, con aspecto propio
  const T = _E, f = promoAdrian();
  const traje = new T.MeshLambertMaterial({ color: 0xe0a020, emissive: 0x2a1800 }), pant = new T.MeshLambertMaterial({ color: 0x6a2a9a, emissive: 0x100418 }), pelo = new T.MeshLambertMaterial({ color: 0xd8dae4, emissive: 0x303038 });
  f.root.traverse(o => { if (!o.isMesh) return; const c = o.material.color && o.material.color.getHex();
    if (c === 0xf6f6f8) o.material = traje; else if (c === 0x1e2230) o.material = pant; else if (c === 0x5a3a22) o.material = pelo;
    else if (c === 0x101012 && o.geometry.type === 'TorusGeometry') o.visible = false; });
  for (const [x, y, z, r] of [[-0.13, 0.03, 0.02, 0.07], [0.13, 0.03, 0.02, 0.07], [0, 0.13, 0, 0.09], [-0.08, 0.12, 0.07, 0.06], [0.08, 0.12, 0.07, 0.06], [0, 0.08, -0.1, 0.09]]) { const m = new T.Mesh(new T.SphereGeometry(r, 10, 8), pelo); m.position.set(x, y, z); f.cab.add(m); }
  const big = new T.Mesh(new T.CapsuleGeometry(0.018, 0.13, 4, 8), pelo); big.rotation.z = Math.PI / 2; big.position.set(0, -0.022, 0.13); f.cab.add(big);
  const pajarita = new T.Group(); pajarita.position.set(0, 1.44, 0.14); f.root.children[0].add(pajarita); const rojo = new T.MeshLambertMaterial({ color: 0xe8102a, emissive: 0x300000 });
  for (const s of [-1, 1]) { const m = new T.Mesh(new T.ConeGeometry(0.045, 0.08, 4), rojo); m.rotation.z = s * Math.PI / 2; m.position.x = s * 0.04; pajarita.add(m); }
  f.root.scale.setScalar(1.04);
  f.esmoquin = () => { traje.color.setHex(0x16161c); traje.emissive.setHex(0x050508); pant.color.setHex(0x101014); };
  return f;
}
PROMOS.donarturo = { id: 'donarturo', nombre: 'Sketch: El regreso de Don Ernesto', dur: ARTURO_DUR, emoji: '🎩', sub: 'Un presentador legendario (inventado) vuelve al plató',
  musica: { bpm: 112, golpes: [], fin: ARTURO_DUR - 1 },
  montar(C) {
    const T = C.T, g = C.g2, W = () => C.c2.width, H = () => C.c2.height;
    const E = cabEstudio(C.cfg, { id: 'normal' }, { sinObjetos: true }), S = E.scene; E.tc.visible = false; E.tcr.visible = false;
    const puerta = promoPuerta(S, new T.Vector3(0, 0.456, 0), 1.1, 0xffd21a);
    const ad = promoAdrian(), ar = arturoFigura(); S.add(ad.root, ar.root);
    // pantalla gigante con el logo
    const logoP = new T.Mesh(new T.PlaneGeometry(4.2, 3.7), new T.MeshBasicMaterial({ map: new T.CanvasTexture(promoLogoCanvas()), transparent: true })); logoP.material.map.colorSpace = T.SRGBColorSpace;
    const marco = new T.Mesh(new T.PlaneGeometry(4.8, 4.2), new T.MeshBasicMaterial({ map: cabTex(512, 448, (g2, w, h) => { const gr = g2.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, '#d01a6a'); gr.addColorStop(1, '#3a0a8a'); g2.fillStyle = gr; g2.fillRect(0, 0, w, h); g2.strokeStyle = '#ff9ad8'; g2.lineWidth = 6; for (let i = 0; i < 6; i++) { g2.beginPath(); g2.ellipse(w / 2, h * 0.75, 60 + i * 50, 18 + i * 14, 0, 0, 7); g2.stroke(); } }) }));
    const pantLogo = new T.Group(); pantLogo.add(marco, logoP); logoP.position.z = 0.02; pantLogo.position.set(-1.6, 2.6, -1.5); S.add(pantLogo);
    // tarta gigante del programa 1500
    const tarta = new T.Group(); tarta.position.set(0, 0.45, 0); S.add(tarta);
    const lunares = cabTex(512, 256, (g2, w, h) => { g2.fillStyle = '#ff8ac8'; g2.fillRect(0, 0, w, h); const cs = ['#ffd21a', '#3ab8ff', '#ffffff', '#3dff8a']; for (let i = 0; i < 40; i++) { g2.fillStyle = cs[i % 4]; g2.beginPath(); g2.ellipse((i * 53) % w, (i * 37) % h, 14, 8, i, 0, 7); g2.fill(); } });
    [[1.3, 0.9, 0], [1.0, 0.8, 0.9]].forEach(([r, h, y]) => { const m = new T.Mesh(new T.CylinderGeometry(r, r, h, 48, 1, true), new T.MeshLambertMaterial({ map: lunares, side: T.DoubleSide })); m.position.y = y + h / 2; tarta.add(m); const nata = new T.Mesh(new T.TorusGeometry(r, 0.08, 8, 48), new T.MeshLambertMaterial({ color: 0xffffff })); nata.rotation.x = Math.PI / 2; nata.position.y = y + h; tarta.add(nata); });
    for (let i = 0; i < 6; i++) { const a = i / 6 * Math.PI * 2; const v = new T.Mesh(new T.CylinderGeometry(0.035, 0.035, 0.35, 8), new T.MeshLambertMaterial({ color: 0xffffff })); v.position.set(Math.sin(a) * 1.15, 1.08, Math.cos(a) * 1.15); tarta.add(v); const l = new T.Mesh(new T.SphereGeometry(0.05, 8, 6), new T.MeshBasicMaterial({ color: 0xffb02e })); l.position.set(v.position.x, 1.3, v.position.z); tarta.add(l); }
    const p1500 = new T.Mesh(new T.PlaneGeometry(8, 4.5), new T.MeshBasicMaterial({ map: cabTex(1024, 576, (g2, w, h) => { const gr = g2.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, '#1a52e6'); gr.addColorStop(1, '#0a1a7a'); g2.fillStyle = gr; g2.fillRect(0, 0, w, h); const cs = ['#ffd21a', '#ff5ad8', '#3dff8a', '#ff3a3a']; for (let i = 0; i < 30; i++) { g2.fillStyle = cs[i % 4]; g2.beginPath(); g2.moveTo(i * 36, 0); g2.lineTo(i * 36 + 30, 0); g2.lineTo(i * 36 + 15, 40); g2.fill(); } g2.drawImage(promoLogoCanvas(), w / 2 - 220, 50, 440, 385); g2.font = `900 150px ${CAB_FUENTE}`; g2.textAlign = 'center'; g2.lineWidth = 16; g2.strokeStyle = '#ffffff'; g2.strokeText('1500', w / 2, 535); g2.fillStyle = '#ff2a6a'; g2.fillText('1500', w / 2, 535); }) }));
    p1500.position.set(0, 4.2, -6); S.add(p1500);
    const NC = 300, cg = new T.BufferGeometry(), cpos = new Float32Array(NC * 3), ccol = new Float32Array(NC * 3); const pal = [[1, 0.82, 0.1], [1, 0.35, 0.85], [0.24, 1, 0.54], [0.23, 0.72, 1]]; for (let i = 0; i < NC; i++) ccol.set(pal[i % 4], i * 3);
    cg.setAttribute('position', new T.BufferAttribute(cpos, 3)); cg.setAttribute('color', new T.BufferAttribute(ccol, 3)); const confeti = new T.Points(cg, new T.PointsMaterial({ size: 0.09, vertexColors: true })); S.add(confeti);
    // cilindros azules gigantes (decorado de gala)
    const gala = new T.Group(); gala.position.set(0, 0, -2.5); S.add(gala); const azul = new T.MeshPhongMaterial({ color: 0x2a6aff, emissive: 0x0a1a5a, specular: 0xffffff, shininess: 120 });
    for (let i = 0; i < 9; i++) { const c = new T.Mesh(new T.CylinderGeometry(0.42, 0.42, 3 + (i % 3) * 1.4, 32), azul); c.rotation.z = Math.PI / 2; c.position.set(((i * 1.7) % 5) - 2.5, 0.9 + i * 0.55, -(i % 3) * 0.8); gala.add(c); }
    C.escenas = [S];
    const plano = t => { let p = 1; for (const l of ARTURO_T) if (t >= l.t0 - 0.2) p = l.plano; return p; };
    const linea = t => ARTURO_T.find(l => t >= l.t0 && t < l.t1);
    const dichas = new Set(); const vozOn = !To.mute && window.speechSynthesis && window.__promoT == null;
    const decir = l => { try { if (!vozOn) return; const u = new SpeechSynthesisUtterance(l.txt.replace(/[¡!«»]/g, '')); u.lang = 'es-ES'; u.rate = l.quien === 'r' ? 0.95 : 1.1; u.pitch = l.quien === 'r' ? 0.6 : 1.05; speechSynthesis.speak(u); } catch (e) { } };
    const bocadillo = (l, k) => { const w = W(), h = H(), s = h / 720, quien = l.quien === 'r' ? 'DON ARTURO · PRESENTADOR LEGENDARIO' : 'ADRIÁN VEGA · PRESENTADOR'; g.save(); g.globalAlpha = Math.min(1, k * 4); g.font = `700 ${21 * s}px system-ui, sans-serif`;
      const palabras = l.txt.split(' '), lin = ['']; for (const p of palabras) { const pr = (lin[lin.length - 1] + ' ' + p).trim(); if (g.measureText(pr).width > w * 0.55) lin.push(p); else lin[lin.length - 1] = pr; }
      const x = l.quien === 'r' ? w - w * 0.6 - 30 * s : 30 * s, y = 24 * s, alto = (44 + lin.length * 28) * s; g.fillStyle = '#ffffff'; g.beginPath(); g.roundRect ? g.roundRect(x, y, w * 0.6, alto, 18 * s) : g.rect(x, y, w * 0.6, alto); g.fill();
      g.fillStyle = l.quien === 'r' ? '#c0189a' : '#ff8a1a'; g.font = `800 ${13 * s}px system-ui, sans-serif`; g.fillText(quien, x + 18 * s, y + 24 * s); g.fillStyle = '#18204a'; g.font = `700 ${21 * s}px system-ui, sans-serif`; lin.forEach((tx, i) => g.fillText(tx, x + 18 * s, y + (52 + i * 28) * s)); g.restore(); };
    const gesto = (f, ges, t, habla) => { const A = f.A;
      if (ges === 'apunta') f.pose({ hrx: -1.55, hrz: 0.05, crx: -0.1, hlx: -0.3, hlz: -0.2, boca: habla ? 0.6 + Math.abs(Math.sin(t * 11)) * 1.4 : 1, cy: Math.sin(t * 2) * 0.1 });
      else if (ges === 'abre' || ges === 'susto') f.pose({ hlz: -1.25, hrz: 1.25, hlx: -0.2, hrx: -0.2, boca: ges === 'susto' ? 2.2 : habla ? 0.6 + Math.abs(Math.sin(t * 11)) * 1.4 : 1.4, by: ges === 'susto' ? Math.abs(Math.sin(t * 20)) * 0.02 : 0, cx: ges === 'susto' ? -0.15 : 0 });
      else if (ges === 'manos') f.pose({ hlx: -1.0, hrx: -1.0, hlz: 0.55, hrz: -0.55, clx: -1.1, crx: -1.1, boca: habla ? 0.6 + Math.abs(Math.sin(t * 11)) * 1.4 : 1, cy: Math.sin(t) * 0.1 });
      else if (ges === 'tumbado') f.pose({ hrx: -2.6, hrz: 0.2, crx: -1.2, pl: -0.2, pr: -0.9, rr: 1.4, boca: habla ? 0.6 + Math.abs(Math.sin(t * 11)) * 1.4 : 1.4, cy: 0.6 });
      else if (ges === 'cae') A.cae(t); else if (ges === 'pulgar') A.pulgar(t); else if (ges === 'señala') A.señala(t, true); else if (habla) A.habla(t); else A.idle(t); };
    const st = window.__arturo = { plano: 0, linea: -1 };
    let ultR = 'apunta';
    return t => {
      E.update(t); const p = plano(t), l = linea(t); st.plano = p; st.linea = l ? ARTURO_T.indexOf(l) : -1;
      const ultArturo = ARTURO_T.filter(x => x.quien === 'r' && x.t0 <= t).pop(); if (ultArturo) ultR = ultArturo.gesto;
      const ultAd = ARTURO_T.filter(x => x.quien === 'a' && x.t0 <= t && x.plano === p).pop();
      tarta.visible = p === 5; p1500.visible = p === 5; gala.visible = p === 6; pantLogo.visible = p === 1; confeti.visible = p === 5 && t > (ARTURO_T.find(x => x.plano === 5 && /confeti/.test(x.txt)) || { t0: 0 }).t0;
      if (p === 6) ar.esmoquin();
      ad.root.visible = true; ar.root.visible = true; ar.root.rotation.set(0, 0, 0); ad.root.rotation.set(0, 0, 0);
      const hablaA = l && l.quien === 'a', hablaR = l && l.quien === 'r';
      let fin3 = ARTURO_T.find(x => x.plano === 3 && x.gesto === 'cae');
      if (p === 1) { ad.root.position.set(1.2, 0.45, 2.2); ar.root.position.set(-0.3, 0.45, 1.0); ar.root.visible = t > ARTURO_T[1].t0 - 0.3; C.cam.position.set(0.4, 1.7, 6.2); C.cam.lookAt(-0.2, 1.8, 0.5); ad.root.rotation.y = -0.3; }
      else if (p === 2) { ar.root.position.set(0, 0.45, 2.8); ad.root.position.set(2.2, 0.45, 3.2); ad.root.rotation.y = -0.6; C.cam.position.set(0, 2.6, 9.5); C.cam.lookAt(0, 1.0, -2); }
      else if (p === 3) { ar.root.position.set(0, 0.456, 0); ad.root.position.set(2.4, 0.45, 1.6); ad.root.rotation.y = -0.9; const k = fin3 ? C.ease((t - fin3.t0 - 0.4) / 0.4) : 0; puerta.abre(k); if (t > fin3.t0 + 0.6) { const d = t - fin3.t0 - 0.6; ar.root.position.y = 0.456 - d * d * 9; ar.root.visible = d < 1; } C.cam.position.set(0.6, 3.2, 6.2); C.cam.lookAt(0.4, 0.9, 0); }
      else if (p === 4) { puerta.abre(0); ar.root.position.set(0.2, 0.62, 2.2); ar.root.rotation.set(0, 0.25, Math.PI / 2 - 0.05); ad.root.position.set(1.4, 0.45, 2.0); ad.root.rotation.y = -0.5; C.cam.position.set(0.2, 1.4, 5.8); C.cam.lookAt(-0.2, 0.7, 2.2); }
      else if (p === 5) { const t5 = ARTURO_T.find(x => x.plano === 5 && x.quien === 'r').t0, k = C.rebote((t - t5) / 0.8); ar.root.position.set(0, 0.45 + C.lerp(-0.6, 1.25, Math.max(0, k)), 0); ar.root.visible = t > t5 - 0.1; ad.root.position.set(2.4, 0.45, 1.8); ad.root.rotation.y = -0.7; C.cam.position.set(0.8, 3.2, 8.4); C.cam.lookAt(0.3, 2.2, -1);
        if (confeti.visible) { for (let i = 0; i < NC; i++) { cpos[i * 3] = ((i * 7.31) % 10) - 5; cpos[i * 3 + 1] = 7 - ((t * (0.8 + (i % 5) * 0.2) + i * 0.37) % 7.5); cpos[i * 3 + 2] = ((i * 3.7) % 6) - 3 + Math.sin(t * 2 + i) * 0.2; } cg.attributes.position.needsUpdate = true; } }
      else { ar.root.position.set(-0.4, 0.45, 1.6); ad.root.position.set(1.6, 0.45, 2.4); ad.root.rotation.y = -0.5; C.cam.position.set(0.3, 1.8, 6.4); C.cam.lookAt(0, 1.5, 0); }
      gesto(ar, p === 4 ? 'tumbado' : ultR, t, hablaR); gesto(ad, hablaA ? (ultAd ? ultAd.gesto : 'habla') : 'idle', t, hablaA);
      C.render(S);
      if (l) { bocadillo(l, t - l.t0); if (!dichas.has(l)) { dichas.add(l); decir(l); } }
      g.fillStyle = 'rgba(0,0,0,0.01)'; g.fillRect(0, 0, 2, 2);
      if (t > ARTURO_DUR - 1) { g.fillStyle = `rgba(0,0,0,${t - ARTURO_DUR + 1})`; g.fillRect(0, 0, W(), H()); }
    };
  } };
function promoArturo() { return promoCorre(PROMOS.donarturo).finally(() => { try { window.speechSynthesis && speechSynthesis.cancel(); } catch (e) { } }); }
window.__promoArturo = promoArturo; window.__arturoGuion = ARTURO_T;
