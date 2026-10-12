// ===================================================================================================
// Opciones › «Cargar sb3 / sonidos / sprites»: sube el .sb3 del Scratch (o sonidos e imágenes sueltos o en zip).
// Todo se guarda solo en este dispositivo (IndexedDB) y se coloca por nombre en los huecos del juego.
// ===================================================================================================
const REC = { filtro: 'todo', abiertos: new Set(), audio: null, audioKey: null };
function recAviso(txt) { try { sessionStorage.setItem('ac_rec_msg', txt); } catch (e) { } }
function recRecargar() { const u = location.pathname + '?screen=recursos' + location.hash; location.replace(u); }
function menuRecursos(r) {
  r.classList.add('opts'); r.appendChild(Pa('Cargar sb3 / sonidos / sprites'));
  try { if (ds.get('screen') === 'recursos') history.replaceState(null, '', location.pathname + location.hash); } catch (e) { }
  const el = (tag, css, html) => { const d = document.createElement(tag); if (css) d.style.cssText = css; if (html != null) d.innerHTML = html; return d; };
  const caja = (html, css = '') => el('div', 'background:#0a1a5acc;border:2px solid #3a6aff;border-radius:16px;padding:10px 12px;margin:4px 0;color:#fff;font:14px system-ui,Arial,sans-serif;' + css, html);
  const boton = (txt, fn, cls = '') => { const b = document.createElement('button'); b.className = 'tbtn ' + cls; b.innerHTML = txt; b.onclick = ev => { ev.stopPropagation(); try { F.play('Tecla'); } catch (e) { } fn(b, ev); }; return b; };
  const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const S = RC.slots();
  r.appendChild(caja('Sube el <b>.sb3</b> de tu juego de Scratch y se sacan <b>todos</b> sus sonidos y disfraces (sprites), con sus nombres. Cada uno va solo a su hueco del juego: acierto, fallo, trampilla, caída, moneda, duelos, cabeceras, músicas, logo, huellas, monedas, rótulos, pantallas… También puedes subir sonidos e imágenes sueltos o en un <b>zip</b>. Se guarda solo en este dispositivo.'));
  const resumen = caja(''); resumen.id = 'recResumen'; r.appendChild(resumen);
  const msg = el('p', '', ''); msg.className = 'onote'; msg.id = 'recMsg';
  try { const m = sessionStorage.getItem('ac_rec_msg'); if (m) { msg.innerHTML = m; sessionStorage.removeItem('ac_rec_msg'); } } catch (e) { }
  // ---- interruptor «Usar mis archivos» ----
  const fu = document.createElement('div'); fu.className = 'orow'; fu.appendChild(el('label', '', '🎛️ Usar mis archivos'));
  const bSi = boton('Sí', () => cambiaUsar(true), RC.usar ? 'sel' : ''), bNo = boton('No', () => cambiaUsar(false), RC.usar ? '' : 'sel'); bSi.id = 'recUsarSi'; bNo.id = 'recUsarNo';
  const cambiaUsar = v => { if (RC.usar === v) return; RC.usar = v; recAviso(v ? '✅ El juego usa tus archivos.' : '⬜ El juego usa sus propios sonidos y gráficos (tus archivos siguen guardados).'); recRecargar(); };
  fu.append(bSi, bNo); r.appendChild(fu);
  // ---- subir ----
  const inSb3 = document.createElement('input'); inSb3.type = 'file'; inSb3.id = 'recInSb3'; inSb3.style.display = 'none'; inSb3.accept = '.sb3,.sprite3,.zip,application/zip,application/x.scratch.sb3';
  const inSue = document.createElement('input'); inSue.type = 'file'; inSue.id = 'recInSueltos'; inSue.multiple = true; inSue.style.display = 'none'; inSue.accept = '.zip,.sb3,.sprite3,audio/*,image/*,video/mp4,.svg';
  const inHueco = document.createElement('input'); inHueco.type = 'file'; inHueco.id = 'recInHueco'; inHueco.style.display = 'none';
  const fs = document.createElement('div'); fs.className = 'orow orow-wrap'; fs.appendChild(el('label', '', '📂 Subir archivos'));
  const subir = async files => {
    if (!files.length) return; msg.textContent = '⏳ Leyendo…';
    try {
      const res = await RC.cargar(files, t => msg.textContent = t); try { F.buffers.clear(); } catch (e) { }
      const txt = `✅ ${res.sb3 ? 'Proyecto Scratch leído: ' : ''}${res.total} archivos · colocados: ${res.ns} sonidos, ${res.ni} imágenes${res.nl ? ', logo' : ''}${res.nv ? ', vídeo' : ''}${res.np ? ` · <b>${res.np} sin reconocer</b> (míralos en «Sin asignar» y usa «Asignar a…»)` : ''}.`;
      if (res.ni || res.nl || res.nv) { recAviso(txt); msg.innerHTML = txt + ' Aplicando…'; setTimeout(recRecargar, 900); } else { msg.innerHTML = txt; pinta(); }
    } catch (e) { msg.textContent = '❌ No se pudo leer: ' + (e && e.message || e); }
  };
  inSb3.onchange = () => { const f = [...inSb3.files]; inSb3.value = ''; subir(f); };
  inSue.onchange = () => { const f = [...inSue.files]; inSue.value = ''; subir(f); };
  const b1 = boton('📦 Subir .sb3', () => inSb3.click(), 'sel'); b1.id = 'recSb3';
  const b2 = boton('🎵🖼️ Sonidos / imágenes / zip', () => inSue.click()); b2.id = 'recSueltos';
  const b3 = boton('🗑️ Borrar todo', async () => { if (!confirm('¿Borrar todos los sonidos e imágenes que has cargado en este dispositivo?')) return; await RC.borrar(); recAviso('🗑️ Borrado todo lo cargado.'); recRecargar(); });
  fs.append(b1, b2, b3, inSb3, inSue, inHueco); r.append(fs, msg);
  // ---- filtro ----
  const ff = document.createElement('div'); ff.className = 'orow orow-wrap'; ff.appendChild(el('label', '', '🔎 Mostrar'));
  for (const [v, t] of [['todo', 'Todo'], ['falta', 'Lo que falta'], ['ok', 'Cargado'], ['snd', 'Sonidos'], ['img', 'Imágenes']]) ff.appendChild(boton(t, b => { REC.filtro = v; ff.querySelectorAll('button').forEach(x => x.classList.toggle('sel', x === b)); pinta(); }, REC.filtro === v ? 'sel' : ''));
  r.appendChild(ff);
  const lista = el('div', 'display:flex;flex-direction:column;gap:6px'); lista.id = 'recLista'; r.appendChild(lista);
  r.appendChild(Ia('options'));
  // ---- acciones de un hueco ----
  const parar = () => { if (REC.audio) { try { REC.audio.pause(); } catch (e) { } } REC.audio = null; REC.audioKey = null; };
  const escuchar = async (key, url, b) => {
    if (REC.audioKey === key) { parar(); b.textContent = '▶️'; return; } parar();
    const u = url || await RC.vistaHueco(key); if (!u) return; const a = new Audio(u); a.volume = 0.9; REC.audio = a; REC.audioKey = key; b.textContent = '⏹️';
    a.onended = a.onerror = () => { if (REC.audioKey === key) { REC.audioKey = null; b.textContent = '▶️'; } }; a.play().catch(() => { b.textContent = '▶️'; });
  };
  const ver = async (key, url, titulo, kind) => {
    const u = url || await RC.vistaHueco(key); if (!u) return;
    const m = el('div', 'position:fixed;inset:0;z-index:60;background:#000c;display:flex;align-items:center;justify-content:center;flex-direction:column;gap:10px;padding:12px');
    m.className = 'modal'; const t = el('div', 'color:#fff;font:700 16px system-ui', esc(titulo));
    const im = kind === 'video' ? el('video', 'max-width:92vw;max-height:76vh;background:#000') : el('img', 'max-width:92vw;max-height:76vh;object-fit:contain;background:repeating-conic-gradient(#556 0 25%,#334 0 50%) 0 0/20px 20px;border:2px solid #3a6aff;border-radius:8px');
    im.src = u; if (kind === 'video') { im.controls = true; im.autoplay = true; }
    const c = boton('Cerrar', () => m.remove(), 'sel'); m.onclick = ev => { if (ev.target === m) m.remove(); }; m.append(t, im, c); document.getElementById('menu').appendChild(m);
  };
  const subirHueco = s => {
    inHueco.accept = s.kind === 'img' ? 'image/*,.svg' : s.kind === 'video' ? 'video/mp4' : 'audio/*,.wav,.mp3,.ogg';
    inHueco.onchange = async () => {
      const f = inHueco.files[0]; inHueco.value = ''; if (!f) return; msg.textContent = '⏳ Guardando…';
      let blob = f; if (/\.wav$/i.test(f.name) || f.type === 'audio/wav' || f.type === 'audio/x-wav') { const c = adpcmAPcm(new Uint8Array(await f.arrayBuffer())); if (c) blob = new Blob([c], { type: 'audio/wav' }); }
      if (!blob.type) blob = new Blob([await f.arrayBuffer()], { type: TIPOS[(f.name.split('.').pop() || '').toLowerCase()] || 'application/octet-stream' });
      await RC.ponerHueco(s.key, blob, f.name); try { F.buffers.clear(); } catch (e) { }
      msg.innerHTML = `✅ «${esc(s.etiqueta)}» cambiado.` + (s.kind !== 'snd' ? ' <b>Las imágenes del plató se actualizan al pulsar «🔄 Aplicar».</b>' : ''); REC.sucio = REC.sucio || s.kind !== 'snd'; pinta();
    };
    inHueco.click();
  };
  const fila = s => {
    const est = RC.estadoHueco(s.key); const d = el('div', 'display:flex;align-items:center;gap:8px;padding:5px 8px;border-radius:10px;background:' + (est ? '#0a3a2a99' : '#3a0a1a88') + ';border:1px solid ' + (est ? '#2fbf6a77' : '#ff5a7a66'));
    d.dataset.key = s.key;
    const pv = el('div', 'flex:0 0 46px;height:34px;display:flex;align-items:center;justify-content:center;border-radius:6px;background:repeating-conic-gradient(#556 0 25%,#334 0 50%) 0 0/12px 12px;font-size:20px;overflow:hidden');
    if (s.kind === 'img' && est) { const im = el('img', 'max-width:100%;max-height:100%;object-fit:contain'); im.loading = 'lazy'; RC.vistaHueco(s.key).then(u => { if (u) im.src = u; }); pv.appendChild(im); } else pv.textContent = s.kind === 'img' ? '🖼️' : s.kind === 'video' ? '🎬' : '🎵';
    const o = RC.origen(s.key); const scr = s.kind === 'img' ? (s.sprite ? s.sprite + ' / ' + s.nombre : s.nombre) : s.nombre;
    const tx = el('div', 'flex:1;min-width:0;font:13px system-ui,Arial;color:#fff;line-height:1.2', `<b>${esc(s.etiqueta)}</b><br><small style="color:#bcd">${esc(scr)}${o && o !== scr ? ' ← ' + esc(o) : ''}</small>`);
    const chip = el('span', 'flex:0 0 auto;font:800 11px system-ui;padding:3px 7px;border-radius:9px;background:' + (est === 'mio' ? '#1fbf4a' : est ? '#2a6aff' : '#c0203a'), est === 'mio' ? 'Cargado' : est ? 'Incluido' : 'Falta');
    d.append(pv, tx, chip);
    const bs = el('div', 'display:flex;gap:4px;flex:0 0 auto');
    if (est) bs.appendChild(s.kind === 'snd' ? boton('▶️', b => escuchar(s.key, null, b), 'mini') : boton('👁️', () => ver(s.key, null, s.etiqueta, s.kind), 'mini'));
    bs.appendChild(boton(est === 'mio' ? '🔁' : '⬆️', () => subirHueco(s), 'mini'));
    if (est === 'mio') bs.appendChild(boton('🗑️', async () => { await RC.quitarHueco(s.key); try { F.buffers.clear(); } catch (e) { } REC.sucio = REC.sucio || s.kind !== 'snd'; pinta(); }, 'mini'));
    bs.querySelectorAll('button').forEach((b, i) => { b.style.cssText = 'min-width:0;padding:4px 7px;font-size:15px'; b.title = b.textContent === '▶️' ? 'Escuchar' : b.textContent === '👁️' ? 'Ver' : b.textContent === '🗑️' ? 'Borrar' : est === 'mio' ? 'Cambiar' : 'Subir'; });
    d.appendChild(bs); return d;
  };
  const filaPool = p => {
    const d = el('div', 'display:flex;align-items:center;gap:8px;flex-wrap:wrap;padding:5px 8px;border-radius:10px;background:#3a2a0a99;border:1px solid #ffc21a77');
    const pv = el('div', 'flex:0 0 46px;height:34px;display:flex;align-items:center;justify-content:center;border-radius:6px;background:repeating-conic-gradient(#556 0 25%,#334 0 50%) 0 0/12px 12px;font-size:20px;overflow:hidden');
    if (p.kind === 'img') { const im = el('img', 'max-width:100%;max-height:100%;object-fit:contain'); im.loading = 'lazy'; im.src = p.url; pv.appendChild(im); } else pv.textContent = p.kind === 'video' ? '🎬' : '🎵';
    const tx = el('div', 'flex:1;min-width:120px;font:13px system-ui,Arial;color:#fff', `<b>${esc(p.nombre)}</b><br><small style="color:#fd8">${esc(p.sprite || 'archivo suelto')}</small>`);
    const sel = document.createElement('select'); sel.style.cssText = 'max-width:220px;padding:5px;border-radius:8px;font:13px system-ui'; sel.onclick = ev => ev.stopPropagation();
    sel.appendChild(new Option('Asignar a…', ''));
    const comp = S.todos.filter(s => s.kind === p.kind); const ord = comp.filter(s => !RC.estadoHueco(s.key)).concat(comp.filter(s => RC.estadoHueco(s.key)));
    let grupo = null, og = null; for (const s of ord) { const g = (RC.estadoHueco(s.key) ? 'Ya cargado · ' : 'Falta · ') + s.grupo; if (g !== grupo) { og = document.createElement('optgroup'); og.label = g; sel.appendChild(og); grupo = g; } og.appendChild(new Option(s.etiqueta, s.key)); }
    sel.onchange = async () => { if (!sel.value) return; const s = S.porKey.get(sel.value); await RC.asignar(p.id, sel.value); try { F.buffers.clear(); } catch (e) { } msg.innerHTML = `✅ «${esc(p.nombre)}» asignado a «${esc(s.etiqueta)}».`; REC.sucio = REC.sucio || p.kind !== 'snd'; pinta(); };
    const b = p.kind === 'snd' ? boton('▶️', bb => escuchar('pool:' + p.id, p.url, bb), 'mini') : boton('👁️', () => ver('pool:' + p.id, p.url, p.nombre, p.kind), 'mini');
    const bd = boton('🗑️', async () => { await RC.quitarPool(p.id); pinta(); }, 'mini'); [b, bd].forEach(x => x.style.cssText = 'min-width:0;padding:4px 7px;font-size:15px'); b.title = p.kind === 'snd' ? 'Escuchar' : 'Ver'; bd.title = 'Borrar';
    d.append(pv, tx, sel, b, bd); return d;
  };
  // ---- pintar resumen + lista ----
  const pinta = () => {
    const todos = S.todos; const ok = s => !!RC.estadoHueco(s.key);
    const sn = todos.filter(s => s.kind !== 'img'), im = todos.filter(s => s.kind === 'img');
    const nSn = sn.filter(ok).length, nIm = im.filter(ok).length, nT = nSn + nIm;
    const faltan = sn.filter(s => !ok(s)); const grupos = {}; for (const s of im) { grupos[s.grupo] = grupos[s.grupo] || [0, 0]; grupos[s.grupo][1]++; ok(s) && grupos[s.grupo][0]++; }
    const fIm = Object.entries(grupos).filter(([, v]) => v[0] < v[1]);
    const pool = RC.pool();
    resumen.innerHTML = `<div id="recContador" style="font:900 20px Arial Black,Arial;color:#ffd23a">${nT} de ${todos.length} cargados</div>`
      + `<div>🎵 Sonidos y músicas: <b>${nSn} de ${sn.length}</b> · 🖼️ Imágenes: <b>${nIm} de ${im.length}</b>${pool.length ? ` · ❓ Sin asignar: <b>${pool.length}</b>` : ''}</div>`
      + (RC.usar ? '' : '<div style="color:#ffb0b0">⬜ «Usar mis archivos» está apagado: el juego usa sus propios sonidos y gráficos.</div>')
      + (faltan.length ? `<div id="recFaltanSnd" style="margin-top:6px;color:#ffd0d8">⚠️ Faltan ${faltan.length} sonidos: ${faltan.slice(0, 8).map(s => esc(s.etiqueta)).join(', ')}${faltan.length > 8 ? ` y ${faltan.length - 8} más` : ''}.</div>` : '<div style="margin-top:6px;color:#b0ffc8">✅ No falta ningún sonido.</div>')
      + (fIm.length ? `<div id="recFaltanImg" style="color:#ffd0d8">⚠️ Faltan imágenes: ${fIm.map(([g, v]) => `${esc(g)} (${v[0]}/${v[1]})`).join(', ')}.</div>` : '<div style="color:#b0ffc8">✅ No falta ninguna imagen.</div>')
      + (faltan.length || fIm.length ? '<div style="color:#cfe0ff;font-size:12px">Mientras falten, el juego sintetiza esos sonidos y dibuja sus propios gráficos.</div>' : '');
    if (REC.sucio) { const ap = boton('🔄 Aplicar cambios', () => { recAviso('✅ Cambios aplicados.'); recRecargar(); }, 'sel'); ap.id = 'recAplicar'; ap.style.marginTop = '6px'; resumen.appendChild(ap); }
    lista.innerHTML = '';
    const f = REC.filtro; const pasa = s => f === 'todo' || (f === 'falta' && !ok(s)) || (f === 'ok' && ok(s)) || (f === 'snd' && s.kind !== 'img') || (f === 'img' && s.kind === 'img');
    if (pool.length && (f === 'todo' || f === 'falta')) {
      const dt = document.createElement('details'); dt.open = true; dt.id = 'recPool'; dt.style.cssText = 'background:#2a1a00cc;border:2px solid #ffc21a;border-radius:14px;padding:6px 8px;color:#fff';
      dt.appendChild(el('summary', 'cursor:pointer;font:800 15px Arial;padding:4px', `❓ Sin asignar (${pool.length}): no se reconocieron por su nombre`));
      const c = el('div', 'display:flex;flex-direction:column;gap:5px;margin-top:6px'); pool.slice(0, 150).forEach(p => c.appendChild(filaPool(p))); if (pool.length > 150) c.appendChild(el('p', 'font:12px system-ui', `…y ${pool.length - 150} más.`)); dt.appendChild(c); lista.appendChild(dt);
    }
    const orden = ['Efectos', 'Músicas', 'Cabeceras', 'Duelo', 'Trampilla y caída', 'Monedas', 'Logo, menú y pantallas', 'Huellas', 'Rótulos', 'Relojes', 'Marcadores', 'Oponentes y vidas', 'Preguntas en imagen', 'Otras imágenes'];
    const porG = new Map(); for (const s of todos) { if (!pasa(s)) continue; const g = (s.kind === 'img' ? '🖼️ ' : '🎵 ') + s.grupo; porG.has(g) || porG.set(g, []); porG.get(g).push(s); }
    const gs = [...porG.keys()].sort((a, b) => (a[0] === b[0] ? 0 : a.startsWith('🎵') ? -1 : 1) || orden.indexOf(a.slice(3)) - orden.indexOf(b.slice(3)));
    for (const g of gs) {
      const l = porG.get(g); const n = l.filter(ok).length;
      const dt = document.createElement('details'); dt.style.cssText = 'background:#000a2899;border:1px solid rgba(143,196,255,.4);border-radius:14px;padding:6px 8px;color:#fff'; dt.dataset.grupo = g;
      dt.open = REC.abiertos.has(g); dt.ontoggle = () => { dt.open ? REC.abiertos.add(g) : REC.abiertos.delete(g); if (dt.open && !dt._lleno) llena(); };
      dt.appendChild(el('summary', 'cursor:pointer;font:800 15px Arial;padding:4px', `${esc(g)} <span style="color:${n === l.length ? '#7fff9a' : '#ffd23a'}">${n}/${l.length}</span>`));
      const c = el('div', 'display:flex;flex-direction:column;gap:5px;margin-top:6px'); dt.appendChild(c);
      const llena = () => { dt._lleno = true; l.forEach(s => c.appendChild(fila(s))); }; if (dt.open) llena();
      lista.appendChild(dt);
    }
    if (!gs.length && !(pool.length && (f === 'todo' || f === 'falta'))) lista.appendChild(caja(f === 'falta' ? '✅ ¡No falta nada!' : 'Nada que mostrar.'));
  };
  pinta();
}
window.__rec = { slots: () => RC.slots(), estado: k => RC.estadoHueco(k), pool: () => RC.pool() };
window.__rec.menuH = () => __MANIFEST.sprites.Menu.c[0].f;
window.__rec.decodifica = ab => new Promise((r, j) => F.ctx.decodeAudioData(ab, r, j));
Object.defineProperty(window.__rec, 'audioKey', { get: () => REC.audioKey });
