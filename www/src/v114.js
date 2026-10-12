// ===================================================================================================
// v1.14 · (1) Título del programa editable (Opciones › «Editar título del programa»): se dibuja con el MISMO
// diseño del logo (Arial Black 900, extrusión, contorno, degradado por letra y las barras ¡ !) en el menú,
// la cabecera 3D, las pantallas LED y los especiales. (2) Más programas especiales: Aniversario y Especial
// YouTube (rojo y blanco, botón de «play» propio, concursantes youtubers inventados, preguntas de internet;
// título del especial editable). (3) «Elegir vídeo para la cabecera 3D»: vídeo del móvil guardado en
// IndexedDB que se ve como VideoTexture en el muro curvo, las pantallas LED y un panel flotante del plató,
// con movimientos de cámara, profundidad y luces; sale como cabecera del programa y en Promos.
// ===================================================================================================
const TIT_DEF = (window.__LANG || 'it') === 'es' ? ['¡AHORA', 'CAIGO!', true] : ['CADUTA', 'LIBERA', true];
function tituloAC() {
  let t = ''; try { t = (localStorage.getItem('ac_titulo') || '').trim(); } catch (e) { }
  if (!t) return TIT_DEF;
  const marcas = /^¡/.test(t) && /!$/.test(t); const s = t.replace(/^¡\s*/, '').replace(/\s*!$/, '').toUpperCase();
  const w = s.split(/\s+/).filter(Boolean); if (w.length <= 1) return [s, '', marcas];
  let mejor = 1, dif = 1e9; for (let k = 1; k < w.length; k++) { const a = w.slice(0, k).join(' ').length, b = w.slice(k).join(' ').length; if (Math.abs(a - b) < dif) { dif = Math.abs(a - b); mejor = k; } }
  return [w.slice(0, mejor).join(' '), w.slice(mejor).join(' '), marcas];
}
const tituloTexto = () => { const [a, b, m] = tituloAC(); return (m ? '¡' : '') + (a + (b ? ' ' + b : '')) + (m ? '!' : ''); };
// botón de «play» propio (no es el logo de ninguna plataforma): triángulo blanco en un rectángulo redondeado
function acPlay(g, x, y, r, col) { // icono «play» propio: disco blanco con anillo rojo y triángulo (no es ningún logotipo de marca)
  g.save(); g.fillStyle = '#ffffff'; g.beginPath(); g.arc(x, y, r * 0.5, 0, 7); g.fill();
  g.strokeStyle = '#e8102a'; g.lineWidth = r * 0.09; g.beginPath(); g.arc(x, y, r * 0.43, 0, 7); g.stroke();
  g.setLineDash([r * 0.06, r * 0.05]); g.lineWidth = r * 0.03; g.beginPath(); g.arc(x, y, r * 0.34, 0, 7); g.stroke(); g.setLineDash([]);
  g.fillStyle = col || '#e8102a'; g.beginPath(); g.moveTo(x - r * 0.13, y - r * 0.2); g.lineTo(x + r * 0.22, y); g.lineTo(x - r * 0.13, y + r * 0.2); g.closePath(); g.fill(); g.restore();
}
// ---- especiales nuevos ----
const ytTitulo = () => { try { return (localStorage.getItem('ac_yt_titulo') || '').trim() || 'ESPECIAL YOUTUBE'; } catch (e) { return 'ESPECIAL YOUTUBE'; } };
const ESP114 = [
  { id: 'aniversario', name: 'Aniversario', emoji: '🎂', plato: 'virtual', wallA: '#3a1a00', wallB: '#c08a20', chevA: '#fff0b0', chevB: '#ffc21a', glow: 0xffc21a, accent: 0xfff0b0, fog: 0x0c0800, bg: 0x060400, host: { suit: 0x1a1a1a, shirt: 0xffffff, tie: 0xffc21a, bowtie: true, hat: 'fiesta' }, hashtag: '#AhoraCaigoAniversario', decor: 'especial300', banner: 'ESPECIAL ANIVERSARIO', festivo: true, saludo: '¡Muy buenas noches! Hoy estamos de cumpleaños: ¡especial aniversario de ¡Ahora caigo!!', extra: ['Tarta, confeti y trampillas con lazo. ¡Que nadie sople las velas antes de tiempo!'] },
  { id: 'youtube', name: 'Especial YouTube', emoji: '▶️', plato: 'virtual', wallA: '#7a0000', wallB: '#e01a1a', chevA: '#ffffff', chevB: '#ff3a3a', glow: 0xff2a2a, accent: 0xffffff, fog: 0x100000, bg: 0x080000, host: { suit: 0x141414, shirt: 0xffffff, tie: 0xff1a1a }, hashtag: '#AhoraCaigoYouTube', decor: 'none', festivo: true, tituloEditable: true,
    saludo: '¡Muy buenas noches! Hoy celebramos el aniversario de YouTube: ¡dale al play y no te olvides de suscribirte a las trampillas!', extra: ['Nuestros diez oponentes son youtubers (inventados): tienen más seguidores que el plató, pero las trampillas no entienden de «likes».'] },
];
Object.defineProperty(ESP114[1], 'banner', { get: ytTitulo, enumerable: true });
Object.defineProperty(ESP114[1], 'cabRotulo', { get: ytTitulo, enumerable: true });
ESP114.forEach(t => { if (!Do.find(d => d.id === t.id)) Do.push(t); });
Eo.aniversario = { ...(Eo.especial300 || Eo.primetime) };
Eo.youtube = { outer: '#b00000', inner: ['#ff3a3a', '#7a0000'], ring: '#ffffff', feet: '#ffffff', text: ['#ffffff', '#ffffff', '#ffd0d0', '#ffffff'], perLetter: ['#ff2a2a', '#ffffff'], stroke: '#2a0000', extrude: '#7a0010', deco: 'play' };
CAB_TEMAS.aniversario = { obj: ['tarta', 'confeti', 'estrella'], wall: '#5a3a00', wall2: '#c08a20', chev: '#fff0b0', ring: 0xffc21a, tunel: ['#1a0e00', '#ffc21a', '#fff6d0'], f2d: ['#7a4a00', '#d0a030', '#fff0b0'], ex: 'ESPECIAL ANIVERSARIO' };
CAB_TEMAS.youtube = { obj: ['play', 'corazon', 'estrella'], wall: '#9a0000', wall2: '#ff2a2a', chev: '#ffffff', ring: 0xff2a2a, tunel: ['#200000', '#ff2a2a', '#ffffff'], f2d: ['#b00000', '#ff3a3a', '#ffffff'] };
Object.defineProperty(CAB_TEMAS.youtube, 'ex', { get: ytTitulo, enumerable: true });
// concursantes youtubers inventados (no son personas reales)
const YT_RIVALES = ['Kiko Gamer', 'Lucía Recetas', 'Tito Unboxing', 'Marta Vlogs', 'Dani Trucos', 'Sara ASMR', 'Pepe Retos', 'Nora Maquillaje', 'Leo Ciencia', 'Inés Viajes'];
{ const r0 = me.rival.bind(me); me.rival = a => { const c = castingNombre(a); if (!c && Ms === 'youtube' && !(qt.rivales && qt.rivales[a - 1])) return YT_RIVALES[a - 1] || r0(a); return r0(a); }; }
Pv.youtube = [
  '¿En qué año se subió el primer vídeo a YouTube?|2[0]0[5]', '¿Cómo se llama a quien crea vídeos para una plataforma de internet?|C[R]EA[D]OR', '¿Qué botón se pulsa para ver un vídeo?|P[L]A[Y]',
  '¿Qué se pulsa para seguir a un canal y no perderse sus vídeos?|SUS[C]RI[B]IRSE', '¿Cómo se llama la imagen pequeña que anuncia un vídeo?|MI[N]IA[T]URA', '¿Qué red se usa para conectarse sin cables en casa?|W[I]F[I]',
  '¿Qué significa la «www» de las páginas web? World Wide…|W[E]B', '¿Cómo se llama el vídeo que se hace muy popular en poco tiempo?|VI[R]A[L]', '¿Qué se escribe delante de una palabra para crear una etiqueta en redes?|ALMOH[A]D[I]LLA',
  '¿Cómo se llama la emisión de vídeo en tiempo real?|DI[R]E[C]TO', '¿En qué ciudad de Estados Unidos nació YouTube? San…|MA[T]E[O]', '¿Qué aparato de bolsillo usamos para grabar y ver vídeos?|MÓ[V]I[L]',
  '¿Qué palabra inglesa usamos para «me gusta» en redes?|L[I]K[E]', '¿Cómo se llama el texto que aparece debajo del vídeo con lo que se dice?|SUB[T]Í[T]ULOS', '¿Qué empresa compró YouTube en 2006?|GO[O]G[L]E',
  '¿Cómo se llama la persona que ve un vídeo?|ES[P]EC[T]ADOR', '¿Qué se deja debajo de un vídeo para opinar?|CO[M]EN[T]ARIO', '¿Qué formato de vídeo corto y vertical se hizo famoso en los últimos años?|SHO[R]T[S]',
  '¿Qué se necesita para conectarse a internet desde el ordenador?|NA[V]EG[A]DOR', '¿Cómo se llama el aparato que graba vídeo y no es el móvil?|CÁ[M]A[R]A',
];
Pv.aniversario = (Pv.especial300 || Pv.primetime || []).slice();
// ---- vídeo de la cabecera 3D (IndexedDB) ----
const vcabDB = () => new Promise((res, rej) => { const r = indexedDB.open('ac_videocab', 1); r.onupgradeneeded = () => r.result.createObjectStore('v'); r.onsuccess = () => res(r.result); r.onerror = () => rej(r.error); });
async function vcabGuarda(f, clave) { const db = await vcabDB(); const k = clave || (f ? 'u' + Date.now() : vcabSel()); await new Promise((res, rej) => { const tx = db.transaction('v', 'readwrite'); f ? tx.objectStore('v').put(f, k) : tx.objectStore('v').delete(k); tx.oncomplete = res; tx.onerror = () => rej(tx.error); }); if (f) vcabElige(k); else if (k === vcabSel()) vcabElige(''); VCAB.url = null; VCAB.lista = null; return k; }
async function vcabLee(k) { try { const db = await vcabDB(); return await new Promise(res => { const q = db.transaction('v').objectStore('v').get(k); q.onsuccess = () => res(q.result || null); q.onerror = () => res(null); }); } catch (e) { return null; } }
async function vcabClaves() { try { const db = await vcabDB(); return await new Promise(res => { const q = db.transaction('v').objectStore('v').getAllKeys(); q.onsuccess = () => res(q.result || []); q.onerror = () => res([]); }); } catch (e) { return []; } }
const VCAB_FIJOS = [['cab1', 'Cabecera 1', 'cabecera/video1.mp4'], ['cab2', 'Cabecera 2', 'cabecera/video2.mp4'], ['cab3', 'Cabecera 3', 'cabecera/video3.mp4']]; // solo en el APK privado
const VCAB = { url: null, urlDe: null, lista: null, hay: null };
const vcabSel = () => { try { return localStorage.getItem('ac_vcab_sel') || ''; } catch (e) { return ''; } };
function vcabElige(k) { try { k ? localStorage.setItem('ac_vcab_sel', k) : localStorage.removeItem('ac_vcab_sel'); } catch (e) { } VCAB.url = null; }
const vcabOn = () => { try { return localStorage.getItem('ac_vcab_on') !== '0'; } catch (e) { return true; } };
const vcabModo = () => { try { return localStorage.getItem('ac_vcab_modo') || '3d'; } catch (e) { return '3d'; } };
async function vcabLista() { // [{k, nombre, fijo}]
  if (VCAB.lista) return VCAB.lista; const out = [];
  for (const [k, n, u] of VCAB_FIJOS) { try { const r = await fetch(u, { method: 'HEAD' }); if (r.ok) out.push({ k, nombre: n, fijo: u }); } catch (e) { } }
  let i = 0; for (const k of await vcabClaves()) { const b = await vcabLee(k); if (!b) continue; i++; out.push({ k, nombre: (b.name ? b.name.replace(/\.[^.]+$/, '') : (String(k).startsWith('r') ? 'Grabación ' : 'Mi vídeo ') + i).slice(0, 24) }); }
  return VCAB.lista = out;
}
async function vcabUrl() {
  const L = await vcabLista(); let e = L.find(x => x.k === vcabSel()) || L.find(x => !x.fijo) || L[0]; VCAB.hay = !!e; if (!e) return null;
  if (VCAB.url && VCAB.urlDe === e.k) return VCAB.url; if (VCAB.url && VCAB.url.startsWith('blob:')) URL.revokeObjectURL(VCAB.url);
  VCAB.urlDe = e.k; VCAB.url = e.fijo ? e.fijo : URL.createObjectURL(await vcabLee(e.k)); return VCAB.url;
}
async function vcabPantalla(sess) { // el vídeo elegido a pantalla completa como apertura
  const url = await vcabUrl(); if (!url) return false; const v = document.createElement('video'); v.src = url; v.playsInline = true; v.style.cssText = 'position:fixed;inset:0;width:100%;height:100%;object-fit:contain;background:#000;z-index:8000';
  document.body.appendChild(v); try { F.stopMusic && F.stopMusic(); } catch (e) { }
  try { await v.play(); } catch (e) { v.muted = true; try { await v.play(); } catch (x) { v.remove(); return false; } }
  await new Promise(r => { v.onended = r; v.onerror = r; v.onclick = r; const k = setInterval(() => { if (sess && (sess.alive === false || sess.skip || sess.saltar)) { clearInterval(k); r(); } }, 150); });
  v.pause(); v.remove(); return true;
}
PROMOS.videocab = { id: 'videocab', nombre: 'Cabecera 3D con tu vídeo', dur: 20, emoji: '🎥', sub: 'tu vídeo en el muro curvo, las pantallas LED y un panel flotante', soloMusica: true,
  montar(C) {
    const T = C.T, E = cabEstudio(C.cfg, C.def.tema || { id: 'normal' }, { sinObjetos: true }); C.escenas = [E.scene]; const v = C.def.video, D = C.def.dur;
    const tex = new T.VideoTexture(v); tex.colorSpace = T.SRGBColorSpace;
    const mat = new T.MeshBasicMaterial({ map: tex, side: T.DoubleSide, toneMapped: false });
    const ar = (v.videoWidth && v.videoHeight) ? v.videoWidth / v.videoHeight : 16 / 9;
    // muro curvo al fondo
    const muro = new T.Mesh(new T.CylinderGeometry(9, 9, 9 * 1.3 / ar, 64, 1, true, Math.PI - 0.65, 1.3), mat); muro.position.set(0, 9 * 1.3 / ar / 2 + 0.6, 0); E.scene.add(muro);
    // panel flotante con marco de luz
    const pan = new T.Group(); const pm = new T.Mesh(new T.PlaneGeometry(3.4, 3.4 / ar), mat); const marco = new T.Mesh(new T.PlaneGeometry(3.6, 3.4 / ar + 0.2), new T.MeshBasicMaterial({ color: C.cfg.ring || 0x2ad8ff }));
    marco.position.z = -0.02; pan.add(marco, pm); pan.position.set(0, 2.4, 1.2); E.scene.add(pan);
    // pantallas LED laterales (repiten el vídeo)
    const leds = []; for (const s of [-1, 1]) { const m = new T.Mesh(new T.PlaneGeometry(2.2, 2.2 / ar), mat); m.position.set(s * 5.6, 2.3, -3.2); m.rotation.y = -s * 0.7; E.scene.add(m); leds.push(m); }
    // luces de colores que barren el plató
    const luces = []; const cols = [0xff2a6a, 0x2ad8ff, 0xffd23a, 0x7a3aff]; for (let i = 0; i < 4; i++) { const l = new T.PointLight(cols[i], 18, 14, 1.6); l.position.set(Math.cos(i * 1.57) * 5, 3.2, Math.sin(i * 1.57) * 5); E.scene.add(l); luces.push(l); }
    E.scene.add(new T.AmbientLight(0xffffff, 0.35));
    const [l1, l2] = tituloAC(); const rT = C.rotulo((l1 + ' ' + l2).trim(), 0.9, { cara: 'blanco' });
    let arrancado = false;
    return t => {
      if (!arrancado) { arrancado = true; v.currentTime = 0; v.play().catch(() => { }); }
      if (C.audioOrig && Math.abs(v.currentTime - t) > 0.35) try { v.currentTime = t; } catch (e) { }
      E.update(t);
      promoTramo(C, t, [[0, D * 0.25, [0, 7, 16], [0, 3.2, 9], [0, 3, 0], [0, 2.6, 0]], [D * 0.25, D * 0.5, [-7, 2.2, 6], [-2, 1.6, 4.2], [0, 2.4, 1], [0, 2.4, 1.2]],
        [D * 0.5, D * 0.75, [6.5, 4.5, 4], [3, 1.4, 6], [-2, 3, -4], [0, 2.4, 0]], [D * 0.75, D + 1, [0, 1.2, 8], [0, 2.6, 5.4], [0, 2.4, 1.2], [0, 2.4, 1.2]]]);
      pan.position.y = 2.4 + Math.sin(t * 1.3) * 0.12; pan.rotation.y = Math.sin(t * 0.5) * 0.3; pan.rotation.x = Math.sin(t * 0.7) * 0.05;
      luces.forEach((l, i) => { const a = t * 0.8 + i * 1.57; l.position.set(Math.cos(a) * 5, 3.2 + Math.sin(t * 2 + i) * 0.6, Math.sin(a) * 5); l.intensity = 12 + Math.sin(t * 6 + i) * 6; });
      leds.forEach((m, i) => { m.position.y = 2.3 + Math.sin(t + i) * 0.05; });
      C.render(E.scene); C.anima(rT, t, Math.max(0, D - 3.5), D + 1, 'golpe');
      if (t >= D - 0.1) v.pause();
    };
  } };
