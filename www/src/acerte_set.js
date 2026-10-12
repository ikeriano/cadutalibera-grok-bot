// ===== ¡Ahora caigo! · decorado del plató (estilo del plató brasileño): paredes LED de chevrones azul/rojo,
// haces de luz, gradas laterales con iconos de huellas y la trampilla roja activa. Se añade al plató 3D ya construido.
function acerteDecorado(eng) {
  try {
    const T = (window.__THREE_AC || null); if (!eng || !eng.scene || eng.__acerteDeco) return; eng.__acerteDeco = true;
    const root = eng.studio && eng.studio.root || eng.scene;
    const tex = (w, h, f) => Vt(w, h, f);
    const chevron = tex(1024, 256, (g, w, h) => { g.fillStyle = '#061238'; g.fillRect(0, 0, w, h); for (let i = -1; i < 12; i++) { const x = i * 100; g.fillStyle = i % 3 === 0 ? '#1f6bff' : '#39c6ff'; g.beginPath(); g.moveTo(x, 40); g.lineTo(x + 60, h / 2); g.lineTo(x, h - 40); g.lineTo(x + 34, h - 40); g.lineTo(x + 94, h / 2); g.lineTo(x + 34, 40); g.closePath(); g.fill(); } });
    const huella = tex(256, 256, (g, w) => { g.fillStyle = '#0a2a7a'; g.fillRect(0, 0, w, w); g.shadowColor = '#5fe6ff'; g.shadowBlur = 20; g.strokeStyle = '#5fe6ff'; g.lineWidth = 10; g.beginPath(); g.arc(128, 128, 96, 0, 7); g.stroke(); g.fillStyle = '#bff4ff'; for (const [x, y] of [[100, 120], [156, 112]]) { g.beginPath(); g.ellipse(x, y - 14, 18, 30, 0, 0, 7); g.fill(); g.beginPath(); g.ellipse(x, y + 34, 14, 15, 0, 0, 7); g.fill(); } });
    // Caduta Libera: paredes LED con el patrón de rombos azules de la app original (si está el recurso)
    const _pinta = (t, src, sx, sy, sw, sh) => { try { const im = new Image(); im.onload = () => { try { const c = t.image; const g = c.getContext('2d'); g.drawImage(im, sx, sy, sw, sh, 0, 0, c.width, c.height); t.needsUpdate = true; } catch (e) { } }; im.src = src; } catch (e) { } };
    _pinta(chevron, 'clasico_cl/img/bg2.webp', 120, 150, 500, 125);
    const mat = (t) => new Ie({ map: t, toneMapped: false, side: Et });
    // paredes de chevrones (curvas, detrás de las trampillas)
    for (let k = -1; k <= 1; k += 2) for (let j = 0; j < 4; j++) {
      const p = new V(new yt(5.2, 1.1), mat(chevron)); const ang = k * (0.55 + j * 0.42), r = 12.5;
      p.position.set(Math.sin(ang) * r, 4.8 + (j % 2) * 1.3, -Math.cos(ang) * r); p.lookAt(0, p.position.y, 0); root.add(p);
    }
    // iconos de huellas en las gradas
    for (let k = -1; k <= 1; k += 2) for (let j = 0; j < 5; j++) {
      const p = new V(new yt(0.9, 0.9), mat(huella)); const ang = k * (0.9 + j * 0.28), r = 11.2;
      p.position.set(Math.sin(ang) * r, 2.2 + (j % 2) * 0.9, -Math.cos(ang) * r); p.lookAt(0, p.position.y, 0); root.add(p);
    }
    // haces de luz (conos aditivos)
    const haz = new Ie({ color: 0x9fd8ff, transparent: true, opacity: 0.08, blending: In, depthWrite: false, side: Et });
    for (let i = 0; i < 14; i++) { const ang = -1.4 + i * 0.215, r = 10.5; const c = new V(new ke(0.05, 0.9, 9, 12, 1, true), haz); c.position.set(Math.sin(ang) * r, 5, -Math.cos(ang) * r); c.rotation.z = (i % 2 ? 0.25 : -0.25); root.add(c); }
    // trampilla activa en rojo (la del oponente que juega)
    const roja = new Ie({ color: 0xff2238, transparent: true, opacity: 0.55, blending: In, depthWrite: false });
    const aro = new V(new bn(0.66, 0.05, 8, 64), roja); aro.rotation.x = Math.PI / 2; aro.visible = false; root.add(aro); eng.__acerteAro = aro;
    const tick = () => { try { const h = eng.holes || (eng.studio && eng.studio.holes); const act = window.__acerteActiva == null ? 1 : window.__acerteActiva; if (h && act != null && h[act]) { const p = h[act].pos || h[act].position; aro.position.set(p.x, (p.y || 0) + 0.03, p.z); aro.visible = true; aro.material.opacity = 0.4 + 0.25 * Math.sin(performance.now() / 200); } else aro.visible = false; } catch (e) { } requestAnimationFrame(tick); };
    tick();
  } catch (e) { console.warn('acerteDecorado', e); }
}
(function esperaPlato() { const e = window.__eng; if (e && e.scene) acerteDecorado(e); else setTimeout(esperaPlato, 500); })();
// ===== Caduta Libera: las dos medias lunas de trampillas unidas por detrás (un solo arco continuo y simétrico) =====
function cadutaUneArcos(eng) {
  try {
    if (!eng || !eng.scene || eng.__cadutaArco) return false; const nuevos = [];
    eng.scene.traverse((o) => { const g = o.geometry; if (o.isMesh && g && g.type === 'ExtrudeGeometry' && o.position.length() < 0.5) { if (!g.boundingBox) g.computeBoundingBox(); const bb = g.boundingBox; if (bb.max.x < -1 && bb.min.x < -7 && bb.max.z > 5) { const ang = 2 * Math.atan2(-bb.max.x + 0.05, -bb.min.z) + 0.02; const m = o.clone(); m.rotation.y = o.rotation.y - ang; m.name = 'cadutaPuenteSuelo'; nuevos.push([o.parent, m]); } } });
    eng.scene.traverse((o) => { const g = o.geometry, p = g && g.parameters; if (!o.isMesh || !p || g.type !== 'CylinderGeometry' || p.thetaLength > 3) return;
      if (![5.19, 5.2, 8.41, 8.25].some((r) => Math.abs(p.radiusTop - r) < 0.006)) return; if (o.rotation.y > -2.5) return;   // solo la media luna izquierda (la de referencia)
      const ini = -o.rotation.y, largo = Math.PI * 2 + 2 * o.rotation.y; if (largo <= 0.01 || largo > 1.2) return;
      const G = new g.constructor(p.radiusTop, p.radiusBottom, p.height, Math.max(8, Math.round(p.radialSegments * largo / p.thetaLength)), 1, p.openEnded, 0, largo);
      const m = new o.constructor(G, o.material); m.position.copy(o.position); m.rotation.set(o.rotation.x, ini, o.rotation.z); m.scale.copy(o.scale); m.castShadow = o.castShadow; m.receiveShadow = o.receiveShadow; m.name = 'cadutaPuente';
      nuevos.push([o.parent, m]); });
    if (!nuevos.length) return false; nuevos.forEach(([p, m]) => p.add(m)); eng.__cadutaArco = nuevos.length; return true;
  } catch (e) { return false; }
}
(function () { const iv = setInterval(() => { if (window.__eng && cadutaUneArcos(window.__eng)) clearInterval(iv); }, 500); setTimeout(() => clearInterval(iv), 60000); })();
