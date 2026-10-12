// CÁMARA LIBRE: vuela por el plató 3D para hacer tus propias cabeceras. Táctil (joystick, arrastrar para mirar,
// pellizco = zoom, botones subir/bajar) y PC (WASD/QE, ratón para mirar, rueda = zoom). Velocidad y FOV, ocultar UI,
// luces/LED/logo/música, puntos clave con recorrido de grúa suave y GRABAR (canvas.captureStream + MediaRecorder con audio).
// Uso: abrirCamaraLibre({ canvas, camera, aplicar(pos, mira), soltar(), audio:{ctx, nodo}, toggles:{ 'Luces': fn(on) ... }, guardarCabecera(blob), toast(txt) })
function abrirCamaraLibre(o) {
  const V = (x, y, z) => ({ x, y, z }); const cam = o.camera;
  const st = { pos: V(cam.position.x, cam.position.y, cam.position.z), yaw: 0, pitch: -0.1, vel: 4, fov: cam.fov || 50, mov: { x: 0, z: 0, y: 0 }, keys: {}, claves: [], reprod: null, rec: null, vivo: true };
  { const d = o.mira ? [o.mira.x - st.pos.x, o.mira.y - st.pos.y, o.mira.z - st.pos.z] : [0, 0, -1]; st.yaw = Math.atan2(d[0], -d[2]); st.pitch = Math.atan2(d[1], Math.hypot(d[0], d[2])); }
  const css = document.createElement('style'); css.textContent = `#camlib{position:fixed;inset:0;z-index:9000;pointer-events:none;font:14px system-ui;color:#fff}
#camlib .cl-p{pointer-events:auto}#camlib .cl-bar{position:absolute;top:8px;left:8px;right:8px;display:flex;flex-wrap:wrap;gap:6px;align-items:center}
#camlib button{background:#0a1a5acc;border:2px solid #3a6aff;color:#fff;border-radius:12px;padding:7px 10px;font:600 13px system-ui}#camlib button.on{background:#ffb81a;color:#1a1000;border-color:#ffe08a}
#camlib .cl-rec{background:#c0101a!important;border-color:#ff8080!important}#camlib .cl-rec.on{animation:clp 1s infinite}@keyframes clp{50%{opacity:.5}}
#camlib label{background:#0a1a5acc;border-radius:10px;padding:4px 8px;display:flex;gap:6px;align-items:center}#camlib input[type=range]{width:90px}
#camlib .cl-joy{position:absolute;left:24px;bottom:24px;width:130px;height:130px;border-radius:50%;background:#ffffff22;border:2px solid #ffffff66;touch-action:none}
#camlib .cl-knob{position:absolute;left:40px;top:40px;width:50px;height:50px;border-radius:50%;background:#ffffffaa}
#camlib .cl-ud{position:absolute;right:20px;bottom:30px;display:flex;flex-direction:column;gap:10px}#camlib .cl-ud button{width:64px;height:54px;font-size:20px}
#camlib .cl-look{position:absolute;inset:0;touch-action:none}#camlib.oculta .cl-ui{display:none}#camlib .cl-show{display:none;position:absolute;right:8px;top:8px}#camlib.oculta .cl-show{display:block;opacity:.35}
#camlib .cl-info{position:absolute;left:8px;bottom:170px;background:#0008;border-radius:8px;padding:3px 8px;font-size:12px}`;
  document.head.appendChild(css);
  const R = document.createElement('div'); R.id = 'camlib'; document.body.appendChild(R);
  const look = document.createElement('div'); look.className = 'cl-look cl-p'; R.appendChild(look);
  const ui = document.createElement('div'); ui.className = 'cl-ui'; R.appendChild(ui);
  const bar = document.createElement('div'); bar.className = 'cl-bar cl-p'; ui.appendChild(bar);
  const B = (t, fn, cls = '') => { const b = document.createElement('button'); b.className = cls; b.textContent = t; b.onclick = (e) => { e.stopPropagation(); fn(b); }; b.onpointerdown = e => e.stopPropagation(); return b; };
  const slider = (t, min, max, step, val, fn) => { const l = document.createElement('label'); l.textContent = t; const r = document.createElement('input'); r.type = 'range'; r.min = min; r.max = max; r.step = step; r.value = val; r.oninput = () => fn(+r.value); r.onpointerdown = e => e.stopPropagation(); l.appendChild(r); return l; };
  const info = document.createElement('div'); info.className = 'cl-info'; ui.appendChild(info);
  const msg = (t) => (o.toast ? o.toast(t) : (info.textContent = t));
  bar.append(B('✕ Salir', cerrar), B('👁 Ocultar UI', () => R.classList.add('oculta')),
    slider('🏃 Velocidad', 0.5, 15, 0.5, st.vel, v => st.vel = v), slider('🔭 FOV', 20, 100, 1, st.fov, v => st.fov = v));
  for (const [nom, fn] of Object.entries(o.toggles || {})) { let on = true; bar.appendChild(B(nom, (b) => { on = !on; b.classList.toggle('on', !on); b.textContent = (on ? '' : '🚫 ') + nom; fn(on); })); }
  bar.append(B('📍 Añadir punto', () => { st.claves.push({ ...st.pos, yaw: st.yaw, pitch: st.pitch, fov: st.fov }); msg('Punto ' + st.claves.length + ' guardado'); }),
    B('▶ Recorrido', () => reproducir()), B('🗑 Borrar puntos', () => { st.claves = []; st.reprod = null; msg('Puntos borrados'); }),
    B('⏺ GRABAR', (b) => grabar(b), 'cl-rec'));
  const show = B('👁', () => R.classList.remove('oculta'), 'cl-show cl-p'); R.appendChild(show);
  // joystick
  const joy = document.createElement('div'); joy.className = 'cl-joy cl-p'; const knob = document.createElement('div'); knob.className = 'cl-knob'; joy.appendChild(knob); ui.appendChild(joy);
  let jid = null; const jset = (e) => { const r = joy.getBoundingClientRect(); let x = (e.clientX - r.left - 65) / 50, y = (e.clientY - r.top - 65) / 50; const m = Math.hypot(x, y); if (m > 1) { x /= m; y /= m; } st.mov.x = x; st.mov.z = y; knob.style.left = 40 + x * 40 + 'px'; knob.style.top = 40 + y * 40 + 'px'; };
  joy.onpointerdown = (e) => { e.stopPropagation(); jid = e.pointerId; joy.setPointerCapture(jid); jset(e); }; joy.onpointermove = (e) => e.pointerId === jid && jset(e);
  joy.onpointerup = joy.onpointercancel = () => { jid = null; st.mov.x = st.mov.z = 0; knob.style.left = knob.style.top = '40px'; };
  const ud = document.createElement('div'); ud.className = 'cl-ud cl-p'; ui.appendChild(ud);
  for (const [t, dy] of [['⬆', 1], ['⬇', -1]]) { const b = document.createElement('button'); b.textContent = t; b.onpointerdown = (e) => { e.stopPropagation(); st.mov.y = dy; }; b.onpointerup = b.onpointerleave = b.onpointercancel = () => st.mov.y = 0; ud.appendChild(b); }
  // mirar (arrastrar) y pellizco (zoom)
  const ptr = new Map(); let pinch0 = 0, fov0 = st.fov;
  look.onpointerdown = (e) => { look.setPointerCapture(e.pointerId); ptr.set(e.pointerId, [e.clientX, e.clientY]); if (ptr.size === 2) { const [a, b] = [...ptr.values()]; pinch0 = Math.hypot(a[0] - b[0], a[1] - b[1]); fov0 = st.fov; } };
  look.onpointermove = (e) => { const p = ptr.get(e.pointerId); if (!p) return; if (ptr.size === 2) { ptr.set(e.pointerId, [e.clientX, e.clientY]); const [a, b] = [...ptr.values()]; const d = Math.hypot(a[0] - b[0], a[1] - b[1]); st.fov = Math.max(20, Math.min(100, fov0 * pinch0 / Math.max(10, d))); return; }
    st.yaw += (e.clientX - p[0]) * 0.005; st.pitch = Math.max(-1.45, Math.min(1.45, st.pitch - (e.clientY - p[1]) * 0.005)); ptr.set(e.pointerId, [e.clientX, e.clientY]); };
  look.onpointerup = look.onpointercancel = (e) => ptr.delete(e.pointerId);
  look.onwheel = (e) => { e.preventDefault(); st.fov = Math.max(20, Math.min(100, st.fov + Math.sign(e.deltaY) * 3)); };
  const kd = (e) => { if (e.target.tagName === 'INPUT') return; st.keys[e.code] = true; if (e.code === 'Escape') cerrar(); if (e.code === 'KeyH') R.classList.toggle('oculta'); e.stopPropagation(); }, ku = (e) => { st.keys[e.code] = false; };
  addEventListener('keydown', kd, true); addEventListener('keyup', ku, true);
  // recorrido de grúa (Catmull-Rom entre puntos clave)
  function reproducir() { if (st.claves.length < 2) return msg('Añade al menos 2 puntos'); st.reprod = { t0: performance.now(), dur: (st.claves.length - 1) * 4000 / Math.max(0.25, st.vel / 4) }; }
  const cr = (p0, p1, p2, p3, t) => 0.5 * ((2 * p1) + (-p0 + p2) * t + (2 * p0 - 5 * p1 + 4 * p2 - p3) * t * t + (-p0 + 3 * p1 - 3 * p2 + p3) * t * t * t);
  function enRecorrido() { const C = st.claves, k = Math.min(1, (performance.now() - st.reprod.t0) / st.reprod.dur), u = k * (C.length - 1), i = Math.min(C.length - 2, Math.floor(u)), t = u - i; const e = t * t * (3 - 2 * t);
    const g = (j) => C[Math.max(0, Math.min(C.length - 1, j))]; for (const c of ['x', 'y', 'z', 'yaw', 'pitch', 'fov']) st[c === 'x' || c === 'y' || c === 'z' ? 'pos' : c] = st[c === 'x' || c === 'y' || c === 'z' ? 'pos' : c];
    for (const c of ['x', 'y', 'z']) st.pos[c] = cr(g(i - 1)[c], g(i)[c], g(i + 1)[c], g(i + 2)[c], e); for (const c of ['yaw', 'pitch', 'fov']) st[c] = cr(g(i - 1)[c], g(i)[c], g(i + 1)[c], g(i + 2)[c], e);
    if (k >= 1) { st.reprod = null; if (st.rec && st.rec.auto) grabar(st.rec.boton); } }
  // grabar
  function grabar(b) {
    if (st.rec) { st.rec.mr.stop(); return; }
    if (!o.canvas.captureStream || !window.MediaRecorder) return msg('Este dispositivo no permite grabar el lienzo 3D');
    const vs = o.canvas.captureStream(30); let dest = null; try { if (o.audio && o.audio.ctx && o.audio.nodo) { dest = o.audio.ctx.createMediaStreamDestination(); o.audio.nodo.connect(dest); dest.stream.getAudioTracks().forEach(t => vs.addTrack(t)); } } catch (e) { }
    const tipo = ['video/webm;codecs=vp9,opus', 'video/webm;codecs=vp8,opus', 'video/webm', 'video/mp4'].find(t => MediaRecorder.isTypeSupported(t)) || '';
    const mr = new MediaRecorder(vs, tipo ? { mimeType: tipo, videoBitsPerSecond: 6e6 } : undefined), trozos = [];
    mr.ondataavailable = (e) => e.data.size && trozos.push(e.data);
    mr.onstop = () => { try { dest && o.audio.nodo.disconnect(dest); } catch (e) { } vs.getTracks().forEach(t => t.stop()); b.classList.remove('on'); b.textContent = '⏺ GRABAR'; const blob = new Blob(trozos, { type: (tipo || 'video/webm').split(';')[0] }); st.rec = null; ofrecer(blob); };
    mr.start(500); st.rec = { mr, boton: b, auto: !!st.reprod }; b.classList.add('on'); b.textContent = '⏹ PARAR'; msg('Grabando…');
  }
  function ofrecer(blob) {
    const ext = blob.type.includes('mp4') ? 'mp4' : 'webm', nombre = 'cabecera-' + new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-') + '.' + ext;
    const caja = document.createElement('div'); caja.className = 'cl-p'; caja.style.cssText = 'position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);background:#0a1a5aee;border:2px solid #ffd23a;border-radius:16px;padding:14px;display:flex;flex-direction:column;gap:8px;min-width:260px';
    caja.innerHTML = `<b>🎬 Grabación lista</b><small>${(blob.size / 1048576).toFixed(1)} MB · ${ext.toUpperCase()}</small>`;
    caja.append(B('💾 Guardar en el dispositivo', async () => { if (o.guardarArchivo) { await o.guardarArchivo(nombre, blob); return; } const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = nombre; document.body.appendChild(a); a.click(); a.remove(); msg('Guardado: ' + nombre); }),
      B('🎥 Usar como vídeo de la cabecera 3D', async () => { if (o.guardarCabecera) { await o.guardarCabecera(blob); msg('Guardado como vídeo de la cabecera 3D'); } caja.remove(); }), (o.guardarPromo ? B('🎬 Guardar para el Creador de promos', async () => { await o.guardarPromo(blob); msg('Toma guardada para el Creador de promos'); }) : ''), B('Cerrar', () => caja.remove()));
    ui.appendChild(caja);
  }
  // bucle
  let tAnt = performance.now();
  (function paso() { if (!st.vivo) return; const t = performance.now(), dt = Math.min(0.05, (t - tAnt) / 1000); tAnt = t;
    if (st.reprod) enRecorrido(); else {
      const k = st.keys, fx = (k.KeyD ? 1 : 0) - (k.KeyA ? 1 : 0) + st.mov.x, fz = (k.KeyS ? 1 : 0) - (k.KeyW ? 1 : 0) + st.mov.z, fy = (k.KeyE || k.Space ? 1 : 0) - (k.KeyQ || k.ShiftLeft ? 1 : 0) + st.mov.y;
      if (k.ArrowLeft) st.yaw -= dt * 1.5; if (k.ArrowRight) st.yaw += dt * 1.5; if (k.ArrowUp) st.pitch = Math.min(1.45, st.pitch + dt); if (k.ArrowDown) st.pitch = Math.max(-1.45, st.pitch - dt);
      const sx = Math.sin(st.yaw), cz = -Math.cos(st.yaw), v = st.vel * dt; st.pos.x += (sx * -fz + -cz * fx) * v; st.pos.z += (cz * -fz + sx * fx) * v; st.pos.y += fy * v;
    }
    const cp = Math.cos(st.pitch), mira = V(st.pos.x + Math.sin(st.yaw) * cp, st.pos.y + Math.sin(st.pitch), st.pos.z - Math.cos(st.yaw) * cp);
    if (Math.abs(cam.fov - st.fov) > 0.01) { cam.fov = st.fov; cam.updateProjectionMatrix(); }
    o.aplicar(st.pos, mira); info.textContent = `x ${st.pos.x.toFixed(1)} · y ${st.pos.y.toFixed(1)} · z ${st.pos.z.toFixed(1)} · FOV ${st.fov | 0}° · ${st.claves.length} puntos${st.rec ? ' · ● REC' : ''}`;
    requestAnimationFrame(paso); })();
  function cerrar() { if (st.rec) st.rec.mr.stop(); st.vivo = false; removeEventListener('keydown', kd, true); removeEventListener('keyup', ku, true); R.remove(); css.remove(); o.soltar && o.soltar(); }
  return { cerrar, estado: st };
}