async function cabVideo(hud, sess, theme) {
  const url = await vcabUrl(); if (!url) return false;
  const v = document.createElement('video'); v.src = url; v.muted = true; v.playsInline = true; v.preload = 'auto'; v.crossOrigin = 'anonymous';
  await new Promise(r => { v.onloadedmetadata = r; v.onerror = r; setTimeout(r, 5000); });
  const dur = Math.max(6, Math.min(45, v.duration || 20));
  const def = { ...PROMOS.videocab, dur, video: v, tema: theme || { id: 'normal' }, audioUrl: url };
  try { return await promoCorre(def, hud, sess); } finally { try { v.pause(); v.removeAttribute('src'); v.load(); } catch (e) { } }
}
async function cabVideoPrograma(hud, sess, theme) { if (!vcabOn()) return false; const u = await vcabUrl(); if (!u) return false; mec('cabecera con vídeo propio'); return vcabModo() === 'pantalla' ? await vcabPantalla(sess) : await cabVideo(hud, sess, theme); }
// sintonía corta propia de cada especial (al empezar el programa)
const STING = { navidad: [784, 988, 1175, 1568], halloween: [220, 262, 311, 233], sanvalentin: [659, 784, 988, 1319], verano: [523, 659, 784, 1047], carnaval: [587, 740, 880, 1175], findeano: [523, 784, 1047, 1568], ninos: [659, 880, 659, 1047], famosos: [392, 523, 659, 784], aniversario: [523, 659, 784, 1047, 1319], youtube: [880, 1175, 880, 1760], primetime: [392, 494, 587, 784] };
function espSting(id) {
  const n = STING[id]; if (!n || To.mute) return;
  try { const c = F.ctx, t0 = c.currentTime + 0.05; n.forEach((f, i) => { const o = c.createOscillator(), g = c.createGain(); o.type = id === 'halloween' ? 'sawtooth' : 'triangle'; o.frequency.value = f; g.gain.setValueAtTime(0, t0 + i * 0.14); g.gain.linearRampToValueAtTime(0.2, t0 + i * 0.14 + 0.02); g.gain.exponentialRampToValueAtTime(0.001, t0 + i * 0.14 + 0.5); o.connect(g); g.connect(c.destination); o.start(t0 + i * 0.14); o.stop(t0 + i * 0.14 + 0.55); }); } catch (e) { }
}
// ---- filas de Opciones ----
function filaTitulo() {
  const w = document.createElement('div'); w.className = 'orow orow-wrap'; w.id = 'rowTitulo';
  const lb = document.createElement('label'); lb.textContent = '✏️ Editar título del programa'; w.appendChild(lb);
  const inp = document.createElement('input'); inp.type = 'text'; inp.maxLength = 32; inp.placeholder = '¡AHORA CAIGO!'; try { inp.value = localStorage.getItem('ac_titulo') || ''; } catch (e) { }
  inp.style.cssText = 'flex:1;min-width:160px;padding:6px 10px;border-radius:10px;border:2px solid #3a6aff;font:700 15px system-ui'; inp.onclick = e => e.stopPropagation(); inp.onkeydown = e => e.stopPropagation();
  const ok = document.createElement('button'); ok.className = 'tbtn'; ok.textContent = 'Guardar'; ok.onclick = e => { e.stopPropagation(); localStorage.setItem('ac_titulo', inp.value.trim()); Lt('options'); };
  const rs = document.createElement('button'); rs.className = 'tbtn'; rs.textContent = 'Restaurar original'; rs.onclick = e => { e.stopPropagation(); localStorage.removeItem('ac_titulo'); Lt('options'); };
  w.append(inp, ok, rs);
  if (Ms === 'youtube' || true) {
    const l2 = document.createElement('label'); l2.textContent = '▶️ Título del Especial YouTube'; l2.style.width = '100%';
    const i2 = document.createElement('input'); i2.type = 'text'; i2.maxLength = 32; i2.placeholder = 'ESPECIAL YOUTUBE'; try { i2.value = localStorage.getItem('ac_yt_titulo') || ''; } catch (e) { }
    i2.style.cssText = inp.style.cssText; i2.onclick = e => e.stopPropagation(); i2.onkeydown = e => e.stopPropagation();
    const o2 = document.createElement('button'); o2.className = 'tbtn'; o2.textContent = 'Guardar'; o2.onclick = e => { e.stopPropagation(); localStorage.setItem('ac_yt_titulo', i2.value.trim()); Lt('options'); };
    w.append(l2, i2, o2);
  }
  return w;
}
function filaVideoCab() {
  const w = document.createElement('div'); w.className = 'orow orow-wrap'; w.id = 'rowVideoCab';
  const lb = document.createElement('label'); lb.textContent = '🎥 ELEGIR VÍDEO PARA LA CABECERA 3D'; lb.style.width = '100%'; w.appendChild(lb);
  const bt = (t, fn, sel) => { const b = document.createElement('button'); b.className = 'tbtn' + (sel ? ' sel' : ''); b.textContent = t; b.onclick = e => { e.stopPropagation(); fn(); }; return b; };
  const lista = document.createElement('div'); lista.style.cssText = 'display:flex;flex-wrap:wrap;gap:6px;width:100%'; w.appendChild(lista);
  vcabLista().then(async L => { const u = await vcabUrl(); const sel = VCAB.urlDe; if (!L.length) lista.textContent = 'Aún no hay vídeos: elige uno del móvil o graba uno con la Cámara libre.';
    for (const e of L) lista.appendChild(bt((e.fijo ? '🎬 ' : '🎞 ') + e.nombre, () => { vcabElige(e.k); Lt('options'); }, e.k === sel)); });
  const inp = document.createElement('input'); inp.type = 'file'; inp.accept = 'video/*'; inp.style.display = 'none';
  inp.onchange = async () => { const f = inp.files && inp.files[0]; if (f) { await vcabGuarda(f); try { yn.toast('🎥 Vídeo guardado: ' + f.name, 2500); } catch (e) { } Lt('options'); } };
  w.append(inp, bt('➕ Elegir vídeo…', () => inp.click()), bt('▶ Probar', async () => { const m = document.getElementById('menu'); m && m.classList.add('hidden'); try { vcabModo() === 'pantalla' ? await vcabPantalla(null) : await cabVideo(null, null, xf(Ms)); } finally { Lt('options'); } }),
    bt('🗑 Quitar el elegido', async () => { const k = VCAB.urlDe; if (!k || k.startsWith('cab')) return yn.toast('Las cabeceras incluidas no se pueden quitar', 2500); await vcabGuarda(null, k); Lt('options'); }),
    bt('Ver: ' + (vcabModo() === 'pantalla' ? 'Pantalla completa' : 'En el plató 3D'), () => { localStorage.setItem('ac_vcab_modo', vcabModo() === 'pantalla' ? '3d' : 'pantalla'); Lt('options'); }),
    bt(vcabOn() ? 'Usar en el programa: Sí' : 'Usar en el programa: No', () => { localStorage.setItem('ac_vcab_on', vcabOn() ? '0' : '1'); Lt('options'); }, vcabOn()));
  return w;
}
window.__v114 = { tituloAC, tituloTexto, cabVideo, vcabGuarda, vcabLista, vcabPantalla, YT_RIVALES };

function tituloL1() { const t = tituloAC(); return (t[2] ? '¡' : '') + t[0] + (t[1] ? '' : (t[2] ? '!' : '')); }
function tituloL2() { const t = tituloAC(); return t[1] ? t[1] + (t[2] ? '!' : '') : ' '; }
function acLogoPropio() { try { if ((localStorage.getItem('ac_titulo') || '').trim()) return true; } catch (e) { } return typeof Ms !== 'undefined' && Ms !== 'normal' && !!Eo[Ms]; }
