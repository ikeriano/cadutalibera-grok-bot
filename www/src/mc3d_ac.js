// ===================================================================================================
// «Mi cabecera 3D» · adaptador de la familia ¡Ahora Caigo!: rueda el guion que la IA ha sacado del vídeo
// (planos, cortes, movimientos de cámara, textos OCR, logo, golpes de música) en el PLATÓ 3D del juego:
// cámaras reales por el plató (concursantes 1-10, público, presentador, trampilla central), rótulos azules,
// hashtag, logo 3D con las letras volando y el audio original del vídeo de fondo.
// ===================================================================================================
function mc3dCam(eng, t, d) {
  const T = t.mov, dir = t.dir || 1, vel = Math.max(0.6, Math.min(2.2, t.vel || 1)), D = Math.max(0.8, d / vel);
  const pb = eng.studio && eng.studio.prizeBoards && eng.studio.prizeBoards[0], m = pb ? pb.position.clone() : pt(-7, 3.7, -9.5);
  const suj = t.sujeto, a0 = (t.idx * 1.37) % (Math.PI * 2);
  if (suj === 'publico') { // desde el plató hacia las gradas, barriendo el público
    const a = a0, b = a + 0.9 * dir; const L = r => pt(Math.sin(r) * 14, 3.6, Math.cos(r) * 14);
    eng.cut(pt(Math.sin(a) * 4.5, 2.4, Math.cos(a) * 4.5), L(a)); eng.glide(pt(Math.sin(b) * 5.2, 2.9, Math.cos(b) * 5.2), L(b), D); return;
  }
  if (suj === 'concursantes') { // pasillo de podios numerados con sus nombres
    const k = 1 + (t.idx * 3) % 10, h = eng.studio.holes[k], p = h ? h.pos.clone() : pt(6, 0, 3); const out = p.clone().setY(0).normalize();
    const lado = pt(-out.z, 0, out.x).multiplyScalar(2.4 * dir);
    eng.cut(p.clone().addScaledVector(out, -3.2).add(lado).setY(2.2), p.clone().setY(1.5)); eng.glide(p.clone().addScaledVector(out, -2.6).sub(lado).setY(1.9), p.clone().setY(1.4), D); return;
  }
  if (suj === 'presentador' && eng.host) { const h = eng.host.root.position.clone(); eng.cut(h.clone().add(pt(-2.2 * dir, 1.7, 3.4)), h.clone().setY(1.5)); eng.glide(h.clone().add(pt(1.4 * dir, 1.6, 2.6)), h.clone().setY(1.5), D); return; }
  switch (T) {
    case 'acercar': eng.cut(pt(0.6 * dir, 5.4, 14.5), pt(0, 1.4, 0)); eng.glide(pt(0, 2.2, 6.2), pt(0, 1.3, 0), D); break;
    case 'alejar': eng.cut(pt(0, 1.6, 5.5), pt(0, 1.4, 0)); eng.glide(pt(-0.8 * dir, 6.4, 15), pt(0, 1.6, 0), D); break;
    case 'lateral': eng.cut(pt(-7.5 * dir, 2.3, 3.5), pt(0, 1.4, 0)); eng.glide(pt(7.5 * dir, 2.3, 3.5), pt(0, 1.4, 0), D); break;
    case 'grua': if (dir > 0) { eng.cut(pt(0, 0.8, 9.5), pt(0, 1.5, 0)); eng.glide(pt(0, 6.9, 9.6), pt(0, 1.2, 0), D); } else { eng.cut(pt(0.4, 9.5, 4.2), pt(0, 0, -0.3)); eng.glide(pt(0, 2.4, 6.4), pt(0, 1.2, 0), D); } break;
    case 'vuelo': eng.startOrbit(pt(0, 0, 0), 9.5, 5.2, a0, 0.55 * dir * vel, 1.2); break;
    case 'fija': eng.cut(pt(Math.sin(a0) * 9, 3.2, Math.cos(a0) * 9), pt(0, 1.4, 0)); eng.glide(pt(Math.sin(a0 + 0.08) * 8.6, 3.1, Math.cos(a0 + 0.08) * 8.6), pt(0, 1.4, 0), D); break;
    default: eng.startOrbit(pt(0, 0, 0), 7.5, 3.4, a0, 0.32 * dir * vel, 1.4);
  }
}
async function mc3dRecrearAC(pl, op) {
  const ctx = op.ctx || {}, eng = ctx.eng || Xe, hud = ctx.hud || yn;
  let sess = ctx.sess, propia = false, tema0 = null;
  if (!sess) { // vista previa desde Opciones: el plató de fondo pasa a primer plano
    jt && (jt.alive = false); sess = new bv(); jt = sess; propia = true; Mi = false;
    en('menu').classList.add('hidden'); en('topbar').classList.remove('hidden'); F.stopAll();
    const th = pl.especial && Do.find(x => x.id === pl.especial);
    if (th && eng.theme && eng.theme.id !== th.id) { tema0 = eng.theme; eng.setTheme(xf(th.id)); Ii(); }
    eng.resetPositions(); eng.lookEvent('intro');
  }
  const r0 = eng.host.root.visible, l0 = eng.player.root.visible; eng.host.root.visible = true; eng.player.root.visible = false;
  eng.opps.forEach(o => o.root.visible = true);
  try { F.stopMusic(0.3); } catch (e) { }
  const au = MC3D.pista(op.audio, pl.vel), now = () => au.t(); let paraSint = null; try { if (op.sintoniaJuego) paraSint = op.sintoniaJuego(); } catch (e) { }
  let logo = null;
  try {
    hud.hashtag(pl.hashtag || (eng.theme && eng.theme.hashtag) || Jr.hashtag);
    if (pl.look) try { eng.studio && eng.studio.setLook(pl.look); } catch (e) { }
    await Af(sess, hud, async f => {
      const hasta = x => f.until(() => now() >= x);
      const bs = pl.banners.slice().sort((a, b) => a.t - b.t); let bi = 0, gi = 0;
      const extra = () => { // rótulos y golpes de música mientras corre cada plano
        while (bi < bs.length && now() >= bs[bi].t) { hud.lowerThird(bs[bi].txt, bs[bi].dur, f).catch(() => { }); bi++; }
        while (gi < pl.golpes.length && now() >= pl.golpes[gi]) { gi++; try { if (gi % 3 === 0) eng.lights && eng.lights.event('acierto'); if (pl.efectos.some(e => /chispas|confeti|fuego|explosion/.test(e)) || pl.especial) gi % 2 === 0 && ea(eng.studio, pt((Math.random() - 0.5) * 8, 1.5, (Math.random() - 0.5) * 6)); } catch (e) { } }
      };
      const iv = setInterval(extra, 50);
      try {
        for (let k = 0; k < pl.tomas.length; k++) {
          const t = pl.tomas[k]; t.idx = k; await hasta(t.t0);
          if (logo && t.sujeto !== 'logo') { logo.dispose(); logo = null; eng.override = null; }
          if (t.sujeto === 'logo') {
            if (!logo) logo = iA(eng);
            const d = t.t1 - t.t0;
            if (d > 1.6) { logo.phase = 'tunel'; await hasta(t.t0 + d * 0.4); logo.flash(); }
            logo.phase = 'logo'; eng.lights && eng.lights.event('ganador');
          } else { mc3dCam(eng, t, t.t1 - t.t0); if (t.flash) { try { eng.lights && eng.lights.event('acierto'); } catch (e) { } } }
        }
        await hasta(pl.dur);
      } finally { clearInterval(iv); }
    });
  } finally {
    au.parar(); try { paraSint && paraSint(); } catch (e) { } if (logo) logo.dispose(); eng.override = null; hud.clearLowerThirds();
    eng.host.root.visible = r0; eng.player.root.visible = l0; eng.lookEvent('intro');
    if (propia) {
      if (tema0) { eng.setTheme(tema0); Ii(); }
      hud.hashtag(''); jt === sess && (jt.alive = false, jt = null); Mi = false; eng.resetPositions(); Lt('options');
    }
  }
}
if (window.MC3D) MC3D.config({ recrear: mc3dRecrearAC,
  // vídeo sin sonido: suena la sintonía de la cabecera del juego (mp3 cargado o sintetizada)
  sintonia: () => { try { return RC.cab3dUrl && RC.cab3dUrl() || null; } catch (e) { return null; } },
  sintoniaJuego: () => { try { F.ctx.state === 'suspended' && F.ctx.resume(); const gm = F.ctx.createGain(); gm.gain.value = (To.mute ? 0 : Math.max(0, Math.min(1, To.vol))) * 0.55; gm.connect(F.ctx.destination); cabSynth(F.ctx, gm); return () => { try { gm.gain.setTargetAtTime(0, F.ctx.currentTime, 0.2); setTimeout(() => gm.disconnect(), 900); } catch (e) { } }; } catch (e) { return null; } }, creditos: () => J2(), hashtag: esp => { const th = esp && Do.find(x => x.id === esp); return th ? th.hashtag || null : null; } });
