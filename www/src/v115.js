// ===== ¡Ahora caigo! 1.15: Cámara libre, Creador de promos, Mis hashtags, Guardar logo (PNG transparente) =====
let EXAC = null;
function acLogoVariante(size, v) { // dibuja el logo (2D) con la variante pedida y restaura el estado
  const esp0 = Ms, t0 = localStorage.getItem('ac_titulo'); v = v || { tipo: 'actual' };
  try { if (v.tipo === 'especial') Ms = v.id; if (v.tipo === 'original') { Ms = 'normal'; localStorage.removeItem('ac_titulo'); } return ph(size, Math.round(size * .875), { variant: Eo[Ms] ? Ms : 'normal' }); }
  finally { Ms = esp0; if (t0 != null) localStorage.setItem('ac_titulo', t0); }
}
function acVariantes() { const L = [{ tipo: 'actual', nombre: 'Actual' }, { tipo: 'original', nombre: 'Original' }]; if ((localStorage.getItem('ac_titulo') || '').trim()) L.push({ tipo: 'titulo', nombre: 'Título propio' }); for (const e of Do) if (e.id !== 'normal' && Eo[e.id]) L.push({ tipo: 'especial', id: e.id, nombre: /^especial/i.test(e.name) ? e.name : 'Especial ' + e.name }); return L; }
function acEnMenu() { return Mi && Gr === 'main' && !en('menu').classList.contains('hidden'); }
function instalaV115() {
  if (EXAC) return EXAC;
  window.__EXAC = () => EXAC; EXAC = crearExtras({ pref: 'ac', color: '#ffc21a', color2: '#0b2fa8', titulo: () => tituloTexto(), hashtagDef: '#AhoraCaigo', toast: t => yn.toast(t, 2600),
    especial: () => Ms, especiales: () => Do.filter(e => Eo[e.id]).map(e => ({ id: e.id, nombre: e.name })),
    logoCanvas: async (size, v) => acLogoVariante(size, v), variantesLogo: acVariantes,
    audioCtx: () => F.ctx, salida: () => F.master, piperBase: (window.__LANG === 'it' ? 'piper_it/' : 'piper/'), piezasBase: 'voz/pal/', pideArchivo: (acc) => new Promise(res => { const i = document.createElement('input'); i.type = 'file'; i.accept = acc || '*/*'; i.onchange = () => res(i.files[0] || null); i.click(); }),
    musicas: () => [['Trilha', 'Tema principal'], ['TemaCurto', 'Tema corto'], ['SuspenseDuelo', 'Suspense del duelo'], ['TrilhaCurta@Stage', 'Cortinilla']],
    musica: { play: id => F.playMusic(id, true, .8), stop: () => F.stopMusic(), vol: f => { const m = F.musicSrc; if (m) m.gain.gain.setTargetAtTime(.8 * f, F.ctx.currentTime, .15); } },
    cabeceras: () => (VCAB.lista || []).map(x => ({ id: x.k, nombre: x.nombre })),
    cabeceraUrl: async (k) => { const L = await vcabLista(); const e = L.find(x => x.k === k); if (!e) return null; return e.fijo ? e.fijo : URL.createObjectURL(await vcabLee(e.k)); },
    platoCanvas: async () => { try { Xe.startOrbit(new _E.Vector3(0, 0, 0), 10.8, 4.8, 0.5, 0.06, 1.2); } catch (e) { } return Xe.renderer.domElement; },
    alEmpezar: () => { try { F.stopMusic(); } catch (e) { } }, enMenu: acEnMenu });
  vcabLista().catch(() => { }); window.__EX = EXAC; acLedHashtags(); return EXAC;
}
let acLed = null;
function acLedHashtags() { // tira LED con el hashtag que rota, sobre el fondo del plató
  if (acLed) return; const cv = document.createElement('canvas'); cv.width = 1024; cv.height = 128; const T = _E, tx = new T.CanvasTexture(cv); tx.colorSpace = T.SRGBColorSpace;
  acLed = new T.Mesh(new T.PlaneGeometry(6.4, .8), new T.MeshBasicMaterial({ map: tx, transparent: true, toneMapped: false })); acLed.position.set(0, 6.6, -8.6); Xe.scene.add(acLed);
  setInterval(() => { const s = EXAC.htActual(); acLed.visible = !!s && !Xe.override; if (!s) return; const g = cv.getContext('2d'); g.clearRect(0, 0, 1024, 128); g.fillStyle = 'rgba(0,0,0,.75)'; g.fillRect(0, 0, 1024, 128); g.fillStyle = '#ffc21a'; g.fillRect(0, 0, 14, 128); g.fillRect(0, 120, 1024, 8); g.font = 'bold 76px system-ui'; g.fillStyle = '#fff'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(s, 512, 64, 980); tx.needsUpdate = true; }, 1000);
}
// ---- Cámara libre en ¡Ahora caigo! (usa Xe.override: la escena del plató con una cámara propia) ----
function camaraLibreAC() {
  const cam = Xe.camera.clone(); const mira = new _E.Vector3(0, 1.2, 0); cam.position.set(0, 3.2, 9); cam.lookAt(mira);
  Xe.override = { scene: Xe.scene, camera: cam, update: () => { } }; try { F.playMusic('Trilha', true, .6); } catch (e) { }
  let luces = true, led = true;
  return new Promise(res => abrirCamaraLibre({ canvas: Xe.renderer.domElement, camera: cam, mira, audio: { ctx: F.ctx, nodo: F.master }, toast: t => yn.toast(t, 2200),
    aplicar: (p, m) => { cam.position.set(p.x, p.y, p.z); mira.set(m.x, m.y, m.z); cam.lookAt(mira); },
    toggles: { '💡 Luces': on => { Xe.scene.traverse(o => { if (o.isLight && !o.isAmbientLight && !o.isHemisphereLight) o.visible = on; }); luces = on; },
      '📺 LEDs': on => { led = on; Xe.scene.traverse(o => { if (o.isMesh && o.material && o.material.map && o.material.map.isVideoTexture) o.visible = on; }); if (acLed) acLed.visible = on; },
      '🖼 Logo': on => Xe.scene.traverse(o => { if (o.isMesh && o.material && o.material.map && o.material.map.image && o.material.map.image.width >= 400 && o.material.map.image.height >= 350 && o.material.map.image.height < o.material.map.image.width) o.visible = on; }),
      '👥 Público': on => { try { Xe.setAudience ? Xe.setAudience(on) : (Xe.audience && (Xe.audience.visible = on)); } catch (e) { } },
      '🎵 Música': on => on ? F.playMusic('Trilha', true, .6) : F.stopMusic() },
    guardarCabecera: async blob => { await vcabGuarda(new File([blob], 'Grabación cámara libre.webm', { type: blob.type }), 'r' + Date.now()); VCAB.lista = null; },
    guardarPromo: b => EXAC.guardarTomaCamLibre(b), guardarArchivo: (n, b) => EXAC.guardar(n, b, 'Movies'),
    soltar: () => { Xe.override = null; Xe.scene.traverse(o => { if (o.isLight) o.visible = true; }); try { F.stopMusic(); } catch (e) { } res(); } }));
}
function filasV115() {
  const fila = (txt, sub, fn) => { const d = document.createElement('div'); d.className = 'ocustom'; const l = document.createElement('div'); l.className = 'olabel'; l.textContent = txt; const r = document.createElement('div'); r.className = 'orow'; const b = document.createElement('button'); b.className = 'tbtn'; b.textContent = sub; b.onclick = e => { e.stopPropagation(); try { F.play('Tecla'); } catch (x) { } fn(); }; r.appendChild(b); d.append(l, r); return d; };
  instalaV115();
  return [filaIdioma(), fila('# Mis hashtags', 'Editar hashtags', () => EXAC.panelHashtags()), fila('🎬 Creador de promos', 'Abrir el creador', () => EXAC.panelPromos()), fila('🖼 Guardar logo (PNG transparente)', 'Guardar logos', () => EXAC.panelLogo()), fila('🎥 Cámara libre', 'Abrir la cámara libre', () => ii('camlibre'))];
}
function promosV115(r) { instalaV115(); const z = document.createElement('div'); z.className = 'col'; r.appendChild(z); z.appendChild(ei('🎬 Creador de promos', 'Crea, edita, borra y exporta tus promos en vídeo', 'gold', () => EXAC.panelPromos())); EXAC.promosLista().then(L => { for (const p of L) z.appendChild(ei('⭐ ' + p.titulo, [p.dia, p.hora].filter(Boolean).join(' · ') + ' · promo propia', '', () => EXAC.reproducir(p))); }).catch(() => { }); }
window.__v115 = { instalaV115, camaraLibreAC, acLogoVariante };
